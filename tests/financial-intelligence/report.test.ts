import assert from "node:assert/strict";
import test from "node:test";
import * as XLSX from "xlsx";
import pdfParse from "pdf-parse";
import { AgentError } from "../../backend/lib/errors";
import { createReportHandler } from "../../backend/api/financial-intelligence/persisted-http";
import { analyzeValidatedIncomeStatement } from "../../backend/financial-intelligence/analysis";
import type { FinancialRunRepository, PersistEvent, RunListItem } from "../../backend/financial-intelligence/persistence/contracts";
import { FinancialRunService } from "../../backend/financial-intelligence/persistence/service";
import { createFinancialReportPayload, hashFinancialReportPayload, renderFinancialReportPdf, safeReportFilename } from "../../backend/financial-intelligence/report";
import { runFinancialIntelligence, withFinancialRunIntegrity } from "../../backend/financial-intelligence/run";
import type { FinancialRun } from "../../backend/financial-intelligence/schema";

class MemoryRepository implements FinancialRunRepository {
  rows = new Map<string, { owner: string; run: FinancialRun }>();
  async create(owner: string, run: FinancialRun) { this.rows.set(run.runId, { owner, run: structuredClone(run) }); return structuredClone(run); }
  async list(_owner: string): Promise<RunListItem[]> { return []; }
  async get(owner: string, id: string) { const row = this.rows.get(id); return row?.owner === owner ? structuredClone(row.run) : null; }
  async update(_owner: string, run: FinancialRun, _expected: number, _event: PersistEvent) { return structuredClone(run); }
}

async function validatedFixture() {
  const ws = XLSX.utils.aoa_to_sheet([
    ["Income Statement", "Jan 2025", "Feb 2025", "FY 2025"],
    ["Currency: USD; thousands"],
    ["Revenue", 100, 120, 220],
    ["Cost of Sales", 40, 42, 82],
    ["Gross Profit", 60, 78, 138],
    ["Operating Profit", 30, 48, 78],
    ["Net Income", 20, null, 56],
  ]);
  const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, ws, "Income Statement");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const run = await runFinancialIntelligence({ fileName: "CFO / income?.xlsx", extension: ".xlsx", mimeType: "application/octet-stream", size: buffer.length, buffer });
  run.status = "validated";
  run.readiness = { status: "validated", blockers: [], reviewReasons: [], gates: Object.fromEntries(Object.keys(run.readiness.gates).map((key) => [key, true])) };
  run.reviewTasks = run.reviewTasks.map((task) => ({ ...task, state: "resolved" }));
  run.controls = run.controls.map((control) => ({ ...control, status: control.status === "failed" ? "passed" : control.status, material: false, reviewRequired: false }));
  run.validationSummary = { ...run.validationSummary, failed: 0, materialFailures: 0 };
  run.revision = 3; run.validatedAt = "2026-09-03T09:00:00.000Z";
  withFinancialRunIntegrity(run);
  return run;
}

test("fixed structured payload has deterministic hash and preserves missing values", async () => {
  const run = await validatedFixture();
  const analysis = analyzeValidatedIncomeStatement(run, "2026-09-03T10:00:00.000Z");
  const first = createFinancialReportPayload(run, analysis, "2026-09-03T10:00:00.000Z");
  const second = createFinancialReportPayload(run, analysis, "2026-09-03T10:00:00.000Z");
  assert.equal(first.payloadHash, second.payloadHash);
  assert.equal(first.payloadHash, hashFinancialReportPayload(first.payload));
  assert.match(first.payloadHash, /^[a-f0-9]{64}$/);
  assert.equal(first.payload.performance.find((row) => row.periodLabel === "Feb 2025")?.metrics.some((metric) => metric.key === "net_income"), false);
  assert.equal(first.payload.executiveMetrics.find((metric) => metric.key === "gross_margin")?.value, 0.65);
  assert.equal(first.payload.identity.currency, "USD");
  assert.equal(first.payload.identity.unitScale, 1000);
});

test("automatically validated persisted runs use their creation time as validation time", async () => {
  const run = await validatedFixture();
  run.createdAt = "2026-09-03T08:59:00.000Z";
  run.validatedAt = null;
  withFinancialRunIntegrity(run);
  const analysis = analyzeValidatedIncomeStatement(run, "2026-09-03T10:00:00.000Z");
  const report = createFinancialReportPayload(run, analysis, "2026-09-03T10:00:00.000Z");
  assert.equal(report.payload.validatedAt, run.createdAt);
});

test("PDF includes traceable report sections, values, lineage, and safe attachment name", async () => {
  const run = await validatedFixture();
  const report = createFinancialReportPayload(run, analyzeValidatedIncomeStatement(run, "2026-09-03T10:00:00.000Z"), "2026-09-03T10:00:00.000Z");
  const bytes = renderFinancialReportPdf(report);
  const parsed = await pdfParse(bytes);
  assert.ok(bytes.subarray(0, 5).equals(Buffer.from("%PDF-")));
  assert.match(parsed.text, /FINANCIAL INTELLIGENCE REPORT/);
  assert.match(parsed.text, /Income Statement/);
  assert.match(parsed.text, /Feb 2025/);
  assert.match(parsed.text, /Gross Margin\s+65\.0%/);
  assert.match(parsed.text, /USD; scale 1,000/);
  assert.match(parsed.text, /Material movements/i);
  assert.match(parsed.text, /HYPOTHESIS/);
  assert.match(parsed.text, /LIMITATION/);
  assert.match(parsed.text, /Evidence appendix/i);
  assert.match(parsed.text, /[A-Z]+[0-9]+/);
  assert.match(parsed.text, new RegExp(run.runId));
  assert.match(parsed.text, /Revision: 3/);
  assert.match(parsed.text, new RegExp(report.payloadHash));
  assert.equal(safeReportFilename(run.source.filename), "CFO-income-entimema-report.pdf");
  assert.ok(parsed.numpages > 1);
});

test("report endpoint authenticates, owner-scopes, ignores request payload identity, and returns PDF", async () => {
  const run = await validatedFixture(); const repository = new MemoryRepository(); await repository.create("owner", run);
  const service = new FinancialRunService(repository);
  const context = { params: Promise.resolve({ runId: run.runId }) };
  const unauthenticated = createReportHandler({ authorize: async () => { throw new AgentError("AUTHENTICATION_REQUIRED", 401); }, service });
  assert.equal((await unauthenticated(new Request("http://test/report"), context)).status, 401);
  const foreign = createReportHandler({ authorize: async () => ({ actorId: "foreign" }), service });
  assert.equal((await foreign(new Request("http://test/report"), context)).status, 404);
  const owner = createReportHandler({ authorize: async () => ({ actorId: "owner" }), service });
  const response = await owner(new Request("http://test/report", { headers: { "x-owner-id": "foreign" } }), context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/pdf");
  assert.match(response.headers.get("content-disposition") ?? "", /^attachment; filename="[a-zA-Z0-9_-]+\.pdf"$/);
  assert.match(response.headers.get("cache-control") ?? "", /no-store/);
});

test("report generation blocks unvalidated, archived, invalid-integrity, open-review, and failed-material-control runs", async () => {
  const base = await validatedFixture();
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
