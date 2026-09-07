import { readFile, writeFile } from "node:fs/promises";
import { loadEnvConfig } from "@next/env";
import OpenAI from "openai";
import {
  executeV1,
  CoreError,
} from "../backend/financial-intelligence/v1/core";
import { getV1ModelConfig } from "../backend/financial-intelligence/v1/model";
import { ValidationFailure } from "../backend/financial-intelligence/v1/diagnostics";
import type { OpenAITransport } from "../backend/lib/openai";
import { goldDocument, assertGold } from "../tests/financial-intelligence/gold";

async function main() {
  loadEnvConfig(process.env.FI_ENV_DIR ?? process.cwd(), false, {
    info() {},
    error() {},
  });
  const controlled = process.env.FI_ACCEPTANCE_SESSION === "sprint-01.2";
  const historyPath =
    "docs/financial-intelligence/SPRINT_01_2_ACCEPTANCE_ATTEMPTS.json";
  const history: Record<string, unknown>[] = controlled
    ? await readFile(historyPath, "utf8")
        .then(JSON.parse)
        .catch(() => [])
    : [];
  if (history.length >= 3) {
    console.error(
      "Three controlled Sprint 01.2 attempts already recorded; no further request made.",
    );
    process.exitCode = 1;
    return;
  }
  const evidence: Record<string, unknown> = {
    date: new Date().toISOString(),
    attempt: history.length + 1,
    status: "V1_CORE_ACCEPTANCE_FAILED",
    model: getV1ModelConfig().model,
    providerHttpStatus: null,
    aiCalls: 0,
    inputTokens: null,
    outputTokens: null,
    partialResponseObserved: false,
    validation: null,
  };
  const transport: OpenAITransport = async (body, signal) => {
    evidence.aiCalls = Number(evidence.aiCalls) + 1;
    evidence.inputChars =
      String(body.input).length +
      String(body.instructions).length +
      JSON.stringify(body.text?.format).length;
    evidence.documentChars = String(body.input).length;
    evidence.promptChars = String(body.instructions).length;
    evidence.schemaChars = JSON.stringify(body.text?.format).length;
    evidence.estimatedInputTokens = Math.ceil(Number(evidence.inputChars) / 4);
    evidence.reasoning = body.reasoning?.effort ?? "omitted";
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0,
    });
    try {
      const { data, response } = await client.responses
        .create(body, { signal })
        .withResponse();
      evidence.providerHttpStatus = response.status;
      evidence.actualModel = data.model;
      evidence.inputTokens = data.usage?.input_tokens ?? null;
      evidence.outputTokens = data.usage?.output_tokens ?? null;
      evidence.partialResponseObserved =
        data.status !== "completed" && Boolean(data.output_text);
      return data;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        evidence.providerHttpStatus = error.status ?? null;
        evidence.providerErrorCode = error.code ?? null;
      }
      throw error;
    }
  };
  try {
    if (!process.env.OPENAI_API_KEY?.trim()) {
      evidence.status = "V1_CORE_ACCEPTANCE_BLOCKED_BY_PROVIDER_ACCESS";
      evidence.reason = "OPENAI_API_KEY unavailable";
    } else {
      const result = await executeV1(await goldDocument(), { transport });
      evidence.result = result;
      evidence.timings = result.timings;
      assertGold(result);
      // Correctness-first: latency is recorded, not an acceptance assertion.
      evidence.status = "V1_CORE_ACCEPTANCE_PASS";
    }
  } catch (error) {
    if (error instanceof CoreError) {
      evidence.timings = error.timings;
      evidence.reason = error.error.code;
      if (error.error instanceof ValidationFailure)
        evidence.validation = error.error.diagnostics;
      if (
        [401, 403, 429].includes(Number(evidence.providerHttpStatus)) ||
        error.error.code === "MODEL_SERVICE_UNAVAILABLE"
      )
        evidence.status = "V1_CORE_ACCEPTANCE_BLOCKED_BY_PROVIDER_ACCESS";
    } else
      evidence.reason =
        error instanceof Error ? error.message : "Acceptance assertion failed";
  }
  // Only verified gold results or privacy-safe structural failure diagnostics are retained.
  history.push(evidence);
  if (controlled)
    await writeFile(historyPath, JSON.stringify(history, null, 2) + "\n");
  await writeFile(
    "docs/financial-intelligence/SPRINT_01_ACCEPTANCE.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  console.log(JSON.stringify(evidence, null, 2));
  if (evidence.status !== "V1_CORE_ACCEPTANCE_PASS") process.exitCode = 1;
}
void main().catch(() => {
  console.error(
    "Acceptance setup failed; no customer data or credentials displayed.",
  );
  process.exitCode = 1;
});
