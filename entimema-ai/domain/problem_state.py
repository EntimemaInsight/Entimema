from datetime import UTC, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from concierge.repair import RepairRecord
from concierge.routing_gate import ProblemFormationReadiness
from domain.assumptions import AssumptionRecord
from domain.claims import ClaimRecord
from domain.contradictions import ContradictionRecord
from domain.conversation import ConversationState
from domain.enums import DecisionReadiness, EpistemicVerdict, WorkspacePhase
from domain.evidence import EvidenceRecord
from domain.hypotheses import HypothesisRecord
from domain.transitions import StateTransition
from domain.unknowns import UnknownRecord


def utc_now() -> datetime:
    return datetime.now(UTC)


class ProblemState(BaseModel):
    """Central shared contract passed between future runtime components."""

    model_config = ConfigDict(extra="forbid")

    session_id: str = Field(min_length=1)
    problem_id: str = Field(min_length=1)
    user_goal: str | None = None
    declared_problem: str | None = None
    operational_problem: str | None = None
    current_activity: str | None = None
    decision_required: str | None = None
    decision_horizon: str | None = None
    domain_scope: list[str] = Field(default_factory=list)
    claims: list[ClaimRecord] = Field(default_factory=list)
    evidence: list[EvidenceRecord] = Field(default_factory=list)
    unknowns: list[UnknownRecord] = Field(default_factory=list)
    assumptions: list[AssumptionRecord] = Field(default_factory=list)
    hypotheses: list[HypothesisRecord] = Field(default_factory=list)
    contradictions: list[ContradictionRecord] = Field(default_factory=list)
    constraints: list[str] = Field(default_factory=list)
    relevant_entities: list[str] = Field(default_factory=list)
    lifecycle_state: StateTransition = StateTransition.INTAKE
    repairs: list[RepairRecord] = Field(default_factory=list)
    formation_readiness: ProblemFormationReadiness = Field(
        default_factory=ProblemFormationReadiness
    )
    conversation_state: ConversationState = Field(default_factory=ConversationState)
    next_best_question: str | None = None
    routing_ready: bool = False
    epistemic_verdict: EpistemicVerdict | None = None
    workspace_phase: WorkspacePhase = WorkspacePhase.INTAKE
    decision_readiness: DecisionReadiness = DecisionReadiness.BLOCKED
    blockers: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=utc_now)
    updated_at: datetime = Field(default_factory=utc_now)

    @model_validator(mode="after")
    def validate_timestamps_and_ids(self) -> "ProblemState":
        if self.updated_at < self.created_at:
            raise ValueError("updated_at cannot precede created_at")
        for collection in (
            self.claims,
            self.evidence,
            self.unknowns,
            self.assumptions,
            self.hypotheses,
            self.contradictions,
            self.repairs,
        ):
            ids = [item.id for item in collection]
            if len(ids) != len(set(ids)):
                raise ValueError("record IDs must be unique within each collection")
        return self
