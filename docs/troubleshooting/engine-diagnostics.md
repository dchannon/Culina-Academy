# Engine Diagnostics

Diagnose from official SQL state, authoritative runtime results, platform activity, and target evidence together. Start with [Diagnostic Queries](diagnostic-queries.md) and the [Operating Guide](../operations/operating-guide.md).

## First Check

Capture environment, platform/backend, workflow, UTC trigger time, UUID job/queue/batch identities, workload run, official status/retry timing, expected output, and actual output. Confirm the deployed contract/runtime version rather than assuming an Academy sandbox fixture describes the current environment.

## Common Symptoms

### Workflow Did Not Start

Check `jobconfig.jobs.is_active`, `frequency_group`, trigger acceptance, and the planned batch. No queue row is different from a `PENDING` row. Use the current deployment record if a job/configuration is missing; `VALIDATED` or `PREVIEWED` does not mean applied.

### Workflow Is Waiting

Inspect `jobconfig.vw_job_dependency_check.can_execute` and its dependency counters. The authority counts upstream ancestors across open batches. Compare hierarchy and actual queues, including other open batches; absent prerequisite work is not a passed dependency. Do not assume same-batch-only evaluation or manually release descendants first.

### Workflow Failed

Read retry timing and `jobconfig.job_runhistory` even when no failure-log row exists. Retryable failures are history events; terminal failures create `jobconfig.job_failure_log` evidence. Compare failed runtime steps, context, tests, result publication, and SQL finalization before concluding the platform activity is the failed business operation.

For stranded `IN_PROGRESS`, confirm live execution ended and reconcile committed outputs before any approved reset. There is no implied queue lease timeout or blanket recovery reset.

### Output Looks Wrong

Find the last correct layer and first incorrect layer. Check source period, effective watermark, `stg_load_date`/equivalent filter, target grain, write mode, and consumption synchronization. Full staging retains multiple load-date copies; reading all copies can inflate output.

For managed fact append, source `Batch_ID` is preserved and can differ from the control batch. A same-queue retry replaces that queue's `_culina_write_id` contribution atomically; a new queue appends again. Check validation/runtime contribution evidence, not a source-batch-only count. Existing duplicates require reconciliation.

## Diagnostic Rule

Separate these authorities:

| Concern | Evidence |
| --- | --- |
| Control plane | Jobs/configuration, queue, batch, dependency views, deployment/validation records. |
| Orchestration | Trigger, claim, context retrieval, payload/result transport, finalization, and notification utilities. |
| Data plane | Source/landing/delta/staging, transformation steps, required tests, target write, and required CONS publication. |
| External service | HTTP/export/file/token side effects and downstream notification/channel receipt. |

A successful compute/process exit is not an official `COMPLETED` queue. A write can commit before validation or publication fails. Notification handoff is not channel delivery.

## Common Issue Families

| Symptom | Confirm with current evidence | Response |
| --- | --- | --- |
| Source parse/flatten failure | `source_detail.source_select_query`, failing step, current source payload. | Correct source mapping/shape, then recover the affected window. |
| Source access failure | Sanitized error/status, effective linked-service type, identity/network permissions. | Correct access/binding; do not paste tokens or endpoint secrets. |
| Table not found | Actual platform catalog, staging registration, qualified source name, upstream completion. | Repair registration or approved create-only bootstrap; no catalog reset. |
| Duplicate/null business keys | Configured test flags, source/dedupe grain, recorded test details. | Correct data/rules; do not disable tests or repeatedly append through new queues. |
| Required test logging failed | Authoritative result and physical `unit_test_results` rows for the workload run. | Repair SQL logging; older recorded passes are not proof of this attempt. |
| Retry repeats | History messages, `current_retry_count`, maximum, due time. | Fix repeated non-transient cause; delay is seconds, not automatic exponential backoff. |
| Downstream `SKIPPED` | Earliest failed ancestor and open-batch dependency evidence. | Recover upstream then affected descendants, preserving completed work. |
| Service process succeeded but queue failed | Runtime `execution_status`/`run_history_status`, handler steps, authoritative result. | Resolve business failure, not process status alone. |
| Result missing or finalization failed | Artifact existence/run identity, platform failure, SQL finalization error. | Reconcile committed effects; use fallback evidence and approved scoped recovery. |
| Batch not closing | Queue states plus `batch_time.is_batch_completed`. | `FAILED` blocks closure; `SKIPPED` does not. Do not force closure. |
| Notification not received | POST activity, failure marking/completion log, downstream service. | Separate handoff and delivery; reconcile accepted POST before redispatch. |
| Dimension output exists but job failed | Required `current_reporting` publication and real BI surface. | Repair publisher/permissions/synchronization; preserve EDW history. |

## Source Detail Diagnostics

SQL fields are `source_linked_service_config_id`, `source_select_query`, `source_delta_column`, `delta_or_full`, `fallback_watermark`, and `staging_table_name`. Follow the relationship to `jobconfig.source_linked_service_config`; there is no current SQL `linked_service.configJson` authority.

Contract source details may expose `linkedServiceConfigId`, `sourceSelectQuery`, `deltaOrFull`, `fallbackWatermark`, and `stagingTableName`. Inspect the effective runtime context for path/query, parameters, delta selectors, and flatten columns. Do not infer the actual watermark from fallback alone.

For Excel, verify one configured sheet per source detail and the required reader dependency; a valid workbook does not imply the selected sheet exists. For API ingestion, token consumption is read-only: use separately configured service execution for approved issuance/rotation.

## Transformation Diagnostics

Inspect active `jobconfig.transformation_controller`:

- `parameters.sources`: aliases, catalogs/tables, filters, business keys.
- `parameters.target`: namespace, table, grain, write mode, SCD2/reporting settings.
- `parameters.transformation.steps`: ordered operations.
- `test_data_integrity`, `test_duplicate_bks`, `test_null_bks`, `initial_load`, `is_active`.

Match runtime `step_results` to configured steps; `job_runhistory.zone` is not a dedicated `step_name` column. Inspect logged source/target counts and selected source grain. Managed append checks isolate the control queue contribution; SCD2 integrity checks residual new/changed rows. Historical SCD2 duplicate tests include effective/expiry grain, while current-row uniqueness remains a separate correctness check.

Unknown `-1` is runtime-owned; eligible null/blank lookups use it. Non-null missing members receive inferred keys below `-1`; hydration preserves them. Missing attributes on an inferred member are not automatically corruption. Conflicting hydration, duplicate Unknown rows, or surrogate-key collisions require correction, not manual key reassignment.

## Service Diagnostics

Check `jobs.job_type = 'Service'`, active job, and exactly one active `service_config` row (`isactive`, not `is_active`). Runtime options must be a JSON object. Errors for no/multiple active configurations are context errors before handler execution.

Inspect `validate_service_payload`, `resolve_service_handler`, and `execute_service_handler` results plus service type, handler, mode, and sanitized details/output. Built-ins and installed approved plugins share the result contract. Missing plugins, invalid contracts, unavailable secrets/writers, or denied handler permissions need correction before another attempt.

External actions can be commit-ambiguous after timeout or result loss. Azure OAuth PUT timeout/watchdog exit requires a target-version reread before retry; GET timeout is safe to retry. Do not bypass target concurrency controls. Databricks has no implicit writable secret scope: confirm the explicitly selected approved writer.

## Portability Diagnostics

| Failure | Concrete check | Correction boundary |
| --- | --- | --- |
| Logical storage alias unresolved | `storage_alias`, `storage_setting`, `CULINA_STORAGE_ROOT_INBOUND` or `spark.culina.storage.root.inbound`. | Environment mapping takes precedence over Spark mapping; fix client bindings, not reusable contract paths. |
| Invalid logical selector/root | `Storage.BaseUri=storage://inbound/client-a`, relative selector, mapped platform root. | Correct path/root; do not bypass traversal, absolute-selector, or credential-bearing URI checks. |
| Logical secret unresolved | `secret://<name>` and platform secret-root setting. | Keep provider roots in environment configuration, not contract JSON. |
| Promotion token unresolved | Resolved contract and required environment values. | Materialize approved values before deployment; do not put real credentials in metadata. |
| Wrong backend/catalog | Fabric `runtime_backend=FABRIC|DATABRICKS`, deployed implementation, qualified source/target. | Correct backend/deployment and catalog permissions; unsupported backend values fail. |
| BI surface unavailable | Required publisher, platform serving engine, permissions, endpoint synchronization. | Spark view creation alone does not establish BI visibility. |

Storage aliases use a lowercase leading letter and at most 62 lowercase letters/digits/underscores. Keep source selectors relative. Legacy concrete storage paths remain compatible where supported, but copying them between platforms does not make them portable.

Secret roots are `CULINA_AZURE_KEY_VAULT_ROOT` (Synapse/Fabric), `CULINA_AWS_SECRETS_MANAGER_ROOT`, `CULINA_DATABRICKS_SECRET_ROOT`, or `CULINA_LOCAL_SECRET_ROOT`. A portable reference is not an environment promotion token or an authorization grant.

## Recovery Direction

Choose automatic retry, approved unresolved-queue rerun, downstream replay, missing-source backfill, or derived-target rebuild. Preserve completed rows, inspect committed effects, and avoid duplicate parent loops.

Use [Backfill And Recovery](../operations/backfill-and-recovery.md). The [Platform Qualification](../operations/operating-guide.md#platform-qualification) table distinguishes sandbox validation, artifact availability, and pending live qualification; ADF + Databricks is locally tested with live cloud qualification pending.
