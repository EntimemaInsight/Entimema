from pydantic import BaseModel, ConfigDict, Field

from concierge.dialogue_actions import ConciergeActionType, DialogueAction
from concierge.question_selection import QuestionCandidate
from domain.assumptions import AssumptionRecord
from domain.claims import ClaimRecord
from domain.contradictions import ContradictionRecord
from domain.conversation import ConversationMode
from domain.evidence import EvidenceRecord
from domain.hypotheses import HypothesisRecord
from domain.problem_state import ProblemState
from domain.transitions import StateTransition, TransitionRecord
from domain.unknowns import UnknownRecord


class DialogueTurnInput(BaseModel):
    model_config = ConfigDict(extra="forbid")

    session_id: str = Field(min_length=1)
    problem_id: str = Field(min_length=1)
    utterance: str = ""
    explicit_action_type: ConciergeActionType | None = None
    referenced_entity_ids: list[str] = Field(default_factory=list)
    supplied_claims: list[ClaimRecord] = Field(default_factory=list)
    supplied_evidence: list[EvidenceRecord] = Field(default_factory=list)
    supplied_unknowns: list[UnknownRecord] = Field(default_factory=list)
    supplied_assumptions: list[AssumptionRecord] = Field(default_factory=list)
    supplied_hypotheses: list[HypothesisRecord] = Field(default_factory=list)
    supplied_contradictions: list[ContradictionRecord] = Field(default_factory=list)
    unresolved_reference_candidates: list[str] = Field(default_factory=list)
    ambiguity_flags: list[str] = Field(default_factory=list)
    definition_mismatches: list[str] = Field(default_factory=list)
    user_requested_assumptions: list[str] = Field(default_factory=list)
    question_candidates: list[QuestionCandidate] = Field(default_factory=list)
    requested_mode: ConversationMode | None = None


class DialogueTurnResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    previous_state: StateTransition
    new_state: StateTransition
    actions: list[DialogueAction]
    updated_problem_state: ProblemState
    next_best_question: str | None = None
    repair_required: bool
    routing_ready: bool
    blocking_reason: str | None = None
    transition_record: TransitionRecord

    @property
    def question_count(self) -> int:
        return int(self.next_best_question is not None)
