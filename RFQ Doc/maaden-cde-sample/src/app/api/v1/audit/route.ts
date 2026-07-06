import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT id, actor, action, entity, entity_id, before, after, at
     FROM cde.audit_log ORDER BY id DESC LIMIT 50`
  );
  return ok(rows);
}
