# User Guide

Use this short checklist when operating or reviewing a Culina-powered workflow. For step-by-step inspection, use the [Operations Guide](../operations/README.md).

## Before A Run

Confirm:

- installed runtime version and matching platform/control-plane artifacts
- workflow name or business purpose and `job_id`
- expected source or input
- expected output
- environment or workspace
- run schedule or trigger expectation
- dependency and blocking-test expectations
- extraction mode, watermark boundary, target write mode, and reporting perspective
- recent configuration changes

## During A Run

Track:

- control-plane `batch_id` and `queue_id`; workload run ID separately
- run start time
- current status
- current orchestration layer or data layer, if shown
- warning or error message
- input period or batch context
- physical test results, logging/finalization status, and output availability

## After A Successful Run

Confirm:

- the queue is officially `COMPLETED`, not merely a successful compute run
- required quality results were logged and passed before dependent work was released
- output exists in the intended serving location and is accessible through the expected BI connection
- output covers the expected period or source context
- row counts or file counts are reasonable where visible
- required business reporting was published; control-plane `rpt` monitoring is a separate surface
- no downstream workflow is unexpectedly blocked

For SCD2, distinguish historical attributes, current attributes for historical keys, and current-only dimension rows. See [History And Reporting](../concepts/history-and-reporting.md).

## After A Failed Or Unexpected Run

Capture the queue/batch IDs, first failed boundary, timestamp, and message before repeating work. Compare [diagnostic queries](../troubleshooting/diagnostic-queries.md) with workload artifacts and physical quality rows, then choose [minimum-scope recovery](../operations/backfill-and-recovery.md).

A retry of the same queue is not the same as creating a new append queue. Current managed fact appends replace the same write contribution on retry; a new queue is new logical work. Preserve source batch identity, and reconcile earlier duplicates explicitly rather than expecting a retry to repair them.

## Related Docs

- [Control Plane Structure](../architecture/control-plane.md)
- [Orchestration Plane Layers](../architecture/orchestration-plane.md)
- [Data Layers](../architecture/data-layers.md)
- [Engine Diagnostics](../troubleshooting/engine-diagnostics.md)
- [Diagnostic Queries](../troubleshooting/diagnostic-queries.md)
