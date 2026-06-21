# Cookbook: Dependencies And Validation

Dependencies and validation make workflow behavior explainable. Use this guide before operating new metadata.

## Dependency Pattern

A dependency record says a downstream job must wait for an upstream job.

| Field | Meaning |
| --- | --- |
| `jobId` | Downstream job that should wait. |
| `dependentJobId` | Upstream job that must complete first. |

## Example

If `INT.Blog_Post_Engagement` reads posts, comments, and users from staging, it needs dependencies on all three staging jobs. If any upstream job fails, the integration job should wait or skip rather than produce incomplete output.

Reference files:

- `examples/metadata/data-culina-sandbox-test-client/dependencies/dependency_000601_int_blog_post_engagement_stg_jsonplaceholder_posts.json`
- `examples/metadata/data-culina-sandbox-test-client/dependencies/dependency_000602_int_blog_post_engagement_stg_jsonplaceholder_comments.json`
- `examples/metadata/data-culina-sandbox-test-client/dependencies/dependency_000603_int_blog_post_engagement_stg_jsonplaceholder_users.json`

## Validation Pattern

Validation expectations should match the risk of the job.

| Check | Use when |
| --- | --- |
| Input availability | A source can be missing or late. |
| Row count | Volume changes indicate source or filter issues. |
| Required fields | Nulls break keys, joins, or reporting. |
| Duplicate keys | Target grain must be unique. |
| Join coverage | Lookups or reference mappings can miss. |
| Output availability | Users depend on a serving table, file, or report. |

## Review Questions

- Are all required upstream jobs represented?
- Does the dependency chain explain expected `PENDING` or `SKIPPED` behavior?
- Are validation failures treated as real failures?
- Is validation evidence captured for support handoff?
- Does recovery guidance explain whether to rerun, replay, backfill, or rebuild?
