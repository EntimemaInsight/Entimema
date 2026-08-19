# Entimema AI Runtime

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

This sprint implements the typed cognitive domain foundation only. It does not yet implement AI
execution, persistence, RAG, orchestration runtime, or UI.

## Development

Python 3.12 or newer is required.

```shell
python -m venv .venv
.venv/Scripts/python -m pip install -e ".[dev]"
.venv/Scripts/python -m pytest
.venv/Scripts/python -m ruff check .
```

The `app/main.py` module exposes only a typed `ProblemState` constructor. No server or agent
execution framework is included in this sprint.

## Sprint 2 — Concierge State Machine

The runtime now supports deterministic, audited Module A transitions through `INTAKE`,
`CONTEXTUALISING`, `REPAIR`, `PROBLEM_FORMATION`, `HYPOTHESIS_DISCRIMINATION`,
`EPISTEMIC_CHALLENGE`, and `ROUTING_READY`. Repair precedence, forbidden-inference checks,
routing gates, critical-unknown policy, and one-question deterministic selection are executable.

There is still no LLM execution, persistence, or domain-agent execution. `ROUTING_READY` is the
current successful terminal boundary for the Concierge layer.
