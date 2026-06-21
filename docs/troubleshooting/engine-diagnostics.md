# Engine Diagnostics

Use this page when a Culina engine workflow does not behave as expected.

## First Check

Confirm:

- expected environment or workspace
- workflow name
- run identifier
- trigger time
- current status
- current orchestration layer, if visible
- current data layer, if visible
- expected output

## Common Symptoms

### Workflow Did Not Start

Collect:

- workflow name
- expected trigger time
- environment or workspace
- schedule or manual trigger context
- visible status
- recent configuration change, if known

Likely areas to review: trigger intake, run planning, workflow catalog.

### Workflow Is Waiting

Collect:

- waiting workflow
- upstream dependency name, if visible
- upstream status
- run context or input period
- how long it has been waiting

Likely areas to review: dependency resolution, upstream workflow status, source availability.

### Workflow Failed

Collect:

- run identifier
- failure timestamp
- failing orchestration layer or data layer
- full visible error message
- affected source, target, or output
- whether the failure repeats

Likely areas to review: dispatch, execution monitoring, current data layer, validation expectations.

### Output Looks Wrong

Collect:

- expected output
- actual output
- source period or source file context
- last layer that appears correct
- first layer that appears incorrect
- example affected record or aggregate, if appropriate

Likely areas to review: staging, integration, EDW/core warehouse, consumption.

## Diagnostic Rule

Separate the problem into:

- control plane issue: configuration, dependencies, run state, validation expectation
- orchestration issue: trigger, planning, readiness, dispatch, monitoring, finalization
- data layer issue: source, landing, delta, staging, integration, EDW/core warehouse, consumption

This separation makes support handoff faster and avoids guessing.
