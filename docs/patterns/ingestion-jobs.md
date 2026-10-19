# Ingestion Job Pattern

An ingestion job captures, retains, standardizes, and stages source data before transformation.

## Purpose

Use the same metadata boundary for APIs, databases, Spark-native files, and single-sheet Excel sources. Connector availability is not platform qualification.

## Required Decisions

Choose ownership, cadence, connector, format, storage, staging table, FULL/DELTA extraction, validation, and downstream prerequisites.

## Standard Flow

```text
Source -> Landing -> Archive -> Delta -> Staging
```

The Delta layer standardizes the extract; DELTA extraction means incremental source selection. These are different concepts.

## Pattern

1. Reuse a linked service for connection, authentication, timeout, paging, retry, and read defaults.
2. Create an `Ingestion` job and source detail with entity-specific selection and flattening.
3. Configure landing/archive locations through the environment, not legacy source-location fields.
4. Set extraction mode, watermark column/fallback, and source-owned delta rules.
5. Validate schema, keys, counts, permissions, and dependencies before activation.

## Control Records

| Record | Purpose |
| --- | --- |
| `job` | Work identity, job type, frequency, retries, activation. |
| `linked_service` | `sourceType` and `configJson`: API `Endpoint`/`Auth`/`Options`, database access, or file `Storage.BaseUri`. |
| `source_detail` | `sourceSelectQuery`, watermark, FULL/DELTA, file extensions, and staging table. |
| `dependency` | Downstream `jobId` waits for upstream `dependentJobId`. |

## Sandbox Example

The [historical sandbox](../configuration/sandbox-client-example.md) remains unchanged. Use [current examples](../../examples/current/README.md) for today's contract shape; [customer_orders_ingestion_job.json](../../examples/config/sandbox-v2/customer_orders_ingestion_job.json) is a teaching shape only.

## Common Load Strategies

| Setting | Source selection | Staging behavior |
| --- | --- | --- |
| `deltaOrFull: "FULL"` | Complete selected state; safest when delta is unreliable. | Append, then retain latest seven full-load copies. |
| `deltaOrFull: "DELTA"` | Changes after staging maximum watermark; use `fallbackWatermark` for missing/empty state. | Append standardized rows. |

`append`, `upsert`, `truncate_insert`, and `scd2` are transformation write modes, not extraction modes. Deduplicate staging before Integration; INT is rebuildable, not historical storage. Dimensions generally need FULL-state input for tombstones.

API rules belong in `sourceSelectQuery.delta`: `ParamName`, optional `ValueTemplate` for range syntax, HubSpot search fields, or NetSuite SuiteQL `QueryPlaceholder`. `Options.Delta` and inferred legacy parameter tokens are compatibility fallbacks.

Database DELTA wraps plain SQL with `sourceDeltaColumn > watermark`. File DELTA filters dataframe rows; it does not select only newly arrived physical files. Bound selectors or use partitioned arrival paths to control scan cost.

## File Sources

Use `Storage.BaseUri: "storage://inbound/example-client"` and a relative selector `path`. `sourceType: "file"` requires `sourceSelectQuery.format`. Spark readers cover CSV, JSON/JSONL/NDJSON, Parquet, ORC, Avro, and text; source `options` override `Options.Read`.

Excel requires one `.xlsx` or `.xlsm` file and one scalar `sheet_name` per job/source-detail pair; no globs, sheet lists, or legacy `.xls`. Excel parsing is driver-bound; prefer Spark-native formats for large inputs.

## Diagnostics

Check availability/permissions, landing capture, archive retention, parsing/flatten aliases, and staging schema/keys. Missing storage mappings, unresolved credentials, unreliable watermarks, and failed required validation must be resolved before releasing downstream work.

See [Configuration Field Reference](../reference/config-field-reference.md) for connector names, environment roots, and platform qualification.
