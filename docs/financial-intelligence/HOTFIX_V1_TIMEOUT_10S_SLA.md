# Hotfix — V1 timeout aligned with the 10-second SLA

Branch: codex/fi-timeout-sla. Base main: 4f15cb0b6744c8fda3abadc3e24007e3396d2b4c. PR #175 was still open; its wording fix is included as a separate cherry-picked commit. This PR can be reviewed after #175 or as its superset. Neither is merged automatically.

## Budgets

| Boundary | Old | New |
|---|---:|---:|
| Provider request maximum | 7000 ms | 9200 ms |
| Vercel route maxDuration | 10 seconds | 10 seconds (unchanged) |
| Application deadline | Core-local 10-second provider budget | 9800 ms from HTTP handler entry |
| Reserved after provider | No explicit reserve | 300 ms, plus 200 ms before platform ceiling |

Provider budget = min(9200, HTTP deadline - current monotonic time - 300) milliseconds. Authentication, rate limiting, upload/form processing and mechanical reading consume the same deadline. An exhausted budget stops before AI; deadline checks between stages reject a late result. Direct core acceptance uses the same 9800 ms budget from core entry.

The provider request is aborted using the existing shared AbortController. No retries, Promise.race background work, fallback, second call or continuation job is added. The Vercel maxDuration=10 remains the hard server execution backstop, including a stalled upload/auth operation or synchronous work that JavaScript cannot preempt. Application checks do not replace that platform limit. Network transfer, client rendering and platform scheduling are not a guaranteed end-to-end stopwatch; the customer target remains usable result within 10 seconds.

## Preserved behavior

Same executeV1 path and gpt-4.1-nano-2025-04-14 model; prompt, output schema, reader, binding, verification, deterministic calculations and analysis are unchanged. One provider attempt and SDK maxRetries=0. ZERO Finance Domain dependency. Only timeout/deadline plumbing and diagnostics in the core change; the core file is not byte-for-byte unchanged.

## Observability

Production logs retain mechanicalReadMs, aiMs, validationMs, verificationMs, calculationMs, totalMs, aiCalls, timeoutBoundary (provider/http_deadline/null), providerHttpStatus, providerStatusClass and HTTP elapsed time. Both successful and failed core executions emit telemetry. Existing structural validation diagnostics remain. No prompt, customer financial values, output body or key is logged.

The shared SDK transport reads the actual HTTP status via withResponse(). Local aborts have no provider status (null); local HTTP 504 is not reported as a provider HTTP 504. Injected test transports expose a successful status class but no fabricated exact provider status.

## Changes

- backend/financial-intelligence/v1/core.ts: 9200 ms cap, shared deadline/reserve checks and structural telemetry.
- backend/api/financial-intelligence/http.ts: deadline anchored at handler entry and FI telemetry/error presentation.
- backend/lib/openai.ts: actual provider HTTP diagnostics and rejection of a response returned after abort; classifier configuration/retry policy unchanged.
- tests/financial-intelligence/v1-timeout.test.ts: real timed response beyond seven seconds, abort/no-retry behavior and reduced/expired HTTP budget tests.
- tests/financial-intelligence/v1-http-and-boundary.test.ts: routing guard follows deadline argument.
- This report. PR #175's three files remain separately attributable to its prerequisite commit.

## Validation

Typecheck PASS; lint PASS (zero errors, one existing classifier warning); FI tests 24/24 PASS; production build PASS (126 pages); git diff --check PASS. Timed tests demonstrate a verified response after 7.15 seconds and a single aborted request at approximately 9.2 seconds.

No new real OpenAI acceptance or production deployment is claimed. The tests use controlled transports and real elapsed timers to verify timeout mechanics. A successful production result remains to be measured after authorized merge/deploy.
