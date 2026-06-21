# Operating Guide

This guide describes how users should operate and diagnose Culina-managed workflows.

## Daily Operating Checklist

1. Confirm expected workflows are scheduled or triggered.
2. Confirm expected source inputs are available.
3. Review run status for active or recently completed workflows.
4. Check failed, waiting, or skipped work before checking downstream outputs.
5. Confirm consumption outputs are available for users.
6. Record any unexpected behavior with run evidence.

## Status Interpretation

Common statuses may include:

- **Waiting:** work exists but is not ready to run.
- **Running:** work has been dispatched and is active.
- **Completed:** work finished successfully.
- **Failed:** work stopped with an error.
- **Skipped:** work did not run because a required condition was not met.

Exact labels can vary by deployment, but the operating distinction matters: waiting, running, completed, failed, and skipped require different responses.

## Triage Flow

1. Identify the workflow and run.
2. Identify current status.
3. Identify the orchestration layer involved.
4. Identify the data layer involved.
5. Check upstream dependencies.
6. Check source availability.
7. Capture visible error messages.
8. Determine whether output is missing, delayed, or incorrect.
9. Prepare support handoff if the issue is unresolved.

## Rerun Guidance

Reruns should be controlled. Before requesting or performing a rerun, confirm:

- the original failure cause is understood
- source input is available
- upstream dependencies are complete
- downstream impact is understood
- the run identifier and target scope are clear

Avoid broad reruns when a targeted rerun or support review is more appropriate.

## Evidence To Keep

- workflow name
- run identifier
- environment or workspace
- trigger time
- status history
- failing layer
- error message
- expected output
- actual output
- screenshots where useful
