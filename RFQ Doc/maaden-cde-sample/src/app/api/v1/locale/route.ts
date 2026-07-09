import { NextRequest, NextResponse } from "next/server";
import { LOCALE_COOKIE, LOCALES } from "@/lib/i18n";

/** Body: { locale: "en" | "ar" } — sets the UI language cookie. */
export async function POST(req: NextRequest) {
  const { locale } = await req.json().catch(() => ({}));
  if (!LOCALES.includes(locale)) {
    return NextResponse.json({ error: "locale must be en|ar" }, { status: 400 });
  }
  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(LOCALE_COOKIE, locale, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
