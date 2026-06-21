# Incident Walkthroughs

These examples show how to move from symptom to evidence without guessing.

## Walkthrough 1: Workflow Did Not Start

Symptom: `STG.Customer_Orders` did not run at the expected time.

Start with `job_queue`:

| queue_id | batch_id | job_id | status | retry_count | updated_at |
| --- | --- | --- | --- | ---: | --- |
| 91001 | 20260621-01 | 201 | `PENDING` | 0 | 2026-06-21T08:10:00Z |

Check:

1. Is the job active in `job`?
2. Was the trigger accepted for the expected environment?
3. Does the batch include the expected job?
4. Is the job waiting on an upstream dependency?

Likely resolution: correct schedule, trigger context, or dependency readiness before rerunning.

## Walkthrough 2: Job Stuck Waiting

Symptom: `INT.Blog_Post_Engagement` is still `PENDING`.

Dependency view:

| downstream_job | upstream_job | upstream_status |
| --- | --- | --- |
| `INT.Blog_Post_Engagement` | `STG.JsonPlaceholder_Posts` | `COMPLETED` |
| `INT.Blog_Post_Engagement` | `STG.JsonPlaceholder_Comments` | `FAILED` |
| `INT.Blog_Post_Engagement` | `STG.JsonPlaceholder_Users` | `COMPLETED` |

Response:

1. Diagnose `STG.JsonPlaceholder_Comments`.
2. Do not reset the downstream integration job first.
3. Recover the upstream failure.
4. Release or rerun downstream work only after prerequisites are complete.

## Walkthrough 3: Source Shape Changed

Failure log:

| queue_id | job_id | failed_step | error_category | message |
| --- | --- | --- | --- | --- |
| 91042 | 202 | `flatten_payload` | `SCHEMA_MISMATCH` | `Column properties.status not found` |

Check:

1. Open the matching `source_detail`.
2. Inspect `sourceSelectQuery.flatten.columns`.
3. Compare the configured field path to the current source payload.
4. Update source mapping or correct source behavior.
5. Rerun only the affected ingestion scope.

## Walkthrough 4: Transformation Failed

Run history:

| queue_id | step_name | status | started_at | ended_at |
| --- | --- | --- | --- | --- |
| 91110 | `read_source` | `COMPLETED` | 08:15 | 08:16 |
| 91110 | `deduplicate` | `COMPLETED` | 08:16 | 08:17 |
| 91110 | `join` | `FAILED` | 08:17 | 08:17 |

Check:

1. Open the `transformation.parameters`.
2. Confirm the source aliases and join keys.
3. Check upstream staging tables for missing reference rows.
4. Fix the configuration or source data assumption.
5. Replay downstream logic from the last correct upstream layer.

## Walkthrough 5: Output Looks Wrong

Symptom: Reported totals do not match expected results after a successful run.

Use data-layer boundary analysis:

| Layer | Result |
| --- | --- |
| Landing | Source arrived. |
| Delta | Source parsed correctly. |
| Staging | Expected rows present. |
| Integration | Aggregation total differs. |
| EDW | Diff carried forward. |

Response:

1. Start with the first incorrect layer: Integration.
2. Review transformation filters, business keys, aggregation steps, and write mode.
3. Validate the target grain.
4. Replay or rebuild only the affected scope.
