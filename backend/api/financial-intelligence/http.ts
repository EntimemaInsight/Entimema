import { ValidationFailure } from "../../financial-intelligence/v1/diagnostics";
import { randomUUID } from "node:crypto";
import { AgentError, type ErrorCode } from "../../lib/errors";
import type { ExecutionRateLimiter } from "../../lib/rate-limit";
import type { AuthorizedActor } from "../../../lib/execution-auth";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../../lib/document-classifier-upload";
import { inspectUploadedFile } from "../../lib/files";
import {
  CoreError,
  executeV1,
  HTTP_DEADLINE_MS,
} from "../../financial-intelligence/v1/core";

// Shared transport errors keep their codes/statuses; FI owns customer-facing wording.
const executionMessages: Partial<Record<ErrorCode, string>> = {
  EXECUTION_RATE_LIMIT:
    "Too many financial intelligence runs. Please try again later.",
  MODEL_SERVICE_UNAVAILABLE:
    "Financial intelligence provider access is temporarily unavailable.",
  PROCESSING_TIMEOUT: "Financial intelligence execution timed out.",
  OPENAI_TIMEOUT: "Financial intelligence execution timed out.",
  OPENAI_RATE_LIMIT:
    "Financial intelligence provider requests are temporarily rate limited.",
  OPENAI_RESPONSE_INVALID: "The financial response could not be verified.",
};

export function createFinancialIntelligenceHandler(deps: {
  authorize: () => Promise<AuthorizedActor>;
  rateLimiter: ExecutionRateLimiter;
  execute?: typeof executeV1;
}) {
  return async (request: Request) => {
    const httpStarted = performance.now();
    const deadlineMs = httpStarted + HTTP_DEADLINE_MS;
    const checkDeadline = () => {
      if (performance.now() >= deadlineMs)
        throw new AgentError(
          "PROCESSING_TIMEOUT",
          504,
          "Financial intelligence execution timed out.",
        );
    };
    const runId = randomUUID();
    const headers = { "Cache-Control": "no-store" };
    try {
      const actor = await deps.authorize();
      checkDeadline();
      await deps.rateLimiter.consume(actor.actorId);
      checkDeadline();
      if (
        Number(request.headers.get("content-length")) >
        DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES
      )
        throw new AgentError("FILE_TOO_LARGE", 413);
      if (
        !(request.headers.get("content-type") ?? "")
          .toLowerCase()
          .startsWith("multipart/form-data")
      )
        throw new AgentError("FILE_MISSING", 400);
      // Bound the actual stream as well as Content-Length before parsing multipart data.
      const reader = request.body?.getReader();
      if (!reader) throw new AgentError("FILE_MISSING", 400);
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { value, done } = await reader.read();
        if (performance.now() >= deadlineMs) {
          await reader.cancel();
          checkDeadline();
        }
        if (done) break;
        size += value.byteLength;
        if (size > DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES) {
          await reader.cancel();
          throw new AgentError("FILE_TOO_LARGE", 413);
        }
        chunks.push(value);
      }
      let form: FormData;
      try {
        form = await new Response(Buffer.concat(chunks), {
          headers: { "Content-Type": request.headers.get("content-type")! },
        }).formData();
      } catch {
        throw new AgentError(
          "FILE_MISSING",
          400,
          "Malformed multipart upload.",
        );
      }
      if (
        [...form.keys()].some((key) => key !== "file") ||
        form.getAll("file").length !== 1
      )
        throw new AgentError(
          "FILE_MISSING",
          400,
          "Upload exactly one file. No preparation fields are accepted.",
        );
      const document = await inspectUploadedFile(form.get("file"));
      checkDeadline();
      const result = await (deps.execute ?? executeV1)(document, {
        deadlineMs,
        onTelemetry: (telemetry) =>
          console.info(
            JSON.stringify({
              runId,
              ...telemetry,
              httpTotalMs:
                Math.round((performance.now() - httpStarted) * 100) / 100,
            }),
          ),
      });
      checkDeadline();
      return Response.json(result, { headers });
    } catch (error) {
      const cause = error instanceof CoreError ? error.error : error;
      const safe =
        cause instanceof AgentError
          ? cause
          : new AgentError("INTERNAL_ERROR", 500);
      // No source content, model output or provider secrets in operational logs.
      if (error instanceof CoreError)
        console.info(
          JSON.stringify({
            runId,
            code: safe.code,
            aiCalls: error.aiCalls,
            timings: error.timings,
            timeoutBoundary: error.telemetry?.timeoutBoundary ?? null,
            providerHttpStatus: error.telemetry?.providerHttpStatus ?? null,
            providerStatusClass: error.telemetry?.providerStatusClass ?? null,
            ...(cause instanceof ValidationFailure
              ? { validation: cause.diagnostics }
              : {}),
          }),
        );
      return Response.json(
        {
          error_code: safe.code,
          message: executionMessages[safe.code] ?? safe.message,
        },
        { status: safe.httpStatus, headers },
      );
    }
  };
}
