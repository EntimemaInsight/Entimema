import pytest

pytest.importorskip("fastapi")
pytest.importorskip("httpx")

from fastapi.testclient import TestClient  # noqa: E402

from api.app import create_app  # noqa: E402


def test_fixture_session_api_works_without_openai(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    monkeypatch.delenv("ENTIMEMA_INTERPRETER_MODEL", raising=False)
    client = TestClient(create_app())
    response = client.post(
        "/api/v1/sessions", json={"mode": "FIXTURE", "fixture_id": "working-capital"}
    )
    assert response.status_code == 201
    assert response.json()["mode"] == "FIXTURE"
    assert response.json()["state_version"] == 0
