import assert from "node:assert/strict";
import test from "node:test";
import { analyzeValidatedIncomeStatement } from "../../backend/financial-intelligence/analysis";
import type { FinancialRun } from "../../backend/financial-intelligence/schema";
import { makeFinancialRunFixture } from "./fixtures/financial-run";

const gates = {
  statement: true,
  periods: true,
  materialPeriods: true,
  currency: true,
  scale: true,
  anchors: true,
  mapping: true,
  evidence: true,
  uniqueEvidence: true,
  controls: true,
  review: true,
  structure: true,
  coverage: true,
};

function fixture(validated = false): FinancialRun {
  const periods: FinancialRun["periods"] = [
    { id: "p-jan", originalHeader: "Jan 2025", label: "Jan 2025", type: "month", endDate: null, year: 2025, month: 1, quarter: null, designation: "actual", durationMonths: 1, sourceColumn: 2, confidence: 1, reviewRequired: false },
    { id: "p-feb", originalHeader: "Feb 2025", label: "Feb 2025", type: "month", endDate: null, year: 2025, month: 2, quarter: null, designation: "actual", durationMonths: 1, sourceColumn: 3, confidence: 1, reviewRequired: false },
  ];
  const rows = [
    ["revenue", "Revenue", 100, 120],
    ["gross_profit", "Gross Profit", 60, 78],
    ["operating_profit", "Operating Profit", 30, 48],
    ["net_income", "Net Income", 20, 36],
  ] as const;
  const values: FinancialRun["values"] = [];
  const evidence: FinancialRun["evidence"] = [];
  rows.forEach(([concept, label, jan, feb], rowIndex) => {
    [["p-jan", jan, "B"], ["p-feb", feb, "C"]] .forEach(([periodId, amount, column]) => {
      const id = `ev-${concept}-${periodId}`;
      values.push({
        id: `value-${concept}-${periodId}`,
        sourceRowId: `row-${rowIndex + 3}`,
        sourceLabel: label,
        normalizedLabel: label.toLowerCase(),
        concept,
        lineType: concept === "gross_profit" || concept === "operating_profit" || concept === "net_income" ? "subtotal" : "component",
        originalValue: Number(amount),
        normalizedValue: Number(amount),
        sourceSign: "positive",
        canonicalSign: "positive",
        normalizationRule: "retained",
        periodId: String(periodId),
        currency: "USD",
        unitScale: 1,
        mappingMethod: "semantic",
        mappingConfidence: 1,
        mappingExplanation: "Source-verified AI fixture",
        reviewState: "accepted",
        evidenceId: id,
        section: "p_and_l",
      });
      evidence.push({ id, kind: "spreadsheet", source: "analysis.xlsx", locator: `Income Statement!${column}${rowIndex + 3}`, excerpt: `${label} | ${amount}` });
    });
  });
  return makeFinancialRunFixture({
    status: validated ? "validated" : "review_required",
    readiness: validated ? { status: "validated", blockers: [], reviewReasons: [], gates } : { status: "review_required", blockers: ["review_required"], reviewReasons: ["OTHER"], gates: {} },
    periods,
    values,
    evidence,
    controls: [],
    reviewTasks: [],
    currency: "USD",
    unitScale: 1,
    revision: 1,
  });
}

test("analysis is impossible before authoritative validation", () => {
  const run = fixture(false);
  assert.throws(() => analyzeValidatedIncomeStatement(run), /ANALYSIS_REQUIRES_VALIDATED_RUN/);
});

test("validated analysis calculates traceable margins and material variances", () => {
  const run = fixture(true);
  const analysis = analyzeValidatedIncomeStatement(run, "2026-09-03T00:00:00.000Z");
  assert.equal(analysis.status, "analysis_ready");
  assert.equal(analysis.revision, 1);
  assert.equal(analysis.metrics.find((x) => x.key === "gross_margin" && x.periodLabel === "Feb 2025")?.value, 0.65);
  const revenueVariance = analysis.variances.find((x) => x.metric === "revenue");
  assert.equal(revenueVariance?.absolute, 20);
  assert.equal(revenueVariance?.percentage, 0.2);
  assert.equal(revenueVariance?.material, true);
  assert.ok(revenueVariance?.evidenceIds.length === 2);
  assert.ok(analysis.findings.some((x) => x.classification === "hypothesis" && x.kind === "limitation"));
  assert.match(analysis.integrityHash, /^[a-f0-9]{64}$/);
});
