"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["connected", "queued", "planned"];

const CHIP: Record<string, string> = {
  connected: "c-ok",
  queued: "c-warn",
  planned: "c-info",
};

export default function TargetStatusControl({
  id,
  status,
}: {
  id: number;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(next: string) {
    if (next === status || busy) return;
    setBusy(true);
    await fetch(`/api/v1/publish/targets/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <select
      className={`input chip-select ${CHIP[status] ?? ""}`}
      value={status}
      disabled={busy}
      onChange={(e) => set(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
