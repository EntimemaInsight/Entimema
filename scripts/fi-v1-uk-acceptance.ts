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
import { readMechanically } from "../backend/financial-intelligence/v1/reader";
import { inspectFileBuffer } from "../backend/lib/files";
import type { ModelStatement } from "../backend/financial-intelligence/v1/contract";

async function main() {
  loadEnvConfig(process.env.FI_ENV_DIR ?? process.cwd(), false, {
    info() {},
    error() {},
  });
  const path = process.env.FI_UK_FILE;
  assert.ok(path, "FI_UK_FILE must identify the real UK workbook");
  const buffer = await readFile(path);
  const evidence: Record<string, unknown> = {
    date: new Date().toISOString(),
    status: "UK_PNL_REAL_FILE_ACCEPTANCE_FAILED",
    fileName: basename(path),
    fileBytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    aiCalls: 0,
  };
  let interpreted: ModelStatement | undefined;
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
    const result = await executeV1(doc, {
      transport: async (body, signal) => {
        evidence.aiCalls = Number(evidence.aiCalls) + 1;
        evidence.model = body.model;
        const { data, response } = await new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          maxRetries: 0,
        }).responses
          .create(body, { signal })
          .withResponse();
        evidence.providerHttpStatus = response.status;
        evidence.actualModel = data.model;
        interpreted = JSON.parse(data.output_text) as ModelStatement;
        // Minimal model output contains bindings, not financial values.
        evidence.interpretation = interpreted;
        return data;
      },
    });
    evidence.timings = result.timings;
    const source = await readMechanically(doc);
    // Independent oracle for this acceptance workbook only. Never used by production.
    const rows = [
      11, 12, 13, 16, 17, 18, 19, 21, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
      35, 36, 38, 41, 42, 43, 45, 46, 48,
    ];
    // Gross margin % is a supplementary ratio, not a monetary P&L line.
    if (result.lines.some((line) => line.sourceRow === 22)) rows.push(22);
    rows.sort((a, b) => a - b);
    const checks: { name: string; passed: boolean }[] = [];
    const check = (name: string, passed: boolean) =>
      checks.push({ name, passed });
    check("one provider call", result.aiCalls === 1 && evidence.aiCalls === 1);
    check("income statement", result.statementType === "income_statement");
    check("GBP units", result.currency === "GBP" && result.scale === "units");
    check(
      "literal relative periods",
      JSON.stringify(result.periods) ===
        JSON.stringify(["Current Year £", "Prior Year £"]),
    );
    check(
      "all 27 monetary rows and only optional source ratio",
      result.lines.length === rows.length &&
        rows.every((r) => result.lines.some((l) => l.sourceRow === r)),
    );
    check(
      "all returned values verified",
      result.verification.verifiedValues === rows.length * 2,
    );
    for (const row of rows) {
      const line = result.lines.find((l) => l.sourceRow === row);
      check(
        `row ${row} label`,
        line?.label === source.cells.get(`'P&L Statement'!B${row}`)?.displayed,
      );
      for (const [column, period] of [
        ["C", "Current Year £"],
        ["D", "Prior Year £"],
      ]) {
        const ref = `'P&L Statement'!${column}${row}`;
        const actual = line?.values.find((v) => v.period === period);
        check(
          ref,
          actual?.sourceRef === ref &&
            actual?.value === source.cells.get(ref)?.numeric,
        );
      }
    }
    const expected = [52.77, 1.09, -6.43, 54.73, 0.74, -7.19];
    check(
      "six applicable margin KPIs",
      result.kpis.length === 6 &&
        result.kpis.every((k, i) => k.value === expected[i]),
    );
    check(
      "usable result",
      result.summary.length > 0 && result.lines.length > 0,
    );
    evidence.audit = checks;
    evidence.result = {
      statementType: result.statementType,
      currency: result.currency,
      scale: result.scale,
      periods: result.periods,
      lines: result.lines.map((l) => ({
        ...l,
        values: l.values.map(({ period, sourceRef }) => ({
          period,
          sourceRef,
        })),
      })),
      verification: result.verification,
      kpis: result.kpis,
      summary: result.summary,
      findings: result.findings,
    };
    assert.ok(
      checks.every((c) => c.passed),
      "UK acceptance audit failed",
    );
    evidence.status = "UK_PNL_REAL_FILE_ACCEPTANCE_PASS";
  } catch (error) {
    if (error instanceof CoreError) {
      evidence.timings = error.timings;
      evidence.failureBoundary = error.error.code;
      if (error.error instanceof ValidationFailure)
        evidence.validation = error.error.diagnostics;
    } else
      evidence.failureBoundary =
        error instanceof Error ? error.message : "acceptance error";
  }
  await writeFile(
    "docs/financial-intelligence/UK_PNL_REAL_FILE_ACCEPTANCE.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      { ...evidence, interpretation: undefined, result: undefined },
      null,
      2,
    ),
  );
  if (evidence.status !== "UK_PNL_REAL_FILE_ACCEPTANCE_PASS")
    process.exitCode = 1;
}
void main().catch(() => {
  console.error("UK acceptance setup failed");
  process.exitCode = 1;
});
