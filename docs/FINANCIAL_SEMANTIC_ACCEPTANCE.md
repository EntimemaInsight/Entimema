# Financial semantic acceptance

## Diagnosed failure

The `mapping-confidence.v1` weights total 1.00, but the former semantic acceptance path did not evaluate equation or history evidence and still treated their weights as zero. A 0.90 semantic proposal with 0.90 structural evidence, full sign consistency, and neutral context therefore scored only 0.67 and failed the 0.68 high-confidence gate. This was accidental double-discounting: unavailable equation evidence was indistinguishable from negative equation evidence. The executable regression is `semantic-acceptance-pipeline.test.ts`.

## Provider contract

One Responses API request contains a JSON string with the statement title; source rows (bounded label, source role, indentation, parent, immediate neighbours, candidate concepts, and sign pattern); period headers/types/designations; currency and scale evidence; and relationship identifiers. Financial cell values, workbook bytes, credentials, evidence payloads, and tenant identifiers are never sent in this contract.

The strict `income_statement_interpretation` response is an object with `title`, `currency`, `scale`, and `rows`. Every row classification contains `rowNumber`, `section`, `role`, an allowlisted concept or `null`, confidence on a documented 0–1 scale, short supporting evidence, and short contradictions. Runtime validation independently checks each classification and the per-row candidate allowlist.

## Two phases and evidence semantics

Phase A constructs provisional row mappings after schema, allowlist, mandatory P&L-section, role compatibility, semantic-confidence, and normalized combined-confidence checks. Every P&L row receives the complete bounded P&L ontology; deterministic lexical ranking affects order, not availability.

Phase B constructs relationships from deterministic and provisional mappings across all available periods. An equation has three practical states: verified, contradicted, or unavailable. A material contradiction vetoes the provisional mapping. Unavailable equation evidence is omitted from the weighted denominator and does not become a failure. Deterministic mappings are never overwritten by semantic proposals, and deterministic section boundaries veto provider attempts to move OCI, comprehensive-income, attribution, or metadata rows into P&L.

## Operational telemetry

Telemetry counts resolver request/invocation/outcome/version/model/duration, submitted and returned rows, proposals, mutually reproducible rejection stages, accepted semantic and deterministic mappings, unresolved P&L rows, and final mapping coverage. It contains no labels, values, workbook data, prompts, or credentials. The ordinary run endpoints redact it; authenticated financial operators can retrieve it from `GET /api/financial-intelligence/runs/{runId}/telemetry`.
