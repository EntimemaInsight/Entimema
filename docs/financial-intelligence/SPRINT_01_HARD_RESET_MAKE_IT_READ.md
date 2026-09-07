# Sprint 01 — Hard reset / Make it read

Date: 7 September 2026. Branch: `codex/fi-v1-hard-reset`.
Baseline: current `origin/main` at `07d4ed3` when the isolated worktree was created.

## Acceptance outcome

The real command `npm run test:fi:v1-core-acceptance` was executed with the existing authorized `OPENAI_API_KEY`. OpenAI returned HTTP **401**. The request was not authenticated; no model statement or useful analysis was returned. The key was not created, rotated, printed or copied. This sprint has **not** passed the real-file acceptance gate.

Machine-readable evidence: [SPRINT_01_ACCEPTANCE.json](./SPRINT_01_ACCEPTANCE.json).

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

## New execution path

`File → readMechanically → one OpenAI Responses request → verifyStatement → calculate → result`

The production `app/api/financial-intelligence/run/route.ts` uses `createFinancialIntelligenceHandler`, which calls `executeV1` in `backend/financial-intelligence/v1/core.ts`. The real acceptance command imports and calls that exact same function without an injected transport. It does not use `goldStatement()` or any AI mock.

The only accepted multipart field is one `file`. The UI uses Upload → Processing → Result, renders statement/entity/currency/scale/periods, all returned source labels and values with references, deterministic KPIs and qualitative analysis. No second analysis request, mapping input, sheet choice, review workflow or PDF generation is present.

The mechanical reader visits all workbook sheets and populated cells without financial classification, preserving qualified sheet/cell references and primitive raw/displayed values. CSV follows the same rule. Text PDFs use ordered page/line/token references. Limits fail explicitly instead of silently truncating content.

The model response has only `statementType`, `entity`, `currency`, `scale`, `periods`, `lines`, `summary` and `findings`. Line fields preserve the source label, source row, optional concept and period/reference/value tuples. The HTTP result adds only KPIs, verification count, model/call metadata and timings.

## ZERO Finance Domain dependency

The new V1 core has **ZERO Finance Domain dependency**. It performs no Domain query, ontology lookup/compilation, relationship traversal or methodological-variant resolution. No Finance Domain base or records were modified. The repository-wide guard rejects imports of retired FI modules; the V1 boundary test rejects Domain/ontology/old intake/mapping/sheet-selection dependencies.

## Model and request count

Exact attempted model: **`gpt-4.1-mini-2025-04-14`**.

Exactly **one AI request per executable document**: one Responses call, one transport attempt, no SDK retries, no second analysis call. Invalid files or absent credentials stop before a request. The real acceptance attempted one request and received HTTP 401. No successful model generation occurred.

The existing 7,000 ms AI budget and 10-second HTTP route ceiling were retained; no timeout was increased. OpenAI response storage is disabled with `store: false`.

## Gold-file result and source verification

The controlled workbook exists at `tests/fixtures/financial-intelligence/minimal-income-statement.xlsx`, with one `P&L` sheet. Mechanical reading and unit/contract tests confirm all 33 populated cells, including 18 financial numeric values. Its visual preview was inspected.

The table below is the **mechanically read fixture and unit-test evidence**, not a successful live AI output. Live gold output is unavailable because authentication failed.

| Source row | Line | 2025 / column B | 2024 / column C |
|---|---|---:|---:|
| 5 | Revenue | 1200 | 1000 |
| 6 | Cost of Sales | -720 | -650 |
| 7 | Gross Profit | 480 | 350 |
| 8 | Operating Expenses | -250 | -220 |
| 9 | Operating Profit | 230 | 130 |
| 10 | Finance Costs | -30 | -20 |
| 11 | Profit Before Tax | 200 | 110 |
| 12 | Income Tax | -50 | -28 |
| 13 | Net Income | 150 | 82 |

Source metadata: Income Statement, EUR, thousands, periods 2025 and 2024. Entity is unstated. Each numeric reference is sheet-qualified, for example `'P&L'!B5` is 1200 and `'P&L'!C13` is 82.

The deterministic verifier performs exact numeric lookup/comparison and checks source row/label association, unique references and periods. Spreadsheet period headers must appear above the referenced value in the same column. Any mismatch fails the result closed; no unverified value is silently accepted or used for arithmetic. The core conservatively rejects mismatches instead of guessing that an AI association is valid and replacing its value.

Tests prove that invented numbers/references, altered labels, duplicate rows/references, incorrect source rows and swapped periods fail. Strict contract validation rejects extra fields, non-finite values, invalid JSON and incomplete responses. Numeric digits/percent claims in analysis prose are rejected; findings are requested to be qualitative.

Deterministic gold KPIs verified in unit tests: revenue growth 20%; gross margin 40% / 35%; operating margin 19.17% / 13%; net margin 12.5% / 8.2% for 2025 / 2024. Live verification/calculation/analysis were not reached.

## Measured real-attempt latency

| Measurement | Milliseconds | Meaning |
|---|---:|---|
| mechanicalReadMs | 22.22 | Gold XLSX mechanical read |
| aiMs | 489.15 | Request rejected with HTTP 401 |
| verificationMs | 0 | Not reached |
| calculationMs | 0 | Not reached |
| totalMs | 511.40 | Failed attempt, not successful time-to-result |

The mechanical-read target passed. A successful total latency and live verification/calculation latency cannot be claimed. The exact blocker is provider authentication, not evidence of inference speed. No timeout was extended.

## Quality gates

- `npm run typecheck`: PASS, exit 0, after the PDF fix.
- `npm run lint`: PASS, exit 0. One pre-existing warning in `backend/agents/document-classifier/validator.ts:8` (`_ignored` unused); zero errors.
- `npx tsx --test tests/financial-intelligence/*.test.ts`: PASS, **16/16**. Covers XLSX/XLS/CSV/PDF, source references and verification, arithmetic, one-call/no-retry behavior, malformed responses, upload-only input, authentication/request-size boundary, empty PDFs, oversized workbook rejection and the repository-wide retirement guard.
- `npm run build`: PASS, exit 0. Next.js 16.3.3 compiled successfully and generated 126 pages. The FI run route and workspace are present; retired FI endpoints are absent.
- `git diff --check`: PASS, exit 0.
- `npm run test:fi:v1-core-acceptance`: EXECUTED against the real provider, exit 1, HTTP 401 authentication failure. **Not mocked; not passed.**

Installed Next.js docs were missing/empty. The installed agent-file generator and official Next.js route-handler documentation were inspected as fallback. The React boundary review confirms the UI imports only the V1 result type, with no server runtime bundled into the client.

## Known limitations

- Live extraction accuracy, useful AI findings and successful sub-10-second performance remain unverified until the existing provider-access configuration authenticates successfully. Re-run the same acceptance command after that external issue is resolved; no key rotation/creation was performed.
- No saved run history, advanced review, PDF export, OCR, Balance Sheet, Cash Flow, Domain integration or subscriptions.
- Safety limits: 4.5 MB upload, 50 sheets/pages, 20,000 populated cells/tokens, 120,000 compact text characters and 2,001 spreadsheet rows. Oversized inputs fail explicitly. Formula values use saved results; formulas without cached values fail instead of being calculated or invented.
- Ambiguous textual numeric separators, nonstandard/multiline layouts, cross-page PDF headers and ambiguous multiple statements can fail closed. PDF period presence is checked, but PDF column semantics are not deterministically verified.
- Financial concept, entity/currency/scale identification and qualitative interpretation remain model judgments. Exact numeric grounding does not prove every semantic association or qualitative statement. Prose is not independently financially audited.
- Growth is calculated only for explicit consecutive annual labels with a positive prior revenue. Ratios require unique optional concepts and positive revenue; unavailable inputs produce no KPI. This deliberately avoids guessing comparable periods or manufacturing denominators.
- Authenticated browser-to-provider acceptance could not be completed with the rejected credential. HTTP and UI wiring are covered by tests/build, not claimed as a successful authenticated browser session.
- Rate limiting remains the existing best-effort per-process implementation.


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

V1_CORE_ACCEPTANCE_BLOCKED_BY_PROVIDER_ACCESS
