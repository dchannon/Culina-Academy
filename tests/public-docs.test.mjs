import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
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
});

test('sandbox V2 config examples parse as JSON', async () => {
  const files = await listFiles(path.join(repoRoot, 'examples', 'config', 'sandbox-v2'), file => file.endsWith('.json'));

  assert.ok(files.length >= 4);
  for (const file of files) {
    const parsed = JSON.parse(await readFile(file, 'utf8'));
    assert.equal(parsed.schemaVersion, 'culina.framework.config.v2.example');
  }
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
