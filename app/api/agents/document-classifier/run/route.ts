import { randomUUID } from "node:crypto";
import { runDocumentClassifier } from "@/backend/api/agents/document-classifier/run";
import { AgentError, errorResponse } from "@/backend/lib/errors";
import { logAgentEvent } from "@/backend/lib/logging";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";

const allowedOrigins = new Set(["https://www.entimema.com", "https://entimema.com"]);

function withCors(response: Response, request: Request) {
  const origin = request.headers.get("origin");
  response.headers.append("Vary", "Origin");
  if (origin && allowedOrigins.has(origin)) response.headers.set("Access-Control-Allow-Origin", origin);
  return response;
}

export function OPTIONS(request: Request) {
  const response = new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
  return withCors(response, request);
}

export async function POST(request: Request) {
  const runId = randomUUID(), started = performance.now();
  try {
    if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) throw new AgentError("FILE_MISSING", 400, "Expected multipart/form-data with a file field.");
    let formData: FormData; try { formData = await request.formData(); } catch (error) { throw new AgentError("FILE_MISSING", 400, "Malformed multipart form data.", error); }
    const result = await runDocumentClassifier(formData), classification = result.response.classification, routing = result.response.routing;
    logAgentEvent("info", { run_id: runId, agent: "document_classifier", event: "run_completed", file_type: result.document.extension, file_size: result.document.size, document_family: classification.document_family, document_type: classification.document_type, confidence: classification.confidence, classification_source: result.response.classification_source, openai_call_count: result.response.openai_call_count, routing_result: routing.recommended_agent, timing: result.response.timing, duration_ms: Math.round(performance.now() - started) });
    return withCors(Response.json({ run_id: runId, ...result.response }), request);
  } catch (error) {
    const safe = error instanceof AgentError ? error : new AgentError("INTERNAL_ERROR", 500, undefined, error);
    logAgentEvent("error", { run_id: runId, agent: "document_classifier", event: "run_failed", duration_ms: Math.round(performance.now() - started), error_code: safe.code });
    return withCors(errorResponse(safe, runId), request);
  }
}
