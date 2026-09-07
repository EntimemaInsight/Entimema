import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { inspectFileBuffer } from "../../backend/lib/files";
import {
  readMechanically,
  sourceNumber,
} from "../../backend/financial-intelligence/v1/reader";
import { statementSchema } from "../../backend/financial-intelligence/v1/contract";
import { verifyStatement } from "../../backend/financial-intelligence/v1/verify";
import { calculate } from "../../backend/financial-intelligence/v1/calculate";
import {
  executeV1,
  CoreError,
  MODEL,
} from "../../backend/financial-intelligence/v1/core";
import type { OpenAITransport } from "../../backend/lib/openai";
import {
  goldDocument,
  goldStatement,
  goldModelStatement,
  assertGold,
} from "./gold";
const response = (data: unknown) =>
  ({ status: "completed", output_text: JSON.stringify(data) }) as Awaited<
    ReturnType<OpenAITransport>
  >;

test("gold XLSX mechanical read preserves all qualified references and raw values", async () => {
  const source = await readMechanically(await goldDocument());
  assert.equal(source.cells.size, 33);
  assert.equal(source.cells.get("'P&L'!B5")?.numeric, 1200);
  assert.match(source.text, /'P&L'!C13 \| 82/);
  assert.match(source.text, /Currency: EUR/);
  assert.equal(verifyStatement(goldStatement(), source), 18);
});
test("one real core call uses exactly one transport request, a minimal schema and no second analysis call", async () => {
  let calls = 0;
  const result = await executeV1(await goldDocument(), {
    apiKey: "test-only",
    transport: async (body) => {
      calls++;
      assert.equal(body.model, MODEL);
      assert.equal(body.store, false);
      assert.match(String(body.input), /'P&L'!B5/);
      assert.doesNotMatch(
        JSON.stringify(body),
        /ontology|canonicalConcept|selectedSheet|Finance Domain/,
      );
      assert.equal(body.tools, undefined);
      return response(goldModelStatement());
    },
  });
  assertGold(result);
  assert.equal(calls, 1);
  assert.ok(result.timings.verificationMs < 1000);
});
test("provider failure is never retried", async () => {
  let calls = 0;
  await assert.rejects(
    executeV1(await goldDocument(), {
      apiKey: "test-only",
      transport: async () => {
        calls++;
        throw Object.assign(new Error("unavailable"), { status: 503 });
      },
    }),
    CoreError,
  );
  assert.equal(calls, 1);
});
test("minimal contract rejects extra fields and non-finite values", () => {
  assert.equal(
    statementSchema.safeParse({ ...goldStatement(), workflow: [] }).success,
    false,
  );
  const statement = goldStatement();
  statement.lines[0].values[0].value = Infinity;
  assert.equal(statementSchema.safeParse(statement).success, false);
  assert.deepEqual(
    Object.keys(goldStatement()).sort(),
    ["statementType", "entity", "currency", "scale", "periods", "lines"].sort(),
  );
});
test("invented numbers, invented refs, altered labels, duplicate refs, rows and swapped periods fail closed", async () => {
  const source = await readMechanically(await goldDocument());
  const mutations = [
    (s: ReturnType<typeof goldStatement>) => {
      s.lines[0].values[0].value = 999999;
    },
    (s: ReturnType<typeof goldStatement>) => {
      s.lines[0].values[0].sourceRef = "'P&L'!Z999";
    },
    (s: ReturnType<typeof goldStatement>) => {
      s.lines[0].label = "Invented Revenue";
    },
    (s: ReturnType<typeof goldStatement>) => {
      s.lines[0].values.push({ ...s.lines[0].values[0] });
    },
    (s: ReturnType<typeof goldStatement>) => {
      s.lines.push(s.lines[0]);
    },
    (s: ReturnType<typeof goldStatement>) => {
      s.lines[0].values[0].period = "2024";
      s.lines[0].values[1].period = "2025";
    },
    (s: ReturnType<typeof goldStatement>) => {
      s.lines[0].sourceRow = 6;
    },
  ];
  for (const mutate of mutations) {
    const statement = goldStatement();
    mutate(statement);
    assert.throws(() => verifyStatement(statement, source));
  }
});
test("numeric claims in prose, truncated output and invalid JSON cannot be returned", async () => {
  for (const output of [
    response({ ...goldModelStatement(), summary: "Revenue was 999999." }),
    { ...response(goldModelStatement()), status: "incomplete" },
    { status: "completed", output_text: "invalid" },
  ]) {
    await assert.rejects(
      executeV1(await goldDocument(), {
        apiKey: "test-only",
        transport: async () => output as Awaited<ReturnType<OpenAITransport>>,
      }),
      CoreError,
    );
  }
});
test("arithmetic handles annual direction, absent concepts, zero denominators and losses", () => {
  const s = goldStatement();
  const kpis = calculate(s);
  assert.equal(
    kpis.find((k) => k.label === "Gross margin" && k.period === "2024")?.value,
    35,
  );
  assert.equal(
    kpis.find((k) => k.label === "Net margin" && k.period === "2024")?.value,
    8.2,
  );
  s.periods.reverse();
  assert.equal(
    calculate(s).find((k) => k.label === "Revenue growth")?.value,
    20,
  );
  s.lines[0].values[0].value = 0;
  assert.ok(
    !calculate(s).some(
      (k) => k.period === "2025" && k.label === "Gross margin",
    ),
  );
  s.lines[0].values[0].value = 1200;
  s.lines[8].values[0].value = -150;
  assert.equal(
    calculate(s).find((k) => k.label === "Net margin" && k.period === "2025")
      ?.value,
    -12.5,
  );
  s.lines[0].concept = null;
  assert.deepEqual(calculate(s), []);
});
test("CSV preserves primitive text; numeric parser never turns blanks, ambiguous text or percents into money", async () => {
  const source = await readMechanically(
    inspectFileBuffer(
      "pnl.csv",
      "text/csv",
      Buffer.from("Line,2025,2024\nRevenue,1200,1000\n"),
    ),
  );
  assert.equal(source.cells.get("'Sheet1'!B2")?.numeric, 1200);
  for (const value of ["", "-", "1,200", "20%", "EUR 123", true])
    assert.equal(sourceNumber(value), null);
  assert.equal(sourceNumber("(720)"), -720);
  assert.equal(sourceNumber("1,200.50"), 1200.5);
  assert.equal(sourceNumber("1.200,50"), 1200.5);
});
test("XLS and multiple arbitrary sheets are read without financial selection", async () => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([["Notes", 42]]),
    "Notes",
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([["Anything", 5]]),
    "O'Brien",
  );
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "biff8" });
  const source = await readMechanically(
    inspectFileBuffer("sample.xls", "application/vnd.ms-excel", buffer),
  );
  assert.equal(source.cells.get("'Notes'!B1")?.numeric, 42);
  assert.equal(source.cells.get("'O''Brien'!B1")?.numeric, 5);
});
test("unsupported file types, empty or corrupt files fail before AI", async () => {
  let calls = 0;
  const transport: OpenAITransport = async () => {
    calls++;
    return response(goldModelStatement());
  };
  await assert.rejects(
    executeV1(
      inspectFileBuffer("a.txt", "text/plain", Buffer.from("Income statement")),
      { apiKey: "test", transport },
    ),
  );
  assert.equal(calls, 0);
  assert.throws(() =>
    inspectFileBuffer(
      "a.xlsx",
      "application/octet-stream",
      Buffer.from("not zip"),
    ),
  );
});

function textPdf(lines: string[]): Buffer {
  const stream = `BT /F1 12 Tf 50 750 Td 18 TL ${lines.map((line, i) => `${i ? "T* " : ""}(${line.replace(/[\\()]/g, "\\$&")}) Tj`).join("\n")} ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const start = Buffer.byteLength(pdf);
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`;
  return Buffer.from(pdf);
}
test("text PDF has ordered page/line/token references and blank PDFs fail without OCR", async () => {
  const source = await readMechanically(
    inspectFileBuffer(
      "pnl.pdf",
      "application/pdf",
      textPdf(["Income Statement", "Line Item 2025 2024", "Revenue 1200 1000"]),
    ),
  );
  assert.equal(source.cells.get("p1:l3:t2")?.numeric, 1200);
  const s = goldStatement();
  s.lines = [
    {
      label: "Revenue",
      sourceRow: 3,
      aggregationRole: "detail" as const,
      concept: "revenue",
      values: [
        { period: "2025", sourceRef: "p1:l3:t2", value: 1200 },
        { period: "2024", sourceRef: "p1:l3:t3", value: 1000 },
      ],
    },
  ];
  assert.equal(verifyStatement(s, source), 2);
  await assert.rejects(
    readMechanically(
      inspectFileBuffer("scan.pdf", "application/pdf", textPdf([])),
    ),
  );
});
test("reader rejects row limits instead of silently truncating the source", async () => {
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.aoa_to_sheet([["Header"]]);
  sheet.A2005 = { t: "n", v: 42 };
  sheet["!ref"] = "A1:A2005";
  XLSX.utils.book_append_sheet(workbook, sheet, "Data");
  await assert.rejects(
    readMechanically(
      inspectFileBuffer(
        "large.xlsx",
        "application/octet-stream",
        XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }),
      ),
    ),
  );
});
