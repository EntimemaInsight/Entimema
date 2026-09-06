import { createFinancialIntelligenceHandler } from "@/backend/api/financial-intelligence/http";
import { executionRateLimiter } from "@/backend/lib/rate-limit";
import { authorizeExecution } from "@/lib/execution-auth";
import { financialRunService } from "@/backend/financial-intelligence/persistence";
export const runtime="nodejs"; export const dynamic="force-dynamic";
// Reserve bounded headroom around the 45-second semantic budget for extraction,
// validation, and persistence. Deployment platforms may enforce a lower plan cap.
export const maxDuration = 60;
export const POST=createFinancialIntelligenceHandler({authorize:authorizeExecution,rateLimiter:executionRateLimiter,service:financialRunService});
