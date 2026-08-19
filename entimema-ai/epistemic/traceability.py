from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from domain.enums import EpistemicVerdict


class TraceNodeType(StrEnum):
    EVIDENCE = "EVIDENCE"
    CLAIM = "CLAIM"
    ASSUMPTION = "ASSUMPTION"
    HYPOTHESIS = "HYPOTHESIS"
    CALCULATION = "CALCULATION"
    MODEL_OUTPUT = "MODEL_OUTPUT"
    INFERENCE = "INFERENCE"
    AGENT_RESULT = "AGENT_RESULT"
    DECISION = "DECISION"


class TraceEdgeType(StrEnum):
    SUPPORTS = "SUPPORTS"
    DERIVED_FROM = "DERIVED_FROM"
    USES = "USES"
    CONTRADICTS = "CONTRADICTS"
    DEPENDS_ON = "DEPENDS_ON"
    PRODUCES = "PRODUCES"


class TraceNode(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    id: str
    node_type: TraceNodeType


class TraceEdge(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    source_id: str
    target_id: str
    edge_type: TraceEdgeType


class TraceabilityGraph(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    nodes: list[TraceNode] = Field(default_factory=list)
    edges: list[TraceEdge] = Field(default_factory=list)


class TraceabilityAssessment(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    root_object_id: str
    complete: bool
    missing_nodes: list[str]
    broken_edges: list[str]
    unregistered_dependencies: list[str]
    cycle_detected: bool
    verdict: EpistemicVerdict


DEPENDENCY_EDGES = {
    TraceEdgeType.DERIVED_FROM,
    TraceEdgeType.USES,
    TraceEdgeType.DEPENDS_ON,
}


def validate_traceability(root_object_id: str, graph: TraceabilityGraph) -> TraceabilityAssessment:
    node_ids = {node.id for node in graph.nodes}
    missing = [] if root_object_id in node_ids else [root_object_id]
    broken = sorted(
        f"{edge.source_id}->{edge.target_id}"
        for edge in graph.edges
        if edge.source_id not in node_ids or edge.target_id not in node_ids
    )
    dependencies = sorted(
        {edge.target_id for edge in graph.edges if edge.edge_type in DEPENDENCY_EDGES} - node_ids
    )
    adjacency: dict[str, list[str]] = {node_id: [] for node_id in node_ids}
    for edge in graph.edges:
        if edge.edge_type in DEPENDENCY_EDGES and edge.source_id in adjacency:
            adjacency[edge.source_id].append(edge.target_id)
    visiting: set[str] = set()
    visited: set[str] = set()

    def cycle(node_id: str) -> bool:
        if node_id in visiting:
            return True
        if node_id in visited:
            return False
        visiting.add(node_id)
        if any(cycle(child) for child in adjacency.get(node_id, []) if child in node_ids):
            return True
        visiting.remove(node_id)
        visited.add(node_id)
        return False

    cycle_detected = any(cycle(node_id) for node_id in node_ids if node_id not in visited)
    complete = not (missing or broken or dependencies or cycle_detected)
    return TraceabilityAssessment(
        root_object_id=root_object_id,
        complete=complete,
        missing_nodes=missing,
        broken_edges=broken,
        unregistered_dependencies=dependencies,
        cycle_detected=cycle_detected,
        verdict=(EpistemicVerdict.VALIDATED if complete else EpistemicVerdict.TRACEABILITY_FAILURE),
    )
