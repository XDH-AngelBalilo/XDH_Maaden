import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    "SELECT id, system_name, family, protocol, status FROM cde.publish_targets ORDER BY id"
  );
  return ok(rows);
}
