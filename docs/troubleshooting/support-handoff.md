# Support Handoff Checklist

Use this checklist before sending a support request to Data Culina.

## Required Details

- Your name and organization.
- Environment or workspace.
- Workflow name.
- Job id and `entityName`, if visible.
- Run identifier, if visible.
- Batch id and queue row id, if visible.
- Trigger time or expected run time.
- Current status.
- First failing upstream job, if known.
- Orchestration layer or data layer involved, if visible.
- Expected result.
- Actual result.
- Full visible error message.
- Failing run-history step, if visible.
- Screenshot or exported evidence, if available.

## Useful Context

- Did this work before?
- Is the issue repeatable?
- Did source input change?
- Did configuration change recently?
- Is the issue blocking one workflow or multiple workflows?
- What is the last layer that appears correct?
- What is the first layer that appears incorrect?
- Is the job full-load or delta-load?
- Which target table or output is affected?
- Were any downstream jobs skipped?

## Do Not Include

- passwords
- access tokens
- private keys
- sensitive customer data unless shared through an approved channel

## Example Handoff

```text
Workflow: Customer daily load
Environment: Client test workspace
Run time: 2026-06-21 09:15
Visible status: Failed
Layer involved: Delta
Expected result: Daily output available for reporting
Actual result: Output not available
Visible error: <paste exact visible error>
Evidence: Screenshot attached
Recent changes: Source file format changed yesterday
Impact: Reporting team blocked
```

## Better Handoff Example

```text
Workflow: INT.Blog_Post_Engagement
Job id: 205
Environment: Sandbox test workspace
Batch id: <batch id>
Queue row id: <queue row id>
Visible status: FAILED
First failing upstream job: STG.JsonPlaceholder_Posts, if confirmed
Failing step: deduplicate or write_target, if visible
Expected result: INT.Blog_Post_Engagement refreshed from posts, comments, and users
Actual result: Integration output not refreshed
Visible error: <paste exact visible error>
Recent changes: <source/config/runtime changes>
Evidence: job_queue, job_failure_log, job_runhistory, screenshot
Impact: Downstream EDW jobs skipped
Requested help: Confirm cause and recovery scope
```
