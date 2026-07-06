import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT h.id, h.code, h.name, h.level, h.parent_id,
            (SELECT count(*)::int FROM cde.assets a WHERE a.hierarchy_id = h.id) AS asset_count
     FROM cde.plant_hierarchy h ORDER BY h.code`
  );
  return ok(rows);
}
