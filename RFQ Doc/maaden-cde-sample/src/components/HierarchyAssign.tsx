"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HierarchyAssign({
  tag,
  current,
  nodes,
}: {
  tag: string;
  current: number | null;
  nodes: { id: number; code: string; name: string; level: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function assign(id: string) {
    if (!id || Number(id) === current) return;
    setBusy(true);
    await fetch(`/api/v1/assets/${tag}/hierarchy`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hierarchy_id: Number(id) }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="mt-2">
      <div className="small mb-1">Hierarchy node</div>
      <select
        className="input w-full"
        value={current ?? ""}
        disabled={busy}
        onChange={(e) => assign(e.target.value)}
      >
        <option value="" disabled>
          — unassigned —
        </option>
        {nodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.code} — {n.name} ({n.level})
          </option>
        ))}
      </select>
    </div>
  );
}
