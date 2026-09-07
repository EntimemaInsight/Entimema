# Sprint 03 — Customer Result Experience

## Current-state audit

Base: main 51a1a66 (merged Sprint 02 / PR #180).

The existing FinancialIntelligenceWorkspace client component owned upload/execution state and all result markup. It rendered the Sprint 02 executive summary, all period KPI entries, findings, a verified statement and per-cell evidence disclosures. Repeated period cards made comparison laborious; the summary had little prominence. Evidence disclosures exposed raw internal sourceRef strings. The existing stylesheet provided an auto-fit card grid, a horizontal table region and a mobile padding adjustment. Model names, AI call counts and timings were already absent from the visible result.

The production workspace was inspected without uploading: it redirected the available browser to sign-in. No authenticated production result was available to inspect. Repository audit and local fixture rendering are the evidence for this sprint; no new production acceptance is claimed.

Existing site typography uses Segoe UI Variable/Segoe UI and navy/neutral tokens. Result-only changes reuse that typography and palette. No site-wide styles or upload workflow redesign.

## Reuse and implementation

The workspace retains the same upload control, execution handler, status/error handling and API call. Its result markup is extracted into FinancialIntelligenceResult.tsx, with a scoped CSS module. Superseded result styles are removed from the workspace stylesheet. The component imports the existing Result and AnalysisKpi types only; it does not import engine implementations.

Information architecture:
1. Result header: entity or fallback, Income Statement, reporting periods, currency, scale, and “Financial values verified against your file.”
2. Executive Summary: existing analysis.executiveSummary displayed verbatim in prominent type. Its maximum-three-sentence contract is owned by the frozen engine.
3. Key Performance Indicators: six measures for a selected source period, with explicit status, existing value and applicable prior comparison/operands.
4. Key Findings: up to five existing findings, unchanged statements, existing severity translated into readable labels and evidence access.
5. Verified Income Statement: all source labels/periods/values, context, right-aligned tabular numerals, parentheses for negatives, and subtotal/total styling only from aggregationRole.
6. Source Evidence: collapsed full-statement traceability, in addition to KPI/finding disclosures.

No KPI formulas, deltas, financial grouping or AI content are generated in the presentation. Selecting a period filters existing KPI entries. The initial selection is the latest explicit annual period, otherwise the first source period. Summary/findings remain the existing whole-result interpretation.

## KPI states

- valid: existing percent value, labelled “Calculated from verified values”.
- unavailable: readable label and existing contract reason.
- not_meaningful: readable label and existing contract reason.
- sign_change: Positive to negative / Negative to positive, source operands and periods; no conventional growth percentage.
- Margin comparison uses an existing prior annual KPI when available, never a calculated UI delta.
- A missing statement-period value says “Not reported”; it is not replaced with zero.

Source monetary operands retain currency/scale context. Statement labels preserve per-share qualifiers. No NaN/Infinity or artificial percentage is introduced.

## Evidence interaction

Native details/summary controls provide “View evidence” for KPIs, findings and the full statement. All are closed initially. Finding KPI IDs and source concepts resolve to existing verified lines; the disclosure shows their source labels, period values and readable source locations.

XLSX: qualified cell references become “Sheet …, cell …”, including escaped apostrophes.
PDF: native references become “Page …, line …, token …”.
Unknown reference formats show “Source location unavailable” rather than leaking internal syntax.

The contract provides verified numeric values and labels, not the uploaded PDF token text or a file preview; the UI does not claim to reconstruct those. No raw sourceRef, model, timing, hash or AI-call metadata is rendered.

## Responsive and accessibility checks

Desktop: three-column, border-based KPI layout; restrained typography and rules instead of decorative cards/gauges.
Tablet: two columns.
Mobile: one KPI column. Statement remains a financial table with controlled horizontal scrolling, not a card stack.
Table labels may wrap; numeric columns remain aligned. Native headings, caption, scope attributes, a labelled period select, focusable scrolling region and visible focus outlines remain.
Evidence summaries have specific accessible labels, keyboard activation and at least 44px target height. Severity and sign changes use text, not color alone.

Browser acceptance of the actual component in a local fixture-only preview:
- Controlled desktop: summary, six KPIs, five findings and unchanged statement rendered; switching to 2024 showed the existing 35% gross margin.
- Rieter mobile (390px): two Positive to negative states, both EPS labels and 18/36 statement preserved. Table width 377px within a 343px scrolling container; no document horizontal overflow.
- Missing-input tablet (768px): Unavailable and Not meaningful shown; no NaN/Infinity and no document horizontal overflow.
- Keyboard Enter opened KPI evidence; focus remained on SUMMARY with a solid outline. Evidence showed the expected Rieter Sales/Gross profit inputs and readable sheet/cell locations.
- Browser error check returned no errors.
- Screenshots retained locally under build/result-preview (not committed).

## Tests and engine freeze

Four focused component tests cover hierarchy, existing text, default closed evidence, telemetry exclusion, Rieter sign changes/EPS, missing/zero-prior states, source-value preservation and XLSX/PDF location formatting.

Quality gates:
- npm run typecheck: PASS.
- npm run lint: PASS; one pre-existing unused-variable warning in document-classifier/validator.ts.
- npx tsx --test tests/financial-intelligence/*.test.ts: 63/63 PASS.
- npm run build: PASS.
- git diff --check: PASS.

Verified empty diff against main for backend, app/api, lib and dependency manifests. Readers, model, prompt/schema, binding, verifier, normalization, formulas/statuses, Finance Domain exclusion and runtime are unchanged. Exactly one AI request per execution remains. This sprint made zero provider calls and zero production uploads.

## Remaining limitations / Sprint 04

This is local presentation acceptance, not authenticated production-result acceptance. Screenshot fixtures use existing accepted gold and Rieter data with deterministic Sprint 02 analysis. Screen-reader semantics and keyboard behavior were checked; a dedicated assistive-technology audit remains useful.

Evidence uses the locations and verified values already in the contract; source-file preview, original token excerpts and downloadable PDF are not added. Findings retain the engine's existing materiality heuristic. Large multi-period tables intentionally scroll.

Recommend Sprint 04 deliver a downloadable financial-analysis report from this same frozen result contract, preserving evidence, units, edge-case states and accessibility.

V1_CUSTOMER_RESULT_EXPERIENCE_PASS
