# Sandbox Client Metadata Example

The `examples/metadata/data-culina-sandbox-test-client/` folder contains a complete sandbox client metadata export. It shows how Culina control records fit together across ingestion, transformation, and dependency configuration.

## What Is Included

| Folder | Contents | Why it matters |
| --- | --- | --- |
| `metadata.json` | Export version, checksum summary, entity counts, and id registry. | Confirms the package shape and expected record counts. |
| `client/client.json` | Client scope record. | Establishes the `clientId` used by jobs and linked services. |
| `jobs/` | Ingestion, INT, and EDW job definitions. | Defines the units of work the framework can queue and operate. |
| `linked-services/` | Public REST source endpoint definitions. | Defines source connection shape and request options. |
| `source-details/` | Source-specific read, flatten, delta, and staging rules. | Defines how source payloads become staging tables. |
| `transformations/` | Transformation controller configuration. | Defines how staging tables are read, shaped, joined, validated, and written. |
| `dependencies/` | Upstream job dependencies. | Defines execution order and downstream impact behavior. |

## Source Coverage

The sandbox uses public API sources so configuration can be studied without environment-specific infrastructure:

- JSONPlaceholder posts, comments, users, albums, photos, and todos.
- USGS earthquake events.
- OpenBreweryDB brewery records.
- RestCountries country profiles.
- GitHub public commit metadata.
- StackExchange question metadata.

The set includes both full-load and delta-style examples. Full-load source details use `deltaOrFull: "FULL"`. Delta-style examples use delta parameters such as `ParamName` and fallback watermarks to demonstrate incremental request construction.

## How The Example Operates

The operating pattern is metadata-driven:

1. A `job` record defines work such as `STG.JsonPlaceholder_Posts` or `INT.Blog_Post_Engagement`.
2. An ingestion job connects to a `linked_service`.
3. Its `source_detail` defines the API path, parameters, flattening rules, output columns, file extension, and staging table.
4. A transformation job uses a `transformation` record to read one or more staging tables.
5. The transformation `parameters` JSON defines source aliases, filters, business keys, steps, target table, and write mode.
6. `dependency` records ensure modeled jobs wait for required upstream staging or integration jobs.
7. Runtime queue and history records then show which configured jobs were planned, dispatched, retried, completed, skipped, or failed.

## Worked Trace

`STG.JsonPlaceholder_Posts` demonstrates a basic ingestion shape:

- `jobs/job_000201_stg_jsonplaceholder_posts.json` defines the ingestion job.
- `linked-services/linked_service_000301_public_jsonplaceholder_rest.json` defines the public REST endpoint.
- `source-details/source_detail_000401_jsonplaceholder_posts.json` defines the `/posts` path and flattening columns.
- `dependencies/dependency_000601_int_blog_post_engagement_stg_jsonplaceholder_posts.json` makes `INT.Blog_Post_Engagement` depend on the staging job.
- `transformations/transformation_000501_int_blog_post_engagement.json` reads posts, comments, and users, deduplicates source rows, aggregates comment counts, joins user context, adds system fields, computes a hash, and writes `INT.Blog_Post_Engagement`.

The dependency then continues into EDW examples such as `EDW.Dim_Blog_Post`, which shows how modeled downstream jobs can depend on integration output.

## Transformation Step Types Shown

The sandbox transformations show common controller operations:

- `read_source`
- `deduplicate`
- `aggregate`
- `select`
- `join`
- `add_system_fields`
- `compute_hash`
- `write_target`

These step names are useful for diagnosis because they map business-level configuration to step-level run history and failure evidence.

## Review Checklist

When using these examples as a reference for a new job, verify:

- the `jobType` matches the work being configured
- the `entityName` uses the intended layer prefix, such as `STG`, `INT`, or `EDW`
- retry settings match the operational risk of the source or transformation
- source details contain the correct source path, parameters, flattening fields, and data types
- delta jobs define a clear watermark or delta parameter strategy
- transformation sources point to existing upstream tables
- business keys are explicit
- filters are clear and support recoverability
- write mode matches the target table behavior
- dependencies point from downstream work to required upstream work
