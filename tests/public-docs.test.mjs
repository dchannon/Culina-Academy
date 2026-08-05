import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('public docs use generic workbook paths', async () => {
  const files = await listFiles(repoRoot, file => {
    const rel = path.relative(repoRoot, file).replaceAll('\\', '/');
    return rel === 'README.md' || rel === 'index.html' || rel.startsWith('docs/');
  });
  const combined = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join('\n');

  assert.equal(combined.includes('internal/'), false);
  assert.equal(combined.includes('workbook/README.md'), true);
});

test('public docs avoid withheld-content framing', async () => {
  const files = await listFiles(repoRoot, file => {
    const rel = path.relative(repoRoot, file).replaceAll('\\', '/');
    return rel === 'README.md' || rel === 'index.html' || rel.startsWith('docs/');
  });
  const combined = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join('\n').toLowerCase();

  const blockedStem = 'red' + 'act';
  assert.equal(combined.includes(blockedStem), false);
  assert.equal(combined.includes(`${blockedStem}ed`), false);
  assert.equal(combined.includes(`${blockedStem}ion`), false);
  assert.equal(combined.includes('phase-based'), false);
  assert.equal(combined.includes('phase based'), false);
  assert.equal(combined.includes('runtime library'), false);
});

test('sandbox V2 config examples parse as JSON', async () => {
  const files = await listFiles(path.join(repoRoot, 'examples', 'config', 'sandbox-v2'), file => file.endsWith('.json'));

  assert.ok(files.length >= 4);
  for (const file of files) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    assert.equal(parsed.schemaVersion, 'culina.framework.config.v2.example');
  }
});

test('sandbox client metadata examples parse as JSON', async () => {
  const metadataRoot = path.join(repoRoot, 'examples', 'metadata', 'data-culina-sandbox-test-client');
  const files = await listFiles(metadataRoot, file => file.endsWith('.json'));

  assert.equal(files.length, 71);

  const exportMetadata = JSON.parse(await readFile(path.join(metadataRoot, 'metadata.json'), 'utf8'));
  assert.equal(exportMetadata.summary.jobs, 24);
  assert.equal(exportMetadata.summary.dependencies, 15);
  assert.equal(exportMetadata.summary.linkedServices, 6);
  assert.equal(exportMetadata.summary.sourceDetails, 13);
  assert.equal(exportMetadata.summary.transformations, 11);

  for (const file of files) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    for (const field of ['configJson', 'sourceSelectQuery', 'parameters']) {
      if (typeof parsed[field] === 'string' && parsed[field].trim()) {
        JSON.parse(parsed[field]);
      }
    }
  }
});

test('public docs include schema, sandbox, and recovery guides', async () => {
  const requiredFiles = [
    'docs/getting-started/what-is-culina.md',
    'docs/getting-started/quickstart.md',
    'docs/tutorials/README.md',
    'docs/architecture/framework-architecture.md',
    'docs/architecture/control-plane-schema.md',
    'docs/reference/config-field-reference.md',
    'docs/reference/config-validation.md',
    'docs/configuration/sandbox-client-example.md',
    'docs/guides/add-rest-ingestion.md',
    'docs/guides/add-transformation.md',
    'docs/guides/dependencies-and-validation.md',
    'docs/operations/backfill-and-recovery.md',
    'docs/troubleshooting/diagnostic-queries.md',
    'docs/troubleshooting/incident-walkthroughs.md',
    'docs/troubleshooting/support-model.md',
    'docs/reference/version-compatibility.md',
    'examples/metadata/data-culina-sandbox-test-client/README.md',
    'schemas/sandbox-v2/ingestion-job.schema.json',
    'schemas/sandbox-v2/transformation-job.schema.json',
    'schemas/sandbox-v2/dependencies.schema.json',
    'schemas/sandbox-v2/validation-set.schema.json',
    'SUPPORT.md',
    'SECURITY.md',
    'CHANGELOG.md',
    'LICENSE',
    'workbook/README.md',
  ];

  for (const rel of requiredFiles) {
    const content = await readFile(path.join(repoRoot, rel), 'utf8');
    assert.ok(content.trim().length > 200);
  }

  const docsIndex = await readFile(path.join(repoRoot, 'docs', 'README.md'), 'utf8');
  const tutorials = await readFile(path.join(repoRoot, 'docs', 'tutorials', 'README.md'), 'utf8');
  assert.match(docsIndex, /Control Plane Schema/);
  assert.match(docsIndex, /Video Tutorials/);
  assert.match(docsIndex, /Sandbox Client Metadata Example/);
  assert.match(docsIndex, /Config Validation/);
  assert.match(docsIndex, /Diagnostic Queries/);
  assert.match(docsIndex, /Backfill And Recovery/);
  assert.match(tutorials, /https:\/\/youtu\.be\/WUB48MUN_k8/);
  assert.match(tutorials, /https:\/\/youtu\.be\/u6f94nvWImg/);
  assert.match(tutorials, /https:\/\/youtu\.be\/NxJomMWgvQ4/);
  assert.match(tutorials, /https:\/\/youtu\.be\/1VZ_PTN7kL0/);
  assert.match(tutorials, /https:\/\/youtu\.be\/AnLU_X5ctS8/);
  assert.match(tutorials, /https:\/\/youtu\.be\/ch7ysTWlGG0/);
  assert.match(tutorials, /https:\/\/youtu\.be\/2SCVVz3zhc4/);
  assert.match(tutorials, /6:38/);
  assert.match(tutorials, /6:29/);
  assert.match(tutorials, /6:21/);
  assert.match(tutorials, /6:23/);
  assert.match(tutorials, /6:17/);
  assert.match(tutorials, /5:03/);
  assert.match(tutorials, /5:26/);
  assert.match(tutorials, /From Metadata to Evidence/);
  assert.match(tutorials, /Control Plane vs Data Plane/);
  assert.match(tutorials, /The Data Journey/);
  assert.match(tutorials, /Incremental Ingestion Under the Hood/);
  assert.match(tutorials, /Inside `culina-runtime`/);
  assert.match(tutorials, /How SCD2 Builds Trustworthy History/);
  assert.match(tutorials, /When Pipelines Fail: Validation and Recovery/);
  assert.match(tutorials, /Published · 6:38/);
  assert.match(tutorials, /Published · 5:26/);
  assert.match(tutorials, /\| Next \|/);
});

test('public materials exclude repository-maintenance notes', async () => {
  const files = await listFiles(repoRoot, file => {
    const rel = path.relative(repoRoot, file).replaceAll('\\', '/');
    return rel === 'README.md'
      || rel === 'CHANGELOG.md'
      || rel.startsWith('docs/')
      || rel.startsWith('workbook/');
  });
  const combined = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join('\n').toLowerCase();

  for (const phrase of [
    'video entry template',
    'publishing workflow',
    'transcript standard',
    'data culina youtube channel',
    'metadata studio',
    'copilot',
    'client onboarding playbook',
    'ai knowledge pack index',
    'team members',
    'admin review',
    'admin workbook',
    'admin-core',
    'admin_review',
    'adminreview',
    'implementation service',
    'managed service',
    'client onboarding',
    'release governance',
    'moduleid',
    'mod-0',
    'sourcemodules',
    'sourcemoduleids',
  ]) {
    assert.equal(combined.includes(phrase), false, `found public-only phrase: ${phrase}`);
  }

  await assert.rejects(access(path.join(repoRoot, 'docs', 'tutorials', 'video-entry-template.md')));
  await assert.rejects(access(path.join(repoRoot, 'docs', 'tutorials', 'transcripts', 'README.md')));
});

test('public landing page uses Data Culina brand assets', async () => {
  await access(path.join(repoRoot, 'assets', 'data_culina_logo_vector.svg'));
  await access(path.join(repoRoot, 'assets', 'data_culina_icon_vector.svg'));
  await access(path.join(repoRoot, 'assets', 'data_culina_logo_on_paper.svg'));
  await access(path.join(repoRoot, 'assets', 'academy_readme_banner.svg'));

  const index = await readFile(path.join(repoRoot, 'index.html'), 'utf8');
  const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
  const docsIndex = await readFile(path.join(repoRoot, 'docs', 'README.md'), 'utf8');
  const banner = await readFile(path.join(repoRoot, 'assets', 'academy_readme_banner.svg'), 'utf8');
  const support = await readFile(path.join(repoRoot, 'SUPPORT.md'), 'utf8');

  assert.match(index, /assets\/data_culina_logo_vector\.svg/);
  assert.match(index, /assets\/data_culina_icon_vector\.svg/);
  assert.match(index, /#073f2c/);
  assert.match(index, /#f47b20/);
  assert.match(index, /https:\/\/dataculina\.com\//);
  assert.match(index, /docs\/tutorials\/README\.md/);
  assert.match(readme, /https:\/\/dataculina\.com\//);
  assert.match(readme, /docs\/tutorials\/README\.md/);
  assert.match(support, /https:\/\/dataculina\.com\//);
  assert.match(readme, /assets\/academy_readme_banner\.svg/);
  assert.doesNotMatch(readme, /## Document Map/);
  assert.match(docsIndex, /\.\.\/assets\/data_culina_logo_on_paper\.svg/);
  assert.match(banner, /M 436\.0 68\.0/);
  assert.doesNotMatch(banner, /CONTROL PLANE|CONFIGURATION|OPERATIONS|TROUBLESHOOTING/);
});

async function listFiles(root, include) {
  const entries = await readdir(root, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(full, include));
    else if (include(full)) files.push(full);
  }
  return files;
}
