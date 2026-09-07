# Sprint 01 — Hard reset / Make it read

Updated 7 September 2026 after Sprint 01.2 live acceptance. Branch: codex/fi-v1-hard-reset. Draft PR #174 remains unmerged.

## Deleted architecture

35 obsolete FI files were removed. The pre-implementation [deletion/preservation manifest](./SPRINT_01_DELETION_MANIFEST.md) records every retired path and the boundary of the audit.

Retired components include structural representation, financial understanding v2, canonical contracts and hydration, validation orchestration, analysis, integrity/review/retention state, report generation, coupled persistence adapters, historical run/review/revision/report endpoints, the old client failure/workflow representation, and their obsolete tests/corpus. The workspace and HTTP handler were replaced in place. Existing database records and migrations were not deleted.

## Preserved infrastructure

- Authentication/session: `auth.ts`, `lib/execution-auth.ts`, `lib/workspace-auth.ts` and the workspace shell.
- Upload safety: `backend/lib/files.ts`, extension/MIME/signature checks, the 4.5 MB file limit, request limit and private upload infrastructure. The FI HTTP handler also bounds the actual request stream before multipart parsing.
- Shared rate limiting and `backend/lib/openai.ts`. The V1 core configures one transport attempt; SDK retries are disabled.
- SheetJS and pdf-parse mechanical libraries. PDF input uses native typed-array semantics to avoid legacy PDF.js incompatibility with Node Buffer slicing. Page extraction failures are explicitly checked because pdf-parse swallows callback errors.
- Database migrations, existing records and operator authorization infrastructure. No new run persistence or history is claimed by this sprint.
- Independent document classifier, its financial-intake feature/tests, Python entimema-ai, public website, Insights, Engineering and unrelated user working changes.


## Accepted execution path

File → readMechanically → one real OpenAI request → strict minimal-contract validation → sourceRef binding → verifyStatement → calculate and deterministic firstAnalysis → result. The production HTTP handler and acceptance both call executeV1. The workspace posts one file to that route. ZERO Finance Domain dependency. No mapping, sheet selection, legacy execution modules or second AI call.

Exact default and accepted model: gpt-4.1-nano-2025-04-14, reasoning omitted. One request, one attempt, zero retries, unchanged 7000 ms AI budget.

## Gold result and verification

Real HTTP 200 acceptance passed: income_statement, EUR, thousands, periods 2025 and 2024. All nine lines and 18 numbers are correct and source-bound; deterministic verification passed.

| Financial line | 2025 | 2024 | Source references |
|---|---:|---:|---|
| Revenue | 1200 | 1000 | 'P&L'!B5 / 'P&L'!C5 |
| Cost of Sales | -720 | -650 | 'P&L'!B6 / 'P&L'!C6 |
| Gross Profit | 480 | 350 | 'P&L'!B7 / 'P&L'!C7 |
| Operating Expenses | -250 | -220 | 'P&L'!B8 / 'P&L'!C8 |
| Operating Profit | 230 | 130 | 'P&L'!B9 / 'P&L'!C9 |
| Finance Costs | -30 | -20 | 'P&L'!B10 / 'P&L'!C10 |
| Profit Before Tax | 200 | 110 | 'P&L'!B11 / 'P&L'!C11 |
| Income Tax | -50 | -28 | 'P&L'!B12 / 'P&L'!C12 |
| Net Income | 150 | 82 | 'P&L'!B13 / 'P&L'!C13 |

Code owns sourceRef → number. The model returns no numeric value or prose; strict schema validation rejects extra values. Verification retains exact row/label/sheet/period/reference checks. Deterministic revenue growth is 20%; margins (2025/2024): gross 40%/35%, operating 19.17%/13%, net 12.5%/8.2%. Operating profit growth is 76.92%; net income growth is 82.93%. First observations are deterministic.

## Latency

| Stage | Milliseconds |
|---|---:|
| mechanicalReadMs | 15.22 |
| aiMs | 5757.44 |
| validationMs | 4.42 |
| verificationMs | 2.42 |
| calculationMs | 102.14 |
| totalMs | 5881.71 |

## Tests and limitations

Typecheck PASS; FI tests 19/19 PASS; production build PASS (126 pages). Lint and final diff check are recorded in the Sprint 01.2 report. Only one successful live sample is claimed. No authenticated browser acceptance is claimed. OCR is unsupported; oversized and ambiguous inputs fail closed. Metadata/concepts remain model judgments. Growth requires comparable annual periods and positive prior denominators.

Historical recovery: original credential HTTP 401, then mini timeout; Sprint 01.1 candidates failed their gates. Sprint 01.2 is the first successful live acceptance. See [detailed report](./SPRINT_01_2_MINIMAL_OUTPUT_CONTRACT.md), [live evidence](./SPRINT_01_ACCEPTANCE.json), and historical benchmark JSON files.

## Exact file inventory

Deleted files (35):

- `app/api/financial-intelligence/runs/[runId]/analysis/route.ts`
- `app/api/financial-intelligence/runs/[runId]/archive/route.ts`
- `app/api/financial-intelligence/runs/[runId]/report/route.ts`
- `app/api/financial-intelligence/runs/[runId]/review/route.ts`
- `app/api/financial-intelligence/runs/[runId]/revision/route.ts`
- `app/api/financial-intelligence/runs/[runId]/route.ts`
- `app/api/financial-intelligence/runs/[runId]/telemetry/route.ts`
- `app/api/financial-intelligence/runs/review/route.ts`
- `app/api/financial-intelligence/runs/route.ts`
- `app/workspace/components/financial-intelligence-failure.ts`
- `backend/api/financial-intelligence/persisted-http.ts`
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

Created files (14):

- `app/workspace/components/FinancialIntelligenceWorkspace.module.css`
- `backend/financial-intelligence/v1/calculate.ts`
- `backend/financial-intelligence/v1/contract.ts`
- `backend/financial-intelligence/v1/core.ts`
- `backend/financial-intelligence/v1/reader.ts`
- `backend/financial-intelligence/v1/verify.ts`
- `docs/financial-intelligence/SPRINT_01_ACCEPTANCE.json`
- `docs/financial-intelligence/SPRINT_01_DELETION_MANIFEST.md`
- `docs/financial-intelligence/SPRINT_01_HARD_RESET_MAKE_IT_READ.md`
- `scripts/fi-v1-core-acceptance.ts`
- `tests/financial-intelligence/gold.ts`
- `tests/financial-intelligence/v1-core.test.ts`
- `tests/financial-intelligence/v1-http-and-boundary.test.ts`
- `tests/fixtures/financial-intelligence/minimal-income-statement.xlsx`


Additional Sprint 01.1/01.2 files: model.ts, bind.ts, diagnostics.ts, observations.ts, model benchmark script, model/diagnostic tests, benchmark reports/JSON and Sprint 01.2 report/attempt evidence.

V1_CORE_ACCEPTANCE_PASS
