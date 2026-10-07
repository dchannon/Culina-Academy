# Cookbook: Add A REST Ingestion Job

Use this cookbook for REST-style sources, including source-owned incremental selection.

## Inputs To Decide First

Choose host, endpoint/resource, owner, cadence, reliable change column, output columns, staging table, and consumers. Use non-secret `${ENV.*}` deployment tokens and `secret://<logical-name>` credentials.

## Control Records To Create

1. Reuse/create a linked service with `sourceType`, `Endpoint.BaseUrl`, `Auth`, and shared `Options`.
2. Create an `Ingestion` job and source detail referencing it and the linked service.
3. Select `FULL` or `DELTA`; declare `sourceDeltaColumn` and `fallbackWatermark` for DELTA.
4. Define source-owned selection/flattening and downstream dependencies.
5. Resolve promotion tokens, validate, and prove the configured platform path before activation.

## Source Detail Checklist

`sourceSelectQuery` accepts an object or JSON-encoded object string. Define REST `path`, connector `resource`/`mode`/`query` as appropriate, `params`, optional response `root`, and `flatten.columns` with `expr`, tabular `alias`, and optional `dtype`. Current deployment validation requires non-file structured selectors to include flatten columns, even when a minimal connector fragment omits them.

For API DELTA use `sourceSelectQuery.delta.ParamName`; `ValueTemplate` can produce a range such as `{{watermark}}...`. Shared `Options.Delta` and legacy parameter inference are compatibility behavior only.

NetSuite supports record GET and SuiteQL POST with `delta.QueryPlaceholder` embedded in valid SuiteQL. Partition queries that can exceed its 100,000-row REST boundary. Procore uses `resource`, declared `path_params`, and endpoint-specific filters; do not assume every endpoint uses the same update filter.

Set `stagingTableName` to the table name only; the default database is `stg`. Common landing/normalized extensions are `.parquet`. Legacy source location/schema/selected-field overrides are not the current authoring pattern.

## Example Files

- [Current Package](../../examples/current/README.md): REST DELTA, portable file FULL, INT output, and service dependencies.
- [Historical Compact Example](../../examples/config/sandbox-v2/customer_orders_ingestion_job.json).
- [Historical Sandbox](../configuration/sandbox-client-example.md): unchanged relationship fixtures.

## Review Questions

Does the endpoint honor watermark/paging? Are keys retained through flattening? Is the fallback safe? Are retries bounded? Is FULL safer for an unreliable change field?

Ingestion consumes current tokens, without interactive OAuth or credential rotation. Approved OAuth service jobs may manage target secrets separately. See [Configuration Field Reference](../reference/config-field-reference.md) and [Config Validation](../reference/config-validation.md).
