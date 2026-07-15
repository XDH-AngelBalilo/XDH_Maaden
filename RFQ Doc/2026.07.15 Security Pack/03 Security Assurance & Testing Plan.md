# Security Assurance & Testing Plan

**Date:** 2026-07-15 | **Ref:** SoW ARGP-DIGI-APP-SOW-001 Rev 00 §3.4
**Scope:** The delivered ARGP Digitalization Platform.

---

## The principle

Controls that are never tested are claims, not controls. The implementation plan in `02`
says what we build. This says how we prove it works, and how Maaden sees the evidence.

Our sequence is always the same:

```
Audit  ->  Remediate  ->  Independent penetration test  ->  Re-audit
```

The order matters. An internal audit against the 13 layers finds the known gaps cheaply.
We close those first. Only then do we pay an external firm, so the engagement is spent
finding what we missed rather than rediscovering what we already documented. The re-audit
confirms the fixes held and nothing regressed.

## The regime

| Activity | What it covers | Cadence |
|---|---|---|
| **Internal 13-layer audit** | Every layer in `02`, by source review, configuration review and live reproduction | Before each release gate |
| **Dependency scanning** | Known CVEs in the dependency tree, with a patch SLA by severity | Continuous, in CI |
| **Independent penetration test** | Authenticated and unauthenticated surfaces, the REST API, privilege escalation across the four roles, injection, session handling, business-logic abuse | Before go-live, then `[XDH TO CONFIRM: annually, and after any material architecture change]` |
| **Re-audit** | Confirms remediation held | After each pen test |
| **Restore drill** | Proves the backup is actually restorable, against the documented RPO and RTO | `[XDH TO CONFIRM: quarterly]` |
| **Incident response exercise** | Tabletop against the plan in `04` | `[XDH TO CONFIRM: semi-annual]` |

## Penetration test scope

The test runs against a **pre-production environment that resembles production**: Azure,
Riyadh, with the WAF, TLS and the identity provider all in place. Testing a laptop proves
nothing about the delivered system.

**In scope**
- Web application, authenticated and unauthenticated surfaces
- REST API `/api/v1/*`, all methods, against the published OpenAPI spec
- **Authorization and privilege escalation across the four roles.** Can a Viewer mutate?
  Can an Engineer approve a template or publish? Can role claims be forged?
- Session management: token handling, cookie flags, fixation, replay
- Injection: SQLi, XSS, SSRF, template and JSON injection
- Publishing integrity: payload tampering, sha256 verification, and whether a
  non-compliant asset can be forced through the compliance gate
- Business-logic abuse: bypassing validation, or circumventing the immutability of
  Approved data
- Security headers, TLS configuration, dependency exposure
- Prompt injection and cost-amplification abuse, if the optional AI layer is enabled

**Out of scope**
- Azure platform internals, which are Microsoft's responsibility
- Maaden's own downstream systems (Aconex, P6, SAP, AVEVA PI). Connector interfaces only,
  never the systems themselves
- Volumetric denial-of-service testing, to be coordinated separately if required
- Physical and social engineering `[XDH TO CONFIRM with Maaden]`

**Method:** Grey-box. The firm receives test credentials for each of the four roles, the
OpenAPI spec and the architecture. Grey-box finds authorization flaws that black-box
testing misses, and authorization is the highest-value area for a governed data platform.

**Standard:** OWASP ASVS, the OWASP Top 10 and the API Security Top 10.

## Commissioning

| Item | Value |
|---|---|
| Firm | `[XDH TO CONFIRM]` Independent. Must not be XD House. |
| Timing | After remediation of the pre-go-live audit, before pilot go-live |
| Duration | `[XDH TO CONFIRM: typically 5 to 10 days for this scope]` |
| Deliverable | Findings report with severities and evidence, plus a retest letter once fixes land |

## What Maaden receives

1. The **audit scorecard** for the release gate, showing each of the 13 layers assessed.
2. The **independent penetration test report**, and the **retest letter** confirming the
   findings were closed. The retest letter is the artefact that matters most to a
   reviewer.
3. Confirmation that the **re-audit** passed.

**Current status, stated plainly.** No penetration test has been commissioned yet, because
the platform is not yet built. This document is the plan we commit to, not a result. We
will not present a test report until an independent firm has actually performed the
engagement.
