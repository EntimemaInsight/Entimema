# Sprint 01 deletion / preservation manifest

Audit baseline: origin/main 07d4ed3. Created before replacement implementation.

## Retire

The following modules implement the superseded understanding, structural representation, canonical mapping, hydration, validation, analysis, report, review, and coupled persistence contracts. Their dedicated tests are retired with them. Database tables and existing records remain untouched.

- `app/api/financial-intelligence/runs/[runId]/analysis/route.ts`
- `app/api/financial-intelligence/runs/[runId]/archive/route.ts`
- `app/api/financial-intelligence/runs/[runId]/report/route.ts`
- `app/api/financial-intelligence/runs/[runId]/review/route.ts`
- `app/api/financial-intelligence/runs/[runId]/revision/route.ts`
- `app/api/financial-intelligence/runs/[runId]/route.ts`
- `app/api/financial-intelligence/runs/[runId]/telemetry/route.ts`
- `app/api/financial-intelligence/runs/review/route.ts`
- `app/api/financial-intelligence/runs/route.ts`
- `backend/financial-intelligence/ai-native-run.ts`
- `backend/financial-intelligence/analysis.ts`
- `backend/financial-intelligence/financial-understanding-v2.ts`
- `backend/financial-intelligence/financial-understanding.ts`
- `backend/financial-intelligence/integrity.ts`
- `backend/financial-intelligence/persistence/contracts.ts`
- `backend/financial-intelligence/persistence/index.ts`
- `backend/financial-intelligence/persistence/service.ts`
- `backend/financial-intelligence/persistence/supabase.ts`
- `backend/financial-intelligence/report.ts`
- `backend/financial-intelligence/retention.ts`
- `backend/financial-intelligence/review.ts`
- `backend/financial-intelligence/schema.ts`
- `backend/financial-intelligence/structural-representation.ts`
- `backend/financial-intelligence/validation.ts`
- `tests/financial-intelligence/ai-native-boundary.test.ts`
- `tests/financial-intelligence/analysis.test.ts`
- `tests/financial-intelligence/client-failure.test.ts`
- `tests/financial-intelligence/evaluation/corpus.json`
- `tests/financial-intelligence/fixtures/financial-run.ts`
- `tests/financial-intelligence/persistence.test.ts`
- `tests/financial-intelligence/report.test.ts`
- `tests/financial-intelligence/supabase-persistence.test.ts`
- `tests/financial-intelligence/unified-financial-understanding.test.ts`
- `backend/api/financial-intelligence/persisted-http.ts`
- `app/workspace/components/financial-intelligence-failure.ts`

## Replace in place

- `backend/api/financial-intelligence/http.ts`: retain authorization, rate limiter and safe upload checks; invoke the new core.
- `app/api/financial-intelligence/run/route.ts`: retain the Node route and 10-second ceiling.
- `app/workspace/components/FinancialIntelligenceWorkspace.tsx`: Upload → Processing → Result.
- `app/workspace/financial-intelligence/page.tsx`: retain workspace session; remove operator dependency.

## Preserve

- `auth.ts`, `lib/execution-auth.ts`, `lib/workspace-auth.ts`, workspace shell/session.
- `backend/lib/files.ts`, upload limits, signatures, private upload infrastructure and rate limiting.
- `backend/lib/openai.ts`: shared Responses transport, configured to one attempt.
- SheetJS and pdf-parse libraries; no financial heuristics reused.
- `migrations/*`, existing database/base/records, operator authorization infrastructure. Old FI persistence adapters cannot be reused independently of the retired contract.
- Document classifier, including its independent financial-intake feature and tests.
- Python entimema-ai, marketing, Insights, Engineering and all unrelated functionality.

## New path

File → mechanical reader → one Responses request → source verification → arithmetic → immediate result. No saved history/review/report endpoints in Sprint 01. No Finance Domain reads, writes, compilation, ontology or mapping dependency.
