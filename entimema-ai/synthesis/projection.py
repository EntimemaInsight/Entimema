from enum import StrEnum

from pydantic import BaseModel, ConfigDict

from agents.execution import ValidatedAgentResult
from domain.enums import EpistemicVerdict
from domain.problem_state import ProblemState
from epistemic.verdicts import RequiredNextAction
from orchestrator.plans import OrchestrationPlan
from synthesis.readiness import DecisionReadiness
from synthesis.result import FinalSynthesisResult


class DecisionMapNodeType(StrEnum):
    PROBLEM = "PROBLEM"
    CLAIM = "CLAIM"
    EVIDENCE = "EVIDENCE"
    UNKNOWN = "UNKNOWN"
    HYPOTHESIS = "HYPOTHESIS"
    CONTRADICTION = "CONTRADICTION"
    AGENT = "AGENT"
    FINDING = "FINDING"
    RECOMMENDATION = "RECOMMENDATION"


class DecisionMapEdgeType(StrEnum):
    SUPPORTS = "SUPPORTS"
    CONTRADICTS = "CONTRADICTS"
    REQUIRES = "REQUIRES"
    ROUTES_TO = "ROUTES_TO"
    PRODUCES = "PRODUCES"
    DEPENDS_ON = "DEPENDS_ON"


class DecisionMapNode(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    node_type: DecisionMapNodeType
    label: str


class DecisionMapEdge(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    source_id: str
    target_id: str
    edge_type: DecisionMapEdgeType


class DecisionMap(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    nodes: list[DecisionMapNode]
    edges: list[DecisionMapEdge]


class EpistemicVetoView(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    active: bool
    verdict: EpistemicVerdict
    blocking_reason: str | None
    contradiction_ids: list[str]
    unknown_ids: list[str]
    required_next_action: RequiredNextAction


class DecisionWorkspaceProjection(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    declared_problem: str | None
    operational_problem: str | None
    problem_status: str
    reported_claims: list[dict]
    validated_evidence: list[dict]
    unknowns: list[dict]
    active_hypotheses: list[dict]
    contradictions: list[dict]
    epistemic_verdict: EpistemicVerdict
    epistemic_veto: EpistemicVetoView
    routing_plan: dict
    active_agents: list[str]
    validated_agent_findings: list[dict]
    reconciliation_status: str
    final_recommendations: list[dict]
    unresolved_items: list[str]
    decision_readiness: DecisionReadiness
    human_decision_required: bool
    decision_map: DecisionMap


def build_decision_workspace_projection(
    state: ProblemState,
    plan: OrchestrationPlan,
    results: list[ValidatedAgentResult],
    final: FinalSynthesisResult,
) -> DecisionWorkspaceProjection:
    verdict = final.final_verdict
    readiness = (
        DecisionReadiness.DECISION_READY
        if verdict is EpistemicVerdict.VALIDATED
        else DecisionReadiness.CONDITIONAL
        if verdict is EpistemicVerdict.CONDITIONALLY_VALID
        else DecisionReadiness.BLOCKED
    )
    nodes = [
        DecisionMapNode(
            id=state.problem_id,
            node_type=DecisionMapNodeType.PROBLEM,
            label=final.operational_problem,
        )
    ]
    nodes.extend(
        DecisionMapNode(id=item.id, node_type=DecisionMapNodeType.EVIDENCE, label=item.proposition)
        for item in state.evidence
    )
    nodes.extend(
        DecisionMapNode(id=item.id, node_type=DecisionMapNodeType.CLAIM, label=item.proposition)
        for item in state.claims
    )
    nodes.extend(
        DecisionMapNode(id=item.id, node_type=DecisionMapNodeType.UNKNOWN, label=item.variable)
        for item in state.unknowns
    )
    nodes.extend(
        DecisionMapNode(
            id=item.id, node_type=DecisionMapNodeType.HYPOTHESIS, label=item.proposition
        )
        for item in state.hypotheses
    )
    nodes.extend(
        DecisionMapNode(
            id=item.id,
            node_type=DecisionMapNodeType.CONTRADICTION,
            label=f"{item.proposition_a} / {item.proposition_b}",
        )
        for item in state.contradictions
    )
    agent_ids = sorted({item.agent_result.agent_id for item in results})
    nodes.extend(
        DecisionMapNode(id=item, node_type=DecisionMapNodeType.AGENT, label=item)
        for item in agent_ids
    )
    nodes.extend(
        DecisionMapNode(id=item.id, node_type=DecisionMapNodeType.FINDING, label=item.proposition)
        for item in final.reconciliation_result.findings
    )
    nodes.extend(
        DecisionMapNode(
            id=item.id, node_type=DecisionMapNodeType.RECOMMENDATION, label=item.proposition
        )
        for item in final.candidate_synthesis.candidate_recommendations
    )
    edges = []
    for finding in final.reconciliation_result.findings:
        edges.extend(
            DecisionMapEdge(
                source_id=evidence_id, target_id=finding.id, edge_type=DecisionMapEdgeType.SUPPORTS
            )
            for evidence_id in finding.evidence_ids
        )
        edges.extend(
            DecisionMapEdge(
                source_id=agent_id,
                target_id=finding.id,
                edge_type=DecisionMapEdgeType.PRODUCES,
            )
            for agent_id in finding.source_agent_ids
        )
    for recommendation in final.candidate_synthesis.candidate_recommendations:
        edges.extend(
            DecisionMapEdge(
                source_id=recommendation.id,
                target_id=finding_id,
                edge_type=DecisionMapEdgeType.DEPENDS_ON,
            )
            for finding_id in recommendation.supporting_finding_ids
        )
    validation = final.epistemic_validation_result
    return DecisionWorkspaceProjection(
        declared_problem=state.declared_problem,
        operational_problem=state.operational_problem,
        problem_status=state.lifecycle_state.value,
        reported_claims=[item.model_dump(mode="json") for item in state.claims],
        validated_evidence=[item.model_dump(mode="json") for item in state.evidence],
        unknowns=[item.model_dump(mode="json") for item in state.unknowns],
        active_hypotheses=[item.model_dump(mode="json") for item in state.hypotheses],
        contradictions=[item.model_dump(mode="json") for item in state.contradictions],
        epistemic_verdict=verdict,
        epistemic_veto=EpistemicVetoView(
            active=verdict
            not in {EpistemicVerdict.VALIDATED, EpistemicVerdict.CONDITIONALLY_VALID},
            verdict=verdict,
            blocking_reason=(
                validation.blocking_reasons[0] if validation.blocking_reasons else None
            ),
            contradiction_ids=validation.contradiction_ids,
            unknown_ids=final.unresolved_unknowns,
            required_next_action=validation.required_next_action,
        ),
        routing_plan=plan.model_dump(mode="json"),
        active_agents=agent_ids,
        validated_agent_findings=[
            item.model_dump(mode="json") for item in final.reconciliation_result.findings
        ],
        reconciliation_status=("BLOCKED" if final.unresolved_conflicts else "COMPLETE"),
        final_recommendations=[
            item.model_dump(mode="json")
            for item in final.candidate_synthesis.candidate_recommendations
        ],
        unresolved_items=sorted(set(final.unresolved_unknowns + final.unresolved_conflicts)),
        decision_readiness=readiness,
        human_decision_required=final.human_decision_required,
        decision_map=DecisionMap(nodes=nodes, edges=edges),
    )
