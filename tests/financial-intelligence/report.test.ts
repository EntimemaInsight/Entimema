import assert from "node:assert/strict";
import test from "node:test";
import pdfParse from "pdf-parse";
import { AgentError } from "../../backend/lib/errors";
import { createReportHandler } from "../../backend/api/financial-intelligence/persisted-http";
import { analyzeValidatedIncomeStatement } from "../../backend/financial-intelligence/analysis";
import { withFinancialRunIntegrity } from "../../backend/financial-intelligence/integrity";
import type { FinancialRunRepository, PersistEvent, RunListItem } from "../../backend/financial-intelligence/persistence/contracts";
import { FinancialRunService } from "../../backend/financial-intelligence/persistence/service";
import { createFinancialReportPayload, hashFinancialReportPayload, renderFinancialReportPdf, safeReportFilename } from "../../backend/financial-intelligence/report";
import type { CanonicalConcept, FinancialRun } from "../../backend/financial-intelligence/schema";
import { makeFinancialRunFixture } from "./fixtures/financial-run";

class MemoryRepository implements FinancialRunRepository {
  rows = new Map<string, { owner: string; run: FinancialRun }>();
  async create(owner: string, run: FinancialRun) { this.rows.set(run.runId, { owner, run: structuredClone(run) }); return structuredClone(run); }
  async list(_owner: string): Promise<RunListItem[]> { return []; }
  async get(owner: string, id: string) { const row = this.rows.get(id); return row?.owner === owner ? structuredClone(row.run) : null; }
  async update(_owner: string, run: FinancialRun, _expected: number, _event: PersistEvent) { return structuredClone(run); }
}

const gates = { statement: true, periods: true, materialPeriods: true, currency: true, scale: true, anchors: true, mapping: true, evidence: true, uniqueEvidence: true, controls: true, review: true, structure: true, coverage: true };

function validatedFixture() {
  const periods: FinancialRun["periods"] = [
    { id: "p-jan", originalHeader: "Jan 2025", label: "Jan 2025", type: "month", endDate: null, year: 2025, month: 1, quarter: null, designation: "actual", durationMonths: 1, sourceColumn: 2, confidence: 1, reviewRequired: false },
    { id: "p-feb", originalHeader: "Feb 2025", label: "Feb 2025", type: "month", endDate: null, year: 2025, month: 2, quarter: null, designation: "actual", durationMonths: 1, sourceColumn: 3, confidence: 1, reviewRequired: false },
    { id: "p-fy", originalHeader: "FY 2025", label: "FY 2025", type: "annual_total", endDate: null, year: 2025, month: null, quarter: null, designation: "actual", durationMonths: 12, sourceColumn: 4, confidence: 1, reviewRequired: false },
  ];
  const rows: Array<[CanonicalConcept, string, Array<[string, number, string, number]>]> = [
    ["revenue", "Revenue", [["p-jan", 100, "B", 2], ["p-feb", 120, "C", 3], ["p-fy", 220, "D", 4]]],
    ["cost_of_sales", "Cost of Sales", [["p-jan", 40, "B", 2], ["p-feb", 42, "C", 3], ["p-fy", 82, "D", 4]]],
    ["gross_profit", "Gross Profit", [["p-jan", 60, "B", 2], ["p-feb", 78, "C", 3], ["p-fy", 138, "D", 4]]],
    ["operating_profit", "Operating Profit", [["p-jan", 30, "B", 2], ["p-feb", 48, "C", 3], ["p-fy", 78, "D", 4]]],
    ["net_income", "Net Income", [["p-jan", 20, "B", 2], ["p-fy", 56, "D", 4]]],
  ];
  const values: FinancialRun["values"] = [];
  const evidence: FinancialRun["evidence"] = [];
  rows.forEach(([concept, label, cells], rowIndex) => {
    cells.forEach(([periodId, amount, column, columnNumber]) => {
      const evidenceId = `ev-${concept}-${periodId}`;
      const rowNumber = rowIndex + 3;
      values.push({ id: `value-${concept}-${periodId}`, sourceRowId: `row-${rowNumber}`, sourceLabel: label, normalizedLabel: label.toLowerCase(), concept, lineType: ["gross_profit", "operating_profit", "net_income"].includes(concept) ? "subtotal" : "component", originalValue: amount, normalizedValue: amount, sourceSign: "positive", canonicalSign: "positive", normalizationRule: "retained", periodId, currency: "USD", unitScale: 1000, mappingMethod: "model-assisted", mappingConfidence: 1, mappingExplanation: "Source-verified AI fixture", reviewState: "accepted", evidenceId, section: "p_and_l" });
      evidence.push({ id: evidenceId, sourceFilename: "CFO / income?.xlsx", kind: "spreadsheet", sheetName: "Income Statement", cellAddress: `${column}${rowNumber}`, rowNumber, columnNumber, rawRowLabel: label, rawColumnHeader: periods.find((period) => period.id === periodId)?.label ?? periodId, rawCellValue: amount, structuralContext: "Income Statement", extractionMethod: "deterministic-structural-cell-reference" });
    });
  });
  return makeFinancialRunFixture({
    status: "validated",
    readiness: { status: "validated", blockers: [], reviewReasons: [], gates },
    validationSummary: { passed: 0, warnings: 0, failed: 0, notApplicable: 0, applicable: 0, expected: 0, coverage: 1, passRate: 1, materialFailures: 0 },
    source: { filename: "CFO / income?.xlsx", format: ".xlsx", selectedSection: "Income Statement", inventory: ["Income Statement"] },
    periods,
    values,
    evidence,
    controls: [],
    reviewTasks: [],
    currency: "USD",
    unitScale: 1000,
    revision: 3,
    validatedAt: "2026-09-03T09:00:00.000Z",
    metrics: { financialSourceRows: 5, canonicalMappedRows: 5, automaticallyMappedRows: 5, unresolvedPAndLRows: 0, excludedNonPAndLRows: 0, extractedValues: values.length, periods: periods.length, reviewTasks: 0, reviewTasksByReason: {}, acceptedSemanticMappings: 5, deterministicMappings: 0, vetoCounts: {}, mappingCoverage: 1 },
  });
}

test("fixed structured payload has deterministic hash and preserves missing values", () => {
  const run = validatedFixture();
  const analysis = analyzeValidatedIncomeStatement(run, "2026-09-03T10:00:00.000Z");
  const first = createFinancialReportPayload(run, analysis, "2026-09-03T10:00:00.000Z");
  const second = createFinancialReportPayload(run, analysis, "2026-09-03T10:00:00.000Z");
  assert.equal(first.payloadHash, second.payloadHash);
  assert.equal(first.payloadHash, hashFinancialReportPayload(first.payload));
  assert.match(first.payloadHash, /^[a-f0-9]{64}$/);
  assert.equal(first.payload.performance.find((row) => row.periodLabel === "Feb 2025")?.metrics.some((metric) => metric.key === "net_income"), false);
  assert.equal(first.payload.executiveMetrics.find((metric) => metric.key === "gross_margin")?.value, 138 / 220);
  assert.equal(first.payload.identity.currency, "USD");
  assert.equal(first.payload.identity.unitScale, 1000);
});

test("automatically validated persisted runs use their creation time as validation time", () => {
  const run = validatedFixture();
  run.createdAt = "2026-09-03T08:59:00.000Z";
  run.validatedAt = null;
  withFinancialRunIntegrity(run);
  const analysis = analyzeValidatedIncomeStatement(run, "2026-09-03T10:00:00.000Z");
  const report = createFinancialReportPayload(run, analysis, "2026-09-03T10:00:00.000Z");
  assert.equal(report.payload.validatedAt, run.createdAt);
});

test("client PDF includes traceable analysis without the technical evidence register", async () => {
  const run = validatedFixture();
  const report = createFinancialReportPayload(run, analyzeValidatedIncomeStatement(run, "2026-09-03T10:00:00.000Z"), "2026-09-03T10:00:00.000Z");
  const bytes = renderFinancialReportPdf(report);
  const parsed = await pdfParse(bytes);
  assert.ok(bytes.subarray(0, 5).equals(Buffer.from("%PDF-")));
  assert.match(parsed.text, /FINANCIAL INTELLIGENCE REPORT/);
  assert.match(parsed.text, /Income Statement/);
  assert.match(parsed.text, /Feb 2025/);
  assert.match(parsed.text, /USD; scale 1,000/);
  assert.match(parsed.text, /Material movements/i);
  assert.match(parsed.text, /HYPOTHESIS/);
  assert.match(parsed.text, /LIMITATION/);
  assert.match(parsed.text, /TRACEABILITY/);
  assert.match(parsed.text, /complete evidence register is\s+retained within the Entimema Financial Intelligence workflow/i);
  assert.doesNotMatch(parsed.text, /Evidence appendix/i);
  assert.doesNotMatch(parsed.text, /SOURCE CELL/);
  assert.doesNotMatch(parsed.text, /Payload SHA-256/);
  assert.match(parsed.text, new RegExp(run.runId));
  assert.match(parsed.text, /Revision: 3/);
  assert.equal(safeReportFilename(run.source.filename), "CFO-income-entimema-report.pdf");
  assert.ok(parsed.numpages > 1);
});

test("report endpoint authenticates, owner-scopes, ignores request payload identity, and returns PDF", async () => {
  const run = validatedFixture(); const repository = new MemoryRepository(); await repository.create("owner", run);
  const service = new FinancialRunService(repository);
  const context = { params: Promise.resolve({ runId: run.runId }) };
  const url = `http://test/report?${new URLSearchParams({ revision: String(run.revision), statement: run.source.selectedSection!, snapshot: run.integrity, schema: run.schemaVersion })}`;
  const unauthenticated = createReportHandler({ authorize: async () => { throw new AgentError("AUTHENTICATION_REQUIRED", 401); }, service });
  assert.equal((await unauthenticated(new Request("http://test/report"), context)).status, 401);
  const foreign = createReportHandler({ authorize: async () => ({ actorId: "foreign" }), service });
  assert.equal((await foreign(new Request(url), context)).status, 404);
  const owner = createReportHandler({ authorize: async () => ({ actorId: "owner" }), service });
  const response = await owner(new Request(url, { headers: { "x-owner-id": "foreign" } }), context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.match(response.headers.get("content-disposition") ?? "", /^attachment; filename="[a-zA-Z0-9_-]+\.pdf"$/);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
});

test("report endpoint rejects stale revision and snapshot identities", async () => {
  const run = validatedFixture(); const repository = new MemoryRepository(); await repository.create("owner", run); const service = new FinancialRunService(repository); const handler = createReportHandler({ authorize: async () => ({ actorId: "owner" }), service }); const context = { params: Promise.resolve({ runId: run.runId }) };
  for (const query of [{revision:String((run.revision??1)-1),statement:run.source.selectedSection!,snapshot:run.integrity,schema:run.schemaVersion},{revision:String(run.revision),statement:run.source.selectedSection!,snapshot:"another-run-snapshot",schema:run.schemaVersion}]) { const response=await handler(new Request(`http://test/report?${new URLSearchParams(query)}`),context); assert.equal(response.status,409); }
});

test("report generation blocks unvalidated, archived, invalid-integrity, open-review, and failed-material-control runs", async () => {
  const base = validatedFixture();
  const cases: Array<[string, (run: FinancialRun) => void, RegExp]> = [
    ["review", (run) => { run.status = "review_required"; run.readiness.status = "review_required"; withFinancialRunIntegrity(run); }, /ANALYSIS_REQUIRES_VALIDATED_RUN/],
    ["archived", (run) => { run.status = "archived"; withFinancialRunIntegrity(run); }, /ANALYSIS_REQUIRES_VALIDATED_RUN/],
    ["integrity", (run) => { run.values[0].normalizedValue += 1; }, /RUN_INTEGRITY_INVALID/],
    ["open task", (run) => { run.reviewTasks.push({ id: "open", issueType: "unsupported_structure", groupKey: "open", valueId: null, sourceRowId: null, sourceLabel: "Open", sourceValue: null, proposedConcept: null, confidence: 1, evidenceId: null, controlIds: [], recommendedAction: "Review", material: true, state: "open" }); withFinancialRunIntegrity(run); }, /REPORT_OPEN_MATERIAL_REVIEW/],
    ["failed control", (run) => { run.controls.push({ id: "material", formula: "test", inputs: [], expectedValue: 1, reportedValue: 2, difference: 1, tolerance: 0, status: "failed", affectedEvidence: [], reviewRequired: false, material: true }); withFinancialRunIntegrity(run); }, /REPORT_FAILED_MATERIAL_CONTROL/],
  ];
  for (const [name, mutate, expected] of cases) {
    const run = structuredClone(base); mutate(run); const repository = new MemoryRepository(); await repository.create("owner", run);
    await assert.rejects(() => new FinancialRunService(repository).report("owner", run.runId, "2026-09-03T10:00:00.000Z"), expected, name);
  }
});
