# Security Questionnaire: Pre-Answers

**Date:** 2026-07-15 | **Status:** 🟡 Draft, contains items XD House must confirm

> Purpose: answer Maaden's security questionnaire **before it arrives**. Answers describe
> the **delivered production platform**, which is what Maaden is procuring.
>
> **Rule for using this document:** answer what is asked, and never claim a control, a test
> or a certificate we do not have. A reviewer verifies claims. One unsupportable answer
> costs more than every good answer earns.

---

## Data & encryption

| Question | Answer |
|---|---|
| Do you encrypt data in transit? | ✅ TLS 1.2+ end to end, browser to app and app to database. HSTS enforced at Azure Front Door. |
| Do you encrypt data at rest? | ✅ Azure platform encryption (TDE) on database and storage. |
| Where is our data stored? Onshore or offshore? | ✅ **Kingdom of Saudi Arabia.** Azure App Service and Azure Database for PostgreSQL, Riyadh region. No Maaden production data offshore. |
| How are keys and secrets managed? | ✅ Azure Key Vault with managed identity. No credentials in source, config or environment files. Rotation policy applies. |
| Data classification & retention? | `[XDH TO CONFIRM]` |
| Do any sub-processors receive our data? | `[XDH TO CONFIRM: if the optional AI layer is enabled, name the model provider, what is sent, where it is processed, and the contractual terms. If not enabled, the answer is none.]` |

## Access control

| Question | Answer |
|---|---|
| Authentication method? | ✅ Azure AD and ADFS SSO via SAML 2.0. Maaden's identity provider is the source of truth. No local accounts. |
| Is MFA enforced? | ✅ Yes, per SoW §3.4. |
| Role-based access control? | ✅ Four least-privilege roles: Data Governance Lead, Discipline Engineer, Document Controller, Viewer/Downstream. Enforced server-side on every mutating API call. |
| Is authorization enforced in the API or only the UI? | ✅ Server-side, in the API. Hiding a control in the interface is not access control. |
| Who has privileged access to production? | `[XDH TO CONFIRM: named individuals, and the break-glass procedure]` |
| Joiner / mover / leaver process? | `[XDH TO CONFIRM]` |

## Data integrity and governance

| Question | Answer |
|---|---|
| Is there an audit trail of data changes? | ✅ Immutable. Every mutation records actor, action, value before and after, and timestamp (SoW §3.1.4). |
| Can approved engineering data be silently altered? | ✅ No. A change to an Approved asset creates a new revision and forces re-validation. There is no quiet-overwrite path. |
| How do you stop bad data reaching our downstream systems? | ✅ An asset publishes only when Validated against an Approved data template. Every publish carries a sha256 payload hash. Non-compliant assets are blocked and the block is recorded. |
| Can we prove what was sent to a downstream system? | ✅ Yes. Each publish event stores the full payload and its hash. |

## Testing & assurance

| Question | Answer |
|---|---|
| Do you run vulnerability scans? | ✅ Continuous dependency scanning in CI, with a patch SLA by severity. |
| **When was your last penetration test?** | **None yet for this platform, because it is not yet built.** An independent penetration test is committed before go-live, then `[XDH TO CONFIRM: annually]`. You receive the report and the retest letter. See `03`. **Do not answer this any other way.** |
| Do you audit your own stack? | ✅ Yes. A 13-layer internal audit before each release gate, covering every layer in `02`. You receive the scorecard. |
| What is your testing sequence? | Audit, remediate, independent penetration test, re-audit. We fix known gaps before paying an external firm, so the engagement finds what we missed. |
| Secure SDLC? | 🟡 Peer review, gated pipelines on GitHub Enterprise and Azure DevOps, no manual production access. Formal policy: `[XDH TO CONFIRM]` |
| SBOM? | `[XDH TO CONFIRM]` |

## Operations

| Question | Answer |
|---|---|
| Logging and monitoring? | ✅ Application Insights, plus immutable application audit trail. Security events forwarded to **Maaden's Azure Sentinel SIEM** per SoW §3.4. |
| Backups, RPO and RTO? | ✅ Azure point-in-time restore, with rehearsed restore drills. Targets: `[XDH TO CONFIRM: RPO/RTO]` |
| Availability / SLA? | `[XDH TO CONFIRM]` |
| **Do you have an incident response plan? Can we see it?** | ✅ Yes, and yes. See `04`. Severity levels, named roles, containment, notification timelines, post-incident review. `[XDH TO CONFIRM: sign it before issuing]` |
| Disaster recovery / business continuity? | `[XDH TO CONFIRM]` |

## Compliance & company

| Question | Answer |
|---|---|
| BSI Kitemark? | ✅ XD House holds the BSI Kitemark for BIM Design and Construction, and for BIM Security. BIM Security covers security-minded information management for built assets, directly relevant to a CDE. `[XDH TO CONFIRM: certificate number, scope and validity before quoting]` |
| ISO 27001 / SOC 2? | `[XDH TO CONFIRM]` **State only what is held and evidenceable. If not certified, say "not certified, aligned to ISO 27001 practice." Never imply otherwise.** |
| Saudi PDPL compliance? | `[XDH TO CONFIRM: take legal advice, do not assert without it]` |
| Cyber insurance? | `[XDH TO CONFIRM]` |
| Security training for staff? | `[XDH TO CONFIRM]` |
| Vulnerability disclosure channel? | `[XDH TO CONFIRM: see 01]` |
| Sub-contractors? | `[XDH TO CONFIRM]` |

---

## How to handle the awkward question

**"When was your last penetration test?"**

None yet for this platform, because it is not yet built. Testing an unbuilt system proves
nothing. The test is committed before go-live and scoped already: grey-box, against a
pre-production environment that mirrors production, with authorization and privilege
escalation across the four roles as the priority area. You will receive the findings
report and the retest letter confirming the findings were closed.

Our sequence is audit, remediate, independent test, re-audit. We do not pay an external
firm to rediscover what an internal audit already documented, and we do not present a test
result until an external firm has actually produced one.
