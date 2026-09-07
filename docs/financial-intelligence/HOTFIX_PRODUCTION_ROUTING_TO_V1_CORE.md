# Hotfix — Production routing to the V1 core

Date: 7 September 2026. Base: merged main at `4f15cb0b6744c8fda3abadc3e24007e3396d2b4c` (PR #174). Branch: `codex/fi-production-routing-hotfix`.

## Exact finding

No stale classifier execution hop was found on current main. The page already calls the accepted V1 core directly. The stale hop is error presentation: shared transport throws `AgentError(OPENAI_TIMEOUT)`; `backend/lib/errors.ts` assigns the classifier-specific default “Document classification timed out.”; the FI HTTP handler forwarded that message; the workspace displayed it.

This text does not prove classifier execution or an obsolete deployment. The underlying timeout remains a real error and is not hidden by this hotfix.

## Routing map — before and after

`/workspace/financial-intelligence` page → `FinancialIntelligenceWorkspace` Execute/onClick → `POST /api/financial-intelligence/run` → `createFinancialIntelligenceHandler` → `executeV1` → mechanical read, one OpenAI request, source binding/verification, deterministic KPIs and result.

The real acceptance script imports the same executeV1 function. No classifier endpoint or server action is called between upload and V1. There is one public FI workspace page and one active FI execution API route; the financial-intelligence-launch page is marketing. The independent document classifier remains a separate product.

Old error path: V1 → shared transport error code → shared classifier wording → FI HTTP JSON → workspace alert.

New error path: V1 → same error code/status → FI-specific HTTP wording → workspace alert. OPENAI_TIMEOUT remains an error with its original HTTP status and now reads “Financial intelligence execution timed out.” Provider unavailability, rate limits and invalid responses also receive FI wording.

## Files changed

- `backend/api/financial-intelligence/http.ts`: FI-local message mapping; error codes and statuses preserved.
- `tests/financial-intelligence/v1-http-and-boundary.test.ts`: public page/Execute/route/core wiring guard, classifier execution import/endpoint guard, and HTTP failure regressions.
- This report.

No classifier execution dependency needed removal: none exists on the traced path. Shared upload-limit constants are retained infrastructure. The classifier's own error catalog is unchanged. No edits to the V1 directory, model, prompt, timeout, reader, source verification, deterministic calculations, Finance Domain status or upload-only UX.

## Production deployment evidence

Production URL: https://entimema.com/workspace/financial-intelligence (canonical host www.entimema.com).

Vercel CLI inspection resolves the production aliases entimema.com and www.entimema.com to READY production deployment `dpl_HL9XsFuFY65V3NG1ogxBbmcRRPCS`, URL https://entimema-ojvtuv84m-entimema.vercel.app, created 7 September 2026 at 08:44:19 UTC. GitHub's successful Vercel status on exact commit `4f15cb0b6744c8fda3abadc3e24007e3396d2b4c` points to that same deployment ID. Production is current with merged PR #174, not stale. No stale-main redeployment is needed.

The Vercel connector returned 403 for team scope; existing Vercel CLI access succeeded. Unauthenticated HTTP GET reaches the expected sign-in page with HTTP 200 and a callback to the FI page. This proves public reachability/auth routing, not authenticated Execute acceptance. Browser automation could not initialize because its Windows sandbox ACL helper failed.

## Existing production V1 execution evidence

Read-only Vercel runtime logs from the current deployment prove that production POSTs already reach the V1 HTTP/CoreError boundary. Three requests to /api/financial-intelligence/run on 7 September 2026 returned HTTP 504 with OPENAI_TIMEOUT and aiCalls=1:

| UTC | Mechanical ms | AI ms | Total ms |
|---|---:|---:|---:|
| 08:46:25.816 | 51.46 | 7014.10 | 7065.59 |
| 08:46:37.783 | 16.24 | 7004.34 | 7020.60 |
| 08:46:48.945 | 32.93 | 7008.60 | 7041.57 |

Validation, verification and calculation were not reached (all zero). These are pre-existing production requests, not new acceptance executions triggered by this hotfix. Only structural fields were inspected; no customer files, response bodies or credentials are included. The exact remaining product failure is the live provider request exceeding the existing V1 AI budget. This task deliberately does not change that budget, model or prompt.

## Quality gates

- npm run typecheck: PASS.
- npm run lint: PASS, zero errors; one pre-existing unused _ignored warning in the separate classifier validator.
- npx tsx --test tests/financial-intelligence/*.test.ts: PASS, 21/21.
- npm run build: PASS, 126 pages. Initial linked-dependency build failed because Turbopack rejects an external node_modules junction; a local dependency copy resolved the worktree setup issue with no product/config change.
- git diff --check: PASS.
- V1 core directory and shared classifier error catalog: byte-for-byte unchanged from merged main.

## Remaining production acceptance

This hotfix is proposed in a PR, not merged or deployed. Per instruction, do not merge automatically. After authorized merge and normal production deployment, confirm the deployment SHA includes the hotfix commit, sign in, upload the gold workbook, and inspect the single POST to /api/financial-intelligence/run. Confirm its response/logs originate from executeV1 and timeout failures retain their error codes with FI-specific text. No successful authenticated production execution or final product acceptance is claimed here.
