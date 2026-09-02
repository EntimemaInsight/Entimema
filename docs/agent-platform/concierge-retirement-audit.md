# Concierge retirement dependency audit

**Audit date:** 2026-08-21

**Action rule:** no `UNKNOWN / REQUIRES REVIEW` or `UNRESOLVED` dependency was removed or disabled.

## Retirement decision

The standalone Concierge product is retired. `/concierge-lab` returns a temporary redirect to the ready, canonical `/agents` route. Temporary status is intentional while indexed/external links are observed; review conversion to a permanent redirect after migration. Concierge is absent from normal navigation and sitemap. The homepage now leads with **Explore agents**; **Get a demo** remains the commercial action on the Agent Library and other relevant pages.

## Repository dependency classification

| Surface | Classification | Decision |
| --- | --- | --- |
| `app/concierge-lab` standalone workspace page | `CONCIERGE-ONLY` | Retired; redirect only |
| `components/concierge-lab/ConciergeLabShell` and Guided Preview composition | `CONCIERGE-ONLY` | Archived in source, unreachable; retain for historical/reference value |
| Case notebook, Problem State, Decision Map, conversation and evidence panels | `SHARED / AGENT-REUSABLE` | Retain as candidate workspace components; do not expose through retired shell |
| Hold-to-speak disabled control and fixture scenario picker | `CONCIERGE-ONLY` | Archived with shell; do not ship as an entry point |
| Next `/api/concierge/sessions*` proxy routes | `SHARED` | Retain as legacy compatibility API for Case and evidence workflows |
| Python `/api/v1/sessions*` | `AGENT PLATFORM API` | Retain durable Case command/recovery boundary |
| Python `/api/v1/cases/*/artifacts` and `/evidence` | `AGENT PLATFORM API` | Retain Evidence Layer |
| `concierge` dialogue, repair, question selection and routing modules | `SHARED / AGENT-REUSABLE` | Retain; formation/runtime imports depend on them |
| `InteractionRealizer` | `SHARED / AGENT-REUSABLE` | Retain; suitable for agent-specific bounded interactions |
| `live` canonical runtime/controller/session | `AGENT-CORE` | Retain Case runtime, persistence, concurrency, and idempotency |
| `domain`, `evidence`, `epistemic`, `orchestrator`, `synthesis`, `workbooks` | `AGENT-CORE` | Retain intact |
| `contracts/concierge-runtime.schema.json` | `SHARED / AGENT-REUSABLE` | Retain legacy filename as schema compatibility surface |
| Concierge architecture audit and backend README narrative | `CONCIERGE-ONLY` documentation | Preserve as historical; architecture audit is marked deprecated |

No product-only backend module was removed: actual imports show legacy-named formation, interaction, and live modules are reusable runtime dependencies rather than an isolated marketing application.

## API and test classification

All Next Concierge proxy endpoints are **SHARED** compatibility routes; all matching Python Case and Evidence endpoints are **AGENT PLATFORM API**. There is no independently authenticated public demo endpoint proven safe to delete. Route names should be migrated only with versioned aliases and client telemetry.

Retain tests for Case persistence, canonical runtime, evidence, epistemic control, concurrency, idempotency, orchestration, agent execution, synthesis/reconciliation, Financial Planning, workbook generation, and `InteractionRealizer`. State-machine and routing tests are retained because shared problem-formation imports depend on that behavior. The former browser UI contract test is replaced by a product-retirement contract test covering redirect, discovery surfaces, sitemap isolation, and continued Case/Evidence runtime wiring. Archived UI fixtures remain historical test data.

## Deployment dependency map

```text
Browser / public Next.js on Vercel
  ├─ /agents and demo/contact surfaces
  └─ legacy Next /api/concierge proxy (ENTIMEMA_RUNTIME_URL)
          ↓
Cloud Run: project entimema-runtime / service entimema-runtime / europe-west1
  ├─ FastAPI Case + Evidence API
  ├─ SQLite Case database (ENTIMEMA_CASE_DB or local default)
  ├─ local artifact root (ENTIMEMA_ARTIFACT_ROOT or local default)
  └─ optional OpenAI interpreter (OPENAI_API_KEY + ENTIMEMA_INTERPRETER_MODEL)
```

| Resource/configuration | Cloud class | Action |
| --- | --- | --- |
| Cloud Run `entimema-runtime` service/container | `SHARED WITH AGENTS` | **KEEP**; no destructive action |
| Dockerfile and source-deployment trigger from `main` | `AGENT-CORE` | **KEEP** |
| SQLite Case database / any mounted persistence | `AGENT-CORE` | **KEEP**; verify actual mount and backups |
| Local artifact store / any production volume or bucket behind it | `AGENT-CORE` | **KEEP** |
| Secret Manager reference for `OPENAI_API_KEY` | `SHARED WITH AGENTS` | **KEEP** pending interpreter strategy |
| Vercel `ENTIMEMA_RUNTIME_URL` connection | `SHARED WITH AGENTS` | **KEEP** while API clients or future workspaces use it |
| Private-lab unauthenticated ingress policy | `UNRESOLVED` | Review/harden; do not disable until callers and service auth are verified |
| Any Cloud SQL instance, GCS bucket, persistent disk, or separate demo service | `UNRESOLVED` | Not declared in repository; inventory in cloud console before action |

**Safe to disable now:** none conclusively identified. The public page is retired in code, but the only declared Cloud Run service hosts shared Agent Platform functionality. Minimum instances are already documented as zero; changing production settings is outside this repository-only sprint.

## Environment-variable audit

| Variable | Classification | Decision |
| --- | --- | --- |
| `ENTIMEMA_RUNTIME_URL` | retain for agent core / deployment-only | Keep server-side in Vercel |
| `ENTIMEMA_CASE_DB` | retain for agent core | Keep; staged rename later only with compatibility fallback |
| `ENTIMEMA_ARTIFACT_ROOT` | retain for agent core | Keep |
| `ENTIMEMA_MAX_TURNS` | retain for agent core | Keep bounded-execution control |
| `OPENAI_API_KEY` | retain for agent core / secret | Keep in secret manager; never expose to browser |
| `ENTIMEMA_INTERPRETER_MODEL` | retain for agent core | Keep while interpreter capability is enabled |
| `RESEND_API_KEY` | shared commercial inquiry | Keep; unrelated to Concierge |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | shared public analytics | Keep; unrelated to Concierge |
| `PORT` | deployment-only | Keep Cloud Run supplied value |

No variable is proven Concierge-only, so none is removed. The default SQLite filename contains a legacy product name; changing it could orphan data and is deferred to a compatibility migration.

## Data and follow-up controls

No cloud resource was modified. No Case, upload, evidence record, artifact, audit/event record, analysis run, fixture, secret, or database was deleted. Before any future shutdown, correlate Cloud Run request logs, Vercel proxy use, mounted storage, databases, buckets, secrets, service accounts, and scheduled callers; establish backups and ownership; then approve reversible scale-to-zero or versioned migration actions resource by resource.
