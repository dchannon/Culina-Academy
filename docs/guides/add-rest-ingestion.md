# Cookbook: Add A REST Ingestion Job

Use this cookbook when adding a new REST-style source into Culina control metadata.

## Inputs To Decide First

| Decision | Example |
| --- | --- |
| Source owner | Customer support API team |
| Source endpoint | `https://api.example.com` |
| Entity | `orders` |
| Load style | Full snapshot or delta |
| Landing format | JSON |
| Staging table | `stg.customer_orders` |
| Required columns | `order_id`, `customer_id`, `order_status`, `updated_at` |
| Downstream consumer | `INT.Customer_Order_Summary` |

## Control Records To Create

1. Create or reuse a `linked_service` record.
2. Create a `job` record for the staging ingestion job.
3. Create a `source_detail` record tied to the job.
4. Create dependencies from downstream jobs to the ingestion job.
5. Add validation expectations before operating the job.

## Source Detail Checklist

Confirm the `sourceSelectQuery` JSON defines:

- `path`: REST route or source query.
- `params`: request parameters.
- `delta`: delta parameter mapping if incremental.
- `flatten.columns`: output expressions, aliases, and data types.
- expected landing and delta file extensions.
- target staging table.

## Example Files

Use these sandbox references:

- `examples/config/sandbox-v2/customer_orders_ingestion_job.json`
- `examples/metadata/data-culina-sandbox-test-client/jobs/job_000201_stg_jsonplaceholder_posts.json`
- `examples/metadata/data-culina-sandbox-test-client/source-details/source_detail_000401_jsonplaceholder_posts.json`
- `examples/metadata/data-culina-sandbox-test-client/linked-services/linked_service_000301_public_jsonplaceholder_rest.json`

## Review Questions

- Is the job active only when the source is ready?
- Does the staging table name match downstream transformation inputs?
- Does the flattening configuration preserve required business keys?
- Is delta behavior explicit?
- Are malformed or missing required fields handled by validation?
- Is ownership clear enough for support triage?
