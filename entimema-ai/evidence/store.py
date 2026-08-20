"""Binary artifact storage port and local development adapter."""

from abc import ABC, abstractmethod
from pathlib import Path


class ArtifactStore(ABC):
    """Cloud-neutral binary boundary; database records contain only its references."""

    encryption_at_rest_policy = "ADAPTER_MANAGED"
    retention_policy = "CASE_LIFECYCLE"

    @abstractmethod
    def put(self, case_id: str, artifact_id: str, content: bytes) -> str: ...

    @abstractmethod
    def get(self, reference: str) -> bytes: ...

    @abstractmethod
    def delete_case(self, case_id: str) -> None: ...


class LocalArtifactStore(ArtifactStore):
    """Filesystem adapter with opaque references and traversal-safe identifiers."""

    def __init__(self, root: str | Path) -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    def put(self, case_id: str, artifact_id: str, content: bytes) -> str:
        path = self.root / case_id / artifact_id
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)
        return f"local://{case_id}/{artifact_id}"

    def get(self, reference: str) -> bytes:
        if not reference.startswith("local://"):
            raise ValueError("unsupported artifact reference")
        relative = reference.removeprefix("local://")
        path = (self.root / relative).resolve()
        if self.root.resolve() not in path.parents:
            raise ValueError("invalid artifact reference")
        return path.read_bytes()

    def delete_case(self, case_id: str) -> None:
        directory = self.root / case_id
        if directory.exists():
            for path in directory.iterdir():
                path.unlink()
            directory.rmdir()


class MalwareScanner(ABC):
    @abstractmethod
    def scan(self, content: bytes) -> str: ...


class DeferredMalwareScanner(MalwareScanner):
    """Explicit development boundary: it never claims a scan took place."""

    def scan(self, content: bytes) -> str:
        return "NOT_SCANNED"
