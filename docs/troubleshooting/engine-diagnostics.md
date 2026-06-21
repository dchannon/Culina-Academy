# Engine Diagnostics

Use this page when a Culina engine workflow does not behave as expected.

## First Check

Confirm:

- expected environment or workspace
- workflow name
- run identifier
- trigger time
- current status
- current orchestration layer, if visible
- current data layer, if visible
- expected output

## Common Symptoms

### Workflow Did Not Start

Collect:

- workflow name
- expected trigger time
- environment or workspace
- schedule or manual trigger context
- visible status
- recent configuration change, if known

Likely areas to review: trigger intake, run planning, workflow catalog.

Check:

- the job is active
- the expected schedule or manual trigger ran
- the job belongs to the expected client or environment
- the batch includes the expected work

### Workflow Is Waiting

Collect:

- waiting workflow
- upstream dependency name, if visible
- upstream status
- run context or input period
- how long it has been waiting

Likely areas to review: dependency resolution, upstream workflow status, source availability.

Check:

- upstream jobs required by dependency records
- whether any upstream row is `FAILED`, `ON_HOLD_RETRY`, `IN_PROGRESS`, or `SKIPPED`
- whether the waiting job has a valid batch context
- whether dependency views show an impact chain

### Workflow Failed

Collect:

- run identifier
- failure timestamp
- failing orchestration layer or data layer
- full visible error message
- affected source, target, or output
- whether the failure repeats

Likely areas to review: dispatch, execution monitoring, current data layer, validation expectations.

Check:

- `job_failure_log` for the exact error
- `job_runhistory` for the last successful step
- source-detail or transformation configuration linked to the job
- whether retries remain
- whether downstream jobs were skipped because of this failure

### Output Looks Wrong

Collect:

- expected output
- actual output
- source period or source file context
- last layer that appears correct
- first layer that appears incorrect
- example affected record or aggregate, if appropriate

Likely areas to review: staging, integration, EDW/core warehouse, consumption.

Check:

- the last data layer that looks correct
- the first data layer that looks wrong
- source period, watermark, or delta parameter
- business keys and duplicate behavior
- target write mode
- downstream consumption refresh timing

## Diagnostic Rule

Separate the problem into:

- control plane issue: configuration, dependencies, run state, validation expectation
- orchestration issue: trigger, planning, readiness, dispatch, monitoring, finalization
- data layer issue: source, landing, delta, staging, integration, EDW/core warehouse, consumption

This separation makes support handoff faster and avoids guessing.

## Common Issue Families

| Symptom | Likely cause | How to confirm | Response |
| --- | --- | --- | --- |
| Ingestion JSON parse failure | Source response shape changed or source detail flattening no longer matches payload. | Review the failing source detail and payload artifact. | Update source detail or correct source behavior, then rerun affected ingestion. |
| Source access failure | Endpoint unavailable, auth mode wrong, permission missing, or request option rejected. | Review linked service config, status code, and failure log. | Correct source access or endpoint configuration. |
| Transformation table not found | Staging table was not registered, catalog was reset, or upstream ingestion did not finish. | Confirm source table exists in the expected Spark catalog/database. | Bootstrap catalog or rerun upstream ingestion before transformation. |
| Duplicate business keys | Source delivered duplicate rows or deduplication order is incomplete. | Check transformation business keys and deduplicate step. | Correct dedupe rules or source data before rerun. |
| Null business keys | Source row missing required identifying fields. | Review validation failure and source flattening output. | Correct source mapping or source data handling. |
| Job stuck in `PENDING` | Upstream dependency incomplete or planning context incomplete. | Review dependency views and upstream queue rows. | Recover upstream work first. |
| Job stuck in `IN_PROGRESS` | Execution still active, worker lost, or status did not finalize. | Compare run history, execution platform evidence, and elapsed time. | Reset only after confirming the work is no longer running. |
| `ON_HOLD_RETRY` repeats | The issue is not transient or retry window is too short. | Compare repeated failure messages across attempts. | Fix root cause before waiting for more retries. |
| Downstream rows `SKIPPED` | Upstream dependency failure prevented valid execution. | Trace dependency chain to earliest failed job. | Recover upstream first, then rerun downstream scope if needed. |
| Missing output after successful run | Output write, consumption refresh, or target expectation mismatch. | Check target table/file, finalization evidence, and consumption refresh. | Diagnose the first layer where output differs from expectation. |

## Source Detail Diagnostics

When ingestion fails, inspect these fields:

- `linkedServiceConfigId`: confirms which linked service was used.
- `sourceSelectQuery.path`: confirms the source API route or query.
- `sourceSelectQuery.params`: confirms request parameters.
- `sourceSelectQuery.delta`: confirms delta parameter behavior.
- `sourceSelectQuery.flatten.columns`: confirms output column expressions, aliases, and data types.
- `deltaOrFull`: confirms whether full or incremental intake is expected.
- `stagingTableName`: confirms the table downstream transformations should read.
- `fallbackWatermark`: confirms default delta starting point.

## Transformation Diagnostics

When transformation fails, inspect:

- `parameters.sources`: source aliases, input databases, input tables, business keys, and filters.
- `parameters.target`: output database, output table, business keys, and write mode.
- `parameters.transformation.steps`: ordered controller steps.
- validation flags such as duplicate-key and null-key checks.
- `initialLoad` and `isActive`.

Map the failed run-history step back to a configured step name such as `read_source`, `deduplicate`, `aggregate`, `join`, `select`, `add_system_fields`, `compute_hash`, or `write_target`.

## Recovery Direction

Do not start with a broad rerun. Choose the narrowest action that matches the failure:

- rerun unresolved queue work after the cause is fixed
- replay downstream logic from available upstream data
- backfill missing source periods
- rebuild transient modeled output from staging

Use [Backfill And Recovery](../operations/backfill-and-recovery.md) for the full checklist.
