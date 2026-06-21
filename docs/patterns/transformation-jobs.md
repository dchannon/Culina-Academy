# Transformation Job Pattern

A transformation job turns staged or integrated data into modeled outputs.

## Purpose

Use a transformation job when data must be filtered, deduplicated, joined, aggregated, enriched, or written into a modeled target.

## Required Decisions

- source datasets
- target dataset
- target grain
- write behavior
- business keys
- required joins or lookups
- expected transformations
- validation checks
- downstream consumers

## Standard Flow

```text
Staging -> Integration -> EDW / Core Warehouse -> Consumption
```

## Pattern

1. Declare source datasets.
2. Declare target dataset and target layer.
3. Read source datasets.
4. Filter invalid or out-of-scope records.
5. Deduplicate before joins or aggregation.
6. Join lookup or reference data where needed.
7. Select and rename final columns.
8. Add framework-managed operational fields where configured.
9. Write the target using the chosen write behavior.
10. Run validation expectations.

## Common Write Behaviors

- `append`: add new fact-like records.
- `upsert`: update existing records and insert new ones.
- `overwrite`: replace a rebuildable target.
- `scd2`: maintain historized dimension-style records.

## Diagnostics

If transformation fails, identify:

- source read issue
- schema mismatch
- duplicate key issue
- join miss
- validation failure
- target write issue
- downstream output issue

See [customer_orders_transformation_job.json](../../examples/config/sandbox-v2/customer_orders_transformation_job.json).
