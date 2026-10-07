# Framework Concepts

## Definition, Instance, Evidence

A configured job defines intended work. A queue row represents one execution instance. Run history, failures, and validation records describe that instance.

Keep job, control batch, queue, source scope, and platform execution identifiers together when diagnosing. A source record's batch field can have different meaning from the control-plane batch.

## Planes And Responsibilities

The control plane stores deployed metadata and operational state. Orchestration selects dependency-ready work and owns finalization. Data execution consumes a bounded payload and returns evidence. [Framework Architecture](../architecture/framework-architecture.md) maps these concerns across six responsibilities.

## Workloads

Ingestion captures and standardizes source inputs. Transformation executes ordered modeled work and writes its target. Service jobs perform operational work such as HTTP requests, file operations, SQL tasks, exports, or token requests.

A service job has metadata, queue, dependency, retry, and evidence contracts. External notification delivery is a separate handoff.

## Portable References

`storage://<alias>/<path>` separates logical file access from physical storage roots. `secret://<name>` identifies a credential without its value or provider root. Universal packages may retain unresolved `${ENV.*}` tokens until deployment supplies environment values.

See [Configuration Examples](../configuration/config-examples.md) and [Current Examples](../../examples/current/README.md).

## Data And History

Landing, Archive, and Delta preserve and standardize intake. Staging retains Bronze history. INT is transient modeled work. EDW holds durable facts and dimensions. CONS serves views and tables.

Full/Delta extraction and append/upsert/SCD2 writes answer different questions. Delta extraction, the Delta layer, and Delta Lake format are distinct.

[History And Reporting](history-and-reporting.md) explains complete-state SCD2, Unknown/inferred members, managed append retries, and reporting grain.

## Operational Authority

A successful write or result artifact does not alone prove an accepted run. Orchestration combines execution and required validation evidence before recording status. Monitoring projections help explain that state; their documented authority determines which signal to trust.

Start with [Engine Diagnostics](../troubleshooting/engine-diagnostics.md) and [Diagnostic Queries](../troubleshooting/diagnostic-queries.md).
