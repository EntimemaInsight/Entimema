import OpenAI from "openai";
import { AgentError } from "./errors";

type ResponseBody = OpenAI.Responses.ResponseCreateParamsNonStreaming;
type ResponseResult = OpenAI.Responses.Response;
export type OpenAITransport = (body: ResponseBody, signal: AbortSignal) => Promise<ResponseResult>;

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
  if (error instanceof OpenAI.APIConnectionTimeoutError || name === "AbortError" || name === "TimeoutError") return new AgentError("OPENAI_TIMEOUT", 504, undefined, error);
  if (error instanceof OpenAI.RateLimitError || status === 429) return new AgentError("OPENAI_RATE_LIMIT", 429, undefined, error);
  if (status >= 500 || error instanceof OpenAI.APIConnectionError) return new AgentError("MODEL_SERVICE_UNAVAILABLE", 503, undefined, error);
  return new AgentError("CLASSIFICATION_FAILED", 502, undefined, error);
}

const transient = (error: AgentError) => ["OPENAI_TIMEOUT", "OPENAI_RATE_LIMIT", "MODEL_SERVICE_UNAVAILABLE"].includes(error.code);

export async function createResponse(body: ResponseBody, injectedTransport?: OpenAITransport) {
  const config = getDocumentClassifierConfig();
  const transport = injectedTransport ?? ((payload, signal) => {
    const client = new OpenAI({ apiKey: config.apiKey, maxRetries: 0 });
    return client.responses.create(payload, { signal }) as Promise<ResponseResult>;
  });
  let last: AgentError | undefined;
  for (let attempt = 1; attempt <= config.attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    try { return await transport(body, controller.signal); }
    catch (error) { last = mapOpenAIError(error); if (!transient(last) || attempt === config.attempts) throw last; }
    finally { clearTimeout(timeout); }
  }
  throw last ?? new AgentError("CLASSIFICATION_FAILED", 502);
}
