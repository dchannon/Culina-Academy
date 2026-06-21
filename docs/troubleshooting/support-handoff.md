# Support Handoff Checklist

Use this checklist before sending a support request to Data Culina.

## Required Details

- Your name and organization.
- Environment or workspace.
- Workflow name.
- Run identifier, if visible.
- Trigger time or expected run time.
- Current status.
- Orchestration layer or data layer involved, if visible.
- Expected result.
- Actual result.
- Full visible error message.
- Screenshot or exported evidence, if available.

## Useful Context

- Did this work before?
- Is the issue repeatable?
- Did source input change?
- Did configuration change recently?
- Is the issue blocking one workflow or multiple workflows?
- What is the last layer that appears correct?
- What is the first layer that appears incorrect?

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
