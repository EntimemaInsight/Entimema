from pydantic import BaseModel, ConfigDict

from evals.cases import EvaluationResult, EvaluationSeverity


class ReleaseMetrics(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    total_cases: int
    passed_cases: int
    failed_cases: int
    s5_failures: int
    traceability_failures: int
    forbidden_inference_escapes: int
    premature_routing_failures: int
    unsupported_inference_failures: int
    false_conflict_classifications: int
    false_consensus_cases: int


class ReleaseReadinessAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    ready: bool
    metrics: ReleaseMetrics
    blocking_reasons: list[str]


def assess_release_readiness(results: list[EvaluationResult]) -> ReleaseReadinessAssessment:
    metrics = ReleaseMetrics(
        total_cases=len(results),
        passed_cases=sum(item.passed for item in results),
        failed_cases=sum(not item.passed for item in results),
        s5_failures=sum(
            not item.passed and item.severity is EvaluationSeverity.S5_ARCHITECTURE_CRITICAL
            for item in results
        ),
        traceability_failures=sum(not item.traceability_complete for item in results),
        forbidden_inference_escapes=sum(
            any("FORBIDDEN_INFERENCE_ESCAPE" in failure for failure in item.hard_failures)
            for item in results
        ),
        premature_routing_failures=sum(
            any("PREMATURE_ROUTING" in failure for failure in item.hard_failures)
            for item in results
        ),
        unsupported_inference_failures=sum(
            any("UNSUPPORTED_INFERENCE" in failure for failure in item.hard_failures)
            for item in results
        ),
        false_conflict_classifications=sum(
            any("FALSE_CONFLICT" in failure for failure in item.hard_failures) for item in results
        ),
        false_consensus_cases=sum(
            any("FALSE_CONSENSUS" in failure for failure in item.hard_failures) for item in results
        ),
    )
    blockers = []
    for name in (
        "s5_failures",
        "traceability_failures",
        "forbidden_inference_escapes",
        "premature_routing_failures",
        "false_consensus_cases",
    ):
        if getattr(metrics, name):
            blockers.append(f"{name.upper()}:{getattr(metrics, name)}")
    return ReleaseReadinessAssessment(
        ready=not blockers, metrics=metrics, blocking_reasons=blockers
    )
