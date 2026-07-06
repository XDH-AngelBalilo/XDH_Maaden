import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT s.id, s.code, s.title, s.body, s.revision, s.discipline,
            (SELECT count(*)::int FROM cde.standard_template st WHERE st.standard_id = s.id) AS templates_derived
     FROM cde.standards s ORDER BY s.code`
  );
  return ok(rows);
}
