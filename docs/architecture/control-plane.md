# Control Plane Structure

The control plane is the framework's structured operating record: configuration, dependency readiness, queue state, deployment state, quality results, and monitoring evidence. The current SQL implementation uses the `jobconfig` and `rpt` schemas; business data lives in the data plane.

For table-level detail, see [Control Plane Schema](control-plane-schema.md). See [Platforms](../platforms/README.md) for environment prerequisites and [Version Compatibility](../reference/version-compatibility.md) for current versus historical contracts.

## Main Control Areas

### 1. Workflow Catalog

`jobconfig.jobs` identifies framework-managed work, using GUID `job_id`, `entity_name`, `job_type`, `frequency_group`, retry policy, active state, and audit fields. Supported SQL job types are `Ingestion`, `Integration`, `Data Warehouse`, `Consumption`, and `Service`. It should answer:

- What workflow exists?
- What business purpose does it serve?
- Is it active?
- Which source and target areas does it affect?
- Which schedule or trigger normally starts it?
- What retry policy applies?
- Is the job active?

### 2. Source And Connection Definitions

`source_detail` belongs to a job and optionally references `source_linked_service_config`. The former describes the read shape and load mode; the latter holds reusable source type and JSON connection configuration. Credentials remain secret references, and physical storage/secret roots are environment bindings. Users should be able to identify:

- source system or file family
- expected input cadence
- expected input shape at a high level
- connection or location reference
- ownership and support contact
- full-load or delta-load behavior
- landing, delta, and staging output expectations

### 3. Dependency Model

`job_dependency.job_id` is the downstream job; `dependent_job_id` is the required upstream job. The SQL dependency hierarchy and readiness views interpret these edges. A queued workflow is not necessarily executable. Self-dependencies and duplicate pairs are rejected, but those constraints alone do not reject every cycle.

Dependency evidence should help explain:

- which upstream work must finish first
- whether a dependency is satisfied
- whether a workflow is waiting, blocked, running, completed, or failed
- which downstream jobs will be skipped or delayed if an upstream job fails

### 4. Runtime State

`batch_time` owns the batch lifecycle; `job_queue` owns current queue status and retry timing; `job_runhistory` records timestamped events; `job_failure_log` records failures and notification/action flags. Runtime state includes:

- run identifier
- workflow identifier
- current status
- start and end timestamps
- retry or attempt count, where visible
- error message or failure context
- queue row status
- step-level run history
- batch-level lifecycle

### 5. Validation And Quality Expectations

`transformation_controller` stores parameters and the `test_data_integrity`, `test_duplicate_bks`, and `test_null_bks` flags. Tests run after successful transformation, not instead of it. The orchestration-side `usp_mf_transformation_unit_test_results_log` stores complete test details in `unit_test_results_lastrun` and `unit_test_results`.

Last-run results are replaced for the same queue ID; history is appended. Repeating the logging call can append duplicate historical details, so a successful write must not be retried blindly.

### 6. Operational Evidence

The `rpt.vw_pbi_*` views expose job, domain, batch, queue, event, failure, quality, lineage, deployment, and source-health evidence for Power BI. They are derived read surfaces, not configuration owners. Open durations are provisional snapshots, and a closed batch is not necessarily successful.

`job_domain.domain_owner_names` provides governance visibility through the many-to-many `job_domain_mapping`; it is not a notification recipient list. Failure, batch-completion, and health-report delivery use separate environment-owned endpoints. `batch_notification_log` records successful completion handoffs, not proof that a person received a message.

## Ownership And Deployment

| Concern | Owner and operating boundary |
| --- | --- |
| Jobs, sources, transformations, services, dependencies, domains | Approved client configuration changes and deployment process. |
| Queue seeding, claiming, retries, completion and failures | Orchestration and SQL procedures; do not manually edit runtime rows during normal operation. |
| Large execution context | Workload-specific context procedures and workflow payload artifacts, not engine parameters. |
| Compute result | Workload runtime writes the authoritative result artifact; orchestration finalizes official SQL status. A successful compute activity alone is insufficient. |
| Contract staging and apply | `contract_deployment`, `contract_object_stage`, `contract_object_state`, and `contract_validation_result`, managed through deployment procedures. |
| Secrets, identities, networking, schedules and access grants | Client environment; portable SQL schema deployment does not provision these. |

Clients apply approved generated SQL DDL through their own deployment process. Deploy reporting/helper views and procedures as well as tables. Bind GUIDs and JSON as SQL parameters, never interpolated SQL text.

Contract deployment supports `VALIDATE_ONLY`, `PREVIEW`, `APPLY_CHANGED`, and `FORCE_APPLY`. Review validation and preview before apply. Large contracts use manifest -> chunks -> staged apply; `APPLY_CHANGED` uses object checksums. Staging a manifest resets that deployment's staged objects and validation results, so retain evidence before restarting it.

Transformation `deployment_artifacts` and automatic SCD2 `current_reporting` create data-plane objects. They are not extra SQL configuration tables, and their CONS reporting namespace is distinct from control-plane `rpt` views.

## How To Use The Control Plane

When diagnosing an issue, start with these questions:

1. Is the workflow configured and active?
2. Did it receive the expected input?
3. Was it dependency-ready?
4. Did it dispatch?
5. Which layer failed or produced unexpected output?
6. What runtime evidence was recorded?
7. What output was expected and what actually happened?

## Configuration To Runtime Flow

```text
approved configuration -> jobs + workload configuration -> dependency readiness -> batch_time + job_queue -> workload payload/result -> SQL finalization -> history + failures + quality + reporting
```

This flow is important during diagnosis. A failed queue row is not isolated; it points back to a job definition, source details, transformation parameters, dependency model, and batch context.
