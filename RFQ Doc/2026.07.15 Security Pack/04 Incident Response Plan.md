# Incident Response Plan: Maaden ARGP CDE

**Date:** 2026-07-15 | **Status:** 🟡 **DRAFT, requires XD House management sign-off**
**Ref:** SoW ARGP-DIGI-APP-SOW-001 Rev 00 §3.4

> Maaden's reviewers will ask two questions: *"Do you have an incident response plan?"* and
> *"Can we see it?"* A plan that exists only as an intention fails the second question.
> This draft is structured to be signed, dated, and produced on request. Every
> `[XDH TO CONFIRM]` below is a decision only XD House management can make. **An unsigned
> plan with open placeholders must not be sent to Maaden as a finished document.**

---

## 1. Scope

Applies to security incidents affecting the Maaden ARGP CDE application, its data, or its
supporting infrastructure. That includes the production environment, pre-production
environments holding Maaden data, and XD House systems with access to either.

## 2. Severity levels

| Level | Definition | Examples | Target response |
|---|---|---|---|
| **SEV-1 Critical** | Confirmed breach of Maaden data, or total loss of service | Data exfiltration, ransomware, auth bypass exploited in production | Immediate. `[XDH TO CONFIRM: e.g. 1 h to acknowledge, 24x7]` |
| **SEV-2 High** | Credible threat to data or major functional loss | Privilege escalation found in production, critical CVE actively exploited | `[XDH TO CONFIRM: e.g. 4 h]` |
| **SEV-3 Medium** | Limited impact, contained | Isolated misconfiguration, failed intrusion attempt | `[XDH TO CONFIRM: e.g. 1 business day]` |
| **SEV-4 Low** | No immediate risk | Informational finding, low-severity dependency advisory | Next planned cycle |

## 3. Roles

| Role | Responsibility | Named owner |
|---|---|---|
| Incident Lead | Owns the incident end to end, declares severity, calls it closed | `[XDH TO CONFIRM]` |
| Technical Lead | Investigation, containment, remediation | `[XDH TO CONFIRM]` |
| Client Liaison (Maaden) | Single channel to Maaden, owns notification | `[XDH TO CONFIRM]` |
| Management Escalation | Legal, regulatory and commercial decisions | `[XDH TO CONFIRM]` |

Out-of-hours contact: `[XDH TO CONFIRM]`

## 4. Lifecycle

**1. Detect.** Sources: Azure Sentinel SIEM alerts (SoW-mandated forwarding), Application
Insights, dependency scanning, Maaden's own reporting, external vulnerability reports.

**2. Triage.** The Incident Lead assigns severity within `[XDH TO CONFIRM]`. Start the
incident log immediately, with every action timestamped. The log is the evidence base for
the report and for any regulatory position.

**3. Contain.** The priority is stopping harm, not preserving uptime: revoke sessions and
keys, disable the affected path, isolate the workload. **Preserve evidence before
remediating.** Snapshot logs and state first. Do not "fix" the only copy of the proof.

**4. Notify.** See §5.

**5. Eradicate and recover.** Remove the root cause, patch, restore from a known-good
backup where needed, and verify integrity before returning to service. Re-validate
published asset data integrity (payload hashes) if the publish path was implicated.

**6. Post-incident review.** Blameless, within `[XDH TO CONFIRM: e.g. 5 business days]`.
Output: timeline, root cause, what worked, and corrective actions with owners and dates.
Feed the corrective actions into the next audit cycle.

## 5. Notification

| Trigger | Notify | Timeline |
|---|---|---|
| SEV-1 or SEV-2 affecting Maaden data or service | Maaden security contact | `[XDH TO CONFIRM: commit to a number, e.g. 24 h of confirmation]` |
| Confirmed personal-data breach | Maaden plus regulator as applicable | `[XDH TO CONFIRM: must reflect Saudi PDPL obligations. Take legal advice, do not guess.]` |
| SEV-3 or SEV-4 | Routine reporting | Next status report |

Notification content: what happened, what data or systems, when detected, what is being
done, what Maaden should do, and the next update time. **Do not speculate on cause in an
early notification.** State what is confirmed and what is still under investigation.

## 6. Evidence & retention

Incident logs, snapshots and reports are retained for `[XDH TO CONFIRM]`. Audit trail data
(`audit_log`) is immutable by design and is primary evidence in any data-integrity
incident.

## 7. Testing this plan

A plan never exercised is a plan that fails in production.

| Activity | Cadence | Status |
|---|---|---|
| Tabletop exercise | `[XDH TO CONFIRM: e.g. semi-annual]` | ⏳ Not yet run |
| Backup restore drill | `[XDH TO CONFIRM: e.g. quarterly]` | ⏳ Not yet run. See audit finding **M-3**. |
| Contact list verification | `[XDH TO CONFIRM: e.g. quarterly]` | ⏳ Not yet run |

---

**Sign-off**

| | Name | Signature | Date |
|---|---|---|---|
| Prepared by | | | |
| Approved by | | | |

**Review cycle:** `[XDH TO CONFIRM: e.g. annual, and after any SEV-1 or SEV-2]`
