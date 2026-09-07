import { ValidationFailure } from "../backend/financial-intelligence/v1/diagnostics";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { writeFile, readFile } from "node:fs/promises";
import { loadEnvConfig } from "@next/env";
import OpenAI from "openai";
import {
  executeV1,
  CoreError,
  AI_TIMEOUT_MS,
} from "../backend/financial-intelligence/v1/core";
import type { OpenAITransport } from "../backend/lib/openai";
import { assertGold, goldDocument } from "../tests/financial-intelligence/gold";

const sha = (value: string) => createHash("sha256").update(value).digest("hex");
async function main() {
  loadEnvConfig(process.env.FI_ENV_DIR ?? process.cwd(), false, {
    info() {},
    error() {},
  });
  if (!process.env.OPENAI_API_KEY?.trim())
    throw new Error("OPENAI_API_KEY unavailable");
  const baseline = JSON.parse(
    await readFile(
      "docs/financial-intelligence/SPRINT_01_ACCEPTANCE.json",
      "utf8",
    ),
  );
  const diagnostic = process.argv.includes("--diagnose-nano");
  const candidates = diagnostic
    ? ["gpt-4.1-nano"]
    : ["gpt-5.6-luna", "gpt-5.6-terra", "gpt-4.1-nano"];
  const records: Record<string, unknown>[] = [];
  const originalModel = process.env.FI_V1_MODEL;
  let invariant: string | undefined;
  try {
    for (const model of candidates) {
      process.env.FI_V1_MODEL = model;
      const record: Record<string, unknown> = {
        model,
        reasoning: model.startsWith("gpt-5.6-")
          ? "none"
          : "not supported (omitted)",
        providerHttpStatus: null,
        actualModel: null,
        inputTokens: null,
        outputTokens: null,
        partialResponseObserved: false,
        responseStatus: null,
        aiCalls: 0,
        acceptance: "V1_CORE_ACCEPTANCE_FAILED",
        timeoutMs: AI_TIMEOUT_MS,
      };
      const transport: OpenAITransport = async (body, signal) => {
        record.aiCalls = Number(record.aiCalls) + 1;
        const source = String(body.input),
          prompt = String(body.instructions),
          schema = JSON.stringify(body.text?.format);
        record.documentChars = source.length;
        record.promptChars = prompt.length;
        record.schemaChars = schema.length;
        record.requestInputChars =
          source.length + prompt.length + schema.length;
        record.estimatedInputTokens = Math.ceil(
          Number(record.requestInputChars) / 4,
        );
        const hash = sha(
          JSON.stringify([
            source,
            prompt,
            schema,
            body.max_output_tokens,
            body.store,
          ]),
        );
        record.invariantHash = hash;
        if (invariant === undefined) invariant = hash;
        assert.equal(
          hash,
          invariant,
          "Prompt/source/schema changed between candidates",
        );
        assert.equal(body.model, model);
        assert.equal(
          body.reasoning?.effort ?? null,
          model.startsWith("gpt-5.6-") ? "none" : null,
        );
        // Identical SDK configuration to the shared production transport. Capture only benchmark metadata.
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          maxRetries: 0,
        });
        try {
          const { data, response } = await client.responses
            .create(body, { signal })
            .withResponse();
          record.providerHttpStatus = response.status;
          record.actualModel = data.model;
          record.inputTokens = data.usage?.input_tokens ?? null;
          record.outputTokens = data.usage?.output_tokens ?? null;
          record.responseStatus = data.status;
          record.partialResponseObserved =
            data.status !== "completed" && Boolean(data.output_text);

          return data;
        } catch (error) {
          if (error instanceof OpenAI.APIError) {
            record.providerHttpStatus = error.status ?? null;
            record.providerErrorCode = error.code ?? null;
            record.providerErrorType = error.type ?? null;
            record.providerErrorParam = error.param ?? null;
          }
          throw error;
        }
      };
      try {
        const result = await executeV1(await goldDocument(), { transport });
        record.result = result;
        record.timings = result.timings;
        assertGold(result);
        assert.ok(result.timings.totalMs <= 10000, "Total exceeds 10 seconds");
        assert.ok(
          result.timings.mechanicalReadMs < 1000,
          "Mechanical read exceeds 1 second",
        );
        assert.ok(
          result.timings.verificationMs + result.timings.calculationMs < 1000,
          "Verification/calculation exceeds 1 second",
        );
        record.acceptance = "V1_CORE_ACCEPTANCE_PASS";
      } catch (error) {
        if (error instanceof CoreError) {
          record.timings = error.timings;
          record.failure = error.error.code;
          if (error.error instanceof ValidationFailure)
            record.validation = error.error.diagnostics;
          record.failureBoundary =
            error.error.code === "OPENAI_TIMEOUT" ||
            Number(record.providerHttpStatus) >= 400
              ? "provider_request"
              : "contract_or_source_verification";
          record.timedOut = error.error.code === "OPENAI_TIMEOUT";
        } else {
          record.failure =
            error instanceof Error
              ? error.message
              : "Benchmark assertion failed";
          record.failureBoundary = "gold_acceptance";
        }
      }

      records.push(record);
      console.log(JSON.stringify(record, null, 2));
    }
  } finally {
    if (originalModel === undefined) delete process.env.FI_V1_MODEL;
    else process.env.FI_V1_MODEL = originalModel;
  }
  await writeFile(
    diagnostic
      ? "docs/financial-intelligence/SPRINT_01_1_NANO_DIAGNOSTIC.json"
      : "docs/financial-intelligence/SPRINT_01_1_BENCHMARK.json",
    JSON.stringify(
      { date: new Date().toISOString(), baseline, records },
      null,
      2,
    ) + "\n",
  );
  if (
    !records.some((record) => record.acceptance === "V1_CORE_ACCEPTANCE_PASS")
  )
    process.exitCode = 1;
}
void main().catch(() => {
  console.error("Benchmark could not run; no credentials displayed.");
  process.exitCode = 1;
});
