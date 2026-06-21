# Framework Concepts

This page defines public-safe framework concepts.

## Metadata-Driven Operation

The framework uses approved configuration to describe intended behavior. Public users should think of metadata as structured instructions that help standardize how workflows are operated and supported.

This documentation does not expose internal metadata schema details.

## Control Surface

The control surface is the user-facing or support-facing area where workflow intent, status, and evidence can be reviewed. Public users should focus on what is visible and approved, not internal processing mechanics.

## Processing Flow

A Culina workflow normally moves through a controlled sequence from input handling to output availability. Exact internal stages vary by product configuration and are intentionally not documented here.

## Operational Evidence

Operational evidence is the information needed to understand what happened:

- workflow name
- run identifier
- timestamp
- visible status
- visible error message
- affected input or output
- user action before the issue

## Support Boundary

Users should collect evidence and escalate when the problem is not explained by visible configuration, expected input availability, or documented operating guidance.
