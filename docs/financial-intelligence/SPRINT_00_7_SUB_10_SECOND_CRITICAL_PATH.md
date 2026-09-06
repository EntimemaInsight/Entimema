# Sprint 00.7 — Sub-10-second critical path

## Executive decision

**PERFORMANCE_GATE_FAILED.** The code now enforces a ten-second request boundary and a seven-second, single-attempt model budget, but this repository does not contain the three protected acceptance files or production credentials. Consequently no honest production p50/p95 can be reported. Revenue OS remains **BLOCKED**; this report does not mark it Demo Ready or Production Ready.

## 1. Before architecture

`multipart parse → mechanical source read → verbose structural JSON → one Financial Understanding inference → response parse → source hydration → deterministic validation → synchronous durable create → response → separate deterministic analysis request → optional PDF request`

PDF was already isolated behind its own endpoint. Persistence was synchronous and remains so because run ownership, revision identity, audit history, and the integrity hash must exist when the first result is returned.

## 2. Measured before latency

| Stage | Evidence | Before |
|---|---|---:|
| AI provider | **VERIFIED BOTTLENECK**: supplied production evidence says the Rieter execution reached Financial Understanding and timed out | at least the former 45,000 ms ceiling |
| Provider request budget | source inspection | 45,000 ms, one attempt |
| Route ceiling | source inspection | 60 s |
| Representative compact-payload benchmark | local sanitized 4-row workbook; not an acceptance file | 730 chars |
| Other stage timings | no retained pre-change production trace was supplied | not measurable retrospectively |

The lack of historical per-stage telemetry is explicitly not converted into invented measurements.

## 3. Bottleneck analysis

- **VERIFIED BOTTLENECK:** synchronous provider inference exhausted the prior 45-second Financial Understanding budget in the real Rieter production execution.
- **ASSUMPTION:** repeated JSON field names, formula text, row/column indexes, used ranges, and merge metadata add prompt tokens without adding semantic information needed for ordinary Income Statements.
- **HYPOTHESIS:** a smaller prompt and output cap should reduce provider prefill/decoding time. Only deployed acceptance telemetry can validate this.
- **DECISION:** enforce a 7 s provider budget and 10 s route ceiling; never increase a timeout to claim reliability.
- **DECISION:** retain synchronous durable creation. Moving it after the response would make the returned run identity potentially non-durable and break current revision/audit guarantees.

## 4. Removed synchronous work

- Removed the client `selectedSheet` argument and multipart field.
- Removed formulas, merges, used ranges, duplicated row/column indexes and verbose cell property names from the model payload. The full representation stays in-process for deterministic binding.
- Reduced maximum model output from 3,500 to 2,200 tokens.
- Removed the post-result analysis round trip for the normal validated path: deterministic analysis is included in the initial response.
- PDF generation remains on the explicit report endpoint and is never called by execution.

## 5. New architecture

`file only → multipart parse → minimal mechanical read → compact coordinate/value payload → ONE inference → strict response parse → deterministic source binding → deterministic accounting controls/KPIs/findings → synchronous durable create → first useful response`

The model owns document, entity, statement, currency/scale, periods, semantic line mapping and confidence. Deterministic code owns source numbers, normalization, evidence objects, controls, ratios, variances, integrity and durability.

## 6. AI contract before vs after

The response contract remains the strict source-reference V2 contract in this sprint to avoid weakening production lineage compatibility. It does not ask the model to reproduce financial numbers. The main output-cost improvement is a 37% output ceiling reduction (3,500 → 2,200 tokens). A future V3 contract may replace repeated sheet/row/label fields and evidence prose with compact mechanical row IDs, but that change requires live quality evaluation and was not made speculatively.

## 7. Payload size before vs after

The transport changed from verbose cell objects to `[cellRef, kind, primitiveValue]` tuples grouped under compact sheet keys. On the sanitized local 4-row benchmark, payload size changed **730 → 232 chars (68.2% reduction)**. This is a development benchmark, not the Rieter result and not evidence of universal reduction.

## 8. Model calls before vs after

| Boundary | Before | After |
|---|---:|---:|
| Before initial run response | 1 | exactly 1 |
| Before initial useful analysis | 1 plus a separate HTTP analysis action (deterministic, no model) | exactly 1; deterministic analysis included |
| PDF | 0 until requested | 0 until requested |

There is no retry and no semantic fallback.

## 9. Latency after

Privacy-safe telemetry now separates upload/form parsing, mechanical read, payload preparation, inference, response parsing, hydration, validation, persistence, time to first useful result and total execution. It also records payload chars, estimated input tokens, output tokens and model-call count, never prompts or financial values.

Local deterministic tests passed, including a 10 ms simulated inference, but mocked timings are not product acceptance. No live after-deployment distribution is available, so p50/p95 are **not measured** and the dominant remaining component is the provider inference.

## 10. Acceptance-file results

| Required file | Correctness | Source binding / controls | Analysis | Total latency |
|---|---|---|---|---|
| Rieter English Income Statement workbook | Not rerun: protected file/credentials absent | Not measured | Not measured | Not measured |
| Structurally different English Income Statement Excel | No acceptance artifact identified in repository | Not measured | Not measured | Not measured |
| Text-based English Income Statement PDF | No acceptance artifact identified in repository | Not measured | Not measured | Not measured |

Unit fixtures validate strict period/line references, mechanical numeric hydration, controls, deterministic analysis and PDF isolation. They do not establish universal capability.

## 11. Remaining limitations

- Provider latency and quality under the compact prompt require production validation.
- Synchronous persistence remains inside time-to-result and must be measured against the budget.
- Text PDF extraction is bounded to embedded text; image-only PDFs fail before inference.
- The V2 response still contains redundant provenance fields. A compact-ID V3 contract is a follow-up after corpus evaluation.
- The configured production model is environment-controlled and unknown in this checkout. No model was silently changed. Evaluating a lower-latency supported model is an explicit Product decision requiring side-by-side correctness and latency evidence.
- The seven-second inference ceiling intentionally returns a truthful timeout; it does not guarantee provider completion.

## 12. Gate

# PERFORMANCE_GATE_FAILED

Reason: no deployed three-file acceptance run or statistically meaningful p50/p95 measurement exists. Required next step: deploy to a non-production acceptance environment, run the named corpus repeatedly, export privacy-safe stage telemetry, and accept only if end-to-end **p50 ≤ 5 s and p95 ≤ 10 s** while all correctness checks pass. Do not raise either timeout. Real production acceptance remains required after deployment.
