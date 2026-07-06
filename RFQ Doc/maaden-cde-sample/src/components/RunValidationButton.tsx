"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RunValidationButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    await fetch("/api/v1/validation/run", { method: "POST" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button className="btn gold" onClick={run} disabled={busy}>
      {busy ? "Running…" : "▶ Run validation"}
    </button>
  );
}
