import { createReportHandler } from "@/backend/api/financial-intelligence/persisted-http";
import { financialRunService } from "@/backend/financial-intelligence/persistence";
import { authorizeExecution } from "@/lib/execution-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = createReportHandler({ authorize: authorizeExecution, service: financialRunService });
