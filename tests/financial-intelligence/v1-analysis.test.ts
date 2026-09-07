import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { calculate } from "../../backend/financial-intelligence/v1/calculate";
import { firstAnalysis } from "../../backend/financial-intelligence/v1/observations";
import { executeV1 } from "../../backend/financial-intelligence/v1/core";
import type { Statement } from "../../backend/financial-intelligence/v1/contract";
import { inspectFileBuffer } from "../../backend/lib/files";
import { goldStatement } from "./gold";
import { rieterRows } from "./rieter";

function audit(statement: Statement) {
  const original = structuredClone(statement);
  const analysis = firstAnalysis(statement, calculate(statement)).analysis;
  assert.deepEqual(statement, original);
  assert.equal(
    new Set(analysis.kpis.map((k) => k.id)).size,
    analysis.kpis.length,
  );
  for (const kpi of analysis.kpis) {
    assert.ok(
      ["valid", "unavailable", "not_meaningful", "sign_change"].includes(
        kpi.status,
      ),
    );
    if (kpi.status !== "valid") assert.equal(kpi.value, undefined);
    for (const evidence of kpi.evidence) {
      const line = statement.lines.find((l) => l.concept === evidence.concept);
      assert.ok(
        line?.values.some(
          (v) =>
            v.sourceRef === evidence.sourceRef &&
            v.period === evidence.period &&
            v.value === evidence.value,
        ),
      );
    }
  }
  for (const finding of analysis.findings) {
    assert.ok(finding.evidence.kpiIds.length > 0);
    assert.ok(
      finding.evidence.kpiIds.every((id) =>
        analysis.kpis.some((k) => k.id === id),
      ),
    );
    assert.ok(
      finding.evidence.sourceConcepts.every((c) =>
        statement.lines.some((l) => l.concept === c),
      ),
    );
    assert.doesNotMatch(
      finding.statement,
      /because|caused by|supplier|demand|pricing|efficiency/i,
    );
  }
  assert.ok(analysis.findings.length >= 3 && analysis.findings.length <= 5);
  return analysis;
}
function current(statement: Statement, id: string) {
  return audit(statement).kpis.find((k) => k.id === id + ":2025")!;
}
test("profitable accepted fixture: all six formulas, evidence and bounded deterministic interpretation", () => {
  const s = goldStatement();
  for (const [id, expected] of [
    ["revenue_growth", 20],
    ["gross_margin", 40],
    ["operating_margin", 19.17],
    ["net_margin", 12.5],
    ["operating_profit_growth", 76.92],
    ["net_income_growth", 82.93],
  ] as const) {
    const k = current(s, id);
    assert.equal(k.status, "valid");
    assert.equal(k.value, expected);
  }
});
test("Rieter accepted rows: source values and EPS retained; profit-to-loss has no growth percentage", () => {
  const concepts: Record<number, string> = {
    5: "revenue",
    7: "gross_profit",
    13: "operating_profit",
    18: "net_income",
  };
  const s: Statement = {
    ...goldStatement(),
    periods: ["2024", "2025"],
    currency: "CHF",
    scale: "millions",
    lines: rieterRows.map(([sourceRow, label, a, b]) => ({
      sourceRow,
      label,
      concept: concepts[sourceRow] ?? null,
      aggregationRole: "total",
      values: [
        { period: "2024", sourceRef: `'P&L'!B${sourceRow}`, value: a },
        { period: "2025", sourceRef: `'P&L'!C${sourceRow}`, value: b },
      ],
    })),
  };
  for (const id of ["operating_profit_growth", "net_income_growth"]) {
    const k = current(s, id);
    assert.equal(k.status, "sign_change");
    if (k.status === "sign_change")
      assert.equal(k.direction, "positive_to_negative");
    assert.ok(k.currentValue! < 0 && k.priorValue! > 0);
  }
  assert.equal(current(s, "operating_margin").value, -6.41);
  assert.equal(current(s, "net_margin").value, -9.25);
  assert.equal(s.lines.length, 18);
  assert.equal(s.lines.flatMap((l) => l.values).length, 36);
  assert.equal(
    s.lines.filter((l) => l.label.includes("earnings per share")).length,
    2,
  );
});
test("missing and duplicate concepts are unavailable, never inferred", () => {
  const s = goldStatement();
  s.lines = s.lines.filter((l) => l.concept !== "gross_profit");
  assert.equal(current(s, "gross_margin").status, "unavailable");
  s.lines.push(structuredClone(s.lines[0]));
  assert.equal(current(s, "revenue_growth").status, "unavailable");
});
test("zero denominators and both sign-change directions are explicit", () => {
  const s = goldStatement();
  s.lines[0].values[1].value = 0;
  assert.equal(current(s, "revenue_growth").status, "not_meaningful");
  s.lines[0].values[0].value = 0;
  assert.equal(current(s, "gross_margin").status, "unavailable");
  s.lines[4].values[1].value = -130;
  const k = current(s, "operating_profit_growth");
  assert.equal(k.status, "sign_change");
  if (k.status === "sign_change")
    assert.equal(k.direction, "negative_to_positive");
});
test("negative-to-negative growth uses signed prior formula without an improvement claim", () => {
  const s = goldStatement();
  s.lines[4].values[0].value = -260;
  s.lines[4].values[1].value = -130;
  assert.equal(current(s, "operating_profit_growth").value, 100);
  assert.match(
    audit(s).findings.find((f) => f.title === "Operating profit growth")!
      .statement,
    /does not indicate improvement/,
  );
});
test("nonconsecutive/opaque periods do not fabricate a comparison; overflow fails safely", () => {
  const s = goldStatement();
  s.periods = ["2025"];
  assert.equal(current(s, "revenue_growth").status, "unavailable");
  s.lines[0].values[0].value = Number.MIN_VALUE;
  assert.equal(current(s, "gross_margin").status, "unavailable");
});
test("edge fixtures pass through unchanged binding/verification with one extraction request", async () => {
  for (const mutate of [
    () => {},
    (s: Statement) => {
      s.lines[4].values[0].value = -43.9;
    },
    (s: Statement) => {
      s.lines = s.lines.filter((l) => l.concept !== "gross_profit");
    },
    (s: Statement) => {
      s.lines[0].values[1].value = 0;
    },
    (s: Statement) => {
      s.lines[0].values[0].value = 0;
    },
  ]) {
    const s = goldStatement();
    mutate(s);
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Income Statement"],
      ["EUR thousands"],
      [],
      ["Line", "2025", "2024"],
    ]);
    for (const line of s.lines) {
      XLSX.utils.sheet_add_aoa(
        sheet,
        [[line.label, ...line.values.map((v) => v.value)]],
        { origin: line.sourceRow - 1 },
      );
    }
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "P&L");
    const doc = inspectFileBuffer(
      "analysis.xlsx",
      "application/octet-stream",
      XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }),
    );
    let calls = 0;
    const result = await executeV1(doc, {
      apiKey: "test-only",
      transport: async () => {
        calls++;
        return {
          status: "completed",
          output_text: JSON.stringify({
            ...s,
            lines: s.lines.map((l) => ({
              ...l,
              values: l.values.map(({ period, sourceRef }) => ({
                period,
                sourceRef,
              })),
            })),
          }),
        } as never;
      },
    });
    assert.equal(calls, 1);
    assert.equal(result.aiCalls, 1);
    assert.deepEqual(result.lines, s.lines);
    assert.equal(result.verification.verifiedValues, s.lines.length * 2);
    assert.deepEqual(result.analysis, audit(s));
  }
});
