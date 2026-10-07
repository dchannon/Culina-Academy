# Operating Guide

Operate from SQL control-plane evidence, then reconcile the execution platform and target outputs. A successful compute activity, write, or notification handoff alone does not establish job success.

## Daily Operating Checklist

1. Confirm the expected trigger, active job, frequency group, and batch scope.
2. Review `jobconfig.batch_time` and `jobconfig.job_queue`; locate the earliest unresolved upstream job.
3. Compare retry timing, history events, authoritative runtime result, and platform run identity.
4. Confirm required validation passed and its physical result rows were logged.
5. Verify target data and required CONS publication through the actual consumer query surface.
6. Check failure/completion handoffs separately from execution; record anomalies and narrowly scoped recovery.

## What To Monitor

| Area | Current authority | Interpretation |
| --- | --- | --- |
| Batch lifecycle | `jobconfig.batch_time`: `batch_start_time`, `batch_end_time`, `is_batch_completed` | No batch status string. Closure excludes batches containing `PENDING`, `IN_PROGRESS`, `FAILED`, or `ON_HOLD_RETRY`; `SKIPPED` does not prevent closure. |
| Queue | `jobconfig.job_queue.status` | Official current state. `queue_id`, `batch_id`, and `job_id` are UUIDs. |
| Retry | `current_retry_count`, `retry_datetime`; `jobconfig.jobs.max_retry_count`, `retry_delay_backoff` | Count is retries scheduled, not total attempts. Delay is seconds, not an assumed exponential backoff. |
| History | `jobconfig.job_runhistory.zone`, `job_run_status`, `job_log_datetime`, `comments` | Event records, not dedicated step-start/end columns. Comments can contain diagnostics and ordered `step_results`. |
| Terminal failure | `jobconfig.job_failure_log.failure_message`, `failure_datetime` | Retry-eligible failures appear in history before a terminal failure-log row is created. |
| Validation | `jobconfig.unit_test_results`; `rpt.vw_pbi_unit_test_result` | Keep attempt evidence; `IsLatestPerTest` means latest recorded result, not proof that the latest attempted run logged successfully. |
| Dependencies | `jobconfig.vw_job_dependency_check`, `jobconfig.vw_job_dependency_hierarchy` | Readiness includes upstream rows across open batches, not only the displayed batch. |
| Notifications | `job_failure_log.is_notified_sent`; `jobconfig.batch_notification_log` | Successful handoff markers, not email/Teams receipt. |
| Contract application | `jobconfig.contract_deployment`, `jobconfig.contract_validation_result` | Validation/preview is distinct from application; inspect SQL status, not compute success. |

See [Diagnostic Queries](../troubleshooting/diagnostic-queries.md) for bounded SELECT examples.

## Status Interpretation

| Status | Meaning | Response |
| --- | --- | --- |
| `PENDING` | Queued, not necessarily executable. | Inspect `can_execute` and upstream rows across open batches. |
| `IN_PROGRESS` | Claimed for execution. | Reconcile platform activity, result, and finalization; state alone does not prove a worker remains alive. |
| `ON_HOLD_RETRY` | Failure with another retry scheduled. | Check `retry_datetime`; claiming promotes due rows to `PENDING`. |
| `FAILED` | Retry budget exhausted or no retry allowed. | Correct the cause before approved recovery; this state keeps the batch open. |
| `COMPLETED` | Official successful finalization. | Confirm validation, outputs, and publication; preserve the row during routine recovery. |
| `SKIPPED` | Upstream terminal failure prevented valid execution. | Repair upstream, then recover only affected skipped work. |

Failed finalization schedules retry while `current_retry_count < max_retry_count`, increments the count, and sets `retry_datetime`. With `max_retry_count = 0`, the first failure is terminal. History can therefore show `FAILED` while the queue is `ON_HOLD_RETRY`.

## Triage Flow

1. Identify environment, platform/backend, job, queue, batch, and workload run.
2. Inspect official state and retry timing before platform status.
3. Trace prerequisites to the earliest failure, including other open batches.
4. Read history, authoritative diagnostics, and configured validation results.
5. Locate the last correct layer and any side effect already committed.
6. Correct the cause and select the smallest safe recovery scope.
7. Verify finalization, validation, outputs, and downstream correctness; escalate ambiguous outcomes.

## Evidence Sources

Workflows retrieve ingestion, transformation, or service context from the control plane. Orchestration owns official queue/history/failure finalization, not the workload runtime.

Inspect the authoritative result, not an intermediate transformation artifact. Interface fields include `execution_status`, `run_history_status`, `detail_message`, `error_message`, `workload_run_id`, and `step_results`; finalization can persist diagnostics in history comments. Context retrieval, payload publication, compute startup, or result retrieval failures use orchestration fallback evidence. If SQL finalization fails, reconcile live execution and persisted output before recovering a stranded row.

`rpt.vw_pbi_job_run` is queue-grain evidence; `rpt.vw_pbi_job_run_event` is event-grain evidence. Open durations are provisional, not cumulative retry-attempt durations.

## Incident Types

### Ingestion Failure

Inspect `jobconfig.source_detail` and its `source_linked_service_config_id` relationship to `jobconfig.source_linked_service_config`. Verify source access, relative selector, `source_select_query`, delta column, effective watermark, extensions, and `staging_table_name`. SQL identifiers are snake_case; contract JSON may use camelCase.

Check landing, delta, staging registration, and source filters. Full ingestion appends staging copies and retains the latest seven load dates; it is not a direct staging overwrite. Delta staging appends recovered data. Confirm the intended window before downstream replay.

### Transformation Failure

Inspect active `jobconfig.transformation_controller.parameters`, source filters, business keys, write mode, and failed `step_results`. Staging reads should use `stg_load_date` or an approved equivalent; all retained full-load copies can inflate output.

Separate transformation, test, test-result logging, and required publication failures. A dimension write may already have committed when CONS publication fails; do not delete EDW history to repair a reporting surface.

### Dependency Blockage

Readiness considers ancestors across all open batches. Inspect view counters and underlying rows; a same-batch-only check can miss a blocker. Recover the earliest terminal failure before releasing skipped descendants. Do not start a duplicate parent loop while one is active.

### Validation Failure

Required tests block acceptance after a successful write. They run only after transformation completion; a prior transformation failure remains authoritative. Inspect `test_data_integrity`, `test_duplicate_bks`, `test_null_bks`, and physical logged results. Missing results after logging failure are not passes.

For managed fact `append`, retrying the same control `batch_id` plus `queue_id` atomically replaces that queue's `_culina_write_id` contribution, retaining other queues. A new queue means a new append. Source `Batch_ID` remains intact unless a configured system-field step assigns the current batch; preserve source lineage separately in that case. Duplicate input remains invalid; old duplicates require reconciliation.

### Service Failure

`jobconfig.usp_mf_service_get_execution_context` requires an active job and exactly one active `service_config` row (`isactive = 1`). Runtime options must be a JSON object. Inspect service type, handler identity, mode, failed step, and sanitized `details`/`output`; do not publish configuration bodies or tokens.

Built-ins cover HTTP requests, file operations, Spark SQL, data export, and OAuth issuance/refresh. Approved custom handlers must already be installed. A successful process exit can still carry a `FAILED` framework result; artifact-write failure requires platform/fallback evidence. Before retrying an external action or token rotation, establish whether it committed.

## Rerun Guidance

Fix first, rerun second. Preserve `COMPLETED` rows, confirm no live worker remains for stranded `IN_PROGRESS`, and use the approved recovery mechanism rather than bulk SQL resets. Managed append protection is not a general guarantee for service side effects, ingestion, historical backfill, or old untagged targets.

See [Backfill And Recovery](backfill-and-recovery.md) for retry, rerun, replay, backfill, and rebuild boundaries.

## Notifications

Failure dispatch selects unnotified failure-log rows whose queue remains `FAILED`; retry holds are not terminal notifications. Successful POST is followed by marking the selected rows `is_notified_sent = 1`. Resetting a failed queue before dispatch can make its old failure ineligible for the next payload.

Completion dispatch selects closed, unnotified batches, posts `MetadataFrameworkBatchCompleted`, then records `BATCH_COMPLETION` / `SENT` in `jobconfig.batch_notification_log`. A missing row means no persisted successful handoff, not proof that no POST occurred. Failure, completion, and health reports have separate endpoint configuration. Recipient routing/channel delivery belong downstream; domain owners are not alert-routing metadata.

Track data failure, handoff failure, and channel failure separately. If POST succeeded but marking failed, reconcile downstream receipt before redispatch; do not assume exactly-once delivery or manually mark evidence sent.

## Platform Qualification

| Path | Available evidence and qualification |
| --- | --- |
| Azure Synapse | Sandbox-validated orchestration, bootstrap, workflow, and utility artifacts; validate client bindings and required BI publisher separately. |
| Native Fabric | Aligned pipeline/notebook artifacts with Delta and external Azure SQL; availability is not client end-to-end qualification. |
| Fabric + Databricks | Hybrid contracts and Unity Catalog path available; validate deployed permissions, artifacts, SQL logging, and BI access. |
| ADF + Databricks | Local deterministic artifact/interface tests exist; live cloud sandbox qualification remains pending. |
| AWS Glue | Engine/workflow/utility wrappers available with RDS SQL Server and Iceberg; resource deployment and live client journeys require separate validation. |
| Local runtime | Local Delta/file/secret interfaces exist; verify installed orchestration and reporting adapter rather than assuming cloud equivalence. |

Fabric `runtime_backend` accepts `FABRIC` or `DATABRICKS`; unsupported values fail before execution. Confirm the selected implementation is deployed. ADF SQL owns retries/finalization; do not add independent activity retries to Databricks workload execution.

## Sandbox-Specific Checks

Academy sandbox packages are historical learning fixtures, not current deployment defaults or evidence of every platform's support. Use the installed SQL schema and resolved client contract for operations, not old numeric lesson identifiers.

Confirm approved catalogs (`stg`, `int`, `edw`, `con`, and the runtime-owned registry namespace), staging registration, and valid JSON artifacts. Use create-only bootstrap where supported; do not run catalog resets as routine recovery.

## Evidence To Keep

- Platform/backend, environment, workflow, UTC time, and trigger context.
- UUID job/queue/batch identities and workload run identity.
- Queue/retry snapshot, history, authoritative result, and exact sanitized error.
- Validation details and any missing logging/finalization evidence.
- Source window/filter, write mode, committed side effects, and consumer impact.
- Approved recovery scope, action taken, output proof, and separate notification outcome.
