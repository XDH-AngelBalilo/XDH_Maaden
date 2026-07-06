import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { queryOne } from "./db";
import type { Role } from "./types";

const SECRET = process.env.JWT_SECRET || "dev-only-change-me";
const COOKIE = "cde_session";

export interface SessionUser {
  username: string;
  display_name: string;
  role: Role;
}

const DEFAULT_USER: SessionUser = {
  username: "a.balilo",
  display_name: "Angel Balilo",
  role: "governance_lead",
};

export function signSession(user: SessionUser): string {
  return jwt.sign(user, SECRET, { expiresIn: "12h" });
}

export function verifySession(token: string): SessionUser | null {
  try {
    const p = jwt.verify(token, SECRET) as jwt.JwtPayload;
    return {
      username: p.username,
      display_name: p.display_name,
      role: p.role,
    };
  } catch {
    return null;
  }
}

/** Session from cookie; falls back to the demo governance lead. */
export function getSession(): SessionUser {
  const token = cookies().get(COOKIE)?.value;
  if (token) {
    const u = verifySession(token);
    if (u) return u;
  }
  return DEFAULT_USER;
}

export async function loginAs(username: string): Promise<string | null> {
  const user = await queryOne<SessionUser>(
    "SELECT username, display_name, role FROM cde.users WHERE username = $1",
    [username]
  );
  if (!user) return null;
  return signSession(user);
}

export const SESSION_COOKIE = COOKIE;

const ROLE_RANK: Record<Role, number> = {
  viewer: 0,
  doc_controller: 1,
  engineer: 2,
  governance_lead: 3,
};

export function canEdit(role: Role): boolean {
  return ROLE_RANK[role] >= ROLE_RANK.engineer;
}
export function canApprove(role: Role): boolean {
  return role === "governance_lead";
}

export const ROLE_LABELS: Record<Role, string> = {
  governance_lead: "Data Governance Lead",
  engineer: "Discipline Engineer",
  doc_controller: "Document Controller",
  viewer: "Viewer / Downstream",
};
