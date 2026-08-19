from pydantic import BaseModel, ConfigDict

from agents.execution import AgentExecutionController, ValidatedAgentResult
from domain.enums import EpistemicVerdict
from domain.problem_state import ProblemState
from epistemic.controller import EpistemicController
from orchestrator.controller import CentralOrchestrator
from orchestrator.plans import OrchestrationPlan
from orchestrator.routing import OrchestrationRequest
from synthesis.reconciliation import CrossAgentReconciler
from synthesis.result import FinalSynthesisResult
from synthesis.synthesis import DecisionSynthesizer


class EndToEndRuntimeResult(BaseModel):
    model_config = ConfigDict(extra="forbid", arbitrary_types_allowed=True)
    pre_routing_validation: object
    orchestration_plan: OrchestrationPlan
    agent_results: list[ValidatedAgentResult]
    final_synthesis_result: FinalSynthesisResult


class EndToEndRuntime:
    def __init__(self) -> None:
        self.epistemic = EpistemicController()
        self.orchestrator = CentralOrchestrator()
        self.execution = AgentExecutionController()
        self.reconciler = CrossAgentReconciler()
        self.synthesizer = DecisionSynthesizer()

    def run(
        self,
        problem_state: ProblemState,
        requested_capabilities: list[str],
        evidence_ids_by_capability: dict[str, list[str]] | None = None,
    ) -> EndToEndRuntimeResult:
        pre = self.epistemic.validate_pre_routing(problem_state)
        request = OrchestrationRequest(
            validated_problem_state=problem_state,
            epistemic_validation_result=pre,
            requested_capabilities=requested_capabilities,
            evidence_ids_by_capability=evidence_ids_by_capability
            or {
                capability: [item.id for item in problem_state.evidence]
                for capability in requested_capabilities
            },
        )
        plan = self.orchestrator.create_plan(request)
        results = []
        if plan.ready:
            execution = self.execution.execute_plan(plan, problem_state, pre)
            results = execution.results
        reconciliation = self.reconciler.reconcile(
            problem_state, plan, results, plan.reconciliation_context
        )
        candidate = self.synthesizer.synthesize(
            problem_state,
            reconciliation,
            results,
            problem_state.user_goal,
            problem_state.decision_required,
        )
        final_validation = (
            self.epistemic.validate_final_synthesis(candidate, problem_state) if plan.ready else pre
        )
        validated = final_validation.validated_object_ids
        rejected = final_validation.rejected_object_ids
        conditional = final_validation.unresolved_object_ids
        final = FinalSynthesisResult(
            problem_id=problem_state.problem_id,
            operational_problem=problem_state.operational_problem or "Unresolved",
            reconciliation_result=reconciliation,
            candidate_synthesis=candidate,
            epistemic_validation_result=final_validation,
            validated_recommendation_ids=validated,
            conditional_recommendation_ids=conditional,
            rejected_recommendation_ids=rejected,
            unresolved_unknowns=reconciliation.unresolved_unknowns,
            unresolved_conflicts=[item.id for item in reconciliation.true_conflicts],
            final_verdict=final_validation.verdict,
            user_synthesis_ready=(
                bool(candidate.candidate_recommendations)
                and final_validation.verdict
                in {EpistemicVerdict.VALIDATED, EpistemicVerdict.CONDITIONALLY_VALID}
            ),
            human_decision_required=candidate.human_decision_required,
        )
        return EndToEndRuntimeResult(
            pre_routing_validation=pre,
            orchestration_plan=plan,
            agent_results=results,
            final_synthesis_result=final,
        )
