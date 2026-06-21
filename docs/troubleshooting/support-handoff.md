# Support Handoff Checklist

Use this checklist before sending a support request to Data Culina.

## Required Details

- Your name and organization.
- Environment or workspace.
- Workflow or engine area.
- Run identifier, if visible.
- Date and time of the issue.
- Expected result.
- Actual result.
- Full visible error message.
- Screenshots, if available.

## Useful Context

- Did this work before?
- Is the issue repeatable?
- Did input data change?
- Did a configuration change happen recently?
- Is the issue blocking one user, one workflow, or multiple workflows?

## Do Not Include

- passwords
- access tokens
- private keys
- customer-sensitive data unless explicitly requested through an approved channel
- internal assumptions about engine mechanics

## Example Handoff

```text
Workflow: Customer daily load
Environment: Client test workspace
Run time: 2026-06-21 09:15
Visible status: Failed
Expected result: Daily output available for reporting
Actual result: Output not available
Visible error: <paste exact visible error>
Evidence: Screenshot attached
Recent changes: Source file format changed yesterday
Impact: Reporting team blocked
```
