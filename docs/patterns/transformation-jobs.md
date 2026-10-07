# Transformation Job Pattern

A transformation job turns staged or integrated data into modeled outputs.

## Purpose

Use ordered metadata steps for filtering, deduplication, joins, aggregation, enrichment, and writes. The complete `parameters` contract contains named `sources`, `target`, and `transformation.steps`, not a standalone step list.

## Required Decisions

Declare source filters, target grain, business keys, joins, write mode, quality tests, and prerequisites.

## Standard Flow

```text
Staging -> Integration -> EDW / Core Warehouse -> Consumption
```

## Pattern

1. Define named sources with `db`, `table`, `business_keys`, and `filter.where_clause`.
2. Filter staging reads by `stg_load_date` or an approved equivalent; use deliberate full-state selection when tombstones require it.
3. Read sources, then deduplicate before joins/aggregation; reference established dataframe aliases.
4. Project the target grain, add configured operational fields, and compute business hashes where required.
5. Write the target, then pass all required quality tests.

Each step uses `step_id`, `name`, `type`, and `config`. Common types include `read_source`, `deduplicate`, `filter`, `aggregate`, `select`, `join`, `union`, `explode_delimited_values`, `add_system_fields`, `compute_hash`, and `write_target`.

## Control Records

| Record | Purpose |
| --- | --- |
| `job` | `Integration`, `Data Warehouse`, or `Consumption` identity and operational policy. |
| `transformation` | Full `parameters` and `testDataIntegrity`, `testDuplicateBks`, `testNullBks` flags. |
| `dependency` | Every required upstream job, including lookup/service prerequisites. |

## Sandbox Example

The [historical sandbox](../configuration/sandbox-client-example.md) illustrates multi-source modeling. The [current package](../../examples/current/README.md) provides a small filtered, deduplicated INT contract. [customer_orders_transformation_job.json](../../examples/config/sandbox-v2/customer_orders_transformation_job.json) remains a teaching format.

## Common Write Behaviors

| `target.write_mode` | Meaning |
| --- | --- |
| `truncate_insert` | Replace selected target state; normal rebuildable INT pattern. |
| `append` | Add one queue's contribution; additive facts need explicit downstream version/grain rules. |
| `upsert` | Business-key update/insert across independent batches; mapping/SCD1 persistence. |
| `scd2` | History with keys, change hash, effective/expiry dates, and current flag. |

Do not substitute generic `overwrite` for transformation `truncate_insert`. Service exports have their own destination write options.

### Append Retries

A managed fact append is retry-safe at the queue boundary: retrying the same queue atomically replaces its contribution, preserving other queues. A new queue is a new append, not business-key replacement. Physical `_culina_write_id` tracks write identity; it is not a business attribute and must not enter default business hashes.

Source `Batch_ID` values are preserved by managed append and can differ from the control batch. `add_system_fields` separately assigns the transformation batch; retain source batch lineage in another column when using that step. Tagged append integrity checks use control batch/queue write identity, not unrelated source batches.

Retry protection does not fix duplicate input or bypass validation. Reconcile existing duplicates explicitly; use `upsert` when replacement across new queues is the requirement.

### Full-State Dimensions

Absence from a DELTA extract does not prove deletion. Tombstones require complete comparable source state or an explicit deletion feed. Required SCD2 integrity checks assess residual new/changed rows after writing; historical duplicate checks include effective/expiry grain.

## Diagnostics

Check filters, alias references, null/duplicate keys, join grain, write mode, and quality results. A committed write with failed required validation is still a failed job.

Optional `deployment_artifacts` and `runtime_options` belong to the full envelope. Artifact-only contracts require an empty `transformation.steps` list. Catalog publication and BI visibility are separate platform capabilities, not established by valid JSON. See [Dependencies And Validation](../guides/dependencies-and-validation.md).
