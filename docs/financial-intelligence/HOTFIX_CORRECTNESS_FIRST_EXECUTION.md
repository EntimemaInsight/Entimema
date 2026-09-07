# Hotfix — Correctness-first execution

Date: 7 September 2026. Branch: codex/fi-correctness-first. Base main: e54a9cd (merged PR #176, including the wording fix from #175).

## Product decision and configuration

The <=10-second acceptance gate is suspended. The previous configuration allowed 9200 ms for OpenAI, a 9800 ms application deadline anchored at HTTP entry, a 300 ms completion reserve and Vercel maxDuration=10.

New configuration: provider maximum 120000 ms; application safety deadline 175000 ms; 5000 ms reserved after the provider; route maxDuration=180 seconds. These are finite infrastructure safeguards, not the retired latency target. The provider budget still accounts for time already spent in the request. One synchronous request, no retry or background continuation.

Vercel's authenticated project API confirms Next.js, Node 24.x, Fluid Compute enabled, region iad1. [Vercel's published limits](https://vercel.com/docs/functions/limitations#max-duration) allow at least 300 seconds on Fluid Compute across plans. [App Router maxDuration](https://vercel.com/docs/functions/configuring-functions/duration) configures the route. Therefore a 180-second route is supported without changing the project, plan, region or infrastructure architecture. Only the route export changes. Nothing has been merged or deployed by this task.

The exact model remains gpt-4.1-nano-2025-04-14. Prompt, output schema, mechanical reader, source binding, verification, deterministic calculations and firstAnalysis are unchanged. ZERO Finance Domain dependency; no classifier execution, mapping or selectedSheet. The UI displays “Processing financial statement…” while awaiting the response. Both the gold regression command and the new Rieter acceptance treat latency as informational.

## Real Rieter acceptance

One explicitly authorized real OpenAI request used the existing credential and same executeV1 function as the production HTTP route. No AI response was mocked. The workbook was not modified or committed.

File: rieter-consolidated-income-statement-statement-of-comprehensive-income-2025-en.xlsx, from the user's Downloads directory.

- File size: 30,904 bytes.
- SHA-256: 2d786b84c659b85faa7bb441b98abf5e2e55549253a7c90d8ed30a2b3b52e0bc.
- Mechanically serialized document: 6,784 characters.
- Complete input including instructions/schema: 9,353 characters.
- Actual provider input tokens: 2,621.
- Output tokens: 1,139.
- Provider HTTP status: 200; response status: completed.
- Requested/resolved model: gpt-4.1-nano-2025-04-14.
- AI calls: exactly one.
- Returned financial lines: 18.
- Deterministically source-bound and verified values: 36.

| Stage | Milliseconds |
|---|---:|
| mechanicalReadMs | 69.78 |
| aiMs | 7771.72 |
| validationMs | 7.96 |
| verificationMs | 3.86 |
| calculationMs | 155.15 |
| totalMs | 8008.59 |

This run did not require more than 10 seconds. It proves the provider completed this sample with the longer safety configuration; it does not prove that increasing the budget caused the completion or that production latency is reliable.

## Exact correctness failure

The independent acceptance oracle expects income_statement, currency CHF, scale millions, periods 2024/2025, all 18 first-statement rows with exact source references and values, and deterministic KPIs. Comprehensive-income rows must not be mixed in.

The returned statementType passed income_statement. The currency assertion failed: expected **CHF**, received **CHF million**. The model combined currency and scale in its currency field. This is a metadata correctness failure at real_file_correctness_assertion after the core completed, not a provider timeout or source-verification failure. No corrective model/prompt/normalization changes were made.

The first failing assertion stops the semantic oracle. Periods, scale, exact expected row associations and KPI correctness were not independently accepted after that failure. The core did finish deterministic calculation (155.15 ms), but its exact KPI output and complete returned rows were not retained by the initial runner because they were assigned to the evidence after assertRieter. The runner is now corrected to retain an already source-verified result before semantic assertions on future runs. No second provider request was made. Do not infer missing output from the expected workbook.

Historical pre-normalization evidence: [RIETER_REAL_FILE_ACCEPTANCE_PRE_NORMALIZATION.json](./RIETER_REAL_FILE_ACCEPTANCE_PRE_NORMALIZATION.json).

## Independently inspected source expectations (not claimed live output)

The first statement has 16 monetary rows in CHF million, plus basic/diluted EPS rows explicitly labeled CHF per share. Columns B/C report 2024/2025. It includes Sales 859.1/685.1, Gross profit 263.4/171.5, EBIT 28.0/-43.9 and Net (loss)/profit 10.4/-63.4. A separate comprehensive-income section begins below it. The expected-row oracle in tests/financial-intelligence/rieter.ts checks all 36 values against these inspected source rows. EPS values must keep their explicit per-share labels; the global scale alone does not express mixed units.

## Validation and limitations

Typecheck PASS; lint PASS (zero errors, one pre-existing classifier warning); FI suite 24/24 PASS; production build PASS (126 pages); git diff --check PASS. The regression suite verifies completion after 10 seconds, one AI request/no retries, source verification, safe provider and infrastructure failure, and no Finance Domain or classifier execution dependency.

The next correctness issue is separating reported currency and scale without conflating them. Source-number verification does not validate metadata or guarantee complete semantic interpretation. This task preserves that evidence rather than claiming PASS. Longer synchronous requests still have finite provider/platform limits and may fail on provider outages or client/network interruption. No authenticated production acceptance or customer-delivered correct result is claimed; the current branch awaits review and deployment.

## Currency/scale follow-up

The subsequent metadata normalizer fixes CHF/millions. The real rerun continued through all checks and revealed extra comprehensive-income rows and missing operating-profit KPIs. See [normalization report](./HOTFIX_CURRENCY_SCALE_NORMALIZATION.md) and [latest full result/audit](./RIETER_REAL_FILE_ACCEPTANCE.json). The historical result above remains preserved; final real-file acceptance is still failed.

RIETER_REAL_FILE_ACCEPTANCE_FAILED
