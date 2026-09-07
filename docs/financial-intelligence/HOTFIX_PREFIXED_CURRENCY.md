# Magnitude-prefixed currency normalization — live gate

2026-09-07. Continuation of Sprint 01.6 on codex/fi-uk-source-verification / Draft PR #178.

## Change and constraints

Exact K/M-prefixed tokens resolve only to supported three-letter currency codes. Recognized textual magnitude markers also normalize. An agreeing supplied scale is accepted; conflicting scale or statement-sheet currency evidence is rejected. Financial lines, source bindings and numeric values are untouched.

This hotfix changes metadata normalization and its tests only. The commit also preserves the previously uncommitted Sprint 01.4–01.6 hierarchy, completeness, contract and acceptance work. No additional prompt, model, source hierarchy, completeness, verification, calculation or runtime tuning occurred between the three executions. One real provider request per workbook, no retry, same production executeV1. ZERO Finance Domain dependency.

Exact acceptance model: gpt-4.1-2025-04-14, selected through the existing environment override. The code default remains unchanged; no production deployment or model promotion is claimed. Prompt/contract SHA-256: d25b44f1326a8dc9cbba08dba41a95fa5953c9c8afba1f60c8297d51f8df3c3c.

## Live results, in execution order

| Workbook | HTTP | Currency / scale | Lines / verified values | Audit | KPIs | Total ms |
|---|---:|---|---|---|---:|---:|
| ADDNODE | 200 | SEK / millions | 19 / 304 | 333/333 | 74 | 26152.77 |
| RIETER | 200 | CHF / millions | 18 / 36 | 39/39 | 9 | 8632.87 |
| UK | 200 | GBP / unstated | 28 / 56 | 94/94 | 6 | 8960.28 |

Addnode returned MSEK with null scale; normalization produced SEK / millions. All 19 statement lines and all 304 source-bound values across 2010–2025 passed the independent acceptance oracle. All 74 applicable KPIs and the customer summary passed. No gross margin is synthesized without a gross-profit source line.

Rieter retained 18 lines, including both EPS rows, and 36 verified values across 2024 / 2025; 39/39 checks passed. UK retained 27 monetary lines plus its valid ratio row, 56 verified values and correct aggregate hierarchy; 94/94 checks passed. UK scale is unstated, and literal current/prior-year headers are preserved. Its deterministic margins passed; annual growth is unavailable without explicit year labels under the unchanged calculator.

## Latency, milliseconds

| Stage | Addnode | Rieter | UK |
|---|---:|---:|---:|
| mechanicalReadMs | 16.52 | 120.64 | 29.34 |
| aiMs | 26096.58 | 8412.31 | 8923.89 |
| validationMs | 6.04 | 10.39 | 3.28 |
| verificationMs | 4.86 | 14.22 | 3.1 |
| calculationMs | 28.69 | 75.23 | 0.64 |
| totalMs | 26152.77 | 8632.87 | 8960.28 |

## Checks and evidence

PASS: npm run typecheck; npm run lint (one pre-existing unused-variable warning in document-classifier/validator.ts); npx tsx --test tests/financial-intelligence/*.test.ts (45/45); npm run build; git diff --check. Regression coverage includes all eight requested prefix tokens, textual equivalents, agreeing scales, scale conflicts, separate currency conflicts, invalid markers/codes and full-core verification with one request.

Detailed binding audits and historical raw provider evidence are retained locally in HOTFIX_PREFIXED_CURRENCY_{ADDNODE,RIETER,UK}.json and SPRINT_01_{4,5,6}_*.json. They are not included in this commit; the source workbooks and credentials are never staged. Earlier failed-run reports remain historical records. This report supersedes the Sprint 01.6 three-file failure status with the successful follow-up gate.

Limits: one live sample per workbook is evidence, not a guarantee of every future model response. Addnode takes about 26 seconds; latency is informational under the existing correctness-first runtime. Ambiguous metadata still fails safely. No merge or production rollout is authorized by this report.

THREE_WORKBOOK_GENERALIZATION_PASS
