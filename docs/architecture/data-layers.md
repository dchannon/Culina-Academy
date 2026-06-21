# Data Layers

The data plane contains the storage and processing layers used by the framework. These layers help users understand where data is in the flow and what kind of issue they are seeing.

## Source

The external or upstream input. Source issues usually involve missing files, changed formats, unavailable systems, permission problems, or unexpected source values.

## Landing

The first framework-controlled intake area. Landing confirms that the framework received or captured the input.

Typical questions:

- Did the expected source arrive?
- Is the file or extract complete?
- Is the timestamp or period correct?

## Archive

The retained copy of received source input. Archive supports traceability and replay discussions.

Typical questions:

- Was the original input retained?
- Which input version was used?

## Delta

The standardized intake layer. Delta makes raw input easier for downstream processing by applying structural normalization.

Typical questions:

- Did the source parse successfully?
- Did the expected columns or fields appear?
- Were malformed records detected?

## Staging

The staging layer collects standardized records for transformation. Staging issues usually involve completeness, duplicates, unexpected volume, or source-to-target alignment.

Typical questions:

- Is the expected data volume present?
- Did the correct input period load?
- Are duplicates or missing required values visible?

## Integration

The integration layer aligns data to business or domain structures before durable persistence.

Typical questions:

- Did transformation logic produce expected joins or relationships?
- Are reference mappings available?
- Did data fail validation before persistence?

## EDW / Core Warehouse

The durable modeled layer. This is where governed history and core analytical structures are maintained.

Typical questions:

- Did the durable target update?
- Is the expected history present?
- Did write behavior match expectations?

## Consumption

The serving layer for reporting, downstream interfaces, or user-facing outputs.

Typical questions:

- Is the expected output available?
- Is the output complete for the requested period?
- Are downstream consumers blocked?

## Diagnostic Pattern

When diagnosing, identify the last layer that looked correct and the first layer that looked wrong. That boundary usually determines the fastest support path.
