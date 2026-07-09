import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Bar } from "@/components/ui";
import { query, queryOne } from "@/lib/db";
import { latestRun } from "@/lib/validation";
import { tServer } from "@/lib/i18n";
import type { Lifecycle } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const { locale, t } = tServer();
  const counts = await queryOne(
    `SELECT
       (SELECT count(*)::int FROM cde.assets) AS assets,
       (SELECT count(*)::int FROM cde.assets WHERE lifecycle = 'Published') AS published,
       (SELECT count(*)::int FROM cde.assets WHERE template_id IS NOT NULL) AS templated,
       (SELECT count(DISTINCT pt.family)::int FROM cde.publish_events pe
          JOIN cde.publish_targets pt ON pt.id = pe.target_id WHERE pe.status = 'sent') AS target_families`
  );
  const lifecycle = await query(
    `SELECT lifecycle, count(*)::int AS n FROM cde.assets GROUP BY lifecycle`
  );
  const run = await latestRun();
  const findingsByFamily = run
    ? await query(
        `SELECT family,
                count(*) FILTER (WHERE severity = 'fail')::int AS fails,
                count(*) FILTER (WHERE severity = 'warn')::int AS warns
         FROM cde.validation_findings WHERE run_id = $1 GROUP BY family`,
        [run.id]
      )
    : [];

  const byState = (s: string) => lifecycle.find((l) => l.lifecycle === s)?.n ?? 0;
  const coverage = counts.assets
    ? Math.round((counts.templated / counts.assets) * 100)
    : 0;
  const passRate = run
    ? Math.round(
        ((run.assets_checked - run.fail_count) / run.assets_checked) * 1000
      ) / 10
    : null;

  const FAMILY_SUB: Record<string, string> = {
    framework: "missing mandatory props / hierarchy",
    quality: "UoM & range issues",
    technical: "values outside standard limits",
  };

  const states: [Lifecycle, string | undefined][] = [
    ["Registered", undefined],
    ["Data Loaded", undefined],
    ["Validated", "o"],
    ["Published", "g"],
  ];

  return (
    <>
      <PageHeader
        title={t("dash.title")}
        actions={
          <Link href="/registry" className="btn gold">
            {t("btn.registerAsset")}
          </Link>
        }
      />
      <div className="p-6">
        <div className="kpis">
          <div className="kpi">
            <div className="v">{counts.assets.toLocaleString()}</div>
            <div className="l">{t("kpi.assets")}</div>
            <div className="d">
              <span className="chip c-info">{t("kpi.assetClasses")}</span>
            </div>
          </div>
          <div className="kpi">
            <div className="v">{coverage}%</div>
            <div className="l">{t("kpi.coverage")}</div>
            <Bar pct={coverage} />
          </div>
          <div className="kpi">
            <div className="v">{passRate === null ? "—" : `${passRate}%`}</div>
            <div className="l">{t("kpi.passRate")}</div>
            {passRate !== null ? (
              <Bar pct={passRate} tone={run.fail_count === 0 ? "g" : "o"} />
            ) : (
              <div className="d">
                <span className="chip c-info">{t("kpi.noRun")}</span>
              </div>
            )}
          </div>
          <div className="kpi">
            <div className="v">{counts.published}</div>
            <div className="l">{t("kpi.published")}</div>
            <div className="d">
              <span className="chip c-info">
                {counts.target_families} {t("kpi.targetFamilies")}
              </span>
            </div>
          </div>
        </div>

        <div className="grid2">
          <div className="card">
            <h3>
              {t("dash.lifecycle")} <span className="sub">{t("dash.lifecycleSub")}</span>
            </h3>
            <table className="data">
              <tbody>
                {states.map(([s, tone]) => (
                  <tr key={s}>
                    <td>{t(`lc.${s}`, s)}</td>
                    <td>{byState(s)}</td>
                    <td style={{ width: "45%" }}>
                      <Bar
                        pct={counts.assets ? (byState(s) / counts.assets) * 100 : 0}
                        tone={tone as any}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3>
              {t("dash.findings")} <span className="sub">{t("dash.lastRun")}</span>
            </h3>
            {run ? (
              <table className="data">
                <tbody>
                  {(["framework", "quality", "technical"] as const).map((fam) => {
                    const f = findingsByFamily.find((x) => x.family === fam);
                    const fails = f?.fails ?? 0;
                    const warns = f?.warns ?? 0;
                    return (
                      <tr key={fam}>
                        <td>{t(`fam.${fam}`)}</td>
                        <td>
                          {fails > 0 && (
                            <span className="chip c-err">
                              {fails} {t("st.fail")}
                            </span>
                          )}{" "}
                          {warns > 0 && (
                            <span className="chip c-warn">
                              {warns} {t("st.warn")}
                            </span>
                          )}
                          {fails === 0 && warns === 0 && (
                            <span className="chip c-ok">{t("st.clear")}</span>
                          )}
                        </td>
                        <td className="small">{FAMILY_SUB[fam]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="small">
                <Link href="/compliance" className="underline">
                  {t("nav.compliance")}
                </Link>
              </div>
            )}
            <div className="note" style={{ margin: "12px 0 0" }}>
              {t("dash.demoNote")}
            </div>
          </div>
        </div>

        <div className="note">
          Roadmap alignment: this app = Module <b>M1 CDE + Engineering Data Hub</b>{" "}
          (Master Data Registry slice, task T-173) · Gate <b>G4 (W24)</b> evidence
          scope · stack per roadmap: Next.js + TypeScript + Tailwind + Postgres.
        </div>

        <div className="card">
          <h3>
            The Data Template chain <span className="sub">client vision — image 3</span>
          </h3>
          <div className="chain">
            <div className="node">
              <b>STANDARD</b>API 610 / Maaden spec
            </div>
            <span className="arr">defines ▸</span>
            <div className="node">
              <b>PRODUCT TYPE</b>Centrifugal Pump
            </div>
            <span className="arr">defines ▸</span>
            <div className="node">
              <b>PROPERTY SET</b>flow · head · power · material
            </div>
            <span className="arr">defines ▸</span>
            <div className="node">
              <b>DATA TEMPLATE</b>DT-EQP-PUMP-001 Rev A
            </div>
            <span className="arr">instantiates ▸</span>
            <div className="node" style={{ borderColor: "var(--charcoal)" }}>
              <b>ASSET / TAG</b>EQP-000789 Rev A
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
