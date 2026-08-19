from typing import Any

__all__ = ["AgentExecutionController", "ValidatedAgentResult"]


def __getattr__(name: str) -> Any:
    if name in __all__:
        from agents.execution import AgentExecutionController, ValidatedAgentResult

        return {
            "AgentExecutionController": AgentExecutionController,
            "ValidatedAgentResult": ValidatedAgentResult,
        }[name]
    raise AttributeError(name)
