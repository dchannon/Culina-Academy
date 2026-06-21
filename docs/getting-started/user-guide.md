# User Guide

Use this guide when operating or reviewing a Culina-powered workflow.

## Before A Run

Confirm:

- workflow name or business purpose
- expected source or input
- expected output
- environment or workspace
- run schedule or trigger expectation
- dependency expectations
- recent configuration changes

## During A Run

Track:

- run identifier
- run start time
- current status
- current orchestration layer or data layer, if shown
- warning or error message
- input period or batch context
- output availability

## After A Successful Run

Confirm:

- output exists in the expected serving location
- output covers the expected period or source context
- row counts or file counts are reasonable where visible
- no downstream workflow is blocked

## After A Failed Or Unexpected Run

Do not repeatedly rerun before collecting evidence. Capture the visible status, failing area, timestamp, and message first. Then use the diagnostics guide.

## Related Docs

- [Control Plane Structure](../architecture/control-plane.md)
- [Orchestration Plane Layers](../architecture/orchestration-plane.md)
- [Data Layers](../architecture/data-layers.md)
- [Engine Diagnostics](../troubleshooting/engine-diagnostics.md)
