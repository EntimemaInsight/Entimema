# Hotfix — Split currency from scale

Branch: codex/fi-correctness-first. Existing PR #177. This change does not modify the model, prompt, runtime window, number of AI requests, source verification or deterministic calculations.

## Normalization

A small deterministic metadata normalizer runs after schema parsing and before source binding. It recognizes currency codes from the runtime's supported currency list, keeps their uppercase code, and separates explicit unit/thousand/million/billion words. Singular/plural scale words normalize to units/thousands/millions/billions. GBP without a scale remains GBP/null; no units are invented. The function preserves financial line objects, source references and every numeric value. Unsupported codes/symbols, multiple currencies, unrecognized scale tokens and contradictory scale declarations fail closed with privacy-safe diagnostics.

Examples: CHF million → CHF/millions; EUR thousands → EUR/thousands; USD million → USD/millions; GBP → GBP/null. The normalizer never rescales an amount or guesses a currency from a symbol or missing currency field.

## Same real Rieter rerun

Date: 2026-09-07T11:43:46.100Z. The unchanged 30,904-byte workbook has SHA-256 2d786b84c659b85faa7bb441b98abf5e2e55549253a7c90d8ed30a2b3b52e0bc. One real OpenAI request, HTTP 200, completed response; model gpt-4.1-nano-2025-04-14. Input: 6784 document characters, 9353 complete input characters, 2621 actual input tokens; 1923 output tokens.

Metadata now passes: income_statement, CHF, millions, periods 2024/2025. The full response is retained in [historical live evidence](./RIETER_REAL_FILE_ACCEPTANCE_PRE_SEMANTICS.json). The earlier currency failure remains in [pre-normalization evidence](./RIETER_REAL_FILE_ACCEPTANCE_PRE_NORMALIZATION.json).

| Stage | Milliseconds |
|---|---:|
| mechanicalReadMs | 25.44 |
| aiMs | 13805.28 |
| validationMs | 8.8 |
| verificationMs | 4.05 |
| calculationMs | 145.92 |
| totalMs | 13989.57 |

## Continued acceptance: FAIL after metadata

The same saved response was audited through all 39 checks, without another provider call. 33 passed and 6 failed. The audit collects every result instead of stopping at the first assertion.

- All 18 expected income-statement rows are present with correct labels and both period references.
- All 36 expected financial numbers match the exact numeric source cells.
- The model additionally included 12 rows from the separate comprehensive-income section (source rows 30–41). The returned result has 30 lines and 60 source-verified values, so it fails the required statement boundary and exact count.
- EBIT at row 13 is labeled concept EBIT instead of operating_profit. The unchanged calculator therefore omits operating margins (expected 3.26% for 2024 and -6.41% for 2025) and operating profit growth (expected -256.79%).
- Gross margins 30.66%/25.03%, net margins 1.21%/-9.25%, revenue growth -20.25% and net income growth -709.62% passed.
- A customer-visible summary and findings are present, but extra statement rows and missing operating KPIs prevent a correct final result from passing acceptance.

Source binding faithfully preserves Excel's cached numeric precision (for example EBIT 2024 is 27.999999999999968, displayed as 28.0). The acceptance oracle now compares exact source numbers and independently checks the displayed expected figures; it does not falsely reject correctly bound binary floating-point values. Production verification and numbers remain unchanged.

Summary returned: Revenue decreased by 20.25% in 2025 versus 2024. Net income decreased by 709.62% in 2025 versus 2024.

No filtering, concept remapping, prompt change or repeat sampling was used to manufacture PASS. The remaining failure is statement selection and semantic concept labeling, outside this metadata-only fix.

## Verification

Typecheck PASS; lint PASS (zero errors, one pre-existing classifier warning); FI tests 27/27 PASS; production build PASS (126 pages); git diff --check PASS.

No merge, deployment or authenticated browser acceptance was performed. Runtime remains provider 120 seconds / application 175 seconds / route 180 seconds, with one attempt and no retries. ZERO Finance Domain dependency.

## Boundary and EBIT follow-up

The subsequent boundary/EBIT hotfix passed a fresh real execution: 18 intended P&L rows, 36 verified values and all nine KPIs. The previously recorded 30-row output also passes an offline 30-to-18 boundary regression. Earlier failures above are historical and superseded by the [current report](./HOTFIX_PNL_BOUNDARY_EBIT.md) and [latest live acceptance](./RIETER_REAL_FILE_ACCEPTANCE.json).

RIETER_REAL_FILE_ACCEPTANCE_PASS
