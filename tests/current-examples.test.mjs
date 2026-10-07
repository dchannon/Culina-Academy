import test from 'node:test';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

test('current contracts validate references, dependencies, aliases and environment bindings', async () => {
  const script = fileURLToPath(new URL('../examples/current/verify.mjs', import.meta.url));
  await promisify(execFile)(process.execPath, [script], { timeout: 10000 });
});
