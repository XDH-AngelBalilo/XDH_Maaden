import { NextRequest } from "next/server";
import { query, queryOne } from "@/lib/db";
import { ok, err } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { tag: string } }
) {
  const asset = await queryOne(
    `SELECT a.*, pt.name AS product_type, dt.code AS template_code,
            dt.status AS template_status, dt.revision AS template_revision,
            ph.code AS hierarchy_code, ph.name AS hierarchy_name, ph.level AS hierarchy_level
     FROM cde.assets a
     LEFT JOIN cde.product_types pt ON pt.id = a.product_type_id
     LEFT JOIN cde.data_templates dt ON dt.id = a.template_id
     LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id
     WHERE a.tag = $1`,
    [params.tag]
  );
  if (!asset) return err(`Unknown asset ${params.tag}`, 404);

  const properties = await query(
    `SELECT p.id AS property_id, p.name, p.datatype, tp.mandatory,
            tp.uom AS template_uom, tp.validation,
            apv.value, apv.uom, apv.source
     FROM cde.template_properties tp
     JOIN cde.properties p ON p.id = tp.property_id
     LEFT JOIN cde.asset_property_values apv
       ON apv.property_id = tp.property_id AND apv.asset_id = $2
     WHERE tp.template_id = $1
     ORDER BY tp.id`,
    [asset.template_id, asset.id]
  );

  const documents = await query(
    `SELECT d.doc_no, d.title, d.doc_type, d.revision, d.cde_state
     FROM cde.documents d
     JOIN cde.document_assets da ON da.document_id = d.id
     WHERE da.asset_id = $1 ORDER BY d.doc_no`,
    [asset.id]
  );

  const revisions = await query(
    `SELECT revision, note, created_by, created_at
     FROM cde.asset_revisions WHERE asset_id = $1 ORDER BY id DESC`,
    [asset.id]
  );

  const findings = await query(
    `SELECT f.family, f.severity, f.message, f.resolved, r.name AS rule_name
     FROM cde.validation_findings f
     JOIN cde.validation_rules r ON r.id = f.rule_id
     WHERE f.asset_id = $1 AND f.run_id = (SELECT max(id) FROM cde.validation_runs)
     ORDER BY CASE f.severity WHEN 'fail' THEN 0 ELSE 1 END`,
    [asset.id]
  );

  const publishes = await query(
    `SELECT pe.status, pe.created_at, pe.payload_sha256, pt.system_name, pt.family
     FROM cde.publish_events pe
     JOIN cde.publish_targets pt ON pt.id = pe.target_id
     WHERE pe.asset_id = $1 ORDER BY pe.id DESC LIMIT 12`,
    [asset.id]
  );

  return ok({ ...asset, properties, documents, revisions, findings, publishes });
}
