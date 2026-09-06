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

## Verified dependency blocker to physical deletion

`run.ts` is not yet safe to delete because it also owns two non-intake responsibilities used by durable execution:

- run-integrity signing / verification (`withFinancialRunIntegrity`, `hasValidIntegrity`);
- exception-review replay (`replayFinancialReview`).

`backend/financial-intelligence/persistence/service.ts` imports those responsibilities from `run.ts`. The AI-native coordinator also currently imports `withFinancialRunIntegrity` from `run.ts`.

Therefore physical deletion of `run.ts` before responsibility extraction would risk persistence, analysis/report integrity checks, archive/revision operations and review replay.

## Legacy test dependency blocker

The existing FI test suite still contains direct tests of the retired architecture. Verified examples include:

- `tests/financial-intelligence/income-statement.test.ts` importing `extract`, `mapLabel`, `model-mapping`, and legacy `runFinancialIntelligence`;
- `tests/financial-intelligence/provider-reliability.test.ts` importing the old `interpretation/whole-statement` layer;
- `tests/financial-intelligence/semantic-acceptance-pipeline.test.ts` testing the old semantic acceptance pipeline;
- `tests/financial-intelligence/review-golden-path.test.ts` and `persistence.test.ts` constructing fixtures through legacy `runFinancialIntelligence`.

Deleting the old modules before migrating these tests would make `npm test` fail for reasons unrelated to the AI-native customer path.

## Dependency-safe retirement sequence

P0 order:

1. lock the AI-native execution boundary with regression tests — **implemented**;
2. extract integrity signing/verification from `run.ts` into a neutral infrastructure module;
3. extract review replay/finalization from the legacy execution module, preserving deterministic validation and human exception handling;
4. update persistence and AI-native imports to the extracted modules;
5. migrate FI golden-path/persistence/review tests to construct runs through AI-native contracts or purpose-built fixtures rather than the legacy parser;
6. delete or archive the legacy execution function and semantic-preparation modules once no production/test dependency remains;
7. run TypeScript, lint, FI tests and build;
8. execute the same production-equivalent path against Rieter Excel, unseen Excel and text-based PDF.

## Current validation status

Architecture boundary: IMPLEMENTED, awaiting test execution.  
Legacy physical retirement: BLOCKED by identified integrity/review/test dependencies.  
Production acceptance: NOT YET VERIFIED.  
Revenue OS capability status must remain Blocked until same-path production acceptance evidence exists.

## Epistemic status

Verified evidence: repository imports, current PR execution route and current test dependencies.  
Assumption: none required for the dependency findings above.  
Hypothesis: extracting integrity/review responsibilities will allow physical legacy retirement without changing financial methodology.  
Decision: proceed dependency-safely; do not delete legacy modules merely to make the tree look clean.

`DOMAIN_KNOWLEDGE_GAP: none` — this audit changes architecture boundaries only and introduces no new financial methodology or control rule.
