# Config Validation

The repo includes JSON Schema documents for the compact V2 sandbox examples. These schemas are intentionally focused on the public example shape. They validate required structure and common field types before a user adapts the examples for a real environment.

## Schema Files

| Example | Schema |
| --- | --- |
| `examples/config/sandbox-v2/customer_orders_ingestion_job.json` | `schemas/sandbox-v2/ingestion-job.schema.json` |
| `examples/config/sandbox-v2/customer_orders_transformation_job.json` | `schemas/sandbox-v2/transformation-job.schema.json` |
| `examples/config/sandbox-v2/customer_orders_dependencies.json` | `schemas/sandbox-v2/dependencies.schema.json` |
| `examples/config/sandbox-v2/customer_orders_validation.json` | `schemas/sandbox-v2/validation-set.schema.json` |

## Validate Locally

From the repo root:

```powershell
npm run validate:schemas
```

Expected result:

```text
Validated 4 config examples against 4 schemas.
```

## Review Order

1. Validate the JSON files parse.
2. Validate required fields using the schema command.
3. Review whether IDs, owners, source paths, target datasets, dependencies, validation severity, and support notes match the intended workflow.
4. Confirm the final environment-specific values in the client system before operation.

## What The Schemas Do Not Do

The schemas do not prove that a source endpoint exists, a target table is deployed, a schedule is active, or a business rule is correct. They only confirm that the example configuration has the expected shape for review.
