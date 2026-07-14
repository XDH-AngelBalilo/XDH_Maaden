import { NextRequest } from "next/server";
import { query, queryOne } from "@/lib/db";
import { ok, err, requireRole } from "@/lib/api";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

const STATUSES = ["connected", "queued", "planned"];

/** Update a publish target's integration status (governance_lead). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const gate = requireRole("approve");
  if ("deny" in gate) return gate.deny;

  const { status } = await req.json().catch(() => ({}));
  if (!STATUSES.includes(status)) {
    return err("status must be connected|queued|planned");
  }
  const id = Number(params.id);
  const before = await queryOne(
    "SELECT id, system_name, family, status FROM cde.publish_targets WHERE id = $1",
    [id]
  );
  if (!before) return err("Unknown target", 404);

  await query("UPDATE cde.publish_targets SET status = $1 WHERE id = $2", [
    status,
    id,
  ]);
  await audit(
    gate.user.username,
    "target.status",
    "publish_targets",
    before.system_name,
    before,
    { ...before, status }
  );
  return ok({ ...before, status });
}
