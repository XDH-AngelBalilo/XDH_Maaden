"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUSES = ["Draft", "Review", "Approved", "Superseded"];

export default function TemplateStatusControl({
  code,
  status,
}: {
  code: string;
  status: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function set(next: string) {
    if (next === status) return;
    setBusy(true);
    await fetch(`/api/v1/templates/${code}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <select
      className={`input ${status === "Approved" ? "text-ok" : ""}`}
      value={status}
      disabled={busy}
      onChange={(e) => set(e.target.value)}
    >
      {STATUSES.map((s) => (
        <option key={s}>{s}</option>
      ))}
    </select>
  );
}
