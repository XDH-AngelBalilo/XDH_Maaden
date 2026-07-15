# Maaden ARGP: Security & Assurance Pack

**Prepared by:** XD House | **Date:** 2026-07-15
**Refs:** SoW ARGP-DIGI-APP-SOW-001 Rev 00 (§3.4 Security & Integration), Master Roadmap XDH-AE-Q26-05-00030 v1.0

---

## Why this pack exists

Maaden's security and IT review team will evaluate XD House **before** commercial terms are
agreed. That review arrives as a questionnaire: encryption, data residency, penetration
testing, incident response, access control. Deals stall at that gate, usually in silence.

This pack answers it in advance. It sets out the security controls XD House will implement
for the ARGP Digitalization Platform, mapped to Maaden's own stated requirements, and the
assurance regime that proves those controls work.

## What is in the pack

| # | Document | Purpose |
|---|---|---|
| 01 | **Security Overview** | The client-facing summary. Encryption, residency, access control, assurance, vulnerability reporting. Doubles as the copy for a Security page on the XD House website. |
| 02 | **Security Implementation Plan** | The 13 control layers we will build, each mapped to the SoW clause it satisfies and the Azure service that delivers it. |
| 03 | **Security Assurance & Testing Plan** | How the controls are proven: internal audit, independent penetration test, re-audit, and the cadence for each. |
| 04 | **Incident Response Plan** | Severity levels, roles, containment, notification timelines, post-incident review. |
| 05 | **Security Questionnaire, Pre-Answers** | Maaden's likely questions, answered. |

## Scope

This pack describes the **delivered production platform**. It is written to be handed to
Maaden's security reviewers alongside the proposal.

It deliberately does not discuss the pre-award demonstration application. That demo is a
sales artifact running on a laptop. It holds no Maaden data, is not internet-facing, and
is not what Maaden is procuring. Its localhost configuration has no bearing on the security
of the delivered platform, and raising it would only confuse the review.

## Two rules before this leaves the building

1. **Items marked `[XDH TO CONFIRM]` are unverified.** These are facts only XD House
   management holds: certification numbers, insurance, retention periods, named
   responders, SLAs. They are placeholders, **not claims**. Every one must be filled or
   struck before this pack goes to Maaden.

2. **Do not claim a test or a certificate we do not have.** No penetration test has been
   commissioned yet for this platform, and document 03 presents that as a plan, which is
   the honest position at pre-award. Do not assert ISO 27001 or SOC 2 anywhere unless
   XD House holds the certificate and can produce it on request. A certification claim is
   the first thing a security reviewer verifies, and an unsupportable one ends the review.

## Recommended sequence

1. XD House fills every `[XDH TO CONFIRM]`.
2. Confirm the BSI Kitemark certificate number, scope and validity before quoting it.
3. Publish 01 as a Security page on the XD House website. It answers much of a standard
   questionnaire at no cost.
4. Send the pack with the proposal.
