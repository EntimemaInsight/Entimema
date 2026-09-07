# Sprint 01.1 — Model latency benchmark

Date: 7 September 2026. Branch: `codex/fi-v1-hard-reset`. Draft PR: [#174](https://github.com/EntimemaInsight/Entimema/pull/174), not merged.

## Decision

**RECOMMENDED_V1_MODEL: none.** No candidate passed the full gold-file acceptance. There is no winner or qualifying runner-up. Do not promote nano based on its fast HTTP 200 response: the core rejected that response. The production default remains `gpt-4.1-mini-2025-04-14`; it was not benchmarked again.

**V1_CORE_ACCEPTANCE_PASS was not achieved.** No prompt/schema change, timeout increase, workflow layer, second model call, Finance Domain integration or replacement of verification/calculations was made.

## Clean comparison

Every candidate ran `executeV1`, the exact core called by the production HTTP handler, against the existing gold XLSX. The benchmark's injected transport is a real OpenAI Responses SDK request, not a mock. It uses the same SDK settings as production (`maxRetries: 0`), the same abort signal and the shared one-attempt wrapper. The wrapper only captures HTTP/model/token metadata. Each execution made exactly one AI call.

Only model configuration differs. `FI_V1_MODEL` is an optional environment override, with the existing default preserved. GPT-5.6 candidates explicitly request `reasoning.effort: none`; the non-reasoning GPT-4.1 candidate omits that unsupported setting. All use `temperature: 0`, the unchanged 7,000 ms AI ceiling and unchanged 7,000 output-token cap. The HTTP ceiling remains 10 seconds.

The prompt, source representation, schema, output cap and store flag had the same SHA-256 invariant fingerprint in all four executions:

`557a9279ff8916b183e5b0aacc636a679c29b0a3151fa0b6ca836b2079570228`

Each request had 674 document characters + 1,492 instruction characters + 1,345 serialized schema characters = **3,511 input characters**, estimated **878 input tokens** using characters / 4 rounded up. This estimate excludes HTTP envelope overhead and is not provider token accounting.

Evidence: [primary comparison](./SPRINT_01_1_BENCHMARK.json), [unchanged nano diagnostic repeat](./SPRINT_01_1_NANO_DIAGNOSTIC.json). The primary evidence retains the previous mini timeout as its baseline.

## Benchmark results

| Requested model | Reasoning | Provider HTTP | Provider input/output tokens | Read ms | AI ms | Verification ms | Calculation ms | Total ms | Acceptance |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| gpt-5.6-luna | none | No response before abort | unavailable / unavailable | 13.71 | 7029.67 | 0, not reached | 0, not reached | 7043.38 | FAIL: OPENAI_TIMEOUT |
| gpt-5.6-terra | none | No response before abort | unavailable / unavailable | 5.35 | 7015.42 | 0, not reached | 0, not reached | 7020.78 | FAIL: OPENAI_TIMEOUT |
| gpt-4.1-nano | omitted, non-reasoning model | 200 | 898 / 657 | 7.49 | 4928.98 | 7.97 | 0, not reached | 4944.47 | FAIL: OPENAI_RESPONSE_INVALID |
| gpt-4.1-nano, diagnostic repeat | omitted, non-reasoning model | No response before abort | unavailable / unavailable | 12.31 | 7021.18 | 0, not reached | 0, not reached | 7033.51 | FAIL: OPENAI_TIMEOUT |

The successful HTTP response identified its exact model as **`gpt-4.1-nano-2025-04-14`**. Luna/Terra returned no model metadata, so only their requested IDs can be reported.

Prior baseline, not re-executed: `gpt-4.1-mini-2025-04-14`, read 14.49 ms, AI 7040.36 ms, verification/calculation not reached, total 7054.88 ms, `OPENAI_TIMEOUT`.

All four new executions had estimated input tokens 878 and input characters 3511. Output tokens are **unknown**, not zero, for timed-out non-streaming requests. No partial response was observed; this does not prove the provider generated no internal output. Nano's first response was marked `completed`, not partial.

## Correctness and failure boundaries

- **Luna:** aborted during the provider request. No statement, lines, values, findings or KPIs were available to assess.
- **Terra:** aborted during the provider request. No financial correctness assessment was possible.
- **Nano, primary:** returned a completed HTTP 200 response within the preferred AI budget, but `executeV1` threw `OPENAI_RESPONSE_INVALID` during its response-validation stage before calculations. It did **not** pass the financial acceptance. No unverified numbers were returned as a successful result.
- **Nano, diagnostic:** the unchanged repeat was intended to preserve a more detailed rejection reason, but it timed out before returning any response.

The first nano sample's raw output and detailed rejection message were not retained by the initial benchmark logger. Therefore that sample cannot now distinguish a strict-contract, source-association/value, or numeric-prose rejection. It would be inaccurate to claim a specific invented value or semantic error from this evidence. The logger now preserves failed gold-only output and safe core error detail for future diagnostic runs. No assertion or verification rule was relaxed.

The 17 passing regression tests independently confirm the unchanged nine-line/18-value gold expectations, exact source checks, invented-number rejection and deterministic KPI calculations. These tests are not a substitute for live acceptance. There is no accepted live statement/analysis to publish from this benchmark.

## Next smallest intervention

**C. Reduce requested analysis prose.** In a subsequent controlled change, request one short qualitative summary sentence and one short finding while retaining all nine lines, all eighteen referenced values and all deterministic checks. Do not implement that prompt change as part of this comparison.

Why C first: the input is already compact; the only completed sample used 657 output tokens and nearly five seconds. Shorter prose may reduce generation work without altering numeric fields or the calculation contract. It may also reduce exposure to numeric claims in prose, but the current evidence does not establish that prose caused nano's rejection. That validation boundary still needs to be captured on the next completed diagnostic response. This is a proposed intervention, not a proven remedy.

A schema reduction would change the contract and has a broader impact. Prompt-size reduction addresses only 1,492 instruction characters and is less targeted at output generation. No new workflow layers are proposed.

## Model support and cost context

Official model documentation lists GPT-5.6 [Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) and [Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra) with `none` reasoning support. Their documented input/output rates per million tokens are $0.20/$1.20 and $2/$12 respectively. Those rates do not establish this project's successful access or the cost of timed-out requests. Nano availability to this key/project was demonstrated by its HTTP 200 response.

No cost-driven selection is made: none passed correctness, so there is no winning-model cost implication. No claim of statistically stable latency is made from one primary sample per candidate and one diagnostic repeat.

## Changes and validation

- Added `backend/financial-intelligence/v1/model.ts`: environment-configurable model selection with unchanged default and explicit GPT-5.6 reasoning disabled.
- Updated `backend/financial-intelligence/v1/core.ts` only to consume that model configuration and report its requested model.
- Added `scripts/fi-v1-model-benchmark.ts`: real, one-call comparison plus bounded nano diagnostic mode and invariant fingerprints.
- Added `tests/financial-intelligence/v1-model.test.ts`: configuration regression.
- Added this report and the two JSON evidence files.
- The previously modified `SPRINT_01_ACCEPTANCE.json` remains the mini timeout from provider recovery; it was preserved as baseline, not regenerated.

Typecheck: PASS. Expanded FI tests: **17/17 PASS**. Diff check: PASS. Lint: PASS, zero errors and the same pre-existing classifier unused-variable warning.

No candidate passed, so the conditional model-promotion, final acceptance rerun, production rebuild and `perf(financial-intelligence): select low-latency V1 model` commit were not performed. No commit or push was made for this failed gate. Draft PR #174 remains at the existing Sprint 01 commit, unmerged. Benchmark/configuration work and evidence remain local for review.

MODEL_LATENCY_GATE_FAILED

## Sprint 01.2 recovery outcome

The historical results above remain unchanged. Sprint 01.2 removed model-generated numeric values and prose, added privacy-safe diagnostics, and passed the first pinned Nano run: HTTP 200, one request, 509 output tokens, AI 5757.44 ms, total 5881.71 ms. All nine lines and 18 source-bound values verified. Nano is now the default. The latest acceptance JSON has been replaced with this successful evidence. See [Sprint 01.2](./SPRINT_01_2_MINIMAL_OUTPUT_CONTRACT.md) for the full contract, measurements and quality gates. The earlier failed gate is superseded by this explicit successful minimal-contract run; no additional models were benchmarked.

V1_CORE_ACCEPTANCE_PASS
