# Quickstart: Trace A Workflow

Use this guide to understand one Culina workflow from configuration to operation in about 15 minutes.

## Goal

Trace `STG.JsonPlaceholder_Posts` through the sandbox metadata and see how a configured ingestion job becomes downstream modeled work.

## 1. Start With The Metadata Package

Open:

```text
examples/metadata/data-culina-sandbox-test-client/metadata.json
```

Confirm the package includes:

| Record type | Count |
| --- | ---: |
| Jobs | 24 |
| Linked services | 6 |
| Source details | 13 |
| Transformations | 11 |
| Dependencies | 15 |

## 2. Find The Job

Open:

```text
examples/metadata/data-culina-sandbox-test-client/jobs/job_000201_stg_jsonplaceholder_posts.json
```

Look for:

- `id`: the job identifier used by related records.
- `entityName`: the operational name users should recognize.
- `jobType`: whether this is ingestion, integration, EDW, or another job category.
- `isActive`: whether the job should participate in operation.
- retry fields: how the framework should behave after failure.

## 3. Follow The Source Detail

Open:

```text
examples/metadata/data-culina-sandbox-test-client/source-details/source_detail_000401_jsonplaceholder_posts.json
```

Confirm:

- `jobId` points back to the job.
- `linkedServiceConfigId` points to the source connection profile.
- `sourceSelectQuery` defines the REST path, parameters, flattening, and output columns.
- `deltaOrFull` explains whether the job is full-load or delta-style.
- `stagingTableName` shows the table downstream transformations should read.

## 4. Follow The Linked Service

Open:

```text
examples/metadata/data-culina-sandbox-test-client/linked-services/linked_service_000301_public_jsonplaceholder_rest.json
```

Check the endpoint, protocol, request options, and auth mode. In a client environment this record explains how the framework reaches the source.

## 5. Follow Downstream Dependencies

Open:

```text
examples/metadata/data-culina-sandbox-test-client/dependencies/dependency_000601_int_blog_post_engagement_stg_jsonplaceholder_posts.json
```

This dependency tells you `INT.Blog_Post_Engagement` should wait for the staging job before it runs.

## 6. Open The Transformation

Open:

```text
examples/metadata/data-culina-sandbox-test-client/transformations/transformation_000501_int_blog_post_engagement.json
```

Review:

- `parameters.sources`: source aliases and input tables.
- `parameters.target`: target database, table, keys, and write mode.
- `parameters.transformation.steps`: ordered transformation logic.
- validation flags such as duplicate-key and null-key checks.

## 7. Diagnose A Hypothetical Failure

If this workflow failed, start with this path:

```text
job_queue -> job_failure_log -> job_runhistory -> job -> source_detail -> linked_service -> dependency
```

Use the same job id and queue/run ids across records. Do not diagnose a downstream skipped row before checking the first failed upstream job.

## Result

You have traced one workflow through the control plane:

```text
client -> job -> linked_service -> source_detail -> dependency -> transformation -> runtime evidence
```

Next: read [Configuration Examples](../configuration/config-examples.md), then use the cookbooks under `docs/guides/`.
