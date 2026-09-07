# UK P&L verification diagnostic and normalization hotfix

Branch: codex/fi-uk-source-verification, based on main b0d04ad (includes merged PR #177).

## Production boundary, inspected before code changes

Production deployment dpl_CMUt12xrgTQxahVnfASPDKgvMwdZ, www.entimema.com, POST /api/financial-intelligence/run.

- Latest request xgrph-1788783628791-a418f3a04768 / run f170812f-db0e-4ffb-a7a4-2ffc6c5126a4: mechanical read completed (10.58 ms); provider HTTP 200; one AI call; JSON and schema validation succeeded; METADATA_AMBIGUOUS at currency; verification and calculation did not start. Core total 44715.77 ms, HTTP total 44720.95 ms.
- Immediately preceding request 2nc8t-1788783590891-f3ed10749131 / run 47ba472e-3683-4032-952e-9ccd45d8a645: read completed (30.20 ms); provider HTTP 200; one AI call; schema passed; SOURCE_REF_FORMAT at lines[0].values[0].sourceRef. Core total 23283.24 ms.
- Telemetry calls this field validationFailureCode; there is no separate verificationFailureCode. It does not retain filenames, raw rejected metadata, references, numbers or resolved model. These requests match the reported recent sequence, but filename attribution and raw production bindings cannot be proven from the logs. The production source default is gpt-4.1-nano-2025-04-14; the exact resolved model is confirmed on all local live runs, not recorded in these production logs.
- No failed numeric source value can be reported for the metadata rejection: no numeric comparison occurred. Duplicate references, period mapping and orientation were not reached. Scale was not the reported failure field.

## Exact local reproductions

Unmodified Downloads workbook: profit-and-loss-template-uk.xlsx, 12814 bytes, SHA256 993effa7bd293d5633c133a7145ca5256690cc526931d5496950786b40bf8030. Reader retains Cover plus P&L Statement, 157 cells / 8096 input characters. The statement contains summary tiles above a detailed table, a merged overall period caption, Current Year £ / Prior Year £ / Variance £ columns, cached formulas and accounting-formatted negatives/zeroes. No reader changes.

All four UK executions used one real OpenAI request each, gpt-4.1-nano-2025-04-14, no retries. They were separate diagnostic/acceptance executions after substantive changes, not an execution retry loop. Failed results remain failures.

1. Original core: HTTP 200; GBP/units metadata passed. SOURCE_REF_FORMAT at lines[0].values[0].sourceRef. AI binding P&L Statement!C11 versus reader key 'P&L Statement'!C11. Same sheet/cell, omitted quotes. 28 lines, no duplicate refs, total 13590.27 ms. Its overall caption declaration differed from its literal current/prior column-period bindings. Both the revenue component and explicit total used revenue.
2. After reference/period/total-concept normalization: HTTP 200; METADATA_AMBIGUOUS at currency. Captured currency was £ and scale units, reproducing the latest production boundary. Total 12949.01 ms. Offline replay after source-supported symbol normalization verifies 54 values on 27 monetary rows and computes all six applicable margins; this is not live PASS.
3. After currency normalization: HTTP 200; SOURCE_LABEL_MISMATCH at lines[0].label. AI treated C7/D7 summary tiles as current/prior TOTAL REVENUE. Source C6 labels C7 GROSS PROFIT; D6 labels D7 OPERATING PROFIT. Row 7 has no row label, and actual period headers are below it. Total 17683.21 ms. No erroneous row was discarded or remapped.
4. Final execution after one generalized layout instruction: HTTP 200; GBP/units; SOURCE_LABEL_MISMATCH at lines[0].label remains. AI returned 29 lines / 29 references, all for Year ended 31 March 2025, including TOTAL REVENUE bound to P&L Statement!C7. No duplicate refs. Prior-year values omitted. Source binding resolves C7 to the saved gross-profit number, but its financial meaning is wrong; numeric equality alone must not permit it. Exact financial amounts are unnecessary to explain this association error and are omitted. No customer-facing result or KPIs were returned.

## Generalized changes

- bind.ts: canonicalize omitted sheet-name quotes only when the explicit, exact sheet name exists; require a single existing A1 cell. No unqualified references, ranges, missing sheets or external workbook references are inferred. Existing numeric/duplicate verification remains intact.
- periods.ts: repair an overall report-caption declaration only when the caption exists above the table and every value's literal period matches a unique same-column header on one common header row. Wrong/swapped/ambiguous headers still fail. No annual dates are invented.
- metadata.ts: £ may normalize to GBP only with explicit sterling/UK source context and no detected competing currency code/symbol. Unsupported/ambiguous symbols still fail. No rescaling.
- semantics.ts: when one explicit Total Revenue/Sales/Turnover follows same-period revenue components on the same sheet, the aggregate alone retains revenue. All component labels and values remain unchanged. Ambiguous totals remain unavailable to KPIs.
- core.ts: pass unchanged source to metadata normalization; one instruction sentence states the existing row-label/column-header verification constraints and excludes summary tiles from table interpretation. Prompt architecture, output schema, model, runtime and one-call design are unchanged. The instruction clarification did not make final UK acceptance pass.
- Synthetic UK-structure regression test and real UK acceptance script added. Workbook-specific expected references exist only in the acceptance oracle, never production rules. The oracle requires all 27 monetary P&L rows, permits the supplementary source Gross margin % row, and independently checks both value columns.

No Finance Domain, classifier, selectedSheet, manual mapping, legacy reader, retry or orchestration. Source verifier and deterministic calculation implementations are unchanged. No financial value is generated by the model or altered by normalization.

## Final acceptance results

UK: FAILED; latest exact boundary SOURCE_LABEL_MISMATCH, lines[0].label. This is a genuine model source-association/orientation error, not a reader failure. It must not be solved by substituting cells, discarding the invalid line or weakening verification. The required two-workbook acceptance gate remains unmet; PR is a draft and must not be treated as rollout-ready.

Rieter: PASS after the final code/instruction changes, HTTP 200, one call, 18 intended lines / 36 verified values, income_statement, CHF, millions, 2024/2025; all 39 checks and nine KPIs pass. No deployed browser acceptance is claimed for this branch.

| Stage (ms) | UK final failure | Rieter final PASS |
|---|---:|---:|
| mechanicalReadMs | 28.32 | 22.44 |
| aiMs | 9200.45 | 10347.08 |
| validationMs | 8.04 | 10.19 |
| verificationMs | 1.64 | 9.89 |
| calculationMs | 0 | 58.15 |
| totalMs | 9238.50 | 10447.83 |

UK saved-response margins (offline only): current gross 52.77%, operating 1.09%, net -6.43%; prior gross 54.73%, operating 0.74%, net -7.19%. The existing calculator only computes growth for explicit four-digit annual periods, so relative headers do not produce growth KPIs. No claim of complete live UK KPIs is made.

## Quality gates and evidence

PASS: npm run typecheck; npm run lint (zero errors, one pre-existing unused-variable warning); all 38 FI tests; npm run build (126 pages); git diff --check. These engineering checks do not override the failed real UK acceptance.

Evidence: UK_PNL_DIAGNOSTIC.json (production privacy-safe telemetry and four local failure boundaries); UK_PNL_REAL_FILE_ACCEPTANCE.json (latest failed bindings, no financial values); RIETER_UK_REGRESSION.json (final regression audit). Earlier successful Rieter sprint evidence remains unchanged. Credentials and customer workbook are not committed.

UK_PNL_REAL_FILE_ACCEPTANCE_FAILED
