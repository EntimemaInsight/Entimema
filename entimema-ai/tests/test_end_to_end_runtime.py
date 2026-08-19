from domain.enums import EpistemicVerdict
from synthesis.runtime import EndToEndRuntime
from tests.agent_helpers import evidence, state


def working_capital_state():
    rows = [
        evidence(f"{name}-{period}", name, value, period=period)
        for period, values in (("current", (140, 90, 60)), ("prior", (100, 80, 50)))
        for name, value in zip(
            ("accounts_receivable", "inventory", "accounts_payable"), values, strict=True
        )
    ]
    timestamp = rows[0].timestamp
    rows = [
        item.model_copy(
            update={"period_start": timestamp, "period_end": timestamp, "scope": "entity"}
        )
        for item in rows
    ]
    return state(rows)


def test_full_backend_loop_returns_final_synthesis() -> None:
    problem = working_capital_state()
    output = EndToEndRuntime().run(problem, ["working_capital_analysis"])
    assert output.agent_results[0].agent_result.agent_id == "FIN_WORKING_CAPITAL_001"
    assert output.final_synthesis_result.final_verdict in {
        EpistemicVerdict.VALIDATED,
        EpistemicVerdict.CONDITIONALLY_VALID,
    }
    assert output.final_synthesis_result.user_synthesis_ready


def test_identical_runtime_execution_is_deterministic_except_audit_metadata() -> None:
    problem = working_capital_state()
    runtime = EndToEndRuntime()
    first = runtime.run(problem, ["working_capital_analysis"])
    second = runtime.run(problem, ["working_capital_analysis"])
    excluded = {
        "pre_routing_validation": {"audit_records"},
        "agent_results": {"__all__": {"epistemic_validation_result": {"audit_records"}}},
        "final_synthesis_result": {"epistemic_validation_result": {"audit_records"}},
    }
    assert first.model_dump(exclude=excluded) == second.model_dump(exclude=excluded)


def test_pre_routing_veto_prevents_orchestration() -> None:
    from domain.enums import Materiality
    from domain.unknowns import UnknownRecord

    problem = state(
        [],
        unknowns=[
            UnknownRecord(
                id="u",
                variable="cash",
                why_needed="decision",
                materiality=Materiality.CRITICAL,
                resolvable=False,
            )
        ],
    )
    output = EndToEndRuntime().run(problem, ["working_capital_analysis"])
    assert not output.orchestration_plan.ready
    assert output.agent_results == []
    assert output.final_synthesis_result.final_verdict is EpistemicVerdict.INSUFFICIENT_EVIDENCE
