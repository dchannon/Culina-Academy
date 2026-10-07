# Support Model

Use repository issue templates for public documentation, examples, workbook, and validation questions. Use the assigned Data Culina client support channel for environment-specific incidents.

## Severity Guide

| Severity | Meaning | Response |
| --- | --- | --- |
| Sev 1 | Production-critical output unavailable or materially incorrect; broad data/consumer impact. | Preserve evidence and contact the assigned client support channel immediately. |
| Sev 2 | Important failure with partial output/workaround, exhausted retry, or scoped source outage. | Diagnose current authorities and escalate when recovery scope or committed effects are uncertain. |
| Sev 3 | Non-critical issue/question or documentation/configuration review. | Use normal support flow with a reproducible example. |

These are triage categories, not response-time or availability commitments. A notification outage and a data-quality incident can have different severity.

## Ownership Split

| Area | Client/operator | Data Culina support or responsible owner |
| --- | --- | --- |
| Source/input | Confirm availability, historical coverage, timing, and access. | Source owner corrects source behavior; support interprets ingestion evidence. |
| Configuration/bindings | Confirm business intent, resolved environment values, selected backend, and approved scope. | Review contracts, relationships, catalog/secret/storage bindings, and deployment status. |
| Runtime/validation | Collect official state, history/result, test details, and logging/finalization evidence. | Diagnose execution, tests, publication, and cross-open-batch dependencies. |
| Recovery | Approve business scope/window; reconcile active workers and committed effects. | Advise targeted retry/rerun/replay/backfill/rebuild and required reconciliation. |
| Service side effects | Confirm destination outcome without sharing credentials. | Handler/platform owner resolves ambiguous writes, concurrency, and permissions. |
| Notification | Collect POST/mark evidence separately from data status. | Integration owner handles handoff; downstream service owns routing, templates, and channel delivery. |
| Platform qualification | Validate actual client bindings and end-to-end journeys. | Distinguish available artifacts/local tests from live platform qualification. |

## Evidence To Include

Use [Support Handoff](support-handoff.md). Include UUID identities/workload run, UTC times, official retry/batch state, earliest blocker, sanitized error/failed step, required test details, last correct layer, committed effects, and actions already attempted.

For append recovery, state whether the same control batch/queue was retained or new work was seeded, and whether old duplicates were reconciled. For publication/notifications, distinguish data write, required serving outcome, handoff marking, and final delivery.

## What Not To Send

Do not publish passwords, tokens, private keys, signed endpoints, raw credential-bearing configuration, personal data extracts, or unrelated sensitive logs. Sanitize evidence and use approved private channels for client-specific detail.

Escalate ambiguous external commits, hydration/key conflicts, historical reconciliation, stranded finalization, required publisher capability gaps, or repeat non-transient failures before another broad recovery. ADF + Databricks has local deterministic evidence with live cloud sandbox qualification pending; historical sandbox exercises do not certify every client platform.
