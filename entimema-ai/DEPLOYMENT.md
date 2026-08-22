# Google Cloud Run deployment (Agent Platform runtime)

> The original private Concierge Lab is retired as a public product. This service also hosts durable
> Case, Evidence, and specialist-agent foundations, so keep it pending environment-level verification.

Sprint 9B packages the existing Entimema FastAPI runtime for an initial private-lab
deployment. It does not add persistence, authentication, or change the reasoning architecture.

## Deployment configuration

Use the following initial Cloud Run source-deployment settings:

| Setting | Value |
| --- | --- |
| Google Cloud project | `entimema-runtime` |
| Cloud Run service | `entimema-runtime` |
| Repository | `EntimemaInsight/Entimema` |
| Branch regex | `^main$` |
| Build type | Dockerfile |
| Dockerfile source location | `/entimema-ai/Dockerfile` |
| Recommended region | `europe-west1` |
| Minimum instances | `0` |
| Maximum instances | `1` |
| Memory | Start with `512 MiB` if sufficient |
| CPU | Request/default allocation |
| Ingress | Internet-accessible, so the Vercel server proxy can reach it |
| Authentication | Allow unauthenticated for the PRIVATE LAB only |

Another appropriate EU region may be selected later. Allowing unauthenticated Cloud Run access
is a temporary lab deployment trade-off, **not** the final production security model. The lab
route remains private/unadvertised, but obscurity is not authentication.

The Docker build context is `entimema-ai/`. The verified ASGI application is `api.app:app`, and
the container starts it with:

```sh
uvicorn api.app:app --host 0.0.0.0 --port ${PORT:-8080}
```

Cloud Run supplies `PORT`; it should not be configured manually.

## Server-side environment and secrets

The runtime uses these server-side settings:

- `OPENAI_API_KEY`
- `ENTIMEMA_INTERPRETER_MODEL`

Prefer a **Google Secret Manager secret referenced by Cloud Run** for `OPENAI_API_KEY`. A Cloud
Run environment variable is acceptable as a temporary lab alternative. Never commit the secret.
The container intentionally starts without either interpreter setting: `/health` remains
available, while LIVE language interpretation returns the controlled interpreter-unavailable
response until both values are configured.

## Session architecture warning

Current live session storage is **in-memory and non-persistent**. A Cloud Run container restart
or scale-down can erase every session held by that instance. Keep maximum instances at `1` until
external persistence or session storage is implemented; multiple instances would have isolated
stores and could produce inconsistent session lookup. Minimum instances may remain `0` for the
lab, accepting cold starts and session loss after scale-down. Sprint 9B does not add persistence.

## Vercel wiring

After deployment, Cloud Run provides a URL similar to:

```text
https://entimema-runtime-xxxxx.run.app
```

Configure this only as the server-side Vercel environment variable:

```text
ENTIMEMA_RUNTIME_URL=<Cloud Run URL>
```

Do not hard-code the Cloud Run URL in source. With that setting, the request path is:

```text
Browser
→ Next.js/Vercel proxy
→ Cloud Run
→ Entimema runtime
```

## Post-deployment validation

Request:

```text
GET <Cloud Run URL>/health
```

The expected result is HTTP `200` with a basic runtime status. The response may report the
interpreter as unavailable when its configuration is absent; it does not expose configuration
values, secrets, or session state. Validate the health endpoint and Agent Platform API directly;
`/concierge-lab` now redirects to `/agents` and is no longer a runtime validation surface.

## Deferred production hardening

Before a public or production Agent Platform release, add a durable external session store, proper
service authentication/authorization, a deliberate scaling model, secret rotation, monitoring,
and production capacity/load validation. RAG, uploads, voice, PD/ECL, and autonomous actions also
remain outside Sprint 9B.
