# Cookbook: Add A Service Job

Use a `Service` job for a bounded operational action that participates in dependencies, retry, and queue finalization.

1. Create the job and its `service-configs/` record with matching `jobId`.
2. Set `configValue.schema_version: "1.0"`, `execution`, and `parameters`.
3. Prefer a built-in handler: `http_request`, `file_operation`, `spark_sql`, `data_export`, `oauth2_token_refresh`, or `oauth2_client_credentials`.
4. Declare non-secret promotion values and portable secret references; add required upstream dependencies.
5. Validate parameters and classify side effects before allowing retries. Queue-safe fact append semantics do not make arbitrary service actions idempotent.

Built-ins use `execution.mode: "builtin"`, `handler`, and `timeout_seconds`. Only when a built-in cannot meet the contract, use `mode: "plugin"` with a logical handler name and exact `plugin.distribution`/`plugin.version`. Confirm a unique installed handler, matching distribution/version, and no collision with reserved built-ins. Metadata contains no inline implementation or import/callable paths.

For HTTP, `parameters.request` defines method/URL/headers/expected statuses; `parameters.secrets` maps names to `secret_id` values such as `secret://service-api-token`. Header templates may use `{{secret:api_token}}`; do not put credentials in a value set.

OAuth services use `source_linked_service_config_id` and `target_linked_service_config_id` export references with validated secret/lock configuration. Local secret reads can use environment roots; writable token documents require a writable document root. Ingestion consumes the resulting token separately.

See [Current Service Fixture](../../examples/current/contract-template/service-configs/publish-status.json), [Pinned Extension Fragment](../../examples/current/fragments/pinned-extension.json), and [Dependencies And Validation](dependencies-and-validation.md). The extension fragment is not an installed/deployed service.
