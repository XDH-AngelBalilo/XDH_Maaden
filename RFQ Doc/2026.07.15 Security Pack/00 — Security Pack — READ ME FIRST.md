# Maaden ARGP — Security & Assurance Pack

**Prepared by:** XD House · **Date:** 2026-07-15
**Refs:** SoW ARGP-DIGI-APP-SOW-001 Rev 00 (§3.4 Security & Integration) · Master Roadmap XDH-AE-Q26-05-00030 v1.0

---

## Why this pack exists

Maaden's security / IT review team will evaluate XD House **before** commercial terms are
agreed. That review arrives as a questionnaire — encryption, data residency, penetration
testing, incident response, access control. Deals stall at that gate, usually in silence.

This pack is the pre-emptive answer. It is designed to be handed to Maaden's security
reviewers alongside the CDE demo, so the questionnaire is largely answered before it is
sent.

## What is in the pack

| # | Document | Audience | Status |
|---|---|---|---|
| 01 | **Security Overview** | Maaden — any reviewer | ✅ Ready to send |
| 02 | **Production Readiness Audit — 13 Layers** | Maaden security / XD House engineering | ✅ Real audit, completed 2026-07-15 |
| 03 | **Penetration Test — Scope & Commission Plan** | Maaden security / XD House management | ⚠️ Plan only — **no test has been run yet** |
| 04 | **Incident Response Plan** | Maaden security | 🟡 Draft — needs XD House sign-off |
| 05 | **Security Questionnaire — Pre-Answers** | Maaden procurement / security | 🟡 Draft — contains items XD House must confirm |

## ⚠️ Read this before anything leaves the building

Three honesty constraints are baked into this pack. Do not let them be edited out:

1. **The audit (02) scores the *localhost demo*, not a production system.** It is an honest
   assessment and it contains failures — deliberately. Those failures are demo-scope
   decisions (e.g. the unauthenticated role switcher), not defects to hide. Presenting the
   demo as production-secure would be false and would not survive Maaden's own review.

2. **There is no penetration test report, because no penetration test has been run.**
   Document 03 is a *scope and commission plan* for an external firm. Never present it as
   a result. The correct sequence is: audit → fix → external pen test → re-audit. We are
   at step 1.

3. **Items marked `[XDH TO CONFIRM]` are unverified.** These are facts only XD House
   management holds — certification status, insurance, retention periods, named
   responders. They are placeholders, **not claims**. Every one must be filled or struck
   before this pack goes to Maaden. Do not assert ISO 27001 / SOC 2 status anywhere unless
   XD House actually holds the certificate and can produce it on request.

## Recommended sequence

1. XD House fills every `[XDH TO CONFIRM]` in 04 and 05.
2. Remediate the **Critical** and **High** findings in 02 (see its remediation plan) — most
   are hours, not weeks, because they are production-hardening steps the demo deliberately
   skipped.
3. Re-run the audit; confirm the fixes hold.
4. Commission the external pen test per 03.
5. Publish 01 (Security Overview) as a page on the XD House website — it answers roughly
   half the questionnaire at zero cost.
6. Send 01 + 02 + the pen test report to Maaden with the proposal.
