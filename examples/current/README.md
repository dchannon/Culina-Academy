# Current Contract Examples

A small structural learning package for Academy 2.2.0. All jobs/configs are inactive, identifiers are synthetic GUIDs, and URLs use example.invalid. These files contain no credentials and do not run a source or prove platform qualification.

## Package Shape

~~~text
current/
  contract-template/
    metadata.json
    jobs/                 orders-rest.json, orders-file.json, orders-int.json, publish-status.json
    linked-services/      orders-api.json, inbound-files.json
    source-details/       orders-rest.json, orders-file.json
    transformations/      orders-int.json
    service-configs/      publish-status.json
    dependencies/         orders-int-orders-rest.json, publish-status-orders-int.json
  deployment-variable-manifest.json
  value-sets/dev.example.json
  fragments/pinned-extension.json
  data/orders/orders.json
  verify.mjs
~~~

The contract root has 13 JSON objects: metadata plus 12 records. Manifest/value sets, fragment, and sample data are outside that root. Never deploy the entire examples/current directory as a contract root.

## How The Examples Operate

1. [REST ingestion](contract-template/jobs/orders-rest.json) uses [orders-api](contract-template/linked-services/orders-api.json) and [orders-rest selection](contract-template/source-details/orders-rest.json). DELTA uses updated_since, staging updated_at, and a first-run fallback. A real endpoint must demonstrably honor that filter.
2. [INT transformation](contract-template/transformations/orders-int.json) reads stg.Orders_Rest through a stg_load_date filter, deduplicates order_id by newest update/load time, and writes int.Orders with truncate_insert.
3. [INT dependency](contract-template/dependencies/orders-int-orders-rest.json) makes INT wait for ingestion; [service dependency](contract-template/dependencies/publish-status-orders-int.json) makes [publish-status](contract-template/service-configs/publish-status.json) wait for INT. It uses supported http_request configuration, GET, and a secret-backed header.
4. [File ingestion](contract-template/source-details/orders-file.json) independently demonstrates FULL selection using storage://inbound/example-client and orders/*.json. It is not an INT prerequisite. [Two sample rows](data/orders/orders.json) show source fields, not runtime payloads or expected output evidence.

The REST selector has no response root: an adapted endpoint should return projected records directly. The file selector uses multiLine: true for the sample JSON array. To study local file ingestion, place the sample under an example-client/orders subtree of disposable client storage and map the inbound alias externally.

### Stable Identities

| Record | Synthetic ID |
| --- | --- |
| Client | 00000000-0000-4000-8000-000000000001 |
| REST ingestion job | 10000000-0000-4000-8000-000000000001 |
| File ingestion job | 10000000-0000-4000-8000-000000000002 |
| INT job | 10000000-0000-4000-8000-000000000003 |
| Service job | 10000000-0000-4000-8000-000000000004 |
| REST / file linked services | 20000000-0000-4000-8000-000000000001 / 20000000-0000-4000-8000-000000000002 |
| REST / file source details | 30000000-0000-4000-8000-000000000001 / 30000000-0000-4000-8000-000000000002 |
| Transformation / service config | 40000000-0000-4000-8000-000000000001 / 50000000-0000-4000-8000-000000000001 |
| INT / service dependencies | 60000000-0000-4000-8000-000000000001 / 60000000-0000-4000-8000-000000000002 |

## Authoring And Deployment

metadata.json contains governing identity, counts, and producer keys studioName, studioPublisher, studioVersion. They describe the authoring origin, not deployed control-plane rows. Export IDs link package records; approved deployment maps logical identities into the control plane and records its own checksums/results.

Example export version 2.2.0 and documentation 2.2.0 are distinct from contractVersion 2.0.0, manifestVersion 1.0, and service schema_version 1.0. The neutral producer version 0.0.0-example is not a runtime version.

Promote non-secret environment tokens using deployment-variable-manifest.json and an external versioned client value set into a separate resolved contract root. Fail for missing required values or unresolved tokens. DEV values remain deliberately non-operational; replace them through client-owned values, never embedded credentials.

secret://service-api-token and storage://inbound/example-client are not promotion tokens. Configure the applicable provider setting and CULINA_STORAGE_ROOT_INBOUND (or Spark fallback) outside metadata. The Azure secret setting is CULINA_AZURE_KEY_VAULT_ROOT; see [environment roots](../../docs/reference/config-field-reference.md#portable-secrets).

The [pinned extension fragment](fragments/pinned-extension.json) is outside the contract and intentionally has no job/dependency record. It shows supported plugin mode, logical handler, distribution, and exact version only. Its destination token is declared in manifest fragments scope and DEV values; adaptation requires adding a Service job, dependencies, and a separately installed matching extension.

## Structural Verification

From the Academy root:

~~~powershell
node examples/current/verify.mjs
npm run validate:schemas
~~~

The current verifier checks parsing, counts, GUID references/client scope, selectors/flattening, filters/keys/modes/alias flow, service shape, dependencies/cycles, and token/value-set scope. It tests malformed references, cycles, missing values, absolute file paths, and undefined aliases. Promotion is checked in memory; nothing is written or deployed.

The checker is CLI-only: exit status 0 means all assertions passed; a parse/assertion failure exits nonzero. It prints a one-line success summary and can be invoked as a child process by repository tests. Its rules are scoped to these fixtures, not a deployment validator or general promotion engine.

Historical schemas cover only four compact sandbox shapes. They do not validate this package or establish endpoints, secrets, installed extensions/drivers, business correctness, full-state deletion evidence, or cloud qualification. Synapse core paths are sandbox-validated; other artifacts need environment qualification, and ADF + Databricks cloud sandbox qualification is pending.

The unchanged 71-file sandbox remains a [historical learning fixture](../../docs/configuration/sandbox-client-example.md). Start broader configuration work from the [Configure hub](../../docs/configuration/README.md).
