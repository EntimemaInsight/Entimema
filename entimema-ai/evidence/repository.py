"""Durable evidence metadata repository, separate from binary storage and snapshots."""

import json
import sqlite3
from pathlib import Path

from evidence.models import (
    Artifact,
    Evidence,
    EvidenceCandidate,
    EvidenceRelation,
    ExtractionRecord,
    UnknownResolution,
    ValidationRecord,
)


class EvidenceRepository:
    def __init__(self, path: str | Path) -> None:
        self.path = str(path)
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as db:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS evidence_objects(
              kind TEXT NOT NULL, object_id TEXT NOT NULL, case_id TEXT NOT NULL,
              artifact_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
              payload TEXT NOT NULL, PRIMARY KEY(kind,object_id));
            CREATE INDEX IF NOT EXISTS evidence_case_kind
              ON evidence_objects(case_id,kind,created_at);
            CREATE UNIQUE INDEX IF NOT EXISTS artifact_case_hash
              ON evidence_objects(case_id,artifact_id) WHERE kind='artifact';
            CREATE TABLE IF NOT EXISTS evidence_commands(
              case_id TEXT NOT NULL, command_id TEXT NOT NULL, response TEXT NOT NULL,
              PRIMARY KEY(case_id,command_id));
            """)

    def _connect(self):
        db = sqlite3.connect(self.path)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA journal_mode=WAL")
        return db

    @staticmethod
    def _json(value):
        return json.dumps(value, separators=(",", ":"), sort_keys=True, default=str)

    def add(self, kind: str, value, *, artifact_id: str | None = None) -> None:
        case_id = value.case_id if hasattr(value, "case_id") else self.artifact_case(artifact_id)
        with self._connect() as db:
            db.execute(
                "INSERT OR IGNORE INTO evidence_objects"
                "(kind,object_id,case_id,artifact_id,payload) VALUES(?,?,?,?,?)",
                (kind, value.id, case_id, artifact_id, self._json(value.model_dump(mode="json"))),
            )

    def replace_artifact(self, artifact: Artifact) -> None:
        with self._connect() as db:
            db.execute(
                "INSERT OR REPLACE INTO evidence_objects"
                "(kind,object_id,case_id,artifact_id,payload) VALUES('artifact',?,?,?,?)",
                (
                    artifact.id,
                    artifact.case_id,
                    artifact.id,
                    self._json(artifact.model_dump(mode="json")),
                ),
            )

    def artifact_case(self, artifact_id: str | None) -> str:
        with self._connect() as db:
            row = db.execute(
                "SELECT case_id FROM evidence_objects WHERE kind='artifact' AND object_id=?",
                (artifact_id,),
            ).fetchone()
        if not row:
            raise KeyError(artifact_id)
        return row["case_id"]

    def find_artifact_by_hash(self, case_id: str, digest: str) -> Artifact | None:
        with self._connect() as db:
            rows = db.execute(
                "SELECT payload FROM evidence_objects WHERE kind='artifact' AND case_id=?",
                (case_id,),
            )
            for row in rows:
                artifact = Artifact.model_validate_json(row["payload"])
                if artifact.content_hash == digest:
                    return artifact
        return None

    def get_artifact(self, artifact_id: str, case_id: str) -> Artifact:
        with self._connect() as db:
            row = db.execute(
                "SELECT payload FROM evidence_objects WHERE kind='artifact' "
                "AND object_id=? AND case_id=?",
                (artifact_id, case_id),
            ).fetchone()
        if not row:
            raise KeyError(artifact_id)
        return Artifact.model_validate_json(row["payload"])

    def list(self, case_id: str, kind: str, model):
        with self._connect() as db:
            rows = db.execute(
                "SELECT payload FROM evidence_objects WHERE case_id=? AND kind=? "
                "ORDER BY created_at,object_id",
                (case_id, kind),
            ).fetchall()
        return [model.model_validate_json(x["payload"]) for x in rows]

    def artifacts(self, case_id):
        return self.list(case_id, "artifact", Artifact)

    def candidates(self, case_id):
        return self.list(case_id, "candidate", EvidenceCandidate)

    def evidence(self, case_id):
        return self.list(case_id, "evidence", Evidence)

    def extractions(self, case_id):
        return self.list(case_id, "extraction", ExtractionRecord)

    def validations(self, case_id):
        return self.list(case_id, "validation", ValidationRecord)

    def relations(self, case_id):
        return self.list(case_id, "relation", EvidenceRelation)

    def resolutions(self, case_id):
        return self.list(case_id, "resolution", UnknownResolution)

    def command_result(self, case_id, command_id):
        with self._connect() as db:
            row = db.execute(
                "SELECT response FROM evidence_commands WHERE case_id=? AND command_id=?",
                (case_id, command_id),
            ).fetchone()
        return json.loads(row["response"]) if row else None

    def save_command(self, case_id, command_id, response):
        with self._connect() as db:
            db.execute(
                "INSERT OR IGNORE INTO evidence_commands VALUES(?,?,?)",
                (case_id, command_id, self._json(response)),
            )

    def delete_case(self, case_id):
        with self._connect() as db:
            db.execute("DELETE FROM evidence_objects WHERE case_id=?", (case_id,))
            db.execute("DELETE FROM evidence_commands WHERE case_id=?", (case_id,))
