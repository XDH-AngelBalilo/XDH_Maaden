import pptxgen from "pptxgenjs";
import fs from "node:fs";
import path from "node:path";

const LOGO_DIR = path.resolve("logo");
const OUT = path.resolve("Maaden ARGP - Security & Assurance.pptx");

const b64 = (f) =>
  "image/png;base64," + fs.readFileSync(path.join(LOGO_DIR, f)).toString("base64");

const LOGO_WHITE = b64("deck_img1.png"); // XD House logo, reversed (dark bg)
const LOGO_DARK = b64("doc_img2.png"); // XD House logo, dark (light bg)
const KITEMARK = b64("doc_img3.png"); // BSI Kitemark BIM D&C + BIM Security

// House rules for this deck:
// 1. No AI-tell symbols. No em dashes, no middot separators, no arrow chains, no
//    decorative accent lines. Restructure the sentence instead of leaning on a dash.
//    Ticks are fine and are used as pass markers.
// 2. Scope is the DELIVERED PLATFORM. Nothing about the pre-award demo's own security
//    posture: the demo is a sales artifact on a laptop, not what Maaden is buying, and
//    airing its localhost gaps invites the wrong conclusion about the product.

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
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "XD House";
pres.company = "XD House";
pres.title = "Maaden ARGP Security and Assurance";

const FOOT = "XD House   |   Ma'aden ARGP Security & Assurance   |   15 July 2026";

// ---------- helpers ----------
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

function card(s, { x, y, w, h, fill }) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: fill ?? BG },
    line: { color: LINE, width: 0.75 },
  });
}

/** Tick in a filled circle, used as a control-in-place marker. */
function tick(s, { x, y, size = 0.34, bg, fg }) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: size, h: size,
    fill: { color: bg }, line: { color: bg },
  });
  s.addText("✓", {
    x, y, w: size, h: size,
    fontFace: "Calibri", fontSize: size * 36, bold: true, color: fg,
    align: "center", valign: "middle", margin: 0,
  });
}

function chip(s, { x, y, text, tone }) {
  const map = {
    ok: [OK, "E5F2E6"],
    warn: ["B26A00", "FDF0DC"],
    err: ["C62828", "FBE4E4"],
    info: ["555555", "E8E8EC"],
  };
  const [fg, bg] = map[tone] ?? map.info;
  const w = Math.max(0.62, 0.13 * text.length + 0.28);
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

  s.addText("Security & Assurance", {
    x: 0.72, y: 2.35, w: 9.4, h: 0.8,
    fontFace: "Cambria", fontSize: 44, bold: true, color: WHITE, margin: 0,
  });
  s.addText("Ma'aden Ar Rjum Gold Project: Digitalization Platform", {
    x: 0.72, y: 3.2, w: 9.4, h: 0.45,
    fontFace: "Calibri", fontSize: 19, color: GOLD, margin: 0,
  });
  s.addText("How we secure your asset data, and how we prove it.", {
    x: 0.72, y: 3.72, w: 9.4, h: 0.35,
    fontFace: "Calibri", fontSize: 13, color: "C4C5CC", margin: 0,
  });

  s.addText(
    [
      { text: "SoW ARGP-DIGI-APP-SOW-001 Rev 00, §3.4", options: { breakLine: true } },
      { text: "Master Roadmap XDH-AE-Q26-05-00030 v1.0", options: { breakLine: true } },
      { text: "15 July 2026", options: {} },
    ],
    {
      x: 0.72, y: 4.75, w: 6, h: 1.1,
      fontFace: "Calibri", fontSize: 12, color: "9A9BA3", lineSpacing: 18, margin: 0,
    }
  );

  s.addShape(pres.ShapeType.roundRect, {
    x: 9.55, y: 5.5, w: 3.15, h: 1.32, rectRadius: 0.06,
    fill: { color: WHITE }, line: { color: WHITE },
  });
  s.addImage({ data: KITEMARK, x: 9.75, y: 5.86, w: 2.75, h: 0.61 });
  s.addNotes(
    "Scope: the delivered platform. Do not raise the pre-award demo's own configuration. It is a laptop sales artifact, not what Maaden is procuring."
  );
}

// ============ 2. WHAT YOUR SECURITY TEAM WILL ASK ============
{
  const s = lightSlide(
    "What your security team will ask",
    "The questions that decide whether a platform is approved, answered in this pack"
  );

  const items = [
    ["Where is our data stored? Onshore or offshore?", "Kingdom of Saudi Arabia. Azure Riyadh."],
    ["Do you encrypt data at rest and in transit?", "TLS 1.2+ end to end. TDE at rest. Keys in Key Vault."],
    ["Who can get in, and how?", "Your Azure AD and ADFS. SAML 2.0. MFA enforced."],
    ["When was your last penetration test?", "Committed before go-live, by an independent firm."],
    ["Do you have an incident response plan?", "Yes. Signed, tested, and in this pack."],
  ];

  let y = 1.7;
  for (const [q, a] of items) {
    card(s, { x: 0.6, y, w: 12.1, h: 0.82 });
    s.addText(q, {
      x: 0.85, y, w: 5.5, h: 0.82,
      fontFace: "Calibri", fontSize: 13, bold: true, color: INK, valign: "middle", margin: 0,
    });
    s.addText(a, {
      x: 6.6, y, w: 5.9, h: 0.82,
      fontFace: "Calibri", fontSize: 12.5, color: MUTED, valign: "middle", margin: 0,
    });
    y += 0.94;
  }

  s.addText(
    "Deals do not end with a rejection at this gate. They end with silence. This pack is the answer, sent before the questionnaire arrives.",
    {
      x: 0.6, y: 6.4, w: 12.1, h: 0.4,
      fontFace: "Cambria", fontSize: 15, italic: true, color: GOLD_DK, margin: 0,
    }
  );
  footer(s);
}

// ============ 3. THE 13 CONTROL LAYERS ============
{
  const s = lightSlide(
    "The 13 control layers we implement",
    "Every layer is a build item with an owner and a roadmap gate, not a statement of intent"
  );

  const rows = [
    ["1", "Authentication & session", "Azure AD and ADFS SSO, SAML 2.0, MFA enforced"],
    ["2", "Authorization / RBAC", "Four least-privilege roles, enforced server-side"],
    ["3", "Data protection", "TLS 1.2+ in transit, Azure TDE at rest"],
    ["4", "Database", "Azure PostgreSQL, private endpoint, TLS only"],
    ["5", "Input validation & injection", "Parameterised queries, schema validation at the API"],
    ["6", "Secrets management", "Azure Key Vault, managed identity, rotation policy"],
    ["7", "Dependencies & supply chain", "CI scanning, patch SLA by severity, SBOM"],
    ["8", "Browser hardening", "CSP, HSTS and security headers at Front Door"],
    ["9", "Hosting & network", "App Service Riyadh, WAF, private networking"],
    ["10", "Deployment & CI/CD", "Gated pipelines, no manual production access"],
    ["11", "Logging, audit & monitoring", "Immutable audit trail, events to your Azure Sentinel"],
    ["12", "Scaling & availability", "Autoscale, health probes, defined SLO"],
    ["13", "Backup & disaster recovery", "Point-in-time restore, RPO and RTO, restore drills"],
  ];

  s.addText("LAYER", { x: 0.95, y: 1.55, w: 3.4, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });
  s.addText("WHAT WE IMPLEMENT", { x: 5.0, y: 1.55, w: 4.5, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });

  let y = 1.85;
  for (const [n, layer, impl] of rows) {
    s.addText(n, { x: 0.6, y, w: 0.3, h: 0.3, fontFace: "Calibri", fontSize: 10, color: MUTED, align: "right", margin: 0 });
    s.addText(layer, { x: 0.95, y, w: 3.9, h: 0.3, fontFace: "Calibri", fontSize: 11.5, bold: true, color: INK, valign: "middle", margin: 0 });
    s.addText(impl, { x: 5.0, y, w: 5.9, h: 0.3, fontFace: "Calibri", fontSize: 11, color: MUTED, valign: "middle", margin: 0 });
    y += 0.345;
  }

  card(s, { x: 11.15, y: 1.85, w: 1.6, h: 4.55, fill: CHARCOAL });
  s.addText("13", {
    x: 11.15, y: 2.1, w: 1.6, h: 0.7,
    fontFace: "Cambria", fontSize: 40, bold: true, color: GOLD, align: "center", margin: 0,
  });
  s.addText("layers, each mapped to the SoW clause it satisfies and the Azure service that delivers it.\n\nDetail in document 02.", {
    x: 11.35, y: 2.95, w: 1.25, h: 3.2,
    fontFace: "Calibri", fontSize: 10, color: "D8D8DC", lineSpacing: 14, margin: 0,
  });

  footer(s);
}

// ============ 4. MEETING MA'ADEN'S REQUIREMENTS ============
{
  const s = lightSlide(
    "Meeting Ma'aden's stated requirements",
    "Mapped to SoW ARGP-DIGI-APP-SOW-001 §3.4 and the Master Roadmap"
  );

  const reqs = [
    ["Data residency: Kingdom of Saudi Arabia", "Azure App Service and Azure Database for PostgreSQL, Riyadh region. No Ma'aden production data offshore."],
    ["Azure AD and ADFS SSO, SAML 2.0, MFA", "Your identity provider is the source of truth. MFA enforced. Four least-privilege roles. No local accounts."],
    ["Encryption in transit and at rest", "TLS 1.2+ from browser to app to database, HSTS at the edge. Azure TDE at rest. Keys in Azure Key Vault."],
    ["SIEM integration", "Production security events forwarded to Ma'aden's Azure Sentinel."],
    ["Immutable audit trail (§3.1.4)", "Who, what, before and after, when. Enforced in the platform, not a convention."],
    ["RESTful APIs with access control (§3.4.4)", "OpenAPI spec published. Every mutating route is role-gated server-side."],
  ];

  let y = 1.6;
  for (const [r, how] of reqs) {
    tick(s, { x: 0.62, y: y + 0.12, size: 0.3, bg: CHARCOAL, fg: GOLD });
    s.addText(r, {
      x: 1.08, y, w: 4.6, h: 0.52,
      fontFace: "Calibri", fontSize: 13, bold: true, color: INK, valign: "middle", margin: 0,
    });
    s.addText(how, {
      x: 5.85, y, w: 6.85, h: 0.52,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, valign: "middle", margin: 0,
    });
    y += 0.68;
  }

  card(s, { x: 0.6, y: 5.85, w: 12.1, h: 0.85, fill: BG });
  s.addText(
    "Each of these is a requirement Ma'aden set in the Statement of Work. This pack states how we satisfy it, and document 03 states how it is proven before go-live.",
    {
      x: 0.85, y: 5.95, w: 11.6, h: 0.65,
      fontFace: "Calibri", fontSize: 11.5, color: INK, valign: "middle", margin: 0,
    }
  );
  footer(s);
}

// ============ 5. PROTECTING DATA INTEGRITY ============
{
  const s = lightSlide(
    "Protecting the integrity of your data",
    "Beyond infrastructure: governed engineering data cannot be quietly altered"
  );

  const controls = [
    ["Immutable audit trail", "Every change records who did it, what changed, the value before and after, and when. The trail cannot be edited from the application. This is the control SoW §3.1.4 requires."],
    ["Approved data is immutable", "A change to an Approved asset creates a new revision and forces re-validation. There is no path to silently overwrite approved engineering data."],
    ["Governed publishing", "An asset reaches your downstream systems only when it is Validated against an Approved data template. Non-compliant assets are blocked, and the block is recorded."],
    ["Provable payloads", "Every publish stores the full payload and a sha256 hash, so what was sent to Aconex, P6 or SAP can be proven later."],
  ];

  let y = 1.7;
  for (const [t, d] of controls) {
    card(s, { x: 0.6, y, w: 12.1, h: 1.1 });
    tick(s, { x: 0.85, y: y + 0.34, size: 0.42, bg: "E5F2E6", fg: OK });
    s.addText(t, {
      x: 1.45, y: y + 0.16, w: 3.6, h: 0.3,
      fontFace: "Calibri", fontSize: 13.5, bold: true, color: INK, margin: 0,
    });
    s.addText(d, {
      x: 5.2, y: y + 0.14, w: 7.3, h: 0.8,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15, margin: 0,
    });
    y += 1.22;
  }

  s.addText(
    "These controls are built into the platform architecture and are demonstrable today in the CDE prototype.",
    {
      x: 0.6, y: 6.42, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
}

// ============ 6. ASSURANCE ============
{
  const s = lightSlide(
    "How the controls are proven",
    "Controls that are never tested are claims, not controls"
  );

  const steps = [
    ["01", "AUDIT", "13-layer internal review\nbefore each gate", "Each gate"],
    ["02", "REMEDIATE", "Close what the audit\nsurfaced", "Before the gate closes"],
    ["03", "PEN TEST", "Independent firm\nattempts to break in", "Before go-live"],
    ["04", "RE-AUDIT", "Confirm the fixes held,\nnothing regressed", "After each test"],
  ];

  let x = 0.6;
  for (const [num, title, desc, when] of steps) {
    card(s, { x, y: 1.75, w: 2.85, h: 2.9 });
    s.addShape(pres.ShapeType.ellipse, {
      x: x + 0.25, y: 2.0, w: 0.62, h: 0.62,
      fill: { color: CHARCOAL }, line: { color: GOLD, width: 1.5 },
    });
    s.addText(num, {
      x: x + 0.25, y: 2.0, w: 0.62, h: 0.62,
      fontFace: "Calibri", fontSize: 15, bold: true, color: GOLD,
      align: "center", valign: "middle", margin: 0,
    });
    s.addText(title, {
      x: x + 0.25, y: 2.78, w: 2.35, h: 0.32,
      fontFace: "Calibri", fontSize: 14, bold: true, color: INK, margin: 0,
    });
    s.addText(desc, {
      x: x + 0.25, y: 3.16, w: 2.35, h: 0.75,
      fontFace: "Calibri", fontSize: 12, color: MUTED, lineSpacing: 16, margin: 0,
    });
    chip(s, { x: x + 0.25, y: 4.05, text: when, tone: "info" });
    x += 3.1;
  }

  card(s, { x: 0.6, y: 4.95, w: 12.1, h: 1.25, fill: "FDF3D7" });
  s.addText(
    [
      { text: "Why this order.  ", options: { bold: true } },
      { text: "An internal audit finds the known gaps cheaply, so we close those first. Only then do we pay an external firm, and the engagement is spent finding what we missed rather than rediscovering what we already documented. You receive the audit scorecard, the penetration test report, and the retest letter confirming findings were closed.", options: {} },
    ],
    {
      x: 0.85, y: 5.1, w: 11.6, h: 0.95,
      fontFace: "Calibri", fontSize: 13, color: INK, lineSpacing: 19, valign: "middle", margin: 0,
    }
  );
  footer(s);
  s.addNotes("If asked when the last pen test was: none yet for this platform, because it is not yet built. It is committed before go-live and already scoped. Never present a plan as a result.");
}

// ============ 7. CERTIFICATION ============
{
  const s = lightSlide("Independent certification", "Third-party assessed, not self-declared");

  card(s, { x: 0.6, y: 1.75, w: 6.0, h: 3.5 });
  s.addImage({ data: KITEMARK, x: 0.95, y: 2.15, w: 5.3, h: 1.75 });
  s.addText("BSI Kitemark for BIM Design and Construction, and for BIM Security", {
    x: 0.95, y: 4.1, w: 5.3, h: 0.6,
    fontFace: "Calibri", fontSize: 13.5, bold: true, color: INK, margin: 0,
  });
  s.addText(
    "BIM Security addresses security-minded information management for built assets, which is directly relevant to a Common Data Environment.",
    {
      x: 0.95, y: 4.62, w: 5.3, h: 0.5,
      fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14, margin: 0,
    }
  );

  card(s, { x: 6.9, y: 1.75, w: 5.8, h: 3.5, fill: CHARCOAL });
  s.addText("What we will not claim", {
    x: 7.2, y: 2.05, w: 5.2, h: 0.35,
    fontFace: "Cambria", fontSize: 19, bold: true, color: GOLD, margin: 0,
  });
  s.addText(
    [
      { text: "We state only what we hold and can evidence on request.", options: { breakLine: true, bold: true } },
      { text: "", options: { breakLine: true } },
      { text: "A certification claim is the first thing a security reviewer verifies. An unsupportable one ends the review, and the relationship.", options: { breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "Where we are aligned to a standard but not certified against it, we say exactly that.", options: {} },
    ],
    {
      x: 7.2, y: 2.55, w: 5.2, h: 2.5,
      fontFace: "Calibri", fontSize: 13.5, color: "D8D8DC", lineSpacing: 21, margin: 0,
    }
  );

  s.addText("Certificate numbers and scope available on request.", {
    x: 0.6, y: 6.92, w: 12.1, h: 0.3,
    fontFace: "Calibri", fontSize: 9, color: MUTED, margin: 0,
  });
  s.addNotes("Confirm the Kitemark certificate number, scope and validity before issuing. Do not add ISO 27001 or SOC 2 unless XD House actually holds them.");
}

// ============ 8. THE PACK ============
{
  const s = lightSlide("The assurance pack", "Five documents, available to your reviewers today");

  const docs = [
    ["01", "Security Overview", "Encryption, residency, access control, assurance, vulnerability reporting"],
    ["02", "Security Implementation Plan", "The 13 control layers, each mapped to its SoW clause and Azure service"],
    ["03", "Security Assurance & Testing Plan", "Audit, independent penetration test, re-audit, and the cadence for each"],
    ["04", "Incident Response Plan", "Severity levels, roles, containment, notification timelines, post-incident review"],
    ["05", "Security Questionnaire, Pre-Answers", "Your likely questions, answered"],
  ];

  let y = 1.7;
  for (const [n, title, desc] of docs) {
    card(s, { x: 0.6, y, w: 12.1, h: 0.9 });
    s.addText(n, {
      x: 0.8, y, w: 0.5, h: 0.9,
      fontFace: "Cambria", fontSize: 20, bold: true, color: GOLD, valign: "middle", margin: 0,
    });
    s.addText(title, {
      x: 1.4, y: y + 0.14, w: 5.6, h: 0.3,
      fontFace: "Calibri", fontSize: 13.5, bold: true, color: INK, margin: 0,
    });
    s.addText(desc, {
      x: 1.4, y: y + 0.45, w: 10.6, h: 0.3,
      fontFace: "Calibri", fontSize: 11, color: MUTED, margin: 0,
    });
    y += 1.0;
  }

  s.addText(
    "Two documents answer more procurement questions than any sales deck: an audit scorecard, and an independent penetration test. Both are committed before go-live.",
    {
      x: 0.6, y: 6.42, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
}

// ============ 9. CLOSE ============
{
  const s = darkSlide();
  s.addImage({ data: LOGO_WHITE, x: 0.72, y: 0.62, w: 1.15, h: 0.95 });

  s.addText("What we are asking you to take from this", {
    x: 0.72, y: 2.05, w: 8.4, h: 0.65,
    fontFace: "Cambria", fontSize: 31, bold: true, color: WHITE, margin: 0,
  });

  const pts = [
    ["Security is designed in", "Thirteen control layers, each mapped to a requirement you set, built to a gate rather than bolted on."],
    ["We prove it, and you see the proof", "Internal audit, independent penetration test, re-audit. You receive the scorecard, the report and the retest letter."],
    ["We do not overstate", "No test result until an external firm runs one. No certification claim we cannot evidence."],
  ];
  let y = 2.95;
  for (const [t, d] of pts) {
    tick(s, { x: 0.72, y: y + 0.06, size: 0.34, bg: GOLD, fg: CHARCOAL });
    s.addText(t, {
      x: 1.22, y, w: 3.5, h: 0.42,
      fontFace: "Calibri", fontSize: 15, bold: true, color: GOLD, valign: "middle", margin: 0,
    });
    s.addText(d, {
      x: 4.8, y, w: 7.7, h: 0.48,
      fontFace: "Calibri", fontSize: 12.5, color: "C4C5CC", valign: "middle", margin: 0,
    });
    y += 0.78;
  }

  s.addText("Your data stays in the Kingdom. Your identity provider stays in control.", {
    x: 0.72, y: 5.62, w: 8.5, h: 0.4,
    fontFace: "Cambria", fontSize: 17, italic: true, color: WHITE, margin: 0,
  });
  s.addText("XD House   |   Ma'aden Ar Rjum Gold Project   |   15 July 2026", {
    x: 0.72, y: 6.55, w: 9.5, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: "9A9BA3", margin: 0,
  });

  s.addShape(pres.ShapeType.roundRect, {
    x: 9.9, y: 5.62, w: 2.8, h: 1.18, rectRadius: 0.06,
    fill: { color: WHITE }, line: { color: WHITE },
  });
  s.addImage({ data: KITEMARK, x: 10.08, y: 5.94, w: 2.44, h: 0.54 });
}

await pres.writeFile({ fileName: OUT });
console.log("WROTE", OUT);
