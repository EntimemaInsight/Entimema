import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { basename } from "node:path";
import { loadEnvConfig } from "@next/env";
import OpenAI from "openai";
import * as XLSX from "xlsx";
import {
  executeV1,
  CoreError,
} from "../backend/financial-intelligence/v1/core";
import { ValidationFailure } from "../backend/financial-intelligence/v1/diagnostics";
import { readMechanically } from "../backend/financial-intelligence/v1/reader";
import { inspectFileBuffer } from "../backend/lib/files";

async function main() {
  loadEnvConfig(process.env.FI_ENV_DIR ?? process.cwd(), false, {
    info() {},
    error() {},
  });
  const path = process.env.FI_THIRD_FILE;
  assert.ok(path, "FI_THIRD_FILE required");
  const expectedModel = process.env.FI_ACCEPTANCE_MODEL;
  assert.ok(expectedModel);
  assert.equal(process.env.FI_V1_MODEL, expectedModel);
  const buffer = await readFile(path);
  const evidence: Record<string, unknown> = {
    date: new Date().toISOString(),
    status: "THIRD_XLSX_ACCEPTANCE_FAILED",
    fileName: basename(path),
    fileBytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
    aiCalls: 0,
  };
  try {
    const doc = inspectFileBuffer(
      basename(path),
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer,
    );
    const result = await executeV1(doc, {
      transport: async (body, signal) => {
        evidence.aiCalls = Number(evidence.aiCalls) + 1;
        evidence.model = body.model;
        assert.equal(body.model, expectedModel);
        evidence.promptContractSha256 = createHash("sha256")
          .update(
            JSON.stringify({
              instructions: body.instructions,
              text: body.text,
            }),
          )
          .digest("hex");
        const { data, response } = await new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          maxRetries: 0,
        }).responses
          .create(body, { signal })
          .withResponse();
        evidence.providerHttpStatus = response.status;
        evidence.actualModel = data.model;
        evidence.providerResponseStatus = data.status;
        evidence.incompleteDetails = data.incomplete_details;
        evidence.usage = data.usage;
        if (data.status === "completed")
          evidence.interpretation = JSON.parse(data.output_text);
        return data;
      },
    });
    evidence.timings = result.timings;
    const source = await readMechanically(doc);
    // Independent acceptance oracle for this unrelated workbook; not production mapping.
    const sheet = "Income statement Y";
    const ref = (column: number, row: number) =>
      `'${sheet}'!${XLSX.utils.encode_col(column - 1)}${row}`;
    const at = (column: number, row: number) =>
      source.cells.get(ref(column, row))!;
    const periods = Array.from(
      { length: 16 },
      (_, i) => at(i + 2, 2).displayed,
    );
    const checks: { name: string; passed: boolean }[] = [];
    const check = (name: string, passed: boolean) =>
      checks.push({ name, passed });
    check(
      "one request and model",
      result.aiCalls === 1 &&
        evidence.aiCalls === 1 &&
        result.model === expectedModel,
    );
    check("statement", result.statementType === "income_statement");
    check(
      "SEK millions",
      result.currency === "SEK" && result.scale === "millions",
    );
    check(
      "all 16 periods",
      JSON.stringify(result.periods) === JSON.stringify(periods),
    );
    check(
      "19 lines and 304 verified values",
      result.lines.length === 19 && result.verification.verifiedValues === 304,
    );
    for (let row = 3; row <= 21; row++) {
      const line = result.lines.find((l) => l.sourceRow === row);
      check(
        `row ${row} label and completeness`,
        line?.label === at(1, row).displayed && line?.values.length === 16,
      );
      for (let column = 2; column <= 17; column++) {
        const value = line?.values.find(
          (v) => v.period === periods[column - 2],
        );
        check(
          ref(column, row),
          value?.sourceRef === ref(column, row) &&
            value?.value === at(column, row).numeric,
        );
      }
    }
    for (const [row, concept] of [
      [3, "revenue"],
      [12, "operating_profit"],
      [19, "net_income"],
    ] as const)
      check(
        `canonical ${concept}`,
        result.lines.find((l) => l.sourceRow === row)?.concept === concept,
      );
    const expected: { label: string; period: string; value: number }[] = [];
    const add = (label: string, period: string, a: number, b: number) => {
      if (b > 0)
        expected.push({
          label,
          period,
          value: Math.round((a / b) * 10000) / 100,
        });
    };
    for (let column = 2; column <= 17; column++) {
      const period = periods[column - 2];
      const revenue = at(column, 3).numeric!;
      add("Operating margin", period, at(column, 12).numeric!, revenue);
      add("Net margin", period, at(column, 19).numeric!, revenue);
      if (column > 2)
        for (const [row, label] of [
          [3, "Revenue growth"],
          [12, "Operating profit growth"],
          [19, "Net income growth"],
        ] as const) {
          const prior = at(column - 1, row).numeric!;
          add(label, period, at(column, row).numeric! - prior, prior);
        }
    }
    check(
      "all applicable KPIs",
      result.kpis.length === expected.length &&
        expected.every((e) =>
          result.kpis.some(
            (k) =>
              k.label === e.label &&
              k.period === e.period &&
              k.value === e.value,
          ),
        ),
    );
    check(
      "usable result",
      result.summary.length > 0 && result.findings.length > 0,
    );
    evidence.audit = checks;
    evidence.result = {
      statementType: result.statementType,
      currency: result.currency,
      scale: result.scale,
      periods: result.periods,
      lineCount: result.lines.length,
      verification: result.verification,
      kpis: result.kpis,
      summary: result.summary,
    };
    assert.ok(
      checks.every((c) => c.passed),
      "third workbook audit failed",
    );
    evidence.status = "THIRD_XLSX_ACCEPTANCE_PASS";
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
    process.env.FI_ACCEPTANCE_OUTPUT ??
      "docs/financial-intelligence/SPRINT_01_6_THIRD.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  console.log(
    JSON.stringify(
      { ...evidence, interpretation: undefined, result: undefined },
      null,
      2,
    ),
  );
  if (evidence.status !== "THIRD_XLSX_ACCEPTANCE_PASS") process.exitCode = 1;
}
void main().catch(() => {
  console.error("Third acceptance setup failed");
  process.exitCode = 1;
});
