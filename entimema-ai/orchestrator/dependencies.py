from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from orchestrator.plans import TaskSpecification


class DependencyEdgeType(StrEnum):
    REQUIRES_OUTPUT_FROM = "REQUIRES_OUTPUT_FROM"
    REQUIRES_VALIDATION_OF = "REQUIRES_VALIDATION_OF"
    SHARES_EVIDENCE_WITH = "SHARES_EVIDENCE_WITH"
    PROVIDES_INPUT_TO = "PROVIDES_INPUT_TO"


EXECUTION_DEPENDENCIES = {
    DependencyEdgeType.REQUIRES_OUTPUT_FROM,
    DependencyEdgeType.REQUIRES_VALIDATION_OF,
    DependencyEdgeType.PROVIDES_INPUT_TO,
}


class TaskDependency(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    source_task_id: str
    target_task_id: str
    edge_type: DependencyEdgeType


class TaskDependencyGraph(BaseModel):
    model_config = ConfigDict(extra="forbid", frozen=True)
    task_ids: list[str]
    edges: list[TaskDependency] = Field(default_factory=list)
    cycle_detected: bool
    valid: bool
    issues: list[str] = Field(default_factory=list)


def build_dependency_graph(
    tasks: list[TaskSpecification], edges: list[TaskDependency]
) -> TaskDependencyGraph:
    ids = {task.task_id for task in tasks}
    broken = [
        f"{edge.source_task_id}->{edge.target_task_id}"
        for edge in edges
        if edge.source_task_id not in ids or edge.target_task_id not in ids
    ]
    adjacency = {task_id: [] for task_id in ids}
    for edge in edges:
        if edge.edge_type in EXECUTION_DEPENDENCIES and edge.source_task_id in adjacency:
            adjacency[edge.source_task_id].append(edge.target_task_id)
    visiting: set[str] = set()
    visited: set[str] = set()

    def has_cycle(node: str) -> bool:
        if node in visiting:
            return True
        if node in visited:
            return False
        visiting.add(node)
        if any(has_cycle(child) for child in adjacency[node]):
            return True
        visiting.remove(node)
        visited.add(node)
        return False

    cycle = any(has_cycle(node) for node in sorted(ids) if node not in visited)
    issues = [f"BROKEN_DEPENDENCY:{item}" for item in broken]
    if cycle:
        issues.append("DEPENDENCY_CYCLE")
    return TaskDependencyGraph(
        task_ids=sorted(ids), edges=edges, cycle_detected=cycle, valid=not issues, issues=issues
    )
