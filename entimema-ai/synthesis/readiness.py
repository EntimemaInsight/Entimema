from enum import StrEnum


class DecisionReadiness(StrEnum):
    BLOCKED = "BLOCKED"
    ANALYSIS_READY = "ANALYSIS_READY"
    CONDITIONAL = "CONDITIONAL"
    DECISION_READY = "DECISION_READY"
