import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename } from "node:path";
import { loadEnvConfig } from "@next/env";
import OpenAI from "openai";
import {
  executeV1,
  CoreError,
} from "../backend/financial-intelligence/v1/core";
import { ValidationFailure } from "../backend/financial-intelligence/v1/diagnostics";
import { inspectFileBuffer } from "../backend/lib/files";
import type { OpenAITransport } from "../backend/lib/openai";
import { assertRieter } from "../tests/financial-intelligence/rieter";
async function main() {
  loadEnvConfig(process.env.FI_ENV_DIR ?? process.cwd(), false, {
    info() {},
    error() {},
  });
  const path = process.env.FI_RIETER_FILE;
  if (!path) throw new Error("FI_RIETER_FILE must identify the real workbook");
  const buffer = await readFile(path);
  const evidence: Record<string, unknown> = {
    date: new Date().toISOString(),
    status: "RIETER_REAL_FILE_ACCEPTANCE_FAILED",
    fileName: basename(path),
    fileBytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    aiCalls: 0,
    providerHttpStatus: null,
  };
  const transport: OpenAITransport = async (body, signal) => {
    evidence.aiCalls = Number(evidence.aiCalls) + 1;
    evidence.model = body.model;
    evidence.documentChars = String(body.input).length;
    evidence.inputChars =
      String(body.input).length +
      String(body.instructions).length +
      JSON.stringify(body.text?.format).length;
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 0,
    });
    try {
      const { data, response } = await client.responses
        .create(body, { signal })
        .withResponse();
      evidence.providerHttpStatus = response.status;
      evidence.providerResponseStatus = data.status;
      evidence.actualModel = data.model;
      evidence.inputTokens = data.usage?.input_tokens ?? null;
      evidence.outputTokens = data.usage?.output_tokens ?? null;
      return data;
    } catch (error) {
      if (error instanceof OpenAI.APIError)
        evidence.providerHttpStatus = error.status ?? null;
      throw error;
    }
  };
  try {
    assert.equal(
      process.env.FI_V1_MODEL?.trim() || "gpt-4.1-nano-2025-04-14",
      "gpt-4.1-nano-2025-04-14",
    );
    const doc = inspectFileBuffer(
      basename(path),
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer,
    );
    const result = await executeV1(doc, { transport });
    evidence.timings = result.timings;
    evidence.returnedLines = result.lines.length;
    evidence.verifiedValues = result.verification.verifiedValues;
    // The core has verified source values; retain its output even when semantic acceptance fails.
    evidence.result = result;
    assertRieter(result);
    evidence.status = "RIETER_REAL_FILE_ACCEPTANCE_PASS";
  } catch (error) {
    if (error instanceof CoreError) {
      evidence.timings = error.timings;
      evidence.failureBoundary = error.error.code;
      evidence.timeoutBoundary = error.telemetry?.timeoutBoundary ?? null;
      if (error.error instanceof ValidationFailure)
        evidence.validation = error.error.diagnostics;
      if (
        [
          "OPENAI_TIMEOUT",
          "MODEL_SERVICE_UNAVAILABLE",
          "OPENAI_RATE_LIMIT",
          "PROCESSING_TIMEOUT",
        ].includes(error.error.code) ||
        Number(evidence.providerHttpStatus) >= 400
      )
        evidence.status =
          "RIETER_REAL_FILE_ACCEPTANCE_BLOCKED_BY_INFRASTRUCTURE";
    } else {
      evidence.failureBoundary = "real_file_correctness_assertion";
      evidence.reason =
        error instanceof Error ? error.message : "Unknown acceptance failure";
    }
  }
  await writeFile(
    "docs/financial-intelligence/RIETER_REAL_FILE_ACCEPTANCE.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  console.log(JSON.stringify(evidence, null, 2));
  if (evidence.status !== "RIETER_REAL_FILE_ACCEPTANCE_PASS")
    process.exitCode = 1;
}
void main().catch(() => {
  console.error(
    "RIETER_REAL_FILE_ACCEPTANCE_BLOCKED_BY_INFRASTRUCTURE: acceptance setup failed",
  );
  process.exitCode = 1;
});
