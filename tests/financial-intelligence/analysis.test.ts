import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import { analyzeValidatedIncomeStatement } from "../../backend/financial-intelligence/analysis";
import { runFinancialIntelligence } from "../../backend/financial-intelligence/run";

async function fixture() {
  const ws = XLSX.utils.aoa_to_sheet([
    ["Income Statement", "Jan 2025", "Feb 2025"],
    ["Currency: USD; units"],
    ["Revenue", 100, 120],
    ["Cost of Sales", 40, 42],
    ["Gross Profit", 60, 78],
    ["Operating Profit", 30, 48],
    ["Net Income", 20, 36],
  ]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Income Statement");
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return runFinancialIntelligence({
    fileName: "analysis.xlsx",
    extension: ".xlsx",
    mimeType: "application/octet-stream",
    size: buffer.length,
    buffer,
  });
}

test("analysis is impossible before authoritative validation", async () => {
  const run = await fixture();
  assert.throws(
    () => analyzeValidatedIncomeStatement(run),
    /ANALYSIS_REQUIRES_VALIDATED_RUN/,
  );
});

test("validated analysis calculates traceable margins and material variances", async () => {
  const run = await fixture();
  run.status = "validated";
  run.readiness = {
    status: "validated",
    blockers: [],
    reviewReasons: [],
    gates: {
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
    },
  };
  const analysis = analyzeValidatedIncomeStatement(
    run,
    "2026-09-03T00:00:00.000Z",
  );
  assert.equal(analysis.status, "analysis_ready");
  assert.equal(analysis.revision, 1);
  assert.equal(
    analysis.metrics.find(
      (x) => x.key === "gross_margin" && x.periodLabel === "Feb 2025",
    )?.value,
    0.65,
  );
  const revenueVariance = analysis.variances.find(
    (x) => x.metric === "revenue",
  );
  assert.equal(revenueVariance?.absolute, 20);
  assert.equal(revenueVariance?.percentage, 0.2);
  assert.equal(revenueVariance?.material, true);
  assert.ok(revenueVariance?.evidenceIds.length === 2);
  assert.ok(
    analysis.findings.some(
      (x) => x.classification === "hypothesis" && x.kind === "limitation",
    ),
  );
  assert.match(analysis.integrityHash, /^[a-f0-9]{64}$/);
});
