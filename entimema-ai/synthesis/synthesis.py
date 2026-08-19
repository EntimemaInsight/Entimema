from enum import StrEnum

from pydantic import BaseModel, ConfigDict

from agents.execution import ValidatedAgentResult
from domain.problem_state import ProblemState
from epistemic.traceability import (
    TraceabilityGraph,
    TraceEdge,
    TraceEdgeType,
    TraceNode,
    TraceNodeType,
)
from synthesis.decisions import (
    CandidateRecommendation,
    DecisionSeverity,
    RecommendationType,
    Reversibility,
)
from synthesis.reconciliation import CrossAgentReconciliationResult, FindingStatus


class SynthesisStatus(StrEnum):
    CANDIDATE = "CANDIDATE"
    CONDITIONAL = "CONDITIONAL"
    BLOCKED = "BLOCKED"


class CandidateDecisionSynthesis(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    synthesis_id: str
    problem_id: str
    operational_problem: str
    candidate_recommendations: list[CandidateRecommendation]
    supporting_finding_ids: list[str]
    evidence_ids: list[str]
    inference_ids: list[str]
    assumption_ids: list[str]
    unresolved_unknown_ids: list[str]
    true_conflict_ids: list[str]
    limitations: list[str]
    alternative_actions: list[str]
    human_decision_required: bool
    traceability_graph: TraceabilityGraph
    synthesis_status: SynthesisStatus


class DecisionSynthesizer:
    def synthesize(
        self,
        problem_state: ProblemState,
        reconciliation: CrossAgentReconciliationResult,
        validated_agent_results: list[ValidatedAgentResult],
        operational_goal: str | None = None,
        target_decision: str | None = None,
    ) -> CandidateDecisionSynthesis:
        findings = reconciliation.findings
        recommendations = []
        for index, finding in enumerate(findings):
            if finding.status is FindingStatus.CONFLICTED:
                continue
            recommendation_type = (
                RecommendationType.RECONCILE
                if "MISMATCH" in finding.proposition.upper()
                else RecommendationType.REVIEW
            )
            recommendations.append(
                CandidateRecommendation(
                    id=f"recommendation-{index + 1}",
                    proposition=(
                        f"{recommendation_type.value.title()} the validated finding for "
                        f"the target decision: {finding.proposition}"
                    ),
                    recommendation_type=recommendation_type,
                    supporting_finding_ids=[finding.id],
                    evidence_ids=finding.evidence_ids,
                    assumption_ids=finding.assumption_ids,
                    risks=["Action remains bounded to the validated finding and supplied scope."],
                    reversibility=Reversibility.REVERSIBLE,
                    decision_severity=DecisionSeverity.LOW,
                    human_decision_required=True,
                )
            )
        nodes = [
            TraceNode(id=finding.id, node_type=TraceNodeType.INFERENCE) for finding in findings
        ]
        nodes.extend(
            TraceNode(id=item.id, node_type=TraceNodeType.DECISION) for item in recommendations
        )
        evidence_ids = sorted({value for finding in findings for value in finding.evidence_ids})
        nodes.extend(TraceNode(id=item, node_type=TraceNodeType.EVIDENCE) for item in evidence_ids)
        edges = []
        for recommendation in recommendations:
            edges.extend(
                TraceEdge(
                    source_id=recommendation.id,
                    target_id=finding_id,
                    edge_type=TraceEdgeType.DEPENDS_ON,
                )
                for finding_id in recommendation.supporting_finding_ids
            )
        for finding in findings:
            edges.extend(
                TraceEdge(
                    source_id=finding.id,
                    target_id=evidence_id,
                    edge_type=TraceEdgeType.DERIVED_FROM,
                )
                for evidence_id in finding.evidence_ids
            )
        assumptions = sorted({value for item in findings for value in item.assumption_ids})
        limitations = []
        if reconciliation.shared_assumption_ids:
            limitations.append("Shared assumptions prevent independent confirmation.")
        if reconciliation.unresolved_unknowns:
            limitations.append("Material unknowns remain unresolved.")
        if reconciliation.true_conflicts:
            limitations.append("True conflicts require resolution before decision readiness.")
        conditional_findings = any(item.status is FindingStatus.CONDITIONAL for item in findings)
        if conditional_findings:
            limitations.append("One or more validated findings remain conditional.")
        status = (
            SynthesisStatus.BLOCKED
            if reconciliation.true_conflicts
            else SynthesisStatus.CONDITIONAL
            if assumptions or reconciliation.unresolved_unknowns or conditional_findings
            else SynthesisStatus.CANDIDATE
        )
        return CandidateDecisionSynthesis(
            synthesis_id=f"synthesis-{problem_state.problem_id}",
            problem_id=problem_state.problem_id,
            operational_problem=problem_state.operational_problem
            or operational_goal
            or "Unresolved",
            candidate_recommendations=recommendations,
            supporting_finding_ids=[item.id for item in findings],
            evidence_ids=evidence_ids,
            inference_ids=sorted({value for item in findings for value in item.inference_ids}),
            assumption_ids=assumptions,
            unresolved_unknown_ids=reconciliation.unresolved_unknowns,
            true_conflict_ids=[item.id for item in reconciliation.true_conflicts],
            limitations=limitations,
            alternative_actions=["Request additional evidence", "Resolve surfaced conflicts"],
            human_decision_required=bool(recommendations),
            traceability_graph=TraceabilityGraph(nodes=nodes, edges=edges),
            synthesis_status=status,
        )
