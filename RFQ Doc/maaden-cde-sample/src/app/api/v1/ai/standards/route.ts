import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { query } from "@/lib/db";
import { aiEnabled, standardsRag, type StandardDoc } from "@/lib/ai";

export const dynamic = "force-dynamic";

// Standards RAG: answer an engineering-standards question grounded in the seeded
// standards register, returning the answer plus the references consulted.
export async function POST(req: NextRequest) {
  if (!aiEnabled()) {
    return err("AI features are disabled (ANTHROPIC_API_KEY not set).", 503);
  }

  let question = "";
  try {
    const body = await req.json();
    question = typeof body?.question === "string" ? body.question.trim() : "";
  } catch {
    return err("Invalid JSON body.", 400);
  }
  if (!question) return err("A question is required.", 400);

  const standards = await query<StandardDoc>(
    `SELECT code, title, body, revision, discipline
     FROM cde.standards ORDER BY code`
  );

  try {
    const result = await standardsRag(question, standards);
    return ok(result);
  } catch (e) {
    // Model/network failure must not 500 the app — report it cleanly.
    const message = e instanceof Error ? e.message : "AI request failed.";
    return err(`Standards assistant unavailable: ${message}`, 502);
  }
}
