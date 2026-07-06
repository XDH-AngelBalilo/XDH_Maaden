import { query } from "@/lib/db";
import { ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await query(
    `SELECT id, ruleset_version, started_at, finished_at,
            assets_checked, pass_count, warn_count, fail_count
     FROM cde.validation_runs ORDER BY id DESC LIMIT 20`
  );
  return ok(rows);
}
