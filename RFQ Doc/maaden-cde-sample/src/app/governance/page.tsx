import PageHeader from "@/components/PageHeader";
import { query } from "@/lib/db";
import { getSession, canApprove } from "@/lib/auth";
import TemplateStatusControl from "@/components/TemplateStatusControl";
import { tServer } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Governance() {
  const standards = await query(
    `SELECT s.code, s.title, s.revision,
            (SELECT count(*)::int FROM cde.standard_template st WHERE st.standard_id = s.id) AS templates_derived
     FROM cde.standards s ORDER BY s.code`
  );
  const templates = await query(
    `SELECT dt.code, dt.revision, dt.status, pt.name AS product_type
     FROM cde.data_templates dt
     JOIN cde.product_types pt ON pt.id = dt.product_type_id ORDER BY dt.code`
  );
  const auditRows = await query(
    `SELECT actor, action, entity, entity_id, after, at
     FROM cde.audit_log ORDER BY id DESC LIMIT 15`
  );
  const user = getSession();
  const approver = canApprove(user.role);

  return (
    <>
      <PageHeader title={tServer().t("title.governance")} />
      <div className="p-6">
        <div className="grid2">
          <div className="card">
            <h3>Approval workflow</h3>
            <div className="flowrow">
              <div className="flowstep">
                <b>DRAFT</b>Discipline engineer
              </div>
              <div className="flowstep">
                <b>REVIEW</b>Lead + Data Governance
              </div>
              <div className="flowstep">
                <b>APPROVED</b>Doc Controller records
              </div>
              <div className="flowstep">
                <b>PUBLISHED</b>Downstream systems
              </div>
            </div>
            <div className="small" style={{ marginTop: 10 }}>
              Any property change after Approved ⇒ new revision + re-validation
              (immutable audit, SoW 3.1.4).
            </div>
            <table className="data" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Template</th>
                  <th>Product type</th>
                  <th>Rev</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((t) => (
                  <tr key={t.code}>
                    <td className="mono">{t.code}</td>
                    <td>{t.product_type}</td>
                    <td>
                      <span className="badge-rev">{t.revision}</span>
                    </td>
                    <td>
                      {approver ? (
                        <TemplateStatusControl code={t.code} status={t.status} />
                      ) : (
                        <span
                          className={`chip ${t.status === "Approved" ? "c-ok" : "c-warn"}`}
                        >
                          {t.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>Roles (RBAC)</h3>
            <table className="data">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Rights</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Data Governance Lead</td>
                  <td className="small">templates, rules, approve, publish</td>
                </tr>
                <tr>
                  <td>Discipline Engineer</td>
                  <td className="small">create/edit asset data</td>
                </tr>
                <tr>
                  <td>Document Controller</td>
                  <td className="small">docs, revisions, transmittals</td>
                </tr>
                <tr>
                  <td>Viewer / Downstream</td>
                  <td className="small">read + API</td>
                </tr>
              </tbody>
            </table>
            <div className="small" style={{ marginTop: 8 }}>
              Production: Azure AD / ADFS SSO + MFA (SoW mandate). Sample: JWT role
              switcher in the sidebar — try Viewer and watch mutations get denied.
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Standards register</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Rev</th>
                <th>Templates derived</th>
              </tr>
            </thead>
            <tbody>
              {standards.map((s) => (
                <tr key={s.code}>
                  <td className="mono">{s.code}</td>
                  <td>{s.title}</td>
                  <td>{s.revision}</td>
                  <td>{s.templates_derived}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Audit trail (latest)</h3>
          <table className="data">
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Entity</th>
              </tr>
            </thead>
            <tbody>
              {auditRows.map((a, i) => (
                <tr key={i}>
                  <td className="small">
                    {new Date(a.at).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{a.actor}</td>
                  <td className="small mono">{a.action}</td>
                  <td className="small">
                    {a.entity} {a.entity_id ?? ""}
                  </td>
                </tr>
              ))}
              {auditRows.length === 0 && (
                <tr>
                  <td colSpan={4} className="small">
                    No audit entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
