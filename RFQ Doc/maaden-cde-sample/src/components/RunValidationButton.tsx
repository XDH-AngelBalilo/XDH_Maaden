"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { makeT, type Locale } from "@/lib/i18n-dict";

export default function RunValidationButton({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const t = makeT(locale);

  async function run() {
    setBusy(true);
    await fetch("/api/v1/validation/run", { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button className="btn gold" onClick={run} disabled={busy}>
      {busy ? t("btn.running") : t("btn.runValidation")}
    </button>
  );
}
