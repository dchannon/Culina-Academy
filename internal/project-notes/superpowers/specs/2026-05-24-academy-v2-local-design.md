# Culina Academy v2 Local Design

## Goal

Upgrade Culina Academy into a deeper local-first training system with a richer learner workbook, separate local admin workbook, stronger content structure, and review-ready transcript workflow.

## Scope

This version stays static and local. It does not add a hosted backend, login, cloud sync, or central database.

The learner workbook remains `index.html`. The admin workbook is a separate `admin.html`. Content remains JSON-based in `content/`.

## Learner Experience

Learners import path JSON files, choose a path, complete lessons, complete scenario labs, take assessments, earn badges, and export a transcript.

New learner capabilities:

- path depth metadata: prerequisites, competencies, objectives, practice prompts, and remediation links
- scenario labs with evidence fields
- lesson notes and bookmarks stored locally
- searchable glossary and content library
- richer transcript export with assessments, lab evidence, notes, bookmarks, badges, and content versions

## Admin Experience

Admins open `admin.html`, import one or more learner transcript JSON files, review completion status locally, mark review outcomes, and export reports.

Admin capabilities:

- roster summary across imported transcripts
- learner detail view with paths, lessons, scores, badges, labs, and free-text evidence
- review state per learner: `needs_review`, `passed`, `needs_follow_up`
- reviewer notes stored locally
- CSV export for roster reporting
- JSON export for detailed local review records

## Content Model

Existing path JSON files are extended without breaking older fields.

New optional fields:

- `competencies`: array of competency definitions
- `glossary`: array of terms
- `labs`: array of scenario lab objects
- `track.labIds`: ordered labs assigned to a track
- `lesson.learningObjectives`
- `lesson.keyTerms`
- `lesson.practice`
- `lesson.remediation`
- `assessment.competencyCoverage`

Existing apps can ignore these fields. v2 displays and exports them.

## Local Storage

Learner workbook stores:

- imported content packages
- lesson completion
- assessment results
- lab evidence
- lesson notes
- bookmarks
- earned badges
- activity events

Admin workbook stores:

- imported transcript summaries
- review statuses
- reviewer notes
- imported-at timestamps

No storage leaves the browser unless the user exports JSON or CSV.

## Error Handling

Both workbooks validate imported JSON shape and show clear local errors. Unsupported content remains visible where possible instead of blocking the entire workbook.

Admin imports reject files that do not look like Culina transcript exports.

## Testing

Add Node tests for:

- content schema references
- transcript summarization
- CSV escaping
- admin review report generation

Run browser smoke tests for learner and admin pages from a local static server.

