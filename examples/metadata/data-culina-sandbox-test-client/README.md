# Data Culina Sandbox Test Client Metadata

This folder contains a complete sandbox metadata export for studying Culina control plane configuration.

## Contents

| Folder | Records |
| --- | --- |
| `client/` | Client scope record. |
| `jobs/` | Ingestion, INT, and EDW job records. |
| `linked-services/` | Public REST source connection definitions. |
| `source-details/` | Source read, flatten, delta, landing, and staging rules. |
| `transformations/` | Transformation controller records. |
| `dependencies/` | Upstream job dependency records. |

## Read Order

1. Start with `metadata.json` for counts and id registry.
2. Open `client/client.json` to see the client id.
3. Open a file under `jobs/`.
4. For ingestion jobs, follow `source-details/` to the matching `jobId`, then follow `linkedServiceConfigId` to `linked-services/`.
5. For transformation jobs, follow `transformations/` to the matching `jobId`.
6. Use `dependencies/` to understand which upstream jobs must complete before downstream work runs.

## Example Trace

`STG.JsonPlaceholder_Posts` starts as job `201`, reads `/posts` from the JSONPlaceholder linked service, flattens REST JSON into staging columns, and feeds `INT.Blog_Post_Engagement` through dependency `601`.

`INT.Blog_Post_Engagement` then reads staging posts, comments, and users; deduplicates inputs; aggregates comments; joins user context; adds system fields; computes a hash; and writes integration output for downstream EDW jobs.
