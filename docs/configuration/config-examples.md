# Configuration Examples

Start new configuration work with [Current Contract Examples](../../examples/current/README.md). This small package uses current source, file, transformation, service, and promotion contracts with neutral placeholders. It is a structural learning fixture, not a configured deployment.

The repository also retains two historical learning sets:

- `examples/config/sandbox-v2/` contains compact V2 teaching examples, not the current deployment contract.
- `examples/metadata/data-culina-sandbox-test-client/` contains the unchanged 71-file historical sandbox export. Its record relationships remain useful, but its versions, identifiers, and connector options are not a current support guarantee.

These examples are designed to show the shape and relationships users should understand:

- an ingestion job that lands, archives, standardizes, and stages source data
- a transformation job that reads staged data and writes modeled output
- a dependency record that controls ordering between jobs
- validation expectations that describe what should be checked
- schema files that validate the compact V2 example shape

## Example Files

- [customer_orders_ingestion_job.json](../../examples/config/sandbox-v2/customer_orders_ingestion_job.json)
- [customer_orders_transformation_job.json](../../examples/config/sandbox-v2/customer_orders_transformation_job.json)
- [customer_orders_dependencies.json](../../examples/config/sandbox-v2/customer_orders_dependencies.json)
- [customer_orders_validation.json](../../examples/config/sandbox-v2/customer_orders_validation.json)
- [Data Culina sandbox client metadata](sandbox-client-example.md)
- [Config Validation](../reference/config-validation.md)

## Cookbooks

- [Add A REST Ingestion Job](../guides/add-rest-ingestion.md)
- [Add A Transformation Job](../guides/add-transformation.md)
- [Dependencies And Validation](../guides/dependencies-and-validation.md)
- [Configuration Field Reference](../reference/config-field-reference.md)

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

## Local Validation

Run:

```powershell
npm run validate:schemas
```

This checks only the compact historical V2 files against `schemas/sandbox-v2/`. It does not validate `examples/current/`, a universal export, deployment tokens, or runtime/platform readiness. Use the structural checks and promotion review in [Config Validation](../reference/config-validation.md) for current contracts.
