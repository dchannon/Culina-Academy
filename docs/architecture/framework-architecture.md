# Framework Architecture

This page gives clients and users a map of how Culina-managed work is configured, planned, executed, and diagnosed.

## Control Plane Entity Map

```mermaid
flowchart LR
  Client["client"] --> Job["job"]
  Job --> SourceDetail["source_detail"]
  SourceDetail --> LinkedService["linked_service"]
  Job --> Transformation["transformation"]
  Job --> Dependency["dependency"]
  Dependency --> UpstreamJob["upstream job"]
  Job --> Queue["job_queue"]
  Queue --> RunHistory["job_runhistory"]
  Queue --> FailureLog["job_failure_log"]
  Queue --> Batch["batch_time"]
```

## Runtime Lifecycle

```mermaid
flowchart LR
  Trigger["Trigger intake"] --> Plan["Run planning"]
  Plan --> Dependencies["Dependency resolution"]
  Dependencies --> Dispatch["Dispatch"]
  Dispatch --> Execute["Execution"]
  Execute --> Monitor["Monitoring"]
  Monitor --> Finalize["Finalization"]
  Finalize --> Evidence["Runtime evidence"]
```

## Data Layer Flow

```mermaid
flowchart LR
  Source["Source"] --> Landing["Landing"]
  Landing --> Archive["Archive"]
  Landing --> Delta["Delta"]
  Delta --> Staging["Staging"]
  Staging --> Integration["Integration"]
  Integration --> Warehouse["EDW / Core warehouse"]
  Warehouse --> Consumption["Consumption"]
```

## Diagnostic Path

```mermaid
flowchart TD
  Symptom["Unexpected behavior"] --> Status["Check job_queue status"]
  Status --> Failed{"FAILED or ON_HOLD_RETRY?"}
  Status --> Waiting{"PENDING or SKIPPED?"}
  Status --> Output{"COMPLETED but output wrong?"}
  Failed --> FailureLog["Read job_failure_log"]
  FailureLog --> RunHistory["Check job_runhistory"]
  RunHistory --> Config["Map to source_detail or transformation"]
  Waiting --> Dependency["Trace dependency chain"]
  Dependency --> Upstream["Find earliest upstream blocker"]
  Output --> Boundary["Find last correct data layer"]
  Boundary --> Evidence["Collect evidence and recovery scope"]
  Config --> Evidence
  Upstream --> Evidence
```

## How To Read The Architecture

- Use the control plane to understand what should exist and how work is connected.
- Use the orchestration plane to understand whether configured work was planned, dependency-ready, dispatched, and finalized.
- Use the data layers to locate where the data first differed from expectation.
- Use runtime evidence to decide whether to rerun, replay, backfill, rebuild, or escalate.
