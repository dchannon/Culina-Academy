import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export async function loadContentPackages(contentDir) {
  const dirPath = toPath(contentDir);
  const files = (await readdir(dirPath)).filter(file => file.toLowerCase().endsWith('.json')).sort();
  const packages = [];
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    packages.push({
      file,
      data: JSON.parse(await readFile(fullPath, 'utf8')),
    });
  }
  return packages;
}

export async function validateContentDirectory(contentDir) {
  const packages = await loadContentPackages(contentDir);
  const errors = [];
  let lessonCount = 0;
  let questionCount = 0;
  for (const pkg of packages) {
    errors.push(...validateContentPackage(pkg.data, pkg.file));
    lessonCount += (pkg.data.lessons || []).length;
    questionCount += (pkg.data.assessments || []).reduce((sum, assessment) => sum + (assessment.questions || []).length, 0);
  }
  return {
    packageCount: packages.length,
    lessonCount,
    questionCount,
    errors,
  };
}

export function validateContentPackage(data, fileName = 'content.json') {
  const errors = [];
  if (!data || typeof data !== 'object') return [`${fileName}: package must be an object.`];

  const tracks = arrayOrEmpty(data.tracks);
  const lessons = arrayOrEmpty(data.lessons);
  const assessments = arrayOrEmpty(data.assessments);
  const badges = arrayOrEmpty(data.badges);
  const labs = arrayOrEmpty(data.labs);
  const glossary = arrayOrEmpty(data.glossary);

  if (!tracks.length) errors.push(`${fileName}: package must include at least one track.`);
  if (!Array.isArray(data.lessons)) errors.push(`${fileName}: package must include lessons array.`);
  if (!Array.isArray(data.assessments)) errors.push(`${fileName}: package must include assessments array.`);

  const lessonIds = new Set(lessons.map(item => item.id).filter(Boolean));
  const assessmentIds = new Set(assessments.map(item => item.id).filter(Boolean));
  const badgeIds = new Set(badges.map(item => item.id).filter(Boolean));
  const labIds = new Set(labs.map(item => item.id).filter(Boolean));

  for (const track of tracks) {
    if (!track.id || !track.title) errors.push(`${fileName}: each track must include id and title.`);
    for (const lessonId of arrayOrEmpty(track.lessonIds)) {
      if (!lessonIds.has(lessonId)) errors.push(`${fileName}: track ${track.id} references missing lesson ${lessonId}.`);
    }
    for (const assessmentId of arrayOrEmpty(track.assessmentIds)) {
      if (!assessmentIds.has(assessmentId)) errors.push(`${fileName}: track ${track.id} references missing assessment ${assessmentId}.`);
    }
    for (const badgeId of arrayOrEmpty(track.badgeIds)) {
      if (!badgeIds.has(badgeId)) errors.push(`${fileName}: track ${track.id} references missing badge ${badgeId}.`);
    }
    for (const labId of arrayOrEmpty(track.labIds)) {
      if (!labIds.has(labId)) errors.push(`${fileName}: track ${track.id} references missing lab ${labId}.`);
    }
  }

  for (const lesson of lessons) {
    if (!lesson.id || !lesson.title) errors.push(`${fileName}: each lesson must include id and title.`);
    if (lesson.learningObjectives && !Array.isArray(lesson.learningObjectives)) errors.push(`${fileName}: lesson ${lesson.id} learningObjectives must be an array.`);
    if (lesson.keyTerms && !Array.isArray(lesson.keyTerms)) errors.push(`${fileName}: lesson ${lesson.id} keyTerms must be an array.`);
  }

  for (const assessment of assessments) {
    if (!assessment.id || !assessment.title) errors.push(`${fileName}: each assessment must include id and title.`);
    if (!Array.isArray(assessment.questions)) errors.push(`${fileName}: assessment ${assessment.id} must include questions array.`);
  }

  for (const lab of labs) {
    if (!lab.id || !lab.title) errors.push(`${fileName}: each lab must include id and title.`);
    if (!Array.isArray(lab.prompts) || !lab.prompts.length) errors.push(`${fileName}: lab ${lab.id} must include at least one prompt.`);
  }

  for (const entry of glossary) {
    if (!entry.term || !entry.definition) errors.push(`${fileName}: glossary entries must include term and definition.`);
  }

  return errors;
}

function arrayOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function toPath(value) {
  if (value instanceof URL) return fileURLToPath(value);
  if (typeof value === 'string') return value;
  throw new Error('Path must be a string or URL.');
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const target = process.argv[2] || 'content';
  const result = await validateContentDirectory(path.resolve(target));
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${result.packageCount} content packages, ${result.lessonCount} lessons, ${result.questionCount} questions.`);
  }
}
