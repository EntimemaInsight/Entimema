import OpenAI from "openai";
import { AgentError } from "./errors";
export const getDocumentClassifierModel = () => process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL?.trim() || "gpt-5.6-terra";
const positiveInt = (value: string | undefined, fallback: number) => { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback; };
function mapError(error: unknown) {
  if (error instanceof AgentError) return error;
  if (error instanceof OpenAI.APIConnectionTimeoutError || (error instanceof Error && error.name === "AbortError")) return new AgentError("OPENAI_TIMEOUT", 504, undefined, error);
  if (error instanceof OpenAI.RateLimitError) return new AgentError("OPENAI_RATE_LIMIT", 429, undefined, error);
  return new AgentError("CLASSIFICATION_FAILED", 502, undefined, error);
}
const transient = (error: AgentError) => error.code === "OPENAI_TIMEOUT" || error.code === "OPENAI_RATE_LIMIT" || (error.cause instanceof OpenAI.APIError && (error.cause.status ?? 0) >= 500);
export async function createResponse(body: OpenAI.Responses.ResponseCreateParamsNonStreaming) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new AgentError("CLASSIFICATION_FAILED", 503, "The classifier service is not configured.");
  const client = new OpenAI({ apiKey, maxRetries: 0 });
  const attempts = Math.min(2, positiveInt(process.env.OPENAI_DOCUMENT_CLASSIFIER_MAX_ATTEMPTS, 2));
  let last: AgentError | undefined;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), positiveInt(process.env.OPENAI_DOCUMENT_CLASSIFIER_TIMEOUT_MS, 45_000));
    try { return await client.responses.create(body, { signal: controller.signal }); }
    catch (error) { last = mapError(error); if (!transient(last) || attempt === attempts) throw last; }
    finally { clearTimeout(timeout); }
  }
  throw last ?? new AgentError("CLASSIFICATION_FAILED", 502);
}
