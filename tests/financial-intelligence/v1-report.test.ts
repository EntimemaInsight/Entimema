import assert from "node:assert/strict";
import test from "node:test";
import pdfParse from "pdf-parse";
import {
  createReportModel,
  generateFinancialReport,
  parseReportResult,
  reportFilename,
  reportKpi,
} from "../../backend/reports/financial-intelligence-report";
import { resultFixtures } from "./result-fixtures";

const fixtures = resultFixtures();

for (const [name, result] of Object.entries(fixtures)) {
  test(`${name} report is a lossless projection of the successful result`, async () => {
    const parsed = parseReportResult(structuredClone(result));
    const report = createReportModel(parsed);
    assert.equal(report.executiveSummary, result.analysis.executiveSummary);
    assert.deepEqual(report.kpis, result.analysis.kpis);
    assert.deepEqual(report.findings, result.analysis.findings.slice(0, 5));
    assert.deepEqual(report.lines, result.lines);
    assert.equal(report.entity, result.entity);
    assert.deepEqual(report.periods, result.periods);
    assert.equal(report.currency, result.currency);
    assert.equal(report.scale, result.scale);

    const buffer = generateFinancialReport(parsed, new Date("2026-09-08T00:00:00Z"));
    assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
    const parsedPdf = await pdfParse(buffer);
    const extracted = parsedPdf.text;
    assert.match(buffer.toString("latin1"), /\/MediaBox \[0 0 595\.28 841\.89\]/);
    assert.ok(parsedPdf.numpages >= 2, `${name}: expected a multi-page report`);
    if (name === "rieter") assert.match(extracted, /VERIFIED INCOME STATEMENT \(CONTINUED\)/);
    assert.match(extracted, /Entimema Financial Intelligence/i);
    const normalized = extracted.replace(/\s+/g, " ");
    assert.ok(normalized.includes(result.analysis.executiveSummary.replace(/\s+/g, " ")));
    for (const finding of result.analysis.findings.slice(0, 5)) {
      assert.ok(normalized.includes(finding.title));
      assert.ok(normalized.includes(finding.statement.replace(/\s+/g, " ")));
    }
    for (const line of result.lines) {
      assert.ok(extracted.includes(line.label));
      for (const value of line.values) {
        const absolute = Math.abs(value.value).toLocaleString("en", { maximumFractionDigits: 6 });
        assert.ok(extracted.includes(absolute), `${name}: missing ${line.label} ${value.period} ${absolute}`);
      }
    }
    assert.doesNotMatch(extracted, /gpt-|sourceRef|aiCalls|mechanicalReadMs|Sheet .*cell/i);
    assert.doesNotMatch(extracted, /NaN|Infinity|undefined/);
  });
}

test("Rieter sign changes and unavailable KPI states reuse approved presentation", () => {
  const signChanges = fixtures.rieter.analysis.kpis.filter((k) => k.status === "sign_change");
  assert.equal(signChanges.length, 2);
  assert.ok(signChanges.every((k) => reportKpi(k) === "Positive to negative"));
  const unavailable = fixtures.missing.analysis.kpis.filter((k) => k.status === "unavailable");
  assert.ok(unavailable.length > 0);
  assert.ok(unavailable.every((k) => reportKpi(k) === "Unavailable"));
});

test("filename is bounded and safely sanitized", () => {
  const unsafe = structuredClone(fixtures.controlled);
  unsafe.entity = "../../Board & Finance / Zürich";
  assert.equal(reportFilename(unsafe), "Entimema_Financial_Intelligence_Board_Finance_Zurich_2025.pdf");
});

test("invalid and non-finite presentation payloads are rejected", () => {
  assert.throws(() => parseReportResult({}), /invalid/i);
  const invalid = structuredClone(fixtures.controlled);
  invalid.analysis.kpis[0].currentValue = Number.NaN;
  assert.throws(() => parseReportResult(invalid), /invalid/i);
});
