# Verified text PDF statements — acceptance

Branch: codex/fi-pdf-numeric-normalization. PDF-only numeric work from the prior task is preserved; this follow-up changes only PDF period evidence. XLSX reader and verification behavior, model, prompt, contract, calculations, runtime, OCR policy, Finance Domain exclusion and one-call execution are unchanged.

## Cause and observed structure

The old verifier tested whether any individual preceding PDF token contained the entire returned period. In the public sample, the caption is split across tokens: December | 31st, | 20 | 22 (page 1, line 5); the column header is DEC | 31 | , | 22 (line 6). Neither contains a complete date in one token.

The first source row is Services Revenue, amount 96,897.30, native reference p1:l9:t3 (page 1 / line 9 / token 3). The source expects the single period ending December 31, 2022. The new live response returned DEC 31 , 22. It is supported by the abbreviated column header and full-year caption together. The previous failed run did not retain its exact AI period; this new capture must not be misrepresented as that old response.

Extraction order is top-to-bottom visual line then left-to-right token. The date headers precede intervening section headings and a single repeated amount column. They are multiple source tokens on separate header lines, not Excel cells. Original header strings and references remain unchanged.

## Generalized period rule

The PDF-only resolver reconstructs page-local header text without mutating source evidence. It recognizes English full dates, including a split four-digit year inside a date, and explicit year columns. Abbreviated dates require matching full-year source evidence; no century pivot is guessed.

The nearest preceding supported header establishes ordered periods. The value's position among numeric tokens in its source row selects the period, corroborated by repeated table row cardinality (or an otherwise unambiguous single-row table). Conflicting header order/date evidence, mismatched amount counts, swapped periods and unresolved abbreviations fail safely. It does not accept an arbitrary AI period simply because its year appears somewhere on the page.

Supported coverage includes the actual public split-date structure, a preceding Year ended line with two full-date columns, ordinary year headers and page-local selection. No claim of general geometric reconstruction: vertically stacked column dates without unambiguous extracted order, same-line inline dates mixed into value rows, or complex merged layouts may still reject. Native references are never fabricated or rewritten.

Accepted numeric work remains PDF-only: original raw/displayed lexeme is retained alongside numeric value; decimal notation evidence permits well-formed groups and rejects ambiguity. No changes to that implementation in this follow-up.

## Frozen live acceptance

All calls used executeV1, actual gpt-4.1-2025-04-14, HTTP 200, one real provider request each, zero retry, unchanged prompt/contract SHA-256 d25b44f1326a8dc9cbba08dba41a95fa5953c9c8afba1f60c8297d51f8df3c3c. No third PDF, UK rerun or additional XLSX batch occurred in this follow-up.

| File | Result | Lines / verified values | KPIs | Core latency ms |
|---|---|---|---|---:|
| Public PDF | PASS | 21 / 21 | 3 applicable margins verified | 6207.62 |
| Controlled PDF | PASS | 14 / 28 | 9/9 expected KPI checks | 6489.66 |
| Rieter XLSX | PASS | 18 / 36 | Existing complete acceptance oracle PASS | 7168.29 |

Public source: https://fsmsdc.org/wp-content/uploads/2023/02/7-Generic-Company-LLC-FINANCIAL-STATEMENTS-SAMPLE-Writable.pdf . Original three-page sample used unchanged, with P&L on page 1 followed by balance sheet and cash flow. Currency/scale are unstated and remain null. Period is preserved as DEC 31 , 22. All returned references are native PDF references. Gross margin 100%, operating margin 37.76%, net margin 37.76%, independently checked against the source totals. No annual growth is fabricated for a single period. Customer result produced.

Controlled: EUR / thousands, periods 2025 / 2024, Basic and Diluted EPS retained, all original-value checks and 9/9 KPI checks passed. Customer result produced.

Rieter: CHF / millions, 2024 / 2025, 18 lines including both EPS rows, 36 verified values; acceptance passed unchanged.

| Stage ms | Public | Controlled | Rieter |
|---|---:|---:|---:|
| mechanicalReadMs | 297.88 | 135.14 | 50.62 |
| aiMs | 5894.28 | 6315.62 | 7067.7 |
| validationMs | 3.74 | 3.82 | 16.49 |
| verificationMs | 11.08 | 10.68 | 10.38 |
| calculationMs | 0.6 | 24.34 | 23.01 |
| totalMs | 6207.62 | 6489.66 | 7168.29 |

## Engineering gates

PASS: npm run typecheck; npm run lint (one pre-existing unused-variable warning); npx tsx --test tests/financial-intelligence/*.test.ts (52/52); npm run build; git diff --check.

Tests cover accepted PDF numbers and preservation plus split dates, unresolved abbreviations, conflicting full/short dates, column-order swaps, incomplete rows and ordinary PDF support. Spreadsheet predicate remains the same in the non-PDF branch. No new production environment change or deployment.

Files: reader.ts and pdf-numbers.ts (accepted prior numeric work); pdf-periods.ts and PDF-only dispatch in verify.ts; two PDF regression test files; this report.

Detailed local evidence: build/pdf-period-public.json, build/pdf-period-controlled.json, build/pdf-period-rieter.json. Raw provider bindings, source PDFs, credentials and unrelated historical diagnostics are not included in the commit.

TEXT_PDF_V1_ACCEPTANCE_PASS
