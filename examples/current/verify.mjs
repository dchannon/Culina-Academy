import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const guid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const builtin = new Set(['http_request', 'file_operation', 'spark_sql', 'data_export', 'oauth2_token_refresh', 'oauth2_client_credentials']);
const tokenPattern = /\$\{ENV\.([A-Z][A-Z0-9_]*)\}/g;
const tokenPrefix = '$' + '{ENV.';

async function load(directory, prefix = '') {
  const files = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) Object.assign(files, await load(path.join(directory, entry.name), relative + '/'));
    else if (entry.name.endsWith('.json')) files[relative] = JSON.parse(await readFile(path.join(directory, entry.name), 'utf8'));
  }
  return files;
}

function verify(files) {
  const contract = Object.fromEntries(Object.entries(files).filter(([name]) => name.startsWith('contract-template/')));
  const records = folder => Object.entries(contract).filter(([name]) => name.startsWith('contract-template/' + folder + '/')).map(([, value]) => value);
  const metadata = contract['contract-template/metadata.json'];
  for (const field of ['studioName', 'studioPublisher', 'studioVersion', 'contractVersion', 'clientId', 'clientName', 'contractId', 'exportedAt', 'exportedBy']) assert.ok(metadata[field], field);
  assert.equal(metadata.version, '2.2.0');
  assert.equal(metadata.contractVersion, '2.0.0');
  assert.ok(guid.test(metadata.clientId) && guid.test(metadata.contractId));
  const counts = { jobs: 'jobs', linkedServices: 'linked-services', sourceDetails: 'source-details', transformations: 'transformations', serviceConfigs: 'service-configs', dependencies: 'dependencies' };
  for (const [key, folder] of Object.entries(counts)) assert.equal(records(folder).length, metadata.summary[key], key);
  for (const record of Object.values(contract)) assert.ok(record && !Array.isArray(record) && typeof record === 'object');
  for (const folder of Object.values(counts)) {
    const ids = records(folder).map(record => record.id);
    assert.ok(ids.every(value => guid.test(value)), folder);
    assert.equal(new Set(ids).size, ids.length, folder + ' unique IDs');
  }
  const jobs = new Map(records('jobs').map(job => [job.id, job]));
  const linked = new Map(records('linked-services').map(item => [item.id, item]));
  for (const record of [...jobs.values(), ...linked.values()]) assert.equal(record.clientId, metadata.clientId);
  for (const job of jobs.values()) {
    assert.ok(['Ingestion', 'Integration', 'Data Warehouse', 'Consumption', 'Service'].includes(job.jobType));
    assert.equal(job.isActive, false);
    assert.ok(job.entityName && job.frequencyGroup);
    assert.ok(Number.isInteger(job.maxRetryCount) && job.maxRetryCount >= 0);
  }
  for (const item of linked.values()) assert.ok(item.configJson && typeof item.configJson === 'object');
  const sources = records('source-details');
  for (const source of sources) {
    assert.equal(jobs.get(source.jobId)?.jobType, 'Ingestion');
    assert.ok(linked.has(source.linkedServiceConfigId));
    assert.ok(['FULL', 'DELTA'].includes(source.deltaOrFull));
    assert.ok(source.stagingTableName && !source.stagingTableName.includes('.'));
    assert.ok(!Number.isNaN(Date.parse(source.fallbackWatermark)));
    const selector = source.sourceSelectQuery;
    const connection = linked.get(source.linkedServiceConfigId);
    if (connection.sourceType === 'file') {
      const base = connection.configJson.Storage.BaseUri;
      assert.match(base, /^storage:\/\/[a-z][a-z0-9_]{0,62}(?:\/[a-z0-9_-]+)*$/);
      assert.ok(!/[*?[\]{}]/.test(base));
      assert.ok(selector.path && !/^(?:[a-z]+:|[\\/])/i.test(selector.path), 'relative file path');
      assert.ok(!selector.path.split('/').includes('..') && !/[%?#\\]/.test(selector.path), 'safe fixture selector');
      assert.ok(['csv', 'json', 'jsonl', 'ndjson', 'parquet', 'orc', 'avro', 'text', 'excel', 'xlsx', 'xlsm'].includes(selector.format));
      if (['excel', 'xlsx', 'xlsm'].includes(selector.format)) {
        assert.ok(typeof selector.sheet_name === 'string' && selector.sheet_name);
        assert.match(selector.path, /\.(xlsx|xlsm)$/);
        assert.ok(!/[*?[\]{}]/.test(selector.path));
      }
    } else {
      assert.equal(connection.sourceType, 'rest_api');
      assert.ok(selector.path && selector.flatten.columns.length);
      const aliases = selector.flatten.columns.map(column => {
        assert.ok(column.expr && column.alias && !column.alias.includes('.'));
        return column.alias;
      });
      assert.equal(new Set(aliases).size, aliases.length);
      if (source.deltaOrFull === 'DELTA') {
        assert.ok(selector.delta.ParamName && aliases.includes(source.sourceDeltaColumn));
        assert.equal(connection.configJson.Options.Delta, undefined);
      }
    }
  }
  for (const record of records('transformations')) {
    assert.equal(jobs.get(record.jobId)?.jobType, 'Integration');
    assert.equal(record.isActive, false);
    const parameters = record.parameters;
    assert.ok(parameters.sources && parameters.target && Array.isArray(parameters.transformation.steps));
    for (const source of Object.values(parameters.sources)) {
      assert.ok(source.business_keys.length);
      assert.match(source.filter.where_clause, /stg_load_date/i);
      assert.ok(sources.some(item => source.db === 'stg' && source.table === item.stagingTableName));
    }
    assert.ok(parameters.target.business_keys.length);
    assert.ok(['truncate_insert', 'append', 'upsert', 'scd2'].includes(parameters.target.write_mode));
    const aliases = new Set();
    let previous = 0;
    for (const step of parameters.transformation.steps) {
      assert.ok(step.step_id > previous && step.name);
      previous = step.step_id;
      if (step.type === 'read_source') assert.ok(parameters.sources[step.config.source_name]);
      else assert.ok(aliases.has(step.config.input_df), 'defined input alias');
      if (step.type === 'deduplicate') assert.ok(parameters.sources[step.config.source_name] && step.config.use_source_business_keys);
      assert.ok(['read_source', 'deduplicate', 'write_target'].includes(step.type));
      if (step.config.alias) {
        assert.ok(!aliases.has(step.config.alias), 'unique output alias');
        aliases.add(step.config.alias);
      }
    }
    assert.equal(parameters.transformation.steps.at(-1).type, 'write_target');
    for (const flag of ['testDataIntegrity', 'testDuplicateBks', 'testNullBks']) assert.equal(record[flag], true);
  }
  const services = records('service-configs');
  for (const record of [...services, files['fragments/pinned-extension.json']]) {
    assert.equal(record.isActive, false);
    if (services.includes(record)) assert.equal(jobs.get(record.jobId)?.jobType, 'Service');
    const config = record.configValue;
    assert.ok(config && typeof config === 'object');
    assert.equal(config.schema_version, '1.0');
    assert.ok(Number.isInteger(config.execution.timeout_seconds) && config.execution.timeout_seconds > 0);
    if (config.execution.mode === 'builtin') {
      assert.ok(builtin.has(config.execution.handler));
      assert.equal(config.execution.handler, 'http_request');
      assert.equal(config.parameters.request.method, 'GET');
      assert.deepEqual(config.parameters.request.expected_status_codes, [200]);
      assert.match(config.parameters.secrets.api_token.secret_id, /^secret:\/\/[a-z0-9-]+$/);
      assert.equal(config.parameters.request.headers.Authorization, 'Bearer {{secret:api_token}}');
    } else {
      assert.equal(config.execution.mode, 'plugin');
      assert.ok(!builtin.has(config.execution.handler) && !/[:/\\]/.test(config.execution.handler));
      assert.ok(config.execution.plugin.distribution);
      assert.match(config.execution.plugin.version, /^\d+\.\d+\.\d+$/);
    }
    assert.ok(!/inlinePython|modulePath|pythonCode|client_secret|KeyVaultBaseUrl/i.test(JSON.stringify(config)));
  }
  const edges = records('dependencies');
  const adjacency = new Map([...jobs.keys()].map(key => [key, []]));
  const uniqueEdges = new Set();
  for (const edge of edges) {
    assert.ok(jobs.has(edge.jobId) && jobs.has(edge.dependentJobId), 'dependency references');
    assert.notEqual(edge.jobId, edge.dependentJobId);
    const key = edge.jobId + ':' + edge.dependentJobId;
    assert.ok(!uniqueEdges.has(key), 'unique edge');
    uniqueEdges.add(key);
    adjacency.get(edge.jobId).push(edge.dependentJobId);
  }
  const visit = (key, ancestors = new Set()) => {
    assert.ok(!ancestors.has(key), 'acyclic dependencies');
    for (const upstream of adjacency.get(key)) visit(upstream, new Set([...ancestors, key]));
  };
  for (const key of jobs.keys()) visit(key);
  const transform = records('transformations')[0];
  const rest = sources.find(source => linked.get(source.linkedServiceConfigId).sourceType === 'rest_api');
  assert.ok(edges.some(edge => edge.jobId === transform.jobId && edge.dependentJobId === rest.jobId), 'ingestion to INT');
  assert.ok(edges.some(edge => edge.jobId === services[0].jobId && edge.dependentJobId === transform.jobId), 'INT to service');

  const manifest = files['deployment-variable-manifest.json'];
  const valueSet = files['value-sets/dev.example.json'];
  assert.equal(manifest.manifestVersion, '1.0');
  assert.equal(manifest.valueSetPolicy, 'externalVersionedValueSets');
  assert.equal(manifest.failureBehavior, 'failDeploymentOnMissingRequiredValue');
  assert.ok(manifest.environments.includes(valueSet.environment) && valueSet.valueSetVersion);
  const variables = new Map(manifest.variables.map(item => [item.name, item]));
  const values = new Map(valueSet.values.map(item => [item.name, item.value]));
  assert.equal(variables.size, manifest.variables.length);
  assert.equal(values.size, valueSet.values.length);
  for (const [name, variable] of variables) {
    assert.equal(variable.token, tokenPrefix + name + '}');
    assert.equal(variable.secret, false);
    assert.equal(variable.required, true);
    assert.equal(variable.defaultValueAllowed, false);
    assert.equal(variable.valueSetRequired, true);
    assert.ok(values.has(name) && values.get(name), 'required value ' + name);
  }
  const used = new Set();
  for (const [name, record] of Object.entries(files).filter(([name]) => name.startsWith('contract-template/') || name.startsWith('fragments/'))) {
    const folder = name.startsWith('contract-template/') ? name.split('/')[1] : 'fragments';
    const serialized = JSON.stringify(record);
    for (const [, variableName] of serialized.matchAll(tokenPattern)) {
      assert.ok(variables.has(variableName), 'declared token');
      assert.ok(variables.get(variableName).scope.includes(folder), 'token scope');
      used.add(variableName);
    }
    const promoted = JSON.parse(serialized.replace(tokenPattern, (_, key) => JSON.stringify(values.get(key)).slice(1, -1)));
    const resolved = JSON.stringify(promoted);
    assert.ok(!resolved.includes(tokenPrefix));
    for (const reference of serialized.match(/(?:secret|storage):\/\/[^"]+/g) ?? []) assert.ok(resolved.includes(reference), 'portable reference preserved');
  }
  assert.deepEqual([...used].sort(), [...variables.keys()].sort());
  assert.equal(files['data/orders/orders.json'].length, 2);
}

const files = await load(root);
verify(files);
const invalidCases = [
  copy => { copy['contract-template/dependencies/orders-int-orders-rest.json'].dependentJobId = 'missing'; },
  copy => { copy['contract-template/dependencies/orders-int-orders-rest.json'].dependentJobId = copy['contract-template/jobs/publish-status.json'].id; },
  copy => { copy['value-sets/dev.example.json'].values = []; },
  copy => { copy['contract-template/source-details/orders-file.json'].sourceSelectQuery.path = 'file:///C:/escape.json'; },
  copy => { copy['contract-template/transformations/orders-int.json'].parameters.transformation.steps[1].config.input_df = 'undefined'; }
];
for (const mutate of invalidCases) {
  const copy = structuredClone(files);
  mutate(copy);
  assert.throws(() => verify(copy));
}
console.log('Validated ' + Object.keys(files).length + ' JSON fixtures; references, shapes, aliases, graph, token promotion, and 5 negative cases passed. No runtime execution.');
