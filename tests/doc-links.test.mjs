import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { validateDocLinks } from '../scripts/validate-docs.mjs';

test('documentation links and heading anchors resolve', async () => {
  const result = await validateDocLinks();
  assert.ok(result.checked > 100);
  assert.deepEqual(result.errors, []);
});

test('link validation catches missing files and anchors without checking code examples', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'academy-doc-links-'));
  assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
  try {
    await writeFile(path.join(root, 'README.md'), [
      '# Guide', '# Guide',
      '[Valid](#guide-1)', '[Missing anchor](#absent)', '[Missing file](absent.md)',
      '```markdown', '[Example](not-a-real-file.md)', '```',
    ].join('\n'));
    const result = await validateDocLinks(root);
    assert.equal(result.checked, 1);
    assert.equal(result.errors.length, 2);
    assert.ok(result.errors.some(error => error.includes('missing heading or anchor: absent')));
    assert.ok(result.errors.some(error => error.includes('absent.md')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
