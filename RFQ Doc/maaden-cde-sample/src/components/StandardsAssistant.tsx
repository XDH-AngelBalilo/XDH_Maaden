"use client";

import { useState } from "react";
import { makeT, type Locale } from "@/lib/i18n-dict";

export default function StandardsAssistant({
  locale = "en",
  enabled,
}: {
  locale?: Locale;
  enabled: boolean;
}) {
  const t = makeT(locale);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [refs, setRefs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    if (!question.trim() || busy) return;
    setBusy(true);
    setError(null);
    setAnswer(null);
    setRefs([]);
    try {
      const res = await fetch("/api/v1/ai/standards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Request failed.");
      } else {
        setAnswer(data.answer);
        setRefs(data.references ?? []);
      }
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>
        ✦ {t("ai.rag.title")}
        <span className="sub">{t("ai.rag.sub")}</span>
      </h3>
      <textarea
        className="ai-input"
        rows={2}
        value={question}
        disabled={!enabled || busy}
        placeholder={t("ai.rag.placeholder")}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <div className="ai-actions">
        <button
          className="btn gold"
          onClick={ask}
          disabled={!enabled || busy || !question.trim()}
        >
          {busy ? t("ai.thinking") : t("ai.rag.ask")}
        </button>
      </div>
      {error && <div className="ai-error">{error}</div>}
      {answer && (
        <div className="ai-answer">
          <p>{answer}</p>
          {refs.length > 0 && (
            <div className="ai-refs">
              <span className="small">{t("ai.rag.refs")}:</span>
              {refs.map((r) => (
                <span key={r} className="chip c-info" dir="ltr">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
