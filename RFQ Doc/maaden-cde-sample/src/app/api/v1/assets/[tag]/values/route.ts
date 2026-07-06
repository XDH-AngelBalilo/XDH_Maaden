import { NextRequest } from "next/server";
import { query, queryOne } from "@/lib/db";
import { ok, err, requireRole } from "@/lib/api";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/**
 * Upsert property values — the "Fix" action in the Compliance Centre.
 * Body: { values: [{ property_id, value, uom?, source? }] }
 * Published assets are immutable: a change bumps to a new revision first.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { tag: string } }
) {
  const gate = requireRole("edit");
  if ("deny" in gate) return gate.deny;

  const asset = await queryOne("SELECT * FROM cde.assets WHERE tag = $1", [
    params.tag,
  ]);
  if (!asset) return err(`Unknown asset ${params.tag}`, 404);

  const { values } = await req.json().catch(() => ({}));
  if (!Array.isArray(values) || values.length === 0) {
    return err("values[] required");
  }

  // Immutability: editing a Published asset creates a new revision
  if (asset.lifecycle === "Published") {
    const next =
      asset.revision === "0"
        ? "A"
        : String.fromCharCode(asset.revision.charCodeAt(0) + 1);
    await query(
      "UPDATE cde.assets SET revision = $1, lifecycle = 'Data Loaded' WHERE id = $2",
      [next, asset.id]
    );
    await query(
      `INSERT INTO cde.asset_revisions (asset_id, revision, note, created_by)
       VALUES ($1, $2, 'Data change after publish — re-validation required', $3)`,
      [asset.id, next, gate.user.username]
    );
  }

  for (const v of values) {
    const before = await queryOne(
      "SELECT * FROM cde.asset_property_values WHERE asset_id = $1 AND property_id = $2",
      [asset.id, v.property_id]
    );
    await query(
      `INSERT INTO cde.asset_property_values (asset_id, property_id, value, uom, source)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (asset_id, property_id)
       DO UPDATE SET value = $3, uom = $4, source = COALESCE($5, cde.asset_property_values.source)`,
      [asset.id, v.property_id, v.value ?? null, v.uom ?? null, v.source ?? "engineering"]
    );
    await audit(
      gate.user.username,
      "asset.value_set",
      "asset_property_values",
      `${params.tag}:${v.property_id}`,
      before,
      v
    );
  }

  // Any data change puts the asset back to Data Loaded until re-validated
  if (asset.lifecycle === "Validated") {
    await query(
      "UPDATE cde.assets SET lifecycle = 'Data Loaded' WHERE id = $1",
      [asset.id]
    );
  }

  return ok({ ok: true, updated: values.length });
}
