# Culina Academy

Public operating documentation for the Data Culina framework.

This repository is for clients, implementation partners, and users who need to understand what is running in their environment, how the framework is organized, and how to diagnose issues when the engine reports unexpected behavior.

## Start Here

- [Framework Overview](docs/getting-started/framework-overview.md)
- [Control Plane Structure](docs/architecture/control-plane.md)
- [Orchestration Plane Layers](docs/architecture/orchestration-plane.md)
- [Data Layers](docs/architecture/data-layers.md)
- [Configuration Examples](docs/configuration/config-examples.md)
- [Ingestion Job Pattern](docs/patterns/ingestion-jobs.md)
- [Transformation Job Pattern](docs/patterns/transformation-jobs.md)
- [Operating Guide](docs/operations/operating-guide.md)
- [Engine Diagnostics](docs/troubleshooting/engine-diagnostics.md)
- [Support Handoff Checklist](docs/troubleshooting/support-handoff.md)

## Repository Scope

This repo documents the public framework structure and day-to-day operating model:

- control plane concepts and responsibilities
- high-level orchestration plane layers
- data processing layers used by the framework
- sandbox-style V2 configuration examples
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
