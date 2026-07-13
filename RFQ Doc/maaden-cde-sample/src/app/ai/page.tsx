import PageHeader from "@/components/PageHeader";
import StandardsAssistant from "@/components/StandardsAssistant";
import DatasheetClassifier from "@/components/DatasheetClassifier";
import { tServer } from "@/lib/i18n";
import { aiEnabled, AI_MODEL } from "@/lib/ai";

export const dynamic = "force-dynamic";

export default function AiAssistant() {
  const { t, locale } = tServer();
  const enabled = aiEnabled();

  return (
    <>
      <PageHeader title={t("title.ai")} />
      <div className="p-6">
        <p className="text-[12px] text-muted mb-4">
          {t("ai.subtitle")}
          {enabled && (
            <span className="mono ms-2 text-[11px]" dir="ltr">
              · {AI_MODEL}
            </span>
          )}
        </p>

        {!enabled && (
          <div className="card ai-disabled">
            <b>⚠ {t("ai.disabled.title")}</b>
            <p className="small mt-1">{t("ai.disabled.body")}</p>
          </div>
        )}

        <div className="grid21">
          <StandardsAssistant locale={locale} enabled={enabled} />
          <DatasheetClassifier locale={locale} enabled={enabled} />
        </div>
      </div>
    </>
  );
}
