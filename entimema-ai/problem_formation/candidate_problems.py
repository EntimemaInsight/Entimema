from enum import IntEnum

from pydantic import BaseModel, ConfigDict, Field

from problem_formation.problem_objects import GoalType, ProblemGranularity, ProblemObject


class FitLevel(IntEnum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3


class CandidateOperationalProblem(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    id: str = Field(min_length=1)
    formulation: str = Field(min_length=1)
    object: ProblemObject
    goal: GoalType
    decision: str | None = None
    horizon: str | None = None
    scope: str | None = None
    granularity: ProblemGranularity = ProblemGranularity.UNKNOWN
    supporting_evidence_ids: list[str] = Field(default_factory=list)
    required_assumption_ids: list[str] = Field(default_factory=list)
    unresolved_unknown_ids: list[str] = Field(default_factory=list)
    contradiction_ids: list[str] = Field(default_factory=list)
    domain_candidates: list[str] = Field(default_factory=list)
    source: str = Field(min_length=1)
    requires_user_confirmation: bool = False
    evidence_fit: FitLevel = FitLevel.MEDIUM
    goal_fit: FitLevel = FitLevel.MEDIUM
    decision_relevance: FitLevel = FitLevel.MEDIUM
    material_contradiction_ids: list[str] = Field(default_factory=list)


class CandidateProblemScore(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)

    candidate_id: str
    evidence_fit: FitLevel
    goal_fit: FitLevel
    decision_relevance: FitLevel
    assumption_burden: int = Field(ge=0)
    contradiction_penalty: int = Field(ge=0)
    ordinal_total: int
    admissible: bool


def score_candidate(candidate: CandidateOperationalProblem) -> CandidateProblemScore:
    assumption_burden = len(candidate.required_assumption_ids)
    contradiction_penalty = len(candidate.contradiction_ids) * 2
    total = (
        int(candidate.evidence_fit)
        + int(candidate.goal_fit)
        + int(candidate.decision_relevance)
        - assumption_burden
        - contradiction_penalty
    )
    return CandidateProblemScore(
        candidate_id=candidate.id,
        evidence_fit=candidate.evidence_fit,
        goal_fit=candidate.goal_fit,
        decision_relevance=candidate.decision_relevance,
        assumption_burden=assumption_burden,
        contradiction_penalty=contradiction_penalty,
        ordinal_total=total,
        admissible=not candidate.material_contradiction_ids,
    )


def rank_candidates(
    candidates: list[CandidateOperationalProblem],
) -> list[tuple[CandidateOperationalProblem, CandidateProblemScore]]:
    scored = [(candidate, score_candidate(candidate)) for candidate in candidates]
    return sorted(
        scored,
        key=lambda item: (
            not item[1].admissible,
            -item[1].ordinal_total,
            item[0].id,
        ),
    )
