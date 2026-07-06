"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Inline value/UoM editor rendered as two <td> cells. Enter saves. */
export default function PropertyEditor({
  tag,
  propertyId,
  value,
  uom,
  templateUom,
}: {
  tag: string;
  propertyId: number;
  value: string | null;
  uom: string | null;
  templateUom: string | null;
}) {
  const router = useRouter();
  const [v, setV] = useState(value ?? "");
  const [u, setU] = useState(uom ?? templateUom ?? "");
  const [busy, setBusy] = useState(false);
  const dirty = v !== (value ?? "") || u !== (uom ?? templateUom ?? "");

  async function save() {
    if (!dirty || busy) return;
    setBusy(true);
    await fetch(`/api/v1/assets/${tag}/values`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        values: [{ property_id: propertyId, value: v, uom: u || null }],
      }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <>
      <td>
        <input
          className={`input w-28 ${dirty ? "border-gold" : ""}`}
          value={v}
          placeholder="—"
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          onBlur={save}
          disabled={busy}
        />
      </td>
      <td>
        <input
          className={`input w-16 ${dirty ? "border-gold" : ""}`}
          value={u}
          placeholder={templateUom ?? "—"}
          onChange={(e) => setU(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          onBlur={save}
          disabled={busy}
        />
      </td>
    </>
  );
}
