# Culina Academy

Public learning materials for the Data Culina framework.

This repository is intended for clients, implementation partners, and users who want to understand the framework at a practical level. It explains the operating model, safe concepts, common user workflows, and troubleshooting steps without exposing proprietary product internals.

## Start Here

- [Framework Overview](docs/getting-started/framework-overview.md)
- [Getting Started Guide](docs/getting-started/user-guide.md)
- [Public Concepts](docs/concepts/framework-concepts.md)
- [Troubleshooting Guide](docs/troubleshooting/engine-diagnostics.md)
- [Support Handoff Checklist](docs/troubleshooting/support-handoff.md)

## What This Repo Covers

- What the Culina framework is designed to help with.
- How users should think about metadata-driven operations at a high level.
- What evidence to collect when an engine run does not behave as expected.
- How to describe issues clearly before contacting Data Culina support.
- Safe terminology for public conversations.

## What This Repo Does Not Cover

This repository intentionally avoids internal implementation details, proprietary metadata schemas, orchestration mechanics, deployment templates, private APIs, and internal support runbooks.

See [Public Redaction Policy](docs/redaction-policy.md) for the content boundary.

## Local Reading

You can read the Markdown files directly in GitHub. You can also open `index.html` locally for a lightweight public landing page:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Validation

Maintainers can run:

```powershell
npm test
npm run validate:content
```
