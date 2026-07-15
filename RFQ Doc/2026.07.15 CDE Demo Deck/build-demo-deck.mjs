import pptxgen from "pptxgenjs";
import fs from "node:fs";
import path from "node:path";

const LOGO_DIR = path.resolve("logo");
const UI_DIR = path.resolve("ui");
const OUT = path.resolve("Maaden ARGP - CDE Demo.pptx");

const b64 = (dir, f) =>
  "image/png;base64," + fs.readFileSync(path.join(dir, f)).toString("base64");

const LOGO_WHITE = b64(LOGO_DIR, "deck_img1.png");
const LOGO_DARK = b64(LOGO_DIR, "doc_img2.png");

// Real screenshots of the running app, captured headless at 1500x940 @2x from
// http://localhost:3000 against the seeded demo database. Not mockups.
const UI = {
  dashboard: b64(UI_DIR, "dashboard.png"),
  registry: b64(UI_DIR, "registry.png"),
  asset: b64(UI_DIR, "asset.png"),
  compliance: b64(UI_DIR, "compliance.png"),
  publish: b64(UI_DIR, "publish.png"),
  templates: b64(UI_DIR, "templates.png"),
  complianceAr: b64(UI_DIR, "compliance-ar.png"),
};

// House rules: no AI-tell symbols (no em dashes, middots, arrow chains, accent
// lines). Ticks are fine. Every figure is read from the running demo database.

const CHARCOAL = "23242A";
const GOLD = "C9A227";
const GOLD_DK = "9A7B1A";
const INK = "1F2024";
const MUTED = "6B6D76";
const LINE = "E3E1DA";
const BG = "F4F3F0";
const OK = "2E7D32";
const WHITE = "FFFFFF";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "XD House";
pres.company = "XD House";
pres.title = "Maaden ARGP CDE Demo";

const FOOT = "XD House   |   Ma'aden ARGP CDE Asset Data Backbone   |   15 July 2026";

// Screenshot geometry: 1500x940 gives an aspect of 1.596.
const SHOT_W = 7.75;
const SHOT_H = SHOT_W / 1.5957; // 4.86

function darkSlide() {
  const s = pres.addSlide();
  s.background = { color: CHARCOAL };
  return s;
}

function lightSlide(title, kicker) {
  const s = pres.addSlide();
  s.background = { color: WHITE };
  s.addText(title, {
    x: 0.6, y: 0.42, w: 10.6, h: 0.6,
    fontFace: "Cambria", fontSize: 30, bold: true, color: INK, margin: 0,
  });
  if (kicker) {
    s.addText(kicker, {
      x: 0.6, y: 1.0, w: 10.6, h: 0.32,
      fontFace: "Calibri", fontSize: 13, color: MUTED, margin: 0,
    });
  }
  s.addImage({ data: LOGO_DARK, x: 12.35, y: 0.42, w: 0.45, h: 0.45 });
  return s;
}

function footer(s) {
  s.addText(FOOT, {
    x: 0.6, y: 6.92, w: 12.1, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: MUTED, margin: 0,
  });
}

function card(s, { x, y, w, h, fill, stroke }) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.08,
    fill: { color: fill ?? BG },
    line: { color: stroke ?? LINE, width: 0.75 },
  });
}

function tick(s, { x, y, size = 0.34, bg, fg }) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: size, h: size, fill: { color: bg }, line: { color: bg },
  });
  s.addText("✓", {
    x, y, w: size, h: size,
    fontFace: "Calibri", fontSize: size * 36, bold: true, color: fg,
    align: "center", valign: "middle", margin: 0,
  });
}

/** A screenshot with a hairline frame and a soft shadow, so it reads as a screen. */
function shot(s, { data, x, y, w = SHOT_W }) {
  const h = w / 1.5957;
  s.addImage({
    data, x, y, w, h,
    shadow: { type: "outer", color: "000000", blur: 14, offset: 3, angle: 90, opacity: 0.18 },
  });
  s.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { type: "none" },
    line: { color: LINE, width: 0.75 },
  });
  return h;
}

/** Right-hand commentary column beside a screenshot. */
function notes(s, { x, y, w, title, points }) {
  s.addText(title, {
    x, y, w, h: 0.4,
    fontFace: "Cambria", fontSize: 18, bold: true, color: INK, margin: 0,
  });
  let cy = y + 0.55;
  for (const p of points) {
    tick(s, { x, y: cy + 0.03, size: 0.22, bg: "FDF3D7", fg: GOLD_DK });
    s.addText(p, {
      x: x + 0.34, y: cy - 0.02, w: w - 0.34, h: 0.62,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15, margin: 0,
    });
    cy += 0.72;
  }
  return cy;
}

// ============ 1. TITLE ============
{
  const s = darkSlide();
  s.addImage({ data: LOGO_WHITE, x: 0.72, y: 0.6, w: 1.45, h: 1.2 });

  s.addText("Your vision, running.", {
    x: 0.72, y: 2.35, w: 6.6, h: 0.8,
    fontFace: "Cambria", fontSize: 40, bold: true, color: WHITE, margin: 0,
  });
  s.addText("Ma'aden Ar Rjum Gold Project: CDE Asset Data Backbone", {
    x: 0.72, y: 3.2, w: 6.6, h: 0.45,
    fontFace: "Calibri", fontSize: 16, color: GOLD, margin: 0,
  });
  s.addText(
    "Module M1, Master Data Registry and Data Template governance. Built, seeded and demonstrable today. Every screen in this deck is the running application.",
    {
      x: 0.72, y: 3.75, w: 6.4, h: 0.7,
      fontFace: "Calibri", fontSize: 12.5, color: "C4C5CC", lineSpacing: 17, margin: 0,
    }
  );

  const stats = [["40", "asset tags"], ["8", "templates"], ["8", "standards"], ["10", "integrations"]];
  let sx = 0.72;
  for (const [n, l] of stats) {
    s.addText(n, {
      x: sx, y: 4.75, w: 1.5, h: 0.55,
      fontFace: "Cambria", fontSize: 30, bold: true, color: GOLD, margin: 0,
    });
    s.addText(l, {
      x: sx, y: 5.32, w: 1.6, h: 0.3,
      fontFace: "Calibri", fontSize: 10.5, color: "9A9BA3", margin: 0,
    });
    sx += 1.65;
  }

  s.addText("SoW ARGP-DIGI-APP-SOW-001 Rev 00, task T-173, Gate G4 scope   |   15 July 2026", {
    x: 0.72, y: 6.35, w: 7.0, h: 0.3,
    fontFace: "Calibri", fontSize: 10, color: "9A9BA3", margin: 0,
  });

  shot(s, { data: UI.dashboard, x: 7.6, y: 1.85, w: 5.1 });
  s.addNotes(
    "Open on this: it is not a mockup, it is running on a database. Everything in this deck is a screenshot of the live app, and you can click any of it."
  );
}

// ============ 2. YOUR FOUR DIAGRAMS ============
{
  const s = lightSlide(
    "Your four diagrams, one system",
    "You described the asset data backbone. This is that description, built."
  );

  const map = [
    ["Data requirements chain", "Standard defines Product Type defines Property Set defines Data Template.", "Data Template Library: 8 templates, 24 properties, each derived from a named standard."],
    ["Governance and compliance", "Three governance inputs feed three compliance checks before a template is applied.", "Compliance Centre: 10 rules across the three families, run on demand."],
    ["Asset standards to CDE", "Four asset classes with governed IDs and revisions, published downstream.", "Asset Registry: 40 tags across STR, ELE, EQP and MAT, with revisions and lifecycle."],
    ["The CDE hub", "The CDE at the centre of six system families.", "Publish Hub: the 10 roadmap integrations, with payloads and hashes."],
  ];

  s.addText("YOUR DIAGRAM", { x: 0.85, y: 1.6, w: 3.0, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });
  s.addText("WHAT IT SAYS", { x: 4.1, y: 1.6, w: 3.6, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });
  s.addText("WHAT IS RUNNING", { x: 8.0, y: 1.6, w: 4.5, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });

  let y = 1.95;
  for (const [name, says, built] of map) {
    card(s, { x: 0.6, y, w: 12.1, h: 1.08 });
    s.addText(name, {
      x: 0.85, y: y + 0.14, w: 3.1, h: 0.8,
      fontFace: "Calibri", fontSize: 13, bold: true, color: INK, margin: 0,
    });
    s.addText(says, {
      x: 4.1, y: y + 0.14, w: 3.7, h: 0.8,
      fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14, margin: 0,
    });
    s.addText(built, {
      x: 8.0, y: y + 0.14, w: 4.5, h: 0.8,
      fontFace: "Calibri", fontSize: 11, color: OK, lineSpacing: 14, margin: 0,
    });
    y += 1.2;
  }

  s.addText(
    "Nothing here is a mockup. It runs on PostgreSQL, on the stack the Master Roadmap specifies.",
    {
      x: 0.6, y: 6.42, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
}

// ============ 3. THE TEMPLATE LIBRARY ============
{
  const s = lightSlide(
    "The Data Template chain, enforced",
    "Standard defines Product Type defines Property Set defines Data Template"
  );
  shot(s, { data: UI.templates, x: 0.6, y: 1.6 });
  notes(s, {
    x: 8.7, y: 1.75, w: 4.0,
    title: "Your common digital language",
    points: [
      "8 templates, each derived from a named standard: API 610, ASME VIII, ASTM A240, IEC 61439, IEC 60034, API 600, Maaden MCIS.",
      "Each property carries its unit, whether it is mandatory, and the rule that validates it.",
      "The template is a governed contract with its own revision and Draft to Review to Approved workflow.",
      "Every instance using the template is listed, so you can see what a change would touch.",
    ],
  });
  s.addText(
    "This screen is your vision image 3, running.",
    {
      x: 8.7, y: 5.5, w: 4.0, h: 0.5,
      fontFace: "Cambria", fontSize: 13, italic: true, color: GOLD_DK, margin: 0,
    }
  );
  footer(s);
}

// ============ 4. THE REGISTRY ============
{
  const s = lightSlide(
    "The registry: 40 governed tags",
    "Area, Unit, System, Subsystem, per SoW 3.1.3. Seeded to the ARGP gold plant."
  );
  shot(s, { data: UI.registry, x: 0.6, y: 1.6 });
  notes(s, {
    x: 8.7, y: 1.75, w: 4.0,
    title: "The MEL and Tag Register",
    points: [
      "40 tags: 17 EQP, 10 ELE, 8 STR, 5 MAT. Pumps, vessels, valves, E-Houses, motors, frames, cladding, plate.",
      "27 hierarchy nodes across 6 areas: Crushing, Grinding, CIL, Elution, Tailings, Infrastructure.",
      "Tag format, revision and lifecycle follow your conventions exactly.",
      "Filter by class, search by tag or name, drill into any node of the tree.",
    ],
  });
  s.addText(
    "This is task T-173 in the Master Roadmap, working.",
    {
      x: 8.7, y: 5.5, w: 4.0, h: 0.5,
      fontFace: "Cambria", fontSize: 13, italic: true, color: GOLD_DK, margin: 0,
    }
  );
  footer(s);
}

// ============ 5. COMPLIANCE ============
{
  const s = lightSlide(
    "Governance enforced before publication",
    "Your diagram: three governance inputs, three compliance checks, then the template applies"
  );
  shot(s, { data: UI.compliance, x: 0.6, y: 1.6 });
  notes(s, {
    x: 8.7, y: 1.75, w: 4.0,
    title: "Three check families",
    points: [
      "STRUCTURE, the asset data framework: mandatory properties, template, hierarchy, tag format.",
      "PROCESS, data quality: unit of measure, datatype, ranges, duplicate tags.",
      "CONTENT, technical and market: values against the standard's own limits.",
      "A run writes an immutable record of what was checked and what failed. Each finding links to the fix.",
    ],
  });
  s.addText(
    "The rule that stops a plate shipping cites ASTM A240 and the minimum it requires.",
    {
      x: 8.7, y: 5.5, w: 4.0, h: 0.6,
      fontFace: "Cambria", fontSize: 13, italic: true, color: GOLD_DK, lineSpacing: 18, margin: 0,
    }
  );
  footer(s);
}

// ============ 6. THE PUMP PACKAGE ============
{
  const s = lightSlide(
    "Your own example, end to end",
    "EQP-000789, the pump package from your governance diagram"
  );
  shot(s, { data: UI.asset, x: 0.6, y: 1.6 });

  s.addText("The ten minute demo", {
    x: 8.7, y: 1.75, w: 4.0, h: 0.4,
    fontFace: "Cambria", fontSize: 18, bold: true, color: INK, margin: 0,
  });

  const arc = [
    ["1", "Run validation", "40 assets checked. Three fail, each in a different family."],
    ["2", "Three causes", "A missing mandatory property. A length in feet where the template demands millimetres. A yield strength below the ASTM A240 minimum."],
    ["3", "Fix them live", "Every change records who, what, from what, to what, and when."],
    ["4", "Re-validate, publish", "Zero failures. EQP-000789 goes out with a hashed payload."],
  ];
  let ay = 2.3;
  for (const [n, t, d] of arc) {
    s.addShape(pres.ShapeType.ellipse, {
      x: 8.7, y: ay, w: 0.32, h: 0.32,
      fill: { color: CHARCOAL }, line: { color: GOLD, width: 1 },
    });
    s.addText(n, {
      x: 8.7, y: ay, w: 0.32, h: 0.32,
      fontFace: "Calibri", fontSize: 11, bold: true, color: GOLD,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(t, {
      x: 9.14, y: ay - 0.02, w: 3.6, h: 0.28,
      fontFace: "Calibri", fontSize: 12.5, bold: true, color: INK, margin: 0,
    });
    s.addText(d, {
      x: 9.14, y: ay + 0.26, w: 3.56, h: 0.66,
      fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13.5, margin: 0,
    });
    ay += 1.02;
  }

  s.addText("The dashboard goes green in front of you.", {
    x: 8.7, y: 6.35, w: 4.0, h: 0.4,
    fontFace: "Cambria", fontSize: 13, italic: true, color: GOLD_DK, margin: 0,
  });
  footer(s);
  s.addNotes("Run this live rather than talking about it. The three seeded failures are deliberate and each fails for a different reason.");
}

// ============ 7. PUBLISHING ============
{
  const s = lightSlide(
    "Publishing to your systems",
    "The CDE at the centre, per your fourth diagram. Governed data out, provably."
  );
  shot(s, { data: UI.publish, x: 0.6, y: 1.6 });
  notes(s, {
    x: 8.7, y: 1.75, w: 4.0,
    title: "Gated, and provable",
    points: [
      "The 10 roadmap integrations, mapped across your six system families. Click a family to drill in.",
      "An asset publishes only when it is Validated against an Approved template. Non-compliant assets are blocked, and the block is recorded.",
      "Every publish stores the full payload and a sha256 hash, so what went to Aconex, P6 or SAP can be proven later.",
      "Geospatial has no system named among the roadmap's ten, so it shows as planned rather than claimed.",
    ],
  });
  s.addText(
    "In the sample this is a simulator. Production swaps it for the Middleware connectors.",
    {
      x: 8.7, y: 5.72, w: 4.0, h: 0.6,
      fontFace: "Calibri", fontSize: 11, italic: true, color: MUTED, lineSpacing: 15, margin: 0,
    }
  );
  footer(s);
  s.addNotes("Say plainly that publishing is simulated in the sample. It writes a payload row rather than calling Aconex. Do not oversell it in the room.");
}

// ============ 8. ARABIC ============
{
  const s = lightSlide(
    "Built for the Kingdom, in Arabic",
    "The same screen, one click away. Full right to left layout, not a translated afterthought."
  );
  shot(s, { data: UI.complianceAr, x: 0.6, y: 1.6 });
  notes(s, {
    x: 8.7, y: 1.75, w: 4.0,
    title: "Arabic, right to left",
    points: [
      "The whole interface mirrors: navigation moves right, tables and the hierarchy tree re-lay out.",
      "Typeset in Tajawal, loaded and self-hosted rather than pulled from a public CDN at runtime.",
      "Findings are stored as a key plus data, never as English prose, so one record renders in either language.",
      "Tag IDs, standard codes and property names stay as they are, because that is how your engineers reference them.",
    ],
  });
  s.addText(
    "Dates and numerals localise too. The screen behind is the same run, in Arabic.",
    {
      x: 8.7, y: 5.72, w: 4.0, h: 0.6,
      fontFace: "Cambria", fontSize: 12.5, italic: true, color: GOLD_DK, lineSpacing: 17, margin: 0,
    }
  );
  footer(s);
}

// ============ 9. WHAT THIS PROVES ============
{
  const s = darkSlide();
  s.addImage({ data: LOGO_WHITE, x: 0.72, y: 0.62, w: 1.15, h: 0.95 });

  s.addText("What this proves", {
    x: 0.72, y: 1.95, w: 8.4, h: 0.65,
    fontFace: "Cambria", fontSize: 31, bold: true, color: WHITE, margin: 0,
  });

  const pts = [
    ["We understood the brief", "Your four diagrams describe one governed backbone. We built exactly that, down to your own pump."],
    ["We can build it on your stack", "Next.js, TypeScript, PostgreSQL, Azure-ready and KSA-resident. This is M1 and Gate G4 scope, working."],
    ["The backbone comes first", "M2 work packages, M3 checksheets, M4 ITPs and M5 procurement all consume tags, hierarchy and templates."],
  ];
  let y = 2.85;
  for (const [t, d] of pts) {
    tick(s, { x: 0.72, y: y + 0.06, size: 0.34, bg: GOLD, fg: CHARCOAL });
    s.addText(t, {
      x: 1.22, y, w: 3.6, h: 0.42,
      fontFace: "Calibri", fontSize: 15, bold: true, color: GOLD, valign: "middle", margin: 0,
    });
    s.addText(d, {
      x: 4.9, y, w: 7.6, h: 0.5,
      fontFace: "Calibri", fontSize: 12.5, color: "C4C5CC", valign: "middle", margin: 0,
    });
    y += 0.82;
  }

  card(s, { x: 0.72, y: 5.4, w: 11.9, h: 0.95, fill: "2E3038", stroke: GOLD_DK });
  s.addText(
    [
      { text: "Our recommendation.  ", options: { bold: true, color: GOLD } },
      { text: "The roadmap builds M1 in Phase 4a, yet the M2 and M3 pilots in weeks 5 to 12 already consume tags, hierarchy and templates. Pull the Master Data Registry core forward into Phase 1 and 2 as a foundation service. This demo is the evidence that it can be done.", options: { color: "D8D8DC" } },
    ],
    {
      x: 1.0, y: 5.55, w: 11.4, h: 0.7,
      fontFace: "Calibri", fontSize: 12.5, lineSpacing: 17, valign: "middle", margin: 0,
    }
  );

  s.addText("XD House   |   Ma'aden Ar Rjum Gold Project   |   15 July 2026", {
    x: 0.72, y: 6.6, w: 9.5, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: "9A9BA3", margin: 0,
  });
  s.addNotes(
    "Close on the sequencing recommendation. It is the commercially useful point: the registry is a dependency for the pilot modules, so building it first de-risks the programme."
  );
}

await pres.writeFile({ fileName: OUT });
console.log("WROTE", OUT);
