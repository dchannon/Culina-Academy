# Support Model

Use this page to decide what evidence to collect and when to escalate.

## Severity Guide

| Severity | Meaning | Examples | Response expectation |
| --- | --- | --- | --- |
| Sev 1 | Production-critical output unavailable or materially incorrect. | Executive dashboard unusable, downstream interface blocked, broad client data failure. | Collect evidence immediately and contact the accountable support channel. |
| Sev 2 | Important workflow failed, but workaround or partial output exists. | One domain delayed, retry exhausted, upstream source outage affecting a subset. | Diagnose with control-plane evidence and escalate if recovery is not clear. |
| Sev 3 | Non-critical issue or question. | Configuration review, isolated validation warning, documentation question. | Track and resolve through normal support flow. |

## Ownership Split

| Area | Client or operator | Data Culina support |
| --- | --- | --- |
| Source availability | Confirm source system, file, API, credentials, and timing. | Help interpret source-detail configuration and framework evidence. |
| Configuration review | Confirm business intent, expected input, and expected output. | Review control-plane relationships and metadata patterns. |
| Runtime diagnosis | Collect status, queue, history, failure, and dependency evidence. | Help identify cause and recovery direction. |
| Recovery | Approve business scope and timing. | Advise rerun, replay, backfill, or rebuild path. |

## Evidence To Include

- environment or workspace
- workflow name
- job id, queue id, batch id, and run id where visible
- current status and status history
- first failing upstream job
- failure message and failed step
- expected output and actual output
- source period or target table affected
- screenshot or exported evidence where useful
- recovery action already attempted

## What Not To Send

- passwords
- access tokens
- private keys
- full personal data extracts
- unrelated logs with sensitive values

Sanitize evidence before handoff. Keep enough structure to diagnose the issue, but do not include credentials or unnecessary sensitive data.
