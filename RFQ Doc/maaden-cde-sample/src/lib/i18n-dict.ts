// Client-safe i18n: dictionary + translator, no server-only imports.
export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];
export const LOCALE_COOKIE = "cde_locale";

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

type Dict = Record<string, { en: string; ar: string }>;

// Light UI dictionary — chrome, screen titles, section headers, labels,
// buttons, and status words. Domain data (tags, standards codes, property
// names) stays language-neutral, matching how Maaden references them.
const DICT: Dict = {
  "app.brand": { en: "ARGP CDE", ar: "المستودع الموحد" },
  "app.tagline": {
    en: "Module M1 — Asset Data Backbone · XD House",
    ar: "الوحدة M1 — العمود الفقري لبيانات الأصول · XD House",
  },

  "nav.dash": { en: "Dashboard", ar: "لوحة المعلومات" },
  "nav.templates": { en: "Data Template Library", ar: "مكتبة قوالب البيانات" },
  "nav.registry": { en: "Asset Registry", ar: "سجل الأصول" },
  "nav.compliance": { en: "Compliance Centre", ar: "مركز الامتثال" },
  "nav.publish": { en: "Publish Hub", ar: "مركز النشر" },
  "nav.governance": { en: "Governance & Admin", ar: "الحوكمة والإدارة" },
  "nav.ai": { en: "AI Assistant", ar: "المساعد الذكي" },

  "role.governance_lead": { en: "Data Governance Lead", ar: "قائد حوكمة البيانات" },
  "role.engineer": { en: "Discipline Engineer", ar: "مهندس تخصص" },
  "role.doc_controller": { en: "Document Controller", ar: "مراقب الوثائق" },
  "role.viewer": { en: "Viewer / Downstream", ar: "مستعرض / الأنظمة التابعة" },

  "crumb.root": {
    en: "ARGP › Ar Rjum Gold Project › CDE",
    ar: "ARGP › مشروع الرجوم للذهب › المستودع الموحد",
  },
  "btn.export": { en: "Export", ar: "تصدير" },
  "btn.registerAsset": { en: "+ Register Asset", ar: "+ تسجيل أصل" },
  "btn.runValidation": { en: "▶ Run validation", ar: "▶ تشغيل التحقق" },
  "btn.running": { en: "Running…", ar: "جارٍ التشغيل…" },
  "btn.fix": { en: "Fix", ar: "إصلاح" },
  "btn.register": { en: "Register", ar: "تسجيل" },
  "btn.registering": { en: "Registering…", ar: "جارٍ التسجيل…" },
  "btn.publishing": { en: "Publishing…", ar: "جارٍ النشر…" },

  "dash.title": { en: "Dashboard", ar: "لوحة المعلومات" },
  "kpi.assets": { en: "Assets registered", ar: "الأصول المسجلة" },
  "kpi.coverage": { en: "Template coverage", ar: "تغطية القوالب" },
  "kpi.passRate": { en: "Compliance pass rate", ar: "معدل اجتياز الامتثال" },
  "kpi.published": { en: "Published assets", ar: "الأصول المنشورة" },
  "kpi.assetClasses": { en: "4 asset classes", ar: "4 فئات أصول" },
  "kpi.noRun": { en: "no run yet", ar: "لا يوجد تشغيل بعد" },
  "kpi.targetFamilies": { en: "target families", ar: "عائلات الأنظمة" },
  "dash.lifecycle": { en: "Assets by lifecycle state", ar: "الأصول حسب حالة دورة الحياة" },
  "dash.lifecycleSub": { en: "Registered → Published", ar: "مسجّل ← منشور" },
  "dash.findings": { en: "Compliance findings by family", ar: "نتائج الامتثال حسب العائلة" },
  "dash.lastRun": { en: "last validation run", ar: "آخر تشغيل تحقق" },
  "dash.chain": { en: "The Data Template chain", ar: "سلسلة قالب البيانات" },
  "dash.chainSub": { en: "client vision — image 3", ar: "رؤية العميل — صورة 3" },
  "dash.demoNote": {
    en: "⚠ 3 demo assets seeded to fail — see Compliance Centre.",
    ar: "⚠ 3 أصول تجريبية مهيأة للفشل — راجع مركز الامتثال.",
  },

  "lc.Registered": { en: "Registered", ar: "مسجّل" },
  "lc.Data Loaded": { en: "Data Loaded", ar: "تم تحميل البيانات" },
  "lc.Validated": { en: "Validated", ar: "تم التحقق" },
  "lc.Published": { en: "Published", ar: "منشور" },

  "fam.framework": { en: "Asset data framework", ar: "إطار بيانات الأصول" },
  "fam.quality": { en: "Data quality", ar: "جودة البيانات" },
  "fam.technical": { en: "Technical & market", ar: "التقني والسوقي" },

  "st.pass": { en: "Pass", ar: "ناجح" },
  "st.fail": { en: "Fail", ar: "فاشل" },
  "st.warn": { en: "Warn", ar: "تحذير" },
  "st.clear": { en: "clear", ar: "خالٍ" },

  "title.templates": { en: "Data Template Library", ar: "مكتبة قوالب البيانات" },
  "title.registry": { en: "Asset Registry", ar: "سجل الأصول" },
  "title.compliance": { en: "Compliance Centre", ar: "مركز الامتثال" },
  "title.publish": { en: "Publish Hub", ar: "مركز النشر" },
  "title.governance": { en: "Governance & Admin", ar: "الحوكمة والإدارة" },
  "title.ai": { en: "AI Assistant", ar: "المساعد الذكي" },

  "ai.subtitle": {
    en: "Claude-assisted standards navigation & template classification (phase 2)",
    ar: "التنقل في المعايير وتصنيف القوالب بمساعدة Claude (المرحلة 2)",
  },
  "ai.disabled.title": { en: "AI features are disabled", ar: "ميزات الذكاء الاصطناعي معطّلة" },
  "ai.disabled.body": {
    en: "Set ANTHROPIC_API_KEY in .env.local and restart to enable the standards assistant and datasheet classification. The rest of the CDE runs without it.",
    ar: "عيّن ANTHROPIC_API_KEY في .env.local وأعد التشغيل لتفعيل مساعد المعايير وتصنيف صحائف البيانات. يعمل باقي المستودع بدونها.",
  },
  "ai.rag.title": { en: "Standards navigator", ar: "متصفّح المعايير" },
  "ai.rag.sub": {
    en: "Ask about the standards register — answers cite the source standard.",
    ar: "اسأل عن سجل المعايير — تستشهد الإجابات بالمعيار المصدر.",
  },
  "ai.rag.placeholder": {
    en: "e.g. What minimum yield strength does ASTM A240 require for SS plate?",
    ar: "مثال: ما الحد الأدنى لقوة الخضوع الذي يتطلبه ASTM A240 لألواح الفولاذ المقاوم للصدأ؟",
  },
  "ai.rag.ask": { en: "Ask", ar: "اسأل" },
  "ai.rag.refs": { en: "References consulted", ar: "المراجع المستشارة" },
  "ai.classify.title": { en: "Datasheet auto-classification", ar: "التصنيف التلقائي لصحيفة البيانات" },
  "ai.classify.sub": {
    en: "Paste datasheet text — Claude suggests the product type & data template.",
    ar: "الصق نص صحيفة البيانات — يقترح Claude نوع المنتج وقالب البيانات.",
  },
  "ai.classify.placeholder": {
    en: "Paste datasheet text (e.g. Centrifugal pump, flow 250 m³/h, head 120 m, 315 kW motor, casing SS316)…",
    ar: "الصق نص صحيفة البيانات (مثال: مضخة طرد مركزي، تدفق 250 م³/س، رأس 120 م، محرك 315 كيلوواط، غلاف SS316)…",
  },
  "ai.classify.run": { en: "Classify", ar: "صنّف" },
  "ai.classify.suggested": { en: "Suggested template", ar: "القالب المقترح" },
  "ai.classify.confidence": { en: "Confidence", ar: "الثقة" },
  "ai.classify.none": { en: "No matching template in the catalogue.", ar: "لا يوجد قالب مطابق في الكتالوج." },
  "ai.openTemplate": { en: "Open in Template Library →", ar: "افتح في مكتبة القوالب ←" },
  "ai.thinking": { en: "Asking Claude…", ar: "جارٍ سؤال Claude…" },

  "th.tag": { en: "Tag ID", ar: "معرّف الوسم" },
  "th.class": { en: "Class", ar: "الفئة" },
  "th.productType": { en: "Product type", ar: "نوع المنتج" },
  "th.template": { en: "Template", ar: "القالب" },
  "th.rev": { en: "Rev", ar: "مراجعة" },
  "th.lifecycle": { en: "Lifecycle", ar: "دورة الحياة" },
  "th.compliance": { en: "Compliance", ar: "الامتثال" },
  "th.asset": { en: "Asset", ar: "الأصل" },
  "th.family": { en: "Family", ar: "العائلة" },
  "th.severity": { en: "Severity", ar: "الخطورة" },
  "th.finding": { en: "Finding", ar: "النتيجة" },
  "th.action": { en: "Action", ar: "الإجراء" },

  // ---- Asset Registry chrome
  "reg.hierarchy": { en: "Plant hierarchy", ar: "هيكل المنشأة" },
  "reg.allAreas": { en: "All areas", ar: "كل المناطق" },
  "reg.assets": { en: "Assets", ar: "الأصول" },
  "reg.tags": { en: "tags", ar: "وسم" },
  "reg.search": { en: "Search tag or name…", ar: "ابحث عن وسم أو اسم…" },
  "reg.allClasses": { en: "All classes", ar: "كل الفئات" },
  "reg.noMatch": { en: "No assets match the current filter.", ar: "لا توجد أصول مطابقة للتصفية الحالية." },
  "reg.notValidated": { en: "not validated", ar: "لم يتم التحقق" },
  "reg.area": { en: "Area", ar: "منطقة" },

  // ---- Compliance Centre chrome
  "comp.overallPass": { en: "Overall pass", ar: "الاجتياز الإجمالي" },
  "comp.frameworkFails": { en: "Framework fails", ar: "إخفاقات الإطار" },
  "comp.warnings": { en: "Warnings", ar: "التحذيرات" },
  "comp.qualityTechFails": { en: "Quality + technical fails", ar: "إخفاقات الجودة والتقنية" },
  "comp.pipeline": { en: "Validation pipeline", ar: "مسار التحقق" },
  "comp.pipelineSub": {
    en: "client vision image 2 — 3 check families before DT use",
    ar: "رؤية العميل صورة 2 — ثلاث عائلات فحص قبل استخدام القالب",
  },
  "comp.lastRun": { en: "last run", ar: "آخر تشغيل" },
  "comp.assetsChecked": { en: "assets", ar: "أصل" },
  "comp.openFindings": { en: "Open findings", ar: "النتائج المفتوحة" },
  "comp.findingsCount": { en: "findings", ar: "نتيجة" },
  "comp.noRun": { en: "no run yet, press Run validation", ar: "لا يوجد تشغيل بعد، اضغط تشغيل التحقق" },
  "comp.allClear": { en: "All clear", ar: "الكل سليم" },
  "comp.allClearNote": {
    en: "zero findings in this run. Assets moved to Validated.",
    ar: "لا توجد نتائج في هذا التشغيل. تم نقل الأصول إلى حالة تم التحقق.",
  },
  "comp.step.structure": { en: "STRUCTURE", ar: "الهيكل" },
  "comp.step.process": { en: "PROCESS", ar: "العملية" },
  "comp.step.content": { en: "CONTENT", ar: "المحتوى" },
  "comp.step.result": { en: "RESULT", ar: "النتيجة" },
  "comp.step.structureBody": {
    en: "Governance & methodology to asset data framework compliance",
    ar: "الحوكمة والمنهجية نحو الامتثال لإطار بيانات الأصول",
  },
  "comp.step.processBody": {
    en: "Data structure to data quality compliance",
    ar: "هيكل البيانات نحو الامتثال لجودة البيانات",
  },
  "comp.step.contentBody": {
    en: "Technical spec standards to technical & market compliance",
    ar: "معايير المواصفات التقنية نحو الامتثال التقني والسوقي",
  },
  "comp.step.resultBody": {
    en: "Data Template certified, asset publishable",
    ar: "اعتماد قالب البيانات، الأصل قابل للنشر",
  },

  // ---- Compliance chips shown on the registry
  "cc.pass": { en: "Pass", ar: "ناجح" },
  "cc.framework_fail": { en: "Framework fail", ar: "إخفاق الإطار" },
  "cc.framework_warn": { en: "Framework warn", ar: "تحذير الإطار" },
  "cc.quality_fail": { en: "Quality fail", ar: "إخفاق الجودة" },
  "cc.quality_warn": { en: "Quality warn", ar: "تحذير الجودة" },
  "cc.technical_fail": { en: "Technical fail", ar: "إخفاق تقني" },
  "cc.technical_warn": { en: "Technical warn", ar: "تحذير تقني" },

  "lang.toggle": { en: "العربية", ar: "English" },

  // ---- Validation findings -------------------------------------------------
  // The engine stores a key + params (never prose); these render it per locale.
  // Placeholders are {name} and are substituted from the finding's params.
  "finding.no_template": {
    en: "No data template assigned",
    ar: "لم يتم تعيين قالب بيانات",
  },
  "finding.mandatory_missing": {
    en: 'Mandatory property "{property}" not populated',
    ar: 'الخاصية الإلزامية "{property}" غير مُعبّأة',
  },
  "finding.no_hierarchy": {
    en: "No plant hierarchy node assigned",
    ar: "لم يتم تعيين عقدة في هيكل المنشأة",
  },
  "finding.not_subsystem": {
    en: "Tag not yet assigned to subsystem node",
    ar: "لم يتم تعيين الوسم إلى عقدة نظام فرعي بعد",
  },
  "finding.tag_format": {
    en: 'Tag "{tag}" does not match {CLASS}-{6 digits}',
    ar: 'الوسم "{tag}" لا يطابق الصيغة {CLASS}-{6 digits}',
  },
  "finding.duplicate_tag": {
    en: 'Duplicate tag "{tag}"',
    ar: 'وسم مكرر "{tag}"',
  },
  "finding.uom_mismatch": {
    en: 'UoM mismatch: {property} given in "{actual}", template requires "{expected}"',
    ar: 'عدم تطابق وحدة القياس: {property} مُدخلة بـ "{actual}"، والقالب يتطلب "{expected}"',
  },
  "finding.datatype_number": {
    en: '{property}: "{value}" is not a valid number',
    ar: '{property}: القيمة "{value}" ليست رقمًا صالحًا',
  },
  "finding.datatype_boolean": {
    en: '{property}: "{value}" is not a valid boolean',
    ar: '{property}: القيمة "{value}" ليست قيمة منطقية صالحة',
  },
  "finding.range": {
    en: "{property} = {value} outside template range [{min}, {max}]",
    ar: "{property} = {value} خارج نطاق القالب [{min}, {max}]",
  },
  "finding.enum": {
    en: '{property} "{value}" not in approved list {{allowed}}',
    ar: '{property} "{value}" غير مدرجة في القائمة المعتمدة {{allowed}}',
  },
  "finding.standard_limit": {
    en: "{property} {value} {uom} violates {standard} limit ({op} {limit})",
    ar: "{property} {value} {uom} يخالف حد {standard} ({op} {limit})",
  },
};

export type Translator = (key: string, fallback?: string) => string;

export function makeT(locale: Locale): Translator {
  return (key, fallback) => {
    const entry = DICT[key];
    if (!entry) return fallback ?? key;
    return entry[locale];
  };
}

/** Params carried by a finding — values are substituted into {placeholders}. */
export type FindingParams = Record<string, string | number | null | undefined>;

/**
 * Render a stored finding (message_key + params) into the given locale.
 * Unknown keys fall back to the key itself so a missing translation is visible
 * rather than silently blank. Missing params render as an empty string.
 */
export function formatFinding(
  locale: Locale,
  key: string,
  params: FindingParams = {}
): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[locale]
    .replace(/\{(\w+)\}/g, (match, name: string) => {
      const v = params[name];
      // Leave literal placeholders that are part of the message itself
      // (e.g. {CLASS} in the tag-format message) untouched when unsupplied.
      if (v === undefined || v === null) return match;
      return String(v);
    })
    .trim();
}
