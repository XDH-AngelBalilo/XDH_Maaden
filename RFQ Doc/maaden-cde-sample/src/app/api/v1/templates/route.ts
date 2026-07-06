import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT dt.id, dt.code, dt.revision, dt.status,
            pt.class_code, pt.name AS product_type, pt.asset_class, pt.discipline,
            (SELECT count(*)::int FROM cde.assets a WHERE a.template_id = dt.id) AS instance_count,
            (SELECT string_agg(s.code, ' + ') FROM cde.standard_template st
              JOIN cde.standards s ON s.id = st.standard_id
              WHERE st.template_id = dt.id) AS standards
     FROM cde.data_templates dt
     JOIN cde.product_types pt ON pt.id = dt.product_type_id
     ORDER BY dt.code`
  );
  return ok(rows);
}
