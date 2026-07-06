import { query, queryOne } from "./db";
import { audit } from "./audit";
import type { Finding, RuleFamily, Severity } from "./types";

const TAG_PATTERN = /^(STR|ELE|EQP|MAT)-\d{6}$/;

interface RuleRow {
  id: number;
  family: RuleFamily;
  name: string;
  expression: any;
  severity: Severity;
}

interface AssetRow {
  id: number;
  tag: string;
  asset_class: string;
  name: string;
  template_id: number | null;
  template_status: string | null;
  hierarchy_id: number | null;
  hierarchy_level: string | null;
  lifecycle: string;
}

interface TplPropRow {
  template_id: number;
  property_id: number;
  prop_name: string;
  datatype: string;
  mandatory: boolean;
  uom: string | null;
  validation: any;
}

interface ValueRow {
  asset_id: number;
  property_id: number;
  value: string | null;
  uom: string | null;
}

export interface RunResult {
  run_id: number;
  assets_checked: number;
  pass_count: number;
  warn_count: number;
  fail_count: number;
  findings: (Finding & { tag: string })[];
}

/**
 * Executes the 3-family rule engine over all assets, writes
 * validation_runs + validation_findings, and moves lifecycle:
 * zero fails (warnings allowed) and lifecycle 'Data Loaded' → 'Validated';
 * any fail on a 'Validated' asset → back to 'Data Loaded'.
 * Published assets are immutable and never downgraded.
 */
export async function runValidation(actor: string): Promise<RunResult> {
  const rules = await query<RuleRow>(
    "SELECT id, family, name, expression, severity FROM cde.validation_rules WHERE active"
  );
  const assets = await query<AssetRow>(
    `SELECT a.id, a.tag, a.asset_class, a.name, a.template_id, dt.status AS template_status,
            a.hierarchy_id, ph.level AS hierarchy_level, a.lifecycle
     FROM cde.assets a
     LEFT JOIN cde.data_templates dt ON dt.id = a.template_id
     LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id`
  );
  const tplProps = await query<TplPropRow>(
    `SELECT tp.template_id, tp.property_id, p.name AS prop_name, p.datatype,
            tp.mandatory, tp.uom, tp.validation
     FROM cde.template_properties tp
     JOIN cde.properties p ON p.id = tp.property_id`
  );
  const values = await query<ValueRow>(
    "SELECT asset_id, property_id, value, uom FROM cde.asset_property_values"
  );

  const propsByTemplate = new Map<number, TplPropRow[]>();
  for (const tp of tplProps) {
    const arr = propsByTemplate.get(tp.template_id) ?? [];
    arr.push(tp);
    propsByTemplate.set(tp.template_id, arr);
  }
  const valuesByAsset = new Map<number, Map<number, ValueRow>>();
  for (const v of values) {
    const m = valuesByAsset.get(v.asset_id) ?? new Map();
    m.set(v.property_id, v);
    valuesByAsset.set(v.asset_id, m);
  }
  const tagCounts = new Map<string, number>();
  for (const a of assets) tagCounts.set(a.tag, (tagCounts.get(a.tag) ?? 0) + 1);

  const findings: (Finding & { tag: string })[] = [];
  const add = (
    asset: AssetRow,
    rule: RuleRow,
    message: string,
    severity: Severity = rule.severity
  ) =>
    findings.push({
      asset_id: asset.id,
      tag: asset.tag,
      rule_id: rule.id,
      family: rule.family,
      severity,
      message,
    });

  for (const asset of assets) {
    const tpl = asset.template_id
      ? propsByTemplate.get(asset.template_id) ?? []
      : [];
    const vals = valuesByAsset.get(asset.id) ?? new Map<number, ValueRow>();

    for (const rule of rules) {
      const check = rule.expression?.check;
      switch (check) {
        case "has_template":
          if (!asset.template_id)
            add(asset, rule, "No data template assigned");
          break;

        case "mandatory_populated":
          if (!asset.template_id) break;
          for (const tp of tpl) {
            if (!tp.mandatory) continue;
            const v = vals.get(tp.property_id);
            if (!v || v.value === null || v.value.trim() === "") {
              add(
                asset,
                rule,
                `Mandatory property "${tp.prop_name}" not populated`
              );
            }
          }
          break;

        case "hierarchy_assigned":
          if (!asset.hierarchy_id) {
            add(asset, rule, "No plant hierarchy node assigned");
          } else if (asset.hierarchy_level !== "Subsystem") {
            add(asset, rule, "Tag not yet assigned to subsystem node");
          }
          break;

        case "tag_format": {
          const pattern = rule.expression.pattern
            ? new RegExp(rule.expression.pattern)
            : TAG_PATTERN;
          if (!pattern.test(asset.tag))
            add(asset, rule, `Tag "${asset.tag}" does not match {CLASS}-{6 digits}`);
          break;
        }

        case "unique_tag":
          if ((tagCounts.get(asset.tag) ?? 0) > 1)
            add(asset, rule, `Duplicate tag "${asset.tag}"`);
          break;

        case "uom_matches":
          for (const tp of tpl) {
            if (!tp.uom) continue;
            const v = vals.get(tp.property_id);
            if (v && v.value !== null && v.uom && v.uom !== tp.uom) {
              add(
                asset,
                rule,
                `UoM mismatch: ${tp.prop_name} given in "${v.uom}", template requires "${tp.uom}"`
              );
            }
          }
          break;

        case "datatype":
          for (const tp of tpl) {
            const v = vals.get(tp.property_id);
            if (!v || v.value === null || v.value.trim() === "") continue;
            if (tp.datatype === "number" && isNaN(Number(v.value))) {
              add(
                asset,
                rule,
                `${tp.prop_name}: "${v.value}" is not a valid number`
              );
            }
            if (
              tp.datatype === "boolean" &&
              !["true", "false", "yes", "no"].includes(v.value.toLowerCase())
            ) {
              add(
                asset,
                rule,
                `${tp.prop_name}: "${v.value}" is not a valid boolean`
              );
            }
          }
          break;

        case "template_range":
          for (const tp of tpl) {
            if (tp.validation?.check !== "range") continue;
            const v = vals.get(tp.property_id);
            if (!v || v.value === null || v.value.trim() === "") continue;
            // Range compares in template UoM; a UoM mismatch is already
            // reported by uom_matches, so skip to avoid a misleading finding.
            if (tp.uom && v.uom && v.uom !== tp.uom) continue;
            const n = Number(v.value);
            if (isNaN(n)) continue;
            const { min, max } = tp.validation;
            if ((min !== undefined && n < min) || (max !== undefined && n > max)) {
              add(
                asset,
                rule,
                `${tp.prop_name} = ${n} outside template range [${min ?? "−∞"}, ${max ?? "∞"}]`
              );
            }
          }
          break;

        case "template_enum":
          for (const tp of tpl) {
            if (tp.validation?.check !== "enum") continue;
            const v = vals.get(tp.property_id);
            if (!v || v.value === null || v.value.trim() === "") continue;
            const allowed: string[] = tp.validation.values ?? [];
            if (!allowed.includes(v.value)) {
              add(
                asset,
                rule,
                `${tp.prop_name} "${v.value}" not in approved list {${allowed.join(", ")}}`
              );
            }
          }
          break;

        case "standard_limit":
          for (const tp of tpl) {
            if (tp.validation?.check !== "standard_limit") continue;
            const v = vals.get(tp.property_id);
            if (!v || v.value === null || v.value.trim() === "") continue;
            const n = Number(v.value);
            if (isNaN(n)) continue;
            const { op, value: limit, standard } = tp.validation;
            const ok =
              op === ">=" ? n >= limit :
              op === "<=" ? n <= limit :
              op === ">"  ? n > limit :
              op === "<"  ? n < limit : n === limit;
            if (!ok) {
              add(
                asset,
                rule,
                `${tp.prop_name} ${n} ${v.uom ?? ""} violates ${standard ?? "standard"} limit (${op} ${limit})`.trim()
              );
            }
          }
          break;

        default:
          break;
      }
    }
  }

  // Persist run + findings
  const failAssets = new Set(
    findings.filter((f) => f.severity === "fail").map((f) => f.asset_id)
  );
  const warnAssets = new Set(
    findings.filter((f) => f.severity === "warn").map((f) => f.asset_id)
  );
  const passCount = assets.filter(
    (a) => !failAssets.has(a.id) && !warnAssets.has(a.id)
  ).length;

  const run = await queryOne<{ id: number }>(
    `INSERT INTO cde.validation_runs
       (ruleset_version, finished_at, assets_checked, pass_count, warn_count, fail_count)
     VALUES ('v1.0', now(), $1, $2, $3, $4) RETURNING id`,
    [assets.length, passCount, warnAssets.size, failAssets.size]
  );
  const runId = run!.id;

  for (const f of findings) {
    await query(
      `INSERT INTO cde.validation_findings (run_id, asset_id, rule_id, family, severity, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [runId, f.asset_id, f.rule_id, f.family, f.severity, f.message]
    );
  }

  // Lifecycle transitions
  for (const a of assets) {
    if (a.lifecycle === "Published") continue; // immutable
    if (!failAssets.has(a.id) && a.lifecycle === "Data Loaded") {
      await query("UPDATE cde.assets SET lifecycle = 'Validated' WHERE id = $1", [a.id]);
    } else if (failAssets.has(a.id) && a.lifecycle === "Validated") {
      await query("UPDATE cde.assets SET lifecycle = 'Data Loaded' WHERE id = $1", [a.id]);
    }
  }

  await audit(actor, "validation.run", "validation_runs", runId, null, {
    assets_checked: assets.length,
    pass: passCount,
    warn: warnAssets.size,
    fail: failAssets.size,
  });

  return {
    run_id: runId,
    assets_checked: assets.length,
    pass_count: passCount,
    warn_count: warnAssets.size,
    fail_count: failAssets.size,
    findings,
  };
}

/** Latest run summary + open findings (for dashboard / compliance centre). */
export async function latestRun() {
  return queryOne(
    `SELECT id, ruleset_version, started_at, finished_at,
            assets_checked, pass_count, warn_count, fail_count
     FROM cde.validation_runs ORDER BY id DESC LIMIT 1`
  );
}

export async function openFindings(runId?: number) {
  const id =
    runId ??
    (await queryOne<{ id: number }>(
      "SELECT id FROM cde.validation_runs ORDER BY id DESC LIMIT 1"
    ))?.id;
  if (!id) return [];
  return query(
    `SELECT f.id, f.asset_id, a.tag, a.name AS asset_name, f.family, f.severity,
            f.message, f.resolved, r.name AS rule_name
     FROM cde.validation_findings f
     JOIN cde.assets a ON a.id = f.asset_id
     JOIN cde.validation_rules r ON r.id = f.rule_id
     WHERE f.run_id = $1
     ORDER BY CASE f.severity WHEN 'fail' THEN 0 ELSE 1 END, a.tag`,
    [id]
  );
}
