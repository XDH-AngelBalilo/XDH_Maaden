# XDH_Maaden — Maaden ARGP Digitalization Pursuit

XD House working repository for the Maaden Ar Rjum Gold Project (ARGP) PDE
Digitalization pursuit. Refs: SoW ARGP-DIGI-APP-SOW-001 Rev 00 · Master Roadmap
XDH-AE-Q26-05-00030 v1.0 · Quote XDH-AE-Q26-05-00029.

## Contents

| Path | What |
|---|---|
| `RFQ Doc/2026.05.18 PDE Digitalization/` | SoW, Master Roadmap (deck + workbook), pricing/estimate working files |
| `RFQ Doc/2026.07.06 CDE Vision - Plan and Layout/` | CDE Backbone implementation plan rev 1 + target UI layout |
| `RFQ Doc/Additioanl Info/` | Client's 4 vision diagrams |
| `RFQ Doc/maaden-cde-sample/` | **Working localhost demo** — Module M1 slice (Master Data Registry + Data Template governance) |

## The demo app

Next.js 14 + TypeScript + Tailwind + PostgreSQL 16 (roadmap stack). Seven screens,
REST API with OpenAPI spec, 3-family validation engine, publish simulator with
sha256 payloads, JWT role switcher, full audit trail.

Demo arc (verified): registry shows 4 asset classes → run validation → 3 assets
fail differently (framework / quality / technical) → fix each in the UI →
re-validate to 100% pass → publish hero asset EQP-000789 to the 10 roadmap
targets → dashboard goes green.

See [`RFQ Doc/maaden-cde-sample/README.md`](RFQ%20Doc/maaden-cde-sample/README.md)
for run instructions and
[`docs/demo-script.md`](RFQ%20Doc/maaden-cde-sample/docs/demo-script.md) for the
10-minute client walkthrough.
