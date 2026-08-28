export const ERROR_CODES = ["AUTHENTICATION_REQUIRED", "ACCESS_FORBIDDEN", "EXECUTION_RATE_LIMIT", "FILE_MISSING", "FILE_TOO_LARGE", "UNSUPPORTED_FILE_TYPE", "FILE_CORRUPT", "FILE_ENCRYPTED", "MODEL_SERVICE_UNAVAILABLE", "OPENAI_TIMEOUT", "OPENAI_RATE_LIMIT", "OPENAI_RESPONSE_INVALID", "CLASSIFICATION_FAILED", "INTERNAL_ERROR"] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];
const messages: Record<ErrorCode, string> = {
  AUTHENTICATION_REQUIRED: "Authentication is required.", ACCESS_FORBIDDEN: "This account is not authorized to use the workspace.",
  EXECUTION_RATE_LIMIT: "Too many classifier runs. Please try again later.",
  FILE_MISSING: "A file is required.", FILE_TOO_LARGE: "The uploaded file exceeds the allowed size.",
  UNSUPPORTED_FILE_TYPE: "This file type is not currently supported.", FILE_CORRUPT: "The uploaded file is corrupt or cannot be read.",
  FILE_ENCRYPTED: "Encrypted or password-protected files are not supported.", MODEL_SERVICE_UNAVAILABLE: "The classifier service is temporarily unavailable.", OPENAI_TIMEOUT: "Document classification timed out.",
  OPENAI_RATE_LIMIT: "Document classification is temporarily rate limited.", OPENAI_RESPONSE_INVALID: "The classifier returned an invalid response.",
  CLASSIFICATION_FAILED: "Document classification failed.", INTERNAL_ERROR: "An unexpected internal error occurred.",
};
export class AgentError extends Error {
  constructor(public readonly code: ErrorCode, public readonly httpStatus: number, message = messages[code], public readonly cause?: unknown) {
    super(message); this.name = "AgentError";
  }
}
export function errorResponse(error: unknown, runId: string) {
  const safe = error instanceof AgentError ? error : new AgentError("INTERNAL_ERROR", 500, undefined, error);
  return Response.json({ run_id: runId, agent: "document_classifier", status: "failed", error_code: safe.code, message: safe.message }, { status: safe.httpStatus });
}
