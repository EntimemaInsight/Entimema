import { proxyRuntime } from "../runtime-proxy";

export async function POST(request: Request) {
  return proxyRuntime(request, "/api/v1/sessions");
}
