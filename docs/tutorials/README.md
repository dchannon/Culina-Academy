# Video Tutorials

This hub connects Data Culina YouTube tutorials to the public framework documentation. Videos provide the guided explanation; the linked docs remain the detailed operating reference.

## Published Tutorials

### 01. From Metadata to Evidence

[![Watch From Metadata to Evidence on YouTube](https://img.youtube.com/vi/WUB48MUN_k8/maxresdefault.jpg)](https://youtu.be/WUB48MUN_k8)

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

[![Watch Control Plane vs Data Plane on YouTube](https://i.ytimg.com/vi/u6f94nvWImg/hqdefault.jpg)](https://youtu.be/u6f94nvWImg)

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

## Planned Series

| # | Episode | Main lesson | Companion docs |
| ---: | --- | --- | --- |
| 1 | From Metadata to Evidence | Framework mental model; metadata defines intent but does not execute itself. | [What Is Culina?](../getting-started/what-is-culina.md), [Framework Overview](../getting-started/framework-overview.md) |
| 2 | Control Plane vs Data Plane | Six architecture domains and their boundaries. | [Framework Architecture](../architecture/framework-architecture.md), [Control Plane](../architecture/control-plane.md), [Data Layers](../architecture/data-layers.md) |
| 3 | Anatomy of a Framework Contract | Export envelope, jobs, sources, dependencies, transformations, IDs. | [Control Plane Schema](../architecture/control-plane-schema.md), [Config Field Reference](../reference/config-field-reference.md) |
| 4 | The Data Journey | Source → Landing → Archive/Delta → Staging → INT → EDW → CONS. | [Data Layers](../architecture/data-layers.md) |
| 5 | How Jobs Actually Run | Grandparent, Parent, Child, Grandchild; queue states and dependency gating. | [Orchestration Plane](../architecture/orchestration-plane.md), [Engine Diagnostics](../troubleshooting/engine-diagnostics.md) |
| 6 | Inside `culina-runtime` | `payload.json` → shared execution library → `result.json` → official evidence. | [Framework Concepts](../concepts/framework-concepts.md), [Control Plane Schema](../architecture/control-plane-schema.md) |
| 7 | Transformations You Can Trust | Ordered JSON steps, append/upsert/SCD2, validation, unit tests. | [Transformation Jobs](../patterns/transformation-jobs.md), [Add Transformation](../guides/add-transformation.md), [Dependencies And Validation](../guides/dependencies-and-validation.md) |
| 8 | One Job, Any Platform | Same logical framework across local, A.W.S., Synapse, Fabric, and Databricks. | [Framework Architecture](../architecture/framework-architecture.md), [Version Compatibility](../reference/version-compatibility.md) |
