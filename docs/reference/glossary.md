# Glossary

| Term | Meaning |
| --- | --- |
| Control plane | Deployed configuration, operational state, and official evidence |
| Orchestration plane | Coordination that seeds, claims, dispatches, retries, and finalizes work |
| Data plane | Workload execution and the files/tables it processes and serves |
| Job | Configured definition of managed work |
| Queue row | One runtime work instance with status, identity, and retry policy |
| Batch | Scheduling or operational grouping of queue work |
| Dependency | Required upstream condition evaluated before dispatch |
| Payload | Approved bounded execution context, commonly `payload.json` |
| Result | Structured execution evidence, commonly `result.json`, interpreted by orchestration |
| Linked service | Source or service connection configuration |
| Source detail | Extraction, incremental behavior, format, and staging configuration |
| Service job | Configured operational workload with normal queue and evidence contracts |
| Landing | Captured source intake |
| Archive | Retained raw or near-raw input |
| Delta layer | Standardized table-friendly intake |
| Delta extraction | Incremental source extraction based on a boundary |
| Delta Lake | Physical table format; distinct from the layer and extraction mode |
| Staging | Append-oriented Bronze history of standardized inputs |
| Integration / INT | Transient model alignment, normally truncate-and-load |
| EDW | Durable modeled facts and dimensions |
| Consumption / CONS | Derived reporting or downstream-serving surfaces |
| Watermark | Value delimiting an incremental processing scope |
| Write mode | Target persistence behavior, independent of source extraction mode |
| SCD2 | Historical dimension versioning with keys, hashes, effective/expiry dates, and current flags |
| Tombstone | Version/state reflecting disappearance from complete source state |
| Unknown member | Execution-owned `-1` dimension key for eligible null/blank fact lookups |
| Inferred member | Placeholder for a non-null late-arriving dimension lookup |
| Hydration | Filling an inferred placeholder with real attributes while preserving its key |
| As-was | Reporting attributes from the fact's historical dimension version |
| Current value | Latest attributes exposed at historical surrogate-key grain |
| Current only | Active dimension rows; unsuitable for direct historical fact-key joins |
| Portable storage reference | `storage://<alias>/<path>` mapped externally to physical storage |
| Secret reference | `secret://<name>` resolved through an environment provider root |
| Environment token | A value such as `${ENV.LANDING_ROOT}` resolved before package deployment |
| Retry | Another allowed attempt of the same queue work |
| Rerun | Controlled reactivation of selected unresolved work after investigation |
| Replay | Reprocess retained input or downstream logic over known scope |
| Backfill | Process missing historical source scope |
| Rebuild | Recreate a derived output from trusted inputs |

Use [Framework Concepts](../concepts/framework-concepts.md) for the operating context and [Config Field Reference](config-field-reference.md) for exact field meanings.
