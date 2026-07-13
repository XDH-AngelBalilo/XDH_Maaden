"use client";

import Link from "next/link";
import { useState } from "react";
import { makeT, type Locale } from "@/lib/i18n-dict";

type ClassifyResult = {
  asset_class: string | null;
  product_type: string | null;
  template_code: string | null;
  confidence: "high" | "medium" | "low" | null;
  rationale: string;
};

const CONF_CHIP: Record<string, string> = {
  high: "c-ok",
  medium: "c-warn",
  low: "c-err",
};

export default function DatasheetClassifier({
  locale = "en",
  enabled,
}: {
  locale?: Locale;
  enabled: boolean;
}) {
  const t = makeT(locale);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ClassifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function classify() {
    if (!text.trim() || busy) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/v1/ai/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) setError(data?.error ?? "Request failed.");
      else setResult(data);
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>
        ✦ {t("ai.classify.title")}
        <span className="sub">{t("ai.classify.sub")}</span>
      </h3>
      <textarea
        className="ai-input"
        rows={4}
        value={text}
        disabled={!enabled || busy}
        placeholder={t("ai.classify.placeholder")}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="ai-actions">
        <button
          className="btn gold"
          onClick={classify}
          disabled={!enabled || busy || !text.trim()}
        >
          {busy ? t("ai.thinking") : t("ai.classify.run")}
        </button>
      </div>
      {error && <div className="ai-error">{error}</div>}
      {result && (
        <div className="ai-answer">
          {result.template_code ? (
            <div className="ai-suggest">
              <div>
                <span className="small">{t("ai.classify.suggested")}</span>
                <div className="ai-suggest-row" dir="ltr">
                  {result.asset_class && (
                    <span className="chip c-info">{result.asset_class}</span>
                  )}
                  <b className="mono">{result.template_code}</b>
                  {result.product_type && (
                    <span className="small">· {result.product_type}</span>
                  )}
                </div>
              </div>
              {result.confidence && (
                <span className={`chip ${CONF_CHIP[result.confidence] ?? "c-info"}`}>
                  {t("ai.classify.confidence")}: {result.confidence}
                </span>
              )}
            </div>
          ) : (
            <p className="small">{t("ai.classify.none")}</p>
          )}
          {result.rationale && <p>{result.rationale}</p>}
          {result.template_code && (
            <Link
              href={`/templates?code=${result.template_code}`}
              className="underline text-gold text-[13px]"
            >
              {t("ai.openTemplate")}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
