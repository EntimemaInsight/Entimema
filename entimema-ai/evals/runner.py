from evals.assertions import evaluate_assertion
from evals.cases import EvaluationCase, EvaluationResult
from synthesis.runtime import EndToEndRuntime


class EvaluationRunner:
    def __init__(self, runtime: EndToEndRuntime | None = None) -> None:
        self.runtime = runtime or EndToEndRuntime()

    def run(self, case: EvaluationCase) -> EvaluationResult:
        output = self.runtime.run(
            case.initial_problem_state,
            case.requested_capabilities,
            case.evidence_ids_by_capability,
        )
        checks = [evaluate_assertion(item, output) for item in case.required_assertions]
        checks.extend(
            result.model_copy(update={"passed": not result.passed})
            for result in (evaluate_assertion(item, output) for item in case.forbidden_assertions)
        )
        hard = []
        if output.pre_routing_validation.verdict is not case.expected_pre_routing_verdict:
            hard.append("PRE_ROUTING_VERDICT_MISMATCH")
        if output.orchestration_plan.plan_type is not case.expected_orchestration_plan_type:
            hard.append("PLAN_TYPE_MISMATCH")
        selected = sorted(item.agent_id for item in output.orchestration_plan.agent_assignments)
        if selected != sorted(case.expected_agent_ids):
            hard.append("AGENT_SELECTION_MISMATCH")
        final = output.final_synthesis_result
        if final.final_verdict is not case.expected_final_verdict:
            hard.append("FINAL_VERDICT_MISMATCH")
        hard.extend(item.detail for item in checks if not item.passed)
        return EvaluationResult(
            case_id=case.case_id,
            passed=not hard,
            severity=case.severity,
            hard_failures=hard,
            soft_failures=[],
            assertion_results=checks,
            final_synthesis_result=final,
            traceability_complete=final.epistemic_validation_result.traceability_status.value
            != "INCOMPLETE",
            forbidden_inference_detected=final.final_verdict.value == "FORBIDDEN_INFERENCE",
            notes=[],
        )

    def run_suite(self, cases: list[EvaluationCase]) -> list[EvaluationResult]:
        return [self.run(case) for case in cases]
