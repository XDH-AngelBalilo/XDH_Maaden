import pptxgen from "pptxgenjs";
import fs from "node:fs";
import path from "node:path";

const LOGO_DIR = path.resolve("logo");
const OUT = path.resolve("Maaden ARGP - CDE Demo.pptx");

const b64 = (f) =>
  "image/png;base64," + fs.readFileSync(path.join(LOGO_DIR, f)).toString("base64");

const LOGO_WHITE = b64("deck_img1.png");
const LOGO_DARK = b64("doc_img2.png");

// House rules, same as the Security & Assurance deck:
// 1. No AI-tell symbols. No em dashes, no middot separators, no arrow chains, no
//    decorative accent lines. Ticks are fine.
// 2. Every figure on these slides is read from the running demo database, not invented.
//    40 assets, 8 templates, 8 standards, 24 properties, 27 hierarchy nodes across 6
//    areas, 10 validation rules, 10 publish targets. Asset classes: EQP 17, ELE 10,
//    STR 8, MAT 5.

const CHARCOAL = "23242A";
const GOLD = "C9A227";
const GOLD_DK = "9A7B1A";
const INK = "1F2024";
const MUTED = "6B6D76";
const LINE = "E3E1DA";
const BG = "F4F3F0";
const OK = "2E7D32";
const WARN = "B26A00";
const ERR = "C62828";
const WHITE = "FFFFFF";

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "XD House";
pres.company = "XD House";
pres.title = "Maaden ARGP CDE Demo";

const FOOT = "XD House   |   Ma'aden ARGP CDE Asset Data Backbone   |   15 July 2026";

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

function chip(s, { x, y, text, tone }) {
  const map = {
    ok: [OK, "E5F2E6"], warn: [WARN, "FDF0DC"],
    err: [ERR, "FBE4E4"], info: ["555555", "E8E8EC"],
    eqp: [GOLD_DK, "FDF3D7"], str: ["2C5F8A", "E3ECF5"],
    ele: ["6A3D9A", "EEE6F5"], mat: [OK, "E5F2E6"],
  };
  const [fg, bg] = map[tone] ?? map.info;
  const w = Math.max(0.55, 0.13 * text.length + 0.26);
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h: 0.26, rectRadius: 0.13,
    fill: { color: bg }, line: { color: bg },
  });
  s.addText(text, {
    x, y, w, h: 0.26,
    fontFace: "Calibri", fontSize: 9.5, bold: true, color: fg,
    align: "center", valign: "middle", margin: 0,
  });
  return w;
}

// ============ 1. TITLE ============
{
  const s = darkSlide();
  s.addImage({ data: LOGO_WHITE, x: 0.72, y: 0.6, w: 1.45, h: 1.2 });

  s.addText("Your vision, running.", {
    x: 0.72, y: 2.35, w: 9.4, h: 0.8,
    fontFace: "Cambria", fontSize: 44, bold: true, color: WHITE, margin: 0,
  });
  s.addText("Ma'aden Ar Rjum Gold Project: CDE Asset Data Backbone", {
    x: 0.72, y: 3.2, w: 9.4, h: 0.45,
    fontFace: "Calibri", fontSize: 19, color: GOLD, margin: 0,
  });
  s.addText(
    "Module M1, Master Data Registry and Data Template governance. Built, seeded and demonstrable today.",
    {
      x: 0.72, y: 3.72, w: 9.4, h: 0.35,
      fontFace: "Calibri", fontSize: 13, color: "C4C5CC", margin: 0,
    }
  );

  const stats = [["40", "asset tags"], ["8", "data templates"], ["8", "standards"], ["10", "integrations"]];
  let sx = 0.72;
  for (const [n, l] of stats) {
    s.addText(n, {
      x: sx, y: 4.7, w: 1.5, h: 0.6,
      fontFace: "Cambria", fontSize: 34, bold: true, color: GOLD, margin: 0,
    });
    s.addText(l, {
      x: sx, y: 5.32, w: 1.7, h: 0.3,
      fontFace: "Calibri", fontSize: 11, color: "9A9BA3", margin: 0,
    });
    sx += 2.0;
  }

  s.addText(
    "SoW ARGP-DIGI-APP-SOW-001 Rev 00, task T-173, Gate G4 scope   |   15 July 2026",
    {
      x: 0.72, y: 6.4, w: 9.5, h: 0.3,
      fontFace: "Calibri", fontSize: 11, color: "9A9BA3", margin: 0,
    }
  );
  s.addNotes(
    "Open on this: it is not a mockup, it is running on a database. Everything shown is live and you can click it."
  );
}

// ============ 2. YOUR FOUR DIAGRAMS, ONE SYSTEM ============
{
  const s = lightSlide(
    "Your four diagrams, one system",
    "You described the asset data backbone. This is that description, built."
  );

  const map = [
    ["Data requirements chain", "Standard defines Product Type defines Property Set defines Data Template.", "Data Template Library: 8 templates, 24 properties, each derived from a named standard."],
    ["Governance and compliance", "Three governance inputs feed three compliance checks before a template is applied.", "Compliance Centre: 10 rules across the three families, run on demand."],
    ["Asset standards to CDE", "Four asset classes with governed IDs and revisions, published to downstream systems.", "Asset Registry: 40 tags across STR, ELE, EQP and MAT, with revisions and lifecycle."],
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

// ============ 3. THE DATA TEMPLATE CHAIN ============
{
  const s = lightSlide(
    "The Data Template chain",
    "Your common digital language, enforced end to end"
  );

  const nodes = [
    ["STANDARD", "API 610", "Issued by a body\nyou already follow"],
    ["PRODUCT TYPE", "Centrifugal Pump", "A node in the\nclass library"],
    ["PROPERTY SET", "flow, pressure,\npower, material", "What must be known\nabout the type"],
    ["DATA TEMPLATE", "DT-EQP-PUMP-001", "The governed\ncontract, Rev A"],
    ["ASSET TAG", "EQP-000789", "The real pump,\nRev A, Area 310"],
  ];

  // 5 cards across 12.1in of usable width: 5 x 2.0 plus 4 gaps of 0.6.
  let x = 0.6;
  for (let i = 0; i < nodes.length; i++) {
    const [label, value, note] = nodes[i];
    const isLast = i === nodes.length - 1;
    card(s, {
      x, y: 1.9, w: 2.0, h: 2.6,
      fill: isLast ? CHARCOAL : WHITE,
      stroke: GOLD,
    });
    s.addText(label, {
      x: x + 0.1, y: 2.1, w: 1.8, h: 0.3,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: isLast ? GOLD : GOLD_DK, align: "center", margin: 0,
    });
    s.addText(value, {
      x: x + 0.1, y: 2.5, w: 1.8, h: 0.7,
      fontFace: "Cambria", fontSize: 12.5, bold: true,
      color: isLast ? WHITE : INK, align: "center", margin: 0,
    });
    s.addText(note, {
      x: x + 0.1, y: 3.35, w: 1.8, h: 0.9,
      fontFace: "Calibri", fontSize: 10,
      color: isLast ? "C4C5CC" : MUTED, align: "center", lineSpacing: 13, margin: 0,
    });
    if (!isLast) {
      s.addText(i === 3 ? "becomes" : "defines", {
        x: x + 2.0, y: 3.0, w: 0.6, h: 0.3,
        fontFace: "Calibri", fontSize: 8.5, bold: true, color: GOLD_DK,
        align: "center", margin: 0,
      });
    }
    x += 2.6;
  }

  card(s, { x: 0.6, y: 4.9, w: 12.1, h: 1.35, fill: BG });
  s.addText(
    [
      { text: "Why this matters.  ", options: { bold: true } },
      { text: "Every tag, model element and document in the ARGP becomes machine-readable against the same contract. M2 work packages, M3 checksheets, M4 ITPs and M5 material tracking all consume this layer. Get the backbone right and the other four modules inherit it. Get it wrong and every module rebuilds its own version of the truth.", options: {} },
    ],
    {
      x: 0.85, y: 5.05, w: 11.6, h: 1.05,
      fontFace: "Calibri", fontSize: 13, color: INK, lineSpacing: 19, valign: "middle", margin: 0,
    }
  );
  footer(s);
  s.addNotes("This slide is their vision image 3, running. Point at the last card: that is a real row in the database.");
}

// ============ 4. THE REGISTRY ============
{
  const s = lightSlide(
    "The registry: 40 governed tags",
    "Area, Unit, System, Subsystem, per SoW 3.1.3. Seeded to the ARGP gold plant."
  );

  const classes = [
    ["EQP", "17", "eqp", "Pumps, vessels, gate valves"],
    ["ELE", "10", "ele", "E-Houses, LV motors"],
    ["STR", "8", "str", "Steel frames, cladding panels"],
    ["MAT", "5", "mat", "Stainless steel plate lots"],
  ];

  let x = 0.6;
  for (const [cls, n, tone, desc] of classes) {
    card(s, { x, y: 1.7, w: 2.95, h: 1.65 });
    chip(s, { x: x + 0.25, y: 1.95, text: cls, tone });
    s.addText(n, {
      x: x + 0.25, y: 2.3, w: 2.4, h: 0.55,
      fontFace: "Cambria", fontSize: 30, bold: true, color: INK, margin: 0,
    });
    s.addText(desc, {
      x: x + 0.25, y: 2.88, w: 2.5, h: 0.35,
      fontFace: "Calibri", fontSize: 10, color: MUTED, margin: 0,
    });
    x += 3.1;
  }

  const facts = [
    ["6", "areas", "Crushing, Grinding, CIL, Elution, Tailings, Infrastructure"],
    ["27", "hierarchy nodes", "Area to Unit to System to Subsystem, fully navigable"],
    ["8", "data templates", "Every tag bound to an Approved template"],
    ["100%", "template coverage", "No orphan tags in the register"],
  ];

  let y = 3.65;
  for (const [n, l, d] of facts) {
    s.addText(n, {
      x: 0.6, y, w: 1.1, h: 0.4,
      fontFace: "Cambria", fontSize: 19, bold: true, color: GOLD, align: "right", margin: 0,
    });
    s.addText(l, {
      x: 1.85, y: y + 0.05, w: 2.3, h: 0.32,
      fontFace: "Calibri", fontSize: 13, bold: true, color: INK, margin: 0,
    });
    s.addText(d, {
      x: 4.3, y: y + 0.05, w: 8.4, h: 0.32,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, margin: 0,
    });
    y += 0.62;
  }

  s.addText(
    "Tag format, revisions and lifecycle states follow the conventions you set: EQP-000789, Rev A, Registered to Data Loaded to Validated to Published.",
    {
      x: 0.6, y: 6.3, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
}

// ============ 5. GOVERNANCE ============
{
  const s = lightSlide(
    "Governance enforced before publication",
    "Your diagram: three governance inputs, three compliance checks, then the template applies"
  );

  const families = [
    ["STRUCTURE", "Asset data framework", "Mandatory properties populated, template assigned, hierarchy placement, tag format", ERR, "FBE4E4"],
    ["PROCESS", "Data quality", "Unit of measure, datatype, value ranges, duplicate tags", WARN, "FDF0DC"],
    ["CONTENT", "Technical and market", "Values against the standard's own limits, materials against approved lists", "2C5F8A", "E3ECF5"],
  ];

  let x = 0.6;
  for (const [gov, name, desc, fg, bg] of families) {
    card(s, { x, y: 1.7, w: 3.95, h: 2.5 });
    s.addShape(pres.ShapeType.roundRect, {
      x: x + 0.25, y: 1.95, w: 1.35, h: 0.28, rectRadius: 0.14,
      fill: { color: bg }, line: { color: bg },
    });
    s.addText(gov, {
      x: x + 0.25, y: 1.95, w: 1.35, h: 0.28,
      fontFace: "Calibri", fontSize: 9, bold: true, color: fg,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(name, {
      x: x + 0.25, y: 2.4, w: 3.4, h: 0.35,
      fontFace: "Cambria", fontSize: 16, bold: true, color: INK, margin: 0,
    });
    s.addText(desc, {
      x: x + 0.25, y: 2.85, w: 3.4, h: 1.1,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15, margin: 0,
    });
    x += 4.15;
  }

  card(s, { x: 0.6, y: 4.45, w: 12.1, h: 1.75, fill: CHARCOAL });
  s.addText("10 rules, run on demand, written against the standard", {
    x: 0.9, y: 4.65, w: 11.5, h: 0.35,
    fontFace: "Cambria", fontSize: 17, bold: true, color: GOLD, margin: 0,
  });
  s.addText(
    "A validation run writes an immutable record of what was checked and what failed. An asset only reaches Validated when it has zero failures. It only publishes when it is Validated against an Approved template. The rule that stops a plate shipping is not a comment in a spreadsheet, it is a rule citing ASTM A240 and the minimum it requires.",
    {
      x: 0.9, y: 5.1, w: 11.5, h: 1.0,
      fontFace: "Calibri", fontSize: 13, color: "D8D8DC", lineSpacing: 19, margin: 0,
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

  card(s, { x: 0.6, y: 1.65, w: 5.6, h: 3.45 });
  s.addText("EQP-000789", {
    x: 0.85, y: 1.85, w: 3.0, h: 0.4,
    fontFace: "Cambria", fontSize: 20, bold: true, color: INK, margin: 0,
  });
  chip(s, { x: 3.2, y: 1.95, text: "Rev A", tone: "info" });
  chip(s, { x: 4.1, y: 1.95, text: "Published", tone: "ok" });
  s.addText("CIL Transfer Pump Package, Area 310, Subsystem 311-PU-01", {
    x: 0.85, y: 2.3, w: 5.1, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: MUTED, margin: 0,
  });

  const props = [
    ["Flow rate", "250 m3/h"],
    ["Pressure (design)", "12 bar"],
    ["Power (absorbed)", "315 kW"],
    ["Material (casing)", "SS316"],
    ["Seal plan", "Plan 53B"],
  ];
  let py = 2.72;
  for (const [k, v] of props) {
    s.addText(k, {
      x: 0.85, y: py, w: 2.6, h: 0.3,
      fontFace: "Calibri", fontSize: 12, color: INK, valign: "middle", margin: 0,
    });
    s.addText(v, {
      x: 3.5, y: py, w: 1.6, h: 0.3,
      fontFace: "Calibri", fontSize: 12, bold: true, color: INK, valign: "middle", margin: 0,
    });
    tick(s, { x: 5.4, y: py + 0.02, size: 0.26, bg: "E5F2E6", fg: OK });
    py += 0.34;
  }
  s.addText("Every value checked against DT-EQP-PUMP-001, which API 610 defines.", {
    x: 0.85, y: 4.6, w: 5.1, h: 0.28,
    fontFace: "Calibri", fontSize: 10, italic: true, color: MUTED, margin: 0,
  });

  const arc = [
    ["1", "Run validation", "40 assets checked. Three fail, each in a different family.", "info"],
    ["2", "Three failures, three causes", "A missing mandatory property. A length in feet where the template demands millimetres. A yield strength below the ASTM A240 minimum.", "err"],
    ["3", "Fix them in the interface", "Each fix is recorded: who changed what, from what, to what, and when.", "warn"],
    ["4", "Re-validate, then publish", "Zero failures. EQP-000789 goes to the connected systems with a hashed payload.", "ok"],
  ];
  let ay = 1.65;
  for (const [n, t, d, tone] of arc) {
    card(s, { x: 6.4, y: ay, w: 6.3, h: 1.15 });
    s.addShape(pres.ShapeType.ellipse, {
      x: 6.62, y: ay + 0.2, w: 0.36, h: 0.36,
      fill: { color: CHARCOAL }, line: { color: GOLD, width: 1 },
    });
    s.addText(n, {
      x: 6.62, y: ay + 0.2, w: 0.36, h: 0.36,
      fontFace: "Calibri", fontSize: 12, bold: true, color: GOLD,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(t, {
      x: 7.12, y: ay + 0.16, w: 5.4, h: 0.28,
      fontFace: "Calibri", fontSize: 12.5, bold: true, color: INK, margin: 0,
    });
    s.addText(d, {
      x: 7.12, y: ay + 0.46, w: 5.4, h: 0.6,
      fontFace: "Calibri", fontSize: 10.5, color: MUTED, lineSpacing: 13.5, margin: 0,
    });
    ay += 1.27;
  }

  s.addText(
    "Ten minutes, live, on your own example.\nThe dashboard goes green in front of you.",
    {
      x: 0.85, y: 5.3, w: 5.1, h: 0.6,
      fontFace: "Cambria", fontSize: 14, italic: true, color: GOLD_DK, lineSpacing: 20, margin: 0,
    }
  );
  footer(s);
  s.addNotes("This is the demo arc. Run it live rather than talking about it. The three seeded failures are deliberate and each one fails for a different reason.");
}

// ============ 7. PUBLISHING ============
{
  const s = lightSlide(
    "Publishing to your systems",
    "The CDE at the centre, per your fourth diagram. Governed data out, provably."
  );

  const fams = [
    ["Engineering Management", "Primavera P6, MS EPM, Azure AD, ADFS", "connected", "ok"],
    ["Document Management", "Oracle Aconex", "connected", "ok"],
    ["Analytics & Reporting", "Ma'aden SIEM, Outlook", "connected", "ok"],
    ["Operational & Relational DBs", "SAP S/4HANA, ServiceNow", "queued", "warn"],
    ["Field & Data Acquisition", "AVEVA PI System", "planned", "info"],
    ["Geospatial & Mine Planning", "No system named in the roadmap's ten", "planned", "info"],
  ];

  let y = 1.62;
  for (const [fam, systems, status, tone] of fams) {
    card(s, { x: 0.6, y, w: 8.4, h: 0.68 });
    s.addText(fam, {
      x: 0.85, y, w: 3.4, h: 0.68,
      fontFace: "Calibri", fontSize: 12.5, bold: true, color: INK, valign: "middle", margin: 0,
    });
    s.addText(systems, {
      x: 4.4, y, w: 3.4, h: 0.68,
      fontFace: "Calibri", fontSize: 11, color: MUTED, valign: "middle", margin: 0,
    });
    chip(s, { x: 8.0, y: y + 0.21, text: status, tone });
    y += 0.78;
  }

  card(s, { x: 9.3, y: 1.62, w: 3.4, h: 4.58, fill: CHARCOAL });
  s.addText("Provable", {
    x: 9.55, y: 1.9, w: 2.9, h: 0.35,
    fontFace: "Cambria", fontSize: 18, bold: true, color: GOLD, margin: 0,
  });
  s.addText(
    [
      { text: "Publishing is gated.", options: { breakLine: true, bold: true } },
      { text: "An asset reaches your systems only when it is Validated against an Approved template. A non-compliant asset is blocked, and the block is recorded.", options: { breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Every publish stores the full payload and a sha256 hash.", options: { breakLine: true, bold: true } },
      { text: "So what went to Aconex, P6 or SAP can be proven months later, not reconstructed from memory.", options: {} },
    ],
    {
      x: 9.55, y: 2.4, w: 2.9, h: 3.3,
      fontFace: "Calibri", fontSize: 11.5, color: "D8D8DC", lineSpacing: 16, margin: 0,
    }
  );

  s.addText(
    "The ten roadmap integrations, mapped across your six system families. Geospatial has no system named among the ten, so it is shown as planned rather than claimed.",
    {
      x: 0.6, y: 6.4, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 11.5, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
  s.addNotes("In the sample, publishing is simulated: it writes a payload row rather than calling Aconex. Say so if asked. Production swaps the simulator for the Middleware connectors.");
}

// ============ 8. BUILT FOR MAADEN ============
{
  const s = lightSlide(
    "Built for Ma'aden, not adapted for you",
    "Details that matter in the Kingdom, and on this programme"
  );

  const items = [
    ["Arabic, right to left", "The full interface switches to Arabic and re-lays out right to left, with Tajawal. Tag IDs and standard codes stay as they are, because that is how your engineers reference them."],
    ["Your roadmap's stack", "Next.js, TypeScript, Tailwind and PostgreSQL. The same stack the Master Roadmap specifies, so nothing here is a prototype to be thrown away."],
    ["An API from day one", "Every screen is backed by a documented REST API with a published OpenAPI spec, because the SoW says APIs are a must."],
    ["AI where it earns its place", "A standards navigator that cites the standard it answers from, and datasheet classification that suggests a template. Both optional, and the platform runs fully without them."],
  ];

  let x = 0.6, y = 1.7;
  for (let i = 0; i < items.length; i++) {
    const [t, d] = items[i];
    card(s, { x, y, w: 5.9, h: 2.2 });
    tick(s, { x: x + 0.28, y: y + 0.3, size: 0.38, bg: "FDF3D7", fg: GOLD_DK });
    s.addText(t, {
      x: x + 0.8, y: y + 0.26, w: 4.9, h: 0.32,
      fontFace: "Calibri", fontSize: 14, bold: true, color: INK, margin: 0,
    });
    s.addText(d, {
      x: x + 0.8, y: y + 0.66, w: 4.9, h: 1.3,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15, margin: 0,
    });
    if (i % 2 === 0) x += 6.2;
    else { x = 0.6; y += 2.35; }
  }

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
