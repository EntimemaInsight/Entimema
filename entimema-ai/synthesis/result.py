from pydantic import BaseModel, ConfigDict

from domain.enums import EpistemicVerdict
from epistemic.verdicts import EpistemicValidationResult
from synthesis.reconciliation import CrossAgentReconciliationResult
from synthesis.synthesis import CandidateDecisionSynthesis


class FinalSynthesisResult(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    problem_id: str
    operational_problem: str
    reconciliation_result: CrossAgentReconciliationResult
    candidate_synthesis: CandidateDecisionSynthesis
    epistemic_validation_result: EpistemicValidationResult
    validated_recommendation_ids: list[str]
    conditional_recommendation_ids: list[str]
    rejected_recommendation_ids: list[str]
    unresolved_unknowns: list[str]
    unresolved_conflicts: list[str]
    final_verdict: EpistemicVerdict
    user_synthesis_ready: bool
    human_decision_required: bool


class UserSynthesisView(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    what_we_know: list[str]
    what_we_infer: list[str]
    what_remains_unknown: list[str]
    what_matters_for_decision: list[str]
    recommended_actions: list[str]
    what_would_change_recommendation: list[str]
    epistemic_status: EpistemicVerdict


def build_user_synthesis(result: FinalSynthesisResult) -> UserSynthesisView:
    findings = result.reconciliation_result.findings
    return UserSynthesisView(
        what_we_know=[item.proposition for item in findings if item.evidence_ids],
        what_we_infer=[item.proposition for item in findings if item.inference_ids],
        what_remains_unknown=result.unresolved_unknowns,
        what_matters_for_decision=[result.operational_problem],
        recommended_actions=[
            item.proposition for item in result.candidate_synthesis.candidate_recommendations
        ],
        what_would_change_recommendation=[
            *result.candidate_synthesis.limitations,
            *result.unresolved_conflicts,
        ],
        epistemic_status=result.final_verdict,
    )
