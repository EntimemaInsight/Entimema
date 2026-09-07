import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { inspectFileBuffer } from "../../backend/lib/files";
import { readMechanically } from "../../backend/financial-intelligence/v1/reader";
import { bindSourceValues } from "../../backend/financial-intelligence/v1/bind";
import { verifyStatement } from "../../backend/financial-intelligence/v1/verify";
import { normalizeIncomeStatement } from "../../backend/financial-intelligence/v1/semantics";
import { calculate } from "../../backend/financial-intelligence/v1/calculate";
import { executeV1 } from "../../backend/financial-intelligence/v1/core";
import type { ModelStatement } from "../../backend/financial-intelligence/v1/contract";
import type { OpenAITransport } from "../../backend/lib/openai";

// Synthetic UK-style structure: cover, merged report caption, summary tiles,
// relative-period headers, blank columns, cached formulas and accounting formats.
function fixture(sheetName = "Example Accounts", offset = 0) {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    book,
    XLSX.utils.aoa_to_sheet([["Template instructions"]]),
    "Cover",
  );
  const sheet: XLSX.WorkSheet = {};
  const put = (column: string, row: number, value: string | number) => {
    sheet[`${column}${row + offset}`] = {
      t: typeof value === "number" ? "n" : "s",
      v: value,
    };
  };
  put("B", 2, "Profit and Loss Statement");
  put("C", 4, "Year ended 31 March 2025");
  put("B", 6, "TOTAL REVENUE");
  put("B", 7, 110);
  put("B", 9, "Description");
  put("D", 9, "Current Year £");
  put("F", 9, "Prior Year £");
  put("G", 9, "Variance £");
  const data = [
    ["Sales", 100, 80, "revenue"],
    ["Other income", 10, 20, null],
    ["Total Revenue", 110, 100, "revenue"],
    ["Gross profit", 50, 45, "gross_profit"],
    ["Operating Profit", -10, 5, "operating_profit"],
    ["Net profit", -12, 3, "net_income"],
  ] as const;
  const lines = data.map(([label, current, prior, concept], i) => {
    const row = 11 + i;
    put("B", row, label);
    put("D", row, current);
    put("F", row, prior);
    put("G", row, current - prior);
    sheet[`D${row + offset}`].z = '£#,##0;[Red](£#,##0);"-"';
    if (i === 2)
      sheet[`D${row + offset}`].f = `SUM(D${11 + offset}:D${12 + offset})`;
    return {
      sourceRow: row + offset,
      aggregationRole: "detail" as const,
      label,
      concept,
      values: [
        {
          period: "Current Year £",
          sourceRef: `${sheetName}!D${row + offset}`,
        },
        { period: "Prior Year £", sourceRef: `${sheetName}!F${row + offset}` },
      ],
    };
  });
  sheet["!ref"] = `B1:G${16 + offset}`;
  sheet["!merges"] = [
    { s: { r: 3 + offset, c: 2 }, e: { r: 3 + offset, c: 3 } },
  ];
  XLSX.utils.book_append_sheet(book, sheet, sheetName);
  const document = inspectFileBuffer(
    "synthetic.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    XLSX.write(book, { type: "buffer", bookType: "xlsx" }),
  );
  const model: ModelStatement = {
    statementType: "income_statement",
    entity: null,
    currency: "GBP",
    scale: "units",
    periods: ["Year ended 31 March 2025"],
    lines,
  };
  return { document, model };
}

test("UK structure completes the same core with one request, exact source values and aggregate KPIs", async () => {
  for (const [name, offset] of [
    ["Example Accounts", 0],
    ["Owner's Statement", 17],
  ] as const) {
    const { document, model } = fixture(name, offset);
    const before = JSON.stringify(model);
    let calls = 0;
    const result = await executeV1(document, {
      apiKey: "test",
      transport: async () => {
        calls++;
        return {
          status: "completed",
          output_text: JSON.stringify(model),
        } as Awaited<ReturnType<OpenAITransport>>;
      },
    });
    assert.equal(calls, 1);
    assert.equal(result.aiCalls, 1);
    assert.deepEqual(result.periods, ["Current Year £", "Prior Year £"]);
    assert.equal(result.verification.verifiedValues, 12);
    assert.equal(result.lines.length, 6);
    assert.equal(result.lines[0].concept, null);
    assert.equal(result.lines[2].concept, "revenue");
    assert.equal(result.lines[4].values[0].value, -10);
    assert.equal(result.kpis.length, 6);
    assert.equal(result.kpis[0].value, 45.45);
    assert.equal(JSON.stringify(model), before);
  }
});

test("reference normalization rejects missing sheets, ranges, external refs, missing cells and duplicate aliases", async () => {
  const { document, model } = fixture();
  const source = await readMechanically(document);
  for (const ref of [
    "D11",
    "Missing!D11",
    "Example Accounts!D999",
    "Example Accounts!D11:F11",
    "[Other.xlsx]Example Accounts!D11",
  ]) {
    const input = structuredClone(model);
    input.lines[0].values[0].sourceRef = ref;
    assert.throws(() => bindSourceValues(input, source));
  }
  const duplicate = bindSourceValues(model, source);
  duplicate.lines[0].values.push({ ...duplicate.lines[0].values[0] });
  assert.throws(() => verifyStatement(duplicate, source));
  const invented = bindSourceValues(model, source);
  invented.lines[0].values[0].value = 123456;
  assert.throws(() => verifyStatement(invented, source));
});

test("period repair requires literal report caption and exact same-row column headers", async () => {
  const { document, model } = fixture();
  const source = await readMechanically(document);
  for (const mutate of [
    (m: ModelStatement) => {
      m.periods = ["2025"];
    },
    (m: ModelStatement) => {
      m.periods = ["Year ended 31 March 2026"];
    },
    (m: ModelStatement) => {
      m.lines[0].values[0].period = "Prior Year £";
    },
    (m: ModelStatement) => {
      m.lines[0].values[0].sourceRef = "Example Accounts!G11";
    },
    (m: ModelStatement) => {
      m.lines[0].values[0].period = "Invented period";
    },
  ]) {
    const m = structuredClone(model);
    mutate(m);
    assert.throws(() => verifyStatement(bindSourceValues(m, source), source));
  }
});

test("ambiguous revenue totals keep ratios unavailable; component values and labels never change", async () => {
  const { document, model } = fixture();
  const source = await readMechanically(document);
  const bound = bindSourceValues(model, source);
  verifyStatement(bound, source);
  const before = JSON.stringify(bound);
  const out = normalizeIncomeStatement(bound, source).statement;
  assert.equal(JSON.stringify(bound), before);
  assert.deepEqual(
    out.lines.map((l) => [l.label, l.values]),
    bound.lines.map((l) => [l.label, l.values]),
  );
  const ambiguous = structuredClone(bound);
  ambiguous.lines[2].label = "Revenue";
  assert.equal(
    calculate(normalizeIncomeStatement(ambiguous, source).statement).length,
    0,
  );
});
import { normalizeMetadata } from "../../backend/financial-intelligence/v1/metadata";

test("pound symbol requires source sterling context and rejects conflicting or unsupported currency", async () => {
  const { document, model } = fixture();
  const source = await readMechanically(document);
  const cell = [...source.cells.values()].find((c) => c.sheet === "Cover")!;
  const input = { ...model, currency: "£" };
  assert.throws(() => normalizeMetadata(input, source));
  for (const context of [
    "UK limited companies",
    "United Kingdom accounts",
    "Currency: GBP",
    "Pounds sterling",
  ]) {
    cell.displayed = context;
    assert.equal(normalizeMetadata(input, source).currency, "GBP");
  }
  for (const context of [
    "UK accounts in USD",
    "UK accounts in EUR",
    "Egyptian pounds",
    "UK accounts in $",
    "UK accounts in Egyptian pounds",
  ]) {
    cell.displayed = context;
    assert.throws(() => normalizeMetadata(input, source));
  }
  cell.displayed = "UK accounts";
  assert.throws(() => normalizeMetadata({ ...input, currency: "$" }, source));
  assert.throws(() => normalizeMetadata(input));
});

test("horizontal summary tiles cannot masquerade as a two-period revenue row", async () => {
  const { document, model } = fixture();
  const source = await readMechanically(document);
  const input = structuredClone(model);
  input.lines.unshift({
    sourceRow: 7,
    aggregationRole: "detail" as const,
    label: "TOTAL REVENUE",
    concept: "revenue",
    values: [{ period: "Current Year £", sourceRef: "Example Accounts!B7" }],
  });
  assert.throws(
    () => verifyStatement(bindSourceValues(input, source), source),
    (error: unknown) =>
      error instanceof Error &&
      "diagnostics" in error &&
      (error.diagnostics as { validationFailureCode: string })
        .validationFailureCode === "SOURCE_LABEL_MISMATCH",
  );
});
