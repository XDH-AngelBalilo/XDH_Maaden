# Production Readiness Audit — 13 Layers

**System audited:** Maaden ARGP CDE Asset Data Backbone — localhost sample (Module M1 slice)
**Commit audited:** `0d25f7f` · **Date:** 2026-07-15 · **Auditor:** XD House engineering (internal)
**Method:** Source review of the full application + dependency vulnerability scan
(`npm audit`) + live reproduction of each finding against a running instance.

---

## ⚠️ Scope statement — read first

This audit scores **a pre-award demonstration application running on localhost**. It is
not, and has never been, a production deployment. It holds no Maaden data, is not
internet-facing, and has no users other than the demo operator.

Several findings below are **deliberate demo-scope decisions**, not accidents — most
notably the unauthenticated role switcher, which exists so a reviewer can flip between
Governance Lead / Engineer / Viewer without an identity provider. They are recorded here
as findings anyway, because the honest thing to do is show the gap and the plan to close
it, and because every one of them **must** be closed before any environment holds real
data.

The value of this document to Maaden is not "the demo is secure." It is: *XD House audits
its own stack against a defined 13-layer standard, finds its own problems, and can show
you the evidence.*

---

## Scorecard

Legend — ✅ Pass · 🟡 Partial · ❌ Fail · ➖ Not applicable at demo scope

| # | Layer | Demo status | Production target (per SoW §3.4) |
|---|---|---|---|
| 1 | Authentication & session | ❌ Fail | Azure AD + ADFS SSO, SAML 2.0, MFA enforced |
| 2 | Authorization / RBAC | 🟡 Partial | Same 4-role model, enforced server-side, IdP-backed |
| 3 | Data protection (in transit / at rest) | ❌ Fail | TLS 1.2+ everywhere; TDE at rest; Azure Key Vault |
| 4 | Database | 🟡 Partial | Azure Database for PostgreSQL, private endpoint, least-privilege roles |
| 5 | Input validation & injection | ✅ Pass | Maintain; add schema validation at API boundary |
| 6 | Secrets management | 🟡 Partial | Azure Key Vault / managed identity; no secrets in env files |
| 7 | Dependencies & supply chain | ❌ Fail | Automated scanning in CI, patch SLA, SBOM |
| 8 | Browser hardening / security headers | ❌ Fail | CSP, HSTS, X-Frame-Options, Referrer-Policy via Front Door |
| 9 | Hosting & network | ➖ Demo scope | Azure App Service (Riyadh — KSA residency), WAF, private networking |
| 10 | Deployment & CI/CD | 🟡 Partial | GitHub Enterprise + Azure DevOps, gated pipelines, no manual prod access |
| 11 | Logging, audit & monitoring | 🟡 Partial | App Insights + Azure Sentinel SIEM (SoW-mandated) |
| 12 | Scaling & availability | ➖ Demo scope | App Service autoscale, health probes, defined SLO |
| 13 | Backup & disaster recovery | ❌ Fail | PITR backups, documented RPO/RTO, restore drills |

**Demo posture: 1 Pass · 5 Partial · 5 Fail · 2 N/A.** Expected for a pre-award demo. Every
Fail has a defined production control and a remediation owner below.

---

## Findings

### 🔴 CRITICAL

**C-1 — Unauthenticated requests are served as Governance Lead**
`src/lib/auth.ts` → `getSession()` returns `DEFAULT_USER` (role `governance_lead`) when no
session cookie is present. Any anonymous caller therefore holds the highest privilege.

*Reproduced:* `curl -X PATCH /api/v1/publish/targets/1 -d '{"status":"queued"}'` with no
cookie returns `200` and mutates data.

*Why it exists:* demo convenience — reviewers land on the app already "signed in".
*Production fix:* delete the fallback; unauthenticated → `401`. Session established only
via Azure AD / ADFS. **Blocking for any deployment beyond localhost.**

**C-2 — No authentication on identity selection**
`POST /api/v1/auth/switch` issues a signed JWT for any seeded username with no password,
no token, no IdP. Impersonation is a single request.

*Why it exists:* the demo role switcher.
*Production fix:* remove the endpoint entirely; replace with SAML 2.0 assertion from
ADFS/Azure AD per SoW §3.4. **Blocking.**

### 🟠 HIGH

**H-1 — Weak default signing secret**
`const SECRET = process.env.JWT_SECRET || "dev-only-change-me"` — an unset env var yields a
publicly-known signing key, allowing forged sessions.
*Fix:* fail fast on startup if `JWT_SECRET` is absent; source from Key Vault; ≥256-bit random.

**H-2 — Vulnerable framework version**
`next@14.2.5` carries **high**-severity advisories (DoS via Server Components and Image
Optimizer, XSS in App Router with CSP nonces, cache poisoning of RSC responses, request
smuggling in rewrites, SSRF via WebSocket upgrades). `postcss` carries a moderate XSS
advisory.
*Evidence:* `npm audit --omit=dev` → 2 vulnerabilities (1 high, 1 moderate).
*Fix:* upgrade Next.js and re-test the demo arc. Note this is a **major-version** upgrade —
schedule it, don't hot-patch it the night before a demo.

**H-3 — Session cookie not marked `Secure`**
`src/app/api/v1/auth/switch/route.ts` sets `httpOnly: true, sameSite: "lax"` but omits
`secure: true`, permitting transmission over plaintext HTTP.
*Fix:* `secure: true` in any non-local environment; enforce HTTPS/HSTS at the edge.

**H-4 — No transport encryption**
The sample serves plaintext HTTP on `localhost:3000`; Postgres runs with `trust` auth (no
password required locally).
*Fix:* TLS terminated at Azure Front Door; Postgres over TLS with password/managed-identity
auth and a private endpoint.

### 🟡 MEDIUM

**M-1 — No security response headers.** `next.config.mjs` is empty — no CSP, HSTS,
X-Content-Type-Options, X-Frame-Options, or Referrer-Policy. *Fix:* add a `headers()` block
and/or enforce at Front Door.

**M-2 — No rate limiting or bot protection** on any route, including the model-backed AI
endpoints (a cost-amplification vector once a key is configured). *Fix:* WAF rate rules +
per-key throttling.

**M-3 — No backup or restore procedure.** `npm run db:reset` destroys and re-seeds; there is
no backup, no defined RPO/RTO, and no restore drill. *Fix:* Azure PITR + documented,
rehearsed restore.

**M-4 — API input not schema-validated.** Handlers hand-check fields; malformed bodies rely
on Postgres constraints as the backstop. *Fix:* validate at the boundary (e.g. Zod) and
return `400` consistently.

**M-5 — No CSRF tokens on state-changing routes.** Mitigated in practice by `SameSite=Lax`
(which blocks cookies on cross-site POST), so this is defence-in-depth rather than an open
hole today. *Fix:* anti-CSRF tokens, or rely on IdP bearer tokens once C-1/C-2 are closed.

### ✅ PASSES WORTH STATING

- **P-1 — No SQL injection surface.** Every query goes through `pg` with parameterised
  placeholders. A source sweep for template-literal interpolation into `query()` returned
  **zero** hits. User-supplied filters (`class`, `hierarchy`, `q`) are bound, never
  concatenated.
- **P-2 — Secrets are not in version control.** `.env.local` is gitignored; no `.env` file
  is tracked. Confirmed against the git index.
- **P-3 — Immutable audit trail exists by design.** Every mutation writes `audit_log`
  (actor, action, entity, before/after, timestamp) — the control SoW §3.1.4 asks for, built
  in from S2 rather than retrofitted.
- **P-4 — Approved data is immutable.** Editing a Published asset forces a new revision and
  returns it to `Data Loaded` for re-validation.
- **P-5 — The AI layer fails closed.** With no `ANTHROPIC_API_KEY` the client is never
  constructed and routes return a clean `503`. The key is server-side only and never
  reaches the browser.
- **P-6 — Server-side authorization on mutations.** Role gates are enforced in the API
  handlers, not merely hidden in the UI (a `viewer` PATCH returns `403` — reproduced).

---

## Remediation plan

| ID | Action | Effort | Owner | Gate |
|---|---|---|---|---|
| C-1 | Remove `DEFAULT_USER` fallback → `401` | ~1 h | Eng | Before any shared/hosted environment |
| C-2 | Remove `/auth/switch`; wire ADFS/Azure AD SAML | 3–5 d | Eng | Before pilot |
| H-1 | Fail-fast on missing `JWT_SECRET`; Key Vault | ~2 h | Eng | Before pilot |
| H-2 | Upgrade Next.js; re-verify demo arc | 0.5–2 d | Eng | Before pilot |
| H-3 | `secure: true` + HSTS | ~1 h | Eng | Before pilot |
| H-4 | TLS end-to-end; Postgres TLS + auth | 1–2 d | Eng/Infra | Before pilot |
| M-1 | Security headers / CSP | ~4 h | Eng | Before pilot |
| M-2 | WAF rate limiting | ~1 d | Infra | Before pilot |
| M-3 | Backups + documented, drilled restore | 2–3 d | Infra | Before go-live |
| M-4 | Boundary schema validation | 1–2 d | Eng | Before go-live |
| M-5 | CSRF defence-in-depth | ~4 h | Eng | Before go-live |

**Note on sequence:** C-1 and C-2 are *demo-scope removals*, not new engineering. They are
listed as Critical because if the demo is ever exposed beyond localhost — a shared
staging URL for Maaden to click through, for example — they become live vulnerabilities
that hour one of any real assessment will find.

## Re-audit

This document is audit **#1**. Per XD House practice the sequence is:
**audit → remediate → external penetration test → re-audit.**
Audit #2 runs after remediation and confirms the fixes held; only then does the pen test
result mean anything. See `03 — Penetration Test — Scope & Commission Plan`.
