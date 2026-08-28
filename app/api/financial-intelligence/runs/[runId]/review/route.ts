import { createReviewHandler } from "@/backend/api/financial-intelligence/persisted-http";import { financialRunService } from "@/backend/financial-intelligence/persistence";import { authorizeExecution } from "@/lib/execution-auth";
export const runtime="nodejs",dynamic="force-dynamic";export const POST=createReviewHandler({authorize:authorizeExecution,service:financialRunService});
