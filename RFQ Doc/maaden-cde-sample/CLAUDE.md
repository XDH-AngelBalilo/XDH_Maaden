# Maaden ARGP — CDE Asset Data Backbone (Localhost Sample)

## What this is
A localhost demo of **Module M1 (CDE + Engineering Data Hub)** for the Maaden Ar Rjum Gold Project — specifically the **Master Data Registry + Data Template governance layer** (Master Roadmap task T-173, Gate G4 scope). It proves the client's vision: a standards-driven asset data backbone at the heart of the CDE.

Refs: SoW ARGP-DIGI-APP-SOW-001 Rev 00 | Master Roadmap XDH-AE-Q26-05-00030 v1.0 | Plan: `docs/CDE Backbone - Implementation Plan.md` | Target UI: `docs/CDE Backbone - UI Layout.html` (open in browser — build screens to match it)

## The core concept (never deviate from this chain)
```
STANDARD → defines → PRODUCT TYPE → defines → PROPERTY SET → defines → DATA TEMPLATE
   → instantiated as → ASSET/TAG → validated by → COMPLIANCE ENGINE → published to → DOWNSTREAM SYSTEMS
```

## Stack (fixed — per Master Roadmap, do not substitute)
- **Next.js 14+ App Router, TypeScript, Tailwind CSS**
- **PostgreSQL 16** (docker-compose provided; schema in `db/schema.sql`, seed in `db/seed/seed.sql`)
- REST API via Next.js route handlers under `/api/v1/`; publish an OpenAPI spec at `/api/v1/openapi.json`
- Auth: simple JWT + role switcher (roles: governance_lead, engineer, doc_controller, viewer). No ADFS in sample.
- No ORM requirement — `pg` with typed query helpers is fine; Prisma acceptable if migrations stay aligned with `db/schema.sql`.
- AI features (phase 2, only after core screens work): Claude API for standards RAG + template auto-classification. Must degrade gracefully with no API key.

## Screens to build (match the HTML layout exactly — palette, chips, tables)
1. **Dashboard** — KPIs: assets registered, template coverage %, compliance pass rate, published count; lifecycle bar chart; findings by family; the Data Template chain diagram.
2. **Data Template Library** — Standards→Product Type tree (left), template detail with property table (right), instances list.
3. **Asset Registry** — plant hierarchy tree (Area→Unit→System→Subsystem) + filterable tag table.
4. **Asset Detail** — property values vs template with per-row check, linked documents with CDE state, revision history, validation + publish status.
5. **Compliance Centre** — "Run validation" button executes the rule engine; findings table grouped by 3 families; the 4-step pipeline graphic.
6. **Publish Hub** — CDE hub visual (6 system families), publish queue/events with payload preview, API key panel. Publishing = writing a JSON payload row to `publish_events` (simulator).
7. **Governance/Admin** — approval workflow (Draft→Review→Approved→Published), roles, standards register, audit trail.

## Conventions (client-mandated formats — keep exact)
- Tag IDs: `{CLASS}-{6 digits}` where CLASS ∈ {STR, ELE, EQP, MAT}. Example: `EQP-000789`.
- Revisions: numeric `0` (pre-approval) then letters `A, B, C…`. Displayed as `Rev A`.
- Template codes: `DT-{CLASS}-{TYPE4}-{3 digits}`, e.g. `DT-EQP-PUMP-001`.
- Hierarchy: Area (3-digit, e.g. 310) → Unit (e.g. 311) → System (e.g. 311-PU) → Subsystem (e.g. 311-PU-01).
- Lifecycle states: Registered → Data Loaded → Validated → Published.
- CDE document states (ISO 19650): WIP → Shared → Published → Archived.
- Validation families (exactly these three): `framework`, `quality`, `technical`.

## The demo story (every feature must serve this — it's the acceptance test)
Seeded assets:
- `EQP-000789 Rev A` — Pump Package (DT-EQP-PUMP-001): flow 250 m³/h, pressure 12 bar, power 315 kW, material SS316 → **passes all checks → published**. This is the client's own example; treat it as the hero asset.
- `ELE-000132 Rev C` — E-House module: mandatory property "Busbar rating" missing → **framework fail**.
- `STR-000245 Rev B` — Steel frame: length in `ft`, template requires `mm` → **quality warning**.
- `MAT-000567 Rev D` — SS plate: yield strength 180 MPa < ASTM A240 min 205 → **technical fail**.

Demo arc (10 min): Registry shows 4 classes → run validation → 3 assets fail differently → fix each in UI → re-validate → approve → publish EQP-000789 → dashboard goes green. If a change breaks this arc, the change is wrong.

## Validation engine rules
Rule expressions live in `validation_rules.expression` as JSON, evaluated in TypeScript:
- framework: `{"check":"mandatory_populated"}`, `{"check":"has_template"}`, `{"check":"hierarchy_assigned"}`, `{"check":"tag_format"}`
- quality: `{"check":"uom_matches"}`, `{"check":"datatype"}`, `{"check":"range","min":X,"max":Y}`, `{"check":"enum","values":[...]}`, `{"check":"unique_tag"}`
- technical: `{"check":"standard_limit","property":"...","op":">=","value":205,"standard":"ASTM A240"}`
A validation run writes `validation_runs` + `validation_findings`; asset lifecycle moves to Validated only when zero fails (warnings allowed).

## Publishing
`publish_targets` seeds 10 systems grouped into 6 families (Engineering Mgmt, Document Mgmt, Field & Data Acq, Analytics & Reporting, Geospatial & Mine Planning, Operational DBs). Publishing an asset requires lifecycle = Validated + template status = Approved; writes one `publish_events` row per selected target with the full asset JSON payload and sha256 hash. Blocked publishes (compliance fails) must show in the queue as "Blocked — compliance".

## Rules of engagement
- Build order: S1 scaffold+DB → S2 API → S3 validation engine → S4 screens 1–4 → S5 screens 5–7 → S6 demo polish → S7 AI (only if asked).
- Every mutation writes `audit_log` (who, what, before/after, timestamp). Approved data is immutable — changes create a new revision.
- Seed must load idempotently: `npm run db:reset` drops, recreates, seeds.
- Keep production notes out of the UI except where the layout HTML already shows them (e.g. Publish Hub note about 10 roadmap integrations).
- UI palette: charcoal `#23242a`, gold `#c9a227`, background `#f4f3f0` — match `docs/CDE Backbone - UI Layout.html`.

## Quick start
```bash
docker compose up -d          # postgres on :5432
npm install && npm run db:reset
npm run dev                   # app on :3000
```
