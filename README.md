<p align="center">
  <img src="assets/academy_readme_banner.svg" alt="Data Culina Academy public framework documentation" width="100%">
</p>

# Culina Academy

Public operating documentation for the Data Culina framework.

This repository is for clients, implementation partners, and users who need to understand what is running in their environment, how the framework is organized, and how to diagnose issues when the engine reports unexpected behavior.

<p>
  <a href="docs/getting-started/framework-overview.md"><strong>Start with the framework overview</strong></a>
  &nbsp;|&nbsp;
  <a href="#local-reading"><strong>Run the local academy home</strong></a>
  &nbsp;|&nbsp;
  <a href="docs/troubleshooting/engine-diagnostics.md"><strong>Diagnose engine behavior</strong></a>
</p>

## Use This Repo

| Learn the framework | Configure work | Operate and diagnose |
| --- | --- | --- |
| [Framework Overview](docs/getting-started/framework-overview.md)<br>[Control Plane Structure](docs/architecture/control-plane.md)<br>[Control Plane Schema](docs/architecture/control-plane-schema.md)<br>[Orchestration Plane Layers](docs/architecture/orchestration-plane.md)<br>[Data Layers](docs/architecture/data-layers.md) | [Configuration Examples](docs/configuration/config-examples.md)<br>[Sandbox Client Metadata Example](docs/configuration/sandbox-client-example.md)<br>[Ingestion Job Pattern](docs/patterns/ingestion-jobs.md)<br>[Transformation Job Pattern](docs/patterns/transformation-jobs.md) | [Operating Guide](docs/operations/operating-guide.md)<br>[Backfill And Recovery](docs/operations/backfill-and-recovery.md)<br>[Engine Diagnostics](docs/troubleshooting/engine-diagnostics.md)<br>[Support Handoff Checklist](docs/troubleshooting/support-handoff.md) |

## Document Map

- [Framework Overview](docs/getting-started/framework-overview.md)
- [Control Plane Structure](docs/architecture/control-plane.md)
- [Control Plane Schema](docs/architecture/control-plane-schema.md)
- [Orchestration Plane Layers](docs/architecture/orchestration-plane.md)
- [Data Layers](docs/architecture/data-layers.md)
- [Configuration Examples](docs/configuration/config-examples.md)
- [Sandbox Client Metadata Example](docs/configuration/sandbox-client-example.md)
- [Ingestion Job Pattern](docs/patterns/ingestion-jobs.md)
- [Transformation Job Pattern](docs/patterns/transformation-jobs.md)
- [Operating Guide](docs/operations/operating-guide.md)
- [Backfill And Recovery](docs/operations/backfill-and-recovery.md)
- [Engine Diagnostics](docs/troubleshooting/engine-diagnostics.md)
- [Support Handoff Checklist](docs/troubleshooting/support-handoff.md)

## Repository Scope

This repo documents the public framework structure and day-to-day operating model:

- control plane concepts and responsibilities
- high-level orchestration plane layers
- data processing layers used by the framework
- sandbox-style V2 configuration examples
- full sandbox client metadata examples
- ingestion and transformation job patterns
- operating and diagnostic workflows
- common terminology
- support handoff expectations

The docs focus on framework operation, configuration structure, and supportability. Package source code and consulting methodology are maintained separately.

## Local Reading

You can read the Markdown files directly in GitHub. You can also open `index.html` locally for a lightweight documentation landing page:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Maintainer Validation

```powershell
npm test
npm run validate:content
```
