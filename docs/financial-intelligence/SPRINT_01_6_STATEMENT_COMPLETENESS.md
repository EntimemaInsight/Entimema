# Sprint 01.6 — Complete statement extraction, optional canonical mapping

Branch: codex/fi-uk-source-verification. Existing Draft PR #178, baseline e337c1c. Earlier Sprint 01.4/01.5 local work and evidence preserved.

## Contract change

The single interpretation prompt distinguishes Task A (complete source-present P&L presentation), Task B (optional canonical mapping), and Task C (source aggregation role). Canonical/KPI coverage is not a whitelist. Valid non-canonical, entity-specific, attribution and per-share lines remain eligible with concept null. A final completeness instruction explicitly covers valid lines after net income.

The existing label field is the unchanged source label; concept is the optional canonical layer. Every model line now requires aggregationRole: detail, subtotal or total. The source-reference/value representation is unchanged. Strict schema diagnostics recognize the new field. No semantic-category field or second AI call is necessary.

P&L/OCI boundary rules, reader hierarchy representation, source binder, verifier, metadata normalizer, period reconciliation, deterministic calculators and runtime are unchanged from Sprint 01.5. No row-specific or workbook-specific production rule was added. No Finance Domain runtime dependency, mapping service, retries, selectedSheet or numeric invention.

Tests use synthetic rows to prove that null-concept EPS and entity-specific presentation lines survive, their values remain exact, existing KPIs are unchanged, and OCI remains excluded. Existing UK hierarchy tests still pass. The retired-import guard remains repository-wide; its obsolete blanket ban on the word canonical in prompt text was removed because canonical concepts are explicitly part of the requested contract.

## Frozen live configuration

All three executions use gpt-4.1-2025-04-14, exactly one real request each, the same reader/core, and unchanged 120000 ms provider / 175000 ms application / 180 s route window. All returned provider HTTP 200 with completed responses. No retry or prompt tuning between files.

Identical instructions-plus-output-schema SHA-256 for all three:

d25b44f1326a8dc9cbba08dba41a95fa5953c9c8afba1f60c8297d51f8df3c3c

## Rieter — PASS

18 intended P&L lines / 36 source-grounded and verified values. Basic EPS and Diluted EPS are present. income_statement; CHF; millions; 2024/2025; OCI excluded. All 39 checks and all nine KPIs PASS. No missing intended lines.

Margins 2024/2025: gross 30.66% / 25.03%; operating 3.26% / -6.41%; net 1.21% / -9.25%. 2025 growth: revenue -20.25%; operating profit -256.79%; net income -709.62%.

## UK — required monetary statement PASS, with an additional valid source ratio

All 27 required monetary lines / 54 values are present and source-verified. Total Revenue is canonical revenue; component sales remains distinct. Both Current Year £ / Prior Year £ columns are included and variance excluded. The model also preserves the valid source Gross margin % row, giving 28 total lines / 56 verified values. This is disclosed rather than reporting exactly 27/54. It preserves the primary completeness rule; the existing audit permits this supplementary ratio. All original 91 checks pass plus three checks for the optional ratio (94/94 total).

All six applicable margins are correct: current/prior gross 52.77% / 54.73%; operating 1.09% / 0.74%; net -6.43% / -7.19%. Existing calculators do not infer calendar years from relative headers, so annual growth is not generated. A usable verified customer result is returned. No required monetary rows are missing.

## Third unrelated XLSX — FAILED at metadata normalization

The user explicitly authorized addnodegroup.xlsx from Downloads as the third workbook. US_SME_Income_Statement.xlsx was not used because read-only ZIP inspection confirmed empty saved formula results, including its aggregate revenue formula; it was not recalculated or modified.

The third model response contains all 19 source statement rows and all 304 references across 2010–2025. Provider HTTP 200, response completed, 5562 output tokens; not a timeout or truncated response. Schema validation succeeds.

Exact failure: METADATA_AMBIGUOUS at currency. The model returned currency MSEK and scale null. The unchanged normalizer accepts an ISO-style code with supported separated scale words, not this abbreviation combining millions with SEK. Runtime source binding/verification and calculations were not reached; 304 references must NOT be reported as 304 verified values. No final customer result or live KPIs were returned. No metadata patch, manual correction or second request was used to manufacture PASS.

Completeness of the interpreted row/reference set is promising but cannot substitute for a full passing execution. The three-workbook gate remains FAILED.

## Latency (informational, milliseconds)

| Stage | Rieter | UK | Third XLSX |
|---|---:|---:|---:|
| mechanicalReadMs | 53.76 | 36.02 | 159.60 |
| aiMs | 8295.37 | 9363.62 | 30063.15 |
| validationMs | 8.37 | 3.95 | 50.54 |
| verificationMs | 7.24 | 3.73 | 0 |
| calculationMs | 31.98 | 0.56 | 0 |
| totalMs | 8396.81 | 9407.92 | 30273.38 |

## Engineering gates and Git

PASS: npm run typecheck; npm run lint (zero errors, one pre-existing classifier warning); all 43 Financial Intelligence tests; npm run build (126 pages); git diff --check.

The model default is unchanged; the full model was selected only for these process-level acceptance executions. No production rollout is claimed.

Because the three-file gate did not pass, the conditional commit/push/PR update was not performed. All local changes, tests and evidence remain available, alongside prior sprint work. Draft PR #178 remains open, draft and unmerged at e337c1c. No source workbook or credential is committed.

Evidence: SPRINT_01_6_RIETER.json, SPRINT_01_6_UK.json and SPRINT_01_6_THIRD.json. The third acceptance command is scripts/fi-v1-third-acceptance.ts; its independent expected-row oracle is acceptance-only and is never imported by production.

THREE_WORKBOOK_GENERALIZATION_FAILED
