# Synapse

Synapse pipelines orchestrate Azure SQL metadata and Synapse Spark workloads over ADLS Gen2/Delta. Source artifacts are described as sandbox-tested; qualification of the current client cloud environment remains pending. See [comparison and validation gates](README.md).

## Prerequisites

- Synapse workspace, compatible Spark pool/job definitions, ADLS Gen2 filesystem and Azure SQL control plane with the complete approved schema/procedure/view set.
- Approved runtime package matching the deployed artifacts; reference metadata is 0.2.34. Ensure package dependencies are installed, including `openpyxl>=3.1.5,<4` for Excel ingestion when dependency resolution is not automatic.
- Workspace identity with approved SQL execution/view access, ADLS read/write and Key Vault read access; workload-specific write permissions only where needed.
- Network reachability to SQL, Key Vault, ADLS and sources. Scope storage permissions and filesystem ACLs to approved roots.
- Existing Spark namespaces `stg`, `int`, `edw`, `con`, plus the runtime-owned registry namespace, provisioned at approved locations.

## Setup And Interfaces

Set the client Key Vault root through `CULINA_AZURE_KEY_VAULT_ROOT`, not embedded credentials. For portable files, bind `CULINA_STORAGE_ROOT_INBOUND` or `spark.culina.storage.root.inbound` to an approved ADLS root; source paths remain relative.

Deploy the engine/workflow/utility artifacts and bind SQL connection references and Spark job definitions. Engines carry routing identity; workflows retrieve SQL context, publish payload files, invoke compute, read authoritative result files and return output for SQL finalization. SQL Script activities bind GUID/JSON parameters rather than interpolating text.

Approved OAuth writes additionally require an existing Azure Blob lock reference and scoped Key Vault read/set plus Blob lease access. Treat a secret-write timeout as an uncertain commit: reread the target version before retrying.

Transformation deployment artifacts can create catalog views and one-time managed Delta CTAS tables in existing namespaces. SCD2 `current_reporting` with `publish_for_bi=true` needs an approved BI-facing publisher; a Synapse Spark view is not directly a workspace SQL view.

## Qualification

Verify ingestion, transformation, detail-test logging, contract preview/apply, failed activity fallback and retry behavior in the client workspace. Verify separate failure/completion/health endpoints and SQL monitoring access before enabling schedules. Confirm BI publishing independently of Spark success.

[Platform hub](README.md) | [Control plane](../architecture/control-plane.md)
