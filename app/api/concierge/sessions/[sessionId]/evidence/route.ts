import { NextResponse } from "next/server";

const MAX_ARTIFACT_BYTES = 25 * 1024 * 1024;

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const baseUrl = process.env.ENTIMEMA_RUNTIME_URL;
  if (!baseUrl) return NextResponse.json({ errors: [{ code: "RUNTIME_UNAVAILABLE", message: "LIVE RUNTIME NOT CONFIGURED", retryable: false }] }, { status: 503 });
  const body = await request.arrayBuffer();
  if (body.byteLength > MAX_ARTIFACT_BYTES) return NextResponse.json({ errors: [{ code: "ARTIFACT_TOO_LARGE", message: "Artifact exceeds 25 MB.", retryable: false }] }, { status: 413 });
  const { sessionId } = await params;
  try {
    const registeredResponse = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/cases/${encodeURIComponent(sessionId)}/artifacts`, { method: "POST", body, headers: { "content-type": request.headers.get("content-type") ?? "application/octet-stream", "x-filename": encodeURIComponent(request.headers.get("x-filename") ?? "artifact"), "x-command-id": request.headers.get("x-command-id") ?? crypto.randomUUID() }, signal: AbortSignal.timeout(35_000), cache: "no-store" });
    const registered = await registeredResponse.json();
    if (!registeredResponse.ok || registered.artifact?.status !== "ACCEPTED") return NextResponse.json(registered, { status: registeredResponse.ok ? 422 : registeredResponse.status });
    const processedResponse = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/cases/${encodeURIComponent(sessionId)}/artifacts/${encodeURIComponent(registered.artifact.id)}/process`, { method: "POST", headers: { "x-command-id": crypto.randomUUID() }, signal: AbortSignal.timeout(35_000), cache: "no-store" });
    return NextResponse.json(await processedResponse.json(), { status: processedResponse.status });
  } catch {
    return NextResponse.json({ errors: [{ code: "RUNTIME_UNAVAILABLE", message: "Evidence intake is temporarily unavailable.", retryable: true }] }, { status: 503 });
  }
}
