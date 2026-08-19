from domain.enums import EpistemicVerdict
from evals.cases import EvaluationCase, EvaluationResult, EvaluationSeverity
from evals.runner import EvaluationRunner
from evals.scoring import assess_release_readiness
from orchestrator.plans import PlanType
from tests.test_end_to_end_runtime import working_capital_state


def evaluation_result(passed=True, severity=EvaluationSeverity.S3_ANALYTICAL):
    return EvaluationResult(
        case_id="case",
        passed=passed,
        severity=severity,
        hard_failures=[],
        soft_failures=[],
        assertion_results=[],
        traceability_complete=True,
        forbidden_inference_detected=False,
        notes=[],
    )


def test_release_gate_catches_s5_failure() -> None:
    assessment = assess_release_readiness(
        [evaluation_result(False, EvaluationSeverity.S5_ARCHITECTURE_CRITICAL)]
    )
    assert not assessment.ready
    assert assessment.metrics.s5_failures == 1


def test_release_gate_requires_traceability() -> None:
    result = evaluation_result()
    result.traceability_complete = False
    assert not assess_release_readiness([result]).ready


def test_release_gate_does_not_claim_readiness_from_count_when_critical_failure_exists() -> None:
    results = [evaluation_result() for _ in range(10)]
    results.append(evaluation_result(False, EvaluationSeverity.S5_ARCHITECTURE_CRITICAL))
    assert not assess_release_readiness(results).ready


def test_evaluation_runner_executes_complete_backend_case() -> None:
    case = EvaluationCase(
        case_id="E2E-001",
        category="WORKING_CAPITAL",
        severity=EvaluationSeverity.S4_EPISTEMIC,
        initial_problem_state=working_capital_state(),
        expected_pre_routing_verdict=EpistemicVerdict.VALIDATED,
        expected_orchestration_plan_type=PlanType.SINGLE_AGENT,
        expected_agent_ids=["FIN_WORKING_CAPITAL_001"],
        expected_final_verdict=EpistemicVerdict.CONDITIONALLY_VALID,
        requested_capabilities=["working_capital_analysis"],
    )
    result = EvaluationRunner().run(case)
    assert result.passed
    assert result.final_synthesis_result.user_synthesis_ready
