"""Case persistence port and its in-memory and durable SQLite adapters."""

from __future__ import annotations

import json
import sqlite3
from abc import ABC, abstractmethod
from datetime import UTC, datetime
from enum import StrEnum
from pathlib import Path
from threading import RLock
from typing import Any
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field

from domain.problem_state import ProblemState

SCHEMA_VERSION = 1


def now_utc() -> datetime:
    return datetime.now(UTC)


class CaseNotFoundError(KeyError):
    """The requested durable case does not exist."""


class StaleCaseVersionError(RuntimeError):
    """The mutation was based on an obsolete aggregate version."""


class IdempotencyConflictError(RuntimeError):
    """A command ID was reused with different operational input."""


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
    """Compatibility API view of the durable ``ConciergeCase`` aggregate."""

    model_config = ConfigDict(extra="forbid")
    session_id: str
    owner_id: str = "anonymous"
    tenant_id: str = "default"
    created_at: datetime
    updated_at: datetime
    problem_state: ProblemState
    conversation_turns: list[ConversationTurnView] = Field(default_factory=list)
    current_projection: dict[str, Any]
    runtime_mode: RuntimeMode
    state_version: int = 0
    status: str = "ACTIVE"
    schema_version: int = SCHEMA_VERSION
    fixture_id: str | None = None

    @property
    def case_id(self) -> str:
        return self.session_id


class PersistenceBundle(BaseModel):
    """All structured artifacts committed with one authoritative mutation."""

    model_config = ConfigDict(extra="forbid")
    command_id: str
    command_type: str = "ApplyInterpretedTurn"
    source: str = "CONCIERGE_API"
    actor_id: str | None = None
    correlation_id: str | None = None
    expected_version: int
    command_payload: dict[str, Any]
    response: dict[str, Any]
    events: list[dict[str, Any]] = Field(default_factory=list)
    audit: dict[str, Any] | None = None
    clarification: dict[str, Any] | None = None
    analysis_run: dict[str, Any] | None = None


class SessionStore(ABC):
    """Persistence port. Implementations guarantee atomic, optimistic commits."""

    @abstractmethod
    def create(
        self,
        mode: RuntimeMode,
        projection: dict,
        fixture_id: str | None = None,
        *,
        owner_id: str = "anonymous",
        tenant_id: str = "default",
    ) -> LiveSession: ...

    @abstractmethod
    def get(self, session_id: str, *, owner_id: str | None = None) -> LiveSession: ...

    @abstractmethod
    def save(
        self,
        session: LiveSession,
        *,
        expected_version: int | None = None,
        bundle: PersistenceBundle | None = None,
    ) -> None: ...

    @abstractmethod
    def command_result(self, case_id: str, command_id: str) -> dict[str, Any] | None: ...

    @abstractmethod
    def history(self, case_id: str) -> dict[str, list[dict[str, Any]]]: ...

    @abstractmethod
    def delete(self, session_id: str) -> None: ...


class InMemorySessionStore(SessionStore):
    """Deterministic development/test adapter; never the production default."""

    def __init__(self) -> None:
        self._sessions: dict[str, LiveSession] = {}
        self._history: dict[str, dict[str, list[dict[str, Any]]]] = {}
        self._results: dict[tuple[str, str], dict[str, Any]] = {}
        self._lock = RLock()

    def create(
        self, mode, projection, fixture_id=None, *, owner_id="anonymous", tenant_id="default"
    ):
        now, case_id = now_utc(), str(uuid4())
        case = LiveSession(
            session_id=case_id,
            owner_id=owner_id,
            tenant_id=tenant_id,
            created_at=now,
            updated_at=now,
            problem_state=ProblemState(session_id=case_id, problem_id=str(uuid4())),
            current_projection=projection,
            runtime_mode=mode,
            fixture_id=fixture_id,
        )
        with self._lock:
            self._sessions[case_id] = case.model_copy(deep=True)
            self._history[case_id] = {
                k: []
                for k in (
                    "states",
                    "commands",
                    "events",
                    "audits",
                    "clarifications",
                    "analysis_runs",
                )
            }
            self._history[case_id]["states"].append(
                {"case_version": 0, "state": case.problem_state.model_dump(mode="json")}
            )
        return case

    def get(self, session_id, *, owner_id=None):
        with self._lock:
            try:
                case = self._sessions[session_id]
            except KeyError as exc:
                raise CaseNotFoundError(session_id) from exc
            if owner_id is not None and case.owner_id != owner_id:
                raise CaseNotFoundError(session_id)
            return case.model_copy(deep=True)

    def save(self, session, *, expected_version=None, bundle=None):
        with self._lock:
            current = self._sessions.get(session.session_id)
            if current is None:
                raise CaseNotFoundError(session.session_id)
            if bundle and (session.session_id, bundle.command_id) in self._results:
                return
            if expected_version is not None and current.state_version != expected_version:
                raise StaleCaseVersionError(
                    f"expected {expected_version}, found {current.state_version}"
                )
            self._sessions[session.session_id] = session.model_copy(deep=True)
            if bundle:
                history = self._history[session.session_id]
                history["states"].append(
                    {
                        "case_version": session.state_version,
                        "state": session.problem_state.model_dump(mode="json"),
                    }
                )
                history["commands"].append(bundle.model_dump(mode="json"))
                for key, value in (
                    ("events", bundle.events),
                    ("audits", [bundle.audit] if bundle.audit else []),
                    ("clarifications", [bundle.clarification] if bundle.clarification else []),
                    ("analysis_runs", [bundle.analysis_run] if bundle.analysis_run else []),
                ):
                    history[key].extend(value)
                self._results[(session.session_id, bundle.command_id)] = bundle.response

    def command_result(self, case_id, command_id):
        with self._lock:
            return self._results.get((case_id, command_id))

    def history(self, case_id):
        with self._lock:
            if case_id not in self._history:
                raise CaseNotFoundError(case_id)
            return json.loads(json.dumps(self._history[case_id], default=str))

    def delete(self, session_id):
        with self._lock:
            if session_id not in self._sessions:
                raise CaseNotFoundError(session_id)
            del self._sessions[session_id]
            self._history.pop(session_id, None)


class SQLiteSessionStore(SessionStore):
    """Transactional durable adapter using SQLite WAL and immutable JSON logs."""

    def __init__(self, path: str | Path) -> None:
        self.path = str(path)
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        self._lock = RLock()
        self._initialize()

    def _connect(self):
        db = sqlite3.connect(self.path, timeout=10)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys=ON")
        db.execute("PRAGMA journal_mode=WAL")
        return db

    def _initialize(self):
        with self._connect() as db:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS cases(case_id TEXT PRIMARY KEY, owner_id TEXT NOT NULL,
              tenant_id TEXT NOT NULL, version INTEGER NOT NULL, status TEXT NOT NULL,
              schema_version INTEGER NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
              snapshot TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS state_versions(
              case_id TEXT NOT NULL, version INTEGER NOT NULL,
              schema_version INTEGER NOT NULL, created_at TEXT NOT NULL, state TEXT NOT NULL,
              PRIMARY KEY(case_id,version),
              FOREIGN KEY(case_id) REFERENCES cases(case_id) ON DELETE CASCADE);
            CREATE TABLE IF NOT EXISTS commands(case_id TEXT NOT NULL, command_id TEXT NOT NULL,
              created_at TEXT NOT NULL, expected_version INTEGER NOT NULL,
              schema_version INTEGER NOT NULL,
              payload TEXT NOT NULL, response TEXT NOT NULL, PRIMARY KEY(case_id,command_id),
              FOREIGN KEY(case_id) REFERENCES cases(case_id) ON DELETE CASCADE);
            CREATE TABLE IF NOT EXISTS artifacts(kind TEXT NOT NULL, artifact_id TEXT NOT NULL,
              case_id TEXT NOT NULL, case_version INTEGER NOT NULL, schema_version INTEGER NOT NULL,
              created_at TEXT NOT NULL, payload TEXT NOT NULL, PRIMARY KEY(kind,artifact_id),
              FOREIGN KEY(case_id) REFERENCES cases(case_id) ON DELETE CASCADE);
            CREATE INDEX IF NOT EXISTS artifacts_case ON artifacts(case_id,kind,case_version);
            """)

    @staticmethod
    def _dump(value):
        return json.dumps(value, separators=(",", ":"), sort_keys=True, default=str)

    def create(
        self, mode, projection, fixture_id=None, *, owner_id="anonymous", tenant_id="default"
    ):
        now, case_id = now_utc(), str(uuid4())
        case = LiveSession(
            session_id=case_id,
            owner_id=owner_id,
            tenant_id=tenant_id,
            created_at=now,
            updated_at=now,
            problem_state=ProblemState(session_id=case_id, problem_id=str(uuid4())),
            current_projection=projection,
            runtime_mode=mode,
            fixture_id=fixture_id,
        )
        payload = self._dump(case.model_dump(mode="json"))
        with self._connect() as db:
            db.execute(
                "INSERT INTO cases VALUES(?,?,?,?,?,?,?,?,?)",
                (
                    case_id,
                    owner_id,
                    tenant_id,
                    0,
                    case.status,
                    SCHEMA_VERSION,
                    now.isoformat(),
                    now.isoformat(),
                    payload,
                ),
            )
            db.execute(
                "INSERT INTO state_versions VALUES(?,?,?,?,?)",
                (
                    case_id,
                    0,
                    SCHEMA_VERSION,
                    now.isoformat(),
                    self._dump(case.problem_state.model_dump(mode="json")),
                ),
            )
            self._artifact(
                db,
                "events",
                str(uuid4()),
                case_id,
                0,
                {
                    "event_type": "CaseCreated",
                    "event_id": str(uuid4()),
                    "case_id": case_id,
                    "case_version": 0,
                    "occurred_at": now.isoformat(),
                    "schema_version": SCHEMA_VERSION,
                },
            )
        return case

    def get(self, session_id, *, owner_id=None):
        with self._connect() as db:
            row = db.execute(
                "SELECT snapshot,owner_id FROM cases WHERE case_id=?", (session_id,)
            ).fetchone()
        if row is None or (owner_id is not None and row["owner_id"] != owner_id):
            raise CaseNotFoundError(session_id)
        return LiveSession.model_validate(migrate_document(json.loads(row["snapshot"])))

    def save(self, session, *, expected_version=None, bundle=None):
        with self._lock, self._connect() as db:
            db.execute("BEGIN IMMEDIATE")
            row = db.execute(
                "SELECT version FROM cases WHERE case_id=?", (session.session_id,)
            ).fetchone()
            if row is None:
                raise CaseNotFoundError(session.session_id)
            if (
                bundle
                and db.execute(
                    "SELECT 1 FROM commands WHERE case_id=? AND command_id=?",
                    (session.session_id, bundle.command_id),
                ).fetchone()
            ):
                return
            if expected_version is not None and row["version"] != expected_version:
                raise StaleCaseVersionError(f"expected {expected_version}, found {row['version']}")
            db.execute(
                "UPDATE cases SET version=?,updated_at=?,snapshot=? WHERE case_id=?",
                (
                    session.state_version,
                    session.updated_at.isoformat(),
                    self._dump(session.model_dump(mode="json")),
                    session.session_id,
                ),
            )
            if not bundle:
                return
            timestamp = now_utc().isoformat()
            db.execute(
                "INSERT INTO state_versions VALUES(?,?,?,?,?)",
                (
                    session.session_id,
                    session.state_version,
                    SCHEMA_VERSION,
                    timestamp,
                    self._dump(session.problem_state.model_dump(mode="json")),
                ),
            )
            db.execute(
                "INSERT INTO commands VALUES(?,?,?,?,?,?,?)",
                (
                    session.session_id,
                    bundle.command_id,
                    timestamp,
                    bundle.expected_version,
                    SCHEMA_VERSION,
                    self._dump(bundle.model_dump(mode="json")),
                    self._dump(bundle.response),
                ),
            )
            for event in bundle.events:
                self._artifact(
                    db,
                    "events",
                    event["event_id"],
                    session.session_id,
                    session.state_version,
                    event,
                )
            for kind, value, prefix in (
                ("audits", bundle.audit, "audit"),
                ("clarifications", bundle.clarification, "clarification"),
                ("analysis_runs", bundle.analysis_run, "analysis"),
            ):
                if value:
                    self._artifact(
                        db,
                        kind,
                        value.get(f"{prefix}_id", str(uuid4())),
                        session.session_id,
                        session.state_version,
                        value,
                    )

    def _artifact(self, db, kind, artifact_id, case_id, version, payload):
        db.execute(
            "INSERT INTO artifacts VALUES(?,?,?,?,?,?,?)",
            (
                kind,
                artifact_id,
                case_id,
                version,
                SCHEMA_VERSION,
                now_utc().isoformat(),
                self._dump(payload),
            ),
        )

    def command_result(self, case_id, command_id):
        with self._connect() as db:
            row = db.execute(
                "SELECT response FROM commands WHERE case_id=? AND command_id=?",
                (case_id, command_id),
            ).fetchone()
        return json.loads(row["response"]) if row else None

    def history(self, case_id):
        self.get(case_id)
        result = {
            k: []
            for k in ("states", "commands", "events", "audits", "clarifications", "analysis_runs")
        }
        with self._connect() as db:
            for row in db.execute(
                "SELECT version,state FROM state_versions WHERE case_id=? ORDER BY version",
                (case_id,),
            ):
                result["states"].append(
                    {"case_version": row["version"], "state": json.loads(row["state"])}
                )
            for row in db.execute(
                "SELECT payload FROM commands WHERE case_id=? ORDER BY created_at", (case_id,)
            ):
                result["commands"].append(json.loads(row["payload"]))
            for row in db.execute(
                "SELECT kind,payload FROM artifacts WHERE case_id=? "
                "ORDER BY case_version,created_at",
                (case_id,),
            ):
                result[row["kind"]].append(json.loads(row["payload"]))
        return result

    def delete(self, session_id):
        with self._connect() as db:
            if not db.execute("SELECT 1 FROM cases WHERE case_id=?", (session_id,)).fetchone():
                raise CaseNotFoundError(session_id)
            db.execute("DELETE FROM cases WHERE case_id=?", (session_id,))


def migrate_document(document: dict[str, Any]) -> dict[str, Any]:
    """Explicit hook for future backward-compatible persisted JSON migrations."""
    version = document.get("schema_version", 1)
    if version != SCHEMA_VERSION:
        raise ValueError(f"unsupported persistence schema version: {version}")
    return document
