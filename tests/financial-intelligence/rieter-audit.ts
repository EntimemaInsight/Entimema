import assert from "node:assert/strict";
import type { Result } from "../../backend/financial-intelligence/v1/contract";
import type { Source } from "../../backend/financial-intelligence/v1/reader";
import { rieterRows } from "./rieter";

/** Acceptance-only audit: continue every check after a failed field; never alter the result. */
export function auditRieter(result: Result, source: Source) {
  const checks: { check: string; passed: boolean; reason?: string }[] = [];
  const check = (name: string, run: () => void) => {
    try {
      run();
      checks.push({ check: name, passed: true });
    } catch (error) {
      checks.push({
        check: name,
        passed: false,
        reason: error instanceof Error ? error.message : "Check failed",
      });
    }
  };
  check("model and one request", () => {
    assert.equal(result.model, "gpt-4.1-nano-2025-04-14");
    assert.equal(result.aiCalls, 1);
  });
  check("statement type", () =>
    assert.equal(result.statementType, "income_statement"),
  );
  check("currency", () => assert.equal(result.currency, "CHF"));
  check("scale", () => assert.equal(result.scale, "millions"));
  check("periods", () => assert.deepEqual(result.periods, ["2024", "2025"]));
  check("exactly 18 income-statement lines", () =>
    assert.equal(result.lines.length, 18),
  );
  check("exactly 36 verified values", () =>
    assert.equal(result.verification.verifiedValues, 36),
  );
  for (const [row, label, a, b] of rieterRows) {
    check(`source row ${row}: label and both values`, () => {
      const matches = result.lines.filter((l) => l.sourceRow === row);
      assert.equal(matches.length, 1);
      const line = matches[0];
      assert.equal(line.label, label);
      assert.equal(line.values.length, 2);
      for (const [i, value] of line.values.entries()) {
        const ref = `'Consolidated income statement'!${i === 0 ? "B" : "C"}${row}`;
        assert.equal(value.period, i === 0 ? "2024" : "2025");
        assert.equal(value.sourceRef, ref);
        // Exact workbook number is authoritative, including saved formula floating-point precision.
        assert.equal(value.value, source.cells.get(ref)?.numeric);
        // Independently inspected displayed figures provide a second check, not a replacement number.
        assert.equal(Math.round(value.value * 100) / 100, i === 0 ? a : b);
      }
    });
  }
  for (const [row, concept] of [
    [5, "revenue"],
    [7, "gross_profit"],
    [13, "operating_profit"],
    [18, "net_income"],
  ] as const)
    check(`concept at row ${row}`, () =>
      assert.equal(
        result.lines.find((l) => l.sourceRow === row)?.concept,
        concept,
      ),
    );
  const pct = (a: number, b: number) => Math.round((a / b) * 10000) / 100;
  for (const [label, period, value] of [
    ["Gross margin", "2024", pct(263.4, 859.1)],
    ["Gross margin", "2025", pct(171.5, 685.1)],
    ["Operating margin", "2024", pct(28, 859.1)],
    ["Operating margin", "2025", pct(-43.9, 685.1)],
    ["Net margin", "2024", pct(10.4, 859.1)],
    ["Net margin", "2025", pct(-63.4, 685.1)],
    ["Revenue growth", "2025", pct(685.1 - 859.1, 859.1)],
    ["Operating profit growth", "2025", pct(-43.9 - 28, 28)],
    ["Net income growth", "2025", pct(-63.4 - 10.4, 10.4)],
  ] as const)
    check(`${label} ${period}`, () =>
      assert.equal(
        result.kpis.find((k) => k.label === label && k.period === period)
          ?.value,
        value,
      ),
    );
  check("customer-visible summary/findings", () => {
    assert.ok(result.summary.length > 30);
    assert.ok(result.findings.length > 0);
  });
  return { passed: checks.every((c) => c.passed), checks };
}
