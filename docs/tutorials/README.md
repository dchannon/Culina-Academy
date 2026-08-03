# Video Tutorials

This hub connects Data Culina YouTube tutorials to the public framework documentation. Videos provide the guided explanation; the linked docs remain the detailed operating reference.

## Published Tutorials

### 01. From Metadata to Evidence

[![Watch From Metadata to Evidence on YouTube](https://i.ytimg.com/vi/WUB48MUN_k8/maxresdefault.jpg)](https://youtu.be/WUB48MUN_k8)

- **YouTube title:** [Data Culina Framework Fundamentals Episode 01](https://youtu.be/WUB48MUN_k8)
- **Duration:** 6:39
- **Audience:** Clients, users, operators, and implementation partners
- **Outcome:** Understand the framework mental model: metadata defines intent, while orchestration and runtime execution produce evidence.
- **Prerequisites:** None

#### Companion Docs

- [What Is Culina?](../getting-started/what-is-culina.md)
- [Framework Overview](../getting-started/framework-overview.md)
- [Framework Architecture](../architecture/framework-architecture.md)

#### After Watching

Use the [Quickstart](../getting-started/quickstart.md) to trace one configured workflow through the control plane.

### 02. Control Plane vs Data Plane

[![Watch Control Plane vs Data Plane on YouTube](https://i.ytimg.com/vi/u6f94nvWImg/maxres1.jpg)](https://youtu.be/u6f94nvWImg)

- **YouTube title:** [Data Culina Framework Fundamentals Episode 02](https://youtu.be/u6f94nvWImg)
- **Duration:** 6:29
- **Audience:** Clients, users, operators, and implementation partners
- **Outcome:** Understand the framework's six architecture domains, their responsibilities, and the boundaries between control-plane decisions and data-plane execution.
- **Prerequisites:** [Episode 01: From Metadata to Evidence](https://youtu.be/WUB48MUN_k8)

#### Companion Docs

- [Framework Architecture](../architecture/framework-architecture.md)
- [Control Plane](../architecture/control-plane.md)
- [Orchestration Plane](../architecture/orchestration-plane.md)
- [Data Layers](../architecture/data-layers.md)

#### After Watching

Use the [Framework Architecture](../architecture/framework-architecture.md) guide to map each domain to the components running in your environment.

### 03. The Data Journey

[![Watch The Data Journey on YouTube](https://i.ytimg.com/vi/NxJomMWgvQ4/maxres1.jpg)](https://youtu.be/NxJomMWgvQ4)

- **YouTube title:** [Data Culina Framework Episode 03](https://youtu.be/NxJomMWgvQ4)
- **Duration:** 6:21
- **Audience:** Clients, users, operators, and implementation partners
- **Outcome:** Follow data through Landing, Archive, Delta, Staging, Integration, EDW, and Consumption while understanding each layer's responsibility, validation boundary, and operational evidence.
- **Prerequisites:** [Episode 02: Control Plane vs Data Plane](https://youtu.be/u6f94nvWImg)

#### Companion Docs

- [Data Layers](../architecture/data-layers.md)
- [Framework Architecture](../architecture/framework-architecture.md)
- [Dependencies And Validation](../guides/dependencies-and-validation.md)
- [Engine Diagnostics](../troubleshooting/engine-diagnostics.md)

#### After Watching

Use the [Data Layers](../architecture/data-layers.md) guide to identify the capture, refine, and serve responsibilities in your environment.

### 04. How Jobs Actually Run

[![Watch How Jobs Actually Run on YouTube](https://i.ytimg.com/vi/1VZ_PTN7kL0/maxresdefault.jpg)](https://youtu.be/1VZ_PTN7kL0)

- **YouTube title:** [Data Culina Framework Episode 04](https://youtu.be/1VZ_PTN7kL0)
- **Duration:** 6:23
- **Audience:** Clients, users, operators, and implementation partners
- **Outcome:** Trace an approved job definition through batch creation, queue states, dependency gating, controlled dispatch, retries, and official execution evidence.
- **Prerequisites:** [Episode 03: The Data Journey](https://youtu.be/NxJomMWgvQ4)

#### Companion Docs

- [Orchestration Plane](../architecture/orchestration-plane.md)
- [Dependencies And Validation](../guides/dependencies-and-validation.md)
- [Engine Diagnostics](../troubleshooting/engine-diagnostics.md)
- [Operating Guide](../operations/operating-guide.md)

#### After Watching

Use [Dependencies And Validation](../guides/dependencies-and-validation.md) to trace why one queued job is ready, waiting, retrying, or skipped.

### 05. Inside `culina-runtime`

[![Watch Inside culina-runtime on YouTube](https://i.ytimg.com/vi/AnLU_X5ctS8/maxresdefault.jpg)](https://youtu.be/AnLU_X5ctS8)

- **YouTube title:** [Data Culina Framework Episode 05](https://youtu.be/AnLU_X5ctS8)
- **Duration:** 6:17
- **Audience:** Clients, users, operators, and implementation partners
- **Outcome:** Understand how orchestration assembles a bounded `payload.json`, how shared runtime behavior executes ordered work, and how `result.json` returns structured evidence for orchestration to finalize.
- **Prerequisites:** [Episode 04: How Jobs Actually Run](https://youtu.be/1VZ_PTN7kL0)

#### Companion Docs

- [Framework Concepts](../concepts/framework-concepts.md)
- [Orchestration Plane](../architecture/orchestration-plane.md)
- [Control Plane Schema](../architecture/control-plane-schema.md)
- [Version Compatibility](../reference/version-compatibility.md)

#### After Watching

Use the [Control Plane Schema](../architecture/control-plane-schema.md) to trace one queue row into its step-level `job_runhistory` evidence.

### 06. Incremental Ingestion Under the Hood

[![Watch Incremental Ingestion Under the Hood on YouTube](https://i.ytimg.com/vi/ch7ysTWlGG0/maxresdefault.jpg)](https://youtu.be/ch7ysTWlGG0)

- **YouTube title:** [Data Culina Framework Episode 06](https://youtu.be/ch7ysTWlGG0)
- **Duration:** 5:03
- **Audience:** Clients, users, operators, and implementation partners
- **Outcome:** Distinguish Full and Delta extraction promises, understand incremental boundaries and staging history, and keep ingestion mode separate from target write behavior.
- **Prerequisites:** [Episode 05: Inside culina-runtime](https://youtu.be/AnLU_X5ctS8)

#### Companion Docs

- [Ingestion Job Pattern](../patterns/ingestion-jobs.md)
- [Add A REST Ingestion Job](../guides/add-rest-ingestion.md)
- [Data Layers](../architecture/data-layers.md)
- [Config Field Reference](../reference/config-field-reference.md)

#### After Watching

Use the [Ingestion Job Pattern](../patterns/ingestion-jobs.md) to compare Full and incremental boundaries for one source before selecting its staging write behavior.

## Planned Series

| # | Episode | Main lesson | Companion docs |
| ---: | --- | --- | --- |
| 1 | From Metadata to Evidence | Framework mental model; metadata defines intent but does not execute itself. | [What Is Culina?](../getting-started/what-is-culina.md), [Framework Overview](../getting-started/framework-overview.md) |
| 2 | Control Plane vs Data Plane | Six architecture domains and their boundaries. | [Framework Architecture](../architecture/framework-architecture.md), [Control Plane](../architecture/control-plane.md), [Data Layers](../architecture/data-layers.md) |
| 3 | The Data Journey | Source to Landing to Archive/Delta to Staging to INT to EDW to CONS. | [Data Layers](../architecture/data-layers.md) |
| 4 | How Jobs Actually Run | Grandparent, Parent, Child, Grandchild; queue states and dependency gating. | [Orchestration Plane](../architecture/orchestration-plane.md), [Engine Diagnostics](../troubleshooting/engine-diagnostics.md) |
| 5 | Inside `culina-runtime` | `payload.json` → shared execution library → `result.json` → official evidence. | [Framework Concepts](../concepts/framework-concepts.md), [Control Plane Schema](../architecture/control-plane-schema.md) |
| 6 | Incremental Ingestion Under the Hood | Full and Delta boundaries, staging history, deduplication, and target write behavior. | [Ingestion Job Pattern](../patterns/ingestion-jobs.md), [Add A REST Ingestion Job](../guides/add-rest-ingestion.md) |
| 7 | Transformations You Can Trust | Ordered JSON steps, append/upsert/SCD2, validation, unit tests. | [Transformation Jobs](../patterns/transformation-jobs.md), [Add Transformation](../guides/add-transformation.md), [Dependencies And Validation](../guides/dependencies-and-validation.md) |
| 8 | One Job, Any Platform | Same logical framework across local, A.W.S., Synapse, Fabric, and Databricks. | [Framework Architecture](../architecture/framework-architecture.md), [Version Compatibility](../reference/version-compatibility.md) |
