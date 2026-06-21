# Cookbook: Add A Transformation Job

Use this cookbook when adding modeled output from staging or integration data.

## Inputs To Decide First

| Decision | Example |
| --- | --- |
| Source tables | `stg.customer_orders`, `stg.customers` |
| Target layer | `int` or `edw` |
| Target table | `int.customer_order_summary` |
| Target grain | One row per customer per order date |
| Business keys | `customer_id`, `order_date` |
| Write mode | `append`, `upsert`, `overwrite`, or `scd2` |
| Required checks | duplicate keys, null keys, row count, join coverage |

## Control Records To Create

1. Create a `job` record for the transformation.
2. Create a `transformation` record tied to that job.
3. Add `dependency` records for every required upstream source.
4. Add validation expectations that match the target grain.

## Transformation Parameters Checklist

Confirm `parameters` defines:

- `sources`: aliases, databases, tables, filters, and business keys.
- `target`: database, table, write mode, and target keys.
- `transformation.steps`: ordered work such as read, filter, deduplicate, aggregate, join, select, add system fields, compute hash, and write.
- validation flags for duplicate keys, null keys, and expected row behavior.

## Example Files

Use these sandbox references:

- `examples/config/sandbox-v2/customer_orders_transformation_job.json`
- `examples/metadata/data-culina-sandbox-test-client/transformations/transformation_000501_int_blog_post_engagement.json`
- `examples/metadata/data-culina-sandbox-test-client/transformations/transformation_000502_edw_dim_blog_post.json`

## Review Questions

- Does the target grain match the business question?
- Are joins deterministic?
- Are duplicate records handled before aggregation or target writes?
- Are nullable business keys rejected or explicitly handled?
- Does the write mode match recovery expectations?
- Can a support user map a failed run-history step back to a configured step?
