# Framework Overview

The Culina framework helps teams operate data movement and transformation in a repeatable, governed way.

At a public level, the framework can be understood through three ideas:

- **Intent:** users define what needs to happen through approved configuration and documented decisions.
- **Execution:** the engine interprets approved configuration and runs standardized processing patterns.
- **Evidence:** users collect run information, visible statuses, and error details to support diagnosis.

## Why It Exists

Data operations often become hard to support when every workflow is implemented differently. The Culina framework reduces that problem by encouraging consistent configuration, repeatable patterns, and clearer operational evidence.

## What Users Should Know

Users do not need internal implementation details to get started. They should understand:

- what business outcome the workflow is meant to support
- which input or source is expected
- which output or target is expected
- where to find visible run status
- what evidence to collect when behavior is unexpected

## What Is Intentionally Not Included

This public academy does not publish internal schemas, orchestration internals, private APIs, deployment templates, or proprietary engine behavior.
