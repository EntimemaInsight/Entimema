import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16_384;

export async function proxyRuntime(request: Request, path: string) {
  const baseUrl = process.env.ENTIMEMA_RUNTIME_URL;
  if (!baseUrl) {
    return NextResponse.json({ errors: [{ code: "RUNTIME_UNAVAILABLE", message: "LIVE RUNTIME NOT CONFIGURED", retryable: false }] }, { status: 503 });
  }
  const raw = request.method === "GET" || request.method === "HEAD" ? "" : await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return NextResponse.json({ errors: [{ code: "VALIDATION_FAILED", message: "Request is too large.", retryable: false }] }, { status: 413 });
  }
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      method: request.method,
      headers: { "content-type": "application/json" },
      body: raw || undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(35_000),
    });
    return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ errors: [{ code: "RUNTIME_UNAVAILABLE", message: "The live runtime is temporarily unavailable.", retryable: true }] }, { status: 503 });
  }
}
