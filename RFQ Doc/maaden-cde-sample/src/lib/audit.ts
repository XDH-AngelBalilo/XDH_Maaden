import { query } from "./db";

/** Every mutation writes audit_log (who, what, before/after) — CLAUDE.md rule. */
export async function audit(
  actor: string,
  action: string,
  entity: string,
  entityId: string | number | null,
  before: unknown = null,
  after: unknown = null
) {
  await query(
    `INSERT INTO cde.audit_log (actor, action, entity, entity_id, before, after)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      actor,
      action,
      entity,
      entityId === null ? null : String(entityId),
      before === null ? null : JSON.stringify(before),
      after === null ? null : JSON.stringify(after),
    ]
  );
}
