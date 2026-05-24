# Culina Academy

Local training and review workbooks for new Culina team members.

The repo contains a learner workbook, a separate admin workbook, and the current learning path JSON modules. Learners complete training locally and export a transcript. Admins import transcript exports locally, review evidence, and export roster/review reports.

## Files

- `index.html` - learner workbook app.
- `admin.html` - local admin review workbook.
- `content/culina_academy_path_01_common_foundation_v1_0.json` - Common Foundation path.
- `content/culina_academy_path_02_managed_service_level_1_v1_0.json` - Managed Service Level 1 path.
- `content/culina_academy_path_03_implementation_service_level_1_v1_0.json` - Implementation Service Level 1 path.
- `docs/completion-note-template.md` - short note template for finished learners.
- `scripts/` - local validation and admin review helpers.
- `tests/` - Node tests for content and admin review logic.

## Learner Setup

1. Download this repo as a ZIP from GitHub.
2. Extract the ZIP to a local folder.
3. Open `index.html` in Chrome or Edge, preferably through the local server option below.
4. Select `Import Track JSON`.
5. Choose one or more files from the `content` folder. You can select all three path files at once.
6. Add your name and email in the Learner card.
7. Select a learning path and complete the lessons, labs, and assessment.
8. Use lesson notes, bookmarks, search, and glossary as needed.
9. Use `Export Transcript` when training is complete.
10. Send the downloaded transcript JSON with a short completion note.

## Admin Workflow

1. Open `admin.html` through the local server option below.
2. Select `Import Transcripts`.
3. Choose one or more learner transcript JSON exports.
4. Review each learner's scores, badges, labs, and free-text evidence.
5. Set the review status to `needs_review`, `passed`, or `needs_follow_up`.
6. Add reviewer notes.
7. Export `Roster CSV` for status tracking or `Review JSON` for detailed archival.

## Notes

- Learner progress is stored in the local browser. Use the same browser and computer while training.
- Admin review notes are stored in the admin browser until exported or cleared.
- Multiple-choice and multi-select scoring run fully in the browser.
- Free-text semantic scoring needs internet access when `Prepare Semantic Scoring` is used.
- The transcript export is a JSON file named like `culina_academy_transcript_YYYY-MM-DD.json`.
- Scenario labs are included in transcript exports for admin review.

## Local Server Option

Run a small static server from this folder for the best local experience:

```powershell
python -m http.server 8000
```

Then open:

- learner workbook: `http://localhost:8000`
- admin workbook: `http://localhost:8000/admin.html`

## Validation

Run local tests and content validation:

```powershell
npm test
npm run validate:content
```
