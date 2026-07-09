import { cookies } from "next/headers";
import { makeT, dirFor, LOCALE_COOKIE, type Locale, type Translator } from "./i18n-dict";

export { LOCALE_COOKIE, dirFor };
export type { Locale, Translator };
export { LOCALES } from "./i18n-dict";

/** Server-side current locale (defaults to English). */
export function getLocale(): Locale {
  const v = cookies().get(LOCALE_COOKIE)?.value;
  return v === "ar" ? "ar" : "en";
}

/** Server helper: current locale + translator in one call. */
export function tServer(): { locale: Locale; dir: "rtl" | "ltr"; t: Translator } {
  const locale = getLocale();
  return { locale, dir: dirFor(locale), t: makeT(locale) };
}
