import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { executeV1 } from "../../backend/financial-intelligence/v1/core";
import { modelStatementSchema } from "../../backend/financial-intelligence/v1/contract";
import { calculate } from "../../backend/financial-intelligence/v1/calculate";
import { firstAnalysis } from "../../backend/financial-intelligence/v1/observations";
import { inspectFileBuffer } from "../../backend/lib/files";
import { goldDocument, goldModelStatement, goldStatement } from "./gold";
import type { OpenAITransport } from "../../backend/lib/openai";

test("non-canonical EPS and presentation lines survive complete extraction without changing KPIs; OCI stays excluded", async () => {
  const original = await goldDocument();
  const workbook = XLSX.read(original.buffer, { type: "buffer" });
  const sheet = workbook.Sheets["P&L"];
  XLSX.utils.sheet_add_aoa(
    sheet,
    [
      ["Basic earnings per share", 1.2, 0.8],
      ["Diluted earnings per share", 1.1, 0.7],
      ["Entity-specific presentation amount", 17, 12],
    ],
    { origin: "A14" },
  );
  XLSX.utils.sheet_add_aoa(
    sheet,
    [["Other Comprehensive Income"], ["Actuarial OCI", 2, 3]],
    { origin: "A18" },
  );
  const doc = inspectFileBuffer(
    "complete.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }),
  );
  const model = goldModelStatement();
  for (const [row, label] of [
    [14, "Basic earnings per share"],
    [15, "Diluted earnings per share"],
    [16, "Entity-specific presentation amount"],
    [19, "Actuarial OCI"],
  ] as const) {
    model.lines.push({
      sourceRow: row,
      label,
      concept: null,
      aggregationRole: "detail",
      values: [
        { period: "2025", sourceRef: `'P&L'!B${row}` },
        { period: "2024", sourceRef: `'P&L'!C${row}` },
      ],
    });
  }
  let calls = 0;
  const result = await executeV1(doc, {
    apiKey: "test",
    transport: async (body) => {
      calls++;
      assert.match(
        String(body.instructions),
        /Complete statement extraction is primary/,
      );
      assert.match(
        String(body.instructions),
        /Canonical mapping is optional per line/,
      );
      return {
        status: "completed",
        output_text: JSON.stringify(model),
      } as Awaited<ReturnType<OpenAITransport>>;
    },
  });
  assert.equal(calls, 1);
  assert.equal(result.lines.length, 12);
  assert.equal(result.verification.verifiedValues, 24);
  for (const row of [14, 15, 16]) {
    const line = result.lines.find((l) => l.sourceRow === row)!;
    assert.ok(line);
    assert.equal(line.concept, null);
    assert.equal(line.aggregationRole, "detail");
  }
  assert.deepEqual(
    result.lines.find((l) => l.sourceRow === 14)?.values.map((v) => v.value),
    [1.2, 0.8],
  );
  assert.ok(!result.lines.some((l) => l.sourceRow === 19));
  const baseline = goldStatement();
  assert.deepEqual(
    result.kpis,
    firstAnalysis(baseline, calculate(baseline)).kpis,
  );
});

test("line contract requires hierarchy role but permits null canonical concept", () => {
  const model = goldModelStatement();
  model.lines[0].concept = null;
  assert.ok(modelStatementSchema.safeParse(model).success);
  const missing = JSON.parse(JSON.stringify(model));
  delete missing.lines[0].aggregationRole;
  assert.equal(modelStatementSchema.safeParse(missing).success, false);
  const invalid = JSON.parse(JSON.stringify(model));
  invalid.lines[0].aggregationRole = "KPI-only";
  assert.equal(modelStatementSchema.safeParse(invalid).success, false);
});
