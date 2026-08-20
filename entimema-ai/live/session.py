"""Development-only in-memory live sessions. Server restarts erase all state."""

from abc import ABC, abstractmethod
from datetime import UTC, datetime
from enum import StrEnum
from threading import RLock
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field

from domain.problem_state import ProblemState


class RuntimeMode(StrEnum):
    LIVE = "LIVE"
    FIXTURE = "FIXTURE"


class ConversationTurnView(BaseModel):
    model_config = ConfigDict(extra="forbid")
    turn_id: str
    actor: str
    text: str
    timestamp: datetime
    action_type: str | None = None
    related_state_ids: list[str] = Field(default_factory=list)
    status: str = "ACCEPTED"


class LiveSession(BaseModel):
    model_config = ConfigDict(extra="forbid")
    session_id: str
    created_at: datetime
    updated_at: datetime
    problem_state: ProblemState
    conversation_turns: list[ConversationTurnView] = Field(default_factory=list)
    current_projection: dict
    runtime_mode: RuntimeMode
    state_version: int = 0
    fixture_id: str | None = None


class SessionStore(ABC):
    """Persistence port used by the runtime; implementations may be durable."""

    @abstractmethod
    def create(
        self, mode: RuntimeMode, projection: dict, fixture_id: str | None = None
    ) -> LiveSession:
        raise NotImplementedError

    @abstractmethod
    def get(self, session_id: str) -> LiveSession:
        raise NotImplementedError

    @abstractmethod
    def save(self, session: LiveSession) -> None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, session_id: str) -> None:
        raise NotImplementedError


class InMemorySessionStore(SessionStore):
    """IN-MEMORY / NON-PERSISTENT and process-local; suitable for the private lab only."""

    def __init__(self) -> None:
        self._sessions: dict[str, LiveSession] = {}
        self._lock = RLock()

    def create(
        self, mode: RuntimeMode, projection: dict, fixture_id: str | None = None
    ) -> LiveSession:
        now, session_id = datetime.now(UTC), str(uuid4())
        session = LiveSession(
            session_id=session_id,
            created_at=now,
            updated_at=now,
            problem_state=ProblemState(session_id=session_id, problem_id=str(uuid4())),
            current_projection=projection,
            runtime_mode=mode,
            fixture_id=fixture_id,
        )
        with self._lock:
            self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> LiveSession:
        with self._lock:
            if session_id not in self._sessions:
                raise KeyError(session_id)
            return self._sessions[session_id]

    def save(self, session: LiveSession) -> None:
        with self._lock:
            if session.session_id not in self._sessions:
                raise KeyError(session.session_id)
            self._sessions[session.session_id] = session

    def delete(self, session_id: str) -> None:
        with self._lock:
            if session_id not in self._sessions:
                raise KeyError(session_id)
            del self._sessions[session_id]
