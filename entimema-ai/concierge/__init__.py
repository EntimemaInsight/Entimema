"""Deterministic Module A Concierge behavior engine."""

from typing import Any

__all__ = ["ConciergeStateMachine"]


def __getattr__(name: str) -> Any:
    if name == "ConciergeStateMachine":
        from concierge.state_machine import ConciergeStateMachine

        return ConciergeStateMachine
    raise AttributeError(name)
