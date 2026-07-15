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

// House rule: no AI-tell symbols. No em dashes, no middot separators, no arrow
// chains, no decorative accent lines. Sentences are restructured to do the work
// instead of leaning on a dash. Ticks are fine and are used as pass markers.

// Palette, matching the CDE application Maaden has already seen
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

/** Tick in a filled circle, used as a pass / requirement-met marker. */
function tick(s, { x, y, size = 0.34, bg, fg }) {
  s.addShape(pres.ShapeType.ellipse, {
    x, y, w: size, h: size,
    fill: { color: bg },
    line: { color: bg },
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
    warn: [WARN, "FDF0DC"],
    err: [ERR, "FBE4E4"],
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
  s.addText("Ma'aden Ar Rjum Gold Project: CDE Asset Data Backbone", {
    x: 0.72, y: 3.2, w: 9.4, h: 0.45,
    fontFace: "Calibri", fontSize: 19, color: GOLD, margin: 0,
  });
  s.addText("Prepared for Ma'aden security and IT review. Module M1, Master Data Registry.", {
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
    "Frame: Ma'aden's security team evaluates XD House before commercial terms. This pack is the pre-emptive answer. Everything in it is evidence-backed. Where we have no evidence yet, we say so."
  );
}

// ============ 2. WHY THIS EXISTS ============
{
  const s = lightSlide(
    "The security review decides the deal",
    "Before commercial terms are agreed, your security team evaluates us"
  );

  const items = [
    "Do you encrypt data at rest and in transit?",
    "When was your last penetration test?",
    "Do you have an incident response plan? Can we see it?",
    "Where is our data stored? Onshore or offshore?",
  ];
  s.addText("The questionnaire arrives before the contract", {
    x: 0.6, y: 1.65, w: 6, h: 0.32,
    fontFace: "Calibri", fontSize: 15, bold: true, color: INK, margin: 0,
  });
  let y = 2.15;
  for (const q of items) {
    s.addShape(pres.ShapeType.roundRect, {
      x: 0.6, y, w: 5.9, h: 0.62, rectRadius: 0.06,
      fill: { color: BG }, line: { color: LINE, width: 0.75 },
    });
    s.addText(q, {
      x: 0.78, y, w: 5.6, h: 0.62,
      fontFace: "Calibri", fontSize: 12.5, color: INK, valign: "middle", margin: 0,
    });
    y += 0.76;
  }

  card(s, { x: 6.9, y: 1.6, w: 5.8, h: 3.6, fill: CHARCOAL });
  s.addText("Our position", {
    x: 7.2, y: 1.9, w: 5.2, h: 0.35,
    fontFace: "Cambria", fontSize: 19, bold: true, color: GOLD, margin: 0,
  });
  s.addText(
    [
      { text: "Security is not a feature added once the product works.", options: { breakLine: true, bold: true } },
      { text: "", options: { breakLine: true } },
      { text: "Your asset data backbone is the layer every downstream system trusts, so security is its precondition.", options: { breakLine: true } },
      { text: "", options: { breakLine: true } },
      { text: "So we audit our own stack, fix what we find, commission an independent test, then re-audit. We show you the evidence from every step, including the failures.", options: {} },
    ],
    {
      x: 7.2, y: 2.4, w: 5.2, h: 2.6,
      fontFace: "Calibri", fontSize: 13.5, color: "D8D8DC", lineSpacing: 21, margin: 0,
    }
  );

  s.addText("Deals do not end with a rejection at this gate. They end with silence.", {
    x: 0.6, y: 5.5, w: 12.1, h: 0.5,
    fontFace: "Cambria", fontSize: 17, italic: true, color: GOLD_DK, margin: 0,
  });
  footer(s);
  s.addNotes("The point: we did this work before you asked. Most vendors scramble after the questionnaire lands.");
}

// ============ 3. THE SEQUENCE ============
{
  const s = lightSlide(
    "Audit. Remediate. Test. Re-audit.",
    "You do not pay an external firm to find what you already know"
  );

  const steps = [
    ["01", "AUDIT", "13-layer review of the\nentire stack", "Complete", "ok"],
    ["02", "REMEDIATE", "Fix what the audit\nsurfaced", "In progress", "warn"],
    ["03", "PEN TEST", "Independent firm\nattempts to break in", "Scoped", "info"],
    ["04", "RE-AUDIT", "Confirm the fixes\nheld", "Pending", "info"],
  ];

  let x = 0.6;
  for (const [num, title, desc, status, tone] of steps) {
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
    chip(s, { x: x + 0.25, y: 4.05, text: status, tone });
    x += 3.1;
  }

  card(s, { x: 0.6, y: 4.95, w: 12.1, h: 1.25, fill: "FDF3D7" });
  s.addText(
    [
      { text: "Where we are today.  ", options: { bold: true } },
      { text: "Audit #1 is complete and available to you now. No penetration test has been run on this application yet. It is scoped and will be commissioned after remediation. We will not present a test result until an external firm has actually performed one.", options: {} },
    ],
    {
      x: 0.85, y: 5.1, w: 11.6, h: 0.95,
      fontFace: "Calibri", fontSize: 13, color: INK, lineSpacing: 19, valign: "middle", margin: 0,
    }
  );
  footer(s);
  s.addNotes("If asked when our last pen test was: the honest answer is none yet on this app, and here is the audit that proves we are not guessing.");
}

// ============ 4. AUDIT SCORECARD ============
{
  const s = lightSlide(
    "13-Layer Production Readiness Audit",
    "Audit #1, commit 0d25f7f, 15 July 2026. Source review, dependency scan, live reproduction."
  );

  const rows = [
    ["1", "Authentication & session", "err", "Azure AD and ADFS SSO, SAML 2.0, MFA"],
    ["2", "Authorization / RBAC", "warn", "4 roles, IdP-backed, server-side"],
    ["3", "Data protection (transit/rest)", "err", "TLS 1.2+, TDE, Key Vault"],
    ["4", "Database", "warn", "Azure PostgreSQL, private endpoint"],
    ["5", "Input validation & injection", "ok", "Maintain, add schema validation at API"],
    ["6", "Secrets management", "warn", "Azure Key Vault, managed identity"],
    ["7", "Dependencies & supply chain", "err", "CI scanning, patch SLA, SBOM"],
    ["8", "Browser hardening / headers", "err", "CSP, HSTS via Front Door"],
    ["9", "Hosting & network", "info", "App Service Riyadh, WAF, private net"],
    ["10", "Deployment & CI/CD", "warn", "GitHub Enterprise, Azure DevOps"],
    ["11", "Logging, audit & monitoring", "warn", "App Insights, Azure Sentinel SIEM"],
    ["12", "Scaling & availability", "info", "Autoscale, health probes, SLO"],
    ["13", "Backup & disaster recovery", "err", "PITR, RPO/RTO, restore drills"],
  ];

  const label = { ok: "Pass", warn: "Partial", err: "Fail", info: "Demo n/a" };

  s.addText("LAYER", { x: 0.95, y: 1.55, w: 3.4, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });
  s.addText("DEMO TODAY", { x: 4.5, y: 1.55, w: 1.3, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });
  s.addText("PRODUCTION TARGET (SoW §3.4)", { x: 6.1, y: 1.55, w: 4.5, h: 0.25, fontFace: "Calibri", fontSize: 9.5, bold: true, color: MUTED, margin: 0 });

  let y = 1.85;
  for (const [n, layer, tone, target] of rows) {
    s.addText(n, { x: 0.6, y, w: 0.3, h: 0.3, fontFace: "Calibri", fontSize: 10, color: MUTED, align: "right", margin: 0 });
    s.addText(layer, { x: 0.95, y, w: 3.5, h: 0.3, fontFace: "Calibri", fontSize: 11.5, color: INK, valign: "middle", margin: 0 });
    chip(s, { x: 4.5, y: y + 0.02, text: label[tone], tone });
    s.addText(target, { x: 6.1, y, w: 4.6, h: 0.3, fontFace: "Calibri", fontSize: 11, color: MUTED, valign: "middle", margin: 0 });
    y += 0.345;
  }

  card(s, { x: 11.0, y: 1.85, w: 1.75, h: 2.05, fill: CHARCOAL });
  const tally = [["1", "Pass", OK], ["5", "Partial", GOLD], ["5", "Fail", ERR], ["2", "N/A", "9A9BA3"]];
  let ty = 2.0;
  for (const [num, lab, col] of tally) {
    s.addText(num, { x: 11.15, y: ty, w: 0.5, h: 0.4, fontFace: "Cambria", fontSize: 21, bold: true, color: col, margin: 0 });
    s.addText(lab, { x: 11.68, y: ty + 0.09, w: 1.0, h: 0.3, fontFace: "Calibri", fontSize: 11, color: "D8D8DC", margin: 0 });
    ty += 0.47;
  }

  card(s, { x: 11.0, y: 4.05, w: 1.75, h: 2.4, fill: "FDF3D7" });
  s.addText(
    "This scores the pre-award demo on localhost, not production. It holds no Ma'aden data and is not internet-facing.\n\nThe failures are demo-scope decisions with defined production controls.",
    { x: 11.15, y: 4.2, w: 1.45, h: 2.1, fontFace: "Calibri", fontSize: 9.5, color: INK, lineSpacing: 13, margin: 0 }
  );

  footer(s);
  s.addNotes("The value is not that the demo is secure. It is that we audit ourselves against a defined standard, find our own problems, and show you the evidence.");
}

// ============ 5. WHAT THE AUDIT FOUND ============
{
  const s = lightSlide(
    "What the audit found",
    "Reproduced against a running instance, not a checklist exercise"
  );

  const findings = [
    ["C-1", "err", "Unauthenticated requests served as Governance Lead", "Session falls back to a default admin user. Reproduced: an anonymous API call mutates data.", "~1 h to delete the fallback"],
    ["C-2", "err", "Identity selection requires no authentication", "The demo role switcher issues a session for any user, with no password.", "3 to 5 d to wire ADFS SAML"],
    ["H-2", "warn", "Framework version carries high-severity advisories", "next@14.2.5 carries DoS, XSS, cache poisoning and SSRF advisories. Found by dependency scan.", "0.5 to 2 d to upgrade"],
    ["H-1/3/4", "warn", "Default signing secret, cookie not Secure, no TLS", "Production-hardening steps the localhost demo deliberately skipped.", "~1 d total"],
  ];

  let y = 1.55;
  for (const [id, tone, title, detail, fix] of findings) {
    card(s, { x: 0.6, y, w: 12.1, h: 1.1 });
    chip(s, { x: 0.8, y: y + 0.19, text: id, tone });
    s.addText(title, {
      x: 1.85, y: y + 0.14, w: 7.0, h: 0.3,
      fontFace: "Calibri", fontSize: 13.5, bold: true, color: INK, margin: 0,
    });
    s.addText(detail, {
      x: 1.85, y: y + 0.47, w: 7.0, h: 0.55,
      fontFace: "Calibri", fontSize: 11.5, color: MUTED, lineSpacing: 15, margin: 0,
    });
    s.addShape(pres.ShapeType.roundRect, {
      x: 9.15, y: y + 0.27, w: 3.35, h: 0.56, rectRadius: 0.06,
      fill: { color: "E5F2E6" }, line: { color: "E5F2E6" },
    });
    s.addText(fix, {
      x: 9.3, y: y + 0.27, w: 3.05, h: 0.56,
      fontFace: "Calibri", fontSize: 11, bold: true, color: OK, valign: "middle", margin: 0,
    });
    y += 1.2;
  }

  s.addText(
    "Every Critical finding is a demo-scope removal, but they become live vulnerabilities the moment the demo leaves localhost.",
    {
      x: 0.6, y: 6.42, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
}

// ============ 6. WHAT ALREADY HOLDS ============
{
  const s = lightSlide(
    "What already holds",
    "Controls built in from the start, not retrofitted for this review"
  );

  const passes = [
    ["No SQL injection surface", "Every query parameterised through the driver. A source sweep for string interpolation returned zero hits."],
    ["Immutable audit trail", "Every mutation records actor, action, before and after value, and timestamp. This is the control SoW §3.1.4 requires."],
    ["Approved data is immutable", "Editing a published asset forces a new revision and returns it for re-validation. No silent edits."],
    ["Server-side authorization", "Role gates enforced in the API, not hidden UI. A Viewer attempting to mutate receives 403, reproduced."],
    ["Secrets never in version control", "Confirmed against the git index. No credential files tracked."],
    ["AI layer fails closed", "With no API key the client is never constructed and routes return a clean 503. The key never reaches the browser."],
  ];

  let x = 0.6, y = 1.65;
  for (let i = 0; i < passes.length; i++) {
    const [t, d] = passes[i];
    card(s, { x, y, w: 5.9, h: 1.45 });
    tick(s, { x: x + 0.25, y: y + 0.28, size: 0.42, bg: "E5F2E6", fg: OK });
    s.addText(t, {
      x: x + 0.82, y: y + 0.24, w: 4.9, h: 0.3,
      fontFace: "Calibri", fontSize: 13.5, bold: true, color: INK, margin: 0,
    });
    s.addText(d, {
      x: x + 0.82, y: y + 0.57, w: 4.9, h: 0.72,
      fontFace: "Calibri", fontSize: 11, color: MUTED, lineSpacing: 14.5, margin: 0,
    });
    if (i % 2 === 0) x += 6.2;
    else { x = 0.6; y += 1.62; }
  }
  footer(s);
}

// ============ 7. MEETING MA'ADEN'S REQUIREMENTS ============
{
  const s = lightSlide(
    "Meeting Ma'aden's stated requirements",
    "Mapped to SoW ARGP-DIGI-APP-SOW-001 §3.4 and the Master Roadmap"
  );

  const reqs = [
    ["Data residency: Kingdom of Saudi Arabia", "Azure App Service and Azure Database for PostgreSQL, Riyadh region. No Ma'aden production data offshore."],
    ["Azure AD and ADFS SSO, SAML 2.0, MFA", "Ma'aden's identity provider is the source of truth. MFA enforced. Four least-privilege roles."],
    ["Encryption in transit and at rest", "TLS 1.2+ from browser to app to database, HSTS at the edge. Azure TDE at rest. Keys in Azure Key Vault."],
    ["SIEM integration", "Production security events forwarded to Ma'aden's Azure Sentinel."],
    ["Immutable audit trail (§3.1.4)", "Built and demonstrable today in the CDE sample: who, what, before and after, when."],
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
    "These are commitments for the delivered production system. The pre-award demo you have seen implements the audit trail and role model today. The identity, transport and hosting controls arrive with the Azure deployment.",
    {
      x: 0.85, y: 5.95, w: 11.6, h: 0.65,
      fontFace: "Calibri", fontSize: 11.5, color: INK, valign: "middle", margin: 0,
    }
  );
  footer(s);
  s.addNotes("Never merge demo-today with production-committed. Answering a today-question with a committed-answer is what gets caught.");
}

// ============ 8. CREDENTIALS ============
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
  s.addNotes("Confirm Kitemark certificate number, scope and validity before issuing. Do not add ISO 27001 or SOC 2 unless XD House actually holds them.");
}

// ============ 9. THE PACK ============
{
  const s = lightSlide("The assurance pack", "Five documents, available to your reviewers today");

  const docs = [
    ["01", "Security Overview", "Encryption, residency, access control, testing cadence, vulnerability reporting", "Ready", "ok"],
    ["02", "Production Readiness Audit, 13 Layers", "The full audit, its findings, and the remediation plan with owners and dates", "Complete", "ok"],
    ["03", "Penetration Test, Scope & Commission Plan", "What will be tested, by whom, and when. A plan, not a result.", "Scoped", "info"],
    ["04", "Incident Response Plan", "Severity levels, roles, containment, notification timelines, post-incident review", "Draft", "warn"],
    ["05", "Security Questionnaire, Pre-Answers", "Demo-today against production-committed, answered side by side", "Draft", "warn"],
  ];

  let y = 1.5;
  for (const [n, title, desc, status, tone] of docs) {
    card(s, { x: 0.6, y, w: 12.1, h: 0.86 });
    s.addText(n, {
      x: 0.8, y, w: 0.5, h: 0.86,
      fontFace: "Cambria", fontSize: 20, bold: true, color: GOLD, valign: "middle", margin: 0,
    });
    s.addText(title, {
      x: 1.4, y: y + 0.12, w: 5.6, h: 0.3,
      fontFace: "Calibri", fontSize: 13.5, bold: true, color: INK, margin: 0,
    });
    s.addText(desc, {
      x: 1.4, y: y + 0.43, w: 8.4, h: 0.3,
      fontFace: "Calibri", fontSize: 11, color: MUTED, margin: 0,
    });
    chip(s, { x: 11.4, y: y + 0.3, text: status, tone });
    y += 0.96;
  }

  s.addText(
    "Two documents answer more procurement questions than any sales deck: an audit scorecard, and an independent penetration test.",
    {
      x: 0.6, y: 6.42, w: 12.1, h: 0.32,
      fontFace: "Calibri", fontSize: 12, italic: true, color: MUTED, margin: 0,
    }
  );
  footer(s);
}

// ============ 10. CLOSE ============
{
  const s = darkSlide();
  s.addImage({ data: LOGO_WHITE, x: 0.72, y: 0.62, w: 1.15, h: 0.95 });

  s.addText("What we are asking you to take from this", {
    x: 0.72, y: 2.05, w: 8.4, h: 0.65,
    fontFace: "Cambria", fontSize: 31, bold: true, color: WHITE, margin: 0,
  });

  const pts = [
    ["We audit ourselves", "Against a defined 13-layer standard. We show you the failures, not a marketing summary."],
    ["We sequence it properly", "Audit, fix, independent test, re-audit. We do not buy a pen test to discover what we already documented."],
    ["We do not overstate", "No test result until an external firm runs one. No certification claim we cannot evidence."],
  ];
  let y = 2.95;
  for (const [t, d] of pts) {
    tick(s, { x: 0.72, y: y + 0.06, size: 0.34, bg: GOLD, fg: CHARCOAL });
    s.addText(t, {
      x: 1.22, y, w: 3.3, h: 0.42,
      fontFace: "Calibri", fontSize: 15, bold: true, color: GOLD, valign: "middle", margin: 0,
    });
    s.addText(d, {
      x: 4.6, y, w: 7.9, h: 0.48,
      fontFace: "Calibri", fontSize: 12.5, color: "C4C5CC", valign: "middle", margin: 0,
    });
    y += 0.78;
  }

  s.addText("The audit is available to your reviewers today.", {
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
