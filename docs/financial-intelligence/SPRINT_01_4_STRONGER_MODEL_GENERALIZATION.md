# Sprint 01.4 — Stronger-model generalization gate

Branch: codex/fi-uk-source-verification. Baseline commit: e337c1c. Draft PR #178.

## Decision

Neither authorized candidate passes the UK acceptance gate. No candidate is selected for production. The existing gpt-4.1-nano-2025-04-14 default is unchanged; this is not a new endorsement of Nano. Rieter is not run for either candidate because UK must pass first. No further models or deterministic semantic patches were tried.

The prompt, schema, reader, source binding, verifier, metadata normalization, period reconciliation, semantics, calculations, runtime and one-call architecture are byte-for-byte unchanged from baseline. The existing FI_V1_MODEL process override selected each candidate. No persistent environment or credential changes. Only the acceptance harness was parameterized for an explicit expected model and separate evidence output paths; the UK correctness oracle was held fixed for both models.

## Candidate 1 — gpt-4.1-mini-2025-04-14

One real request, HTTP 200, completed response. UK FAILED at SOURCE_REF_NOT_FOUND, lines[0].values[0].sourceRef. AI returned P&L Statement!C10 for a REVENUE section heading, plus D10/E10, although those numeric cells do not exist. Quoting normalization cannot make an absent cell real. This is a semantic/source-association error, not reference formatting. JSON and schema validation succeeded.

31 interpreted lines / 92 references. Current Year £ and Prior Year £ were included, but Variance £ was incorrectly treated as another reporting period. Prior-year bindings were present, not all valid. Currency £ was normalized with source context; scale was null. Source binding stopped on the first nonexistent reference, so verification/calculations/customer result did not complete. No invented value passed.

## Candidate 2 — gpt-4.1-2025-04-14

Availability confirmed with the existing OpenAI account before testing. Exactly one stronger candidate beyond Mini was tested. Same core, prompt and contract, one real request, HTTP 200.

UK core source verification PASS: 28 intended rows (27 monetary P&L rows plus supplementary gross-margin row), 56 exact source-bound values, correct labels and source references, both literal Current Year £ / Prior Year £ periods, no summary tiles. Currency GBP; scale null. All row/label/value checks pass. Core returns a result and six margin KPIs.

Overall acceptance FAILED: revenue is assigned to Sales / turnover while Total Revenue has concept null. The unchanged calculator consequently uses component sales rather than total revenue as the denominator. This is semantic concept selection, not formatting or arithmetic. All six calculated margins differ from the independent total-revenue oracle:

| KPI | Current actual | Current expected | Prior actual | Prior expected |
|---|---:|---:|---:|---:|
| Gross margin | 54.15% | 52.77% | 56.02% | 54.73% |
| Operating margin | 1.11% | 1.09% | 0.76% | 0.74% |
| Net margin | -6.59% | -6.43% | -7.36% | -7.19% |

The existing audit reports 90/92 checks passed. The other failed check expects GBP/units whereas the model preserves unspecified scale as null. The prompt explicitly allows null for unstated metadata; this stricter units assertion is not needed to establish failure. Even discounting that assertion, the incorrect KPI denominator independently fails the product gate. The oracle and normalization were not altered between candidates.

## Latency (informational, milliseconds)

| Stage | Mini UK | Full GPT-4.1 UK |
|---|---:|---:|
| mechanicalReadMs | 23.70 | 26.72 |
| aiMs | 42182.25 | 11208.37 |
| validationMs | 6.85 | 3.73 |
| verificationMs | 0.46 | 3.57 |
| calculationMs | 0 | 0.39 |
| totalMs | 42213.31 | 11242.82 |

Rieter latency for these candidates: not measured, intentionally gated on UK PASS. Prior Sprint 01.3 Nano evidence remains historical: Rieter 18 lines / 36 values / 39 checks PASS, 10447.83 ms total. It does not establish a Rieter result for either stronger candidate.

## Validation and Git

PASS: npm run typecheck; npm run lint (zero errors, one pre-existing classifier warning); all 38 Financial Intelligence tests; npm run build (126 pages); git diff --check.

No production/default-model files changed. No Finance Domain, retries, second interpretation call, mapping, selectedSheet, row-specific production patches or weakened verification. Two UK interpretation calls total, one per execution. The availability lookup was not an AI interpretation call.

The conditional both-file-PASS commit/push was not performed. Harness changes and this report/evidence remain local and uncommitted for review. Draft PR #178 remains unchanged and unmerged.

Evidence: SPRINT_01_4_UK_MINI.json and SPRINT_01_4_UK_GPT41.json. These retain model bindings, audit results and timings without customer monetary values or credentials. The original workbook was not changed or committed.

TWO_WORKBOOK_GENERALIZATION_FAILED
