# Engine Diagnostics

Use this page when a Culina engine workflow does not behave as expected.

## First Check

Confirm the basics before escalating:

- Are you in the expected environment or workspace?
- Is the expected input available?
- Did the workflow start?
- Did the visible status change?
- Is there a visible warning or error?
- Is the expected output missing, incomplete, or delayed?

## Common Symptoms

### Workflow Did Not Start

Collect:

- workflow name
- expected start time
- current visible status
- environment or workspace
- any recent configuration change you know about

### Workflow Failed

Collect:

- run identifier
- failure timestamp
- visible failing step or phase
- full visible error message
- screenshot if available
- whether the issue repeats

### Output Looks Wrong

Collect:

- expected output
- actual output
- input period or source context
- example affected record or file, if safe to share
- when the issue was first noticed

## Rerun Guidance

Do not repeatedly rerun a failing workflow without collecting evidence. Repeated reruns can make diagnosis harder if the original context is lost.

## Escalation

If the visible status or output does not explain the issue, use the support handoff checklist.
