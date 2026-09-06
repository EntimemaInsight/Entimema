# Entimema Financial Intelligence V1 — AI Intake Dependency Audit

Status: IN PROGRESS — 2026-09-06  
Owner: Product  
Deadline: 2026-09-09  
Commercial impact: protects the P0 path to external validation and first paid execution by preventing silent fallback to the legacy semantic-preparation stack.

## Decision under audit

The only V1 customer Data Preparation path is:

`Upload → Mechanical Source Read → AI Financial Understanding → Source-Verified Financial Contract → Deterministic Financial Validation → Exception Review → Analysis → PDF`

Human Data Preparation input is upload only.

## Verified production execution path

`backend/api/financial-intelligence/http.ts` invokes `runAiNativeFinancialIntelligence(document)` from `ai-native-run.ts`.

The coordinator executes, in order:

1. `buildFinancialSourceRepresentation(document)`;
2. `understandFinancials(structure)`;
3. `hydrateUnderstanding(document, structure, understanding.result)`;
4. `validate(extracted.values, evidence, extracted.scale)`.

The HTTP contract rejects multipart keys other than `file`. `selectedSheet` is absent from this execution contract.

A regression guard is maintained in `tests/financial-intelligence/ai-native-boundary.test.ts`.

## Legacy semantic-preparation modules still present

The following code remains in the repository but is not part of the customer V1 HTTP execution path:

- `backend/financial-intelligence/extraction.ts` — deterministic statement/period/label extraction and mapping logic;
- `backend/financial-intelligence/model-mapping.ts` — previous bounded mapping assistant;
- `backend/financial-intelligence/interpretation/*` — previous semantic resolver / deterministic-section / ontology stack;
- the legacy execution function inside `backend/financial-intelligence/run.ts`.

These modules MUST NOT be reintroduced into the V1 upload execution path as fallback or compatibility behavior.

## Dependency extraction progress

### Integrity — extracted and AI-native decoupled

Run-integrity signing and verification live in the neutral infrastructure module:

`backend/financial-intelligence/integrity.ts`

The AI-native coordinator imports `withFinancialRunIntegrity` directly from `integrity.ts`, so loading the customer execution path no longer requires importing the legacy runner for integrity.

`run.ts` retains temporary compatibility behavior only for remaining legacy tests.

### Review replay / finalization — extracted

Exception-review replay and review finalization live in:

`backend/financial-intelligence/review.ts`

This module owns deterministic review task construction, review replay, post-review deterministic revalidation and run finalization. It contains no upload/data-preparation parser.

### Persistence — migrated

`backend/financial-intelligence/persistence/service.ts` imports integrity from `../integrity` and review replay from `../review`.

Durable persistence, analysis/report integrity checks, archive/revision operations and human review therefore no longer require the legacy runner as their authoritative dependency.

### Test migration — started

A purpose-built source-verified fixture now exists at:

`tests/financial-intelligence/fixtures/financial-run.ts`

`tests/financial-intelligence/persistence.test.ts` has been migrated away from:

- `runFinancialIntelligence`;
- XLSX construction used only to invoke the retired parser;
- integrity imports through `run.ts`.

It now tests persistence against a direct FinancialRun fixture representing the post-AI/source-verified contract.

## Remaining blockers to physical deletion

Remaining legacy test dependencies include:

- `tests/financial-intelligence/income-statement.test.ts` importing `extract`, `mapLabel`, `model-mapping`, and legacy `runFinancialIntelligence`;
- `tests/financial-intelligence/provider-reliability.test.ts` importing the old `interpretation/whole-statement` layer;
- `tests/financial-intelligence/semantic-acceptance-pipeline.test.ts` testing the old semantic acceptance pipeline;
- `tests/financial-intelligence/review-golden-path.test.ts` constructing its review fixture through legacy `runFinancialIntelligence`.

These tests must be migrated, replaced by AI-native boundary tests, or explicitly retired before physical deletion of the old modules.

## Dependency-safe retirement sequence

P0 order:

1. lock the AI-native execution boundary with regression tests — **implemented, execution pending**;
2. extract integrity signing/verification from `run.ts` — **implemented**;
3. extract review replay/finalization from the legacy execution module — **implemented**;
4. migrate persistence imports to extracted integrity/review modules — **implemented**;
5. migrate the AI-native coordinator integrity import directly to `integrity.ts` — **implemented**;
6. migrate FI golden-path/persistence/review tests to purpose-built AI-native/source-verified fixtures rather than the legacy parser — **in progress; persistence migrated**;
7. delete the legacy execution function and semantic-preparation modules once no production/test dependency remains — **pending**;
8. run TypeScript, lint, FI tests and build — **pending**;
9. execute the same production-equivalent path against Rieter Excel, unseen Excel and text-based PDF — **pending**.

## Current validation status

Architecture boundary: IMPLEMENTED, awaiting test execution.  
Integrity extraction: IMPLEMENTED.  
AI-native integrity decoupling: IMPLEMENTED.  
Review extraction: IMPLEMENTED.  
Persistence migration: IMPLEMENTED.  
Legacy test migration: IN PROGRESS.  
Legacy physical retirement: NOT YET COMPLETE.  
Production acceptance: NOT YET VERIFIED.  
Revenue OS capability status must remain Blocked until same-path production acceptance evidence exists.

No passing claim is made until typecheck, lint, FI tests and build have actually executed. No GitHub Actions run is currently attached to the latest branch head.

## Epistemic status

Verified evidence: repository imports, current PR execution route, extracted modules and migrated persistence test dependency.  
Assumption: none required for the dependency findings above.  
Hypothesis: completing the remaining test migration will permit physical legacy retirement without changing financial methodology.  
Decision: proceed dependency-safely; do not delete legacy modules merely to make the tree look clean.

`DOMAIN_KNOWLEDGE_GAP: none` — this audit changes architecture boundaries only and introduces no new financial methodology or control rule.
