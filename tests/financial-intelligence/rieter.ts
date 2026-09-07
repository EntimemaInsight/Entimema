import assert from "node:assert/strict";
import type { Result } from "../../backend/financial-intelligence/v1/contract";
// Independently inspected first statement; EPS rows explicitly have CHF per-share units.
export const rieterRows = [
  [5, "Sales", 859.1, 685.1],
  [6, "Cost of sales", -595.7, -513.6],
  [7, "Gross profit", 263.4, 171.5],
  [8, "Research and development expenses", -50, -40.5],
  [9, "Selling, general, and administrative expenses", -203.4, -151.6],
  [10, "Other income", 35.8, 35.8],
  [11, "Share in profit of associated companies", 2.9, 0],
  [12, "Other expenses", -20.7, -59.1],
  [13, "Operating result before interest and taxes (EBIT)", 28, -43.9],
  [14, "Financial income", 2, 1.7],
  [15, "Financial expenses", -13.5, -21.4],
  [16, "(Loss) / profit before taxes", 16.5, -63.6],
  [17, "Income taxes", -6.1, 0.2],
  [18, "Net (loss) / profit", 10.4, -63.4],
  [19, "Attributable to shareholders of Rieter Holding Ltd.", 10.5, -63.3],
  [20, "Attributable to non-controlling interests", -0.1, -0.1],
  [22, "Basic earnings per share (CHF)", 1.42, -1.26],
  [23, "Diluted earnings per share (CHF)", 1.4, -1.26],
] as const;
export function assertRieter(result: Result) {
  assert.equal(result.model, "gpt-4.1-nano-2025-04-14");
  assert.equal(result.aiCalls, 1);
  assert.equal(result.statementType, "income_statement");
  assert.equal(result.currency, "CHF");
  assert.equal(result.scale, "millions");
  assert.deepEqual(result.periods, ["2024", "2025"]);
  assert.equal(
    result.lines.length,
    rieterRows.length,
    "Income statement must include all 18 reported rows, without comprehensive-income rows",
  );
  for (const [index, [row, label, a, b]] of rieterRows.entries()) {
    const line = result.lines[index];
    assert.equal(line.sourceRow, row);
    assert.equal(line.label, label);
    assert.deepEqual(
      line.values,
      [
        {
          period: "2024",
          sourceRef: `'Consolidated income statement'!B${row}`,
          value: a,
        },
        {
          period: "2025",
          sourceRef: `'Consolidated income statement'!C${row}`,
          value: b,
        },
      ],
      `Incorrect source binding for ${label}`,
    );
  }
  for (const [row, concept] of [
    [5, "revenue"],
    [7, "gross_profit"],
    [13, "operating_profit"],
    [18, "net_income"],
  ] as const)
    assert.equal(
      result.lines.find((l) => l.sourceRow === row)?.concept,
      concept,
    );
  assert.equal(result.verification.verifiedValues, 36);
  const pct = (a: number, b: number) => Math.round((a / b) * 10000) / 100;
  for (const [label, period, value] of [
    ["Gross margin", "2024", pct(263.4, 859.1)],
    ["Gross margin", "2025", pct(171.5, 685.1)],
    ["Operating margin", "2025", pct(-43.9, 685.1)],
    ["Net margin", "2025", pct(-63.4, 685.1)],
    ["Revenue growth", "2025", pct(685.1 - 859.1, 859.1)],
    ["Operating profit growth", "2025", pct(-43.9 - 28, 28)],
    ["Net income growth", "2025", pct(-63.4 - 10.4, 10.4)],
  ] as const)
    assert.equal(
      result.kpis.find((k) => k.label === label && k.period === period)?.value,
      value,
      `${label} ${period}`,
    );
  assert.ok(result.summary.length > 30);
  assert.ok(result.findings.length > 0);
  // Latency is informational, never an acceptance gate.
}
