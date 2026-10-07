# Incident Walkthroughs

These illustrative scenarios use current authorities. Historical sandbox entity names remain useful learning labels, not current deployment defaults; real SQL job/queue/batch identifiers are UUIDs. Start each case with [Diagnostic Queries](diagnostic-queries.md), and preserve evidence before recovery.

## Walkthrough 1: Workflow Did Not Start

Symptom: `STG.Customer_Orders` did not run at the expected time.

1. Inspect `jobconfig.jobs.is_active`, `frequency_group`, and trigger evidence.
2. Distinguish no queued work from `jobconfig.job_queue.status = PENDING`.
3. Check batch identity and applied configuration, not merely a successful contract preview.
4. If queued, inspect `can_execute` and actual upstream queues across open batches.

Resolution: correct trigger/planning/configuration or readiness. Do not seed another queue while existing logical work is unresolved.

## Walkthrough 2: Job Stuck Waiting

Symptom: an integration job waits while one staging prerequisite is `FAILED`.

1. Inspect `jobconfig.vw_job_dependency_check`, then hierarchy/open-batch queues.
2. A same-batch display can omit another open batch's failed/retrying ancestor.
3. Diagnose the earliest upstream failure from history and terminal failure evidence.
4. Recover upstream first, then only affected skipped/pending descendants.

Proof: readiness becomes valid, official queues complete, and downstream outputs match the recovered source window. Do not reset completed ancestors or start a duplicate parent loop.

## Walkthrough 3: Source Shape Changed

Symptom: runtime `step_results` reports a missing field while flattening.

1. Read `jobconfig.job_runhistory.comments` and authoritative result. There is no SQL failure-table `failed_step`/`error_category` column.
2. Follow `jobconfig.source_detail.source_linked_service_config_id`; compare `source_select_query` flatten paths with a safely inspected source payload.
3. Confirm the query/selector, requested window, types, and field aliases.
4. Correct mapping or source behavior, then recover that ingestion scope.

Proof: correct staging registration and data, required downstream filters/tests, and final completion. Full staging intake appends retained load copies; recovery does not silently overwrite them.

## Walkthrough 4: Transformation Failed

Symptom: a join fails after earlier transformation steps completed.

1. Inspect ordered `step_results`; SQL history uses `zone`, `job_run_status`, `job_log_datetime`, and `comments`, not a dedicated step timing table.
2. Read active `jobconfig.transformation_controller.parameters`.
3. Check source aliases, join keys, type compatibility, staging filters, and target grain.
4. Correct data/configuration and replay only the affected downstream scope after reviewing write mode and prior writes.

Proof: no join fan-out, correct keys/counts, required tests logged, and official completion.

## Walkthrough 5: Output Looks Wrong

Symptom: totals differ after a completed run.

| Boundary | Evidence |
| --- | --- |
| Source/landing | Approved source window arrived. |
| Staging | Rows and selected load-date copies are correct. |
| INT | First incorrect aggregation/filter/grain identified. |
| EDW | Determine which contribution/history already persisted. |
| CONS | Check serving object, refresh/synchronization, and actual consumer access. |

Correct the first incorrect layer. Rebuild INT through its configured replacement pattern, then approve downstream reconciliation; new-queue fact replay is a new append, not same-queue retry replacement.

## Walkthrough 6: Append Committed, Validation Failed

Symptom: fact rows exist but required integrity/duplicate tests failed; queue is `ON_HOLD_RETRY` or terminal `FAILED`.

1. Capture control `batch_id`/`queue_id`, workload run, append result, and physical test details.
2. Distinguish source `Batch_ID` from control identity. Managed integrity checks isolate that queue's `_culina_write_id` contribution.
3. Correct source grain/filter/duplicates; do not disable required tests.
4. Retry/rerun the same unresolved logical queue through approved recovery.

Observed behavior: its managed contribution is atomically replaced while other queues remain intact. Repeated attempts do not multiply the same input, but duplicates within that input remain observable. Seeding a new queue appends anew; preexisting legacy duplicates require reconciliation.

Proof: latest attempt's required tests and target contribution match expected grain, logging/finalization succeed, and prior unrelated contributions remain intact.

## Walkthrough 7: Service Failure Or Ambiguous Token Write

Symptom: compute exits successfully but the authoritative service result says `FAILED`, or a token-target write times out.

1. Check active `Service` job, exactly one active `service_config` (`isactive = 1`), JSON-object options, installed handler, and scoped access.
2. Inspect service validation/resolution/execution steps and sanitized diagnostics.
3. Reconcile external side effects before retry. Azure token PUT timeout/watchdog termination can mean the write committed; reread the target version. GET timeout is safe to retry.
4. Repair the context/handler/access issue without bypassing concurrency protection.

Proof: intended side effect verified without unintended duplication, authoritative result accepted, and SQL state finalized. Do not include token values or service-config bodies in public evidence.

## Walkthrough 8: Failure Or Completion Notification Missing

Symptom: data execution evidence exists but recipients saw no notification.

1. For failure handoff, inspect terminal `FAILED` queue plus `is_notified_sent = 0`; retry-held failures are not eligible.
2. For completion, inspect `batch_time.is_batch_completed` and `batch_notification_log` for `BATCH_COMPLETION` / `SENT`. Terminal failed queues keep their batch open.
3. Inspect endpoint lookup, POST, and mark activity separately using the configured utility's protected evidence.
4. If POST was accepted but marking failed, reconcile downstream receipt before redispatch.
5. If marking succeeded, investigate downstream routing/channel delivery rather than resetting the data job.

Proof: verified handoff plus separately verified delivery where required. Completion/failure/health endpoints are separate; `SENT` is not a delivery receipt.

## Walkthrough 9: Dimension Exists, Reporting Publication Failed

Symptom: the EDW SCD2 write committed but required `current_reporting` failed.

1. Preserve dimension history; inspect publication error and serving capability.
2. Fabric uses a managed CONS Delta table; Databricks/Athena use views. Synapse/local BI publication requires an approved publisher adapter.
3. Repair access/capability, then recover unresolved execution; do not truncate EDW.
4. Verify endpoint visibility/synchronization and configured publication.

Unknown `-1` and inferred keys below `-1` are expected members. Hydration preserves inferred keys; do not rewrite fact references manually. A current-only object is not a valid historical-surrogate-key relationship.

## Walkthrough 10: Portable File Or Secret Binding Failed

Symptom: unchanged metadata fails in a different environment before source reading.

1. Inspect sanitized `storage_alias`/`storage_setting` diagnostics and selected runtime/backend.
2. For `storage://inbound/client-a`, verify `CULINA_STORAGE_ROOT_INBOUND` or Spark fallback `spark.culina.storage.root.inbound` and platform-compatible root.
3. Keep file selectors relative; correct invalid paths rather than bypassing safety checks.
4. For `secret://<name>`, verify the runtime's secret-root binding and identity permissions.
5. Resolve required environment tokens before contract application.

Proof: approved bindings resolve, read access succeeds, and the intended client workflow passes. ADF + Databricks local artifact tests are not live cloud qualification.
