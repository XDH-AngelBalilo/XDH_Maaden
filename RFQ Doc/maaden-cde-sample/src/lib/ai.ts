// S7 AI layer — Claude API for standards RAG + datasheet auto-classification.
//
// Degrades gracefully: with no ANTHROPIC_API_KEY the whole layer is inert.
// `aiEnabled()` is false, the client is never constructed, and callers must
// branch on it before invoking a model. Nothing here throws at import time.

import Anthropic from "@anthropic-ai/sdk";

// Per CLAUDE.md build brief: Claude API is the sample's AI stack. Opus 4.8 is
// the current, most capable model; a demo RAG/classification call is short, so
// we run non-streaming with a modest token cap.
export const AI_MODEL = "claude-opus-4-8";

/** True only when a non-empty API key is configured in the environment. */
export function aiEnabled(): boolean {
  return !!process.env.ANTHROPIC_API_KEY?.trim();
}

let client: Anthropic | null = null;

/** Lazily construct the client. Never called when aiEnabled() is false. */
function getClient(): Anthropic {
  if (!client) {
    // apiKey is guaranteed present here (callers gate on aiEnabled()).
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

/** First text block of a Messages response, or "" if none. */
function firstText(msg: Anthropic.Message): string {
  for (const block of msg.content) {
    if (block.type === "text") return block.text;
  }
  return "";
}

// ---- Standards RAG -------------------------------------------------------

export type StandardDoc = {
  code: string;
  title: string;
  body: string | null;
  revision: string | null;
  discipline: string | null;
};

export type RagResult = {
  answer: string;
  /** Standard codes supplied as grounding context (the references consulted). */
  references: string[];
};

/**
 * Answer an engineering-standards question grounded in the seeded standards
 * register. The provided standards are the RAG corpus and the cited references.
 */
export async function standardsRag(
  question: string,
  standards: StandardDoc[]
): Promise<RagResult> {
  const corpus = standards
    .map(
      (s) =>
        `### ${s.code} — ${s.title}${s.revision ? ` (Rev ${s.revision})` : ""}\n` +
        `Issuing body: ${s.body ?? "—"} · Discipline: ${s.discipline ?? "—"}`
    )
    .join("\n\n");

  const system =
    "You are a standards navigator for the Maaden Ar Rjum Gold Project CDE. " +
    "Answer engineering-standards questions using ONLY the standards register " +
    "provided below; if the answer is not covered, say so plainly. Keep answers " +
    "concise (a short paragraph). Cite standards inline by their code, e.g. " +
    "(ASTM A240). Never invent standard numbers or clause text.\n\n" +
    "STANDARDS REGISTER:\n" +
    corpus;

  const msg = await getClient().messages.create({
    model: AI_MODEL,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: question }],
  });

  return {
    answer: firstText(msg).trim(),
    references: standards.map((s) => s.code),
  };
}

// ---- Datasheet auto-classification --------------------------------------

export type ProductTypeOption = {
  class_code: string;
  name: string;
  asset_class: string;
  discipline: string | null;
  template_code: string | null;
};

export type ClassifyResult = {
  asset_class: string | null;
  product_type: string | null;
  template_code: string | null;
  confidence: "high" | "medium" | "low" | null;
  rationale: string;
};

const CLASSIFY_SCHEMA = {
  type: "object",
  properties: {
    asset_class: { type: "string", enum: ["STR", "ELE", "EQP", "MAT"] },
    product_type: {
      type: "string",
      description: "class_code of the best-matching product type, or empty if none fits",
    },
    template_code: {
      type: "string",
      description: "code of the suggested data template, or empty if none fits",
    },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    rationale: {
      type: "string",
      description: "one or two sentences citing the datasheet cues that drove the match",
    },
  },
  required: ["asset_class", "product_type", "template_code", "confidence", "rationale"],
  additionalProperties: false,
} as const;

/**
 * Suggest a product type + data template from pasted datasheet text, choosing
 * only among the catalogue options provided. Structured output guarantees a
 * parseable shape.
 */
export async function classifyDatasheet(
  text: string,
  options: ProductTypeOption[]
): Promise<ClassifyResult> {
  const catalogue = options
    .map(
      (o) =>
        `- class_code=${o.class_code} · ${o.name} · asset_class=${o.asset_class}` +
        ` · discipline=${o.discipline ?? "—"} · template=${o.template_code ?? "(none)"}`
    )
    .join("\n");

  const system =
    "You classify equipment/material datasheets for the Maaden ARGP CDE. " +
    "Given pasted datasheet text, pick the single best-matching product type " +
    "from the catalogue below and its data template. Choose product_type and " +
    "template_code ONLY from the catalogue; if nothing fits, return empty " +
    "strings and confidence 'low'. Base asset_class on the chosen product type.\n\n" +
    "PRODUCT TYPE CATALOGUE:\n" +
    catalogue;

  const msg = await getClient().messages.create({
    model: AI_MODEL,
    max_tokens: 700,
    system,
    messages: [
      { role: "user", content: `DATASHEET:\n${text}` },
    ],
    output_config: { format: { type: "json_schema", schema: CLASSIFY_SCHEMA } },
  });

  const raw = firstText(msg).trim();
  try {
    const parsed = JSON.parse(raw);
    const norm = (v: unknown) =>
      typeof v === "string" && v.trim() ? v.trim() : null;
    return {
      asset_class: norm(parsed.asset_class),
      product_type: norm(parsed.product_type),
      template_code: norm(parsed.template_code),
      confidence: (norm(parsed.confidence) as ClassifyResult["confidence"]) ?? null,
      rationale: typeof parsed.rationale === "string" ? parsed.rationale : "",
    };
  } catch {
    // Structured output should always parse; if it somehow doesn't, surface the
    // model's text as the rationale rather than crashing the request.
    return {
      asset_class: null,
      product_type: null,
      template_code: null,
      confidence: null,
      rationale: raw || "Could not classify the datasheet.",
    };
  }
}
