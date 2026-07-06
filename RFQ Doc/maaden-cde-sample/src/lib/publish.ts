import { createHash } from "node:crypto";
import { query, queryOne } from "./db";
import { audit } from "./audit";

/**
 * Publish simulator — writes one publish_events row per target with the
 * full asset JSON payload + sha256. Requires lifecycle = Validated (or
 * already Published for re-publish) AND template status = Approved.
 * If the asset has open fail findings, events are written as
 * 'blocked' so the queue shows "Blocked — compliance".
 */
export async function publishAsset(
  actor: string,
  tag: string,
  targetIds: number[]
): Promise<{ status: "sent" | "blocked"; events: number[]; reason?: string }> {
  const asset = await queryOne(
    `SELECT a.*, dt.code AS template_code, dt.status AS template_status,
            ph.code AS hierarchy_code
     FROM cde.assets a
     LEFT JOIN cde.data_templates dt ON dt.id = a.template_id
     LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id
     WHERE a.tag = $1`,
    [tag]
  );
  if (!asset) throw new Error(`Unknown asset ${tag}`);

  // Compliance gate: open fails in the latest run block publishing
  const openFail = await queryOne(
    `SELECT count(*)::int AS n FROM cde.validation_findings f
     WHERE f.asset_id = $1 AND f.severity = 'fail' AND NOT f.resolved
       AND f.run_id = (SELECT max(id) FROM cde.validation_runs)`,
    [asset.id]
  );
  const eligible =
    ["Validated", "Published"].includes(asset.lifecycle) &&
    asset.template_status === "Approved" &&
    (openFail?.n ?? 0) === 0;

  const values = await query(
    `SELECT p.name, apv.value, apv.uom, apv.source
     FROM cde.asset_property_values apv
     JOIN cde.properties p ON p.id = apv.property_id
     WHERE apv.asset_id = $1`,
    [asset.id]
  );

  const payload = {
    tag: asset.tag,
    name: asset.name,
    asset_class: asset.asset_class,
    revision: asset.revision,
    lifecycle: asset.lifecycle,
    template: asset.template_code,
    hierarchy: asset.hierarchy_code,
    properties: values,
    published_by: actor,
  };
  const sha256 = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");

  const status = eligible ? "sent" : "blocked";
  const events: number[] = [];
  for (const targetId of targetIds) {
    const row = await queryOne<{ id: number }>(
      `INSERT INTO cde.publish_events (asset_id, target_id, payload, payload_sha256, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [asset.id, targetId, JSON.stringify(payload), sha256, status]
    );
    events.push(row!.id);
  }

  if (eligible && asset.lifecycle !== "Published") {
    await query("UPDATE cde.assets SET lifecycle = 'Published' WHERE id = $1", [
      asset.id,
    ]);
  }

  await audit(actor, eligible ? "asset.publish" : "asset.publish_blocked",
    "assets", asset.tag, null, {
      targets: targetIds,
      sha256,
      status,
    });

  return {
    status,
    events,
    reason: eligible
      ? undefined
      : asset.template_status !== "Approved"
        ? "Template not Approved"
        : asset.lifecycle !== "Validated" && asset.lifecycle !== "Published"
          ? `Lifecycle is ${asset.lifecycle}, must be Validated`
          : "Open compliance failures",
  };
}
