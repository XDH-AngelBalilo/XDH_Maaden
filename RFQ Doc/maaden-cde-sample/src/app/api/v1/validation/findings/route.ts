import { NextRequest } from "next/server";
import { ok } from "@/lib/api";
import { openFindings } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const runId = req.nextUrl.searchParams.get("run");
  const rows = await openFindings(runId ? Number(runId) : undefined);
  return ok(rows);
}
