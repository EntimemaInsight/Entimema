from domain.enums import EpistemicVerdict, Materiality
from domain.unknowns import UnknownRecord
from epistemic.controller import EpistemicController
from synthesis.reconciliation import CrossAgentReconciler
from synthesis.synthesis import DecisionSynthesizer
from tests.agent_helpers import evidence, state
from tests.synthesis_helpers import plan_for, validated_result


def candidate(problem, result):
    plan = plan_for(
        [("t1", result.agent_result.agent_id, result.agent_result.evidence_used, "current", "x")]
    )
    reconciled = CrossAgentReconciler().reconcile(problem, plan, [result])
    return DecisionSynthesizer().synthesize(problem, reconciled, [result])


def test_valid_final_synthesis_is_admissible() -> None:
    problem = state([evidence("e1", "liquidity", 1)])
    result = validated_result("CR_DIAGNOSTIC_001", "Liquidity deteriorating", ["e1"], task_id="t1")
    assert (
        EpistemicController.validate_final_synthesis(candidate(problem, result), problem).verdict
        is EpistemicVerdict.VALIDATED
    )


def test_critical_unknown_blocks_decision_ready() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="debt",
        why_needed="decision",
        materiality=Materiality.CRITICAL,
        resolvable=False,
    )
    problem = state([evidence("e1", "liquidity", 1)], unknowns=[unknown])
    result = validated_result("CR_DIAGNOSTIC_001", "Liquidity deteriorating", ["e1"], task_id="t1")
    result.agent_result.unresolved_unknowns.append("u1")
    assert (
        EpistemicController.validate_final_synthesis(candidate(problem, result), problem).verdict
        is EpistemicVerdict.INSUFFICIENT_EVIDENCE
    )


def test_forbidden_inference_blocks_final_synthesis() -> None:
    problem = state([evidence("e1", "liquidity", 1)])
    result = validated_result(
        "CR_DIAGNOSTIC_001", "Hesitation shows deception", ["e1"], task_id="t1"
    )
    assert (
        EpistemicController.validate_final_synthesis(candidate(problem, result), problem).verdict
        is EpistemicVerdict.FORBIDDEN_INFERENCE
    )


def test_real_true_conflict_blocks_final_validation() -> None:
    problem = state([evidence("e1", "liquidity", 1), evidence("e2", "liquidity", 2)])
    left = validated_result(
        "FIN_WORKING_CAPITAL_001", "Liquidity is adequate", ["e1"], task_id="t1"
    )
    right = validated_result("CR_DIAGNOSTIC_001", "Liquidity is inadequate", ["e2"], task_id="t2")
    plan = plan_for(
        [
            ("t1", left.agent_result.agent_id, ["e1"], "current", "entity"),
            ("t2", right.agent_result.agent_id, ["e2"], "current", "entity"),
        ]
    )
    reconciliation = CrossAgentReconciler().reconcile(problem, plan, [left, right])
    synthesis = DecisionSynthesizer().synthesize(problem, reconciliation, [left, right])
    assert (
        EpistemicController.validate_final_synthesis(synthesis, problem).verdict
        is EpistemicVerdict.CONTRADICTED
    )
