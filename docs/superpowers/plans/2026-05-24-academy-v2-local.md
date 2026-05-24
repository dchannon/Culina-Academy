# Academy v2 Local Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first Culina Academy v2 with a richer learner workbook, separate local admin workbook, deeper content packs, and review-ready exports.

**Architecture:** Keep the app static. Extend `index.html` for learner depth and add `admin.html` for local transcript review. Add small tested ES modules under `scripts/` for admin review and content validation.

**Tech Stack:** Static HTML/CSS/JavaScript, browser localStorage, JSON content packs, Node built-in test runner.

---

### Task 1: Test Admin Review Core

**Files:**
- Create: `scripts/admin-core.mjs`
- Create: `tests/admin-core.test.mjs`

- [ ] **Step 1: Write failing tests**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  summarizeTranscript,
  buildRosterCsv,
  buildReviewReport
} from '../scripts/admin-core.mjs';

test('summarizeTranscript extracts learner readiness', () => {
  const summary = summarizeTranscript({
    exportedAt: '2026-05-24T00:00:00.000Z',
    learner: { name: 'Avery', email: 'avery@example.com' },
    academy: { title: 'Culina Academy' },
    progress: {
      completedLessons: { l1: true, l2: true },
      assessmentResults: {
        a1: { title: 'Foundation', scorePercent: 0.92, passed: true, questionResults: [] }
      },
      badges: { b1: { title: 'Foundation Certified' } },
      labEvidence: { lab1: { status: 'submitted', response: 'Evidence' } }
    }
  }, 'avery.json');

  assert.equal(summary.learnerName, 'Avery');
  assert.equal(summary.assessmentsPassed, 1);
  assert.equal(summary.badgesEarned, 1);
  assert.equal(summary.labsSubmitted, 1);
  assert.equal(summary.recommendedStatus, 'needs_review');
});

test('buildRosterCsv escapes commas and quotes', () => {
  const csv = buildRosterCsv([
    { learnerName: 'Avery, Q', learnerEmail: 'a@example.com', assessmentsPassed: 1, assessmentCount: 1, badgesEarned: 1, labsSubmitted: 2, reviewStatus: 'passed' }
  ]);

  assert.match(csv, /"Avery, Q"/);
  assert.match(csv, /passed/);
});

test('buildReviewReport includes reviewer state', () => {
  const report = buildReviewReport([
    { transcriptId: 'abc', learnerName: 'Avery', learnerEmail: 'a@example.com' }
  ], {
    abc: { status: 'passed', notes: 'Ready' }
  });

  assert.equal(report.records[0].review.status, 'passed');
  assert.equal(report.records[0].review.notes, 'Ready');
});
```

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- tests/admin-core.test.mjs`

Expected: fail because `scripts/admin-core.mjs` does not exist.

- [ ] **Step 3: Implement admin review core**

Create pure functions: transcript ID generation, summary extraction, CSV escaping, review report building.

- [ ] **Step 4: Verify tests pass**

Run: `npm test -- tests/admin-core.test.mjs`

Expected: 3 passing tests.

### Task 2: Test Content Validation

**Files:**
- Create: `scripts/validate-content.mjs`
- Create: `tests/content-validation.test.mjs`

- [ ] **Step 1: Write failing tests**

Tests assert all JSON packs parse, track references resolve, labs referenced by tracks exist, and glossary entries have terms.

- [ ] **Step 2: Verify tests fail**

Run: `npm test -- tests/content-validation.test.mjs`

Expected: fail because validator module does not exist.

- [ ] **Step 3: Implement validator**

Create `loadContentPackages`, `validateContentPackage`, and `validateContentDirectory`.

- [ ] **Step 4: Verify tests pass**

Run: `npm test -- tests/content-validation.test.mjs`

Expected: content validation passes.

### Task 3: Enrich Content Packs

**Files:**
- Modify: `content/*.json`

- [ ] **Step 1: Add depth fields**

Add `competencies`, `glossary`, `labs`, `track.labIds`, `lesson.learningObjectives`, `lesson.keyTerms`, `lesson.practice`, and `lesson.remediation`.

- [ ] **Step 2: Validate content**

Run: `npm test -- tests/content-validation.test.mjs`

Expected: content validation passes.

### Task 4: Upgrade Learner Workbook

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add learner metadata and study state**

Add learner name/email fields, notes, bookmarks, and lab evidence to exported transcript.

- [ ] **Step 2: Add richer pages**

Add Labs and Study Tools navigation, lesson objectives/key terms/practice blocks, glossary/search, and lab evidence forms.

- [ ] **Step 3: Browser smoke test**

Run local server and verify learner page loads, imports content, shows labs/tools, and exports transcript.

### Task 5: Build Admin Workbook

**Files:**
- Create: `admin.html`
- Use: `scripts/admin-core.mjs`

- [ ] **Step 1: Add import/review/export UI**

Admin imports transcript JSON files, sees roster and detail, marks statuses, stores reviewer notes, exports CSV and JSON.

- [ ] **Step 2: Browser smoke test**

Run local server and verify admin page loads, imports a transcript, changes review status, and exports reports.

### Task 6: Docs and Final Verification

**Files:**
- Modify: `README.md`
- Modify: `docs/completion-note-template.md`

- [ ] **Step 1: Document v2 workflows**

Add learner workflow, admin workflow, local server instructions, transcript/review handoff.

- [ ] **Step 2: Run full checks**

Run:

```powershell
npm test
python -m http.server 8765 --bind 127.0.0.1
```

Expected: tests pass and both pages smoke-test with zero console errors.

