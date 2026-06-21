# Public Academy Restructure Spec

## Goal

Repurpose Culina Academy from an internal onboarding workbook into a public-facing framework learning and support repository. The repository should be suitable to link from the Data Culina landing page.

## Audience

- Clients evaluating or using the Culina framework.
- Normal users trying to understand framework concepts.
- Engine users diagnosing common operational issues.
- Internal team members who still need optional workbook exercises.

## Repository Shape

Public-facing material should be the default surface:

- `README.md` introduces the public academy.
- `index.html` provides a lightweight public landing page for the repo.
- `docs/` contains public framework guidance, getting-started material, and troubleshooting.
- `internal/` contains optional workbook/admin materials and is not linked from the public docs.

## Redaction Boundary

Public docs may explain concepts, user workflows, evidence gathering, and support diagnosis. Public docs must not expose proprietary implementation details, internal metadata schemas, orchestration mechanics, scoring internals, deployment templates, client delivery playbooks, or support runbooks that describe exact product behavior.

## Public Content Requirements

Public docs should contain:

- framework overview
- getting-started path
- safe concept explanations
- user-facing troubleshooting checklist
- support handoff checklist
- glossary of public terms
- explicit note that details are intentionally high-level

## Internal Material Handling

The local workbook remains available for controlled internal or guided exercises, but it is moved under `internal/workbook/` and is not linked from the public README, public index, or public docs.

## Validation

Existing workbook validation should still run against the internal workbook content. Public docs are plain Markdown and HTML with no build step.

