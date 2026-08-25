import { randomUUID } from "node:crypto";
import { auth, isWorkspaceAllowed } from "@/auth";
import { runDocumentClassifier } from "@/backend/api/agents/document-classifier/run";
import { AgentError, errorResponse } from "@/backend/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const upstreamPath = "/api/agents/document-classifier/run";

async function runThroughAgentApi(formData: FormData) {
  const baseUrl = process.env.ENTIMEMA_AGENT_API_URL?.trim();
  if (!baseUrl) return null;
  const response = await fetch(new URL(upstreamPath, baseUrl), { method: "POST", body: formData, cache: "no-store", signal: AbortSignal.timeout(90_000) });
  const body = await response.arrayBuffer();
  return new Response(body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json", "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email || !isWorkspaceAllowed(session.user.email)) return Response.json({ error: "Authentication required." }, { status: 401 });
  const runId = randomUUID();
  try {
    if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) throw new AgentError("FILE_MISSING", 400, "Choose a supported document before running the agent.");
    const formData = await request.formData();
    const upstream = await runThroughAgentApi(formData);
    if (upstream) return upstream;
    const result = await runDocumentClassifier(formData);
    return Response.json({ run_id: runId, ...result.response });
  } catch (error) {
    const safe = error instanceof AgentError ? error : new AgentError("INTERNAL_ERROR", 500, "The document could not be classified. Try again.", error);
    return errorResponse(safe, runId);
  }
}