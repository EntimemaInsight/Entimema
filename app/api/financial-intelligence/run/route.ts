import { createFinancialIntelligenceHandler } from "@/backend/api/financial-intelligence/http";
import { executionRateLimiter } from "@/backend/lib/rate-limit";
import { authorizeExecution } from "@/lib/execution-auth";
import { financialRunService } from "@/backend/financial-intelligence/persistence";
export const runtime="nodejs"; export const dynamic="force-dynamic";
export const POST=createFinancialIntelligenceHandler({authorize:authorizeExecution,rateLimiter:executionRateLimiter,service:financialRunService});
