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
precondition. We design to a defined 13-layer control standard, build every layer against
Maaden's own stated requirements, and prove the result through internal audit and
independent penetration testing before go-live.

## Data residency

All Maaden production data remains **in the Kingdom of Saudi Arabia**. The platform runs on
Azure App Service and Azure Database for PostgreSQL in the **Riyadh** region, consistent
with the Master Roadmap. No Maaden production data is processed or stored offshore.

`[XDH TO CONFIRM]` whether any sub-processor, for example model APIs used by the optional
AI layer, receives data. If so, state what, where, and under what terms. State this
plainly. Do not leave it implied.

## Encryption

| | Control |
|---|---|
| **In transit** | TLS 1.2+ for all traffic, browser to app and app to database. HSTS enforced at the edge. |
| **At rest** | Azure platform encryption (TDE) on database and storage. |
| **Keys & secrets** | Azure Key Vault with managed identity. No credentials in source or configuration files. |

## Access control

- **Identity:** Azure AD and ADFS SSO via SAML 2.0. Maaden's own identity provider is the
  source of truth. **MFA enforced**, per SoW mandate. No local accounts.
- **Roles:** four least-privilege roles: Data Governance Lead, Discipline Engineer,
  Document Controller, Viewer/Downstream. Enforcement is **server-side** on every mutating
  API call, not hidden UI. Hiding a button is not access control.
- **Network:** WAF at Azure Front Door. Private networking between application and
  database. No public path to the data tier.

## Protecting the integrity of your data

Beyond infrastructure, the platform is built so that governed engineering data cannot be
quietly altered.

- **Immutable audit trail (SoW §3.1.4).** Every change records who, what, the value before
  and after, and when.
- **Approved data is immutable.** A change to an Approved asset creates a new revision and
  forces re-validation. It never silently overwrites.
- **Governed publishing.** An asset reaches downstream systems only when it is Validated
  against an Approved template. Every publish carries a sha256 payload hash, so what was
  sent can be proven later. Non-compliant assets are blocked, and the block is recorded.

## Assurance

| Activity | Cadence |
|---|---|
| Internal 13-layer audit | Before each release gate |
| Dependency vulnerability scanning | Continuous, in CI, with a patch SLA by severity |
| Independent external penetration test | Before go-live, then `[XDH TO CONFIRM: annually]` |
| Re-audit confirming remediation held | After each penetration test |
| Backup restore drill | `[XDH TO CONFIRM: quarterly]` |

Maaden receives the audit scorecard, the penetration test report, and the retest letter
confirming findings were closed. See `03 Security Assurance & Testing Plan`.

**Stated plainly:** no penetration test has been commissioned yet, because the platform is
not yet built. We will not present a test report until an independent firm has actually
performed the engagement.

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

XD House holds the **BSI Kitemark for BIM Design and Construction, and for BIM Security**.
BIM Security addresses security-minded information management for built assets, which is
directly relevant to a Common Data Environment.
`[XDH TO CONFIRM: certificate number, scope and validity before this is quoted to Maaden.]`

`[XDH TO CONFIRM]` any other certification. State only what XD House actually holds and can
evidence on request. **If a standard is not held, say so and state the alignment instead**,
for example "we align to ISO 27001 practice; we are not certified." An unsupportable claim
here is the fastest way to fail a security review.
