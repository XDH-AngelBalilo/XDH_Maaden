import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { query } from "@/lib/db";
import { aiEnabled, classifyDatasheet, type ProductTypeOption } from "@/lib/ai";

export const dynamic = "force-dynamic";

// Auto-classification: suggest a product type + data template from pasted
// datasheet text, choosing only among the seeded catalogue.
export async function POST(req: NextRequest) {
  if (!aiEnabled()) {
    return err("AI features are disabled (ANTHROPIC_API_KEY not set).", 503);
  }

  let text = "";
  try {
    const body = await req.json();
    text = typeof body?.text === "string" ? body.text.trim() : "";
  } catch {
    return err("Invalid JSON body.", 400);
  }
  if (!text) return err("Datasheet text is required.", 400);

  // One row per product type, with the latest template code if one exists.
  const options = await query<ProductTypeOption>(
    `SELECT pt.class_code, pt.name, pt.asset_class, pt.discipline,
            (SELECT dt.code FROM cde.data_templates dt
              WHERE dt.product_type_id = pt.id
              ORDER BY dt.revision DESC LIMIT 1) AS template_code
     FROM cde.product_types pt ORDER BY pt.asset_class, pt.name`
  );

  try {
    const result = await classifyDatasheet(text, options);
    return ok(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed.";
    return err(`Classification assistant unavailable: ${message}`, 502);
  }
}
