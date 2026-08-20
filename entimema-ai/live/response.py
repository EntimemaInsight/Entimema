"""Stable browser-facing projections; never includes model prompts or reasoning."""

from typing import Any

from domain.problem_state import ProblemState


def empty_projection() -> dict[str, Any]:
    return {
        "declared_problem": None,
        "operational_problem": None,
        "problem_status": "INTAKE",
        "reported_claims": [],
        "validated_evidence": [],
        "unknowns": [],
        "active_hypotheses": [],
        "contradictions": [],
        "epistemic_verdict": "INSUFFICIENT_EVIDENCE",
        "epistemic_veto": {
            "active": True,
            "verdict": "INSUFFICIENT_EVIDENCE",
            "blocking_reason": "The problem has not been operationalised.",
            "contradiction_ids": [],
            "unknown_ids": [],
            "required_next_action": "CLARIFY",
        },
        "routing_plan": {"plan_type": "NONE", "ready": False},
        "active_agents": [],
        "validated_agent_findings": [],
        "reconciliation_status": "NOT_STARTED",
        "reconciliation": [],
        "final_recommendations": [],
        "unresolved_items": [],
        "decision_readiness": "BLOCKED",
        "human_decision_required": True,
        "decision_map": {"nodes": [], "edges": []},
    }


def project_state(
    state: ProblemState, *, question: str | None, forbidden: bool = False
) -> dict[str, Any]:
    projection = empty_projection()
    unknown_ids = [item.id for item in state.unknowns]
    verdict = "FORBIDDEN_INFERENCE" if forbidden else "INSUFFICIENT_EVIDENCE"
    nodes = []
    if state.declared_problem:
        nodes.append(
            {"id": state.problem_id, "node_type": "PROBLEM", "label": state.declared_problem}
        )
    nodes += [{"id": x.id, "node_type": "CLAIM", "label": x.proposition} for x in state.claims]
    nodes += [{"id": x.id, "node_type": "UNKNOWN", "label": x.variable} for x in state.unknowns]
    nodes += [
        {"id": x.id, "node_type": "HYPOTHESIS", "label": x.proposition} for x in state.hypotheses
    ]
    projection.update(
        {
            "declared_problem": state.declared_problem,
            "operational_problem": state.operational_problem or state.declared_problem,
            "problem_status": state.lifecycle_state.value,
            "reported_claims": [x.model_dump(mode="json") for x in state.claims],
            "unknowns": [
                {**x.model_dump(mode="json"), "clarification_target": x.variable}
                for x in state.unknowns
            ],
            "active_hypotheses": [
                {
                    **x.model_dump(mode="json"),
                    "support": len(x.supporting_evidence_ids),
                    "against": len(x.contradicting_evidence_ids),
                }
                for x in state.hypotheses
            ],
            "epistemic_verdict": verdict,
            "epistemic_veto": {
                "active": True,
                "verdict": verdict,
                "blocking_reason": question or "Insufficient validated evidence for analysis.",
                "contradiction_ids": [],
                "unknown_ids": unknown_ids,
                "required_next_action": "CLARIFY" if question else "OBTAIN_EVIDENCE",
            },
            "unresolved_items": unknown_ids,
            "decision_map": {"nodes": nodes, "edges": []},
        }
    )
    return projection
