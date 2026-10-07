# Architecture Guide

Read the system from approved intent to observable output.

| Order | Guide | Question |
| ---: | --- | --- |
| 1 | [Framework Architecture](framework-architecture.md) | Who owns configuration, coordination, execution, support, and delivery? |
| 2 | [Control Plane Structure](control-plane.md) | Where are definitions and execution instances stored? |
| 3 | [Control Plane Schema](control-plane-schema.md) | Which tables and views explain a run? |
| 4 | [Orchestration Plane](orchestration-plane.md) | Why can a queued job run, wait, retry, or be skipped? |
| 5 | [Data Layers](data-layers.md) | Where is data captured, rebuilt, historized, or served? |
| 6 | [History And Reporting](../concepts/history-and-reporting.md) | How do history, late arrivals, and BI perspectives interact? |
| 7 | [Platforms](../platforms/README.md) | How do these responsibilities map to your environment? |

For a concrete trace, use the [Quickstart](../getting-started/quickstart.md). For implementation shapes, use the [Configuration Guide](../configuration/README.md). Return to the [Documentation Index](../README.md) for operating guides.
