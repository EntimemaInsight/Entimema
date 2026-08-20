import { proxyRuntime } from "../../../runtime-proxy";

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return proxyRuntime(request, `/api/v1/sessions/${encodeURIComponent(sessionId)}/reset`);
}
