# Entimema AI Runtime

## Sprint 9 — Live Runtime Bridge

The private Concierge Lab now has two explicit modes. `FIXTURE` preserves the five
deterministic Sprint 8A UI scenarios and needs no model configuration. `LIVE` sends text
through a Next.js server proxy to this FastAPI service. A schema-constrained linguistic
interpreter extracts candidates only; deterministic runtime code admits state, applies
epistemic stops, and owns routing and projection. The interpreter is not a router,
calculator, state store, or final authority.

Start locally in separate terminals:

```bash
cd entimema-ai
OPENAI_API_KEY=... ENTIMEMA_INTERPRETER_MODEL=... uvicorn api.app:app --reload

# repository root
ENTIMEMA_RUNTIME_URL=http://127.0.0.1:8000 npm run dev
```

The runtime exposes `POST /api/v1/sessions`, `GET /api/v1/sessions/{id}`,
`POST /api/v1/sessions/{id}/messages`, `POST /api/v1/sessions/{id}/reset`, and
`GET /health`. Sessions are **IN-MEMORY / NON-PERSISTENT**, isolated within one process,
and erased by a restart. `ENTIMEMA_MAX_TURNS` (default 40) and an 8,000-character message
limit constrain lab usage.

`OPENAI_API_KEY` and `ENTIMEMA_INTERPRETER_MODEL` belong only on the Python service;
`ENTIMEMA_RUNTIME_URL` belongs on the Next.js server. If the URL is absent in production,
the page remains usable in fixture mode and reports `LIVE RUNTIME NOT CONFIGURED` for live
requests. The Python runtime requires external hosting; this repository does not claim a
deployed persistent runtime. Persistence, authentication, uploads, voice, RAG, PD/ECL,
accounts, billing, and autonomous actions remain deferred.

Entimema AI Runtime is the typed foundation for a cognitive-financial decision
architecture. It keeps conversation, problem formation, evidence, hypotheses,
inference, domain analysis, and decisions separate so their provenance and
epistemic status remain explicit.

## Core invariants

- **INV-001 — Unknown != Assumption:** conversion requires an explicit transition and basis.
- **INV-002 — Claim != Fact:** reported claims remain distinct from supporting evidence.
- **INV-003 — Hypothesis != Conclusion:** decisions require a validated intermediate chain.
- **INV-004 — Model Output != Observation:** model-produced output cannot be relabelled observed.
- **INV-005 — Conversation Signal != Mental State:** conversation phenomena cannot justify
  prohibited psychological, motive, or trust conclusions.
- **INV-006 — Traceability Required:** material decisions require reconstructable evidence and
  inference paths.

## Current Sprint Scope

The runtime includes typed cognitive foundations, deterministic orchestration, executable domain
agents, and the constrained live interpretation boundary used by the private lab. It does not
implement persistence, RAG, uploads, voice, or production authentication.

## Development

Python 3.12 or newer is required.

```shell
python -m venv .venv
.venv/Scripts/python -m pip install -e ".[dev]"
.venv/Scripts/python -m pytest
.venv/Scripts/python -m ruff check .
```

The `app/main.py` module exposes a typed `ProblemState` constructor; domain execution remains a
library runtime rather than a server or UI.

## Sprint 2 — Concierge State Machine

The runtime now supports deterministic, audited Module A transitions through `INTAKE`,
`CONTEXTUALISING`, `REPAIR`, `PROBLEM_FORMATION`, `HYPOTHESIS_DISCRIMINATION`,
`EPISTEMIC_CHALLENGE`, and `ROUTING_READY`. Repair precedence, forbidden-inference checks,
routing gates, critical-unknown policy, and one-question deterministic selection are executable.

There is still no LLM execution, persistence, or domain-agent execution. `ROUTING_READY` is the
current successful terminal boundary for the Concierge layer.

## Sprint 4 — Epistemic & Reflexive Control Layer

Module A constructs and updates the shared `ProblemState`. Module B independently audits whether
that state and any candidate inference are epistemically admissible. It has deterministic veto
authority for forbidden inference, broken traceability, material contradiction, assumption
leakage, blocking unknowns, and incomplete material evidence provenance.

The control layer reuses the existing verdicts: `VALIDATED`, `CONDITIONALLY_VALID`,
`INSUFFICIENT_EVIDENCE`, `CONTRADICTED`, `OUT_OF_SCOPE`, `FORBIDDEN_INFERENCE`, and
`TRACEABILITY_FAILURE`. It returns a required next action to the Sprint 2 state machine rather
than owning dialogue transitions.

Pre-routing validation is active. Post-agent and synthesis validation have typed, explicitly
deferred contracts only. There is no agent execution, LLM execution, RAG, persistence, or
production orchestration in this sprint.

## Sprint 5 — Central Orchestrator & Agent Registry

Module A constructs the shared problem state, Module B validates epistemic admissibility, and the
Central Orchestrator deterministically decomposes, routes, translates, and prepares future
cross-agent reconciliation. The registry contains typed Finance, Credit Risk, and Engineering
capability contracts; there is no generic fallback agent.

Routing uses explicit capabilities, compatible horizons/populations/methods, required structured
inputs, and Module B's verdict. It does not use keyword proximity or raw conversation history.
Cross-domain definition and translation records preserve semantic boundaries rather than treating
related terms as synonyms. `NO_ADMISSIBLE_AGENT` is a valid, structured outcome.

Agent tasks are plans only. Specialist agents, analytics, autonomous actions, and result
reconciliation do not execute in this sprint.

## Sprint 6 — Domain Agent Execution v1

Three registry-backed specialists now execute deterministic typed tasks: Finance Working
Capital/Liquidity, Credit Risk Diagnostic, and Engineering Reconciliation. Finance calculations
use explicit `CalculationRecord` provenance, credit diagnostics preserve separate observable
dimensions without inventing PD or aggregate scores, and reconciliation uses exact canonical
keys with explicit mismatch records.

The execution controller resolves typed references, enforces the Module B pre-routing gate,
dispatches only the three executable agents, respects orchestration DAG dependencies, and submits
every atomic result to active post-agent validation. Raw conversation is not an agent input.

This boundary is `VALIDATED_AGENT_RESULT`. There is still no LLM execution, PD/ECL model, RAG,
persistence, UI, autonomous consequential action, or final multi-agent synthesis.

## Sprint 7 — Reconciliation, Final Synthesis & Evaluation Harness

The deterministic backend loop now continues from validated domain-agent results through
cross-agent reconciliation, candidate decision synthesis, and Module B final admissibility.
Reconciliation preserves differences in evidence, assumptions, definitions, horizons, scopes,
and methods; shared dependencies are not counted as independent confirmation, and mixed findings
are not forced into a single narrative.

`FinalSynthesisResult` and its `UserSynthesisView` provide the validated synthesis boundary. A
JSON-serializable `DecisionWorkspaceProjection`, structured epistemic veto, and traceable
`DecisionMap` prepare the backend contract for the future Concierge Lab interface.

The evaluation harness runs deterministic end-to-end cases, records hard and soft failures, and
applies an S5/traceability/forbidden-inference release gate. Test count alone does not establish
production readiness. There is still no UI, LLM execution, RAG, persistence, authentication,
autonomous action, or public deployment.
