import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Bar, SeverityChip } from "@/components/ui";
import { query } from "@/lib/db";
import { latestRun, openFindings } from "@/lib/validation";
import RunValidationButton from "@/components/RunValidationButton";

export const dynamic = "force-dynamic";

export default async function Compliance() {
  const run = await latestRun();
  const findings = run ? await openFindings(run.id) : [];
  const fams = (fam: string, sev: string) =>
    findings.filter((f: any) => f.family === fam && f.severity === sev).length;
  const passRate = run
    ? Math.round(((run.assets_checked - run.fail_count) / run.assets_checked) * 1000) / 10
    : null;

  return (
    <>
      <PageHeader title="Compliance Centre" actions={<RunValidationButton />} />
      <div className="p-6">
        <div className="kpis">
          <div className="kpi">
            <div className="v">{passRate === null ? "—" : `${passRate}%`}</div>
            <div className="l">Overall pass</div>
            {passRate !== null && (
              <Bar pct={passRate} tone={run.fail_count === 0 ? "g" : "o"} />
            )}
          </div>
          <div className="kpi">
            <div className="v">{fams("framework", "fail")}</div>
            <div className="l">Framework fails</div>
            <Bar pct={fams("framework", "fail") * 20} tone="r" />
          </div>
          <div className="kpi">
            <div className="v">
              {fams("framework", "warn") + fams("quality", "warn") + fams("technical", "warn")}
            </div>
            <div className="l">Warnings</div>
            <Bar
              pct={(fams("framework", "warn") + fams("quality", "warn")) * 10}
              tone="o"
            />
          </div>
          <div className="kpi">
            <div className="v">{fams("technical", "fail") + fams("quality", "fail")}</div>
            <div className="l">Quality + technical fails</div>
            <Bar pct={(fams("technical", "fail") + fams("quality", "fail")) * 20} tone="r" />
          </div>
        </div>

        <div className="card">
          <h3>
            <span>
              Validation pipeline{" "}
              <span className="sub">
                client vision image 2 — 3 check families before DT use
              </span>
            </span>
            {run && (
              <span className="sub">
                last run #{run.id} · {new Date(run.finished_at).toLocaleString("en-GB")} ·{" "}
                {run.assets_checked} assets
              </span>
            )}
          </h3>
          <div className="flowrow">
            <div className="flowstep">
              <b>STRUCTURE</b>Governance &amp; methodology → Asset data framework
              compliance
            </div>
            <div className="flowstep">
              <b>PROCESS</b>Data structure → Data quality compliance
            </div>
            <div className="flowstep">
              <b>CONTENT</b>Technical spec standards → Technical &amp; market
              compliance
            </div>
            <div
              className="flowstep"
              style={{ borderStyle: "solid", borderColor: "var(--gold)" }}
            >
              <b>RESULT</b>Data Template certified → asset publishable
            </div>
          </div>
        </div>

        <div className="card">
          <h3>
            Open findings{" "}
            <span className="sub">
              {run ? `${findings.length} findings` : "no run yet — press Run validation"}
            </span>
          </h3>
          <table className="data">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Family</th>
                <th>Severity</th>
                <th>Finding</th>
                <th>Action</th>
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
                  <td>
                    {f.family === "framework"
                      ? "Framework"
                      : f.family === "quality"
                        ? "Data quality"
                        : "Technical"}
                  </td>
                  <td>
                    <SeverityChip severity={f.severity} />
                  </td>
                  <td>{f.message}</td>
                  <td>
                    <Link href={`/registry/${f.tag}`} className="btn inline-block">
                      Fix
                    </Link>
                  </td>
                </tr>
              ))}
              {run && findings.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <span className="chip c-ok">All clear</span>{" "}
                    <span className="small">
                      zero findings in run #{run.id} — assets moved to Validated.
                    </span>
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
