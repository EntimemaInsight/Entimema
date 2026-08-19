from enum import StrEnum
from itertools import combinations

from pydantic import BaseModel, ConfigDict, Field

from agents.execution import ValidatedAgentResult
from domain.problem_state import ProblemState
from orchestrator.plans import OrchestrationPlan, ReconciliationContext
from synthesis.conflicts import ConflictCategory, ConflictRecord


class FindingStatus(StrEnum):
    ALIGNED = "ALIGNED"
    DIVERGENT = "DIVERGENT"
    CONDITIONAL = "CONDITIONAL"
    CONFLICTED = "CONFLICTED"
    UNRESOLVED = "UNRESOLVED"


class ReconciledFinding(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    proposition: str
    source_agent_ids: list[str]
    evidence_ids: list[str] = Field(default_factory=list)
    inference_ids: list[str] = Field(default_factory=list)
    assumption_ids: list[str] = Field(default_factory=list)
    scope: str | None = None
    horizon: str | None = None
    definition_context: list[str] = Field(default_factory=list)
    status: FindingStatus


class AgentIndependenceAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    agent_a_id: str
    agent_b_id: str
    shared_evidence_ids: list[str]
    shared_assumption_ids: list[str]
    shared_model_ids: list[str]
    shared_methodology: list[str]
    independent: bool
    rationale: str


class CrossAgentReconciliationResult(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    problem_id: str
    agent_result_ids: list[str]
    aligned_findings: list[ReconciledFinding]
    divergent_findings: list[ReconciledFinding]
    definition_differences: list[ConflictRecord]
    horizon_differences: list[ConflictRecord]
    scope_differences: list[ConflictRecord]
    assumption_differences: list[ConflictRecord]
    methodology_differences: list[ConflictRecord]
    shared_evidence_ids: list[str]
    shared_assumption_ids: list[str]
    independence_assessments: list[AgentIndependenceAssessment]
    true_conflicts: list[ConflictRecord]
    unresolved_unknowns: list[str]
    synthesis_ready: bool
    blocking_reasons: list[str]

    @property
    def findings(self) -> list[ReconciledFinding]:
        return [*self.aligned_findings, *self.divergent_findings]


OPPOSITES = (
    (" adequate", " inadequate"),
    (" improving", " deteriorating"),
    (" increased", " decreased"),
    (" increase", " decrease"),
    (" matched", " mismatch"),
)


class CrossAgentReconciler:
    def reconcile(
        self,
        validated_problem_state: ProblemState,
        orchestration_plan: OrchestrationPlan,
        validated_agent_results: list[ValidatedAgentResult],
        reconciliation_context: ReconciliationContext | None = None,
    ) -> CrossAgentReconciliationResult:
        task_by_id = {item.task_id: item for item in orchestration_plan.agent_tasks}
        raw = []
        for result in validated_agent_results:
            task = task_by_id.get(result.agent_result.task_id)
            for conclusion in result.agent_result.conclusion_records:
                if conclusion.id in result.rejected_conclusion_ids:
                    continue
                definitions = sorted(
                    {
                        item.definition
                        for item in validated_problem_state.evidence
                        if item.id in conclusion.evidence_ids and item.definition
                    }
                )
                raw.append(
                    ReconciledFinding(
                        id=f"finding-{conclusion.id}",
                        proposition=conclusion.proposition,
                        source_agent_ids=[result.agent_result.agent_id],
                        evidence_ids=conclusion.evidence_ids,
                        inference_ids=conclusion.inference_ids,
                        assumption_ids=conclusion.assumption_ids,
                        scope=task.scope if task else None,
                        horizon=task.horizon if task else None,
                        definition_context=definitions,
                        status=(
                            FindingStatus.CONDITIONAL
                            if conclusion.id in result.conditional_conclusion_ids
                            else FindingStatus.DIVERGENT
                        ),
                    )
                )
        grouped: dict[str, list[ReconciledFinding]] = {}
        for item in raw:
            grouped.setdefault(item.proposition.casefold().strip(), []).append(item)
        findings = []
        for group in grouped.values():
            first = group[0]
            aligned = len({agent for item in group for agent in item.source_agent_ids}) > 1
            findings.append(
                first.model_copy(
                    update={
                        "source_agent_ids": sorted(
                            {agent for item in group for agent in item.source_agent_ids}
                        ),
                        "evidence_ids": sorted(
                            {value for item in group for value in item.evidence_ids}
                        ),
                        "assumption_ids": sorted(
                            {value for item in group for value in item.assumption_ids}
                        ),
                        "status": (
                            FindingStatus.CONDITIONAL
                            if any(item.assumption_ids for item in group)
                            else FindingStatus.ALIGNED
                            if aligned
                            else first.status
                        ),
                    }
                )
            )
        differences = {category: [] for category in ConflictCategory}
        for left, right in combinations(findings, 2):
            category = self._classify(left, right)
            if category:
                differences[category].append(
                    ConflictRecord(
                        id=f"conflict-{left.id}-{right.id}",
                        finding_ids=[left.id, right.id],
                        category=category,
                        rationale=self._rationale(category),
                    )
                )
                if category is ConflictCategory.TRUE_CONFLICT:
                    findings = [
                        item.model_copy(update={"status": FindingStatus.CONFLICTED})
                        if item.id in {left.id, right.id}
                        else item
                        for item in findings
                    ]
        independence = self._independence(validated_agent_results)
        shared_evidence = sorted(
            {value for item in independence for value in item.shared_evidence_ids}
        )
        shared_assumptions = sorted(
            {value for item in independence for value in item.shared_assumption_ids}
        )
        if reconciliation_context:
            shared_evidence = sorted(
                set(shared_evidence) | set(reconciliation_context.shared_evidence_ids)
            )
            shared_assumptions = sorted(
                set(shared_assumptions) | set(reconciliation_context.shared_assumption_ids)
            )
        unknowns = sorted(
            {
                value
                for item in validated_agent_results
                for value in item.agent_result.unresolved_unknowns
            }
        )
        true_conflicts = differences[ConflictCategory.TRUE_CONFLICT]
        return CrossAgentReconciliationResult(
            problem_id=validated_problem_state.problem_id,
            agent_result_ids=[item.agent_result.task_id for item in validated_agent_results],
            aligned_findings=[item for item in findings if item.status is FindingStatus.ALIGNED],
            divergent_findings=[
                item for item in findings if item.status is not FindingStatus.ALIGNED
            ],
            definition_differences=differences[ConflictCategory.DEFINITIONAL],
            horizon_differences=differences[ConflictCategory.TEMPORAL],
            scope_differences=differences[ConflictCategory.SCOPE],
            assumption_differences=differences[ConflictCategory.ASSUMPTION],
            methodology_differences=differences[ConflictCategory.METHODOLOGICAL],
            shared_evidence_ids=shared_evidence,
            shared_assumption_ids=shared_assumptions,
            independence_assessments=independence,
            true_conflicts=true_conflicts,
            unresolved_unknowns=unknowns,
            synthesis_ready=not true_conflicts,
            blocking_reasons=[f"TRUE_CONFLICT:{item.id}" for item in true_conflicts],
        )

    @staticmethod
    def _classify(left: ReconciledFinding, right: ReconciledFinding):
        if not CrossAgentReconciler._opposed(left.proposition, right.proposition):
            return None
        if left.definition_context != right.definition_context:
            return ConflictCategory.DEFINITIONAL
        if left.horizon != right.horizon:
            return ConflictCategory.TEMPORAL
        if left.scope != right.scope:
            return ConflictCategory.SCOPE
        if set(left.assumption_ids) != set(right.assumption_ids):
            return ConflictCategory.ASSUMPTION
        if set(left.evidence_ids) & set(right.evidence_ids):
            return ConflictCategory.METHODOLOGICAL
        if set(left.inference_ids) != set(right.inference_ids):
            return ConflictCategory.METHODOLOGICAL
        return ConflictCategory.TRUE_CONFLICT

    @staticmethod
    def _opposed(left: str, right: str) -> bool:
        left, right = f" {left.casefold()}", f" {right.casefold()}"
        return any((a in left and b in right) or (b in left and a in right) for a, b in OPPOSITES)

    @staticmethod
    def _rationale(category: ConflictCategory) -> str:
        if category is ConflictCategory.TRUE_CONFLICT:
            return (
                "Materially incompatible findings share definition, horizon, scope, "
                "and assumptions."
            )
        return (
            f"Apparent disagreement is classified as {category.value.lower()}, not true conflict."
        )

    @staticmethod
    def _independence(results):
        assessments = []
        for left, right in combinations(results, 2):
            evidence = sorted(
                set(left.agent_result.evidence_used) & set(right.agent_result.evidence_used)
            )
            assumptions = sorted(
                set(left.agent_result.assumptions_used) & set(right.agent_result.assumptions_used)
            )
            models = sorted(
                set(left.agent_result.model_outputs) & set(right.agent_result.model_outputs)
            )
            shared_methodology = sorted(
                set(left.agent_result.calculations) & set(right.agent_result.calculations)
            )
            independent = not (evidence or assumptions or models or shared_methodology)
            assessments.append(
                AgentIndependenceAssessment(
                    agent_a_id=left.agent_result.agent_id,
                    agent_b_id=right.agent_result.agent_id,
                    shared_evidence_ids=evidence,
                    shared_assumption_ids=assumptions,
                    shared_model_ids=models,
                    shared_methodology=shared_methodology,
                    independent=independent,
                    rationale=(
                        "No shared upstream dependencies detected."
                        if independent
                        else (
                            "Agreement shares upstream dependencies and is not independent "
                            "confirmation."
                        )
                    ),
                )
            )
        return assessments
