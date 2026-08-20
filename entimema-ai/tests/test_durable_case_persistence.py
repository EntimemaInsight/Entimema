from datetime import UTC, datetime
from uuid import uuid4

import pytest

from domain.claims import ClaimRecord
from domain.enums import DecisionReadiness, Materiality, WorkspacePhase
from domain.unknowns import UnknownRecord
from live.session import (
    PersistenceBundle,
    RuntimeMode,
    SQLiteSessionStore,
    StaleCaseVersionError,
)


def bundle(case_id: str, command_id: str, expected: int) -> PersistenceBundle:
    now = datetime.now(UTC).isoformat()
    return PersistenceBundle(
        command_id=command_id,
        expected_version=expected,
        command_payload={"declared_problem": "Assess liquidity"},
        response={"case_id": case_id, "version": expected + 1},
        events=[
            {
                "event_id": str(uuid4()),
                "case_id": case_id,
                "event_type": "CaseStateAdvanced",
                "case_version": expected + 1,
                "occurred_at": now,
                "command_id": command_id,
                "actor": "USER",
                "source": "TEST",
                "correlation_id": command_id,
                "causation_id": command_id,
                "payload": {},
                "schema_version": 1,
            }
        ],
        audit={
            "audit_id": str(uuid4()),
            "case_id": case_id,
            "state_version_audited": expected + 1,
            "decision": "INSUFFICIENT_EVIDENCE",
            "blockers": ["unknown:cash_balance"],
            "schema_version": 1,
        },
        clarification={
            "clarification_id": str(uuid4()),
            "case_id": case_id,
            "state_version": expected + 1,
            "source_record_ids": ["unknown-cash"],
            "question": "What is the verified cash balance?",
            "status": "OPEN",
            "schema_version": 1,
        },
    )


def test_case_recovers_with_history_and_epistemic_distinctions(tmp_path):
    path = tmp_path / "cases.sqlite3"
    store = SQLiteSessionStore(path)
    case = store.create(RuntimeMode.LIVE, {}, owner_id="principal-a", tenant_id="tenant-a")
    case.problem_state.declared_problem = "Assess liquidity"
    assert case.problem_state.operational_problem is None
    case.problem_state.claims.append(
        ClaimRecord(
            id="claim-cash",
            proposition="Cash is 100",
            source="USER",
            timestamp=datetime.now(UTC),
        )
    )
    case.problem_state.unknowns.append(
        UnknownRecord(
            id="unknown-cash",
            variable="verified cash balance",
            why_needed="The user statement is not validated evidence",
            materiality=Materiality.HIGH,
            resolvable=True,
            blocks_routing=True,
        )
    )
    case.problem_state.workspace_phase = WorkspacePhase.EPISTEMIC_REVIEW
    case.problem_state.decision_readiness = DecisionReadiness.BLOCKED
    case.problem_state.blockers = ["unknown:cash_balance"]
    case.state_version = 1
    case.updated_at = datetime.now(UTC)
    store.save(case, expected_version=0, bundle=bundle(case.case_id, "command-1", 0))

    recovered_store = SQLiteSessionStore(path)
    recovered = recovered_store.get(case.case_id, owner_id="principal-a")
    history = recovered_store.history(case.case_id)

    assert recovered.state_version == 1
    assert recovered.problem_state.operational_problem is None
    assert recovered.problem_state.claims[0].proposition == "Cash is 100"
    assert recovered.problem_state.evidence == []
    assert recovered.problem_state.unknowns[0].variable == "verified cash balance"
    assert recovered.problem_state.decision_readiness is DecisionReadiness.BLOCKED
    assert recovered.problem_state.blockers == ["unknown:cash_balance"]
    assert [item["case_version"] for item in history["states"]] == [0, 1]
    assert history["audits"][0]["state_version_audited"] == 1
    assert history["clarifications"][0]["source_record_ids"] == ["unknown-cash"]


def test_optimistic_concurrency_and_idempotency_are_atomic(tmp_path):
    store = SQLiteSessionStore(tmp_path / "cases.sqlite3")
    case = store.create(RuntimeMode.LIVE, {})
    first = case.model_copy(deep=True)
    first.state_version = 1
    first.updated_at = datetime.now(UTC)
    accepted = bundle(case.case_id, "same-command", 0)
    store.save(first, expected_version=0, bundle=accepted)

    # Delivery retry returns the stored result and does not append any artifact.
    store.save(first, expected_version=0, bundle=accepted)
    assert store.command_result(case.case_id, "same-command") == {
        "case_id": case.case_id,
        "version": 1,
    }
    assert len(store.history(case.case_id)["events"]) == 2  # CaseCreated + state advance

    stale = case.model_copy(deep=True)
    stale.state_version = 1
    with pytest.raises(StaleCaseVersionError):
        store.save(stale, expected_version=0, bundle=bundle(case.case_id, "other-command", 0))
    assert len(store.history(case.case_id)["commands"]) == 1


def test_owner_boundary_hides_another_principals_case(tmp_path):
    store = SQLiteSessionStore(tmp_path / "cases.sqlite3")
    case = store.create(RuntimeMode.LIVE, {}, owner_id="principal-a")
    with pytest.raises(KeyError):
        store.get(case.case_id, owner_id="principal-b")
