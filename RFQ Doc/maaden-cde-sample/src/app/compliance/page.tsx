import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Bar, SeverityChip } from "@/components/ui";
import { query } from "@/lib/db";
import { latestRun, openFindings } from "@/lib/validation";
import RunValidationButton from "@/components/RunValidationButton";
import { tServer } from "@/lib/i18n";
import { formatFinding } from "@/lib/i18n-dict";

export const dynamic = "force-dynamic";

export default async function Compliance() {
  const { locale, t } = tServer();
  const run = await latestRun();
  const findings = run ? await openFindings(run.id) : [];
  const fams = (fam: string, sev: string) =>
    findings.filter((f: any) => f.family === fam && f.severity === sev).length;
  const passRate = run
    ? Math.round(((run.assets_checked - run.fail_count) / run.assets_checked) * 1000) / 10
    : null;

  return (
    <>
      <PageHeader
        title={t("title.compliance")}
        actions={<RunValidationButton locale={locale} />}
      />
      <div className="p-6">
        <div className="kpis">
          <div className="kpi">
            <div className="v">{passRate === null ? "—" : `${passRate}%`}</div>
            <div className="l">{t("comp.overallPass")}</div>
            {passRate !== null && (
              <Bar pct={passRate} tone={run.fail_count === 0 ? "g" : "o"} />
            )}
          </div>
          <div className="kpi">
            <div className="v">{fams("framework", "fail")}</div>
            <div className="l">{t("comp.frameworkFails")}</div>
            <Bar pct={fams("framework", "fail") * 20} tone="r" />
          </div>
          <div className="kpi">
            <div className="v">
              {fams("framework", "warn") + fams("quality", "warn") + fams("technical", "warn")}
            </div>
            <div className="l">{t("comp.warnings")}</div>
            <Bar
              pct={(fams("framework", "warn") + fams("quality", "warn")) * 10}
              tone="o"
            />
          </div>
          <div className="kpi">
            <div className="v">{fams("technical", "fail") + fams("quality", "fail")}</div>
            <div className="l">{t("comp.qualityTechFails")}</div>
            <Bar pct={(fams("technical", "fail") + fams("quality", "fail")) * 20} tone="r" />
          </div>
        </div>

        <div className="card">
          <h3>
            <span>
              {t("comp.pipeline")}{" "}
              <span className="sub">{t("comp.pipelineSub")}</span>
            </span>
            {run && (
              <span className="sub" dir="ltr">
                {t("comp.lastRun")} #{run.id},{" "}
                {new Date(run.finished_at).toLocaleString(
                  locale === "ar" ? "ar-SA" : "en-GB"
                )}
                , {run.assets_checked} {t("comp.assetsChecked")}
              </span>
            )}
          </h3>
          <div className="flowrow">
            <div className="flowstep">
              <b>{t("comp.step.structure")}</b>
              {t("comp.step.structureBody")}
            </div>
            <div className="flowstep">
              <b>{t("comp.step.process")}</b>
              {t("comp.step.processBody")}
            </div>
            <div className="flowstep">
              <b>{t("comp.step.content")}</b>
              {t("comp.step.contentBody")}
            </div>
            <div
              className="flowstep"
              style={{ borderStyle: "solid", borderColor: "var(--gold)" }}
            >
              <b>{t("comp.step.result")}</b>
              {t("comp.step.resultBody")}
            </div>
          </div>
        </div>

        <div className="card">
          <h3>
            {t("comp.openFindings")}{" "}
            <span className="sub">
              {run
                ? `${findings.length} ${t("comp.findingsCount")}`
                : t("comp.noRun")}
            </span>
          </h3>
          <table className="data">
            <thead>
              <tr>
                <th>{t("th.asset")}</th>
                <th>{t("th.family")}</th>
                <th>{t("th.severity")}</th>
                <th>{t("th.finding")}</th>
                <th>{t("th.action")}</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((f: any) => (
                <tr key={f.id}>
                  <td className="mono">
                    <Link href={`/registry/${f.tag}`} className="underline">
                      {f.tag}
                    </Link>
                  </td>
                  <td>{t(`fam.${f.family}`)}</td>
                  <td>
                    <SeverityChip severity={f.severity} locale={locale} />
                  </td>
                  <td>{formatFinding(locale, f.message_key, f.params)}</td>
                  <td>
                    <Link href={`/registry/${f.tag}`} className="btn inline-block">
                      {t("btn.fix")}
                    </Link>
                  </td>
                </tr>
              ))}
              {run && findings.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <span className="chip c-ok">{t("comp.allClear")}</span>{" "}
                    <span className="small">{t("comp.allClearNote")}</span>
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
