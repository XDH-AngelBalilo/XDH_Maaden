# Penetration Test: Scope & Commission Plan

**Date:** 2026-07-15 | **Status:** ⛔ **PLAN ONLY. NO TEST HAS BEEN PERFORMED.**

---

## What this document is not

This is **not** a penetration test report. No external team has attempted to compromise the
Maaden ARGP CDE application. There are no results, no findings, and no scorecard to show.

This document exists so that the test can be commissioned correctly. **Do not send it to
Maaden as evidence of testing**, and do not let it be summarised in a proposal as though a
test occurred. A pen test report is only meaningful when an independent firm actually ran
the engagement and signed the result. If Maaden asks "when was your last penetration
test?", the honest answer today is: *"None yet on this application. It is scoped and will
be commissioned after remediation of our audit findings. Here is the scope, and here is
the audit."* That answer, with a real audit attached, survives scrutiny. A fabricated one
does not.

## Why the order matters

```
Audit  ->  Remediate  ->  External pen test  ->  Re-audit
 done       now             this doc             pending
```

You do not pay an external firm to discover what you already know. The audit
(`02 Production Readiness Audit`) surfaced 2 Critical and 4 High findings. Testing before
fixing those burns the engagement on known issues and produces a report full of problems
we could have closed ourselves. Fix first. Then the pen test earns its fee by finding what
we missed.

## Precondition, must be closed before testing

| Finding | Description | Status |
|---|---|---|
| C-1 | Unauthenticated requests served as Governance Lead | ⏳ Open |
| C-2 | `/auth/switch` issues sessions with no authentication | ⏳ Open |
| H-1 | Default JWT signing secret | ⏳ Open |
| H-2 | Next.js version with high-severity advisories | ⏳ Open |
| H-3 | Session cookie missing `Secure` | ⏳ Open |
| H-4 | No transport encryption, Postgres `trust` auth | ⏳ Open |

Testing a target that still carries C-1 is pointless. The first request wins.

## Proposed scope

**Target:** Maaden ARGP CDE, pre-production environment (Azure, Riyadh), post-remediation,
with Azure AD and ADFS SSO wired.
**Not localhost.** The test must run against an environment that resembles production,
including the WAF, the identity provider, and TLS.

**In scope**
- Web application (7 screens plus AI Assistant), authenticated and unauthenticated surfaces
- REST API `/api/v1/*`, all methods, including the OpenAPI-documented surface
- **Authorization and privilege escalation across the 4 roles.** This is the highest-value
  area given the demo's history (C-1 and C-2). Explicitly test: can a Viewer mutate? Can an
  Engineer approve a template or publish? Can role claims be forged?
- Session management: JWT handling, cookie flags, fixation, replay
- Injection: SQLi, XSS, SSRF, template and JSON injection
- The publish simulator: payload tampering, integrity of the sha256 hash, blocked-publish
  bypass. Can a non-compliant asset be published?
- The AI endpoints: **prompt injection** and cost-amplification abuse. A model-backed
  endpoint is a spend vector, not just a data one.
- Business-logic abuse: can validation be bypassed? Can immutability of Approved data be
  circumvented?
- Security headers, TLS configuration, and dependency exposure

**Out of scope**
- Azure platform internals (Microsoft's responsibility)
- Physical and social engineering `[XDH TO CONFIRM with Maaden]`
- Denial-of-service volumetric testing (coordinate separately)
- Maaden's own downstream systems (Aconex, P6, SAP, AVEVA PI). Connector *interfaces* only,
  not the systems themselves

**Method:** Grey-box. Provide the firm with test credentials for each of the four roles,
the OpenAPI spec, and the architecture. Grey-box finds authorization flaws that black-box
misses, and authorization is our known risk area.

**Standard:** OWASP ASVS and the OWASP Top 10, plus the API Security Top 10, as the
baseline.

## Commissioning

| Item | Value |
|---|---|
| Firm | `[XDH TO CONFIRM]` Independent. Must not be XD House. |
| Timing | After remediation, before pilot go-live |
| Duration | `[XDH TO CONFIRM: typically 5 to 10 days for this scope]` |
| Budget | `[XDH TO CONFIRM]` |
| Deliverable | Findings report with severities and evidence, plus a retest letter after fixes |
| Cadence thereafter | `[XDH TO CONFIRM: annually, and after any material architecture change]` |

## After the test

1. Remediate findings by severity, to an agreed SLA.
2. Obtain the **retest / clearance letter**. This is the artefact Maaden's reviewers
   actually want, more than the raw findings.
3. Run **audit #2** to confirm fixes held and nothing regressed.
4. Then, and only then, the pack contains the two documents that answer most procurement
   questions: **an audit scorecard** and **an independent pen test result**.
