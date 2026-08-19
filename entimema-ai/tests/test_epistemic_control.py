from datetime import UTC, datetime

from domain.assumptions import AssumptionRecord
from domain.claims import ClaimRecord
from domain.contradictions import ContradictionRecord, ContradictionStatus, ContradictionType
from domain.enums import EpistemicType, EpistemicVerdict, Materiality
from domain.evidence import EvidenceRecord
from domain.hypotheses import HypothesisRecord
from domain.problem_state import ProblemState
from domain.unknowns import UnknownRecord
from epistemic.anti_documentary import assess_confirmation_dependency
from epistemic.compatibility import ComparableObject, assess_compatibility
from epistemic.controller import EpistemicController
from epistemic.inference_validation import (
    ClassificationMetadata,
    InferenceRecord,
    validate_evidence_type,
)
from epistemic.provenance import ClaimValidationStatus, validate_claim
from epistemic.traceability import (
    TraceabilityGraph,
    TraceEdge,
    TraceEdgeType,
    TraceNode,
    TraceNodeType,
)
from epistemic.verdicts import RequiredNextAction
from problem_formation.hypothesis_space import EvidenceHypothesisImpact, HypothesisImpact


def state(**updates) -> ProblemState:
    values = {
        "session_id": "s1",
        "problem_id": "p1",
        "operational_problem": "Diagnose the bounded cash variance",
        "decision_required": "Choose a corrective action",
    }
    values.update(updates)
    return ProblemState(**values)


def evidence(identifier: str = "e1") -> EvidenceRecord:
    now = datetime.now(UTC)
    return EvidenceRecord(
        id=identifier,
        proposition="Cash declined",
        evidence_type=EpistemicType.RETRIEVED,
        source="ledger",
        source_type="system",
        timestamp=now,
        period_start=now,
        period_end=now,
        provenance=["ledger:cash"],
        transformations=[],
        reliability=0.99,
        scope="entity-a",
    )


def inference(**updates) -> InferenceRecord:
    values = {
        "id": "i1",
        "conclusion": "Cash declined during the period",
        "premise_ids": ["e1"],
        "methodology": "period comparison",
        "rule": "compare like-for-like balances",
        "uncertainty": "low",
        "source": "finance",
    }
    values.update(updates)
    return InferenceRecord(**values)


def test_ec_001_claim_remains_separate_from_evidence() -> None:
    claim = ClaimRecord(
        id="c1", proposition="Cash declined", source="user", timestamp=datetime.now(UTC)
    )
    relation = validate_claim(claim, ["e1"])
    assert relation.status is ClaimValidationStatus.SUPPORTED
    assert relation.claim_id == claim.id
    assert claim.evidence_links == []


def test_ec_002_model_output_cannot_pass_as_observation() -> None:
    assert not validate_evidence_type(EpistemicType.MODEL_PRODUCED, EpistemicType.OBSERVED)


def test_ec_003_unregistered_premise_is_assumption_leakage() -> None:
    result = EpistemicController().validate_pre_routing(
        state(), [inference(premise_ids=["missing"])]
    )
    assert result.verdict is EpistemicVerdict.TRACEABILITY_FAILURE
    assert any("ASSUMPTION_LEAKAGE" in item for item in result.blocking_reasons)


def test_ec_004_registered_material_assumption_can_be_conditional() -> None:
    assumption = AssumptionRecord(
        id="a1",
        proposition="Scenario growth is 5%",
        reason="planning case",
        materiality=Materiality.HIGH,
        validation_required=True,
        source="user",
        scenario_only=True,
    )
    result = EpistemicController().validate_pre_routing(state(assumptions=[assumption]))
    assert result.verdict is EpistemicVerdict.CONDITIONALLY_VALID


def comparable(identifier: str, **updates) -> ComparableObject:
    now = datetime.now(UTC)
    values = {
        "id": identifier,
        "definition": "gross margin",
        "unit": "%",
        "period_start": now,
        "period_end": now,
        "scope": "group",
        "basis": "IFRS",
    }
    values.update(updates)
    return ComparableObject(**values)


def test_ec_005_definition_mismatch_is_inadmissible() -> None:
    result = assess_compatibility(comparable("gross"), comparable("net", definition="net margin"))
    assert not result.definition_match and not result.admissible


def test_ec_006_period_mismatch_is_not_automatically_a_contradiction() -> None:
    later = datetime(2030, 1, 1, tzinfo=UTC)
    result = assess_compatibility(
        comparable("current"), comparable("stress", period_start=later, period_end=later)
    )
    assert not result.period_match and "contradiction" not in " ".join(result.issues).lower()


def test_ec_007_scope_mismatch_blocks_silent_comparison() -> None:
    result = assess_compatibility(comparable("group"), comparable("sub", scope="subsidiary"))
    assert not result.scope_match and not result.admissible


def test_ec_008_documentary_dependency_without_independent_interpretation_blocks() -> None:
    result = assess_confirmation_dependency("h1", ["e1"], "e2", None)
    assert result.dependency_detected and result.blocking


def test_ec_009_independent_interpretation_makes_impact_admissible() -> None:
    impact = EvidenceHypothesisImpact(
        evidence_id="e2",
        hypothesis_id="h1",
        independent_interpretation="DSO remained stable",
        impact=HypothesisImpact.WEAKENS,
        interpretation_order=1,
    )
    result = assess_confirmation_dependency("h1", ["e1"], "e2", impact.independent_interpretation)
    assert not result.dependency_detected
    assert impact.interpretation_order == 1


def test_ec_010_contradiction_checks_definition_before_logic() -> None:
    contradiction = ContradictionRecord(
        id="x1",
        proposition_a="A",
        proposition_b="B",
        contradiction_type=ContradictionType.TRUE_LOGICAL_CONTRADICTION,
    )
    result = EpistemicController().validate_contradictions(state(contradictions=[contradiction]))[0]
    assert result.evaluated_dimensions[0] is ContradictionType.DEFINITIONAL
    assert result.evaluated_dimensions[-1] is ContradictionType.TRUE_LOGICAL_CONTRADICTION


def test_ec_011_forbidden_inference_has_absolute_veto() -> None:
    unsafe = inference(trigger="hesitation", conclusion="The user is showing deception")
    result = EpistemicController().validate_pre_routing(state(evidence=[evidence()]), [unsafe])
    assert result.verdict is EpistemicVerdict.FORBIDDEN_INFERENCE
    assert result.required_next_action is RequiredNextAction.REMOVE_FORBIDDEN_INFERENCE


def test_ec_012_missing_information_remains_unknown() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="debt",
        why_needed="liquidity",
        materiality=Materiality.MEDIUM,
        resolvable=True,
    )
    original = state(unknowns=[unknown])
    EpistemicController().validate_pre_routing(original)
    assert original.unknowns == [unknown] and original.hypotheses == []


def test_ec_013_scoped_classification_valid_but_essentialisation_invalid() -> None:
    scoped = ClassificationMetadata(
        classification="HIGH_RISK",
        classification_source="model-x",
        scope="portfolio-a",
        horizon="12m",
        authority="risk-policy",
    )
    assert scoped.admissible
    assert not scoped.model_copy(update={"essentialised": True}).admissible


def test_ec_014_narrative_coherence_is_not_causal_evidence() -> None:
    story = HypothesisRecord(
        id="h1",
        proposition="The coherent history caused failure",
        source="USER_PROPOSED",
        observable_implications=[],
        falsification_condition=None,
    )
    result = EpistemicController().validate_pre_routing(state(hypotheses=[story]))
    assert result.verdict is EpistemicVerdict.INSUFFICIENT_EVIDENCE


def graph(include_evidence: bool = True) -> TraceabilityGraph:
    nodes = [TraceNode(id="i1", node_type=TraceNodeType.INFERENCE)]
    if include_evidence:
        nodes.append(TraceNode(id="e1", node_type=TraceNodeType.EVIDENCE))
    return TraceabilityGraph(
        nodes=nodes,
        edges=[TraceEdge(source_id="i1", target_id="e1", edge_type=TraceEdgeType.DERIVED_FROM)],
    )


def test_ec_015_complete_traceability_graph_passes() -> None:
    result = EpistemicController().validate_traceability("i1", graph())
    assert result.complete and result.verdict is EpistemicVerdict.VALIDATED


def test_ec_016_broken_traceability_graph_fails() -> None:
    result = EpistemicController().validate_traceability("i1", graph(False))
    assert not result.complete and result.verdict is EpistemicVerdict.TRACEABILITY_FAILURE


def test_ec_017_critical_unknown_is_insufficient_evidence() -> None:
    unknown = UnknownRecord(
        id="u1",
        variable="debt",
        why_needed="routing",
        materiality=Materiality.CRITICAL,
        resolvable=False,
    )
    result = EpistemicController().validate_pre_routing(state(unknowns=[unknown]))
    assert result.verdict is EpistemicVerdict.INSUFFICIENT_EVIDENCE


def test_ec_018_material_true_contradiction_blocks_routing() -> None:
    contradiction = ContradictionRecord(
        id="x1",
        proposition_a="A",
        proposition_b="not A",
        contradiction_type=ContradictionType.TRUE_LOGICAL_CONTRADICTION,
        status=ContradictionStatus.TRUE_CONTRADICTION,
    )
    result = EpistemicController().validate_pre_routing(state(contradictions=[contradiction]))
    assert result.verdict is EpistemicVerdict.CONTRADICTED


def test_ec_019_explicit_scenario_assumption_is_conditionally_valid() -> None:
    assumption = AssumptionRecord(
        id="a1",
        proposition="Rates remain constant",
        reason="scenario boundary",
        materiality=Materiality.HIGH,
        validation_required=True,
        source="user",
        scenario_only=True,
    )
    result = EpistemicController().validate_pre_routing(state(assumptions=[assumption]))
    assert result.verdict is EpistemicVerdict.CONDITIONALLY_VALID


def test_ec_020_clean_pre_routing_state_is_validated() -> None:
    result = EpistemicController().validate_pre_routing(state())
    assert result.verdict is EpistemicVerdict.VALIDATED
    assert result.required_next_action is RequiredNextAction.PROCEED


def test_cross_domain_terms_are_not_automatically_equivalent() -> None:
    result = assess_compatibility(
        comparable("finance", definition="cash_conversion"),
        comparable("risk", definition="debt_service_resilience"),
    )
    assert not result.definition_match and not result.admissible


def test_structured_scope_mismatch_returns_out_of_scope() -> None:
    result = EpistemicController().validate_pre_routing(
        state(evidence=[evidence()]), [inference(domain_match=False)]
    )
    assert result.verdict is EpistemicVerdict.OUT_OF_SCOPE
    assert result.required_next_action is RequiredNextAction.REVALIDATE_MODEL
