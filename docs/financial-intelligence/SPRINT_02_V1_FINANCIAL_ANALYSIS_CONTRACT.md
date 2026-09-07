# Sprint 02 — V1 Financial Analysis Contract

## Current-state audit

Base: main cfe44499980f15d9ac00665e75303aa870f4ee3d (merged PR #179).

The production route calls executeV1: mechanical reader -> one extraction request -> schema/metadata validation -> deterministic source binding -> strict verification -> P&L semantic normalization -> calculation -> observations -> customer result. Source verification runs before analysis. The extraction contract expressly forbids summaries, findings and calculated numbers. Summary/findings were already deterministic, not AI prose.

Existing calculate.ts owned margins and revenue growth. observations.ts additionally calculated operating-profit and net-income growth, making arithmetic ownership split. Invalid/missing inputs were silently omitted, and positive-to-negative growth could appear as a conventional percentage. Kpi only held label/period/value/unit; findings were strings without evidence references. Result exposed verified statement lines, kpis, summary, findings, model, AI call count and timings.

The workspace rendered statement and raw references first, then valid KPI cards and interpretation. Calculation, gold, completeness, UK structure and source-verification tests existed. The only duplicated analysis responsibility found was arithmetic in observations.ts; that responsibility is now consolidated. No retired FI execution modules are restored. The separate document-classifier infrastructure remains untouched.

## Reuse and change surface

Reused and extended: v1/contract.ts, calculate.ts, observations.ts, FinancialIntelligenceWorkspace.tsx. Updated existing calculation assertions and Rieter audit; added v1-analysis.test.ts.

Unchanged: executeV1 and its ordering; provider/model configuration; extraction instructions/schema; route; reader; XLSX/PDF numeric and period handling; metadata normalization; source binding; strict verifier; semantic normalization; runtime deadlines; retries (none). No Finance Domain import, service, Airtable call, graph traversal, lookup or new runtime dependency.

No production upload or provider request was performed. Tests use the existing transport seam with controlled extraction output through the real core; they are not live-provider acceptance claims.

## Methodology and Domain evidence

All six measures are Product analytical conventions. Values are percentages, rounded to two decimal places after calculation:

| Measure | Formula |
| --- | --- |
| Revenue Growth | (current revenue / prior revenue - 1) * 100 |
| Gross Margin | gross profit / revenue * 100 |
| Operating Margin | operating profit / revenue * 100 |
| Net Margin | net income / revenue * 100 |
| Operating Profit Growth | (current operating profit / prior operating profit - 1) * 100 |
| Net Income Growth | (current net income / prior net income - 1) * 100 |

Design-time evidence supplied by Product: Gross Margin and Net Margin are Finance Domain PROPOSED_ABSTRACTION, lifecycle ABSTRACTED, confidence HIGH. This is recorded evidence, not a runtime lookup or a claim of Domain approval.

DOMAIN_KNOWLEDGE_GAP:
- Operating Margin.
- Revenue historical growth convention.
- Operating Profit historical growth convention.
- Net Income historical growth convention.

These await separate Domain review. Finance Domain was not modified.

## Contract and ownership

Result.analysis contains:
- kpis: six typed entries per source period, stable measure:period IDs, label, margin/growth type, currentPeriod, explicit nullable priorPeriod, available current/prior operands, margin denominator, required sourceConcepts, verified evidence (concept, period, original sourceRef, exact value), and a discriminated status.
- executiveSummary: at most three deterministic finding sentences.
- findings: up to five findings, stable IDs, title, statement, severity and evidence KPI IDs/source concepts.

Top-level kpis remains a valid-only compatibility projection; top-level summary/findings are projections of analysis. No second arithmetic or interpretation path exists. The customer UI consumes analysis, so unavailable cases are explicit instead of disappearing.

AI only extracts source references and semantic labels. Code retrieves financial values, verifies them, computes all KPI percentages and generates interpretation. One extraction request remains; no second request is necessary.

## Edge cases

- valid: finite result with value and percent unit.
- unavailable: missing/non-unique concept or period value, unsupported annual comparison, zero revenue, or non-finite arithmetic. Includes reason; no percentage.
- not_meaningful: prior value equals zero (including current=0); operands retained, no percentage.
- sign_change: strictly opposite signs; operands and positive_to_negative / negative_to_positive direction retained, no conventional percentage.
- Zero current with nonzero prior is calculated normally; zero is not an opposite sign.
- Two negative operands follow the requested signed-prior formula; findings explicitly warn that the percentage alone does not indicate improvement.
- Growth retains the established conservative rule: explicit consecutive four-digit annual periods only. No guessed dates, durations or prior periods.
- Missing aggregates are never synthesized from detail lines.

## Interpretation and customer experience

Deterministic templates prioritize sign changes and larger changes, target 3–5 findings, and explain missing-input limitations when evidence is sparse. Margin comparisons reference both KPI IDs; growth and sign-change findings reference their own source-backed KPI. No causal attribution is generated. Severity describes observed financial direction, not a diagnosis.

UI order: Executive Summary -> Key Performance Indicators -> Key Findings -> Verified Income Statement. Native source references remain available in collapsed Source evidence disclosures. Sign changes show direction and both source operands. No visual redesign or PDF export was added.

## Acceptance and regression

- Controlled profitable gold: all six current-period formulas checked against independent expected percentages; inputs unchanged.
- Accepted Rieter row fixture: 18 lines / 36 values, both EPS rows retained. Operating-profit and net-income growth are sign_change; operating margin -6.41%, net margin -9.25%.
- Missing/duplicate concept, zero prior, zero revenue, reverse sign change, two losses, nonconsecutive periods and overflow: explicit safe statuses.
- Each KPI evidence reference/value is checked against fixture lines. Each finding references existing KPI IDs and present source concepts. No causal claims.
- Five controlled edge fixtures traverse executeV1 with exactly one mocked extraction transport request, real reader/binding/verification, unchanged lines and verified-value counts.
- Existing PDF numeric/period, XLSX, hierarchy, completeness, invalid-value/reference, timeout/no-retry and architecture-exclusion regressions remain in the suite.
- Financial Intelligence suite: 59/59 PASS.
- Typecheck: PASS.
- Lint: PASS, with one pre-existing unused-variable warning in document-classifier/validator.ts.
- Build: PASS (npm run build).
- git diff --check: PASS.

Initial build setup used a dependency junction rejected by Turbopack; it was replaced with a local dependency copy, without changing product configuration.

## Limitations / Sprint 03

Source verification proves numeric grounding, not the semantic truth of every extracted canonical label. Existing semantic safeguards remain unchanged. Template interpretation is deliberately limited to supported P&L evidence and cannot infer causes or business context. The ranking is a simple deterministic heuristic, not a formal materiality policy. Ambiguous date labels remain unavailable for growth. Compatibility consumers should migrate to analysis for explicit status handling.

Recommend Sprint 03 focus on customer presentation of comparisons/statuses and accessible evidence drill-down, followed by the downloadable result design; preserve this deterministic analysis contract.

V1_ANALYSIS_CONTRACT_PASS
