import { createHash, randomUUID } from "node:crypto";
import { AgentError, errorResponse } from "../../lib/errors";
import { logAgentEvent } from "../../lib/logging";
import type { ExecutionRateLimiter } from "../../lib/rate-limit";
import type { AuthorizedActor } from "../../../lib/execution-auth";
import { DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES } from "../../../lib/document-classifier-upload";
import { inspectUploadedFile } from "../../lib/files";
import {
  AiNativeExecutionError,
  runAiNativeFinancialIntelligence,
} from "../../financial-intelligence/ai-native-run";
import type { FinancialRunService } from "../../financial-intelligence/persistence/service";
import { analyzeValidatedIncomeStatement } from "../../financial-intelligence/analysis";

export function customerFinancialRun<T extends { resolverTelemetry?: unknown; reviewTasks?: unknown }>(run: T) {
  const { resolverTelemetry, reviewTasks, ...customer } = run;
  void resolverTelemetry;
  void reviewTasks;
  return { ...customer, reviewTasks: [] };
}

const failedWorkflow = (stage: string) => {
  const stages = [
    { id: "upload", label: "Upload" },
    { id: "understanding", label: "Understanding financials" },
    { id: "validation", label: "Validating" },
    { id: "review", label: "Review if needed" },
    { id: "result", label: "Analysis ready" },
  ];
  const failedIndex =
    stage === "request" || stage === "upload_parse"
      ? 0
      : stage === "source_read" || stage === "financial_understanding" || stage === "contract_build"
        ? 1
        : stage === "validation"
          ? 2
          : stage === "persistence"
            ? 4
            : 0;
  return stages.map((item, index) => ({
    ...item,
    state: index < failedIndex ? "completed" : index === failedIndex ? "blocked" : "idle",
  }));
};

const boundedFailure = (runId: string, failureCode: string, failureStage: string, status = 500) =>
  Response.json(
    {
      run_id: runId,
      status: "failed",
      error_code: "INTERNAL_ERROR",
      failure_code: failureCode,
      failure_stage: failureStage,
      message: "The execution could not be completed safely.",
      workflow: failedWorkflow(failureStage),
    },
    { status, headers: { "Cache-Control": "no-store" } },
  );

export function createFinancialIntelligenceHandler(deps: {
  authorize: () => Promise<AuthorizedActor>;
  rateLimiter: ExecutionRateLimiter;
  service?: FinancialRunService;
}) {
  return async (request: Request) => {
    const runId = randomUUID();
    const totalStarted = performance.now();
    let uploadFormParsingMs = 0;
    let actor: AuthorizedActor | undefined;

    try {
      actor = await deps.authorize();
      await deps.rateLimiter.consume(actor.actorId);

      const length = Number(request.headers.get("content-length"));
      if (Number.isFinite(length) && length > DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES) {
        throw new AgentError("FILE_TOO_LARGE", 413);
      }
      if (!(request.headers.get("content-type") ?? "").toLowerCase().startsWith("multipart/form-data")) {
        throw new AgentError("FILE_MISSING", 400);
      }

      let form: FormData;
      const formStarted = performance.now();
      try {
        form = await request.formData();
        uploadFormParsingMs = Math.round(performance.now() - formStarted);
      } catch (error) {
        throw new AgentError("FILE_MISSING", 400, "Malformed multipart form data.", error);
      }

      // Product invariant: the user contributes exactly one thing to Data Preparation — the file.
      if ([...form.keys()].some((key) => key !== "file") || form.getAll("file").length !== 1) {
        throw new AgentError("FILE_MISSING", 400, "Expected exactly one financial file.");
      }

      let document;
      try {
        document = await inspectUploadedFile(form.get("file"));
      } catch (error) {
        if (error instanceof AgentError) throw error;
        logAgentEvent("error", {
          run_id: runId,
          actor_id: actor.actorId,
          agent: "financial_intelligence",
          event: "execution_failed",
          error_code: "FI_UPLOAD_PARSE_FAILURE",
          telemetry: {
            executionPathVersion: "financial-understanding.v2",
            failureStage: "upload_parse",
            failureCode: "FI_UPLOAD_PARSE_FAILURE",
            totalExecutionMs: Math.round(performance.now() - totalStarted),
          },
        });
        return boundedFailure(runId, "FI_UPLOAD_PARSE_FAILURE", "upload_parse");
      }

      let result;
      try {
        result = await runAiNativeFinancialIntelligence(document);
      } catch (error) {
        if (!(error instanceof AiNativeExecutionError)) throw error;
        const telemetry = {
          ...error.telemetry,
          failureStage: error.failureStage,
          failureCode: error.failureCode,
          totalExecutionMs: Math.round(performance.now() - totalStarted),
        };
        logAgentEvent("error", {
          run_id: runId,
          actor_id: actor.actorId,
          agent: "financial_intelligence",
          event: "execution_failed",
          error_code: error.failureCode,
          telemetry,
        });
        return boundedFailure(
          runId,
          error.failureCode,
          error.failureStage,
          error.failureCode === "FI_UNDERSTANDING_TIMEOUT" ? 504 : 500,
        );
      }

      const persistenceStarted = performance.now();
      try {
        if (deps.service) {
          result = await deps.service.create(actor.actorId, result, {
            size: document.size,
            fingerprint: createHash("sha256").update(document.buffer).digest("hex"),
          });
        }
      } catch (error) {
        const telemetry = {
          ...result.understandingTelemetry,
          persistenceMs: Math.round(performance.now() - persistenceStarted),
          totalExecutionMs: Math.round(performance.now() - totalStarted),
          failureStage: "persistence",
          failureCode: "FI_PERSISTENCE_FAILURE",
        };
        logAgentEvent("error", {
          run_id: runId,
          actor_id: actor.actorId,
          agent: "financial_intelligence",
          event: "execution_failed",
          error_code: "FI_PERSISTENCE_FAILURE",
          telemetry,
        });
        if (error instanceof AgentError) return errorResponse(error, runId);
        return boundedFailure(runId, "FI_PERSISTENCE_FAILURE", "persistence");
      }

      logAgentEvent("info", {
        run_id: result.runId,
        actor_id: actor.actorId,
        agent: "financial_intelligence",
        event: "execution_completed",
        telemetry: {
          ...result.understandingTelemetry,
          uploadFormParsingMs,
          persistenceMs: Math.round(performance.now() - persistenceStarted),
          timeToFirstUsefulResultMs: Math.round(performance.now() - totalStarted),
          totalExecutionMs: Math.round(performance.now() - totalStarted),
        },
      });

      // Analysis is deterministic and cheap. Include it in the first response so
      // the customer does not need a second request before seeing useful output.
      const analysis = result.status === "validated"
        ? analyzeValidatedIncomeStatement(result, new Date().toISOString(), result.integrity)
        : null;
      return Response.json({ ...customerFinancialRun(result), analysis }, {
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      return errorResponse(
        error instanceof AgentError ? error : new AgentError("INTERNAL_ERROR", 500, undefined, error),
        runId,
      );
    }
  };
}
