"""Stable browser projection of the canonical aggregate and audited analysis."""

from typing import Any

from domain.claims import ClaimStatus
from domain.problem_state import ProblemState


def empty_projection() -> dict[str, Any]:
    return {
        "declared_problem": None,
        "operational_problem": None,
        "workspace_phase": "INTAKE",
        "problem_status": "INTAKE",
        "reported_claims": [],
        "validated_evidence": [],
        "artifacts": [],
        "unverified_evidence": [],
        "evidence_contradictions": [],
        "evidence_resolved_unknowns": [],
        "unknowns": [],
        "active_hypotheses": [],
        "contradictions": [],
        "blockers": [],
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


def project_state(state: ProblemState, *, audit, analysis=None) -> dict[str, Any]:
    """Project only canonical state; the browser never reconstructs epistemic meaning."""
    projection = empty_projection()
    claims = [item for item in state.claims if item.status is ClaimStatus.REPORTED]
    supported = [item for item in state.claims if item.status is not ClaimStatus.REPORTED]
    nodes = (
        [{"id": state.problem_id, "node_type": "PROBLEM", "label": state.operational_problem}]
        if state.operational_problem
        else []
    )
    nodes += [{"id": x.id, "node_type": "CLAIM", "label": x.proposition} for x in claims]
    nodes += [{"id": x.id, "node_type": "UNKNOWN", "label": x.variable} for x in state.unknowns]
    plan = analysis.orchestration_plan if analysis else None
    final = analysis.final_synthesis_result if analysis else None
    projection.update(
        {
            "declared_problem": state.declared_problem,
            "operational_problem": state.operational_problem,
            "workspace_phase": state.workspace_phase.value,
            "problem_status": state.lifecycle_state.value,
            "reported_claims": [x.model_dump(mode="json") for x in claims],
            "validated_evidence": [x.model_dump(mode="json") for x in state.evidence]
            + [x.model_dump(mode="json") for x in supported],
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
            "contradictions": [
                {**x.model_dump(mode="json"), "issue": x.contradiction_type.value}
                for x in state.contradictions
            ],
            "blockers": state.blockers,
            "epistemic_verdict": audit.verdict.value,
            "epistemic_veto": {
                "active": audit.required_next_action.value != "PROCEED",
                "verdict": audit.verdict.value,
                "blocking_reason": state.next_best_question or "; ".join(audit.blocking_reasons),
                "contradiction_ids": audit.contradiction_ids,
                "unknown_ids": audit.unresolved_object_ids,
                "required_next_action": audit.required_next_action.value,
            },
            "routing_plan": {
                "plan_type": plan.plan_type.value if plan else "NONE",
                "ready": bool(plan and plan.ready),
            },
            "active_agents": (
                [
                    {
                        "id": x.agent_id,
                        "label": x.agent_id,
                        "domain": "bounded capability",
                        "task": x.task_id,
                        "status": "COMPLETE",
                    }
                    for x in plan.agent_assignments
                ]
                if plan
                else []
            ),
            "reconciliation_status": ("COMPLETED" if final else "NOT_STARTED"),
            "reconciliation": (
                [final.reconciliation_result.model_dump(mode="json")] if final else []
            ),
            "final_recommendations": (
                [
                    x.model_dump(mode="json")
                    for x in final.candidate_synthesis.candidate_recommendations
                ]
                if final
                else []
            ),
            "unresolved_items": audit.unresolved_object_ids,
            "decision_readiness": state.decision_readiness.value,
            "decision_map": {"nodes": nodes, "edges": []},
        }
    )
    return projection
