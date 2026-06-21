# Configuration Field Reference

This reference explains the fields users most often need when reviewing or diagnosing Culina metadata.

## `job`

| Field | Required | Type | Meaning | Operating use |
| --- | --- | --- | --- | --- |
| `id` | Yes | integer/string | Stable job identifier. | Join to queue, dependencies, source details, and transformations. |
| `clientId` | Yes | integer/string | Client or workspace scope. | Confirms the job belongs to the expected environment. |
| `jobType` | Yes | string | Job category such as ingestion, INT, or EDW. | Identifies the expected layer and handler. |
| `entityName` | Yes | string | User-facing workflow or target name. | Primary name to search during support. |
| `frequencyGroup` | Usually | string | Scheduling or grouping hint. | Explains expected cadence. |
| `maxRetryCount` | Usually | number | Allowed retry attempts. | Interprets retry behavior. |
| `retryDelayBackoff` | Usually | number/string | Retry delay behavior. | Explains `ON_HOLD_RETRY` timing. |
| `isActive` | Yes | boolean | Whether the job participates in operation. | First check when expected work is missing. |

## `linked_service`

| Field | Required | Type | Meaning | Operating use |
| --- | --- | --- | --- | --- |
| `id` | Yes | integer/string | Connection profile identifier. | Join from `source_detail.linkedServiceConfigId`. |
| `clientId` | Yes | integer/string | Client or workspace scope. | Confirms the connection belongs to the expected environment. |
| `sourceName` | Yes | string | Source system or endpoint name. | Helps identify ownership and source family. |
| `sourceType` | Yes | string | Source class such as REST, file, or database. | Narrows likely failure type. |
| `configJson` | Yes | JSON string | Endpoint, method, auth mode, timeout, headers, and options. | Review for source access failures. |

## `source_detail`

| Field | Required | Type | Meaning | Operating use |
| --- | --- | --- | --- | --- |
| `id` | Yes | integer/string | Source detail identifier. | Trace exact source configuration. |
| `jobId` | Yes | integer/string | Ingestion job this record supports. | Join back to the job. |
| `sourceEntityName` | Yes | string | Source entity or file family. | Confirms the expected input. |
| `sourceSelectQuery` | Yes | JSON string | Query, REST path, parameters, delta mapping, flatten rules, output columns. | Main record for ingestion diagnosis. |
| `sourceDeltaColumn` | For delta | string | Field used for incremental selection. | Confirms incremental behavior. |
| `deltaOrFull` | Yes | string | Load style such as `FULL` or delta-style. | Determines backfill and rerun strategy. |
| `linkedServiceConfigId` | Yes | integer/string | Source connection profile id. | Join to `linked_service`. |
| `landingFileExtension` | Usually | string | Landing artifact format. | Confirms expected raw intake shape. |
| `deltaFileExtension` | Usually | string | Standardized artifact format. | Confirms expected normalized output shape. |
| `stagingTableName` | Usually | string | Staging table created by ingestion. | Confirms what transformations should read. |
| `fallbackWatermark` | For delta | string/date | Default start point for incremental loads. | Explains first-run or missing-watermark behavior. |

## `transformation`

| Field | Required | Type | Meaning | Operating use |
| --- | --- | --- | --- | --- |
| `id` | Yes | integer/string | Transformation record identifier. | Trace exact transformation configuration. |
| `jobId` | Yes | integer/string | Job this transformation supports. | Join back to the transformation job. |
| `transformationType` | Usually | string | Transformation family. | Helps infer expected handler behavior. |
| `transformationName` | Yes | string | Logical transformation name. | Searchable support label. |
| `parameters` | Yes | JSON string | Sources, target, keys, filters, write mode, and ordered steps. | Main record for transformation diagnosis. |
| `initialLoad` | Usually | boolean | Whether initial-load behavior applies. | Important during cutover and rebuilds. |
| `isActive` | Yes | boolean | Whether this transformation participates in operation. | First check when expected modeled work is missing. |

## `dependency`

| Field | Required | Type | Meaning | Operating use |
| --- | --- | --- | --- | --- |
| `id` | Yes | integer/string | Dependency identifier. | Trace exact dependency. |
| `jobId` | Yes | integer/string | Downstream job waiting on a prerequisite. | Shows which job is blocked. |
| `dependentJobId` | Yes | integer/string | Upstream prerequisite job. | Shows what must complete first. |

## Runtime Evidence

| Record | Key fields | Use first when |
| --- | --- | --- |
| `batch_time` | batch id, start/end time, status | A whole run window looks stalled or incomplete. |
| `job_queue` | queue id, batch id, job id, status, retry count, timestamps | Any workflow has unexpected status. |
| `job_runhistory` | queue id, step name, status, timestamps, output metadata | You need the last successful step. |
| `job_failure_log` | queue id, job id, failed step, error category, message | A workflow failed or is retrying. |
