import { createDocumentClassifierPostHandler } from "@/backend/api/agents/document-classifier/http";
import { executionRateLimiter } from "@/backend/lib/rate-limit";
import { authorizeExecution } from "@/lib/execution-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = createDocumentClassifierPostHandler({
  authorize: authorizeExecution,
  rateLimiter: executionRateLimiter,
});
