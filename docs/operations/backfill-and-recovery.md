# Backfill And Recovery

Use this guide when data is missing, incorrect, delayed, or when a failed run must be recovered after the cause is corrected.

## Core Principles

1. Recover from the point of failure onward.
2. Fix the root cause before rerunning work.
3. Avoid resetting `COMPLETED` rows during normal recovery.
4. Use the smallest recovery scope that restores correctness.
5. Treat INT as the main rebuild boundary for transient modeled output.
6. Treat historized dimensions with extra care because hashes, effective dates, and tombstone behavior must remain consistent.

## Recovery Types

| Type | Meaning | Typical use |
| --- | --- | --- |
| Rerun | Re-execute unresolved queued work after a fix. | A failed queue row can run successfully with the same configured logic. |
| Replay | Reprocess downstream logic from existing upstream data. | Source data is already available, but transformation output must be rebuilt. |
| Backfill | Load historical or previously missing source data. | A source period, file range, or API window was missed. |
| Rebuild | Recreate a target layer from available upstream data. | INT or modeled output must be refreshed after logic or source correction. |

## Standard Recovery Workflow

1. Identify the failed job, queue row, batch, and affected target.
2. Confirm the first failing upstream point in the dependency chain.
3. Read `job_failure_log` and `job_runhistory` before changing queue state.
4. Determine whether the cause is source-side, config-side, transformation-side, validation-side, or dependency-side.
5. Correct the cause.
6. Choose rerun, replay, backfill, or rebuild.
7. Recover only the required scope.
8. Validate queue completion, target data, downstream impact, and user-visible output.
9. Record what changed and which evidence proved recovery.

## Queue Rerun Guidance

Rerun only after the same failure condition will not immediately recur.

Good candidates:

- `FAILED` rows after a source access issue is fixed.
- `ON_HOLD_RETRY` rows after a transient issue is confirmed.
- Stuck `IN_PROGRESS` rows after operational review confirms the work is no longer running.
- `SKIPPED` rows after the upstream failure has been resolved.

Poor candidates:

- `COMPLETED` rows with no data-correctness issue.
- Downstream skipped rows when the upstream failure is still active.
- Broad batch reruns when one queue row can be recovered.
- Reruns used to bypass validation failures.

## Layer-Specific Guidance

| Layer | Recovery behavior |
| --- | --- |
| Landing/archive | Confirm the source file or API result exists for the affected window. Preserve raw evidence where available. |
| Delta | Confirm the delta parameter or watermark covers the missing interval. New recovered data normally appends rather than overwrites existing delta output. |
| Staging | Confirm the table exists and represents the recovered source window correctly. If the catalog was reset, bootstrap the catalog before rerunning dependent transformations. |
| INT | Rebuild from staging when modeled transient output is wrong or incomplete. INT is usually the safest boundary for replay. |
| EDW facts | Respect append or upsert behavior. Validate duplicate handling and target grain. |
| EDW dimensions | Validate business keys, hash comparison, effective dating, current-row logic, and tombstone behavior. |
| Consumption | Confirm user-visible outputs now match the corrected upstream data. |

## Backfill Checklist

- Identify the source period or source entity that is missing.
- Confirm whether full-load or delta-load behavior applies.
- Confirm fallback watermark or delta parameter behavior.
- Confirm target staging table and file extension.
- Confirm dependencies that must rerun after source recovery.
- Confirm downstream INT, EDW, and consumption objects affected by the recovery.
- Validate row counts, business keys, duplicate behavior, and expected output.

## Recovery Evidence

Keep this evidence in the incident or support note:

- affected client or environment
- batch id and queue row id
- job id and `entityName`
- first failing upstream job
- status before recovery
- failure log message
- run history step that failed
- recovery type used
- source period or target table affected
- validation performed after recovery
- final status and remaining risk
