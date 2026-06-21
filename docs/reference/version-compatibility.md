# Version Compatibility

This repo documents the public framework concepts and metadata patterns used by the Culina framework.

| Material | Current version | Notes |
| --- | --- | --- |
| Culina Academy docs | 2.1.0 | Public documentation and examples. |
| Sandbox metadata export | 2.2.0 | See `examples/metadata/data-culina-sandbox-test-client/metadata.json`. |
| V2 config examples | `culina.framework.config.v2.example` | See `examples/config/sandbox-v2/`. |
| Workbook exercises | Level 1 | Optional local practice materials. |

## Compatibility Notes

- Public docs describe logical framework behavior and are intended to remain stable across implementation environments.
- Example metadata is for learning and reference. Client environments may use different ids, names, sources, tables, and schedules.
- Config examples show the shape of ingestion, transformation, dependency, and validation records. They should be adapted before use in a real environment.
- Runtime behavior should always be interpreted with the version and deployment context visible in the client environment.
