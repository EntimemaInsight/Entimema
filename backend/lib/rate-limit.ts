import { AgentError } from "./errors";

export type ExecutionRateLimiter = { consume(actorId: string): Promise<void> };
const positiveInt = (value: string | undefined, fallback: number) => { const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback; };

/** Best-effort, per-process protection only. Vercel instances do not share this state. */
export function createInMemoryExecutionRateLimiter(): ExecutionRateLimiter {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  return { async consume(actorId) {
    const now = Date.now();
    const limit = positiveInt(process.env.DOCUMENT_CLASSIFIER_RATE_LIMIT_MAX, 20);
    const windowMs = positiveInt(process.env.DOCUMENT_CLASSIFIER_RATE_LIMIT_WINDOW_MS, 60_000);
    const current = buckets.get(actorId);
    const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
    bucket.count += 1; buckets.set(actorId, bucket);
    if (bucket.count > limit) throw new AgentError("EXECUTION_RATE_LIMIT", 429);
  } };
}

export const executionRateLimiter = createInMemoryExecutionRateLimiter();
