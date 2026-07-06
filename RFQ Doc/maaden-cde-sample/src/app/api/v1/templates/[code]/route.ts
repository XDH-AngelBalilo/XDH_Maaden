import { query, queryOne } from "@/lib/db";
import { ok, err, requireRole } from "@/lib/api";
import { audit } from "@/lib/audit";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { code: string } }
) {
  const tpl = await queryOne(
    `SELECT dt.id, dt.code, dt.revision, dt.status,
            pt.class_code, pt.name AS product_type, pt.asset_class,
            (SELECT string_agg(s.code, ' + ') FROM cde.standard_template st
              JOIN cde.standards s ON s.id = st.standard_id
              WHERE st.template_id = dt.id) AS standards
     FROM cde.data_templates dt
     JOIN cde.product_types pt ON pt.id = dt.product_type_id
     WHERE dt.code = $1
     ORDER BY dt.revision DESC LIMIT 1`,
    [params.code]
  );
  if (!tpl) return err(`Unknown template ${params.code}`, 404);

  const properties = await query(
    `SELECT p.name, p.symbol, p.datatype, tp.mandatory, tp.uom, tp.validation
     FROM cde.template_properties tp
     JOIN cde.properties p ON p.id = tp.property_id
     WHERE tp.template_id = $1 ORDER BY tp.id`,
    [tpl.id]
  );
  const instances = await query(
    `SELECT a.tag, a.revision, a.lifecycle, ph.code AS hierarchy_code,
            (SELECT ph2.name FROM cde.plant_hierarchy ph2
              WHERE ph2.id = (WITH RECURSIVE up AS (
                SELECT id, parent_id, level FROM cde.plant_hierarchy WHERE id = a.hierarchy_id
                UNION ALL
                SELECT h.id, h.parent_id, h.level FROM cde.plant_hierarchy h JOIN up ON h.id = up.parent_id)
              SELECT id FROM up WHERE level = 'Area' LIMIT 1)) AS area_name
     FROM cde.assets a
     LEFT JOIN cde.plant_hierarchy ph ON ph.id = a.hierarchy_id
     WHERE a.template_id = $1 ORDER BY a.tag`,
    [tpl.id]
  );
  return ok({ ...tpl, properties, instances });
}

/** Governance approval workflow: Draft → Review → Approved (→ Superseded). */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  const gate = requireRole("approve");
  if ("deny" in gate) return gate.deny;

  const { status } = await req.json().catch(() => ({}));
  if (!["Draft", "Review", "Approved", "Superseded"].includes(status)) {
    return err("status must be Draft|Review|Approved|Superseded");
  }
  const before = await queryOne(
    "SELECT id, code, revision, status FROM cde.data_templates WHERE code = $1 ORDER BY revision DESC LIMIT 1",
    [params.code]
  );
  if (!before) return err(`Unknown template ${params.code}`, 404);

  await query("UPDATE cde.data_templates SET status = $1 WHERE id = $2", [
    status,
    before.id,
  ]);
  await audit(gate.user.username, "template.status", "data_templates", before.code, before, {
    ...before,
    status,
  });
  return ok({ ...before, status });
}
