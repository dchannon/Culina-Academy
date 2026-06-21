import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('public docs do not link internal workbook', async () => {
  const files = await listFiles(repoRoot, file => {
    const rel = path.relative(repoRoot, file).replaceAll('\\', '/');
    return rel === 'README.md' || rel === 'index.html' || rel.startsWith('docs/');
  });
  const combined = (await Promise.all(files.map(file => readFile(file, 'utf8')))).join('\n');

  assert.equal(combined.includes('internal/workbook'), false);
  assert.equal(combined.includes('learner.html'), false);
  assert.equal(combined.includes('admin.html'), false);
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
    'docs/architecture/control-plane-schema.md',
    'docs/configuration/sandbox-client-example.md',
    'docs/operations/backfill-and-recovery.md',
    'examples/metadata/data-culina-sandbox-test-client/README.md',
  ];

  for (const rel of requiredFiles) {
    const content = await readFile(path.join(repoRoot, rel), 'utf8');
    assert.ok(content.trim().length > 200);
  }

  const docsIndex = await readFile(path.join(repoRoot, 'docs', 'README.md'), 'utf8');
  assert.match(docsIndex, /Control Plane Schema/);
  assert.match(docsIndex, /Sandbox Client Metadata Example/);
  assert.match(docsIndex, /Backfill And Recovery/);
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

  assert.match(index, /assets\/data_culina_logo_vector\.svg/);
  assert.match(index, /assets\/data_culina_icon_vector\.svg/);
  assert.match(index, /#073f2c/);
  assert.match(index, /#f47b20/);
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
