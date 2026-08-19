from synthesis.decisions import (
    CandidateRecommendation,
    DecisionSeverity,
    RecommendationType,
    Reversibility,
)
from synthesis.reconciliation import CrossAgentReconciler
from synthesis.synthesis import DecisionSynthesizer
from tests.agent_helpers import evidence, state
from tests.synthesis_helpers import plan_for, validated_result


def test_final_recommendation_traces_to_finding_and_evidence() -> None:
    row = evidence("e1", "liquidity", 1)
    problem = state([row])
    result = validated_result("CR_DIAGNOSTIC_001", "Liquidity deteriorating", ["e1"], task_id="t1")
    plan = plan_for([("t1", result.agent_result.agent_id, ["e1"], "12m", "entity")])
    reconciliation = CrossAgentReconciler().reconcile(problem, plan, [result])
    synthesis = DecisionSynthesizer().synthesize(problem, reconciliation, [result])
    recommendation = synthesis.candidate_recommendations[0]
    assert recommendation.supporting_finding_ids
    assert recommendation.evidence_ids == ["e1"]
    assert any(edge.source_id == recommendation.id for edge in synthesis.traceability_graph.edges)


def test_high_severity_requires_human_decision() -> None:
    try:
        CandidateRecommendation(
            id="r",
            proposition="Decline borrower",
            recommendation_type=RecommendationType.ACT,
            supporting_finding_ids=["f"],
            evidence_ids=["e"],
            reversibility=Reversibility.IRREVERSIBLE,
            decision_severity=DecisionSeverity.HIGH,
            human_decision_required=False,
        )
    except ValueError as error:
        assert "human decision" in str(error)
    else:
        raise AssertionError("high-impact action crossed the human decision boundary")
