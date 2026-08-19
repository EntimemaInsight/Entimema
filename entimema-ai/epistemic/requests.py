from enum import StrEnum
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from domain.agents import AgentResult, AgentTask
from domain.problem_state import ProblemState
from epistemic.inference_validation import CalculationRecord, InferenceRecord


class ValidationStage(StrEnum):
    PRE_ROUTING = "PRE_ROUTING"
    POST_AGENT = "POST_AGENT"
    PRE_SYNTHESIS = "PRE_SYNTHESIS"
    FINAL_ADMISSIBILITY = "FINAL_ADMISSIBILITY"


class AgentResultContract(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    inference_ids: list[str] = Field(default_factory=list)
    calculation_ids: list[str] = Field(default_factory=list)
    payload: Any | None = None
    agent_result: AgentResult | None = None
    agent_task: AgentTask | None = None
    calculations: list[CalculationRecord] = Field(default_factory=list)


class SynthesisContract(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    source_result_ids: list[str] = Field(default_factory=list)
    payload: Any | None = None


class EpistemicValidationRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    problem_state: ProblemState
    validation_stage: ValidationStage
    candidate_inferences: list[InferenceRecord] = Field(default_factory=list)
    candidate_output: Any | None = None
    agent_result: AgentResultContract | None = None
    synthesis: SynthesisContract | None = None
