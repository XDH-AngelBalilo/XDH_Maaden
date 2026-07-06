import { NextRequest } from "next/server";
import { ok, err, requireRole } from "@/lib/api";
import { publishAsset } from "@/lib/publish";

export const dynamic = "force-dynamic";

/** Body: { tag: "EQP-000789", target_ids: [1,2,3] } */
export async function POST(req: NextRequest) {
  const gate = requireRole("approve");
  if ("deny" in gate) return gate.deny;

  const { tag, target_ids } = await req.json().catch(() => ({}));
  if (!tag || !Array.isArray(target_ids) || target_ids.length === 0) {
    return err("tag and target_ids[] required");
  }
  try {
    const result = await publishAsset(gate.user.username, tag, target_ids);
    return ok(result, result.status === "sent" ? 200 : 409);
  } catch (e: any) {
    return err(e.message, 404);
  }
}
