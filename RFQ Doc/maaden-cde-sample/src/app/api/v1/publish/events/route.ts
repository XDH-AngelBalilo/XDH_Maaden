import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT pe.id, pe.status, pe.created_at, pe.payload, pe.payload_sha256,
            a.tag, pt.system_name, pt.family
     FROM cde.publish_events pe
     JOIN cde.assets a ON a.id = pe.asset_id
     JOIN cde.publish_targets pt ON pt.id = pe.target_id
     ORDER BY pe.id DESC LIMIT 50`
  );
  return ok(rows);
}
