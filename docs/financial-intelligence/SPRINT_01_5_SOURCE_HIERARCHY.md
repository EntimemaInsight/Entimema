# Sprint 01.5 — Source hierarchy aware AI contract

Branch: codex/fi-uk-source-verification. Existing Draft PR #178; baseline commit e337c1c. Prior Sprint 01.4 local evidence and harness work preserved.

## Source representation

The prior compact representation exposed populated cell references, raw values and displayed text, but omitted cached-formula expressions, number formats, merged ranges, row grouping and explicit row boundaries/gaps. This obscured evidence distinguishing components from aggregates.

The spreadsheet reader now adds raw structural evidence only:

- Sheet and ROW markers, plus BLANK_ROWS intervals between populated rows.
- Merged ranges, exact formula expressions, number formats, available row outline levels and hidden row/column flags.
- Available fill colors. SheetJS in this environment does not expose bold/font or alignment indentation through the parsed cell-style object; none is inferred. Leading whitespace in source labels remains intact.
- Existing cell references, raw numeric values and displayed values remain unchanged. Formula expressions are not executed or interpreted by the reader. Cached source numbers remain the binding authority.
- Structural text remains subject to the same 120000-character compact-input ceiling. There is no silent truncation. PDF representation is unchanged.

No financial classification, subtotal identification, source selection or canonical concept assignment occurs during reading.

## One-call prompt/contract

The prompt requires actual reporting periods first, excludes variance/budget/percent/change/notes columns from period bindings, and asks the model to read detail → subtotal → total hierarchy before assigning aggregate concepts. Explicit source-defined aggregates take precedence over their components, including aggregates named Net Sales. Component rows retain separate/null concepts. Formulas, grouping and formatting are evidence, not executable instructions. The model must not invent or calculate replacement aggregates.

No output-schema field was added: existing concept and source-reference fields express the selection without a redundant aggregationRole field. One model interpretation call, no retry or second analysis call. Numeric binding, verifier, metadata normalization, period reconciliation, semantic normalizers and deterministic calculators remain unchanged from the Sprint 01.4 baseline.

Before either live execution, the UK oracle was corrected to accept null for genuinely unspecified scale, consistent with the unchanged prompt/metadata contract. It additionally checks canonical Total Revenue and distinct component sales. All financial value and KPI checks remain intact. No oracle or prompt tuning occurred between UK and Rieter.

## Frozen configuration

Model: gpt-4.1-2025-04-14. Existing provider window 120000 ms, application deadline 175000 ms, route ceiling 180 seconds. Existing credential reused without modification. UK and Rieter each used one real OpenAI request and returned HTTP 200.

Both executions recorded the identical SHA-256 of instructions plus output text schema:

4fdf01e1040eae03407740643859786b187e2bf661226e604289a7610f313ef8

The same reader, prompt, schema, model, verification and calculations were used without changes between files.

## UK acceptance — PASS

Same profit-and-loss-template-uk.xlsx from Downloads. 27 monetary Income Statement rows, 54 exact source-bound values. Both Current Year £ and Prior Year £ present; variance excluded. Source-defined Total Revenue receives revenue and component sales remains distinct. Currency GBP, scale null (unstated). All 91 acceptance checks passed; usable result returned.

| KPI | Current year | Prior year |
|---|---:|---:|
| Gross margin | 52.77% | 54.73% |
| Operating margin | 1.09% | 0.74% |
| Net margin | -6.43% | -7.19% |

These are all six applicable margin KPIs. Existing calculators require explicit four-digit annual periods for growth, so relative headers do not produce invented annual growth comparisons. The supplementary gross-margin source row is optional; all 27 monetary P&L rows are required.

## Rieter regression — FAILED

Same Rieter workbook from Downloads. Core verification passes all 32 returned values, but the model returns only 16 of the 18 required rows. It omits Basic earnings per share (CHF) and Diluted earnings per share (CHF), accounting for the four missing values. Normalization input/output count is 16/16 with no excluded rows: these rows were omitted by AI, not filtered by code.

Correct: income_statement, CHF, millions, 2024/2025, P&L boundary, operating_profit/EBIT concept, all nine KPIs and summary/findings. Audit 35/39 PASS; failed checks are line count, value count and the two missing EPS rows. Completeness failure is not overridden by correct KPIs or returned-value verification.

| KPI | 2024 | 2025 |
|---|---:|---:|
| Gross margin | 30.66% | 25.03% |
| Operating margin | 3.26% | -6.41% |
| Net margin | 1.21% | -9.25% |

2025 growth: revenue -20.25%, operating profit -256.79%, net income -709.62%.

## Third workbook — NOT RUN

US_SME_Income_Statement.xlsx was identified and explicitly authorized for conditional acceptance. No AI request was sent: UK + Rieter must both pass before this stage. Read-only preflight does not constitute acceptance. No third-file result or latency is claimed.

## Latency (informational, milliseconds)

| Stage | UK PASS | Rieter FAILED |
|---|---:|---:|
| mechanicalReadMs | 22.84 | 48.67 |
| aiMs | 12107.68 | 7439.77 |
| validationMs | 4.14 | 3.60 |
| verificationMs | 4.63 | 6.08 |
| calculationMs | 0.60 | 159.87 |
| totalMs | 12139.94 | 7658.06 |

## Checks, limitations and Git

PASS: npm run typecheck; npm run lint (zero errors, one pre-existing classifier warning); all 41 Financial Intelligence tests; npm run build (126 pages); git diff --check.

The new reader tests verify formulas, merged ranges, grouping, leading whitespace, percentage formats, exact values, blank-row markers and the unchanged compact-input limit. There are no workbook-name or row-number rules in production. Finance Domain remains excluded. No verification was weakened.

The current model still omits source rows on an unrelated file. The three-workbook gate is FAILED. No tuning/retry was performed to obtain a favorable Rieter sample, and no production model/default change was made. The existing Nano default remains unchanged; GPT-4.1 was used through the process-level candidate override only.

Per the conditional Git instruction, there is no new commit/push or PR update. Draft PR #178 remains open, draft and unmerged at e337c1c. Local changes and evidence are retained for review, including the prior Sprint 01.4 work.

Evidence: SPRINT_01_5_UK.json and SPRINT_01_5_RIETER.json. Credentials and source workbooks remain outside Git. No deployment or production browser acceptance is claimed.

THREE_WORKBOOK_GENERALIZATION_FAILED
