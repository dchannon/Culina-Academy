# Support

Use these support paths:

- Work with Data Culina: [dataculina.com](https://dataculina.com/).
- Public documentation, example, and validation questions: [open a GitHub issue](https://github.com/dchannon/Culina-Academy/issues/new/choose).
- Environment-specific incidents: use the assigned Data Culina client support channel.
- Sensitive security concerns: use [private security reporting](https://github.com/dchannon/Culina-Academy/security/advisories/new) when available.

Start with the [Operations Hub](docs/operations/README.md), then the guide for your task:

- [Engine Diagnostics](docs/troubleshooting/engine-diagnostics.md)
- [Diagnostic Queries](docs/troubleshooting/diagnostic-queries.md)
- [Incident Walkthroughs](docs/troubleshooting/incident-walkthroughs.md)
- [Backfill And Recovery](docs/operations/backfill-and-recovery.md)
- [Support Model](docs/troubleshooting/support-model.md)
- [Support Handoff](docs/troubleshooting/support-handoff.md)

Include environment/platform/backend, deployed version, workflow, UUID job/queue/batch identities, workload run, UTC time, official state/retry timing, earliest blocker, sanitized error, required validation, and expected versus actual output. Record committed effects and attempted recovery; distinguish same-queue append recovery from new-queue replay, and notification handoff from final delivery.

Do not publish credentials, tokens, private keys, signed endpoints, sensitive customer data, or raw configuration/log bodies. Use approved private channels for necessary client-specific evidence. Historical sandbox fixtures and available platform artifacts do not establish live client qualification; check the [qualification table](docs/operations/operating-guide.md#platform-qualification).
