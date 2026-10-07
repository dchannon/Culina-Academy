# Support Handoff Checklist

Use public issues for reproducible documentation/example questions and the assigned client support channel for environment-specific incidents. See [Support Model](support-model.md) for severity and ownership.

## Required Details

- Organization, environment, platform/backend, deployed contract/runtime version.
- Workflow/entity, UUID job/queue/batch identities, workload run, and UTC trigger/failure time.
- Official queue state, retry count/maximum/due time, and batch completion flag.
- Earliest failing upstream job, including relevant other open batches.
- Exact sanitized error, history zone/event, and failed runtime step.
- Authoritative result, required test details, and logging/finalization gaps.
- Expected versus actual source window, target grain, and consumer output.
- Side effects/writes already committed, approved recovery scope, and actions already taken.
- Notification POST/mark/delivery evidence separately, when relevant.

## Useful Context

- Did this exact deployed configuration work before?
- What changed in source, metadata, binding, identity, network, or runtime?
- What is the last correct layer and first incorrect layer?
- Is intake full/delta, and which load-date filter or watermark was actually used?
- Is target write mode append/upsert/replacement/SCD2?
- For append recovery, was original control queue identity preserved or was a new queue created?
- Are old duplicates or Unknown/inferred member issues present?
- Did required publication fail after an EDW write?
- Is a worker/parent still active, and which descendants were skipped?

## Do Not Include

Do not publish passwords, tokens, private keys, signed endpoint URLs, credential-bearing configuration, customer identifiers, full data extracts, or unreviewed diagnostics. Use approved private channels for necessary client evidence and sanitize artifacts/screenshots before sharing.

## Example Handoff

```text
Workflow: Customer daily load
Environment/platform/backend: <approved non-sensitive label>
Trigger/failure time UTC: <timestamp>
Job/queue/batch: <UUIDs through assigned private support channel>
Workload run: <run identity>
Official state and retry timing: <snapshot>
Expected/actual output: <brief difference>
Error and failed step: <exact sanitized evidence>
Changes/impact: <source/config/access changes and affected consumers>
```

## Better Handoff Example

```text
Workflow: EDW fact load
Control identity: <batch UUID and queue UUID>
Workload run: <original and recovery run identities>
Official state: <ON_HOLD_RETRY or FAILED>
Earliest upstream blocker: <confirmed job or none>
Write mode: append
Observed outcome: write committed; required validation failed
Source Batch_ID: <sanitized lineage value; not control queue identity>
Validation evidence: <selected source, counts, test details, logging status>
Recovery: <same queue preserved or new queue; approval and correction>
Existing duplication: <confirmed/ruled out/unknown>
Target/downstream proof: <grain, required tests, CONS/consumer result>
Notification: <POST, SQL marking, delivery tracked separately>
Requested help: confirm reconciliation and minimum recovery scope
```

These are evidence templates, not authorization to reset queues or change target data. Historical Academy sandbox IDs/names must not be substituted for current deployed SQL identities.
