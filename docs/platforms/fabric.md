# Fabric

Fabric Data Factory pipelines orchestrate native Fabric Spark notebook workloads on OneLake/Lakehouse Delta. The control plane is **external Azure SQL Database**, not a Lakehouse or Warehouse. Artifacts and local checks exist; live client cloud qualification is pending.

## Prerequisites

- Fabric capacity/workspace, Lakehouse/OneLake storage, compatible Spark environment and approved runtime package/dependencies.
- External Azure SQL with approved DDL, context/claim/finalization/deployment/quality procedures, and reporting views.
- Approved Fabric connection/identity access to SQL, OneLake, Key Vault and sources; network policies must allow those paths.
- Key Vault secret root supplied through `CULINA_AZURE_KEY_VAULT_ROOT`; source metadata uses secret references.
- Catalog bootstrap with explicit locations for `stg`, `int`, `edw`, `con` and the runtime-owned registry namespace.

## Setup And Interfaces

Deploy the standard pipelines and notebook wrappers. Keep `runtime_backend=FABRIC` for native ingestion/transformation; the routing pipelines also support `DATABRICKS` when the hybrid implementation is deployed. Unsupported backend values fail before workload execution.

Bind portable file aliases to approved OneLake ABFS roots using environment settings or `spark.culina.storage.root.<alias>`. Workflows, not engine parameters, retrieve large SQL context and publish payload/result files. Notebook wrappers handle context and physical test logging; the orchestration finalizer owns queue/history/failure state.

Native SCD2 current reporting replaces a managed Delta table in CONS for SQL analytics endpoint visibility, not just a Spark view. Confirm the actual endpoint/BI permissions and availability separately. Service workflows remain native Fabric wrappers; approved Azure secret writes need explicit Blob locking and scoped read/set/lease grants.

## Qualification

Exercise native ingestion/transformation, physical quality logging, failed compute and logging fallbacks, contract deployment, and notification handoffs in the workspace. Verify current-only rows through the intended SQL analytics endpoint/Power BI connection before enabling schedules.

[Platform hub](README.md) | [Fabric + Databricks](fabric-databricks.md)
