import type { FinancialRun } from "@/backend/financial-intelligence/schema";

export const financialIntelligenceFailureText = {
  FI_UPLOAD_PARSE_FAILURE:
    "The uploaded document could not be prepared safely. Check the file and try again.",
  FI_SOURCE_READ_FAILURE:
    "The document structure could not be read safely. Check the file and try again.",
  FI_UNDERSTANDING_PROVIDER_FAILURE:
    "Financial understanding is temporarily unavailable. Try again shortly.",
  FI_UNDERSTANDING_TIMEOUT:
    "Financial understanding did not finish within the execution window. Try again shortly.",
  FI_UNDERSTANDING_SCHEMA_FAILURE:
    "Financial understanding returned an unusable result. Try again shortly.",
  FI_CONTRACT_BUILD_FAILURE:
    "The source-linked financial result could not be assembled safely.",
  FI_VALIDATION_FAILURE:
    "The financial result could not pass deterministic validation safely.",
  FI_PERSISTENCE_FAILURE:
    "The validated financial run could not be saved. Try again later.",
} as const;

export type FinancialIntelligenceFailureCode =
  keyof typeof financialIntelligenceFailureText;

const failureStageText = {
  upload_parse: "Upload preparation",
  source_read: "Source read",
  financial_understanding: "Financial understanding",
  contract_build: "Contract build",
  validation: "Validation",
  persistence: "Persistence",
} as const;

export type FinancialIntelligenceFailureStage = keyof typeof failureStageText;

export type FinancialIntelligenceFailure = {
  failureCode: FinancialIntelligenceFailureCode;
  failureStage: FinancialIntelligenceFailureStage;
  failureStageLabel: (typeof failureStageText)[FinancialIntelligenceFailureStage];
  runId: string;
  workflow: FinancialRun["workflow"] | null;
  customerMessage: string;
};

const genericFailureText = "The execution could not be completed safely.";

function isFailureCode(
  value: unknown,
): value is FinancialIntelligenceFailureCode {
  return typeof value === "string" && value in financialIntelligenceFailureText;
}

function isFailureStage(
  value: unknown,
): value is FinancialIntelligenceFailureStage {
  return typeof value === "string" && value in failureStageText;
}

function isSafeRunId(value: unknown): value is string {
  return typeof value === "string" && /^[a-zA-Z0-9-]{1,64}$/.test(value);
}

const workflowLabels = {
  upload: "Upload",
  understanding: "Understanding financials",
  validation: "Validating",
  review: "Review if needed",
  result: "Analysis ready",
} as const;

const workflowStates = new Set([
  "idle",
  "running",
  "completed",
  "warning",
  "review_required",
  "blocked",
]);

function readWorkflow(value: unknown): FinancialRun["workflow"] | null {
  if (!Array.isArray(value)) return null;
  const steps = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const step = item as Record<string, unknown>;
    if (typeof step.id !== "string" || !(step.id in workflowLabels)) return [];
    if (typeof step.state !== "string" || !workflowStates.has(step.state))
      return [];
    const id = step.id as keyof typeof workflowLabels;
    return [{ id, label: workflowLabels[id], state: step.state }];
  });
  return steps.length ? (steps as FinancialRun["workflow"]) : null;
}

export function readFinancialIntelligenceFailure(
  payload: unknown,
): FinancialIntelligenceFailure | null {
  if (!payload || typeof payload !== "object") return null;
  const data = payload as Record<string, unknown>;
  if (
    !isFailureCode(data.failure_code) ||
    !isFailureStage(data.failure_stage) ||
    !isSafeRunId(data.run_id)
  )
    return null;

  return {
    failureCode: data.failure_code,
    failureStage: data.failure_stage,
    failureStageLabel: failureStageText[data.failure_stage],
    runId: data.run_id,
    workflow: readWorkflow(data.workflow),
    customerMessage: financialIntelligenceFailureText[data.failure_code],
  };
}

export function safeExecutionErrorText(payload: unknown): string {
  const failure = readFinancialIntelligenceFailure(payload);
  if (failure) return failure.customerMessage;
  if (!payload || typeof payload !== "object") return genericFailureText;

  const errorCode = (payload as Record<string, unknown>).error_code;
  const safeErrors: Record<string, string> = {
    AUTHENTICATION_REQUIRED: "Your session expired. Sign in again.",
    ACCESS_FORBIDDEN: "Your account is not authorized for this workspace.",
    FILE_TOO_LARGE: "The file exceeds the 4.5 MB production boundary.",
    UNSUPPORTED_FILE_TYPE: "Use XLSX, XLSM, CSV, or a text-based PDF.",
    FILE_CORRUPT: "The document could not be safely read.",
    PERSISTENCE_UNAVAILABLE:
      "Financial run storage is temporarily unavailable. Try again later.",
    EXECUTION_RATE_LIMIT: "Too many executions. Try again shortly.",
  };
  return typeof errorCode === "string" && safeErrors[errorCode]
    ? safeErrors[errorCode]
    : genericFailureText;
}
