import { createFinancialIntelligenceHandler } from "@/backend/api/financial-intelligence/http";
import { executionRateLimiter } from "@/backend/lib/rate-limit";
import { authorizeExecution } from "@/lib/execution-auth";
import { getPaidWorkspaceAccessProfile } from "@/lib/workspace-entitlements";
import { recordWorkspaceRun } from "@/lib/workspace-runs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 180;
export const POST = createFinancialIntelligenceHandler({
  authorize: authorizeExecution,
  rateLimiter: executionRateLimiter,
  recordRun: async ({ actor, document, result, runId }) => {
    if (!actor.email) return;
    const profile = await getPaidWorkspaceAccessProfile(actor.email);
    await recordWorkspaceRun({
      runId,
      email: actor.email,
      organizationName: profile?.organization_name ?? "Customer workspace",
      sourceName: document.fileName,
      documentType: "Income statement",
      controlStatus: result.statementType === "income_statement" ? "completed" : "review-required",
      durationMs: result.timings.totalMs,
    });
  },
});
