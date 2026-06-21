# Control Plane Structure

The control plane is the framework's structured operating record. It defines what work exists, how work is connected, how runtime state is tracked, and what evidence is available for support.

For table-level detail, see [Control Plane Schema](control-plane-schema.md).

## Main Control Areas

### 1. Workflow Catalog

The workflow catalog identifies framework-managed work. It should answer:

- What workflow exists?
- What business purpose does it serve?
- Is it active?
- Which source and target areas does it affect?
- Which schedule or trigger normally starts it?
- What retry policy applies?
- Is the job active?

### 2. Source And Connection Definitions

Source definitions describe what the framework expects to receive or read. Users should be able to identify:

- source system or file family
- expected input cadence
- expected input shape at a high level
- connection or location reference
- ownership and support contact
- full-load or delta-load behavior
- landing, delta, and staging output expectations

### 3. Dependency Model

Dependencies describe ordering and readiness relationships. A workflow may be present in the queue but still not executable if required upstream work is incomplete.

Dependency evidence should help explain:

- which upstream work must finish first
- whether a dependency is satisfied
- whether a workflow is waiting, blocked, running, completed, or failed
- which downstream jobs will be skipped or delayed if an upstream job fails

### 4. Runtime State

Runtime state records what happened during a run. This typically includes:

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

Validation expectations describe what should be checked before a run is considered acceptable. These can include input availability, record counts, completeness checks, required fields, duplicate checks, and output availability.

### 6. Operational Evidence

Operational evidence supports diagnosis and handoff. It connects workflow configuration, dependency state, runtime status, and visible errors into one support story.

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
job definition -> source or transformation configuration -> dependency planning -> queue row -> run history -> failure or completion evidence
```

This flow is important during diagnosis. A failed queue row is not isolated; it points back to a job definition, source details, transformation parameters, dependency model, and batch context.
