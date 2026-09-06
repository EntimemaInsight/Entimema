# Sprint 03.3 — semantic inference path diagnosis

## Production path reconstructed before implementation

The upload route reserves 60 seconds and invokes the Financial Intelligence HTTP service. The run pipeline classifies the document, extracts the complete selected worksheet into source rows and values, calls whole-statement interpretation, then runs deterministic controls and persistence. Before this sprint, interpretation ranked candidates for every extracted row and `resolveWholeStatement` serialized every row up to `FINANCIAL_SEMANTIC_MAX_ROWS` (120 by default). It did not filter deterministic mappings or hard-excluded sections. Therefore all 44 worksheet rows—not the 14 rows containing relevant P&L values—were request rows. The model was also required by the strict schema to return classifications for headers, metadata, blank/structural rows, P&L, OCI, comprehensive-income, and attribution rows.

The production request used the environment-selected `gpt-5-mini`, no explicit reasoning configuration, one Responses API call, `store:false`, strict JSON Schema, a 5,000-token output ceiling, a 45-second resolver timeout, and one attempt. Its JSON input contained title, deduplicated candidate arrays, all row labels/roles/hierarchy/neighbours/sign patterns, periods, currency/scale evidence, and deterministic relationship identifiers. Production telemetry measured 19,708 input characters (roughly 4,927 tokens using the deliberately coarse chars/4 diagnostic estimate), 44 submitted rows, and a 45,004 ms timeout. Candidate-set count was not recorded in PR #166; code inspection shows that empty non-P&L sets were deduplicated while P&L sets were usually identical complete bounded ontology sets, with extra distinct sets possible when lexical ranking changed ordering.

After a response, JSON parsing, runtime structural checks, row candidate allowlists, hard section/role gates, unchanged confidence thresholds, sign handling, and equation vetoes determine acceptance. The model cannot validate a run or bypass those controls.

## Why 44 rows were submitted

Extraction constructs one `SourceRow` for every physical row in the selected sheet, including headers, metadata, spacers, notes, and rows below the P&L boundary. Interpretation previously passed that array unchanged. The production evidence permits exact counts only for 14 `P&L_RELEVANT` and 16 `NON_P&L_EXCLUDED` rows. The remaining 14 rows are necessarily `CONTEXT_ONLY`, `STRUCTURAL`, or `DUPLICATE_OR_REDUNDANT`; raw production content is intentionally unavailable, so assigning those 14 to more specific buckets would be fabricated evidence. The diagnostic harness uses a sanitized 44-row shape with 14 P&L rows (five deterministic and nine unresolved), 16 excluded rows, and 14 structural/redundant rows.

## Root-cause evidence

- **MODEL_LATENCY:** `gpt-5-mini` produced no completed response at either 30 or 45 seconds. This proves the production path exceeds the synchronous budget, but telemetry has no server-side queue/first-token measure, so intrinsic model latency cannot be separated from request work.
- **REQUEST_COMPLEXITY:** proven avoidable. The request treated 44 rows as semantic work although only nine unresolved P&L rows required proposals. It repeated labels as neighbours and attached classification fields and candidate references to rows that deterministic code had already resolved or excluded.
- **OUTPUT_COMPLEXITY:** proven avoidable. The schema allowed/expected a classification object for every submitted row, so the required output cardinality was 44 instead of nine. The 5,000-token ceiling remains unchanged because no credentialed measurement proved a lower ceiling safe for reasoning plus legitimate evidence.
- **SCHEMA_COMPLEXITY:** not isolated as the primary cause. The schema is shallow and bounded, but every row object has seven required fields. Production validation remains strict; removing it would violate safety. The workset reduction lowers schema instances without weakening the schema.
- **PLATFORM_RUNTIME:** the route advertises 60 seconds and the application deliberately aborts inference at 45 seconds. The observed 45,004 ms and `timeoutTriggered=true` show the application budget fired as designed; they do not prove an earlier platform kill.
- **OTHER:** input/output token usage is not returned on timeout, and no API credential is available in this environment. A real model or alternative-model latency claim would therefore be unsupported. Model selection remains environment-configurable through `FINANCIAL_SEMANTIC_MODEL`.

## Controlled matrix

The checked-in harness is independent of parsing and persistence and uses only synthetic labels and values. Its default transport deterministically validates request shape, output cardinality, strict parsing, and telemetry; `--live` uses the configured Responses API for production-grade timing.

| Path | Model | Semantic rows | Payload | Output budget | Duration | Result |
|---|---|---:|---:|---:|---:|---|
| A verified production-equivalent | gpt-5-mini | 44 | 19,708 chars | 5,000 | 45,004 ms | timeout, 0 classifications |
| B reduced workset, deterministic harness | mock structured output | 9 | 5,404 chars (~1,351 tokens) | 5,000 | 15 ms | valid structured success, 9 classifications/proposals |
| C smaller output ceiling | not run | 9 | n/a | proposed experiment only | n/a | no credential; production ceiling retained |
| D alternative supported model | not run | 9 | n/a | 5,000 | n/a | no credential; no unsupported model recommendation |
| E schema isolation | deterministic invalid-output tests | 9 | same reduced request | 5,000 | local | strict missing/duplicate rows fail safely |

This proves the architectural defect and deterministic reduced path, not real-provider latency reliability. Run `npm run diagnose:financial-semantic -- --live` with production-equivalent environment values to fill the live B row. Repeat with a documented supported alternative by changing only `FINANCIAL_SEMANTIC_MODEL`. Test C requires an explicit diagnostic output-token override in a future experiment rather than silently changing the production safety margin.

## Selected P0 correction

The smallest safe correction preserves one whole-statement-aware call but makes only unresolved, financial-role P&L rows semantic work. An ordered compact outline retains the title/metadata structure, all relevant P&L ordering, parent references, deterministic mapping state, and the first hard boundary marker for each excluded section. Candidate sets and sign patterns now exist only for work rows. Duplicate neighbour labels are removed. The response must return exactly one unique row for each work item.

New telemetry records workset/context/exclusion/candidate counts and a coarse input-token estimate, never prompts, labels, values, provider bodies, or credentials. Ontology, confidence thresholds, deterministic section/sign/equation/structure controls, review gates, the 45-second timeout, output ceiling, and route budget are unchanged.

## Production retest and status

Production success is unverified until the real source is rerun and shows `outcome=success`, `timeoutTriggered=false`, `classificationsReturned>0`, and `proposedMappings>0`. Only then should acceptance and mapping-quality metrics be assessed. No batching is implemented because the reduced real-model path has not yet demonstrated that batching is necessary.

`DOMAIN_KNOWLEDGE_GAP: none`

Product recommendation: **READY FOR PRODUCTION SEMANTIC RETEST**. This is not a Production Ready recommendation.
