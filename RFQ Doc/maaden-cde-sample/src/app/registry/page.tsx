import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { ClassChip, LifecycleChip, ComplianceChip, Rev } from "@/components/ui";
import { query } from "@/lib/db";
import RegisterAssetButton from "@/components/RegisterAssetButton";
import RegistryFilters from "@/components/RegistryFilters";

export const dynamic = "force-dynamic";

const LEVEL_INDENT: Record<string, string> = {
  Area: "n1",
  Unit: "n2",
  System: "n3",
  Subsystem: "n4",
};

export default async function Registry({
  searchParams,
}: {
  searchParams: { node?: string; class?: string; q?: string };
}) {
  const nodes = await query(
    `SELECT h.id, h.code, h.name, h.level, h.parent_id FROM cde.plant_hierarchy h ORDER BY h.code`
  );

  const where: string[] = [];
  const args: any[] = [];
  if (searchParams.class) {
    args.push(searchParams.class);
    where.push(`a.asset_class = $${args.length}`);
  }
  if (searchParams.node) {
    args.push(Number(searchParams.node));
    where.push(`a.hierarchy_id IN (
      WITH RECURSIVE down AS (
        SELECT id FROM cde.plant_hierarchy WHERE id = $${args.length}
        UNION ALL
        SELECT h.id FROM cde.plant_hierarchy h JOIN down d ON h.parent_id = d.id
      ) SELECT id FROM down)`);
  }
  if (searchParams.q) {
    args.push(`%${searchParams.q}%`);
    where.push(`(a.tag ILIKE $${args.length} OR a.name ILIKE $${args.length})`);
  }

  const assets = await query(
    `SELECT a.tag, a.asset_class, a.name, a.revision, a.lifecycle,
            pt.name AS product_type, dt.code AS template_code,
            f.severity AS worst_severity, f.family AS worst_family
     FROM cde.assets a
     LEFT JOIN cde.product_types pt ON pt.id = a.product_type_id
     LEFT JOIN cde.data_templates dt ON dt.id = a.template_id
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

  const hasRuns =
    (await query("SELECT 1 FROM cde.validation_runs LIMIT 1")).length > 0;
  const selected = nodes.find((n) => String(n.id) === searchParams.node);

  const keepParams = (nodeId?: number) => {
    const p = new URLSearchParams();
    if (nodeId) p.set("node", String(nodeId));
    if (searchParams.class) p.set("class", searchParams.class);
    if (searchParams.q) p.set("q", searchParams.q);
    const s = p.toString();
    return s ? `/registry?${s}` : "/registry";
  };

  return (
    <>
      <PageHeader title="Asset Registry" actions={<RegisterAssetButton />} />
      <div className="p-6">
        <div className="grid31">
          <div className="card">
            <h3>
              Plant hierarchy <span className="sub">SoW 3.1.3</span>
            </h3>
            <div className="tree">
              <Link href={keepParams()} className={`block n1 ${!selected ? "sel" : ""}`}>
                ▾ All areas
              </Link>
              {nodes.map((n) => (
                <Link
                  key={n.id}
                  href={keepParams(n.id)}
                  className={`block ${LEVEL_INDENT[n.level]} ${
                    String(n.id) === searchParams.node ? "sel" : ""
                  }`}
                >
                  ▸ {n.level === "Area" ? `Area ${n.code}` : n.code} — {n.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="card">
            <h3>
              <span>
                Assets{selected ? ` — ${selected.code} · ${selected.name}` : ""}{" "}
                <span className="sub">{assets.length} tags</span>
              </span>
              <RegistryFilters
                klass={searchParams.class ?? ""}
                q={searchParams.q ?? ""}
                node={searchParams.node ?? ""}
              />
            </h3>
            <table className="data">
              <thead>
                <tr>
                  <th>Tag ID</th>
                  <th>Class</th>
                  <th>Product type</th>
                  <th>Template</th>
                  <th>Rev</th>
                  <th>Lifecycle</th>
                  <th>Compliance</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a) => (
                  <tr key={a.tag}>
                    <td className="mono">
                      <Link href={`/registry/${a.tag}`} className="underline">
                        {a.tag}
                      </Link>
                    </td>
                    <td>
                      <ClassChip klass={a.asset_class} />
                    </td>
                    <td>{a.product_type ?? "—"}</td>
                    <td className="mono">{a.template_code ?? "—"}</td>
                    <td>
                      <Rev rev={a.revision} />
                    </td>
                    <td>
                      <LifecycleChip state={a.lifecycle} />
                    </td>
                    <td>
                      {hasRuns ? (
                        <ComplianceChip
                          severity={a.worst_severity}
                          family={a.worst_family}
                        />
                      ) : (
                        <span className="chip c-info">not validated</span>
                      )}
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="small">
                      No assets match the current filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
