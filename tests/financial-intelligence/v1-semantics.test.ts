import assert from "node:assert/strict";
import test from "node:test";
import { normalizeIncomeStatement } from "../../backend/financial-intelligence/v1/semantics";
import { verifyStatement } from "../../backend/financial-intelligence/v1/verify";
import type { Statement } from "../../backend/financial-intelligence/v1/contract";
import type {
  Source,
  Cell,
} from "../../backend/financial-intelligence/v1/reader";

type Row = string | [string, string | null, number] | null;
function fixture(rows: Row[]) {
  const cells = new Map<string, Cell>();
  const lines: Statement["lines"] = [];
  const put = (row: number, column: number, raw: string | number) => {
    const ref = `'Statement'!${column === 1 ? "A" : "B"}${row}`;
    cells.set(ref, {
      ref,
      sheet: "Statement",
      row,
      column,
      raw,
      displayed: String(raw),
      numeric: typeof raw === "number" ? raw : null,
    });
    return ref;
  };
  put(1, 1, "Line");
  put(1, 2, "2025");
  rows.forEach((entry, i) => {
    const row = i + 2;
    if (entry === null) return;
    if (typeof entry === "string") {
      put(row, 1, entry);
      return;
    }
    const [label, concept, value] = entry;
    put(row, 1, label);
    const sourceRef = put(row, 2, value);
    lines.push({
      sourceRow: row,
      aggregationRole: "detail" as const,
      label,
      concept,
      values: [{ period: "2025", sourceRef, value }],
    });
  });
  const statement: Statement = {
    statementType: "income_statement",
    entity: null,
    currency: "EUR",
    scale: "units",
    periods: ["2025"],
    lines,
  };
  const source: Source = {
    cells,
    text: "full source retained",
    format: "spreadsheet",
  };
  verifyStatement(statement, source);
  return { statement, source };
}

test("plain P&L preserves valid hedge, actuarial, fair-value and tax rows without an OCI section", () => {
  const { statement, source } = fixture([
    "Income statement",
    ["Revenue", "revenue", 100],
    ["Actuarial pension expense", null, -5],
    ["Foreign currency translation gain", null, 2],
    ["Cash-flow hedge gain", null, 3],
    ["Fair-value gain", null, 4],
    ["Other comprehensive income", null, 1],
    ["Tax on OCI reclassification", null, -1],
    ["Net profit", "net_income", 104],
  ]);
  const before = JSON.stringify(statement),
    size = source.cells.size;
  const result = normalizeIncomeStatement(statement, source);
  assert.deepEqual(result.statement, statement);
  assert.equal(JSON.stringify(statement), before);
  assert.equal(source.cells.size, size);
  assert.equal(result.normalization.excludedRows.length, 0);
});

test("P&L followed by a separate comprehensive-income statement excludes only that section at arbitrary rows", () => {
  for (const padding of [0, 11]) {
    const { statement, source } = fixture([
      ...Array<Row>(padding).fill(null),
      "CONSOLIDATED INCOME STATEMENT",
      ["Sales", "revenue", 100],
      ["Operating result before interest and taxes (EBIT)", "EBIT", 20],
      ["Net profit", "net_income", 15],
      ["Basic earnings per share (CHF)", null, 0.5],
      null,
      "CONSOLIDATED STATEMENT OF COMPREHENSIVE INCOME",
      ["Net profit", "net_income_statement", 15],
      ["Remeasurement of defined benefit plans", null, -2],
      ["Currency translation differences", null, 1],
      ["Cash flow hedges", null, 3],
      ["Income taxes on cash flow hedges", null, -1],
      ["Total comprehensive income", null, 16],
    ]);
    const before = JSON.stringify(statement),
      size = source.cells.size;
    const result = normalizeIncomeStatement(statement, source);
    assert.equal(result.normalization.inputLineCount, 10);
    assert.equal(result.statement.lines.length, 4);
    assert.equal(result.normalization.excludedRows.length, 6);
    assert.deepEqual(
      result.statement.lines.map((l) => l.label),
      statement.lines.slice(0, 4).map((l) => l.label),
    );
    assert.equal(result.statement.lines[1].concept, "operating_profit");
    assert.equal(result.statement.lines[1].values, statement.lines[1].values);
    assert.equal(JSON.stringify(statement), before);
    assert.equal(source.cells.size, size);
    assert.equal(verifyStatement(result.statement, source), 4);
  }
});

test("combined comprehensive-income statement retains profit/loss and stops at explicit OCI heading", () => {
  for (const title of [
    "Statement of Comprehensive Income",
    "Statement of Profit or Loss and Other Comprehensive Income",
  ]) {
    for (const boundary of [
      "Other comprehensive income",
      ["Other comprehensive income", null, 4],
    ] as Row[]) {
      const { statement, source } = fixture([
        title,
        ["Revenue", "revenue", 100],
        ["Operating income", null, 20],
        ["Profit for the year", "net_income", 15],
        boundary,
        ["Actuarial gains", null, 3],
        ["Tax on OCI", null, -1],
        ["Total comprehensive income", null, 19],
      ]);
      const result = normalizeIncomeStatement(statement, source);
      assert.equal(result.statement.lines.length, 3);
      assert.equal(result.statement.lines[1].concept, "operating_profit");
      assert.equal(result.statement.lines[2].label, "Profit for the year");
    }
  }
});

test("explicit OCI/reconciliation headings govern exclusions, not individual financial labels", () => {
  for (const title of [
    "OCI",
    "Other Comprehensive Income",
    "Comprehensive Income reconciliation",
    "Comprehensive Income",
  ]) {
    const { statement, source } = fixture([
      "P&L",
      ["Cash flow hedge income", null, 5],
      ["Net profit", "net_income", 4],
      title,
      ["Fair value changes", null, 1],
      ["Total comprehensive income", null, 5],
    ]);
    const result = normalizeIncomeStatement(statement, source);
    assert.equal(result.statement.lines.length, 2);
    assert.equal(result.statement.lines[0].label, "Cash flow hedge income");
  }
});

test("operating-profit aliases change only concept, preserving labels and numeric values", () => {
  for (const alias of [
    "EBIT",
    "Operating Profit",
    "Operating Income",
    "Profit from Operations",
    "Earnings Before Interest and Taxes",
    "Operating result before interest and taxes (EBIT)",
  ]) {
    for (const asConcept of [false, true]) {
      const { statement, source } = fixture([
        "Income statement",
        [
          asConcept ? "Reported operating result" : alias,
          asConcept ? alias : null,
          28,
        ],
      ]);
      const result = normalizeIncomeStatement(statement, source);
      assert.equal(result.statement.lines[0].concept, "operating_profit");
      assert.equal(result.statement.lines[0].label, statement.lines[0].label);
      assert.equal(result.statement.lines[0].values, statement.lines[0].values);
      assert.equal(result.normalization.conceptMappings.length, 1);
    }
  }
  const { statement, source } = fixture([
    ["EBITDA", "ebitda", 30],
    ["Adjusted EBIT", "adjusted_ebit", 25],
    ["EBIT margin", "ebit_margin", 20],
  ]);
  assert.deepEqual(
    normalizeIncomeStatement(statement, source).statement,
    statement,
  );
});
