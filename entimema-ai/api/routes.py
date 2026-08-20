from fastapi import APIRouter, Header, Request

from api.errors import RuntimeAPIError
from api.schemas import (
    CreateSessionRequest,
    CreateSessionResponse,
    LiveMessageRequest,
    LiveMessageResponse,
)
from evidence.service import EvidenceService
from live.controller import LiveSessionController
from live.response import empty_projection
from live.session import RuntimeMode, SessionStore


def create_router(
    store: SessionStore,
    controller: LiveSessionController,
    evidence: EvidenceService | None = None,
) -> APIRouter:
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

    if evidence:

        @router.post("/cases/{case_id}/artifacts", status_code=201)
        async def register_artifact(
            case_id: str,
            request: Request,
            x_filename: str = Header(),
            x_command_id: str = Header(),
            x_owner_id: str = Header(default="anonymous"),
            x_tenant_id: str = Header(default="default"),
        ):
            return evidence.register(
                case_id=case_id,
                owner_id=x_owner_id,
                tenant_id=x_tenant_id,
                filename=x_filename,
                media_type=request.headers.get("content-type", ""),
                content=await request.body(),
                command_id=x_command_id,
            )

        @router.post("/cases/{case_id}/artifacts/{artifact_id}/process")
        def process_artifact(
            case_id: str,
            artifact_id: str,
            x_command_id: str = Header(),
            x_owner_id: str = Header(default="anonymous"),
        ):
            return evidence.process(
                case_id=case_id,
                artifact_id=artifact_id,
                owner_id=x_owner_id,
                command_id=x_command_id,
            )

        @router.get("/cases/{case_id}/evidence")
        def list_evidence(case_id: str, x_owner_id: str = Header(default="anonymous")):
            return evidence.projection(case_id=case_id, owner_id=x_owner_id)

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
