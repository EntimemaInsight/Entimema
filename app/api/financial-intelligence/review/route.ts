import { createFinancialReviewHandler } from "@/backend/api/financial-intelligence/http";
import { executionRateLimiter } from "@/backend/lib/rate-limit";
import { authorizeExecution } from "@/lib/execution-auth";
export const runtime="nodejs";export const dynamic="force-dynamic";
export const POST=createFinancialReviewHandler({authorize:authorizeExecution,rateLimiter:executionRateLimiter});
