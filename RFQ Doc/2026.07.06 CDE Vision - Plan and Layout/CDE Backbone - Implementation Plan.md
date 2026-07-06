# Maaden ARGP — CDE Asset Data Backbone
## Implementation Plan & Layout (Localhost Sample → Production Path)

**Ref:** ARGP-DIGI-APP-SOW-001 Rev. 00 | Master Roadmap XDH-AE-Q26-05-00030 v1.0 (02 Jul 2026) | XDH-AE-Q26-05-00029
**Date:** 2026-07-06 (rev 1 — aligned to Master Roadmap) | **Prepared by:** XD House
**Source:** Client vision diagrams (4 images) + SoW + Master Roadmap deck & workbook

---

## 0. Alignment with the Master Roadmap (what changed in rev 1)

The Master Roadmap governs delivery. This plan now follows it:

| Item | Roadmap position | This plan |
|---|---|---|
| Module map | **M1 = CDE + Engineering Data Hub** (Federated Model Viewer, Doc Mgmt, Intelligent P&ID, **Master Data Registry**), M2 = Construction+AWP, M3 = Pre-Comm+MC, M4 = Quality, M5 = Procurement | Sample = **M1 slice: Master Data Registry + data templates** — exactly the client vision images |
| Year 1 timeline | **40 weeks**, Phase 4 split 4a–4d; M1 CDE built W17–W24 (T-171→T-214), Gate **G4 at W24** | Sample demonstrates the G4 scope pre-award; build plan weeks below map to roadmap task IDs |
| Pilot content | Phase 2 pilot = **M2 AWP + M3 Pre-Comm** (not CDE) | Sample is a **pre-award sales/demo asset**, not the delivery pilot — see sequencing note below |
| Tech stack | **Node.js + TypeScript, React + Next.js + Tailwind**; Postgres/Azure SQL (task register T-060, T-173 use Postgres); Claude API + Azure OpenAI; Prophet + XGBoost for ML; GitHub Enterprise + Azure DevOps; IFC.js / xeokit / APS for viewers | Sample stack changed to **Next.js + TypeScript + Tailwind + Postgres** (was FastAPI). Python retained only for later ML agents, matching roadmap AI stack |
| AI scope | **4 named agents** (Progress Verification, RFI Turnaround, Schedule Risk, Punch List Escalation) — M2/M3 scoped | Sample AI phase repositioned as M1-supporting (standards RAG + auto-classification), the 4 agents referenced as production companions |
| Integrations | **10 systems**: Aconex, P6, SAP S/4HANA, AVEVA PI, MS EPM, Azure AD, ADFS, SIEM, Outlook, ServiceNow | Publish Hub production mapping updated to all 10 |
| Gates & payment | 6 gates G1(W4)…G6(W40), 8 payment tranches | Demo storyline framed around the G4 evidence pack |

**Sequencing note (recommend to management):** the roadmap builds M1 CDE in Phase 4a (W17–24), yet M2 AWP and M3 Pre-Comm piloted in W5–12 both consume tags, hierarchy and templates. Recommend pulling the **Master Data Registry core (T-173 scope) forward into Phase 1–2** as a foundation service — it de-risks the pilot and matches the client's own vision diagrams. The heavier M1 features (Federated Model Viewer, Intelligent P&ID) stay in Phase 4a as planned. This localhost sample doubles as the proof for that recommendation.

**Commercial note:** the roadmap carries Y1 AED 4.6M / TCO 8.15M vs the quote letter's 2.98M / 4.91M — a third figure set. Parked per your instruction, but flag it before anything goes external.

---

## 1. What the Client Vision Says

The 4 diagrams describe one coherent idea — **a governed, standards-driven asset data backbone at the heart of the CDE**:

| Image | Message | Anchor |
|---|---|---|
| Data requirements chain | **Standard → defines Product Type → defines Set of Properties → defines Data Template.** A Data Template (DT) is Maaden's "common digital language" for asset characteristics. | SoW 3.1.3; roadmap M1 Master Data Registry |
| Governance flow | Three governance inputs (methodology/Structure, data structure/Process, tech-spec standards/Content) feed **three compliance checks** — asset data framework, data quality, technical & market — before a DT is applied to a real asset (e.g. Pump Package: 250 m³/h, 12 bar, 315 kW, SS316). | SoW 3.1.4, 3.4.3 |
| Asset standards → CDE | Four asset classes (**STR, MAT, ELE, EQP**) with governed IDs + revisions (e.g. EQP-000789 REV A) **published** to engineering, construction, maintenance, operations systems. | SoW 3.1.2, 3.1.7 |
| CDE hub | CDE at the centre of 6 system families: Engineering Mgmt, Document Mgmt, Field & Data Acquisition, Analytics & Reporting, Geospatial & Mine Planning, Operational/Relational DBs. | SoW 3.4.4; roadmap 10-system integration map |

**Interpretation:** Maaden wants the **class-library / data-template engine** — the layer that makes every tag, model element and document machine-readable and consistent. In roadmap terms this is **M1's Master Data Registry (MEL, Tag Register, System/Subsystem — task T-173) plus a data-template governance layer**. Every other module (M2 AWP work packages, M3 checksheets, M4 ITPs, M5 PO material tracking) consumes it.

**Standards to align with (and cite in the demo):** ISO 19650 (CDE states), CFIHOS / ISO 15926-4 (class library & property dictionary), IEC 81346 (tag designation), IEC 61987 (equipment property lists), Maaden MCIS, and the SoW hierarchy **Area → Unit → System → Subsystem → Tag → Document**.

---

## 2. Core Concept — the Data Template Chain

```
STANDARD (ISO/API/ASME/Maaden spec)
   └─ defines → PRODUCT TYPE (class library node, e.g. Centrifugal Pump)
         └─ defines → PROPERTY SET (flow, head, power, material, ...)
               └─ defines → DATA TEMPLATE (DT-EQP-PUMP-001 Rev A)
                     └─ instantiated as → ASSET / TAG (EQP-000789 Rev A @ Area 310)
                           └─ validated by → COMPLIANCE ENGINE (3 check families)
                                 └─ published to → DOWNSTREAM SYSTEMS (10 integrations)
```

Everything in the sample app demonstrates this chain end-to-end.

---

## 3. Data Model (Postgres — consistent with roadmap task T-060/T-173 tooling)

**Reference/library side**
- `standards` (code, title, body, revision, discipline, source_doc)
- `product_types` (class code, name, parent_id — hierarchical class library; discipline; asset_class: STR/ELE/EQP/MAT)
- `properties` (name, symbol, datatype, unit_of_measure, allowed_range/enum, definition source)
- `data_templates` (code e.g. DT-EQP-PUMP-001, product_type_id, revision, status: Draft/Review/Approved/Superseded)
- `template_properties` (template_id, property_id, mandatory flag, validation rule, default UoM)
- `standard_product_type` / `standard_template` link tables (traceability)

**Plant/instance side**
- `plant_hierarchy` (self-referencing: Area → Unit → System → Subsystem) — SoW 3.1.3; roadmap T-173 "System/Subsystem"
- `assets` (tag, asset_class, product_type_id, template_id, hierarchy node, revision, lifecycle: Registered/Data-Loaded/Validated/Published) — the MEL / Tag Register of T-173
- `asset_property_values` (asset_id, property_id, value, UoM, source, confidence)
- `documents` (doc number, revision, type, linked tags — CDE state per ISO 19650)
- `revisions` + `audit_log` (immutable trail — SoW 3.1.4)

**Governance side**
- `validation_rules` (family: **framework | quality | technical**; expression; severity)
- `validation_runs` / `validation_findings`
- `publish_targets` (the 10 roadmap integrations, grouped into the 6 vision families) + `publish_events` (payload hash, timestamps)
- `users`/`roles` (RBAC: Data Governance Lead, Discipline Engineer, Doc Controller, Viewer)

**Three compliance families (vision image 2) → rule types:**
1. **Asset data framework** — completeness: mandatory properties, hierarchy placement, tag format, template assigned.
2. **Data quality** — datatype/UoM correctness, ranges, enums, duplicate tags, orphan references.
3. **Technical & market** — values vs standard limits (e.g. API 610), material vs spec, revision alignment.

---

## 4. Architecture

### 4.1 Localhost sample (aligned to roadmap stack)
```
Next.js 14 (App Router, TypeScript, Tailwind)
  ├── React UI (screens per section 5)
  ├── API routes (REST, OpenAPI spec published)   ──►  PostgreSQL 16
  ├── validation engine (TypeScript rule evaluator)
  ├── publish simulator (JSON payloads per target)
  └── seed loader (ARGP gold-plant demo dataset)
docker-compose up → web + postgres on localhost
```
- Single TypeScript codebase per roadmap dev stack (Node.js + TS, React + Next.js + Tailwind, GitHub).
- REST + OpenAPI docs — SoW 3.4.4 mandate ("APIs are a must", RESTful).
- Auth in sample: JWT with role switcher (demos Maaden RBAC without ADFS).
- Python appears only in the later ML phase (Prophet + XGBoost per roadmap AI stack) as a sidecar service.

### 4.2 Production mapping (what we tell Maaden)
| Sample component | Production (per roadmap) |
|---|---|
| Next.js app | Azure App Service / Front Door (Riyadh), Azure AD + ADFS SSO |
| API routes | Same app behind WAF + API gateway, API keys; logs → Azure Sentinel SIEM |
| Postgres | Azure Database for PostgreSQL / Azure SQL (roadmap lists both; task register uses Postgres) + Cosmos DB where document-shaped |
| Publish simulator | Maaden Middleware connectors — **Aconex, P6 EPPM, SAP S/4HANA (OData), AVEVA PI (Web API), MS EPM, Azure AD, ADFS (SAML 2.0), SIEM, Outlook, ServiceNow** |
| Seed data | Migration + cleansing pipeline with data-quality scoring (SoW 1.4); Azure Data Factory per T-173 |
| CI/CD | GitHub Enterprise + Azure DevOps Pipelines per roadmap |

### 4.3 AI layer (phase 2 of sample — hooks designed in now)
M1-supporting capabilities (this sample):
- **RAG over standards library** — "navigate engineering standards / provide technical resolutions with references" (SoW 3.1.7), via Claude API per roadmap AI stack.
- **Auto-classification** — suggest product type + template from an uploaded datasheet; stepping stone to roadmap's Intelligent P&ID (T-172, OCR + clickable tags).
- **Anomaly detection** on property values vs class population.

Production companions (roadmap slide 11, M2/M3-scoped, not in this sample): Progress Verification, RFI Turnaround Predictor, Schedule Risk Forecast (Prophet+XGBoost), Punch List Escalation. All consume the backbone's tags/hierarchy — another argument for building the registry early.

---

## 5. UI Layout (7 screens — see companion `CDE Backbone - UI Layout.html`)

1. **Dashboard** — template coverage, assets by lifecycle state, compliance pass rate, publish activity (SoW 3.1.7 dashboards).
2. **Data Template Library** — Standard → Product Type tree; template detail with property set. This screen IS vision image 3.
3. **Asset Registry** — Area→Unit→System→Subsystem tree + tag table (MEL / Tag Register per T-173).
4. **Asset Detail** — property values vs template, validation per family, linked documents with CDE state, revision history. Demo asset: the Pump Package from vision image 2.
5. **Compliance Centre** — run validation, results by the 3 families, findings drill-down.
6. **Publish Hub** — the CDE circle from vision image 4 (6 system families) with production note listing the 10 roadmap integrations; publish queue, event log, API keys.
7. **Governance / Admin** — roles, Draft→Review→Approved workflow, audit trail, standards register.

Design language: Maaden-adjacent palette (charcoal + gold ochre), data-dense tables, status chips.

---

## 6. Build Plan (localhost sample)

| Step | Scope | Roadmap tie-in | Est. |
|---|---|---|---|
| S1 | Repo scaffold (Next.js+TS+Tailwind), docker-compose, schema + migrations, seed dataset (~5 areas, 40 tags, 8 templates, 3 standards) | Pre-figures T-173 Master Data Registry | 1–2 d |
| S2 | API routes: hierarchy, templates, assets, properties + OpenAPI | SoW 3.4.4 API mandate | 1–2 d |
| S3 | Validation engine + 3 rule families (~15 rules incl. seeded failures) | Vision image 2 | 1 d |
| S4 | UI screens 1–4 | — | 2–3 d |
| S5 | UI screens 5–7 + publish simulator (10 targets grouped in 6 families) | Roadmap integrations map | 2 d |
| S6 | Demo polish: Pump Package walkthrough (register → load → validate → fix → approve → publish) | G4 evidence storyline | 1 d |
| S7 | (Phase 2) AI: standards RAG + auto-classification via Claude API | Roadmap AI stack; T-172 stepping stone | 2–3 d |

Total core sample: **~8–11 working days** (single developer + Claude Code).

**Seed data story (matches the client's own images):**
- `EQP-000789 Rev A` — Pump Package, DT-EQP-PUMP-001: 250 m³/h, 12 bar, 315 kW, SS316 → passes → published.
- `ELE-000132 Rev C` — E-house module, mandatory property missing → framework finding.
- `STR-000245 Rev B` — structural steel, UoM mismatch → quality finding.
- `MAT-000567 Rev D` — plate material, value below ASTM limit → technical finding.

Demo arc: 4 classes → 3 assets fail differently → fix live → validate → publish → dashboard green. Their vision, on screen, in 10 minutes.

---

## 7. Claude Code Handoff

```
maaden-cde-sample/
├── CLAUDE.md            # this plan, roadmap module map, tag formats, seed story, conventions
├── docker-compose.yml   # web + postgres
├── app/                 # Next.js App Router: (screens)/, api/, lib/validation/, lib/publish/
├── db/                  # schema.sql, migrations/, seed/
└── docs/                # this plan + vision images + roadmap extracts + demo script
```
CLAUDE.md must carry: the data-template chain (§2), the **roadmap module numbering (M1=CDE…M5=Procurement)**, tag/ID formats, the 3 compliance families, roadmap stack constraints (Next.js/TS/Tailwind/Postgres, Claude API), and the rule "every feature must be demo-able against the Pump Package story."

---

## 8. Traceability — Client Requirement → Where Satisfied

| Requirement | Satisfied by |
|---|---|
| DT = common data structure per approved standards (image 3) | Template Library + standards links |
| 3 compliance checks before DT use (image 2) | Compliance Centre + rule families |
| Machine-readable, version-controlled asset data w/ IDs+REVs (image 1) | Asset Registry, revisions, audit log |
| Publish governed data to eng/constr/maint/ops (images 1 & 4) | Publish Hub + REST APIs |
| Roadmap M1 Master Data Registry (T-173: MEL, Tag Register, System/Subsystem) | §3 plant/instance model — same scope, demonstrated early |
| Roadmap M1 Intelligent P&ID (T-172) | Phase-2 auto-classification stepping stone |
| Roadmap 10 enterprise integrations | Publish targets + production mapping §4.2 |
| Roadmap G4 (W24) M1 CDE live evidence | Demo storyline §6 |
| SoW 3.1.3 semantic hierarchy | plant_hierarchy model |
| SoW 3.1.4 security/audit | RBAC, immutable audit, ADFS/SIEM mapping |
| SoW 3.1.5 AI demo mandate | Phase-2 AI (RAG + classification) |
| SoW 3.4.4 REST APIs | OpenAPI-first routes |
| SoW open-API / no lock-in (1.4) | Postgres + documented REST + exportable payloads |

**Open items for the clarifications register:** class library baseline (CFIHOS vs Maaden internal), tag numbering ownership, first live connector (recommend Aconex or P6 per roadmap Phase 1–2 integration build), pilot area selection, and the M1-timing recommendation (registry core forward into Phase 1–2).
