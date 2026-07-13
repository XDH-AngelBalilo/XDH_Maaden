import { ok } from "@/lib/api";
import { aiEnabled, AI_MODEL } from "@/lib/ai";

export const dynamic = "force-dynamic";

// Advertises whether the optional AI layer is configured, so the UI can hide or
// disable AI panels without probing the model.
export async function GET() {
  return ok({ enabled: aiEnabled(), model: aiEnabled() ? AI_MODEL : null });
}
