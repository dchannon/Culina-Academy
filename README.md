# Culina Academy

Local training workbook for new Culina team members.

The repo contains a single-browser HTML app plus the current learning path JSON modules. Learners download the repo, open the app locally, import the path files, complete the training, export the transcript, and send a completion note.

## Files

- `index.html` - Culina Academy workbook app.
- `content/culina_academy_path_01_common_foundation_v1_0.json` - Common Foundation path.
- `content/culina_academy_path_02_managed_service_level_1_v1_0.json` - Managed Service Level 1 path.
- `content/culina_academy_path_03_implementation_service_level_1_v1_0.json` - Implementation Service Level 1 path.
- `docs/completion-note-template.md` - short note template for finished learners.

## Learner Setup

1. Download this repo as a ZIP from GitHub.
2. Extract the ZIP to a local folder.
3. Open `index.html` in Chrome or Edge.
4. Select `Import Track JSON`.
5. Choose one or more files from the `content` folder. You can select all three path files at once.
6. Select a learning path and complete the lessons and assessment.
7. Use `Export Transcript` when training is complete.
8. Send the downloaded transcript JSON with a short completion note.

## Notes

- Progress is stored in the local browser. Use the same browser and computer while training.
- Multiple-choice and multi-select scoring run fully in the browser.
- Free-text semantic scoring needs internet access when `Prepare Semantic Scoring` is used.
- The transcript export is a JSON file named like `culina_academy_transcript_YYYY-MM-DD.json`.

## Local Server Option

Opening `index.html` directly is enough for normal use. If a browser blocks local module behavior, run a small static server from this folder:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.
