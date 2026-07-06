"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublishPanel({
  targets,
  publishable,
}: {
  targets: { id: number; system_name: string; family: string; protocol: string; status: string }[];
  publishable: { tag: string; label: string }[];
}) {
  const router = useRouter();
  const [tag, setTag] = useState(publishable[0]?.tag ?? "");
  const [selected, setSelected] = useState<number[]>(
    targets.filter((t) => t.status === "connected").map((t) => t.id)
  );
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>("");

  function toggle(id: number) {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  async function publish() {
    if (!tag || selected.length === 0) return;
    setBusy(true);
    setResult("");
    const res = await fetch("/api/v1/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag, target_ids: selected }),
    });
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    setResult(
      body.status === "sent"
        ? `Sent to ${selected.length} target(s)`
        : body.error ?? `Blocked — ${body.reason ?? "compliance"}`
    );
    router.refresh();
  }

  return (
    <div className="card">
      <h3>
        Publish asset <span className="sub">requires Validated + Approved template</span>
      </h3>
      <div className="flex flex-col gap-2 text-[12.5px]">
        <select className="input" value={tag} onChange={(e) => setTag(e.target.value)}>
          {publishable.length === 0 && <option value="">— no publishable assets —</option>}
          {publishable.map((p) => (
            <option key={p.tag} value={p.tag}>
              {p.label}
            </option>
          ))}
        </select>
        <table className="data">
          <tbody>
            {targets.map((t) => (
              <tr key={t.id}>
                <td style={{ width: 24 }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(t.id)}
                    onChange={() => toggle(t.id)}
                  />
                </td>
                <td>{t.system_name}</td>
                <td className="small">{t.family}</td>
                <td className="small">{t.protocol}</td>
                <td>
                  <span
                    className={`chip ${
                      t.status === "connected"
                        ? "c-ok"
                        : t.status === "queued"
                          ? "c-warn"
                          : "c-info"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn gold"
          onClick={publish}
          disabled={busy || !tag || selected.length === 0}
        >
          {busy ? "Publishing…" : `⇄ Publish to ${selected.length} target(s)`}
        </button>
        {result && (
          <span
            className={`chip ${result.startsWith("Sent") ? "c-ok" : "c-err"}`}
          >
            {result}
          </span>
        )}
      </div>
    </div>
  );
}
