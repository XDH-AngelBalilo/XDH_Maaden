# Security Overview: XD House, Maaden ARGP CDE

**Date:** 2026-07-15 | **Ref:** ARGP-DIGI-APP-SOW-001 Rev 00 §3.4
**Contact for security matters:** `[XDH TO CONFIRM: security@xdhouse.co or named owner]`

> This is the client-facing summary. It doubles as the copy for a **Security page on the
> XD House website**. Publishing it answers much of a standard enterprise security
> questionnaire before the questionnaire is sent, at no cost.

---

## Our position

Security is not a feature added once the product works. For a system that will become
Maaden's asset data backbone, the layer every downstream system trusts, it is the
precondition. We therefore audit our own stack against a defined 13-layer standard,
remediate what the audit finds, commission an independent penetration test, and re-audit
to confirm the fixes held. We will show Maaden the evidence from each step.

## Data residency

All Maaden production data remains **in the Kingdom of Saudi Arabia**. The production
architecture targets Azure App Service and Azure Database for PostgreSQL in the **Riyadh**
region, consistent with the Master Roadmap. No Maaden production data is processed or
stored offshore.

`[XDH TO CONFIRM]` whether any sub-processor (for example model APIs used by the optional
AI layer) receives data, and if so what, where, and under what terms. State this plainly.
Do not leave it implied.

## Encryption

| | Control |
|---|---|
| **In transit** | TLS 1.2+ for all traffic, browser to app and app to database. HSTS enforced at the edge. |
| **At rest** | Azure platform encryption (TDE) on database and storage. |
| **Keys & secrets** | Azure Key Vault. No credentials in source or configuration files. |

## Access control

- **Identity:** Azure AD and ADFS SSO via SAML 2.0. Maaden's own identity provider is the
  source of truth. **MFA enforced**, per SoW mandate.
- **Roles:** four least-privilege roles: Data Governance Lead, Discipline Engineer,
  Document Controller, Viewer/Downstream. Enforcement is **server-side** on every mutating
  API call, not hidden UI.
- **Audit:** every change writes an immutable audit record: who, what, before and after
  value, timestamp (SoW §3.1.4). Approved data cannot be silently edited; a change creates
  a new revision and forces re-validation.

## Testing & assurance

| Activity | Cadence | Status |
|---|---|---|
| 13-layer production readiness audit | Before each release gate | ✅ Audit #1 complete (2026-07-15) |
| Remediation of audit findings | Before the gate closes | 🔄 In progress |
| Independent external penetration test | Before go-live, then `[XDH TO CONFIRM: annually?]` | ⏳ Scoped, **not yet commissioned** |
| Re-audit confirming fixes held | After remediation and pen test | ⏳ Pending |
| Dependency vulnerability scanning | Continuous in CI | 🔄 Being added |

**Current state, stated plainly:** the CDE application shown to Maaden today is a
**pre-award demonstration running on localhost**. It holds no Maaden data and is not
internet-facing. Its audit is complete and honest, including its failures, which are
demo-scope decisions with defined production controls. No penetration test has been run
yet, and we will not present one until an external firm has actually performed it.

## Incident response

We maintain an incident response plan covering detection, triage, containment,
notification and post-incident review, with defined severity levels and notification
timelines. See `04 Incident Response Plan`. Production security events are forwarded to
**Maaden's SIEM (Azure Sentinel)** per SoW §3.4.

## Reporting a vulnerability

If you believe you have found a security issue in an XD House system, please report it to
`[XDH TO CONFIRM: security contact address]`. We will acknowledge within
`[XDH TO CONFIRM: e.g. 2 business days]` and keep you updated until resolution. We will
not pursue legal action against good-faith researchers who report privately and avoid
privacy violations or service degradation.

## Certifications

`[XDH TO CONFIRM]` State only what XD House actually holds and can evidence on request,
for example the BSI Kitemark for BIM Design and Construction and for BIM Security.
**If a standard is not held, say so and state the alignment instead**, for example "we
align to ISO 27001 practice; we are not certified." An unsupportable claim here is the
fastest way to fail a security review.
