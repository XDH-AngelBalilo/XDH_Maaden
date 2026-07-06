import { NextRequest } from "next/server";
import { query, queryOne } from "@/lib/db";
import { ok, err, requireRole } from "@/lib/api";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/** Assign the asset to a plant hierarchy node (fix for framework warns). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { tag: string } }
) {
  const gate = requireRole("edit");
  if ("deny" in gate) return gate.deny;

  const { hierarchy_id } = await req.json().catch(() => ({}));
  if (!hierarchy_id) return err("hierarchy_id required");

  const asset = await queryOne("SELECT * FROM cde.assets WHERE tag = $1", [
    params.tag,
  ]);
  if (!asset) return err(`Unknown asset ${params.tag}`, 404);

  const node = await queryOne(
    "SELECT id, code, level FROM cde.plant_hierarchy WHERE id = $1",
    [hierarchy_id]
  );
  if (!node) return err("Unknown hierarchy node", 404);

  await query("UPDATE cde.assets SET hierarchy_id = $1 WHERE id = $2", [
    hierarchy_id,
    asset.id,
  ]);
  await audit(gate.user.username, "asset.hierarchy", "assets", params.tag, {
    hierarchy_id: asset.hierarchy_id,
  }, { hierarchy_id, node: node.code });

  return ok({ ok: true, node });
}
