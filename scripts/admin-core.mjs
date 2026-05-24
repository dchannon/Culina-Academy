export const REVIEW_STATUSES = ['needs_review', 'passed', 'needs_follow_up'];

export function summarizeTranscript(payload, fileName = 'transcript.json') {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Transcript must be a JSON object.');
  }
  if (!payload.progress || typeof payload.progress !== 'object') {
    throw new Error('Transcript must include progress.');
  }

  const progress = payload.progress;
  const assessments = Object.values(progress.assessmentResults || {});
  const badges = Object.values(progress.badges || {});
  const labs = Object.values(progress.labEvidence || {});
  const completedLessons = Object.values(progress.completedLessons || {}).filter(Boolean);
  const freeTextResponses = assessments.reduce((count, assessment) => {
    return count + Object.values(assessment.questionResults || {}).filter(result => result?.type === 'free_text').length;
  }, 0);
  const assessmentsPassed = assessments.filter(result => result?.passed).length;
  const labsSubmitted = labs.filter(lab => {
    const status = String(lab?.status || '').toLowerCase();
    return status === 'submitted' || Boolean(String(lab?.response || '').trim());
  }).length;

  return {
    transcriptId: makeTranscriptId(payload, fileName),
    fileName,
    exportedAt: payload.exportedAt || '',
    learnerName: payload.learner?.name || payload.learnerName || 'Unknown learner',
    learnerEmail: payload.learner?.email || payload.learnerEmail || '',
    academyTitle: payload.academy?.title || payload.academy?.name || 'Culina Academy',
    libraryId: payload.libraryId || '',
    lessonCount: completedLessons.length,
    assessmentCount: assessments.length,
    assessmentsPassed,
    badgesEarned: badges.length,
    labsSubmitted,
    freeTextResponses,
    assessments,
    badges,
    labEvidence: progress.labEvidence || {},
    notes: progress.notes || {},
    bookmarks: progress.bookmarks || {},
    sources: payload.sources || [],
    recommendedStatus: recommendStatus({ assessments, assessmentsPassed, labsSubmitted, freeTextResponses }),
    raw: payload,
  };
}

export function mergeReviewState(summary, reviewState = {}) {
  const saved = reviewState[summary.transcriptId] || {};
  const status = REVIEW_STATUSES.includes(saved.status) ? saved.status : summary.recommendedStatus;
  return {
    ...summary,
    reviewStatus: status,
    reviewNotes: saved.notes || '',
    reviewedAt: saved.reviewedAt || '',
  };
}

export function buildRosterCsv(records) {
  const headers = [
    'Learner',
    'Email',
    'Exported At',
    'Review Status',
    'Assessments Passed',
    'Assessment Count',
    'Badges Earned',
    'Labs Submitted',
    'Transcript ID',
  ];
  const rows = records.map(record => [
    record.learnerName,
    record.learnerEmail,
    record.exportedAt,
    record.reviewStatus || record.recommendedStatus || '',
    record.assessmentsPassed,
    record.assessmentCount,
    record.badgesEarned,
    record.labsSubmitted,
    record.transcriptId,
  ]);
  return [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\n');
}

export function buildReviewReport(records, reviewState = {}) {
  return {
    reportType: 'culina_academy_admin_review',
    exportedAt: new Date().toISOString(),
    recordCount: records.length,
    records: records.map(record => {
      const review = reviewState[record.transcriptId] || {};
      return {
        ...withoutRaw(record),
        review: {
          status: REVIEW_STATUSES.includes(review.status) ? review.status : (record.reviewStatus || record.recommendedStatus || 'needs_review'),
          notes: review.notes || record.reviewNotes || '',
          reviewedAt: review.reviewedAt || record.reviewedAt || '',
        },
      };
    }),
  };
}

export function csvCell(value) {
  const text = value == null ? '' : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function makeTranscriptId(payload, fileName = '') {
  const learner = payload.learner?.email || payload.learner?.name || payload.learnerEmail || payload.learnerName || '';
  return `tx_${hashString(`${fileName}|${payload.exportedAt || ''}|${payload.libraryId || ''}|${learner}`)}`;
}

function recommendStatus({ assessments, assessmentsPassed, labsSubmitted, freeTextResponses }) {
  if (labsSubmitted > 0 || freeTextResponses > 0) return 'needs_review';
  if (assessments.length > 0 && assessmentsPassed === assessments.length) return 'passed';
  return 'needs_follow_up';
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function withoutRaw(record) {
  const { raw, ...rest } = record;
  return rest;
}
