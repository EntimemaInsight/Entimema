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

Run-integrity signing and verification have now been physically extracted from the legacy execution coordinator into:

`backend/financial-intelligence/integrity.ts`

The extracted module owns:

- deterministic canonical JSON signing;
- `withFinancialRunIntegrity`;
- `hasValidIntegrity`.

`run.ts` currently retains only a compatibility re-export while downstream imports are migrated. This is intentionally transitional: the integrity implementation itself no longer lives in the legacy semantic execution module.

The remaining material non-intake responsibility inside `run.ts` is exception-review replay/finalization (`replayFinancialReview`) plus the legacy `runFinancialIntelligence` execution function.

## Verified dependency blocker to physical deletion

`run.ts` is still not safe to delete because exception-review replay/finalization remains there and is consumed by durable persistence.

`backend/financial-intelligence/persistence/service.ts` still imports review replay and integrity through the compatibility surface of `run.ts`. The AI-native coordinator also still imports the integrity helper through that compatibility surface.

Therefore the next dependency-safe step is to extract review replay/finalization, then move consumers to the neutral modules before deleting the legacy coordinator.

## Legacy test dependency blocker

The existing FI test suite still contains direct tests of the retired architecture. Verified examples include:

- `tests/financial-intelligence/income-statement.test.ts` importing `extract`, `mapLabel`, `model-mapping`, and legacy `runFinancialIntelligence`;
- `tests/financial-intelligence/provider-reliability.test.ts` importing the old `interpretation/whole-statement` layer;
- `tests/financial-intelligence/semantic-acceptance-pipeline.test.ts` testing the old semantic acceptance pipeline;
- `tests/financial-intelligence/review-golden-path.test.ts` and `persistence.test.ts` constructing fixtures through legacy `runFinancialIntelligence`.

Deleting the old modules before migrating these tests would make `npm test` fail for reasons unrelated to the AI-native customer path.

## Dependency-safe retirement sequence

P0 order:

1. lock the AI-native execution boundary with regression tests — **implemented, execution pending**;
2. extract integrity signing/verification from `run.ts` into a neutral infrastructure module — **implemented, execution pending**;
3. extract review replay/finalization from the legacy execution module, preserving deterministic validation and human exception handling — **next**;
4. update persistence and AI-native imports to the extracted modules and remove the compatibility re-export;
5. migrate FI golden-path/persistence/review tests to construct runs through AI-native contracts or purpose-built fixtures rather than the legacy parser;
6. delete or archive the legacy execution function and semantic-preparation modules once no production/test dependency remains;
7. run TypeScript, lint, FI tests and build;
8. execute the same production-equivalent path against Rieter Excel, unseen Excel and text-based PDF.

## Current validation status

Architecture boundary: IMPLEMENTED, awaiting test execution.  
Integrity extraction: IMPLEMENTED, awaiting test execution.  
Legacy physical retirement: BLOCKED by review/test dependencies.  
Production acceptance: NOT YET VERIFIED.  
Revenue OS capability status must remain Blocked until same-path production acceptance evidence exists.

No GitHub Actions workflow run is currently available for this PR branch, so this audit does not claim that typecheck, lint, tests or build have passed.

## Epistemic status

Verified evidence: repository imports, current PR execution route, extracted integrity implementation and current test dependencies.  
Assumption: none required for the dependency findings above.  
Hypothesis: extracting review responsibilities next will allow persistence and tests to detach from the legacy execution coordinator.  
Decision: proceed dependency-safely; do not delete legacy modules merely to make the tree look clean.

`DOMAIN_KNOWLEDGE_GAP: none` — this audit changes architecture boundaries only and introduces no new financial methodology or control rule.
