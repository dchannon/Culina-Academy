# Configuration Examples

The repository contains two example sets:

- `examples/config/sandbox-v2/` contains compact V2 configuration examples for the main job patterns.
- `examples/metadata/data-culina-sandbox-test-client/` contains a full sandbox client metadata export with jobs, linked services, source details, transformations, and dependencies.

These examples are designed to show the shape and relationships users should understand:

- an ingestion job that lands, archives, standardizes, and stages source data
- a transformation job that reads staged data and writes modeled output
- a dependency record that controls ordering between jobs
- validation expectations that describe what should be checked

## Example Files

- [customer_orders_ingestion_job.json](../../examples/config/sandbox-v2/customer_orders_ingestion_job.json)
- [customer_orders_transformation_job.json](../../examples/config/sandbox-v2/customer_orders_transformation_job.json)
- [customer_orders_dependencies.json](../../examples/config/sandbox-v2/customer_orders_dependencies.json)
- [customer_orders_validation.json](../../examples/config/sandbox-v2/customer_orders_validation.json)
- [Data Culina sandbox client metadata](sandbox-client-example.md)

## How To Read The Examples

Start with the ingestion job. It defines source intake and target layers through staging. Then review the transformation job. It reads staged data, applies transformation steps, and writes to the modeled target. Finally, review dependencies and validation expectations.

The important relationship is:

```text
source definition -> ingestion job -> staged output -> transformation job -> modeled output -> consumption
```

The full sandbox metadata expands this relationship into concrete control records:

```text
client -> job -> linked service -> source detail -> transformation -> dependency
```

## Configuration Review Questions

Use these questions when reviewing a new job:

- Does the job have a clear business purpose?
- Is the source identified clearly?
- Are expected input cadence and format described?
- Does the target layer match the job type?
- Are dependencies explicit?
- Are validation checks defined before the job is operated?
- Is owner or support context present?
