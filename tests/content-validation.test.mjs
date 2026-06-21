import test from 'node:test';
import assert from 'node:assert/strict';
import {
  loadContentPackages,
  validateContentDirectory,
  validateContentPackage,
} from '../scripts/validate-content.mjs';

test('loads bundled content packages', async () => {
  const packages = await loadContentPackages(new URL('../internal/workbook/content/', import.meta.url));

  assert.equal(packages.length, 3);
  assert.ok(packages.every(pkg => pkg.data.academy?.title));
});

test('validates references for every bundled content package', async () => {
  const result = await validateContentDirectory(new URL('../internal/workbook/content/', import.meta.url));

  assert.deepEqual(result.errors, []);
  assert.equal(result.packageCount, 3);
  assert.ok(result.lessonCount >= 30);
  assert.ok(result.questionCount >= 70);
});

test('bundled content packages include v2 depth fields', async () => {
  const packages = await loadContentPackages(new URL('../internal/workbook/content/', import.meta.url));

  for (const pkg of packages) {
    assert.ok(pkg.data.competencies?.length >= 4, `${pkg.file} missing competencies`);
    assert.ok(pkg.data.glossary?.length >= 5, `${pkg.file} missing glossary`);
    assert.ok(pkg.data.labs?.length >= 3, `${pkg.file} missing labs`);
    assert.ok(pkg.data.tracks.every(track => track.labIds?.length >= 3), `${pkg.file} missing track labs`);
    assert.ok(pkg.data.lessons.every(lesson => lesson.learningObjectives?.length >= 2), `${pkg.file} missing lesson objectives`);
    assert.ok(pkg.data.lessons.every(lesson => lesson.practice?.prompts?.length >= 2), `${pkg.file} missing practice prompts`);
  }
});

test('rejects missing track lesson references', () => {
  const errors = validateContentPackage({
    id: 'bad',
    academy: { title: 'Bad' },
    tracks: [{ id: 'track', title: 'Track', lessonIds: ['missing'], assessmentIds: [] }],
    lessons: [],
    assessments: [],
    badges: [],
  }, 'bad.json');

  assert.match(errors.join('\n'), /missing lesson/);
});

test('validates v2 labs and glossary entries', () => {
  const errors = validateContentPackage({
    id: 'v2',
    academy: { title: 'V2' },
    tracks: [{ id: 'track', title: 'Track', lessonIds: ['lesson'], assessmentIds: [], labIds: ['lab'] }],
    lessons: [{ id: 'lesson', title: 'Lesson' }],
    assessments: [],
    badges: [],
    labs: [{ id: 'lab', title: 'Lab', prompts: ['Explain.'] }],
    glossary: [{ term: 'Metadata', definition: 'Structured control data.' }],
  }, 'v2.json');

  assert.deepEqual(errors, []);
});
