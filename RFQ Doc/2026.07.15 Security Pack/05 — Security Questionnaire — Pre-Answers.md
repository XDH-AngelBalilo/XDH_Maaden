# Security Questionnaire — Pre-Answers

**Date:** 2026-07-15 · **Status:** 🟡 Draft — contains items XD House must confirm

> Purpose: answer Maaden's security questionnaire **before it arrives**. Two answer columns:
> **Demo (today)** — the truth about the pre-award sample; and **Production (committed)** —
> what the delivered system will do per SoW §3.4 and the Master Roadmap.
>
> **Rule for using this document:** never merge the two columns. The failure mode that ends
> deals is answering a "today" question with a "committed" answer. If a reviewer asks "do
> you encrypt at rest?" about a demo that doesn't, "yes" is not a shortcut — it is a
> statement that will be tested and found false.

---

## Data & encryption

| Question | Demo (today) | Production (committed) |
|---|---|---|
| Encrypt data in transit? | ❌ No — plaintext HTTP on localhost; holds no Maaden data | ✅ TLS 1.2+ end-to-end, HSTS at the edge |
| Encrypt data at rest? | ❌ No — local Postgres, no TDE | ✅ Azure TDE on database and storage |
| Where is data stored? | Demo operator's laptop; **no Maaden data** | ✅ **KSA — Azure Riyadh region.** No production data offshore |
| Key management? | Env file (`.env.local`, gitignored) | ✅ Azure Key Vault / managed identity |
| Data classification & retention? | N/A — no real data | `[XDH TO CONFIRM]` |
| Sub-processors receiving data? | None (AI layer disabled — no API key set) | `[XDH TO CONFIRM — if the AI layer is enabled, state the model provider, what is sent, and where]` |

## Access control

| Question | Demo (today) | Production (committed) |
|---|---|---|
| Authentication method? | ❌ **None** — demo role switcher, no password (deliberate; see audit C-2) | ✅ Azure AD + ADFS SSO, SAML 2.0 |
| MFA? | ❌ No | ✅ Enforced (SoW mandate) |
| RBAC? | 🟡 Yes — 4 roles enforced server-side; but unauthenticated callers default to Governance Lead (audit C-1) | ✅ Same 4 roles, IdP-backed, no anonymous access |
| Least privilege? | 🟡 Role model yes; identity no | ✅ Yes |
| Privileged access to prod? | N/A | `[XDH TO CONFIRM — named individuals, break-glass procedure]` |
| Offboarding process? | N/A | `[XDH TO CONFIRM]` |

## Testing & assurance

| Question | Answer |
|---|---|
| Do you run vulnerability scans? | 🔄 `npm audit` run as part of audit #1 (found 1 high, 1 moderate — being remediated). Continuous CI scanning being added. |
| **When was your last penetration test?** | ❌ **None on this application.** Scoped and will be commissioned after remediation of audit findings — see `03`. **Do not answer this any other way.** |
| Do you audit your own stack? | ✅ Yes — 13-layer production readiness audit. Audit #1 complete 2026-07-15; report available on request (`02`). |
| Secure SDLC? | 🟡 Code review + audit gates; GitHub Enterprise + Azure DevOps pipelines per roadmap. Formal policy: `[XDH TO CONFIRM]` |
| Dependency / supply-chain management? | 🔄 Being added to CI. SBOM: `[XDH TO CONFIRM]` |

## Operations

| Question | Demo (today) | Production (committed) |
|---|---|---|
| Logging & monitoring? | 🟡 Immutable `audit_log` on every mutation | ✅ Same + App Insights + **Azure Sentinel SIEM** (SoW §3.4) |
| Audit trail of data changes? | ✅ **Yes** — actor, action, before/after, timestamp; Approved data immutable (new revision + re-validation) | ✅ Same, retained per policy |
| Backups / RPO / RTO? | ❌ None (audit M-3) | ✅ Azure PITR; RPO/RTO `[XDH TO CONFIRM]`; restore drills |
| Availability / SLA? | N/A | `[XDH TO CONFIRM]` |
| **Incident response plan?** | 🟡 Draft — `04`, pending sign-off | ✅ Signed, tested, SIEM-integrated |
| DR / business continuity? | ❌ None | `[XDH TO CONFIRM]` |

## Compliance & company

| Question | Answer |
|---|---|
| ISO 27001 / SOC 2? | `[XDH TO CONFIRM]` — **state only what is held and evidenceable. If none: say "not certified; aligned to ISO 27001 practice." Never imply otherwise.** |
| Saudi PDPL compliance? | `[XDH TO CONFIRM — take legal advice; do not assert without it]` |
| Cyber insurance? | `[XDH TO CONFIRM]` |
| Security training for staff? | `[XDH TO CONFIRM]` |
| Vulnerability disclosure channel? | `[XDH TO CONFIRM — see 01]` |
| Sub-contractors? | `[XDH TO CONFIRM]` |

---

## How to handle the awkward questions

**"Your demo has no authentication?"**
Correct — deliberately. It is a pre-award demonstration on localhost holding no Maaden
data, and the role switcher exists so your reviewers can move between the four personas
without us standing up an IdP for a sales demo. It is recorded as finding C-1/C-2 in our
own audit, with the production control (ADFS/Azure AD SAML, MFA) and the removal already
planned. We would rather show you the audit that finds it than a demo that hides it.

**"When was your last pen test?"**
None on this application yet. We audit before we test — testing before remediation spends
your money rediscovering what we already documented. Audit #1 is complete and you can have
it today; the external test is scoped and commissioned after remediation. You will get the
report and the retest letter.

**"Can we see your audit?"**
Yes. `02 — Production Readiness Audit — 13 Layers`. It contains our failures. That is the
point of it.
