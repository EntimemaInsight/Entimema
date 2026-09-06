import { createHmac, timingSafeEqual } from "node:crypto";
import type { FinancialRun } from "./schema";

const integritySecret = () =>
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  "entimema-development-review-integrity";

function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? Object.fromEntries(
          Object.entries(item).sort(([a], [b]) => a.localeCompare(b)),
        )
      : item,
  );
}

function signRun(run: FinancialRun) {
  const { integrity, createdAt, updatedAt, validatedAt, auditEvents, ...payload } = run;
  void integrity;
  void createdAt;
  void updatedAt;
  void validatedAt;
  void auditEvents;
  return createHmac("sha256", integritySecret())
    .update(canonicalJson(payload))
    .digest("hex");
}

export function withFinancialRunIntegrity(run: FinancialRun) {
  run.integrity = signRun(run);
  return run;
}

export function hasValidIntegrity(run: FinancialRun) {
  const expected = signRun(run);
  const received = run.integrity ?? "";
  return (
    expected.length === received.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  );
}
