import { randomUUID } from "node:crypto";
import { runDocumentClassifier } from "./run";
import { AgentError, errorResponse } from "../../../lib/errors";
import { logAgentEvent } from "../../../lib/logging";
import type { AuthorizedActor } from "../../../../lib/execution-auth";
import type { ExecutionRateLimiter } from "../../../lib/rate-limit";

type Dependencies = {
  authorize: () => Promise<AuthorizedActor>;
  rateLimiter: ExecutionRateLimiter;
  classifier?: typeof runDocumentClassifier;
  logger?: typeof logAgentEvent;
};

export function createDocumentClassifierPostHandler(dependencies: Dependencies) {
  return async function POST(request: Request) {
    const started = performance.now();
    let runId: string | undefined;
    let actor: AuthorizedActor | undefined;
    try {
      actor = await dependencies.authorize();
      runId = randomUUID();
      await dependencies.rateLimiter.consume(actor.actorId);
      if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) {
        throw new AgentError("FILE_MISSING", 400, "Expected multipart/form-data with exactly one file field.");
      }
      let formData: FormData;
      try { formData = await request.formData(); }
      catch (error) { throw new AgentError("FILE_MISSING", 400, "Malformed multipart form data.", error); }
      const result = await (dependencies.classifier ?? runDocumentClassifier)(formData);
      const classification = result.response.classification;
      const routing = result.response.routing;
      (dependencies.logger ?? logAgentEvent)("info", {
        run_id: runId, actor_id: actor.actorId, agent: "document_classifier", event: "run_completed",
        file_type: result.document.extension, file_size: result.document.size,
        document_family: classification.document_family, document_type: classification.document_type,
        confidence: classification.confidence, classification_source: result.response.classification_source,
        openai_call_count: result.response.openai_call_count, routing_result: routing.recommended_agent,
        timing: result.response.timing, duration_ms: Math.round(performance.now() - started),
      });
      return Response.json({ run_id: runId, ...result.response }, { headers: { "Cache-Control": "no-store" } });
    } catch (error) {
      const safe = error instanceof AgentError ? error : new AgentError("INTERNAL_ERROR", 500, undefined, error);
      runId ??= randomUUID();
      (dependencies.logger ?? logAgentEvent)("error", {
        run_id: runId, actor_id: actor?.actorId, agent: "document_classifier", event: "run_failed",
        duration_ms: Math.round(performance.now() - started), error_code: safe.code,
      });
      return errorResponse(safe, runId);
    }
  };
}
