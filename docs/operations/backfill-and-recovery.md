# Backfill And Recovery

Use this guide after finding the earliest failure. Recovery is an approved operational action, not a reason to bulk-reset queues, delete history, or bypass required tests.

## Core Principles

1. Fix the root cause before retry or rerun.
2. Preserve evidence and identify writes/external actions already committed.
3. Preserve `COMPLETED` rows during routine queue recovery.
4. Recover the smallest correct scope, including affected skipped descendants.
5. Use INT's configured replacement boundary; preserve durable EDW history.
6. Reconcile workers, open-batch dependencies, and the active parent loop before changing state.

## Recovery Types

| Type | Meaning | Identity and scope |
| --- | --- | --- |
| Retry | Automatic re-attempt while SQL retry budget remains. | Same queue/batch; wait for `retry_datetime`. |
| Rerun | Approved re-execution of unresolved queued work after correction. | Preserve original queue/batch when repairing that logical run; inspect prior side effects. |
| Replay | Reprocess downstream logic from correct upstream data. | New queue work is not automatically duplicate-safe; confirm write mode/window. |
| Backfill | Restore missing historical source coverage. | Explicit source period, selector, watermark, and downstream scope; new queue means new append. |
| Rebuild | Recreate a derived target from upstream data. | Prefer configured INT replacement; historical EDW replacement needs reconciliation and approval. |

## Standard Recovery Workflow

1. Capture job/queue/batch/workload identities, UTC timestamps, state, and target.
2. Read [Diagnostic Queries](../troubleshooting/diagnostic-queries.md), including history and validation; terminal logs alone miss retry-held errors.
3. Find blockers across open batches and the last correct data layer.
4. Reconcile live execution and authoritative results if finalization was lost.
5. Correct source, metadata, access, validation, service, or publication cause.
6. Approve the minimum window and account for committed writes/actions.
7. Release only eligible unresolved scope through the assigned recovery mechanism; reuse an active parent loop.
8. Verify finalization, logged tests, target grain/history, publication, and downstream outputs.
9. Record recovery proof and notification outcome separately.

## Queue Rerun Guidance

| State | Operating decision |
| --- | --- |
| `ON_HOLD_RETRY` | Allow due-time promotion and claiming after correction; do not seed a new queue to accelerate retry. |
| `FAILED` | Correct cause, preserve evidence, approve scoped rerun, and review retry budget/timing through the assigned mechanism. |
| `IN_PROGRESS` | Reconcile live worker, result publication, and finalization first. Do not assume automatic lease-expiry recovery. |
| `SKIPPED` | Recover upstream first, then affected descendants when prerequisites are valid. |
| `COMPLETED` | Not a routine reset candidate. Incorrect completed data requires separate replay/reconciliation. |

Readiness may include another open batch. `FAILED` keeps a batch open even though job reporting calls it terminal. Do not force closure or clear failures to emit completion notifications.

## Layer-Specific Guidance

| Layer | Recovery behavior |
| --- | --- |
| Landing/archive | Preserve raw input and establish exact source window; reuse only evidence covering approved scope. |
| Delta | Review delta column, effective watermark, fallback, and selector. Recovery is not inherently an overwrite. |
| Staging | Full intake appends then retains seven load dates; delta intake appends. Repeated source copies require downstream filtering. |
| INT | Rebuild using configured replacement and correctly filtered staging; do not assume every client target is `truncate_insert`. |
| EDW facts | Distinguish same-queue managed append from new queues, upsert, and historical untagged targets. |
| EDW dimensions | Preserve keys, dates, hashes, current flags, tombstones, and framework-owned Unknown/inferred members. |
| Consumption | Repair required CONS publication and verify actual BI visibility; a Spark object alone may not be available there. |

### Retry-Safe Fact Append

A managed `append` retry using the same control `batch_id` and `queue_id` atomically replaces that queue's `_culina_write_id` contribution, preserving other queues. This includes a committed append followed by validation failure. No metadata change is required; malformed duplicate input still fails required tests.

A new queue, even for the same source window or source `Batch_ID`, is a new append. Source `Batch_ID` is preserved by append and can differ from the control batch; do not use it alone to identify a queue contribution. If `add_system_fields` assigns the current batch, retain original source lineage separately.

Confirm installed managed-append support and validation diagnostics before recovery. Existing untagged data or old duplicates require explicit reconciliation; retries do not remove them. Business-key replacement across independent batches belongs to an approved `upsert` design, not an unreviewed incident-time write-mode change.

### Dimension And Reporting Recovery

The SCD2 writer maintains Unknown at key `-1`; eligible null/blank fact lookups use it. Non-null missing lookups use inferred keys below `-1`. Hydration preserves that key when the real dimension arrives; later changes follow normal history rules. Do not manually allocate keys, replace Unknown, or rewrite facts to resolve late arrivals.

Check lookup eligibility, configured key/date/hash fields, current uniqueness, and member status on failure. Duplicate physical Unknown rows or conflicting/ambiguous hydration need correction, not suppression. Use complete dimension source state where tombstone comparison requires it; partial backfill must not masquerade as full state.

Required `current_reporting` failure fails the transformation after its dimension write may have succeeded. Repair access/serving capability and rerun unresolved work without truncating EDW. Fabric publishes a managed CONS Delta table; Databricks/Athena publish views. Synapse/local BI publication needs an approved publisher adapter and fails when absent. Verify endpoint synchronization/access; do not join current-only objects to historical fact keys.

## Backfill Checklist

- Record missing periods/entities and actual historical source availability.
- Prefer bounded full-ingestion recovery when it covers missing history; current snapshots cannot recreate unavailable past records.
- Confirm effective watermark/fallback; do not move global watermarks backwards without approved scope.
- Check relative selector, selected Excel sheet, extensions, catalog, and staging target.
- Account for append/retention and `stg_load_date` or equivalent source filters.
- Approve downstream replay, historical effects, and tombstone impact before loading.
- Reconcile new-queue fact contributions and preexisting duplicates.
- Validate comparable-grain counts, keys, history, and consumer output.

Selective-period metadata changes are not a universal recovery tool. Retain original configuration and restore the normal schedule/window after approved backfill. Approval thresholds and communication timing are client-specific.

## Service And Notification Recovery

For HTTP actions, exports, file operations, and token issuance/rotation, establish whether the side effect committed before retry. Lost response/result artifacts do not prove nothing happened; use the handler's approved reconciliation procedure.

Azure token-target PUT timeout/watchdog termination is commit-ambiguous: re-read the target version before retry. GET timeout does not imply a write and is safe to retry. Do not bypass concurrency protection or delete locks manually. Databricks writes need an explicitly configured approved writer; readable secret scopes are not implicitly writable.

Reconcile notification POST receipt and SQL marking separately. Closed batch without `BATCH_COMPLETION` / `SENT`, or terminal failure with `is_notified_sent = 0`, means no persisted successful handoff. A previous accepted POST can still be delivered again on redispatch. Do not mark notified without verified handoff or equate `SENT` with channel delivery.

## Recovery Evidence

- Environment/backend, operator, approval, and recovery scope.
- UUID identities, entity name, and original/recovery workload runs.
- Previous state/retry timing, earliest blocker, and exact sanitized error.
- Authoritative result, failed step, test details, and committed actions.
- Recovery type, source window/filter, write mode, and preserved/new queue identity.
- Target grain/history/member checks, CONS visibility, downstream proof, and final state.
- Separate notification evidence and remaining risks.

Academy sandbox packages are historical learning fixtures, not proof of current client recovery behavior or universal live platform qualification.
