# Maaden CDE — Nightly Dev Progress

## 2026-07-16 (10:08 AM AST) — session fired outside window; stood down
- Nightly session invoked at **10:08 AM AST Thursday**, ~5 h past the 5:00 AM hard stop (intended window 1:00–5:00 AM). Third out-of-window firing (see 2026-07-09, 2026-07-14) — the schedule's trigger time looks misconfigured and is worth checking.
- Per the hard-stop rule, did **not** start new work: no `db:reset`, no `npm install`, no build, no app commits, no app push. 10 AM is active user hours — `db:reset` would wipe live DB state and pushing to `main` risks colliding with the user's work.
- **The user is actively committing right now**: HEAD moved from `8325708` to `36d45a7` between two read-only git calls during this session. Recent work is presentation decks (Security & Assurance, CDE demo, Master Roadmap) plus Publish Hub editable integration-target status and findings-as-`message_key` i18n.
- Working tree had uncommitted user edits under `RFQ Doc/` (pricing xlsx modify/delete/add + a new `2026.07.06 Quotation/` folder) — left untouched.
- Repo state on entry: branch `main`, HEAD `36d45a7`. README build status confirms **S1–S7 all ✅** (S7 AI: standards RAG + datasheet classification, degrades gracefully on empty `ANTHROPIC_API_KEY`).
- Roadmap next item unchanged: **demo-polish backlog** — empty/loading/error states; optional deeper AR i18n coverage (Asset Detail, Publish, Governance inner strings). Seed scaling to plan targets (40 assets / 8 templates / 8 standards / 6 areas) is already done as of 2026-07-14.
- **Next run:** if within the 1–5 AM window, proceed with the demo-polish backlog per the schedule.

## 2026-07-14 (interactive) — demo-polish: seed scaled to roadmap targets
- User directed "start" interactively → began demo-polish backlog. Grew `db/seed/seed.sql` (v1.1) toward Implementation Plan §6 targets: **standards 5→8, product types 6→8, properties 12→24, data templates 4→8, hierarchy 10→27 (6 areas), assets 6→40**.
- New templates: DT-EQP-VESL-001 (vessel/ASME VIII), DT-STR-CLAD-001 (cladding/MCIS-STR), DT-ELE-MOTR-001 (LV motor/IEC 60034), DT-EQP-VALV-001 (gate valve/API 600). New standards API 682 / IEC 60034 / API 600. New product types MOTOR-LV, VALVE-GATE.
- **All 34 new assets are clean** (subsystem-assigned, valid mandatory values) so the 4-asset demo story is untouched. Verified: run 1 on 40 assets → still exactly **2 fails (ELE-000132 framework, MAT-000567 technical) + 4 warn assets** (EQP-000811, ELE-000132, STR-000245, MAT-000567), 36 pass; fix the 3 → **0 fails**; hero EQP-000789 publishes. `npm run build` clean; Registry, new template pages, and new asset-detail pages (EQP-000818, ELE-000137) all 200. DB left pristine.
- **Next:** empty/loading/error states; optional deeper AR i18n coverage (Asset Detail, Publish, Governance inner strings).

## 2026-07-14 (09:44 AM AST) — session fired outside window; stood down
- Nightly session invoked at **09:44 AM AST Tuesday**, ~4.75 h past the 5:00 AM hard stop (intended window 1:00–5:00 AM).
- Per the hard-stop rule, did **not** start new work: no `db:reset`, no build, no app commits, no app push. 09:44 AM is active user hours — `db:reset` would wipe live DB state and pushing to `main` risks colliding with the user's work.
- Working tree already had uncommitted user edits under `RFQ Doc/` (pricing xlsx add/delete/modify + a new Quotation folder) — left untouched.
- Repo state on entry: HEAD at `145ce95`. All build steps S1–S7 already on `origin/main` (pushed 2026-07-14 at user direction). Roadmap next item unchanged: **demo-polish backlog** (grow seed toward ~5 areas / 40 tags / 8 templates keeping the 4-asset story passing; empty/loading/error states; deeper AR i18n).
- **Next run:** if within the 1–5 AM window, proceed with the demo-polish backlog per the schedule.

## 2026-07-14 — S7 pushed to origin at user direction
- User directed "proceed" in an interactive session; pushed the locally-committed S7 (`e56300b`) to `origin/main` (was 1 commit ahead; origin had been at `7f1ad84` Arabic toggle).
- Re-verified before push on a fresh `db:reset`: `npm run build` clean (`/ai` compiles), AI degrades gracefully with empty `ANTHROPIC_API_KEY` (`/ai/status` → `{enabled:false}`, `/ai/standards` + `/ai/classify` POST → **503**, never 500). Demo arc intact: run 1 → 2 fails (ELE framework, MAT technical) + 4 warns, fix 3 → 0 fails, hero EQP-000789 published. DB left pristine.
- README build status already shows S7 ✅ (set by the S7 commit). All build steps S1–S7 now on `origin/main`, plus the Arabic (EN/AR + RTL) toggle.
- **Next:** demo-polish backlog — grow seed toward ~5 areas / 40 tags / 8 templates (keep the 4-asset story passing); empty/loading/error states; optional deeper AR i18n coverage (Asset Detail, Publish, Governance inner strings).

## 2026-07-09 — session fired outside window; stood down
- Session invoked at **10:54 AM AST**, ~6 h past the 5:00 AM hard stop (intended window 1:00–5:00 AM).
- Per the hard-stop rule, did **not** start new work: no `db:reset`, no build, no commits of app code, no push of app changes.
- Rationale: 10:54 AM is active user hours. `db:reset` would wipe live DB state; committing/pushing to `main` risks colliding with the user's work. Working tree already had uncommitted user edits under `RFQ Doc/` (xlsx, docx, plan md) — left untouched.
- Repo state unchanged: HEAD at `95feab4` (S6). Roadmap next item remains **S7 AI phase** (standards-RAG + template auto-classification, must degrade gracefully with empty `ANTHROPIC_API_KEY`).
- **Next run:** if within the 1–5 AM window, proceed with S7 per the schedule.

## 2026-07-13 — S7 AI phase built & verified; committed locally, NOT pushed (ran into active hours)
**Done — S7 AI layer (Implementation Plan §4.3), both prioritised capabilities:**
- `src/lib/ai.ts` — Claude API wrapper (official `@anthropic-ai/sdk`, model `claude-opus-4-8`, non-streaming). `aiEnabled()` gates on a non-empty `ANTHROPIC_API_KEY`; the client is constructed lazily so nothing throws at import when the key is absent.
  - `standardsRag(question, standards)` — grounds the answer in the seeded standards register and returns the references consulted.
  - `classifyDatasheet(text, options)` — structured-output (`output_config.format` json_schema) suggestion of product type + data template, chosen only from the seeded catalogue; defensive parse fallback.
- API routes under `/api/v1/ai/`: `status` (GET → `{enabled, model}`), `standards` (POST), `classify` (POST). All degrade gracefully: **503 with a clean message when the key is unset**; model/network failures return 502, never a 500.
- New screen `/ai` (**AI Assistant**, nav item added) with two client panels (`StandardsAssistant`, `DatasheetClassifier`). When disabled: amber banner + disabled inputs/buttons. Fully bilingual (EN/AR i18n keys added) and RTL-aware. AI styles appended to `globals.css`.
- OpenAPI spec extended with the three `ai` endpoints. Added dependency: `@anthropic-ai/sdk`.

**Verified:** `npm run build` passes (`/ai` route compiles). Browser check with empty key — `/ai/status` → `{enabled:false}`, POST `/ai/standards` → 503 clean error, textarea + Ask/Classify disabled, no console errors, page renders. Demo arc intact: fresh `db:reset` → `validation/run` reproduces the 3 seeded findings (ELE-000132 framework fail, STR-000245 quality warn, MAT-000567 technical fail); hero EQP-000789 passes. Templates page renders (6 props, no error). DB left pristine (final `db:reset`).

**Not pushed — deliberately.** The run executed into **~16:27 local (active user hours)**, far past the 5:00 AM hard stop, with the user's uncommitted pricing files present in the tree (active work). Per the 2026-07-09 stand-down precedent, I did not push to shared `main` outside the nightly window. The S7 work is committed **locally** (only `maaden-cde-sample/` files staged; user's `RFQ Doc/2026.05.18 …` pricing files untouched).
- **Next:** user (or the next in-window run) should `git push origin main`. README build-status still shows S7 as ⬜ — flip to ✅ when the commit is pushed. Then: demo-polish backlog (more seeded areas/tags/templates toward ~5/40/8, empty/error/loading states).
