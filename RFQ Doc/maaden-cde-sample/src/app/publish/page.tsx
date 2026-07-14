import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { query } from "@/lib/db";
import PublishPanel from "@/components/PublishPanel";
import PublishQueue from "@/components/PublishQueue";
import { tServer } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const SAT_POS: Record<string, React.CSSProperties> = {
  "Engineering Management": { top: 0, left: "14%" },
  "Document Management": { top: 0, right: "14%" },
  "Field & Data Acquisition": { top: "40%", right: 0 },
  "Analytics & Reporting": { bottom: 0, right: "14%" },
  "Geospatial & Mine Planning": { bottom: 0, left: "14%" },
  "Operational & Relational DBs": { top: "40%", left: 0 },
};

const FAMILIES = Object.keys(SAT_POS);

export default async function PublishHub({
  searchParams,
}: {
  searchParams: { family?: string };
}) {
  const selected =
    searchParams.family && FAMILIES.includes(searchParams.family)
      ? searchParams.family
      : null;

  const targets = await query(
    "SELECT id, system_name, family, protocol, status FROM cde.publish_targets ORDER BY id"
  );
  const events = await query(
    `SELECT pe.id, pe.status, pe.created_at, pe.payload, pe.payload_sha256,
            a.tag, pt.system_name, pt.family
     FROM cde.publish_events pe
     JOIN cde.assets a ON a.id = pe.asset_id
     JOIN cde.publish_targets pt ON pt.id = pe.target_id
     ${selected ? "WHERE pt.family = $1" : ""}
     ORDER BY pe.id DESC LIMIT 25`,
    selected ? [selected] : []
  );
  const publishable = await query(
    `SELECT a.tag, a.name, a.lifecycle FROM cde.assets a
     JOIN cde.data_templates dt ON dt.id = a.template_id AND dt.status = 'Approved'
     WHERE a.lifecycle IN ('Validated','Published') ORDER BY a.tag`
  );

  const familyStatus = (family: string) => {
    const ts = targets.filter((t) => t.family === family);
    if (ts.some((t) => t.status === "connected")) return "connected";
    if (ts.some((t) => t.status === "queued")) return "queued";
    return "planned";
  };

  const familyTargets = selected
    ? targets.filter((t) => t.family === selected)
    : [];

  return (
    <>
      <PageHeader title={tServer().t("title.publish")} />
      <div className="p-6">
        <div className="note">
          Client vision image 4 — CDE at the centre, publishing governed asset data
          to 6 system families. Click a family in the map to drill into its target
          systems and publish activity. Sample uses a publish simulator; production
          covers the 10 Master Roadmap integrations: Aconex · Primavera P6 · SAP
          S/4HANA · AVEVA PI · MS EPM · Azure AD · ADFS · SIEM · Outlook · ServiceNow.
        </div>
        <div className="grid2">
          <div>
            <div className="card">
              <h3>
                <span>Integration map</span>
                <span className="sub">click a system family</span>
              </h3>
              <div className="hub">
                <div className="core">
                  CDE<span>asset data backbone</span>
                </div>
                {FAMILIES.map((f) => {
                  const st = familyStatus(f);
                  const isSel = f === selected;
                  return (
                    <Link
                      key={f}
                      href={isSel ? "/publish" : `/publish?family=${encodeURIComponent(f)}`}
                      className={`sat sat-link${isSel ? " sat-sel" : ""}`}
                      style={SAT_POS[f]}
                    >
                      <b>{f.replace("Field & Data Acquisition", "Field & Data Acq.")}</b>
                      <span
                        className={`st chip ${
                          st === "connected" ? "c-ok" : st === "queued" ? "c-warn" : "c-info"
                        }`}
                      >
                        {st}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {selected && (
              <div className="card">
                <h3>
                  <span>
                    {selected} <span className="sub">{familyTargets.length} target system(s)</span>
                  </span>
                  <Link href="/publish" className="btn">
                    ← All families
                  </Link>
                </h3>
                <table className="data">
                  <thead>
                    <tr>
                      <th>System</th>
                      <th>Protocol</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyTargets.map((t) => (
                      <tr key={t.id}>
                        <td>{t.system_name}</td>
                        <td className="small">{t.protocol}</td>
                        <td>
                          <span
                            className={`chip ${
                              t.status === "connected"
                                ? "c-ok"
                                : t.status === "queued"
                                  ? "c-warn"
                                  : "c-info"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <PublishPanel
              targets={targets}
              publishable={publishable.map((p) => ({
                tag: p.tag,
                label: `${p.tag} — ${p.name} (${p.lifecycle})`,
              }))}
            />
          </div>
          <div>
            <PublishQueue events={events} family={selected} />
            <div className="card">
              <h3>
                API access <span className="sub">REST · OpenAPI · keys per SoW 3.4.4</span>
              </h3>
              <table className="data">
                <tbody>
                  <tr>
                    <td className="mono">GET /api/v1/assets/{"{tag}"}</td>
                    <td>
                      <span className="chip c-ok">live</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="mono">GET /api/v1/templates/{"{code}"}</td>
                    <td>
                      <span className="chip c-ok">live</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="mono">POST /api/v1/publish</td>
                    <td>
                      <span className="chip c-ok">live</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="mono">
                      <a href="/api/v1/openapi.json" className="underline" target="_blank">
                        GET /api/v1/openapi.json
                      </a>
                    </td>
                    <td>
                      <span className="chip c-ok">spec</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="small mt-2">
                Production: WAF + API gateway, per-system API keys, logs to Azure
                Sentinel SIEM.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
