# Culina Academy Workbook Exercises

Optional local exercises for users who want to confirm their learning after reading the public docs.

The workbook runs locally in the browser. Progress stays in local browser storage until the user exports a transcript.

## Learner Exercise

1. From the repo root, start a local static server:

```powershell
python -m http.server 8000
```

2. Open the learner workbook:

```text
http://localhost:8000/workbook/learner.html
```

3. Select `Import Track JSON`.
4. Choose one or more files from `workbook/content/`.
5. Enter your name and email in the Learner card.
6. Select a learning path.
7. Complete the lessons, labs, and assessment.
8. Use notes, bookmarks, search, and glossary as needed.
9. Select `Export Transcript` when complete.
10. Send the transcript JSON to the person coordinating the exercise.

## Admin Review Workbook

1. Open:

```text
http://localhost:8000/workbook/admin.html
```

2. Select `Import Transcripts`.
3. Choose one or more learner transcript JSON files.
4. Review scores, badges, lab evidence, and free-text responses.
5. Set review status:

- `needs_review`
- `passed`
- `needs_follow_up`

6. Add reviewer notes.
7. Export roster CSV or review JSON.

## Notes

- Use the same browser and computer while doing the learner exercise.
- Free-text scoring requires internet access when preparing semantic scoring.
- The workbook is secondary to the public docs. It is intended for practice and review, not as the primary repository entry point.
