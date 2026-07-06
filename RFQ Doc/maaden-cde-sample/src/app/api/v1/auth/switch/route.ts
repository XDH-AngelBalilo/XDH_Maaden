import { NextRequest, NextResponse } from "next/server";
import { loginAs, SESSION_COOKIE } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const { username } = await req.json().catch(() => ({}));
  if (!username) {
    return NextResponse.json({ error: "username required" }, { status: 400 });
  }
  const token = await loginAs(username);
  if (!token) {
    return NextResponse.json({ error: "unknown user" }, { status: 404 });
  }
  await audit(username, "auth.switch", "users", username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return res;
}
