import { ok } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { runValidation } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = getSession();
  const result = await runValidation(user.username);
  return ok(result);
}
