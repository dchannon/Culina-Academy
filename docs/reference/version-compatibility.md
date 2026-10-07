# Version Compatibility

This repo documents client operating contracts and learning examples. Documentation package version, runtime package version, metadata contract version, and deployment-manifest version are independent identifiers.

Current reference: source date **2026-10-08**, snapshot **`0acd952`**, runtime package metadata **`culina-runtime` 0.2.34**. These identify the reviewed reference, not the version installed in any client environment. Confirm the deployed package and SQL/platform artifact versions before applying instructions.

| Material | Current version | Notes |
| --- | --- | --- |
| Culina Academy docs | 2.2.0 | Public operating documentation; not a runtime release number. |
| Runtime reference | 0.2.34 | Package metadata at `0acd952`; package delivery and environment installation are separate. |
| Deployment manifest | schema 1; `2026.10.07-v2.34` | Target discovery/capabilities; an advertised target need not have an executable deployment path. |
| Sandbox metadata export | 2.2.0 | Historical learning fixture: [sandbox package](../../examples/metadata/data-culina-sandbox-test-client/README.md). Its version is not runtime compatibility evidence. |
| V2 config examples | `culina.framework.config.v2.example` | Historical teaching format: `examples/config/sandbox-v2/`. |
| V2 config schemas | 1.0.0 | Validate teaching examples under `schemas/sandbox-v2/`, not current runtime deployment contracts. |
| Workbook exercises | Level 1 | Optional local practice materials. |

## Compatibility Notes

- Use the [physical SQL catalog](../architecture/control-plane-schema.md) for deployed names/relationships and the [platform hub](../platforms/README.md) for prerequisites and validation limits.
- Example metadata is for learning and reference. Client environments may use different ids, names, sources, tables, and schedules.
- Config examples show the shape of ingestion, transformation, dependency, and validation records. They should be adapted before use in a real environment.
- Schema validation confirms public example structure. It does not confirm environment connectivity, target deployment, or business rule correctness.
- Runtime behavior should always be interpreted with the version and deployment context visible in the client environment.

## Current Versus Legacy

| Concern | Current reference | Historical/compatibility interpretation |
| --- | --- | --- |
| SQL entities | `jobconfig.jobs`, `source_linked_service_config`, `transformation_controller`, `job_dependency`; GUID identifiers. | Singular file labels and camelCase fields are not literal SQL table/column names. No current physical `client` table. |
| Quality | Physical test details in `unit_test_results` and queue-scoped `unit_test_results_lastrun`. | Example validation sets and artifact pointers do not prove SQL detail logging. |
| Ownership | `job_domain` plus many-to-many `job_domain_mapping`. | Domain owner names do not replace external notification routing. |
| Notifications | Distinct failure, batch-completion and health-report endpoints; successful batch handoff log. | `job_email_list`, `vw_job_email_list`, `vw_source_detail`, `control_variables`, and `vw_job_failure_impact` are not current SQL-project objects. |
| Storage/secrets | Portable `storage://<alias>/...` and `secret://<name>` references with environment-owned roots. | Existing supported concrete provider URIs remain compatible; do not put real bindings or credentials in public examples. |
| Transformation identifiers | Two-part `db`/`table`; Databricks may also use `catalog`/`schema`/`table`. | Optional catalog support does not imply identical namespace or BI behavior on every platform. |
| Deployment/reporting | Contract staging/state tables, declarative data-plane artifacts, SCD2 current-only publishing, SQL `rpt` views. | Business CONS objects are distinct from control-plane monitoring views. |
| Platform artifacts | Synapse, Fabric, Fabric+Databricks, ADF+Databricks, AWS Glue; local adapters. | AWS V2 uses Glue orchestration jobs, not the historical Athena-only design; local execution is not a managed cloud control plane. |

## Validation And Promotion

The source contains local contract/artifact checks and describes sandbox-tested Synapse artifacts. This does not establish live cloud qualification for every target or feature. Fabric, both Databricks hybrids, and AWS require client-environment validation; ADF explicitly has local deterministic evidence, not live Azure deployment evidence. See [Platforms](../platforms/README.md) for each target's gate.

Before promotion, record deployed versions; review approved DDL/configuration; bind identities, storage, secrets and networking; run contract validation/preview; then verify ingestion, transformation, physical quality logging, failure/retry handling, finalization and reporting access. Schema validation alone does not prove any of those cloud journeys.
