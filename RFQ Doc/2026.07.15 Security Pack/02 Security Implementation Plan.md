# Security Implementation Plan: 13 Control Layers

**Date:** 2026-07-15 | **Ref:** SoW ARGP-DIGI-APP-SOW-001 Rev 00 §3.4, Master Roadmap XDH-AE-Q26-05-00030 v1.0
**Scope:** The delivered ARGP Digitalization Platform (production and pre-production).

---

## How we approach it

Security is not a feature added once the platform works. For the layer every downstream
system will trust, the asset data backbone, it is the precondition. We therefore design to
a defined 13-layer control standard, build each layer against Maaden's own stated
requirements, and prove the result through the assurance regime in `03`.

Every layer below names the control, the SoW clause it satisfies, and the service that
delivers it. Nothing here is aspirational language: each row is a build item with an owner
and a gate in the Master Roadmap.

---

## The 13 layers

| # | Layer | What we implement | Driver |
|---|---|---|---|
| 1 | **Authentication & session** | Azure AD and ADFS SSO via SAML 2.0. Maaden's identity provider is the source of truth. MFA enforced. No local accounts. | SoW §3.4 |
| 2 | **Authorization / RBAC** | Four least-privilege roles: Data Governance Lead, Discipline Engineer, Document Controller, Viewer/Downstream. Enforced server-side on every mutating call, not in the UI. | SoW §3.1.4, §3.4 |
| 3 | **Data protection** | TLS 1.2+ browser to app and app to database. HSTS at the edge. Azure TDE at rest on database and storage. | SoW §3.4 |
| 4 | **Database** | Azure Database for PostgreSQL, private endpoint, no public network path, least-privilege database roles, TLS-only connections. | Roadmap T-060, T-173 |
| 5 | **Input validation & injection defence** | Parameterised queries throughout, no string-built SQL. Schema validation at the API boundary. Output encoding in the UI. | OWASP ASVS |
| 6 | **Secrets management** | Azure Key Vault with managed identity. No credentials in source, config files or environment files. Rotation policy. | SoW §3.4 |
| 7 | **Dependencies & supply chain** | Automated vulnerability scanning in CI, a defined patch SLA by severity, and an SBOM per release. | Best practice |
| 8 | **Browser hardening** | Content Security Policy, HSTS, X-Content-Type-Options, X-Frame-Options and Referrer-Policy, enforced at Azure Front Door. | OWASP |
| 9 | **Hosting & network** | Azure App Service in the **Riyadh** region for KSA data residency. WAF at Front Door. Private networking between tiers. | SoW §3.4, residency |
| 10 | **Deployment & CI/CD** | GitHub Enterprise and Azure DevOps pipelines. Gated releases, peer review, no manual production access, full deployment audit. | Roadmap |
| 11 | **Logging, audit & monitoring** | Immutable application audit trail (actor, action, before and after value, timestamp). Application Insights. Security events forwarded to **Maaden's Azure Sentinel SIEM**. | SoW §3.1.4, §3.4 |
| 12 | **Scaling & availability** | App Service autoscale, health probes, defined SLO. `[XDH TO CONFIRM: target availability]` | SoW |
| 13 | **Backup & disaster recovery** | Azure point-in-time restore, documented RPO and RTO, and rehearsed restore drills. `[XDH TO CONFIRM: RPO/RTO targets]` | SoW |

---

## Governance controls built into the platform

These are not infrastructure controls. They are how the platform protects the integrity of
Maaden's asset data, and they are already demonstrable in the CDE prototype.

**Immutable audit trail (SoW §3.1.4).** Every mutation records who did it, what changed,
the value before and after, and when. The trail cannot be edited from the application.

**Approved data is immutable.** Once an asset is Approved and Published, a change does not
silently overwrite it. It creates a new revision and returns the asset for re-validation.
There is no path to quietly alter approved engineering data.

**Governed publishing.** An asset can only be published to downstream systems when it is
Validated against its data template and its template is Approved. Every publish writes a
payload with a sha256 hash, so what was sent can be proven later. Non-compliant assets are
blocked and recorded as blocked.

**Server-side authorization.** Role checks run in the API, not in the interface. Hiding a
button is not access control.

---

## Production architecture

| Concern | Implementation |
|---|---|
| Application | Azure App Service, Riyadh region, behind Azure Front Door and WAF |
| Identity | Azure AD and ADFS, SAML 2.0, MFA enforced |
| Data | Azure Database for PostgreSQL, private endpoint, TDE at rest, TLS in transit |
| Secrets | Azure Key Vault, managed identity |
| Monitoring | Application Insights, with security events to Maaden's Azure Sentinel |
| Integrations | Middleware connectors to the 10 roadmap systems: Aconex, Primavera P6, SAP S/4HANA, AVEVA PI, MS EPM, Azure AD, ADFS, SIEM, Outlook, ServiceNow |
| CI/CD | GitHub Enterprise, Azure DevOps, gated pipelines |

**Data residency.** All Maaden production data remains in the Kingdom of Saudi Arabia. No
Maaden production data is processed or stored offshore.
`[XDH TO CONFIRM: if the optional AI layer is enabled, state the model provider, exactly
what is sent, where it is processed, and under what contractual terms. Do not leave this
implied.]`
