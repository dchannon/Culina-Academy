# Public Redaction Policy

Use this policy before adding or updating public Culina Academy content.

## Safe To Publish

- High-level framework purpose and user value.
- Public terminology.
- Conceptual separation of responsibilities.
- Common symptoms users may observe.
- Safe diagnostic questions.
- Evidence to collect before support escalation.
- General examples that do not reveal product internals.

## Do Not Publish

- Internal metadata schemas or field dictionaries.
- Exact orchestration algorithms, queue semantics, retry logic, or dependency evaluation mechanics.
- Deployment topology details, infrastructure templates, credentials, or environment conventions.
- Client-specific implementation patterns.
- Source code internals, stored procedure logic, engine package structure, or private APIs.
- AI scoring details or answer-key style certification material.
- Internal escalation paths, staffing model, SLAs, or operational playbooks.

## Rewrite Pattern

When content is too specific:

- Replace exact object names with general terms.
- Replace implementation steps with user-observable behavior.
- Replace internal procedures with evidence-gathering checklists.
- Replace product internals with support-safe explanations.

Example:

- Too specific: "Check table X and rerun controller Y."
- Public-safe: "Capture the run identifier, failing step, timestamp, and any visible error message before contacting support."

