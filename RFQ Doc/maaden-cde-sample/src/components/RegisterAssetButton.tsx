"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { makeT, type Locale } from "@/lib/i18n-dict";

interface Option {
  id: number;
  label: string;
}

export default function RegisterAssetButton({
  locale = "en",
}: {
  locale?: Locale;
}) {
  const t = makeT(locale);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [types, setTypes] = useState<Option[]>([]);
  const [templates, setTemplates] = useState<{ id: number; label: string; product_type: string }[]>([]);
  const [nodes, setNodes] = useState<Option[]>([]);
  const [form, setForm] = useState({
    tag: "",
    name: "",
    asset_class: "EQP",
    template_id: "",
    hierarchy_id: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    fetch("/api/v1/templates")
      .then((r) => r.json())
      .then((rows) =>
        setTemplates(
          rows.map((t: any) => ({
            id: t.id,
            label: `${t.code} (${t.product_type})`,
            product_type: t.product_type,
          }))
        )
      );
    fetch("/api/v1/hierarchy")
      .then((r) => r.json())
      .then((rows) =>
        setNodes(rows.map((h: any) => ({ id: h.id, label: `${h.code} — ${h.name} (${h.level})` })))
      );
  }, [open]);

  async function submit() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/v1/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tag: form.tag.trim(),
        name: form.name.trim(),
        asset_class: form.asset_class,
        template_id: form.template_id ? Number(form.template_id) : null,
        hierarchy_id: form.hierarchy_id ? Number(form.hierarchy_id) : null,
      }),
    });
    setBusy(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? `HTTP ${res.status}`);
      return;
    }
    setOpen(false);
    setForm({ tag: "", name: "", asset_class: "EQP", template_id: "", hierarchy_id: "" });
    router.refresh();
  }

  return (
    <>
      <button className="btn gold" onClick={() => setOpen(true)}>
        {t("btn.registerAsset")}
      </button>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="card w-[440px] !mb-0">
            <h3>
              Register asset{" "}
              <button className="btn" onClick={() => setOpen(false)}>
                ✕
              </button>
            </h3>
            <div className="flex flex-col gap-2 text-[12.5px]">
              <label>
                Tag ID <span className="small">{"{STR|ELE|EQP|MAT}-{6 digits}"}</span>
                <input
                  className="input w-full mt-1"
                  placeholder="EQP-000812"
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value.toUpperCase() })}
                />
              </label>
              <label>
                Name
                <input
                  className="input w-full mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                Asset class
                <select
                  className="input w-full mt-1"
                  value={form.asset_class}
                  onChange={(e) => setForm({ ...form, asset_class: e.target.value })}
                >
                  <option>EQP</option>
                  <option>STR</option>
                  <option>ELE</option>
                  <option>MAT</option>
                </select>
              </label>
              <label>
                Data template
                <select
                  className="input w-full mt-1"
                  value={form.template_id}
                  onChange={(e) => setForm({ ...form, template_id: e.target.value })}
                >
                  <option value="">— none yet —</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Hierarchy node
                <select
                  className="input w-full mt-1"
                  value={form.hierarchy_id}
                  onChange={(e) => setForm({ ...form, hierarchy_id: e.target.value })}
                >
                  <option value="">— unassigned —</option>
                  {nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label}
                    </option>
                  ))}
                </select>
              </label>
              {error && <div className="chip c-err">{error}</div>}
              <button
                className="btn gold mt-2"
                disabled={busy || !form.tag || !form.name}
                onClick={submit}
              >
                {busy ? "Registering…" : "Register"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
