"""FastAPI entry point for the separately deployable Entimema runtime."""

import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from api.errors import RuntimeAPIError
from api.routes import create_router
from live.controller import LiveSessionController
from live.interpreter import InterpretationError, LinguisticInterpreter, OpenAIInterpreterProvider
from live.session import SQLiteSessionStore


def create_app() -> FastAPI:
    app = FastAPI(title="Entimema Live Runtime", version="1.0.0", docs_url=None, redoc_url=None)
    store = SQLiteSessionStore(os.getenv("ENTIMEMA_CASE_DB", "var/concierge-cases.sqlite3"))
    try:
        interpreter = LinguisticInterpreter(OpenAIInterpreterProvider())
    except InterpretationError:
        interpreter = None
    controller = LiveSessionController(store, interpreter)

    async def runtime_error_handler(_: Request, exc: RuntimeAPIError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status,
            content={
                "errors": [{"code": exc.code, "message": exc.message, "retryable": exc.retryable}]
            },
        )

    app.add_exception_handler(RuntimeAPIError, runtime_error_handler)  # type: ignore[arg-type]
    app.include_router(create_router(store, controller))

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "interpreter": "configured" if interpreter else "unavailable"}

    return app


app = create_app()
