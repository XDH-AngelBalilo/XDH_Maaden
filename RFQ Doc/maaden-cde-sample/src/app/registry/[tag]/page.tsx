import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Rev, LifecycleChip, CdeChip, ClassChip } from "@/components/ui";
import { query, queryOne } from "@/lib/db";
import { getSession, canEdit } from "@/lib/auth";
import PropertyEditor from "@/components/PropertyEditor";
import HierarchyAssign from "@/components/HierarchyAssign";

export const dynamic = "force-dynamic";

export default async function AssetDetail({
  params,
}: {
  params: { tag: string };
}) {
  const tag = decodeURIComponent(params.tag);
  const asset = await queryOne(
    `SELECT a.*, pt.name AS product_type, dt.code AS template_code,
            dt.status AS template_status,
            ph.code AS hierarchy_code, ph.name AS hierarchy_name, ph.level AS hierarchy_level
     FROM cde.assets a
     LEFT JOIN cde.product_types pt ON pt.id = a.product_type_id
     LEFT JOIN cde.data_templates dt ON dt.id = a.template_id
     LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id
     WHERE a.tag = $1`,
    [tag]
  );

  if (!asset) {
    return (
      <>
        <PageHeader title="Asset Detail" />
        <div className="p-6">
          <div className="card">Unknown asset {tag}</div>
        </div>
      </>
    );
  }

  const properties = await query(
    `SELECT p.id AS property_id, p.name, p.datatype, tp.mandatory,
            tp.uom AS template_uom, tp.validation, apv.value, apv.uom, apv.source
     FROM cde.template_properties tp
     JOIN cde.properties p ON p.id = tp.property_id
     LEFT JOIN cde.asset_property_values apv
       ON apv.property_id = tp.property_id AND apv.asset_id = $2
     WHERE tp.template_id = $1 ORDER BY tp.id`,
    [asset.template_id, asset.id]
  );

  const documents = await query(
    `SELECT d.doc_no, d.title, d.doc_type, d.revision, d.cde_state
     FROM cde.documents d
     JOIN cde.document_assets da ON da.document_id = d.id
     WHERE da.asset_id = $1 ORDER BY d.doc_no`,
    [asset.id]
  );

  const revisions = await query(
    `SELECT revision, note, created_by, created_at
     FROM cde.asset_revisions WHERE asset_id = $1 ORDER BY id DESC`,
    [asset.id]
  );

  const findings = await query(
    `SELECT f.family, f.severity, f.message
     FROM cde.validation_findings f
     WHERE f.asset_id = $1 AND f.run_id = (SELECT max(id) FROM cde.validation_runs)`,
    [asset.id]
  );

  const publishes = await query(
    `SELECT pe.status, pe.created_at, pt.system_name, pt.family
     FROM cde.publish_events pe
     JOIN cde.publish_targets pt ON pt.id = pe.target_id
     WHERE pe.asset_id = $1 ORDER BY pe.id DESC LIMIT 8`,
    [asset.id]
  );

  const hasRun =
    (await query("SELECT 1 FROM cde.validation_runs LIMIT 1")).length > 0;

  const nodes = await query(
    "SELECT id, code, name, level FROM cde.plant_hierarchy ORDER BY code"
  );

  const user = getSession();
  const editable = canEdit(user.role);

  // per-family status from latest run
  const famStatus = (fam: string) => {
    const fs = findings.filter((f) => f.family === fam);
    if (!hasRun) return <span className="chip c-info">not run</span>;
    if (fs.some((f) => f.severity === "fail"))
      return <span className="chip c-err">Fail</span>;
    if (fs.length) return <span className="chip c-warn">Warn</span>;
    return <span className="chip c-ok">Pass</span>;
  };

  // property-level check vs findings
  const propCheck = (p: any) => {
    if (!hasRun) return <span className="chip c-info">—</span>;
    const hit = findings.find((f) => f.message.includes(p.name));
    if (hit)
      return (
        <span className={`chip ${hit.severity === "fail" ? "c-err" : "c-warn"}`}>
          {hit.severity === "fail" ? "✗" : "⚠"}
        </span>
      );
    if (!p.mandatory && (p.value === null || p.value === ""))
      return <span className="chip c-info">optional</span>;
    return <span className="chip c-ok">✓</span>;
  };

  return (
    <>
      <PageHeader
        title={`Asset Detail — ${asset.tag}`}
        crumb={`ARGP › Registry › ${asset.hierarchy_code ?? "unassigned"} › ${asset.tag}`}
      />
      <div className="p-6">
        {asset.tag === "EQP-000789" && (
          <div className="note">
            Demo asset from client vision image 2 — the Pump Package with governed
            properties.
          </div>
        )}
        <div className="two">
          <div>
            <div className="card">
              <h3>
                <span>
                  {asset.tag} — {asset.name} <Rev rev={`Rev ${asset.revision}`} />{" "}
                  <ClassChip klass={asset.asset_class} />
                </span>
                <span className="sub">
                  {asset.hierarchy_code
                    ? `${asset.hierarchy_code} · ${asset.hierarchy_name}`
                    : "no hierarchy node"}{" "}
                  · {asset.template_code ?? "no template"}
                </span>
              </h3>
              <table className="data props">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Value</th>
                    <th>UoM</th>
                    <th>Source</th>
                    <th>vs Template</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p.property_id}>
                      <td>
                        {p.name}
                        {p.mandatory && <span className="text-err"> *</span>}
                      </td>
                      {editable ? (
                        <PropertyEditor
                          tag={asset.tag}
                          propertyId={p.property_id}
                          value={p.value}
                          uom={p.uom ?? p.template_uom}
                          templateUom={p.template_uom}
                        />
                      ) : (
                        <>
                          <td>{p.value ?? <span className="small">—</span>}</td>
                          <td>{p.uom ?? p.template_uom ?? "—"}</td>
                        </>
                      )}
                      <td className="small">{p.source ?? "—"}</td>
                      <td>{propCheck(p)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editable && (
                <div className="small mt-2">
                  * mandatory. Edit a value and press Enter to save — data changes
                  return the asset to Data Loaded until re-validated.
                </div>
              )}
            </div>
            <div className="card">
              <h3>
                Linked documents <span className="sub">CDE state per ISO 19650</span>
              </h3>
              <table className="data">
                <thead>
                  <tr>
                    <th>Doc No</th>
                    <th>Type</th>
                    <th>Rev</th>
                    <th>CDE state</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((d) => (
                    <tr key={d.doc_no}>
                      <td className="mono">{d.doc_no}</td>
                      <td>{d.doc_type}</td>
                      <td>
                        <Rev rev={d.revision} />
                      </td>
                      <td>
                        <CdeChip state={d.cde_state} />
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={4} className="small">
                        No linked documents.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className="card">
              <h3>Status</h3>
              <table className="data">
                <tbody>
                  <tr>
                    <td>Lifecycle</td>
                    <td>
                      <LifecycleChip state={asset.lifecycle} />
                    </td>
                  </tr>
                  <tr>
                    <td>Template status</td>
                    <td>
                      <span
                        className={`chip ${asset.template_status === "Approved" ? "c-ok" : "c-warn"}`}
                      >
                        {asset.template_status ?? "—"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              {editable && (
                <HierarchyAssign
                  tag={asset.tag}
                  current={asset.hierarchy_id}
                  nodes={nodes}
                />
              )}
            </div>
            <div className="card">
              <h3>Validation status</h3>
              <table className="data">
                <tbody>
                  <tr>
                    <td>Framework</td>
                    <td>{famStatus("framework")}</td>
                  </tr>
                  <tr>
                    <td>Data quality</td>
                    <td>{famStatus("quality")}</td>
                  </tr>
                  <tr>
                    <td>Technical &amp; market</td>
                    <td>{famStatus("technical")}</td>
                  </tr>
                </tbody>
              </table>
              <div className="small mt-2">
                <Link href="/compliance" className="underline">
                  Run validation in the Compliance Centre →
                </Link>
              </div>
            </div>
            <div className="card">
              <h3>Revision history</h3>
              <table className="data">
                <tbody>
                  {revisions.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <Rev rev={r.revision} />
                      </td>
                      <td className="small">
                        {r.note} — {r.created_by}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <h3>Publish status</h3>
              <table className="data">
                <tbody>
                  {publishes.map((p, i) => (
                    <tr key={i}>
                      <td>{p.family}</td>
                      <td>
                        <span
                          className={`chip ${
                            p.status === "sent"
                              ? "c-ok"
                              : p.status === "blocked"
                                ? "c-err"
                                : "c-info"
                          }`}
                        >
                          {p.status === "sent"
                            ? "Sent"
                            : p.status === "blocked"
                              ? "Blocked"
                              : "Queued"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {publishes.length === 0 && (
                    <tr>
                      <td className="small" colSpan={2}>
                        Not yet published.{" "}
                        <Link href="/publish" className="underline">
                          Publish Hub →
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
