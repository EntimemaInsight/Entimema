from synthesis.projection import (
    DecisionMapNodeType,
    DecisionReadiness,
    build_decision_workspace_projection,
)
from synthesis.runtime import EndToEndRuntime
from tests.test_end_to_end_runtime import working_capital_state


def test_projection_contains_required_workspace_state() -> None:
    problem = working_capital_state()
    runtime = EndToEndRuntime()
    output = runtime.run(problem, ["working_capital_analysis"])
    projection = build_decision_workspace_projection(
        problem, output.orchestration_plan, output.agent_results, output.final_synthesis_result
    )
    assert projection.operational_problem == problem.operational_problem
    assert projection.active_agents == ["FIN_WORKING_CAPITAL_001"]
    assert projection.validated_evidence
    assert projection.final_recommendations
    assert projection.decision_readiness in {
        DecisionReadiness.DECISION_READY,
        DecisionReadiness.CONDITIONAL,
    }


def test_decision_map_traces_recommendation_back_to_evidence() -> None:
    problem = working_capital_state()
    output = EndToEndRuntime().run(problem, ["working_capital_analysis"])
    projection = build_decision_workspace_projection(
        problem, output.orchestration_plan, output.agent_results, output.final_synthesis_result
    )
    recommendation_ids = {
        item.id
        for item in projection.decision_map.nodes
        if item.node_type is DecisionMapNodeType.RECOMMENDATION
    }
    finding_ids = {
        edge.target_id
        for edge in projection.decision_map.edges
        if edge.source_id in recommendation_ids
    }
    evidence_node_ids = {
        item.id
        for item in projection.decision_map.nodes
        if item.node_type is DecisionMapNodeType.EVIDENCE
    }
    evidence_sources = {
        edge.source_id
        for edge in projection.decision_map.edges
        if edge.target_id in finding_ids and edge.source_id in evidence_node_ids
    }
    assert evidence_sources <= {item.id for item in problem.evidence}
    assert evidence_sources
