# Cookbook: Add A Transformation Job

Use this cookbook for modeled output from staging or integration data.

## Inputs To Decide First

Choose sources/filters, target layer/table/grain, business keys, write mode, quality checks, and prerequisites. Use `truncate_insert` for INT, `upsert` for cross-batch key replacement, `append` for additive facts, or `scd2` for history.

## Control Records To Create

1. Create an `Integration`, `Data Warehouse`, or `Consumption` job.
2. Create its transformation with the full `parameters` envelope.
3. Add dependencies for every required upstream job.
4. Configure `testDataIntegrity`, `testDuplicateBks`, and `testNullBks`; required failures block success.

## Transformation Parameters Checklist

- `sources` is name-keyed; each source specifies `db`, `table`, `business_keys`, and `filter.where_clause`.
- Staging reads use `stg_load_date` or an approved equivalent. Unrestricted scans need deliberate full-refresh approval; a delta slice cannot prove deletion.
- `target` specifies `db`, `table`, `business_keys`, and `write_mode`. SCD2 also needs its hash/date/key/current-flag contract.
- `transformation.steps` uses ordered `step_id`, `name`, `type`, and `config`. Read aliases before use, deduplicate before joins, and finish data-changing work with `write_target`.
- Optional `deployment_artifacts` and `runtime_options` stay outside steps; query bodies must not embed multi-statement DDL.

## Example Files

- [Current Package](../../examples/current/README.md): filtered, deduplicated INT write.
- [Historical Compact Example](../../examples/config/sandbox-v2/customer_orders_transformation_job.json).
- [Historical Sandbox](../configuration/sandbox-client-example.md): multi-source/dimension fixtures.

## Review Questions

Do count checks compare the same grain? Are nullable keys handled? Does a same-queue append retry preserve queue identity? Is a new queue intentionally a new append? Does tombstone processing receive complete source state?

See [Transformation Job Pattern](../patterns/transformation-jobs.md) for `_culina_write_id`, source `Batch_ID`, and extraction-versus-write behavior. Physical tuning is optional: validate partition columns and never combine `repartition` with `coalesce_to`.
