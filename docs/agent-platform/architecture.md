# Entimema Agent Platform architecture

**Status:** current product and runtime direction, 2026-08-21

## Product architecture

The public product surface is the Agent Library and its specialist-agent pages—not a general-purpose Concierge:

```text
Research / SEO / GEO → Agent Library → Agent Product Page → Get a Demo
→ Founder-led Sales initially → Pilot → Specialist Agent → Deliverable
→ Recurring Workflow → Subscription
```

Later, a Sales Agent may augment or replace founder-led qualification: `Get a Demo → Sales Agent`.
Building that Sales Agent is explicitly outside this sprint.

## Agent Platform Core

The platform remains durable and case-based. A specialist agent is bounded analytical execution, not a stateless prompt endpoint. The retained layers are:

1. **Case Runtime** — canonical structured state, command/event history, optimistic concurrency, idempotency, analysis-run records, ownership boundaries, recurring-workflow continuity, and generated-artifact references.
2. **Evidence Layer** — artifact registration and extraction (PDF, XLSX, CSV), evidence candidates, validation, provenance, and durable storage. Its invariants remain `Artifact ≠ Evidence`, `EvidenceCandidate ≠ ValidatedEvidence`, `Claim ≠ Fact`, and `MissingValue ≠ 0`.
3. **Epistemic Control (Module B)** — assumptions, Unknowns, contradictions, traceability, inference validation, pre-routing vetoes, and post-agent admissibility. It can block execution and invalid conclusions.
4. **Capability Orchestrator** — capability matching, decomposition, dependency planning, routing, bounded execution, reconciliation, and synthesis. Public agent identity does not move orchestration into frontend routing.
5. **Specialist capabilities** — Financial Planning, Working Capital, Credit Risk, and Engineering Reconciliation use shared schemas and Case/Evidence inputs. Financial Planning produces a `FinancialModelSpecification`; workbook generation remains a downstream deterministic artifact integration.
6. **Interaction realization** — `InteractionRealizer` is retained because presentation of validated state and the next bounded interaction can be reused by future agent workspaces. Its current import path is a compatibility boundary, not a product commitment.

## Compatibility and retention

Legacy `concierge`, `live`, and `/api/concierge` names are staged compatibility surfaces. Renaming them without changing behavior would create risk across imports, schemas, deployments, and stored Cases. New code and documentation should use Agent Runtime, Case Runtime, Evidence Layer, Epistemic Control, and Capability Orchestrator. A later migration can add aliases before removing legacy names.

Retirement does **not** delete Cases, evidence, artifacts, audit records, analysis runs, secrets, buckets, or databases. Data retention and migration require a separate approved decision.

## Public Agent Library readiness

`/agents` is public, canonical, present in navigation and sitemap, and already has agent-first metadata, principles, and a Get a Demo entry point. The next sprint should introduce a typed catalogue model, reusable agent cards, and individual canonical product pages. It should map public agent IDs to capabilities without coupling cards to legacy Concierge APIs. The current route has no Concierge runtime dependency and is safe as the transitional redirect destination.
