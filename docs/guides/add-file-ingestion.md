# Cookbook: Add File Ingestion

Reuse the ingestion boundary for Spark-native files or one Excel worksheet.

1. Create/reuse a `sourceType: "file"` linked service with `configJson.Storage.BaseUri: "storage://inbound/example-client"`.
2. Create an `Ingestion` job/source detail. Set relative `sourceSelectQuery.path`, explicit `format`, and source `options`; these override linked-service `Options.Read`.
3. For Excel select one `.xlsx`/`.xlsm` file and scalar `sheet_name`; create another job/source detail for each additional sheet. No file globs or `.xls`.
4. Choose FULL or DELTA. File DELTA filters rows by `sourceDeltaColumn`, not file arrival; bound the selected paths independently.
5. Configure the alias externally through `CULINA_STORAGE_ROOT_INBOUND`, or Spark fallback `spark.culina.storage.root.inbound`. Match the physical root to the platform and grant storage access.
6. Validate paths, formats, schema/keys, source availability, and downstream dependencies before activation.

Aliases match `[a-z][a-z0-9_]{0,62}`. Logical roots cannot contain wildcards; relative Spark selectors may use globs but cannot traverse, override the root, or contain encoded separators/controls, malformed escapes, query-like suffixes, or fragments. Concrete cloud/local roots remain compatible.

See the [current file fixture](../../examples/current/contract-template/source-details/orders-file.json), [Ingestion Pattern](../patterns/ingestion-jobs.md), and [Config Validation](../reference/config-validation.md). Structural checks do not establish cloud/local storage permissions or Excel capacity.
