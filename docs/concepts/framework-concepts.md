# Framework Concepts

## Metadata-Driven Operation

Culina uses structured control information to describe intended behavior. A workflow is not only a script or job. It has configuration, relationships, dependencies, expected inputs, output intent, and operational evidence.

## Control Plane

The control plane contains the framework's configured understanding of work. It describes workflow definitions, source definitions, dependency relationships, run state, validation expectations, and support evidence.

## Orchestration Plane

The orchestration plane coordinates runtime work. It decides what can be planned, what is dependency-ready, what can be dispatched, and what status should be recorded after execution.

## Data Plane

The data plane contains the data layers used by the framework. Data moves from source intake through standardized intermediate layers into durable modeled structures and consumption outputs.

## Operational Evidence

Operational evidence is the information used to understand what happened during a run:

- workflow name
- run identifier
- schedule or trigger context
- dependency state
- visible status
- failing step or layer
- error message
- affected input or output
- completion or failure timestamp

## Support Boundary

Users should first identify the affected workflow, layer, status, and evidence. If the problem cannot be explained from visible configuration and run evidence, prepare a support handoff.
