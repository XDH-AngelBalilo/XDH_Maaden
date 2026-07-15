import type { AssetClass, Lifecycle, Severity, CdeState } from "@/lib/types";
import { makeT, type Locale } from "@/lib/i18n-dict";

const CLASS_CHIP: Record<AssetClass, string> = {
  EQP: "c-eqp",
  STR: "c-str",
  ELE: "c-ele",
  MAT: "c-mat",
};

export function ClassChip({ klass }: { klass: AssetClass }) {
  return <span className={`chip ${CLASS_CHIP[klass]}`}>{klass}</span>;
}

const LIFECYCLE_CHIP: Record<Lifecycle, string> = {
  Registered: "c-info",
  "Data Loaded": "c-info",
  Validated: "c-warn",
  Published: "c-ok",
};

export function LifecycleChip({
  state,
  locale = "en",
}: {
  state: Lifecycle;
  locale?: Locale;
}) {
  const label = makeT(locale)(`lc.${state}`, state);
  return <span className={`chip ${LIFECYCLE_CHIP[state]}`}>{label}</span>;
}

const CDE_CHIP: Record<CdeState, string> = {
  WIP: "c-warn",
  Shared: "c-ok",
  Published: "c-ok",
  Archived: "c-info",
};

export function CdeChip({ state }: { state: CdeState }) {
  return <span className={`chip ${CDE_CHIP[state]}`}>{state}</span>;
}

export function SeverityChip({
  severity,
  locale = "en",
}: {
  severity: Severity | string;
  locale?: Locale;
}) {
  const t = makeT(locale);
  return (
    <span className={`chip ${severity === "fail" ? "c-err" : "c-warn"}`}>
      {severity === "fail" ? t("st.fail") : t("st.warn")}
    </span>
  );
}

export function ComplianceChip({
  severity,
  family,
  locale = "en",
}: {
  severity: string | null;
  family?: string | null;
  locale?: Locale;
}) {
  const t = makeT(locale);
  if (!severity) return <span className="chip c-ok">{t("cc.pass")}</span>;
  // Key is family + severity, e.g. cc.technical_fail, so both locales read
  // from one catalogue rather than concatenating translated fragments.
  const fam = family === "technical" || family === "quality" ? family : "framework";
  return (
    <span className={`chip ${severity === "fail" ? "c-err" : "c-warn"}`}>
      {t(`cc.${fam}_${severity}`)}
    </span>
  );
}

export function Rev({ rev }: { rev: string }) {
  return <span className="badge-rev">{rev}</span>;
}

export function Bar({
  pct,
  tone,
}: {
  pct: number;
  tone?: "g" | "r" | "o";
}) {
  return (
    <div className="bar">
      <i className={tone ?? ""} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}
