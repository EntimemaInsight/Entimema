# Hotfix — Income-statement boundary and EBIT normalization

Branch: codex/fi-correctness-first. Existing PR #177. Date: 2026-09-07T12:00:29.234Z.

## Execution behavior

The reader and AI input remain complete and unchanged. After AI interpretation, all referenced rows are source-bound and checked by the unchanged verifier. Only then does deterministic semantic normalization select customer-facing P&L rows and canonicalize operating-profit aliases. Calculations run on those retained, verified rows. No numbers are changed or rescaled; source labels and reference objects are preserved.

The source structure is grouped by sheet and row. Recognized Income Statement/P&L headings start the primary section; explicit OCI/reconciliation headings or a separate following Comprehensive Income statement start the excluded section. A combined Statement of Comprehensive Income retains its profit/loss part until the explicit OCI boundary. Numeric OCI subtotal boundaries in combined statements require an earlier profit/loss closing row. Individual hedge, actuarial, fair-value or tax labels are never blacklisted. Tests retain those lines when they occur in the primary P&L. No Rieter row numbers are in the normalization implementation.

Aliases EBIT, Operating Profit, Operating Income, Profit from Operations and Earnings Before Interest and Taxes normalize to operating_profit, including Rieter's Operating result before interest and taxes (EBIT). Adjusted EBIT, EBITDA and EBIT margin are not mapped by those distinct labels/concepts. The actual source label remains unchanged.

## Fresh real acceptance

One real OpenAI request through the production executeV1 core. HTTP 200; completed response; model gpt-4.1-nano-2025-04-14. Same 30,904-byte workbook, SHA-256 2d786b84c659b85faa7bb441b98abf5e2e55549253a7c90d8ed30a2b3b52e0bc. Full document input 6784 characters; complete input 9353 characters / 2621 tokens; output 1137 tokens. No retry or second AI call.

**Latest live line count: 18 before → 18 after.** The model itself selected 18 P&L rows on this sample, so no OCI rows required exclusion in the fresh live run. EBIT → operating_profit was applied. Metadata: income_statement; CHF; millions; 2024/2025. All 18 intended rows and 36 exact source values passed. All 39 acceptance checks passed, including all nine KPIs and the final result summary/findings.

## Boundary regression against the earlier real response

The previously recorded real response contained 30 rows. Applying this same deterministic normalizer offline produces **30 → 18**, excluding these 12 OCI-section rows. This is regression evidence, not a second live execution:

- Row 30: Net (loss) / profit. References: 'Consolidated income statement'!B30, 'Consolidated income statement'!C30.
- Row 31: Remeasurement of defined benefit plans. References: 'Consolidated income statement'!B31, 'Consolidated income statement'!C31.
- Row 32: Income taxes on remeasurement of defined benefit plans. References: 'Consolidated income statement'!B32, 'Consolidated income statement'!C32.
- Row 33: Items that will not be reclassified to the income statement, net of taxes. References: 'Consolidated income statement'!B33, 'Consolidated income statement'!C33.
- Row 34: Currency translation differences. References: 'Consolidated income statement'!B34, 'Consolidated income statement'!C34.
- Row 35: Cash flow hedges. References: 'Consolidated income statement'!B35, 'Consolidated income statement'!C35.
- Row 36: Income taxes on cash flow hedges. References: 'Consolidated income statement'!B36, 'Consolidated income statement'!C36.
- Row 37: Items that may be reclassified to the income statement, net of taxes. References: 'Consolidated income statement'!B37, 'Consolidated income statement'!C37.
- Row 38: Total other comprehensive income. References: 'Consolidated income statement'!B38, 'Consolidated income statement'!C38.
- Row 39: Total comprehensive income. References: 'Consolidated income statement'!B39, 'Consolidated income statement'!C39.
- Row 40: Attributable to shareholders of Rieter Holding Ltd.. References: 'Consolidated income statement'!B40, 'Consolidated income statement'!C40.
- Row 41: Attributable to non-controlling interests. References: 'Consolidated income statement'!B41, 'Consolidated income statement'!C41.

The excluded rows remain in the original full source and the preserved earlier evidence. They are absent from the final P&L lines. The duplicate net-profit/attribution rows in the second statement are excluded by their section; the corresponding original P&L rows are retained.

Evidence: [fresh live result](./RIETER_REAL_FILE_ACCEPTANCE.json), [earlier full response](./RIETER_REAL_FILE_ACCEPTANCE_PRE_SEMANTICS.json), [offline regression audit](./RIETER_SEMANTIC_REGRESSION.json).

## Deterministic KPIs and customer result

| KPI | Period | Value (%) |
|---|---|---:|
| Gross margin | 2024 | 30.66 |
| Operating margin | 2024 | 3.26 |
| Net margin | 2024 | 1.21 |
| Gross margin | 2025 | 25.03 |
| Operating margin | 2025 | -6.41 |
| Net margin | 2025 | -9.25 |
| Revenue growth | 2025 | -20.25 |
| Operating profit growth | 2025 | -256.79 |
| Net income growth | 2025 | -709.62 |

Summary: Revenue decreased by 20.25% in 2025 versus 2024. Operating profit decreased by 256.79% in 2025 versus 2024.

- Revenue decreased by 20.25% in 2025 versus 2024.
- Operating profit decreased by 256.79% in 2025 versus 2024.
- Net income decreased by 709.62% in 2025 versus 2024.
- Gross margin moved from 30.66% to 25.03% in 2025 (-5.63 pp).
- Operating margin moved from 3.26% to -6.41% in 2025 (-9.67 pp).
- Net margin moved from 1.21% to -9.25% in 2025 (-10.46 pp).

## Latency (informational)

| Stage | Milliseconds |
|---|---:|
| mechanicalReadMs | 22.6 |
| aiMs | 12749.74 |
| validationMs | 7.84 |
| verificationMs | 7.22 |
| calculationMs | 57.33 |
| totalMs | 12844.79 |

## Checks and preserved boundaries

PASS: npm run typecheck; npm run lint (zero errors, one pre-existing unused-variable warning in backend/agents/document-classifier/validator.ts); all 32 Financial Intelligence tests; npm run build (126 pages); git diff --check.

Model, prompt, reader, source-verification rules, calculations, one-call architecture and 120-second provider / 175-second application / 180-second route window are unchanged. ZERO Finance Domain dependency. No mapping service, classifier, retries or background orchestration was added. This is a real local core acceptance, not a deployed/authenticated production browser session. PR #177 remains unmerged.

Limitations: deterministic boundaries recognize explicit English source section headings and structure. Ambiguous/unrecognized layouts, cross-page PDF structure and arbitrary financial semantics remain broader reliability work; one passing workbook is not evidence of universal accuracy. A wholly OCI result is rejected rather than returning an empty P&L. Exact cached Excel numeric precision is retained.

RIETER_REAL_FILE_ACCEPTANCE_PASS
