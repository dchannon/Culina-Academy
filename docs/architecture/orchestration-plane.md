# Orchestration Plane Layers

The orchestration plane coordinates configured work at runtime. It turns control plane definitions into planned, dependency-aware execution.

This page describes the high-level layers users may see referenced in operations and support conversations.

## 1. Trigger Intake

Trigger intake starts the orchestration flow. A trigger may come from a schedule, manual action, external event, or controlled support operation.

User-facing questions:

- Did the expected trigger occur?
- Was the trigger for the correct environment and workflow?
- Was the trigger accepted?

## 2. Run Planning

Run planning determines which configured work belongs in the current run context.

User-facing questions:

- Which workflows were included?
- Which period, batch, or source context applies?
- Was expected work missing from the run plan?

## 3. Dependency Resolution

Dependency resolution checks whether planned work can run. Work may exist but still be blocked by upstream requirements.

User-facing questions:

- Which dependency is incomplete?
- Is the upstream workflow failed, skipped, delayed, or still running?
- Is the downstream workflow correctly waiting?

## 4. Dispatch

Dispatch sends dependency-ready work to the correct execution handler.

User-facing questions:

- Was the workflow dispatched?
- Which execution area received it?
- Did dispatch fail before data processing began?

## 5. Execution Monitoring

Execution monitoring tracks active work and records status changes.

User-facing questions:

- Is the work running, completed, failed, skipped, or waiting?
- When did the status change?
- Is there an error message or warning?

## 6. Finalization

Finalization records the outcome of a run and makes downstream decisions possible.

User-facing questions:

- Did the workflow complete successfully?
- Were downstream dependencies released?
- Were outputs produced and made available?
- Was failure evidence captured?

## Operating Principle

Do not treat a queued or waiting workflow as automatically runnable. Dependency state and dispatch state matter. A useful diagnosis separates trigger, planning, dependency, dispatch, execution, and finalization.
