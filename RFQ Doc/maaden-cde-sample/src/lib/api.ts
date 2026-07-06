import { NextResponse } from "next/server";
import { getSession, canEdit, canApprove, type SessionUser } from "./auth";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns the session, or a 403 response if the role check fails. */
export function requireRole(
  check: "edit" | "approve"
): { user: SessionUser } | { deny: NextResponse } {
  const user = getSession();
  const allowed = check === "edit" ? canEdit(user.role) : canApprove(user.role);
  if (!allowed) {
    return {
      deny: err(
        `Role ${user.role} cannot perform this action (requires ${check === "edit" ? "engineer" : "governance_lead"})`,
        403
      ),
    };
  }
  return { user };
}
