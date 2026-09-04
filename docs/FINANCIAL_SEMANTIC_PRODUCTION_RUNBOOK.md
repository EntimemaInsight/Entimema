# Financial semantic resolver production runbook

## Root-cause diagnosis (PR #158)

The deployed upload path was `POST /api/financial-intelligence/run` → file inspection →
classifier and extraction → `interpretWholeStatement` → validation/readiness → durable
`FinancialRunService.create` → customer projection. PR #158 placed the resolver call in
that path, but made invocation conditional on three independently configured runtime
values. The checked-in deployment template explicitly defaulted the feature flag to
`false`. A missing flag, API key, or model therefore produced a deterministic-only run.
The result persisted no execution record, so the historical 5/30 run cannot prove whether
the provider was invoked or distinguish disabled configuration from provider failure.
That observability/configuration gap is the actionable root cause; no evidence supports a
claim that production returned valid mappings which were subsequently overwritten.

This correction persists `resolverTelemetry` with every run. It records only booleans,
reason categories, version/model, duration, counts, rejection categories, and final core
P&L coverage. It never records labels, values, workbook content, or credentials. A
requested resolver with missing configuration reports `disabled`, `invoked: false`; it is
not represented as completed AI interpretation.

## Current execution path and controls

1. The authenticated Node.js route receives one bounded multipart upload.
2. File inspection rejects unsupported or unsafe content.
3. Extraction inventories and selects an income-statement candidate.
4. A single ordered statement object is built from all extracted rows and period context.
5. `getFinancialResolverConfig` evaluates eligibility and runtime configuration once.
6. One OpenAI Responses request is made only when flag, key, and model are present.
7. Strict structured output is parsed and every proposed concept is checked against the
   server-supplied candidates and canonical allowlist.
8. Deterministic section vetoes protect OCI, total comprehensive income, attribution, and
   metadata boundaries.
9. Semantic candidates enter the extracted value stream before validation. Acceptance
   uses the documented `mapping-confidence.v1` weighted score and 0.68 high-confidence
   threshold; contradiction and section vetoes remain blocking. Exact lexical matching is
   not required for a provider candidate.
10. Validation consumes only the resulting canonical values; excluded sections cannot
    enter P&L equations.
11. Readiness remains deterministic and server authoritative.
12. The entire classified result and privacy-safe telemetry are integrity-signed and
    persisted.
13. The customer Canonical Income Statement projects only `p_and_l` rows. OCI and
    attribution remain persisted source evidence for authorized internal review.

The route is a Node.js dynamic route. Resolver timeout is capped at 60 seconds and the
request is bounded to 200 rows / 60,000 context characters. The deployment's function
limit must exceed `FINANCIAL_SEMANTIC_TIMEOUT_MS` plus extraction/persistence time.

## Required production configuration

Set these **server-only** variables in the production environment and redeploy:

```text
OPENAI_API_KEY=<secret>
FINANCIAL_SEMANTIC_RESOLVER_ENABLED=true
FINANCIAL_SEMANTIC_MODEL=gpt-5-mini
FINANCIAL_SEMANTIC_RESOLVER_VERSION=2026-09-04
FINANCIAL_SEMANTIC_TIMEOUT_MS=30000
FINANCIAL_SEMANTIC_MAX_ATTEMPTS=2
FINANCIAL_SEMANTIC_MAX_ROWS=120
FINANCIAL_SEMANTIC_MAX_CONTEXT_CHARS=32000
FINANCIAL_DATABASE_REST_URL=<supabase project URL>
FINANCIAL_DATABASE_SERVICE_KEY=<service-role secret>
```

Verify a real post-deployment run internally: `requested=true`, `invoked=true`, outcome
`success`, proposed/accepted counts non-zero, and model/version equal the deployed
configuration. Production invocation, latency, token cost, and the external workbook gate
cannot be certified from repository tests.

## Migration 002

Apply after migration 001 using the production Supabase CLI connection:

```bash
supabase db push --db-url "$PRODUCTION_DATABASE_URL" --include-all
```

Verify without returning mapping labels or owner data:

```sql
select to_regclass('public.financial_operator_roles') is not null as operator_roles,
       to_regclass('public.financial_mapping_memory') is not null as mapping_memory,
       has_function_privilege('service_role','public.fi_is_operator(text)','execute') as operator_check;
```

Do not declare mapping memory operational until this query returns three `true` values and
a tenant-isolation smoke test passes in production.
