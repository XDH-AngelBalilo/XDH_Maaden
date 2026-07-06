import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Rev, LifecycleChip } from "@/components/ui";
import { query, queryOne } from "@/lib/db";

export const dynamic = "force-dynamic";

function ruleText(v: any, uom: string | null): string {
  if (!v) return "—";
  switch (v.check) {
    case "range":
      return `${v.min ?? "−∞"} ≤ x ≤ ${v.max ?? "∞"}${uom ? " " + uom : ""}`;
    case "enum":
      return `∈ {${(v.values ?? []).join(", ")}}`;
    case "standard_limit":
      return `${v.op} ${v.value} (${v.standard})`;
    case "uom_matches":
      return `UoM = ${uom}`;
    default:
      return v.check;
  }
}

export default async function TemplateLibrary({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const tree = await query(
    `SELECT s.code AS standard_code, s.title AS standard_title,
            pt.name AS product_type, pt.asset_class, dt.code AS template_code
     FROM cde.standards s
     JOIN cde.standard_product_type spt ON spt.standard_id = s.id
     JOIN cde.product_types pt ON pt.id = spt.product_type_id
     LEFT JOIN cde.data_templates dt ON dt.product_type_id = pt.id
     ORDER BY s.code, pt.name`
  );

  const code = searchParams.code ?? "DT-EQP-PUMP-001";
  const tpl = await queryOne(
    `SELECT dt.id, dt.code, dt.revision, dt.status,
            pt.name AS product_type, pt.asset_class,
            (SELECT string_agg(s.code, ' + ') FROM cde.standard_template st
              JOIN cde.standards s ON s.id = st.standard_id
              WHERE st.template_id = dt.id) AS standards
     FROM cde.data_templates dt
     JOIN cde.product_types pt ON pt.id = dt.product_type_id
     WHERE dt.code = $1 ORDER BY dt.revision DESC LIMIT 1`,
    [code]
  );

  const properties = tpl
    ? await query(
        `SELECT p.name, p.datatype, tp.mandatory, tp.uom, tp.validation
         FROM cde.template_properties tp
         JOIN cde.properties p ON p.id = tp.property_id
         WHERE tp.template_id = $1 ORDER BY tp.id`,
        [tpl.id]
      )
    : [];

  const instances = tpl
    ? await query(
        `SELECT a.tag, a.revision, a.lifecycle, ph.code AS hcode, ph.name AS hname
         FROM cde.assets a
         LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id
         WHERE a.template_id = $1 ORDER BY a.tag`,
        [tpl.id]
      )
    : [];

  // group tree rows by standard
  const standards = new Map<string, { title: string; types: typeof tree }>();
  for (const row of tree) {
    const g = standards.get(row.standard_code) ?? { title: row.standard_title, types: [] as any };
    g.types.push(row);
    standards.set(row.standard_code, g);
  }

  return (
    <>
      <PageHeader title="Data Template Library" />
      <div className="p-6">
        <div className="grid31">
          <div className="card">
            <h3>Standards › Product Types</h3>
            <div className="tree">
              {[...standards.entries()].map(([sCode, g]) => (
                <div key={sCode}>
                  <div className="n1">
                    ▾ {sCode} — {g.title.length > 32 ? g.title.slice(0, 32) + "…" : g.title}
                  </div>
                  {g.types.map((t: any) =>
                    t.template_code ? (
                      <Link
                        key={`${sCode}-${t.product_type}`}
                        href={`/templates?code=${t.template_code}`}
                        className={`block n2 ${t.template_code === code ? "sel" : ""}`}
                        style={{ paddingLeft: 16 }}
                      >
                        ▸ {t.product_type} ({t.asset_class})
                      </Link>
                    ) : (
                      <div key={`${sCode}-${t.product_type}`} className="n2">
                        ▸ {t.product_type} ({t.asset_class}) <span className="small">no template</span>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            {tpl ? (
              <>
                <div className="card">
                  <h3>
                    <span>
                      {tpl.code}{" "}
                      <Rev rev={`Rev ${tpl.revision} · ${tpl.status}`} />
                    </span>
                    <span className="sub">defined by {tpl.standards ?? "—"}</span>
                  </h3>
                  <table className="data props">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Datatype</th>
                        <th>UoM</th>
                        <th>Mandatory</th>
                        <th>Validation rule</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((p) => (
                        <tr key={p.name}>
                          <td>{p.name}</td>
                          <td>{p.datatype}</td>
                          <td>{p.uom ?? "—"}</td>
                          <td>
                            <span className={`chip ${p.mandatory ? "c-err" : "c-info"}`}>
                              {p.mandatory ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="mono">{ruleText(p.validation, p.uom)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="card">
                  <h3>
                    Instances using this template{" "}
                    <span className="sub">{instances.length} assets</span>
                  </h3>
                  <table className="data">
                    <thead>
                      <tr>
                        <th>Tag</th>
                        <th>Location</th>
                        <th>Rev</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instances.map((i) => (
                        <tr key={i.tag}>
                          <td className="mono">
                            <Link href={`/registry/${i.tag}`} className="underline">
                              {i.tag}
                            </Link>
                          </td>
                          <td>
                            {i.hcode} — {i.hname}
                          </td>
                          <td>
                            <Rev rev={i.revision} />
                          </td>
                          <td>
                            <LifecycleChip state={i.lifecycle} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="card">Unknown template {code}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
