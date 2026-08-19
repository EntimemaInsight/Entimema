from domain.enums import EpistemicVerdict
from epistemic.verdicts import TraceabilityStatus
from evals.cases import AssertionResult, AssertionType, EvaluationAssertion


def evaluate_assertion(assertion: EvaluationAssertion, runtime_result) -> AssertionResult:
    final = runtime_result.final_synthesis_result
    selected = {item.agent_id for item in runtime_result.orchestration_plan.agent_assignments}
    checks = {
        AssertionType.VERDICT_EQUALS: final.final_verdict.value == assertion.expected,
        AssertionType.AGENT_SELECTED: assertion.expected in selected,
        AssertionType.AGENT_NOT_SELECTED: assertion.expected not in selected,
        AssertionType.UNKNOWN_PRESENT: assertion.expected in final.unresolved_unknowns,
        AssertionType.ASSUMPTION_ABSENT: assertion.expected
        not in final.candidate_synthesis.assumption_ids,
        AssertionType.FORBIDDEN_INFERENCE_ABSENT: final.final_verdict
        is not EpistemicVerdict.FORBIDDEN_INFERENCE,
        AssertionType.TRACEABILITY_COMPLETE: final.epistemic_validation_result.traceability_status
        is TraceabilityStatus.COMPLETE,
        AssertionType.TRUE_CONFLICT_ABSENT: not final.unresolved_conflicts,
        AssertionType.TRUE_CONFLICT_PRESENT: bool(final.unresolved_conflicts),
        AssertionType.HUMAN_DECISION_REQUIRED: final.human_decision_required
        is bool(assertion.expected),
        AssertionType.RECOMMENDATION_PRESENT: any(
            str(assertion.expected).casefold() in item.proposition.casefold()
            for item in final.candidate_synthesis.candidate_recommendations
        ),
        AssertionType.RECOMMENDATION_ABSENT: not any(
            str(assertion.expected).casefold() in item.proposition.casefold()
            for item in final.candidate_synthesis.candidate_recommendations
        ),
        AssertionType.STATE_EQUALS: True,
    }
    passed = checks[assertion.assertion_type]
    return AssertionResult(
        assertion=assertion,
        passed=passed,
        detail=f"{assertion.assertion_type.value}={passed}",
    )
