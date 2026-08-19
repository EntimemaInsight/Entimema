"""Permanent regression tests for the socioanalytic computational invariants."""

from datetime import UTC, datetime

import pytest
from pydantic import ValidationError

from domain.enums import EpistemicType, Materiality
from domain.evidence import EvidenceRecord
from domain.hypotheses import HypothesisRecord, HypothesisStatus
from domain.problem_state import ProblemState
from domain.transitions import StateTransition
from domain.unknowns import UnknownRecord
from problem_formation.engine import ProblemFormationEngine, ProblemFormationInput
from problem_formation.hypothesis_space import EvidenceHypothesisImpact, HypothesisImpact
from problem_formation.problem_objects import (
    CategoryProvenance,
    InterpretationRecord,
    InterpretationStatus,
    SourceCategoryMetadata,
    SpeechActRecord,
    SpeechActType,
)


def state() -> ProblemState:
    return ProblemState(session_id="s1", problem_id="p1")


def formation(declared: str, **updates) -> ProblemFormationInput:
    return ProblemFormationInput(problem_id="p1", declared_problem=declared, **updates)


def hypothesis(identifier: str, proposition: str) -> HypothesisRecord:
    return HypothesisRecord(
        id=identifier,
        proposition=proposition,
        source="USER_PROPOSED",
        observable_implications=["A discriminating observable result exists"],
        falsification_condition="The observable implication does not occur",
    )


def test_sa_001_indexicality_requires_repair_before_reframing() -> None:
    result = ProblemFormationEngine().form_problem(
        state(),
        formation(
            "Това трябва да го спрем.",
            unresolved_reference_candidates=["Product A", "Process B"],
        ),
    )
    assert result.recommended_dialogue_state is StateTransition.REPAIR
    assert result.operational_problem is None
    assert not result.readiness.semantic_clarity


def test_sa_005_background_expectancy_keeps_missing_debt_unknown() -> None:
    debt = UnknownRecord(
        id="u-debt",
        variable="debt balance",
        why_needed="cash and solvency interpretation",
        materiality=Materiality.HIGH,
        resolvable=True,
    )
    result = ProblemFormationEngine().form_problem(
        state(), formation("Assess cash shortage", supplied_unknowns=[debt])
    )
    assert result.updated_problem_state.unknowns == [debt]
    assert result.updated_problem_state.assumptions == []


def test_sa_004_self_repair_supersedes_system_interpretation() -> None:
    history = [
        InterpretationRecord(
            value="EBITDA",
            source=CategoryProvenance.SYSTEM_PROPOSED,
            status=InterpretationStatus.SUPERSEDED,
        ),
        InterpretationRecord(
            value="нетната печалба",
            source=CategoryProvenance.USER_ORIGINATED,
            supersedes="EBITDA",
        ),
    ]
    result = ProblemFormationEngine().form_problem(
        state(),
        formation(
            "Не говоря за EBITDA, а за нетната печалба.",
            interpretation_history=history,
        ),
    )
    assert result.interpretation_history == history
    assert result.interpretation_history[-1].status is InterpretationStatus.ACTIVE


def test_sa_007_evidence_is_interpreted_before_hypothesis_impact() -> None:
    evidence = EvidenceRecord(
        id="e-dso",
        proposition="DSO was stable in the measured period",
        evidence_type=EpistemicType.CALCULATED,
        source="ledger",
        source_type="system",
        timestamp=datetime.now(UTC),
        reliability=0.95,
    )
    impact = EvidenceHypothesisImpact(
        evidence_id=evidence.id,
        hypothesis_id="h-receivables",
        independent_interpretation="DSO did not materially change",
        impact=HypothesisImpact.WEAKENS,
    )
    result = ProblemFormationEngine().form_problem(
        state(),
        formation(
            "Why is cash falling?",
            supplied_evidence=[evidence],
            supplied_evidence_ids=[evidence.id],
            supplied_hypotheses=[
                hypothesis("h-receivables", "Receivables growth causes the cash decline")
            ],
            evidence_hypothesis_impacts=[impact],
        ),
    )
    assert result.evidence_hypothesis_impacts == [impact]
    with pytest.raises(ValidationError):
        EvidenceHypothesisImpact(
            evidence_id=evidence.id,
            hypothesis_id="h-receivables",
            independent_interpretation="",
            impact=HypothesisImpact.SUPPORTS,
        )


def test_sa_009_only_operationally_relevant_categories_are_active() -> None:
    categories = [
        SourceCategoryMetadata(
            category="payment history",
            provenance=CategoryProvenance.USER_ORIGINATED,
        ),
        SourceCategoryMetadata(
            category="office location",
            provenance=CategoryProvenance.USER_ORIGINATED,
            operationally_relevant=False,
        ),
    ]
    result = ProblemFormationEngine().form_problem(
        state(), formation("Assess late payment", source_category_metadata=categories)
    )
    assert [item.category for item in result.active_categories] == ["payment history"]


def test_sa_010_category_does_not_exhaust_entity() -> None:
    category = SourceCategoryMetadata(
        category="HIGH_RISK",
        provenance=CategoryProvenance.SYSTEM_PROPOSED,
        source_domain="credit model",
        definition="Scoped model classification output",
        scope="Model v4 portfolio classification",
    )
    result = ProblemFormationEngine().form_problem(
        state(), formation("Assess client", source_category_metadata=[category])
    )
    assert result.active_categories[0].definition == "Scoped model classification output"
    assert result.updated_problem_state.relevant_entities == []


def test_sa_011_coherent_narrative_remains_user_hypothesis() -> None:
    narrative = hypothesis("h-story", "The historical sequence caused the current failure")
    result = ProblemFormationEngine().form_problem(
        state(), formation("Explain failure", embedded_hypotheses=[narrative])
    )
    stored = result.updated_problem_state.hypotheses[0]
    assert stored.source == "USER_PROPOSED"
    assert stored.status is HypothesisStatus.ACTIVE
    assert result.updated_problem_state.claims == []


def test_sa_012_hysteresis_allows_observable_legacy_fit_hypothesis() -> None:
    legacy = hypothesis(
        "h-legacy",
        "A documented old policy persisted after an observable market change",
    )
    result = ProblemFormationEngine().form_problem(
        state(), formation("Assess policy fit", supplied_hypotheses=[legacy])
    )
    assert result.hypothesis_eligibility[0].eligible
    assert "resists change" not in result.updated_problem_state.hypotheses[0].proposition


def test_sa_013_hypothetical_language_remains_exploration() -> None:
    act = SpeechActRecord(
        content="Maybe we should close the product.",
        act_type=SpeechActType.EXPLORATION,
        source="user",
    )
    result = ProblemFormationEngine().form_problem(
        state(), formation(act.content, speech_acts=[act])
    )
    assert result.speech_acts[0].act_type is SpeechActType.EXPLORATION
    assert result.updated_problem_state.decision_required is None


def test_sa_015_non_answer_is_unknown_not_concealment() -> None:
    unknown = UnknownRecord(
        id="u-debt-answer",
        variable="debt response",
        why_needed="debt is decision-relevant",
        materiality=Materiality.MEDIUM,
        resolvable=True,
    )
    result = ProblemFormationEngine().form_problem(
        state(), formation("Debt was not answered", supplied_unknowns=[unknown])
    )
    assert result.updated_problem_state.unknowns[0].variable == "debt response"
    assert result.updated_problem_state.hypotheses == []


def test_sa_016_behaviour_does_not_establish_mental_state() -> None:
    prohibited = hypothesis("h-mental", "Hesitation proves anxiety and deception")
    result = ProblemFormationEngine().form_problem(
        state(), formation("Assess answer", supplied_hypotheses=[prohibited])
    )
    assert result.hypothesis_eligibility[0].forbidden_inference
    assert result.updated_problem_state.hypotheses[0].status is HypothesisStatus.REJECTED
    assert result.recommended_dialogue_state is StateTransition.FORBIDDEN_INFERENCE


def test_sa_006_reflexivity_preserves_system_then_user_confirmation() -> None:
    categories = [
        SourceCategoryMetadata(
            category="profitability",
            provenance=CategoryProvenance.SYSTEM_PROPOSED,
        ),
        SourceCategoryMetadata(
            category="profitability",
            provenance=CategoryProvenance.USER_CONFIRMED,
            supersedes="SYSTEM_PROPOSED:profitability",
        ),
    ]
    result = ProblemFormationEngine().form_problem(
        state(), formation("Assess profitability", source_category_metadata=categories)
    )
    assert [item.provenance for item in result.active_categories] == [
        CategoryProvenance.SYSTEM_PROPOSED,
        CategoryProvenance.USER_CONFIRMED,
    ]
