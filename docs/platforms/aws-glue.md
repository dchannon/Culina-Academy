# AWS Glue

AWS V2 uses Glue engine/workflow/utility jobs, S3, Iceberg/Glue Data Catalog, RDS for SQL Server and Secrets Manager. Athena publishes approved view/CTAS reporting objects; it is not the control-plane database or the current orchestration engine. Live client cloud qualification is pending.

## Prerequisites

- Existing Glue jobs, compatible Spark/Iceberg environment, approved runtime package with AWS dependencies and SQL Server JDBC driver.
- RDS SQL Server with approved control-plane DDL and callable context/claim/finalization/quality/deployment/notification procedures.
- S3 artifact/source/target/warehouse locations, Iceberg catalog configuration and approved Glue namespaces.
- Scoped IAM for S3 list/read/write as required, Secrets Manager reads, Glue job launch/status, Data Catalog and approved Athena query/result paths.
- Network/JDBC reachability to RDS and sources, with encrypted SQL connections and certificate validation; connection values belong in Secrets Manager, not job configuration JSON.
- Separate failure, batch-completion and health endpoint references where external notifications are enabled. Additional service write permissions require explicit approval.

## Setup And Interfaces

Infrastructure and grants are provisioned separately. Configure the Iceberg Spark catalog/warehouse before workloads and review catalog bootstrap carefully: the AWS bootstrap can recreate namespaces, so it is not a routine reset action for populated environments.

Glue customer environment variables use `CUSTOMER_`. Bind `CUSTOMER_CULINA_STORAGE_ROOT_<ALIAS>` and `CUSTOMER_CULINA_AWS_SECRETS_MANAGER_ROOT` through driver settings; apply executor bindings where needed. Bootstrap maps these to runtime names without replacing an existing standard setting. Supported portable references remain `storage://<alias>/...` and `secret://<name>`.

Engine jobs pass lightweight routing context. Workflow wrappers retrieve large RDS context, execute compute, write S3 results and log full unit-test details. The finalizer utility persists official queue/history/failure state, including fallback when result publication fails. A Glue process can succeed while its framework result is FAILED; use finalized SQL/result evidence.

Deployment artifacts submit view/Iceberg CTAS DDL through Athena, requiring query execution/status access plus result/table-location permissions. CTAS needs a unique S3 table location. SCD2 current reporting creates/replaces a current-only Athena view after the successful target write.

Approved OAuth rotation additionally needs Secrets Manager get/put/stage-update grants and conditional expected-version handling. Source ingestion itself reads tokens; it does not rotate them.

## Qualification

Verify JDBC context retrieval, Spark/Iceberg writes, artifact publication, physical quality logging, failed-workload fallback, retries, contract preview/apply and external notification handoffs. Confirm Athena/BI access and IAM boundaries before scheduling production work.

[Platform hub](README.md) | [SQL catalog](../architecture/control-plane-schema.md)
