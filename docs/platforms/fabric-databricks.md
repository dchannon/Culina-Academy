# Fabric + Databricks

Fabric retains orchestration and Azure SQL access; Databricks Jobs execute ingestion/transformation using shared ADLS artifact files. Databricks receives no control-plane credentials and does not connect to that database. Hybrid artifacts/local checks exist; live client cloud qualification is pending.

## Prerequisites

- The [native Fabric setup](fabric.md), with its stable routing pipelines and native implementations retained.
- Databricks workspace, approved Jobs bundle/package, deployment authentication, Jobs run-as identity and compatible cluster policy.
- Fabric Databricks connection using approved service-principal/OAuth authentication and permission to run the workload jobs.
- Shared ADLS runtime artifact path accessible to both Fabric and Databricks, plus separate source/target storage grants for the compute identity.
- Existing Unity Catalog catalog/schemas, including the runtime-owned registry schema; run-as grants for catalog/schema use, approved reads/writes and object creation.
- Databricks source secret scope/root and portable storage aliases bound through approved environment or cluster settings.

## Setup And Interfaces

Validate/deploy the approved bundle, record its generated job references and bind the ingestion/transformation workflow job parameters. Deploy the hybrid implementation pipelines and Fabric payload/logging helpers beside the native implementation. Set `runtime_backend=DATABRICKS` on the scheduled or manual parent entry path.

Jobs accept `payload_file_uri`, `result_artifact_uri` and `workload_run_id`; transformation also exposes transformation and unit-test result artifact references. Only the final `result.json` is authoritative for orchestration finalization. A failed transformation bypasses unit tests; a later test failure does not erase transformation diagnostics.

Fabric helpers persist complete physical unit-test details to Azure SQL. Databricks performs compute, not official queue/history writes. Standard Fabric service/utility behavior remains installed; bundle service/deployment/bootstrap interfaces must be bound explicitly when used rather than assumed to switch with the ingestion/transformation backend.

Two-part `db`/`table` metadata remains supported; optional `catalog`/`schema`/`table` addresses Unity Catalog. Namespace creation is disabled by default. SCD2 current reporting creates a current-only catalog view; expose it through the approved Databricks SQL/Power BI path.

## Qualification

Verify one ingestion and transformation canary, artifact read/write failures, transformation/test/logging failures and SQL fallback finalization. Confirm shared-storage permissions, secret resolution, namespace grants and BI visibility before enabling schedules.

[Platform hub](README.md) | [ADF + Databricks](adf-databricks.md)
