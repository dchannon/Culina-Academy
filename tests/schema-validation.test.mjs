import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import {
  validateAgainstSchema,
  validateExampleSet,
} from '../scripts/validate-schemas.mjs';

test('validates sandbox V2 examples against bundled schemas', async () => {
  const result = await validateExampleSet(fileURLToPath(new URL('..', import.meta.url)));

  assert.deepEqual(result.errors, []);
  assert.equal(result.exampleCount, 4);
  assert.equal(result.schemaCount, 4);
});

test('schema validator rejects missing required fields', () => {
  const errors = validateAgainstSchema({}, {
    type: 'object',
    required: ['schemaVersion'],
    properties: {
      schemaVersion: { const: 'culina.framework.config.v2.example' },
    },
  }, 'example.json');

  assert.match(errors.join('\n'), /missing required field schemaVersion/);
});
