# Cookbook: Dependencies And Validation

Dependencies order jobs; validation determines whether configuration and resulting data are acceptable.

## Dependency Pattern

| Field | Meaning |
| --- | --- |
| `id` | Dependency identity. |
| `jobId` | Downstream job that waits. |
| `dependentJobId` | Upstream prerequisite. |

Validate both jobs exist, client scopes agree, and the graph has no self-links, duplicate edges, or cycles. Sources/lookups and service prerequisites need explicit edges. Reference checks alone do not establish graph correctness or runtime readiness.

## Example

The [current package](../../examples/current/README.md) links REST ingestion to INT modeling, then INT modeling to a service request. A separate portable file ingestion demonstrates FULL selection. The [historical sandbox](../configuration/sandbox-client-example.md) expands this to multiple inputs.

`PENDING` does not mean executable: prerequisites may still be open. Failure and recursive dependency state affect waiting/skipping; inspect queue/history rather than inferring success from parsed files.

## Validation Pattern

| Check | Evidence |
| --- | --- |
| Configuration | JSON/nested JSON, references, tokens, modes, aliases, steps, secret boundaries. |
| Input | Availability, permissions, schema, reliable watermark, bounded paging/file selection. |
| Integrity | Comparable source/target grain; log selected source, counts, filter, fallback reason. |
| Keys | Non-null keys and grain-aware duplicates. |
| Joins | Coverage and cardinality, not only execution success. |
| Output | Expected table/file and consumer access on the configured platform. |

Flags are `testDataIntegrity`, `testDuplicateBks`, and `testNullBks`. A completed write with failed required tests is a failed job.

Managed append integrity scopes tagged targets by control batch/queue `_culina_write_id`, preserving source `Batch_ID`. Missing control identity fails validation; unrelated queues with the same source batch must not inflate counts. Retry-safe replacement does not hide duplicate input.

`truncate_insert` checks the full replacement target. SCD2 integrity checks residual new/changed rows, not input count versus newly inserted history; duplicate checks respect effective/expiry grain. Tombstones require complete source state or explicit deletion evidence.

## Service Validation

`service-configs/` records reference a `Service` job and contain `configValue.schema_version: "1.0"`, `execution`, and `parameters`. Built-ins are `http_request`, `file_operation`, `spark_sql`, `data_export`, `oauth2_token_refresh`, and `oauth2_client_credentials`.

Use `execution.mode: "builtin"` for these. Extensions use `mode: "plugin"`, a logical handler, and exact `plugin.distribution`/`plugin.version`; separately verify installed handler and pinned version. Unknown handlers, built-in collisions, inline code/callable paths, invalid parameters, and plaintext credentials are rejected. OAuth services also need source/target linked-service references and safe concurrency configuration.

## Review Questions

Can blocked jobs be traced to prerequisites? Are failed checks treated as failures? Does recovery preserve same-queue versus new-queue semantics? Are structural checks, deployment acceptance, and real platform qualification reported separately?

See [Config Validation](../reference/config-validation.md) for local checks and their limits.
