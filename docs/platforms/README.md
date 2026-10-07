# Platforms

Choose an environment by orchestration, storage, identity, and reporting requirements. All targets keep workload configuration separate from queue orchestration; shared workload execution does not own official SQL queue/history writes. Reference versions: [Version Compatibility](../reference/version-compatibility.md).

## Comparison

| Target | Orchestration / compute | Control plane | Storage / table format | Secrets / business reporting |
| --- | --- | --- | --- | --- |
| [Synapse](synapse.md) | Synapse pipelines / Spark job definitions | Azure SQL Database | ADLS Gen2 / Delta | Key Vault; Spark objects need an approved BI publisher when required. |
| [Fabric](fabric.md) | Fabric Data Factory pipelines / Fabric Spark notebooks | External Azure SQL Database | OneLake/Lakehouse / Delta | Key Vault through NotebookUtils; SCD2 current reporting is a managed Delta table. |
| [Fabric + Databricks](fabric-databricks.md) | Fabric pipelines / Databricks Jobs | Azure SQL accessed only by Fabric helpers | Shared ADLS artifacts / Delta and Unity Catalog | Databricks scopes for compute; current-only catalog views through an approved SQL/BI connection. |
| [ADF + Databricks](adf-databricks.md) | Native ADF pipelines / Databricks Jobs | Azure SQL accessed only by ADF | ADLS artifacts / Delta and Unity Catalog | ADF managed identity and Key Vault; Databricks compute access is separate. |
| [AWS Glue](aws-glue.md) | Glue engine/workflow/utility jobs / Glue Spark | Amazon RDS for SQL Server | S3 / Iceberg, Glue Data Catalog | Secrets Manager; Athena views and CTAS. |
| [Local](local.md) | Local workload execution; no managed cloud orchestration | No automatic SQL deployment or queue service | Local files / configured Delta-capable Spark | Environment-rooted process secrets; BI publisher needed when requested. |

The SQL `rpt` monitoring views are separate from business consumption (CONS, commonly `con`) tables/views on every target. A materialized object or successful Spark job does not alone prove Power BI access.

## Validation Status

| Target | Available evidence and support boundary | Pending gate |
| --- | --- | --- |
| Synapse | Source describes V2 sandbox-tested artifacts and includes contract/artifact tests. | Qualification of the current package and approved client SQL/Spark/storage/network/BI path. |
| Fabric | Native pipelines, notebook wrappers and local checks are available. | Live workspace execution, identity/connectivity, SQL endpoint visibility and failure finalization. |
| Fabric + Databricks | Shared Jobs bundle, routing contracts and local hybrid checks are available. | Live Fabric/Databricks connection, artifact handoff, quality logging and reporting. |
| ADF + Databricks | Locally checked native artifacts and ARM template; deployment manifest says `executor=manual`, `executable=false`. | Subscription ARM validation, identity grants and live success/failure journeys. |
| AWS Glue | Glue wrappers, catalog bootstrap and local adapter checks are available. | Live IAM/network/JDBC/Iceberg/Athena/RDS execution and notification handoffs. |
| Local | Local adapter and contract checks are available; suitable for bounded development/learning. | User's Spark/Delta environment and any external connector/BI integration. |

Cloud validation is pending for the client deployment. Available tests, advertised deployment executors, and sandbox history are not production qualification. These docs do not report a new cloud test run.

## Shared Setup Gate

1. Record the installed runtime version and matching SQL/platform artifacts; use the approved deployment package rather than treating Academy examples as deployment assets.
2. Apply approved SQL DDL including tables, helper/reporting views and procedures. Provision users, identities and grants separately.
3. Bind environment-owned storage roots, secret roots, job/connection references and network paths. Keep credentials out of metadata, payload/result files and public examples.
4. Provision existing namespaces before workload execution. Review bootstrap behavior: create-only on ADF's Databricks path, potentially recreating on AWS. Never use a reset action as routine setup in a populated environment.
5. Run contract validation/preview, then a bounded ingestion and transformation canary. Confirm physical quality rows and official SQL finalization, not only compute status.
6. Exercise missing/invalid payload, compute failure, failed quality checks, logging failure, retry and empty-work paths before enabling client-owned schedules and external notifications.
7. Verify both SQL monitoring access and the intended business BI publication path. Retain versions, IDs and timestamps in environment-owned evidence.

## Portable Bindings

Use `storage://<alias>/...` and `secret://<name>` in supported metadata, resolving physical locations through deployment settings. `CULINA_STORAGE_ROOT_<ALIAS>` takes precedence over `spark.culina.storage.root.<alias>`. AWS Glue exposes customer-prefixed settings through its bootstrap; other targets use their own environment/Spark settings.

Only artifact references and workload identity cross the Databricks Jobs boundary. Large execution context stays in payload files; SQL credentials remain with the orchestrator. Refer to [Control Plane Structure](../architecture/control-plane.md) and the [SQL catalog](../architecture/control-plane-schema.md) for ownership.
