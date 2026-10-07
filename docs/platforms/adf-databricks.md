# ADF + Databricks

Azure Data Factory owns orchestration and Azure SQL access; the shared Databricks Jobs bundle owns compute. This is not a Synapse workspace target and does not require Synapse Spark job definitions or orchestration notebooks.

The deployment-manifest target is `azure-data-factory-databricks`, with `executor=manual` and `executable=false`. Native ADF/ARM artifacts have local deterministic checks; live Azure validation is pending. An advertised target is not an executable deployment-app path.

## Prerequisites

- Azure SQL with approved table/view/procedure DDL, ADLS Gen2 with hierarchical namespace, approved runtime files and the shared Databricks Jobs deployment.
- ADF system-assigned managed identity: contained SQL user with procedure/view grants, Key Vault secret get, and scoped ADLS read/write plus filesystem ACL traversal/write.
- ADF identity with Databricks workspace/MSI access and permission to run jobs. Databricks run-as identity separately needs source secrets, ADLS and catalog/schema grants; it does not need control-plane SQL permissions.
- Network reachability from ADF integration runtime to SQL, Key Vault, Databricks and Blob endpoints, and from compute to ADLS/sources. Private networking is client-owned.
- Environment bindings for factory/location, workspace references, five job references, matching Blob/DFS storage roots, and SQL/notification secret references. Never leave deployment placeholders unbound.

## Setup And Interfaces

Use approved ARM deployment or native ADF artifact import. The template covers factory, linked services and pipelines; it does not provision SQL DDL, ADLS, Jobs, RBAC, secrets, private endpoints or schedule triggers. Review existing factory identity/Git configuration before applying changes.

SQL linked services use system-assigned managed identity with TLS/certificate validation; Databricks uses MSI. Workflows retrieve SQL context and write ADLS payload files. Native `DatabricksJob` activities use `jobID` and `jobParameters`, carrying artifact references/run identity, not SQL credentials or full metadata.

Bind ingestion, transformation, service, contract-deployment and bootstrap job references to their approved shared Jobs interfaces. SQL metadata owns workload retries. Artifact paths include queue and workflow-run identity to avoid consuming an earlier attempt's result. Complete unit-test JSON is logged physically; the logging activity is not automatically retried because history inserts can duplicate.

Contract deployment is standalone: validate/preview first, read the separate manifest/chunks, stage every required chunk, then apply through SQL. Bootstrap is standalone and create-only; existing schemas are retained. Keep failure, batch-completion and health-report endpoint bindings independent.

Keep workload summaries and unit-test JSON below the documented 4 MB activity/return-value limit; default contract chunks are conservatively sized at 250,000 bytes. Large histories need an approved logging transport, not silently omitted details.

## Qualification

Validate ARM in the target subscription, then verify a complete queue run, failed transformation, failed tests, logging failure, empty claim, contract preview and repeated bootstrap. Confirm SQL finalization and separate notification handoffs before adding client-owned triggers.

[Platform hub](README.md) | [Fabric + Databricks](fabric-databricks.md)
