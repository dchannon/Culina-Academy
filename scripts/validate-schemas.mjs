import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const exampleSchemas = [
  ['examples/config/sandbox-v2/customer_orders_ingestion_job.json', 'schemas/sandbox-v2/ingestion-job.schema.json'],
  ['examples/config/sandbox-v2/customer_orders_transformation_job.json', 'schemas/sandbox-v2/transformation-job.schema.json'],
  ['examples/config/sandbox-v2/customer_orders_dependencies.json', 'schemas/sandbox-v2/dependencies.schema.json'],
  ['examples/config/sandbox-v2/customer_orders_validation.json', 'schemas/sandbox-v2/validation-set.schema.json'],
];

export async function validateExampleSet(repoRoot = process.cwd()) {
  const errors = [];
  for (const [exampleRel, schemaRel] of exampleSchemas) {
    const example = JSON.parse(await readFile(path.join(repoRoot, exampleRel), 'utf8'));
    const schema = JSON.parse(await readFile(path.join(repoRoot, schemaRel), 'utf8'));
    errors.push(...validateAgainstSchema(example, schema, exampleRel));
  }
  return {
    exampleCount: exampleSchemas.length,
    schemaCount: new Set(exampleSchemas.map(([, schema]) => schema)).size,
    errors,
  };
}

export function validateAgainstSchema(value, schema, location = '$') {
  const errors = [];
  validateNode(value, schema, location, errors);
  return errors;
}

function validateNode(value, schema, location, errors) {
  if (!schema || typeof schema !== 'object') return;

  if (schema.const !== undefined && value !== schema.const) {
    errors.push(`${location}: expected ${JSON.stringify(schema.const)}, received ${JSON.stringify(value)}.`);
  }

  if (schema.enum && !schema.enum.includes(value)) {
    errors.push(`${location}: expected one of ${schema.enum.map(item => JSON.stringify(item)).join(', ')}.`);
  }

  if (schema.type && !matchesType(value, schema.type)) {
    errors.push(`${location}: expected type ${schema.type}.`);
    return;
  }

  if (schema.type === 'string' && schema.minLength && value.length < schema.minLength) {
    errors.push(`${location}: expected string length >= ${schema.minLength}.`);
  }

  if ((schema.type === 'integer' || schema.type === 'number') && schema.minimum !== undefined && value < schema.minimum) {
    errors.push(`${location}: expected value >= ${schema.minimum}.`);
  }

  if (schema.type === 'array') {
    if (schema.minItems && value.length < schema.minItems) {
      errors.push(`${location}: expected at least ${schema.minItems} item(s).`);
    }
    if (schema.items) {
      value.forEach((item, index) => validateNode(item, schema.items, `${location}[${index}]`, errors));
    }
  }

  if (schema.type === 'object') {
    for (const requiredKey of schema.required || []) {
      if (!Object.hasOwn(value, requiredKey)) errors.push(`${location}: missing required field ${requiredKey}.`);
    }
    for (const [key, childSchema] of Object.entries(schema.properties || {})) {
      if (Object.hasOwn(value, key)) validateNode(value[key], childSchema, `${location}.${key}`, errors);
    }
  }
}

function matchesType(value, type) {
  if (type === 'array') return Array.isArray(value);
  if (type === 'integer') return Number.isInteger(value);
  if (type === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  return typeof value === type;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = await validateExampleSet(process.cwd());
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Validated ${result.exampleCount} config examples against ${result.schemaCount} schemas.`);
  }
}
