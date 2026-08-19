from datetime import UTC, datetime

from domain.claims import ClaimRecord, ClaimStatus
from domain.contradictions import ContradictionRecord, ContradictionStatus, ContradictionType
from domain.enums import Materiality
from domain.hypotheses import HypothesisRecord
from domain.problem_state import ProblemState
from domain.transitions import StateTransition
from domain.unknowns import UnknownRecord
from problem_formation.candidate_problems import CandidateOperationalProblem, FitLevel
from problem_formation.engine import ProblemFormationEngine, ProblemFormationInput
from problem_formation.problem_objects import (
    ConstraintRecord,
    ConstraintType,
    GoalType,
    ProblemGranularity,
    ProblemLifecycle,
    ProblemObject,
    ProblemObjectType,
)


def state(**updates) -> ProblemState:
    values = {"session_id": "s1", "problem_id": "p1"}
    values.update(updates)
    return ProblemState(**values)


def bounded_hypothesis(identifier: str, proposition: str) -> HypothesisRecord:
    return HypothesisRecord(
        id=identifier,
        proposition=proposition,
        source="USER_PROPOSED",
        observable_implications=["A named metric changes under this explanation"],
        falsification_condition="The named metric does not change",
    )


def candidate(identifier: str, **updates) -> CandidateOperationalProblem:
    values = {
        "id": identifier,
        "formulation": "Determine the bounded cause relevant to the decision",
        "object": ProblemObject(
            object_type=ProblemObjectType.SYSTEM,
            identifier="cash system",
            source="USER_ORIGINATED",
        ),
        "goal": GoalType.DIAGNOSE,
        "decision": "Choose the corrective intervention",
        "horizon": "next 90 days",
        "scope": "Operating cash flows",
        "domain_candidates": ["finance"],
        "source": "USER_ORIGINATED",
    }
    values.update(updates)
    return CandidateOperationalProblem(**values)


def test_ready_problem_is_operationalised_without_executing_agent() -> None:
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="Determine the bounded cause relevant to the decision",
            supplied_hypotheses=[bounded_hypothesis("h1", "Inventory absorbs cash")],
            candidate_operational_problems=[candidate("op1")],
        ),
    )
    assert result.routing_ready
    assert result.lifecycle is ProblemLifecycle.OPERATIONALISED
    assert result.recommended_dialogue_state is StateTransition.ROUTING_READY
    assert result.operational_problem is not None
    assert result.updated_problem_state.lifecycle_state is StateTransition.INTAKE
    assert result.transition.trigger == "problem_formation_evaluation"


def test_finance_problem_separates_claims_and_preserves_multiple_hypotheses() -> None:
    claims = [
        ClaimRecord(
            id="c-profit",
            proposition="The company is profitable",
            status=ClaimStatus.REPORTED,
            source="user",
            timestamp=datetime.now(UTC),
        ),
        ClaimRecord(
            id="c-cash",
            proposition="The company is always short of cash",
            status=ClaimStatus.REPORTED,
            source="user",
            timestamp=datetime.now(UTC),
        ),
    ]
    profit_definition = UnknownRecord(
        id="u-profit-definition",
        variable="definition of profitable",
        why_needed="profit measures are not interchangeable",
        materiality=Materiality.HIGH,
        resolvable=True,
    )
    hypotheses = [
        bounded_hypothesis("h-receivables", "Receivables may absorb cash"),
        bounded_hypothesis("h-inventory", "Inventory may absorb cash"),
        bounded_hypothesis("h-debt", "Debt service may absorb cash"),
    ]
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="We are profitable but always short of cash.",
            supplied_claims=claims,
            supplied_claim_ids=[item.id for item in claims],
            supplied_unknowns=[profit_definition],
            supplied_hypotheses=hypotheses,
        ),
    )
    assert [item.id for item in result.updated_problem_state.claims] == [
        "c-profit",
        "c-cash",
    ]
    assert len(result.updated_problem_state.hypotheses) == 3
    assert result.operational_problem is None
    assert result.next_best_unknown_id == "u-profit-definition"


def test_credit_risk_declaration_does_not_route_to_pd() -> None:
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="This client looks risky.",
            candidate_object=ProblemObject(
                object_type=ProblemObjectType.ENTITY,
                identifier="client",
                source="USER_ORIGINATED",
            ),
        ),
    )
    assert result.updated_problem_state.declared_problem == "This client looks risky."
    assert result.operational_problem is None
    assert not result.routing_ready
    assert "PD" not in result.updated_problem_state.domain_scope


def test_engineering_problem_remains_unready_without_failure_definition() -> None:
    unknown = UnknownRecord(
        id="u-failure-definition",
        variable="observable failure condition",
        why_needed="engineering diagnosis requires a testable phenomenon",
        materiality=Materiality.CRITICAL,
        resolvable=True,
    )
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="The pipeline is unreliable.",
            candidate_object=ProblemObject(
                object_type=ProblemObjectType.SYSTEM,
                identifier="pipeline",
                source="USER_ORIGINATED",
            ),
            supplied_unknowns=[unknown],
        ),
    )
    assert result.readiness.critical_unknowns_open
    assert result.operational_problem is None


def test_assumed_material_constraint_creates_blocking_unknown() -> None:
    constraint = ConstraintRecord(
        id="k1",
        statement="We cannot invest more.",
        constraint_type=ConstraintType.UNKNOWN,
        source="user report",
    )
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="Choose an intervention",
            supplied_constraints=[constraint],
        ),
    )
    challenge = result.updated_problem_state.unknowns[0]
    assert challenge.id == "constraint-k1-basis"
    assert challenge.materiality is Materiality.HIGH
    assert challenge.blocks_routing is None


def test_granularity_mismatch_is_preserved() -> None:
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="Should the strategy change?",
            problem_granularity=ProblemGranularity.STRATEGIC,
            evidence_granularity=ProblemGranularity.TRANSACTIONAL,
        ),
    )
    assert result.granularity.mismatch


def test_assumption_burden_and_contradictions_lower_candidate_rank() -> None:
    strong = candidate("strong", evidence_fit=FitLevel.HIGH, goal_fit=FitLevel.HIGH)
    burdened = candidate(
        "burdened",
        evidence_fit=FitLevel.HIGH,
        goal_fit=FitLevel.HIGH,
        required_assumption_ids=["a1", "a2"],
        contradiction_ids=["x1"],
    )
    result = ProblemFormationEngine().form_problem(
        state(),
        ProblemFormationInput(
            problem_id="p1",
            declared_problem="Determine the bounded cause relevant to the decision",
            supplied_hypotheses=[bounded_hypothesis("h1", "A testable cause exists")],
            candidate_operational_problems=[burdened, strong],
        ),
    )
    assert [item.candidate_id for item in result.ranked_candidates] == ["strong", "burdened"]


def test_core_contradiction_reopens_without_deleting_history() -> None:
    contradiction = ContradictionRecord(
        id="x-core",
        proposition_a="Core premise holds",
        proposition_b="New evidence refutes the core premise",
        contradiction_type=ContradictionType.TRUE_LOGICAL_CONTRADICTION,
        status=ContradictionStatus.TRUE_CONTRADICTION,
    )
    result = ProblemFormationEngine().form_problem(
        state(
            declared_problem="Assess cash",
            operational_problem="Diagnose operating cash decline",
            contradictions=[contradiction],
        ),
        ProblemFormationInput(problem_id="p1", declared_problem="Assess cash"),
    )
    assert result.lifecycle is ProblemLifecycle.REOPENED
    assert result.updated_problem_state.operational_problem == "Diagnose operating cash decline"
    assert result.recommended_dialogue_state is StateTransition.EPISTEMIC_CHALLENGE
