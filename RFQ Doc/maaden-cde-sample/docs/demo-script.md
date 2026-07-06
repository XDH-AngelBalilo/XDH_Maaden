# Demo Script — 10 Minutes to Show Maaden Their Own Vision

**Audience:** Maaden PMO / DS&AI / PE&I reviewers. **Asset hero:** EQP-000789 (their own pump example).

## 0. Setup (before the call)
`docker compose up -d && npm run db:reset && npm run dev` — confirm dashboard shows 3 open findings.

## 1. Open on the Dashboard (1 min)
"This is the asset data backbone from your vision diagrams — the layer that makes every tag machine-readable." Point at the Data Template chain graphic: Standard → Product Type → Property Set → Data Template → Tag. That IS their image 3.

## 2. Data Template Library (2 min)
Open DT-EQP-PUMP-001. Show it is *defined by* API 610 + Maaden spec, with mandatory properties, UoM, validation rules. "One common digital language — engineering, construction, maintenance and operations all read the same template" (their words, image 3 caption).

## 3. Asset Registry (1 min)
Walk the hierarchy Area 310 → Unit 311 → Sys 311-PU (SoW 3.1.3). Show the 4 asset classes STR / ELE / EQP / MAT with IDs + revisions — exactly the ID/REV cards from their image 1.

## 4. The compliance moment (3 min) — the heart of the demo
Compliance Centre → Run validation. Three assets fail, one per family (their image 2):
1. `ELE-000132` — framework: mandatory Busbar rating missing → fill it in live.
2. `STR-000245` — quality: length in ft vs mm → correct the UoM live.
3. `MAT-000567` — technical: yield 180 MPa < ASTM A240 min 205 → show the rule cites the standard; mark for vendor NCR (leave open — realistic).
Re-run: dashboard improves in real time. "Governance is enforced *before* data reaches downstream systems — not discovered after."

## 5. Publish Hub (2 min)
Open EQP-000789 → Publish. Show the payload JSON + sha256, the event log, and the 6 system families / 10 target systems. "In production these are your Middleware connectors — Aconex, P6, SAP, AVEVA PI, EPM — same API you saw documented at /api/v1."

## 6. Close (1 min)
- "Everything you saw maps to Module M1, Gate G4 scope, in the Master Roadmap."
- "This runs on the exact stack in our roadmap — Next.js, TypeScript, Postgres, Azure-ready, KSA-resident."
- Tee up phase 2: AI standards navigator (SoW 3.1.7) + auto-classification demo.

**If asked "is this the pilot?"** — No: the delivery pilot per roadmap is M2 AWP + M3 Pre-Comm (W5–12). This is the data foundation those modules stand on, which is why we recommend building the registry core in Phase 1–2.
