# Operating Guide

This guide describes how users should operate and diagnose Culina-managed workflows.

## Daily Operating Checklist

1. Confirm expected workflows are scheduled or triggered.
2. Confirm expected source inputs are available.
3. Review run status for active or recently completed workflows.
4. Check failed, waiting, or skipped work before checking downstream outputs.
5. Confirm consumption outputs are available for users.
6. Record any unexpected behavior with run evidence.

## What To Monitor

| Area | What to check | Why it matters |
| --- | --- | --- |
| Batch state | Active, closing, completed, or stalled batches. | Shows whether the run as a whole is still moving. |
| Queue state | `PENDING`, `IN_PROGRESS`, `ON_HOLD_RETRY`, `FAILED`, `COMPLETED`, `SKIPPED`. | The queue is the primary operational control signal. |
| Retry state | Attempt count, retry delay, retry hold status. | Distinguishes transient failure handling from terminal failure. |
| Failure logs | Failed step, error category, exact message, timestamp. | Gives the first concrete failure evidence. |
| Run history | Step-level execution timestamps and outputs. | Shows how far the job reached before the symptom appeared. |
| Dependencies | Upstream and downstream job relationships. | Prevents treating downstream skipped work as independent failure. |
| Output availability | Target table, file, or consumption artifact. | Confirms whether a technically completed run produced usable output. |

## Status Interpretation

| Status | Meaning | Response |
| --- | --- | --- |
| `PENDING` | Work is queued but has not started. It may be waiting on dependencies. | Check upstream status and readiness before declaring it stuck. |
| `IN_PROGRESS` | Work has been dispatched and is active. | Check run history, elapsed time, and execution evidence. |
| `ON_HOLD_RETRY` | Work failed but still has retry attempts available. | Determine whether the cause is transient or needs correction. |
| `FAILED` | Work reached terminal failure for the current run. | Diagnose the first failing upstream point and fix the cause before rerun. |
| `COMPLETED` | Work finished successfully. | Confirm outputs and avoid resetting it during normal rerun handling. |
| `SKIPPED` | Work did not run because a prerequisite was not satisfied. | Start with the upstream job that failed or did not complete. |

## Triage Flow

1. Identify the workflow and run.
2. Identify current status.
3. Identify the orchestration layer involved.
4. Identify the data layer involved.
5. Check upstream dependencies.
6. Check source availability.
7. Capture visible error messages.
8. Determine whether output is missing, delayed, or incorrect.
9. Prepare support handoff if the issue is unresolved.

## Evidence Sources

Start with the runtime tables and views most likely to explain the symptom:

- `job_queue` for current status and retry state.
- `batch_time` for batch lifecycle.
- `job_runhistory` for step-level execution evidence.
- `job_failure_log` for error context.
- Dependency and impact views for upstream and downstream effects.
- Source-detail configuration for ingestion path, parameters, flattening, and staging target.
- Transformation configuration for source reads, filters, business keys, joins, write mode, and validation flags.

## Incident Types

### Ingestion Failure

Common causes include missing source input, source structure changes, source access failure, request parameter mismatch, parse failure, staging table issue, or schema drift.

Response:

1. Confirm the source is available and accessible.
2. Review `linked_service.configJson` and `source_detail.sourceSelectQuery`.
3. Check landing, delta, and staging evidence.
4. Fix the source or configuration issue.
5. Rerun only the affected unresolved scope.

### Transformation Failure

Common causes include source table missing, unexpected new source values, duplicate business keys, null business keys, join misses, invalid write mode, or validation failure.

Response:

1. Review transformation `parameters`.
2. Confirm every source table exists in the expected data layer.
3. Confirm filters and business keys match current data.
4. Review the step that failed in run history.
5. Fix the configuration, source data, or transformation assumption before rerun.

### Dependency Blockage

A downstream job may remain `PENDING` or become `SKIPPED` because upstream work failed.

Response:

1. Identify the earliest failed upstream job.
2. Diagnose that upstream job first.
3. Avoid resetting downstream rows before upstream recovery.
4. Rerun or release downstream work only after prerequisites are complete.

### Validation Failure

A job can execute technically and still fail operationally if required validation does not pass.

Response:

1. Treat required validation failure as a real failed outcome.
2. Determine whether the cause is source data, transformation logic, or target expectation.
3. Correct the cause before rerun.
4. Capture validation evidence in the support note.

## Rerun Guidance

Reruns should be controlled. Before requesting or performing a rerun, confirm:

- the original failure cause is understood
- source input is available
- upstream dependencies are complete
- downstream impact is understood
- the run identifier and target scope are clear

Avoid broad reruns when a targeted rerun or support review is more appropriate.

See [Backfill And Recovery](backfill-and-recovery.md) for rerun, replay, backfill, and rebuild guidance.

## Sandbox-Specific Checks

For the sandbox examples, also confirm:

- Spark catalog databases such as `stg`, `int`, `edw`, and `con` exist before transformation jobs run.
- Ingestion registered expected staging tables before transformations read them.
- Runtime payload and result artifacts contain valid JSON objects.
- Blob reads that use managed identity include the storage service version header expected by the environment.

## Evidence To Keep

- workflow name
- run identifier
- environment or workspace
- trigger time
- status history
- failing layer
- error message
- expected output
- actual output
- screenshots where useful
- first failing upstream job
- recovery action taken, if any
