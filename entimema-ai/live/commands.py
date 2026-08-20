"""Typed mutation contract between interpretation and the canonical aggregate."""

from pydantic import BaseModel, ConfigDict, Field

from domain.assumptions import AssumptionRecord
from domain.claims import ClaimRecord
from domain.hypotheses import HypothesisRecord
from domain.unknowns import UnknownRecord
from problem_formation.candidate_problems import CandidateOperationalProblem
from problem_formation.problem_objects import GoalType, ProblemObject


class ApplyInterpretedTurn(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    command_id: str = Field(min_length=1)
    expected_version: int = Field(ge=0)
    declared_problem: str
    candidate_object: ProblemObject | None = None
    candidate_goal: GoalType | None = None
    decision: str | None = None
    horizon: str | None = None
    scope: str | None = None
    claims: list[ClaimRecord] = Field(default_factory=list)
    assumptions: list[AssumptionRecord] = Field(default_factory=list)
    hypotheses: list[HypothesisRecord] = Field(default_factory=list)
    unknowns: list[UnknownRecord] = Field(default_factory=list)
    operational_candidates: list[CandidateOperationalProblem] = Field(default_factory=list)
    unresolved_references: list[str] = Field(default_factory=list)
    requested_capabilities: list[str] = Field(default_factory=list)
