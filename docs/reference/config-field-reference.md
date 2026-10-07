# Configuration Field Reference

Current public contracts use camelCase exported records and snake_case runtime interfaces. They are not interchangeable payloads.

## Export Envelope

Governing fields are `studioName`, `studioPublisher`, `studioVersion`, `contractVersion`, `clientId`, `clientName`, `contractId`, `exportedAt`, and `exportedBy`. The three `studio*` keys identify the producing authoring tool; they do not grant deployment/runtime capabilities.

An export may contain `jobs`, `domains`, `domainMappings`, `dependencies`, `linkedServices`, `sourceDetails`, `transformations`, and `dataModels`. Folder packages split records into corresponding directories, including `service-configs/`; `metadata.json` carries package identity and counts.

Documentation package `2.2.0`, example export `version: "2.2.0"`, `contractVersion: "2.0.0"`, deployment `manifestVersion: "1.0"`, and service `schema_version: "1.0"` describe different things. Authoring-tool versions must identify their producer, not silently copy documentation/runtime versions.

New authoring identifiers should be GUIDs. Historical numeric IDs remain learning fixtures. Export IDs link package records; deployment resolves logical identities and produces deployed control records. Business keys and surrogate keys have different roles.

## `job`

| Field | Meaning |
| --- | --- |
| `id`, `clientId` | Export identity and client scope; retain consistent types in references. |
| `jobType` | `Ingestion`, `Integration`, `Data Warehouse`, `Consumption`, or `Service`; INT/EDW are layer names, not job-type values. |
| `entityName` | Logical work/target name. |
| `frequencyGroup` | Scheduling group, not a dependency. |
| `maxRetryCount`, `retryDelayBackoff` | Bounded retry policy. |
| `isActive` | Operational participation; keep learning fixtures inactive. |

## `linked_service`

| Field | Meaning |
| --- | --- |
| `id`, `clientId`, `sourceName`, `sourceType` | Identity, scope, reusable source label, connector selection. |
| `configJson` | Structured object or JSON-encoded object string, not plaintext credentials. |
| `Endpoint`, `Auth`, `Options` | API host/method, credential references, headers/timeout/paging/retry. |
| `Storage.BaseUri`, `Options.Read` | Portable file root and shared read defaults. |

### Current Connectors

| Family | Accepted source types |
| --- | --- |
| REST | `rest_api`, `restapi`, `http_get` |
| Katana | `katana`, `katana_api`, `katana_mrp` |
| Shopify | `shopify`, `shopify_api` |
| HubSpot | `hubspot`, `hubspot_api`, `hubspot_crm` |
| QuickBooks Online | `quickbooksonline`, `quickbooks_online`, `qbo` |
| NetSuite | `netsuite`, `netsuite_rest`, `netsuite_suiteql` |
| Procore | `procore`, `procore_api`, `procore_rest` |
| MySQL | `mysql` |
| PostgreSQL | `postgresql`, `postgres`, `postgres_sql` |
| SQL Server/Azure SQL | `sqlserver`, `sql_server`, `azure_sql`, `mssql` |
| Generic JDBC | `jdbc` |
| Spark files | `csv`, `json`, `jsonl`, `ndjson`, `parquet`, `orc`, `avro`, `text`, `file` |
| Excel | `excel`, `xlsx`, `xlsm` |

JDBC drivers and source permissions are environment prerequisites. NetSuite uses SuiteQL POST or record GET; Procore uses resource/path parameters and endpoint-owned filters. Ingestion consumes externally supplied access tokens; OAuth service jobs may manage tokens separately.

### Portable Storage

`storage://inbound/example-client` resolves alias `inbound` through `CULINA_STORAGE_ROOT_INBOUND`, falling back to `spark.culina.storage.root.inbound`. Environment settings take precedence; missing mappings fail. Physical roots belong in platform environment/Spark settings, not promotion substitutions for every source.

Aliases match `[a-z][a-z0-9_]{0,62}` (maximum 63 characters). A logical linked-service root has no wildcards; selectors are relative, may use Spark globs, and must not contain traversal, encoded separators/controls, malformed escapes, query-like suffixes, or fragments. Existing concrete roots remain compatible; physical roots must match the active platform.

### Portable Secrets

Use `secret://source-api-token` as a logical name, not a vault URL, AWS path, scope, or raw token. Secret names are not `${ENV.*}` promotion tokens. Provider roots remain outside exported metadata.

| Provider | Runtime environment setting |
| --- | --- |
| Synapse/native Fabric | `CULINA_AZURE_KEY_VAULT_ROOT` |
| AWS | `CULINA_AWS_SECRETS_MANAGER_ROOT` |
| Databricks | `CULINA_DATABRICKS_SECRET_ROOT` |
| Local reads | `CULINA_LOCAL_SECRET_ROOT` |
| Local writable documents | `CULINA_LOCAL_SECRET_DOCUMENT_ROOT` |

`CULINA_SECRET_ROOT` is the single-provider fallback; a provider-specific setting wins. Local read roots such as `env://EXAMPLE_` map hyphenated names to uppercase underscore environment names; writable service secrets require a writable document root. Embedded provider secret-root fields are rejected. Concrete legacy secret identifiers remain compatibility behavior, not the new authoring pattern.

## `source_detail`

| Field | Meaning |
| --- | --- |
| `id`, `jobId`, `linkedServiceConfigId` | References to the ingestion job and linked service. |
| `sourceEntityName` | Selected entity/file family. |
| `sourceSelectQuery` | API/file structured selector or JSON string; database connectors also accept plain SQL. |
| `sourceDeltaColumn`, `fallbackWatermark` | Staging-derived watermark field and safe first/missing-state fallback. |
| `deltaOrFull` | `FULL` or `DELTA` extraction, not target write mode. |
| `landingFileExtension`, `deltaFileExtension` | Captured/standardized output formats; e.g. `.parquet`. |
| `stagingTableName` | Table name only; deployed staging database defaults to `stg`. |

API selection uses `path`/`resource`/`query`, `params`, optional `root`, and `flatten`. Flatten columns use `expr`, tabular `alias`, and optional `dtype`; explode entries use `path`, `alias`, `outer`.

Source-owned `delta` uses `ParamName`, optional `ValueTemplate`, NetSuite `QueryPlaceholder`, or HubSpot `SearchPropertyName`/`SearchOperator`. `Options.Delta` and inferred parameter placeholders are compatibility fallbacks.

File selectors use `path`, `format`, and `options`. Generic `file` requires an explicit format. Excel adds one scalar `sheet_name`; one workbook/sheet per job/source detail, no globs or `.xls`. Shared read defaults are overridden by selector options.

Legacy `landingLocation`, `deltaLocation`, `archiveLocation`, `tempLocation`, `stagingSchemaName`, and `stagingSelectedFields` are ignored during current deployment, with warnings.

## `transformation`

| Field | Meaning |
| --- | --- |
| `id`, `jobId`, `transformationName`, `transformationType` | Identity, parent job, name, family. |
| `parameters` | Object/JSON string with named `sources`, `target`, `transformation.steps`; optional `deployment_artifacts`/`runtime_options`. |
| `initialLoad`, `isActive` | Initial-load behavior and participation. |
| `testDataIntegrity`, `testDuplicateBks`, `testNullBks` | Required configured quality tests. |

Sources use `db`, `table`, `business_keys`, `filter.where_clause`; staging reads require a `stg_load_date` filter under strict deployment validation. Targets use `db`, `table`, `business_keys`, `write_mode`: `truncate_insert`, `append`, `upsert`, or `scd2`. Steps use `step_id`, `name`, `type`, `config`.

Optional write tuning includes `partition_by`, `repartition`, `coalesce_to`, `max_records_per_file`, `auto_coalesce`, `target_file_size_bytes`, and `distribution_mode`, directly or under `write_optimization`; do not combine repartition/coalesce. See [Transformation Job Pattern](../patterns/transformation-jobs.md) for queue-safe append and full-state tombstones.

## `service_config`

Records contain `id`, `jobId`, `serviceType`, `configValue`, `isActive`. `configValue` holds `schema_version: "1.0"`, `execution`, `parameters`, and optional source/target linked-service export references.

Execution specifies `mode`, `handler`, `timeout_seconds`; plugins also require exact `plugin.distribution` and `plugin.version`. See [Add A Service Job](../guides/add-service-job.md).

## `dependency`

`id` identifies an edge; `jobId` is downstream; `dependentJobId` is upstream. Verify references, client scope, uniqueness, and an acyclic graph.

## Runtime Evidence

`batch_time` identifies the run window; `job_queue` shows status/retries; `job_runhistory` shows steps and output evidence; `job_failure_log` shows failed step/category/message. Runtime payloads also carry queue/job/batch identity; authoring export IDs are not execution evidence.

## Platform Qualification

Synapse orchestration and core ingestion/transformation/unit-test/contract-deployment paths are sandbox-validated. AWS Glue, native Fabric, Fabric-orchestrated Databricks, and local runtime contracts/artifacts are available, but artifact availability does not establish equivalent end-to-end client qualification. ADF + Databricks assets are locally tested; cloud sandbox qualification is pending.

Qualify the actual connector, storage mapping, secret provider, catalog, dependencies, services, and consumer-visible output in the intended environment. Do not infer every new connector/service is cloud-validated from the Synapse core baseline.
