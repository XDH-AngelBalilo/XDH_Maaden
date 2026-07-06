import PageHeader from "@/components/PageHeader";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [counts] = await query(
    `SELECT
       (SELECT count(*)::int FROM cde.assets) AS assets,
       (SELECT count(*)::int FROM cde.assets WHERE lifecycle = 'Published') AS published,
       (SELECT count(*)::int FROM cde.assets WHERE template_id IS NOT NULL) AS templated`
  );
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="p-6">
        <div className="kpis">
          <div className="kpi">
            <div className="v">{counts.assets}</div>
            <div className="l">Assets registered</div>
          </div>
          <div className="kpi">
            <div className="v">
              {Math.round((counts.templated / counts.assets) * 100)}%
            </div>
            <div className="l">Template coverage</div>
          </div>
          <div className="kpi">
            <div className="v">—</div>
            <div className="l">Compliance pass rate</div>
          </div>
          <div className="kpi">
            <div className="v">{counts.published}</div>
            <div className="l">Published assets</div>
          </div>
        </div>
        <div className="note">
          S1 scaffold — full dashboard lands in S4.
        </div>
      </div>
    </>
  );
}
