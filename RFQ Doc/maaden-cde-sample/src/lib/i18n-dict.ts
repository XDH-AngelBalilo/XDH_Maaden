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

  "th.tag": { en: "Tag ID", ar: "معرّف الوسم" },
  "th.class": { en: "Class", ar: "الفئة" },
  "th.productType": { en: "Product type", ar: "نوع المنتج" },
  "th.template": { en: "Template", ar: "القالب" },
  "th.rev": { en: "Rev", ar: "مراجعة" },
  "th.lifecycle": { en: "Lifecycle", ar: "دورة الحياة" },
  "th.compliance": { en: "Compliance", ar: "الامتثال" },

  "lang.toggle": { en: "العربية", ar: "English" },
};

export type Translator = (key: string, fallback?: string) => string;

export function makeT(locale: Locale): Translator {
  return (key, fallback) => {
    const entry = DICT[key];
    if (!entry) return fallback ?? key;
    return entry[locale];
  };
}
