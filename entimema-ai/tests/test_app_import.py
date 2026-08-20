import subprocess
import sys
from pathlib import Path

import pytest

pytest.importorskip("fastapi")


def test_api_app_imports_in_fresh_python_process():
    runtime_root = Path(__file__).resolve().parents[1]

    result = subprocess.run(
        [sys.executable, "-c", "from api.app import app; print(type(app).__name__)"],
        cwd=runtime_root,
        capture_output=True,
        check=False,
        text=True,
    )

    assert result.returncode == 0, result.stderr
    assert result.stdout.strip() == "FastAPI"
