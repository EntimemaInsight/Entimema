from fastapi import APIRouter

from api.errors import RuntimeAPIError
from api.schemas import (
    CreateSessionRequest,
    CreateSessionResponse,
    LiveMessageRequest,
    LiveMessageResponse,
)
from live.controller import LiveSessionController
from live.response import empty_projection
from live.session import InMemorySessionStore, RuntimeMode


def create_router(store: InMemorySessionStore, controller: LiveSessionController) -> APIRouter:
    router = APIRouter(prefix="/api/v1")

    @router.post("/sessions", response_model=CreateSessionResponse, status_code=201)
    def create_session(body: CreateSessionRequest) -> CreateSessionResponse:
        if body.mode is RuntimeMode.FIXTURE and not body.fixture_id:
            body.fixture_id = "working-capital"
        session = store.create(body.mode, empty_projection(), body.fixture_id)
        return CreateSessionResponse(
            session_id=session.session_id,
            mode=session.runtime_mode,
            workspace_projection=session.current_projection,
            conversation=[],
            runtime_status="FIXTURE_READY" if body.mode is RuntimeMode.FIXTURE else "LIVE_READY",
            state_version=0,
        )

    @router.get("/sessions/{session_id}", response_model=CreateSessionResponse)
    def get_session(session_id: str) -> CreateSessionResponse:
        try:
            session = store.get(session_id)
        except KeyError as exc:
            raise RuntimeAPIError(
                404, "SESSION_NOT_FOUND", "The lab session no longer exists."
            ) from exc
        return CreateSessionResponse(
            session_id=session.session_id,
            mode=session.runtime_mode,
            workspace_projection=session.current_projection,
            conversation=session.conversation_turns,
            runtime_status="READY",
            state_version=session.state_version,
        )

    @router.post("/sessions/{session_id}/messages", response_model=LiveMessageResponse)
    def message(session_id: str, body: LiveMessageRequest) -> LiveMessageResponse:
        return controller.process_message(session_id, body)

    @router.post("/sessions/{session_id}/reset", response_model=CreateSessionResponse)
    def reset(session_id: str) -> CreateSessionResponse:
        try:
            old = store.get(session_id)
            store.delete(session_id)
        except KeyError as exc:
            raise RuntimeAPIError(
                404, "SESSION_NOT_FOUND", "The lab session no longer exists."
            ) from exc
        session = store.create(old.runtime_mode, empty_projection(), old.fixture_id)
        return CreateSessionResponse(
            session_id=session.session_id,
            mode=session.runtime_mode,
            workspace_projection=session.current_projection,
            conversation=[],
            runtime_status="READY",
            state_version=0,
        )

    return router
