import { NextRequest } from "next/server";
import { query, queryOne } from "@/lib/db";
import { ok, err, requireRole } from "@/lib/api";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const TAG_PATTERN = /^(STR|ELE|EQP|MAT)-\d{6}$/;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const klass = sp.get("class");
  const hierarchy = sp.get("hierarchy"); // node id — includes descendants
  const q = sp.get("q");

  const where: string[] = [];
  const args: any[] = [];
  if (klass) {
    args.push(klass);
    where.push(`a.asset_class = $${args.length}`);
  }
  if (hierarchy) {
    args.push(Number(hierarchy));
    where.push(`a.hierarchy_id IN (
      WITH RECURSIVE down AS (
        SELECT id FROM cde.plant_hierarchy WHERE id = $${args.length}
        UNION ALL
        SELECT h.id FROM cde.plant_hierarchy h JOIN down d ON h.parent_id = d.id
      ) SELECT id FROM down)`);
  }
  if (q) {
    args.push(`%${q}%`);
    where.push(`(a.tag ILIKE $${args.length} OR a.name ILIKE $${args.length})`);
  }

  const rows = await query(
    `SELECT a.id, a.tag, a.asset_class, a.name, a.revision, a.lifecycle,
            pt.name AS product_type, dt.code AS template_code,
            ph.code AS hierarchy_code, ph.name AS hierarchy_name,
            f.severity AS worst_finding, f.family AS finding_family
     FROM cde.assets a
     LEFT JOIN cde.product_types pt ON pt.id = a.product_type_id
     LEFT JOIN cde.data_templates dt ON dt.id = a.template_id
     LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id
     LEFT JOIN LATERAL (
       SELECT vf.severity, vf.family FROM cde.validation_findings vf
       WHERE vf.asset_id = a.id AND NOT vf.resolved
         AND vf.run_id = (SELECT max(id) FROM cde.validation_runs)
       ORDER BY CASE vf.severity WHEN 'fail' THEN 0 ELSE 1 END LIMIT 1
     ) f ON TRUE
     ${where.length ? "WHERE " + where.join(" AND ") : ""}
     ORDER BY a.tag`,
    args
  );
  return ok(rows);
}

/** Register a new asset (lifecycle starts at Registered). */
export async function POST(req: NextRequest) {
  const gate = requireRole("edit");
  if ("deny" in gate) return gate.deny;

  const body = await req.json().catch(() => ({}));
  const { tag, name, asset_class, product_type_id, template_id, hierarchy_id } = body;
  if (!tag || !name || !asset_class) {
    return err("tag, name, asset_class required");
  }
  if (!TAG_PATTERN.test(tag)) {
    return err("tag must match {STR|ELE|EQP|MAT}-{6 digits}");
  }
  const dup = await queryOne("SELECT id FROM cde.assets WHERE tag = $1", [tag]);
  if (dup) return err(`Tag ${tag} already registered`, 409);

  const row = await queryOne(
    `INSERT INTO cde.assets (tag, asset_class, name, product_type_id, template_id, hierarchy_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [tag, asset_class, name, product_type_id ?? null, template_id ?? null, hierarchy_id ?? null]
  );
  await query(
    "INSERT INTO cde.asset_revisions (asset_id, revision, note, created_by) VALUES ($1, '0', 'Registered', $2)",
    [row.id, gate.user.username]
  );
  await audit(gate.user.username, "asset.register", "assets", tag, null, row);
  return ok(row, 201);
}
