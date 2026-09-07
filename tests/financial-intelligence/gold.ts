import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inspectFileBuffer } from "../../backend/lib/files";
import type {
  ModelStatement,
  Statement,
  Result,
} from "../../backend/financial-intelligence/v1/contract";
export const expectedRows = [
  ["Revenue", 1200, 1000, "revenue"],
  ["Cost of Sales", -720, -650, "cost_of_sales"],
  ["Gross Profit", 480, 350, "gross_profit"],
  ["Operating Expenses", -250, -220, "operating_expenses"],
  ["Operating Profit", 230, 130, "operating_profit"],
  ["Finance Costs", -30, -20, "finance_costs"],
  ["Profit Before Tax", 200, 110, "profit_before_tax"],
  ["Income Tax", -50, -28, "income_tax"],
  ["Net Income", 150, 82, "net_income"],
] as const;
export async function goldDocument() {
  return inspectFileBuffer(
    "minimal-income-statement.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    await readFile(
      "tests/fixtures/financial-intelligence/minimal-income-statement.xlsx",
    ),
  );
}
export function goldStatement(): Statement {
  return {
    statementType: "income_statement",
    entity: null,
    currency: "EUR",
    scale: "thousands",
    periods: ["2025", "2024"],
    lines: expectedRows.map(([label, a, b, concept], i) => ({
      sourceRow: i + 5,
      label,
      concept,
      values: [
        { period: "2025", sourceRef: `'P&L'!B${i + 5}`, value: a },
        { period: "2024", sourceRef: `'P&L'!C${i + 5}`, value: b },
      ],
    })),
  };
}
export function assertGold(result: Result) {
  assert.equal(result.statementType, "income_statement");
  assert.equal(result.currency, "EUR");
  assert.equal(result.scale, "thousands");
  assert.deepEqual(result.periods, ["2025", "2024"]);
  assert.equal(result.lines.length, 9);
  for (const [label, a, b] of expectedRows) {
    const line = result.lines.find((line) => line.label === label);
    assert.ok(line, `Missing ${label}`);
    assert.deepEqual(
      line.values.map((value) => [value.period, value.value]),
      [
        ["2025", a],
        ["2024", b],
      ],
      label,
    );
  }
  assert.equal(result.verification.verifiedValues, 18);
  assert.equal(result.aiCalls, 1);
  assert.ok(result.summary.length > 30);
  assert.ok(result.findings.some((f) => f.length > 30));
  const kpi = (label: string, period: string) =>
    result.kpis.find((kpi) => kpi.label === label && kpi.period === period)
      ?.value;
  assert.equal(kpi("Revenue growth", "2025"), 20);
  assert.equal(kpi("Gross margin", "2025"), 40);
  assert.equal(kpi("Operating margin", "2025"), 19.17);
  assert.equal(kpi("Net margin", "2025"), 12.5);
  assert.equal(kpi("Operating profit growth", "2025"), 76.92);
  assert.equal(kpi("Net income growth", "2025"), 82.93);
}

export function goldModelStatement(): ModelStatement {
  const statement = goldStatement();
  return {
    ...statement,
    lines: statement.lines.map((line) => ({
      ...line,
      values: line.values.map(({ period, sourceRef }) => ({
        period,
        sourceRef,
      })),
    })),
  };
}
