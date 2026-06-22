# Framework Overview

The Culina framework is a metadata-driven operating framework for repeatable data movement, transformation, orchestration, and operational support.

The framework is organized around three planes:

- **Control plane:** configuration and operational state that describe what work exists, how it is related, and what evidence is available.
- **Orchestration plane:** runtime coordination that turns approved control information into executable work.
- **Data plane:** storage and processing layers where source data is landed, standardized, transformed, persisted, and served.

## Why The Framework Exists

Data operations become difficult to operate when each workflow is built as a custom one-off process. Culina standardizes the shape of work so users can understand expected behavior, collect useful diagnostics, and support production runs consistently.

## How Users Should Think About It

A user does not need to know implementation code to understand the system. The important operating questions are:

- What workflow is configured?
- What source or input does it depend on?
- What downstream output should it produce?
- Which dependencies must be ready before it can run?
- Which layer is currently doing work?
- What evidence exists if the result is unexpected?

## Main Areas

- [What Is Culina?](what-is-culina.md)
- [Quickstart](quickstart.md)
- [Framework Architecture](../architecture/framework-architecture.md)
- [Control Plane Structure](../architecture/control-plane.md)
- [Orchestration Plane Layers](../architecture/orchestration-plane.md)
- [Data Layers](../architecture/data-layers.md)
- [Operating Guide](../operations/operating-guide.md)
