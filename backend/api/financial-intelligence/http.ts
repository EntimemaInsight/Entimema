import { ValidationFailure } from "../../financial-intelligence/v1/diagnostics";
import { randomUUID } from "node:crypto";
import { AgentError } from "../../lib/errors";
import type { ExecutionRateLimiter } from "../../lib/rate-limit";
import type { AuthorizedActor } from "../../../lib/execution-auth";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../../lib/document-classifier-upload";
import { inspectUploadedFile } from "../../lib/files";
import { CoreError, executeV1 } from "../../financial-intelligence/v1/core";

export function createFinancialIntelligenceHandler(deps: {
  authorize: () => Promise<AuthorizedActor>;
  rateLimiter: ExecutionRateLimiter;
  execute?: typeof executeV1;
}) {
  return async (request: Request) => {
    const runId = randomUUID();
    const headers = { "Cache-Control": "no-store" };
    try {
      const actor = await deps.authorize();
      await deps.rateLimiter.consume(actor.actorId);
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
      const result = await (deps.execute ?? executeV1)(document);
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
            ...(cause instanceof ValidationFailure
              ? { validation: cause.diagnostics }
              : {}),
          }),
        );
      return Response.json(
        { error_code: safe.code, message: safe.message },
        { status: safe.httpStatus, headers },
      );
    }
  };
}
