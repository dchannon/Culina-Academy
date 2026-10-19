# Config Validation

Separate JSON parsing, structural contract checks, deployment acceptance, and actual platform qualification.

## Schema Files

| Fixture | Validation scope |
| --- | --- |
| `examples/config/sandbox-v2/` and `schemas/sandbox-v2/` | Four historical teaching shapes only. |
| `examples/metadata/data-culina-sandbox-test-client/` | Unchanged 71-file historical export with nested JSON strings. |
| [Current Examples](../../examples/current/README.md) | Current folder contract, manifest/value set, neutral tokens, and focused structural verifier. |

The existing ingestion, transformation, dependency, and validation-set schemas do not cover universal exports, service configs, portable roots, current connector variants, or deployment manifests.

## Validate Locally

From the repository root:

```powershell
npm run validate:schemas
node examples/current/verify.mjs
```

The schema command validates four historical examples. The current verifier parses all current JSON, verifies package counts and GUID references, checks source/file/transformation/service shape, dataframe alias flow, dependency cycles, required token coverage/value-set scopes, and confirms promotion leaves portable secret/storage references intact. It performs no network, Spark, deployment, secret reads, or runtime job execution.

## Review Order

1. Parse JSON, including nested encoded `configJson`, `sourceSelectQuery`, and `parameters` where present. Current service `configValue` must be an object, not an encoded string.
2. Verify envelope identity/versions, counts, unique IDs, job/linked-service references, client scope, and dependency direction/cycles.
3. Check selectors, flatten aliases, watermark rules, file formats, relative storage paths, Excel sheet constraints, source filters, keys, target modes, and ordered step aliases.
4. Verify all non-secret `${ENV.*}` tokens are declared in `deployment-variable-manifest.json`, scoped correctly, and provided by an external versioned environment value set.
5. Promote into a separate resolved contract root; fail for missing required values or unresolved tokens. Do not replace `secret://` names or `storage://` aliases.
6. Use approved contract validation/deployment against the resolved root. Review validation results, logical identity mapping/checksums, and applied records before activation.
7. Qualify platform permissions, credentials, installed dependencies, source behavior, catalog output, and required quality tests.

## Service And Dependency Gates

Service jobs need `schema_version: "1.0"`, valid execution/parameters, supported built-ins or pinned plugin distribution/version, and valid source/target linked-service references where used. Reject unknown built-ins, reserved-name collisions, inline code/callable paths, plaintext secrets, and embedded secret-provider roots. Installed plugin handler uniqueness, distribution ownership, exact version, and callability are separate execution-environment checks.

Every dependency points from downstream `jobId` to upstream `dependentJobId`; unresolved references, self-links, cycles, duplicate edges, or missing required source/service prerequisites must be corrected.

## Data Acceptance

A committed write alone is not success: configured required quality tests must pass. Managed append retries replace the same queue's contribution; a new queue appends again. Tagged append integrity uses control write identity, preserving source batch values; it does not hide duplicate input. SCD2 checks residual changes and historical grain; tombstones need full-state or explicit deletion evidence.

## What The Schemas Do Not Do

Neither schemas nor the current structural verifier prove live endpoints, valid credentials, installed plugins/JDBC drivers, active schedules, deployed tables, correct business rules, or platform qualification. The current package is intentionally inactive and neutral. Consult [Configuration Field Reference](config-field-reference.md#platform-qualification) for validated versus pending support.
