# Local

The local adapter supports bounded workload/contract development with native `file://` operations, environment-rooted secrets and configured Delta-capable Spark. It is not a deployment of a managed cloud orchestrator, SQL queue service or BI endpoint. Local checks do not qualify cloud identity, networking or connectors.

## Prerequisites

- Approved runtime installation; reference package metadata requires Python 3.10 or later. Workloads that use Spark need a compatible Spark/Java environment, with Delta support configured separately.
- Approved local input/output roots, disposable data, and the dependencies required by the intended workload. Excel ingestion needs the declared `openpyxl` dependency.
- `CULINA_LOCAL_SECRET_ROOT` for supported portable secret references, with values supplied through the process environment. Direct environment-variable names and `env://VARIABLE_NAME` remain compatible.
- A bounded payload/result directory and test identities; do not reuse production state or credentials for practice.

## Setup And Interfaces

Bind supported local storage roots and use relative source paths. Supply approved workload payloads and inspect result artifacts, execution status and details. Local execution does not automatically deploy Azure SQL/RDS DDL or write official queue history; a separately configured orchestrator remains responsible for those operations.

When a connector expects `TokenJsonKey`, `UserJsonKey` or `PasswordJsonKey`, its referenced environment value must be a JSON object containing that key. Approved writable local JSON secret stores require their explicit file-backed configuration; process environment resolution is not a remote secret-management service.

Local Delta objects and Spark views do not establish BI publication. `current_reporting` with `publish_for_bi=true` requires an approved injected BI-facing publisher; keep that disabled only when BI publication is intentionally not required.

## Qualification

Verify the installed Spark/Delta environment, bounded file reads/writes, secret-reference resolution, transformation/test failure results and any requested BI adapter. Treat existing [sandbox metadata](../../examples/metadata/data-culina-sandbox-test-client/README.md) as a historical learning fixture, not a current deployment contract.

[Platform hub](README.md) | [Version compatibility](../reference/version-compatibility.md)
