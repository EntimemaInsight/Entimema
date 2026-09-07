import OpenAI from "openai";
import { AgentError } from "./errors";

type ResponseBody = OpenAI.Responses.ResponseCreateParamsNonStreaming;
type ResponseResult = OpenAI.Responses.Response;
export type OpenAITransport = (body: ResponseBody, signal: AbortSignal) => Promise<ResponseResult>;
export type OpenAIRequestDiagnostics = { attemptCount:number; attemptDurationsMs:number[]; providerStatusClass:string|null; providerHttpStatus?:number|null; providerErrorCode:string|null; timeoutTriggered:boolean };
export type OpenAIRequestConfig = { apiKey:string; timeoutMs:number; attempts:number; diagnostics?:OpenAIRequestDiagnostics };

const positiveInt = (value: string | undefined, fallback: number, maximum: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, maximum) : fallback;
};

export function getDocumentClassifierConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL?.trim();
  if (!apiKey || !model || !/^gpt-[A-Za-z0-9._-]+$/.test(model)) throw new AgentError("MODEL_SERVICE_UNAVAILABLE", 503);
  return {
    apiKey, model,
    timeoutMs: positiveInt(process.env.OPENAI_DOCUMENT_CLASSIFIER_TIMEOUT_MS, 45_000, 90_000),
    attempts: positiveInt(process.env.OPENAI_DOCUMENT_CLASSIFIER_MAX_ATTEMPTS, 2, 3),
  };
}

export const getDocumentClassifierModel = () => getDocumentClassifierConfig().model;

export function mapOpenAIError(error: unknown) {
  if (error instanceof AgentError) return error;
  const status = typeof error === "object" && error !== null && "status" in error ? Number(error.status) : 0;
  const name = error instanceof Error ? error.name : "";
  if (error instanceof OpenAI.APIConnectionTimeoutError || error instanceof OpenAI.APIUserAbortError || name === "AbortError" || name === "TimeoutError") return new AgentError("OPENAI_TIMEOUT", 504, undefined, error);
  if (error instanceof OpenAI.RateLimitError || status === 429) return new AgentError("OPENAI_RATE_LIMIT", 429, undefined, error);
  if (status >= 500 || error instanceof OpenAI.APIConnectionError) return new AgentError("MODEL_SERVICE_UNAVAILABLE", 503, undefined, error);
  return new AgentError("CLASSIFICATION_FAILED", 502, undefined, error);
}

const transient = (error: AgentError) => ["OPENAI_TIMEOUT", "OPENAI_RATE_LIMIT", "MODEL_SERVICE_UNAVAILABLE"].includes(error.code);

export async function createResponse(body: ResponseBody, injectedTransport?: OpenAITransport) {
  const config = getDocumentClassifierConfig();
  return createConfiguredResponse(body,config,injectedTransport);
}

/** Shared server-only Responses transport. Product features supply their own bounded configuration. */
export async function createConfiguredResponse(
  body: ResponseBody,
  config: OpenAIRequestConfig,
  injectedTransport?: OpenAITransport,
) {
  const transport =
    injectedTransport ??
    ((payload, signal) => {
      const client = new OpenAI({ apiKey: config.apiKey, maxRetries: 0 });
      return client.responses
        .create(payload, { signal })
        .withResponse()
        .then(({ data, response }) => {
          if (config.diagnostics)
            config.diagnostics.providerHttpStatus = response.status;
          return data;
        });
    });
  const requestStarted = performance.now(),
    diagnostics = config.diagnostics;
  if (diagnostics)
    Object.assign(diagnostics, {
      attemptCount: 0,
      attemptDurationsMs: [],
      providerStatusClass: null,
      providerHttpStatus: null,
      providerErrorCode: null,
      timeoutTriggered: false,
    });
  let last: AgentError | undefined;
  for (let attempt = 1; attempt <= config.attempts; attempt++) {
    const remaining =
      config.timeoutMs - Math.round(performance.now() - requestStarted);
    if (remaining <= 0) {
      last = new AgentError("OPENAI_TIMEOUT", 504);
      break;
    }
    const controller = new AbortController();
    let timeoutTriggered = false;
    const timeout = setTimeout(() => {
        timeoutTriggered = true;
        controller.abort();
      }, remaining),
      attemptStarted = performance.now();
    if (diagnostics) diagnostics.attemptCount = attempt;
    try {
      const result = await transport(body, controller.signal);
      if (controller.signal.aborted)
        throw new AgentError("OPENAI_TIMEOUT", 504);
      if (diagnostics) diagnostics.providerStatusClass = "2xx";
      return result;
    } catch (error) {
      last = mapOpenAIError(error);
      if (diagnostics) {
        diagnostics.timeoutTriggered ||=
          timeoutTriggered || last.code === "OPENAI_TIMEOUT";
        const providerStatus =
          typeof error === "object" && error !== null && "status" in error
            ? Number(error.status)
            : 0;
        diagnostics.providerErrorCode =
          last.code === "OPENAI_TIMEOUT"
            ? "timeout"
            : last.code === "OPENAI_RATE_LIMIT"
              ? "rate_limit"
              : providerStatus >= 500
                ? "provider_5xx"
                : error instanceof OpenAI.APIConnectionError
                  ? "provider_unavailable"
                  : last.code === "CLASSIFICATION_FAILED"
                    ? "invalid_request"
                    : last.code;
        diagnostics.providerHttpStatus = providerStatus || null;
        diagnostics.providerStatusClass =
          providerStatus >= 500 ? "5xx" : providerStatus >= 400 ? "4xx" : null;
      }
      if (
        !transient(last) ||
        attempt === config.attempts ||
        performance.now() - requestStarted >= config.timeoutMs
      )
        throw last;
    } finally {
      clearTimeout(timeout);
      if (diagnostics)
        diagnostics.attemptDurationsMs.push(
          Math.round(performance.now() - attemptStarted),
        );
    }
  }
  throw last ?? new AgentError("CLASSIFICATION_FAILED", 502);
}
