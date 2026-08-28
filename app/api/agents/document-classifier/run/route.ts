import { createDirectRunHandler } from "@/backend/api/agents/document-classifier/direct-http";
import { executionRateLimiter } from "@/backend/lib/rate-limit";
import { authorizeExecution } from "@/lib/execution-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createDirectRunHandler({
  authorize: authorizeExecution,
  rateLimiter: executionRateLimiter,
});
