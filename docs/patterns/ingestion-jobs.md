# Ingestion Job Pattern

An ingestion job brings source data into the framework and prepares it for downstream processing.

## Purpose

Use an ingestion job when a source must be captured, retained, standardized, and staged before transformation.

## Required Decisions

- source system or file family
- input cadence
- source format
- landing location
- archive expectation
- standardization target
- staging target
- load strategy
- validation checks
- downstream dependency release point

## Standard Flow

```text
Source -> Landing -> Archive -> Delta -> Staging
```

## Pattern

1. Define the source.
2. Define the ingestion job.
3. Define expected input cadence and format.
4. Define landing and archive behavior.
5. Define standardization into Delta.
6. Define staging write behavior.
7. Add validation expectations.
8. Connect downstream dependencies.

## Common Load Strategies

- `full`: reload the source snapshot for each run.
- `incremental`: load records changed since the last accepted run.
- `append`: add new standardized records without rewriting prior staged data.

## Diagnostics

If ingestion fails, identify the layer:

- Source: input missing, permissions, format changed.
- Landing: file not captured or incomplete.
- Archive: retained copy missing.
- Delta: parsing or standardization issue.
- Staging: write, schema, duplicate, or required field issue.

See [customer_orders_ingestion_job.json](../../examples/config/sandbox-v2/customer_orders_ingestion_job.json).
