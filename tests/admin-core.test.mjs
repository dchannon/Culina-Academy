import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildReviewReport,
  buildRosterCsv,
  mergeReviewState,
  summarizeTranscript,
} from '../scripts/admin-core.mjs';

test('summarizeTranscript extracts learner readiness', () => {
  const summary = summarizeTranscript({
    exportedAt: '2026-05-24T00:00:00.000Z',
    learner: { name: 'Avery', email: 'avery@example.com' },
    academy: { title: 'Culina Academy' },
    progress: {
      completedLessons: { l1: true, l2: true },
      assessmentResults: {
        a1: {
          title: 'Foundation',
          scorePercent: 0.92,
          passed: true,
          questionResults: [{ type: 'free_text', scorePercent: 0.86, feedback: 'Strong' }],
        },
      },
      badges: { b1: { title: 'Foundation Certified' } },
      labEvidence: { lab1: { status: 'submitted', response: 'Evidence' } },
    },
  }, 'avery.json');

  assert.equal(summary.learnerName, 'Avery');
  assert.equal(summary.learnerEmail, 'avery@example.com');
  assert.equal(summary.assessmentsPassed, 1);
  assert.equal(summary.badgesEarned, 1);
  assert.equal(summary.labsSubmitted, 1);
  assert.equal(summary.freeTextResponses, 1);
  assert.equal(summary.recommendedStatus, 'needs_review');
});

test('buildRosterCsv escapes commas and quotes', () => {
  const csv = buildRosterCsv([
    {
      transcriptId: 'abc',
      learnerName: 'Avery, "Q"',
      learnerEmail: 'a@example.com',
      exportedAt: '2026-05-24T00:00:00.000Z',
      assessmentsPassed: 1,
      assessmentCount: 1,
      badgesEarned: 1,
      labsSubmitted: 2,
      reviewStatus: 'passed',
    },
  ]);

  assert.match(csv, /"Avery, ""Q"""/);
  assert.match(csv, /passed/);
});

test('buildReviewReport includes reviewer state', () => {
  const report = buildReviewReport([
    { transcriptId: 'abc', learnerName: 'Avery', learnerEmail: 'a@example.com' },
  ], {
    abc: { status: 'passed', notes: 'Ready' },
  });

  assert.equal(report.records[0].review.status, 'passed');
  assert.equal(report.records[0].review.notes, 'Ready');
});

test('mergeReviewState applies default status without losing notes', () => {
  const merged = mergeReviewState(
    { transcriptId: 'abc', recommendedStatus: 'needs_review' },
    { abc: { notes: 'Needs capstone check' } },
  );

  assert.equal(merged.reviewStatus, 'needs_review');
  assert.equal(merged.reviewNotes, 'Needs capstone check');
});
