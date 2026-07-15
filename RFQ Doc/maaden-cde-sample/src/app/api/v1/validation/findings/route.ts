import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { openFindings } from "@/lib/validation";
import { formatFinding, LOCALES, type Locale } from "@/lib/i18n-dict";

export const dynamic = "force-dynamic";

/**
 * Findings for the latest (or given) run.
 *
 * Each row carries the structured `message_key` + `params` — match on those,
 * not on prose. `message` is a rendered convenience string in `?locale=`
 * (default `en`) for humans and log sinks.
 */
export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("run");
  const requested = req.nextUrl.searchParams.get("locale");
  const locale: Locale = LOCALES.includes(requested as Locale)
    ? (requested as Locale)
    : "en";

  const rows = await openFindings(runId ? Number(runId) : undefined);
  return ok(
    rows.map((f: any) => ({
      ...f,
      message: formatFinding(locale, f.message_key, f.params),
    }))
  );
}
