import "server-only";
import { callFinancialDatabaseRpc } from "@/lib/financial-database";

export type WorkspaceRun = {
  run_id: string;
  created_at: string;
  source_name: string;
  document_type: string;
  control_status: "completed" | "review-required" | "failed";
  product_id: "financial-intelligence";
  workflow_id: "income-statement-analysis";
  duration_ms: number;
};

export async function recordWorkspaceRun(input: {
  runId: string;
  email: string;
  organizationName: string;
  sourceName: string;
  documentType: string;
  controlStatus: WorkspaceRun["control_status"];
  durationMs: number;
}) {
  return callFinancialDatabaseRpc<boolean>("workspace_record_run", {
    p_run_id: input.runId,
    p_customer_email: input.email,
    p_organization_name: input.organizationName,
    p_source_name: input.sourceName,
    p_document_type: input.documentType,
    p_control_status: input.controlStatus,
    p_duration_ms: Math.max(0, Math.round(input.durationMs)),
  });
}

export async function listWorkspaceRuns(email: string) {
  try {
    return (await callFinancialDatabaseRpc<WorkspaceRun[]>("workspace_list_runs", {
      p_email: email.trim().toLowerCase(),
      p_limit: 25,
    })) ?? [];
  } catch {
    return [];
  }
}
