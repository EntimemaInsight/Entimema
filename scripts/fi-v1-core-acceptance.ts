import { writeFile } from "node:fs/promises";
import { loadEnvConfig } from "@next/env";
import {
  executeV1,
  CoreError,
  MODEL,
} from "../backend/financial-intelligence/v1/core";
import { goldDocument, assertGold } from "../tests/financial-intelligence/gold";

async function main() {
  // Optional existing env directory for isolated worktrees. Never print or copy credentials.
  loadEnvConfig(process.env.FI_ENV_DIR ?? process.cwd(), false, {
    info() {},
    error() {},
  });
  const evidencePath = "docs/financial-intelligence/SPRINT_01_ACCEPTANCE.json";
  let evidence: Record<string, unknown>;
  try {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      evidence = {
        status: "V1_CORE_ACCEPTANCE_BLOCKED_BY_PROVIDER_ACCESS",
        model: MODEL,
        aiCalls: 0,
        reason: "OPENAI_API_KEY unavailable",
      };
    } else {
      const result = await executeV1(await goldDocument());
      evidence = { status: "V1_CORE_ACCEPTANCE_FAILED", result };
      try {
        assertGold(result);
        if (
          result.timings.totalMs > 10000 ||
          result.timings.mechanicalReadMs >= 1000 ||
          result.timings.verificationMs + result.timings.calculationMs >= 1000
        )
          throw new Error("Latency target exceeded");
        evidence.status = "V1_CORE_ACCEPTANCE_PASS";
      } catch (error) {
        evidence.reason =
          error instanceof Error ? error.message : "Acceptance mismatch";
      }
    }
  } catch (error) {
    const safe = error instanceof CoreError ? error.error : undefined;
    const providerStatus =
      safe?.cause && typeof safe.cause === "object" && "status" in safe.cause
        ? Number(safe.cause.status)
        : 0;
    const blocked =
      providerStatus === 401 ||
      providerStatus === 403 ||
      safe?.code === "MODEL_SERVICE_UNAVAILABLE" ||
      safe?.code === "OPENAI_RATE_LIMIT";
    evidence = {
      status: blocked
        ? "V1_CORE_ACCEPTANCE_BLOCKED_BY_PROVIDER_ACCESS"
        : "V1_CORE_ACCEPTANCE_FAILED",
      model: MODEL,
      aiCalls: error instanceof CoreError ? error.aiCalls : 0,
      timings: error instanceof CoreError ? error.timings : null,
      reason: safe?.code ?? "Acceptance execution failed",
      providerStatus: providerStatus || null,
    };
  }
  await writeFile(evidencePath, JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify(evidence, null, 2));
  if (evidence.status !== "V1_CORE_ACCEPTANCE_PASS") process.exitCode = 1;
}
void main();
