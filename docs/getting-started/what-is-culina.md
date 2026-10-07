# What Is Culina?

Culina is a metadata-driven operating framework for data movement, transformation, service jobs, orchestration, and support. It gives users a consistent way to describe work, run work, trace work, and diagnose work without treating every workflow as a custom one-off process.

## The Short Story

Most data operations fail in the gaps between intent, configuration, execution, and evidence. Culina closes those gaps by making each workflow visible through a shared control plane and a repeatable operating model.

```mermaid
flowchart LR
  Need["Business or operational need"] --> Config["Approved configuration"]
  Config --> Control["Control plane records"]
  Control --> Orchestration["Orchestration plane"]
  Orchestration --> Data["Data layers"]
  Data --> Evidence["Runtime evidence"]
  Evidence --> Support["Diagnosis and recovery"]
  Support --> Config
```

The loop matters. A workflow is not only a pipeline. It is a managed unit of work with configuration, dependency rules, validation expectations, runtime state, and support evidence.

## What Culina Helps Users Do

| User question | Culina answer |
| --- | --- |
| What work exists? | Jobs, source details, transformations, dependencies, and validation records describe configured work. |
| What should run next? | Queue state and dependency readiness show whether work is runnable, blocked, skipped, failed, or complete. |
| Where did data change? | Layer boundaries show whether the issue is in landing, delta, staging, integration, EDW, or consumption. |
| Why did a run fail? | Failure logs, run history, job configuration, and source or transformation metadata connect symptoms to evidence. |
| How should recovery happen? | Rerun, replay, backfill, and rebuild decisions follow the failed layer and affected dependency scope. |
| How is history retained? | Staging captures ingestion history; EDW write modes govern persistent facts and SCD2 dimensions; reporting explicitly chooses a historical or current perspective. |
| What runs on my platform? | Platform adapters bind the logical workload to deployed compute, storage, identity, and BI publishing. Qualification is environment-specific. |

## Operating Model

```mermaid
flowchart TD
  Observe["Observe symptom"] --> Classify{"Which plane owns the first signal?"}
  Classify -->|Configuration or state| Control["Control plane"]
  Classify -->|Trigger, readiness, dispatch| Orchestration["Orchestration plane"]
  Classify -->|Rows, files, tables, aggregates| Data["Data layer"]
  Control --> Evidence["Collect linked evidence"]
  Orchestration --> Evidence
  Data --> Evidence
  Evidence --> Action{"Minimum effective action"}
  Action --> Retry["Allow retry"]
  Action --> Rerun["Rerun unresolved work"]
  Action --> Replay["Replay downstream logic"]
  Action --> Backfill["Backfill missing source scope"]
  Action --> Rebuild["Rebuild derived output"]
```

This is the main diagnostic habit: classify the first reliable signal, collect linked evidence, and choose the smallest recovery action that matches the evidence.

## When Culina Fits

Culina is useful when a team needs:

- repeatable ingestion and transformation patterns
- visible dependency control between jobs
- consistent metadata for jobs, sources, transformations, and validation
- operational run evidence that support teams can interpret
- controlled recovery paths instead of broad blind reruns
- a shared language between client users, operators, and implementation partners

## When A Different Approach May Fit Better

A different approach may be simpler when the work is:

- a one-time file conversion with no ongoing operation
- an ad hoc analysis that does not need orchestration or supportability
- a workflow with no dependency, validation, recovery, or audit requirement
- a prototype where speed matters more than repeatable operation

## First Reading Path

1. [Quickstart: Trace A Workflow](quickstart.md)
2. [Architecture Reading Path](../architecture/README.md)
3. [Configuration Guide](../configuration/README.md)
4. [Diagnostic Queries](../troubleshooting/diagnostic-queries.md)
5. [Incident Walkthroughs](../troubleshooting/incident-walkthroughs.md)

For deployment prerequisites and the current validation boundary, read the [Platform Guide](../platforms/README.md). For guided learning, use the [Video Tutorials](../tutorials/README.md) and optional [Workbook Exercises](../../workbook/README.md).
