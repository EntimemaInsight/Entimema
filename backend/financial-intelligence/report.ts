import { createHash } from "node:crypto";
import type { FinancialAnalysis } from "./analysis";
import type { Evidence, FinancialRun } from "./schema";

export const FINANCIAL_REPORT_SCHEMA_VERSION = "financial-report.v1" as const;

type ReportMetric = FinancialAnalysis["metrics"][number] & { formatted: string };
export type FinancialReportPayload = {
  schemaVersion: typeof FINANCIAL_REPORT_SCHEMA_VERSION;
  runId: string;
  revision: number;
  analysisVersion: string;
  generatedAt: string;
  validatedAt: string;
  validatedSnapshotIntegrityReference: string;
  identity: {
    filename: string;
    statement: string;
    currency: string;
    unitScale: number;
    periodCoverage: string;
    status: "VALIDATED";
  };
  executivePeriodId: string;
  executiveMetrics: ReportMetric[];
  performance: Array<{ periodId: string; periodLabel: string; metrics: ReportMetric[] }>;
  materialMovements: Array<FinancialAnalysis["variances"][number] & { fromPeriod: string; toPeriod: string }>;
  findings: FinancialAnalysis["findings"];
  limitations: string[];
  controls: {
    applicable: number;
    passed: number;
    failed: number;
    notApplicable: number;
    coverage: number;
    validationStatus: "VALIDATED";
    openMaterialReviewTasks: number;
  };
  evidence: Evidence[];
};

export type HashedFinancialReport = {
  payload: FinancialReportPayload;
  payloadHash: string;
};

const canonicalJson = (value: unknown): string =>
  JSON.stringify(value, (_key, item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
      : item,
  );

export const hashFinancialReportPayload = (payload: FinancialReportPayload) =>
  createHash("sha256").update(canonicalJson(payload)).digest("hex");

const formattedMetric = (metric: FinancialAnalysis["metrics"][number], currency: string, scale: number): ReportMetric => ({
  ...metric,
  formatted: metric.unit === "ratio"
    ? `${(metric.value * 100).toFixed(1)}%`
    : formatAmount(metric.value, currency, scale),
});

export function formatAmount(value: number | null, currency: string, scale: number) {
  if (value === null) return "—";
  const absolute = new Intl.NumberFormat("en", { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(Math.abs(value));
  return `${value < 0 ? `(${absolute})` : absolute} ${currency}${scale === 1 ? "" : ` x ${scale.toLocaleString("en")}`}`;
}

export function createFinancialReportPayload(
  run: FinancialRun,
  analysis: FinancialAnalysis,
  generatedAt = new Date().toISOString(),
): HashedFinancialReport {
  const openMaterialReviewTasks = run.reviewTasks.filter((task) => task.material && task.state === "open").length;
  const failedMaterialControls = run.controls.filter((control) => control.material && control.status === "failed").length;
  if (run.status === "archived") throw new Error("REPORT_ARCHIVED");
  if (run.status !== "validated" || run.readiness.status !== "validated") throw new Error("REPORT_REQUIRES_VALIDATION");
  if (openMaterialReviewTasks) throw new Error("REPORT_OPEN_MATERIAL_REVIEW");
  if (failedMaterialControls) throw new Error("REPORT_FAILED_MATERIAL_CONTROL");
  if (!run.currency || !run.unitScale || !run.validatedAt) throw new Error("REPORT_REQUIRES_VALIDATION");

  const executivePeriod = run.periods.findLast((period) => period.type === "annual_total") ?? run.periods.at(-1);
  if (!executivePeriod) throw new Error("REPORT_REQUIRES_VALIDATION");
  const referencedEvidence = new Set<string>();
  const includeEvidence = (ids: string[]) => ids.forEach((id) => referencedEvidence.add(id));
  const metricFor = (periodId: string) => analysis.metrics
    .filter((metric) => metric.periodId === periodId)
    .map((metric) => {
      includeEvidence(metric.evidenceIds);
      return formattedMetric(metric, run.currency!, run.unitScale!);
    });
  const performance = run.periods.map((period) => ({ periodId: period.id, periodLabel: period.label, metrics: metricFor(period.id) }));
  const materialMovements = analysis.variances.filter((variance) => variance.material).slice(0, 10).map((variance) => {
    includeEvidence(variance.evidenceIds);
    return {
      ...variance,
      fromPeriod: run.periods.find((period) => period.id === variance.fromPeriodId)?.label ?? variance.fromPeriodId,
      toPeriod: run.periods.find((period) => period.id === variance.toPeriodId)?.label ?? variance.toPeriodId,
    };
  });
  analysis.findings.forEach((finding) => includeEvidence(finding.evidenceIds));
  const payload: FinancialReportPayload = {
    schemaVersion: FINANCIAL_REPORT_SCHEMA_VERSION,
    runId: run.runId,
    revision: run.revision ?? 1,
    analysisVersion: analysis.analysisVersion,
    generatedAt,
    validatedAt: run.validatedAt,
    validatedSnapshotIntegrityReference: run.integrity,
    identity: {
      filename: run.source.filename,
      statement: run.source.selectedSection ?? "Income Statement",
      currency: run.currency,
      unitScale: run.unitScale,
      periodCoverage: `${run.periods[0]?.label ?? "—"} – ${run.periods.at(-1)?.label ?? "—"}`,
      status: "VALIDATED",
    },
    executivePeriodId: executivePeriod.id,
    executiveMetrics: metricFor(executivePeriod.id),
    performance,
    materialMovements,
    findings: analysis.findings,
    limitations: analysis.limitations,
    controls: {
      applicable: run.validationSummary.applicable,
      passed: run.validationSummary.passed,
      failed: run.validationSummary.failed,
      notApplicable: run.validationSummary.notApplicable,
      coverage: run.validationSummary.coverage,
      validationStatus: "VALIDATED",
      openMaterialReviewTasks,
    },
    evidence: run.evidence.filter((item) => referencedEvidence.has(item.id)),
  };
  return { payload, payloadHash: hashFinancialReportPayload(payload) };
}

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 44;
const escapePdf = (text: string) => text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)").replaceAll(/[^\x20-\x7e]/g, "-");

type PdfPage = { commands: string[]; y: number };
class PdfLayout {
  pages: PdfPage[] = [];
  page!: PdfPage;
  constructor() { this.addPage(); }
  addPage() {
    this.page = { commands: [], y: PAGE_HEIGHT - MARGIN };
    this.pages.push(this.page);
    if (this.pages.length > 1) this.text("ENTIMEMA  /  FINANCIAL INTELLIGENCE", 8, "navy");
  }
  ensure(height: number) { if (this.page.y - height < MARGIN + 22) this.addPage(); }
  text(value: string, size = 9, color: "navy" | "grey" | "blue" | "amber" = "navy", indent = 0) {
    const colors = { navy: "0.02 0.08 0.25", grey: "0.38 0.43 0.50", blue: "0.20 0.36 0.52", amber: "0.62 0.38 0.13" };
    const maxChars = Math.max(20, Math.floor((PAGE_WIDTH - MARGIN * 2 - indent) / (size * .52)));
    const words = value.split(/\s+/); let line = ""; const lines: string[] = [];
    for (const word of words) { const candidate = line ? `${line} ${word}` : word; if (candidate.length > maxChars && line) { lines.push(line); line = word; } else line = candidate; }
    if (line) lines.push(line);
    for (const item of lines.length ? lines : [""]) {
      this.ensure(size + 5);
      this.page.commands.push(`BT /F1 ${size} Tf ${colors[color]} rg ${MARGIN + indent} ${this.page.y} Td (${escapePdf(item)}) Tj ET`);
      this.page.y -= size + 4;
    }
  }
  heading(value: string) { this.ensure(34); this.page.y -= 8; this.text(value.toUpperCase(), 13, "navy"); this.rule(); }
  rule() { this.page.commands.push(`0.78 0.82 0.86 RG ${MARGIN} ${this.page.y} m ${PAGE_WIDTH - MARGIN} ${this.page.y} l S`); this.page.y -= 10; }
  gap(points = 8) { this.page.y -= points; }
}

const label = (key: string) => key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export function renderFinancialReportPdf(report: HashedFinancialReport): Buffer {
  const { payload, payloadHash } = report;
  const pdf = new PdfLayout();
  pdf.gap(28); pdf.text("ENTIMEMA", 13, "blue"); pdf.gap(50);
  pdf.text("FINANCIAL INTELLIGENCE REPORT", 27); pdf.gap(12);
  pdf.text(payload.identity.filename, 14, "blue"); pdf.gap(26);
  for (const [key, value] of [["Statement", payload.identity.statement], ["Reporting basis", `${payload.identity.currency}; scale ${payload.identity.unitScale.toLocaleString("en")}`], ["Covered periods", payload.identity.periodCoverage], ["Generated", payload.generatedAt], ["Validated", payload.validatedAt], ["Run", `${payload.runId.slice(0, 8)} / revision ${payload.revision}`], ["Status", payload.identity.status]]) pdf.text(`${key}: ${value}`, 10, key === "Status" ? "blue" : "navy");
  pdf.gap(40); pdf.text("Decision support based on a validated Income Statement. This report is not an audit opinion.", 9, "grey");

  pdf.addPage(); pdf.heading("Executive financial summary");
  pdf.text(`Applicable period: ${payload.performance.find((row) => row.periodId === payload.executivePeriodId)?.periodLabel ?? payload.executivePeriodId}`, 9, "grey"); pdf.gap();
  payload.executiveMetrics.forEach((metric) => pdf.text(`${label(metric.key)}   ${metric.formatted}`, 14, metric.unit === "ratio" ? "blue" : "navy"));
  pdf.heading("Performance development");
  payload.performance.forEach((row) => { pdf.ensure(48); pdf.text(row.periodLabel, 10, "blue"); pdf.text(row.metrics.map((metric) => `${label(metric.key)}: ${metric.formatted}`).join("  |  "), 7, "navy", 8); pdf.gap(4); });

  pdf.heading("Material movements");
  if (!payload.materialMovements.length) pdf.text("No material sequential movements met the deterministic threshold.", 9, "grey");
  payload.materialMovements.forEach((movement) => { pdf.ensure(54); pdf.text(`${label(movement.metric)} / ${movement.fromPeriod} to ${movement.toPeriod}`, 10, movement.material ? "amber" : "navy"); pdf.text(`Absolute: ${formatAmount(movement.absolute, payload.identity.currency, payload.identity.unitScale)}  |  Percentage: ${movement.percentage === null ? "—" : `${(movement.percentage * 100).toFixed(1)}%`}  |  Materiality: ${movement.material ? "MATERIAL" : "NOT MATERIAL"}`, 8); pdf.text(`Evidence: ${movement.evidenceIds.join(", ")}`, 7, "grey", 8); pdf.gap(5); });

  pdf.heading("Traceable findings");
  for (const classification of ["fact", "calculation", "hypothesis"] as const) {
    pdf.text(classification.toUpperCase(), 9, classification === "hypothesis" ? "amber" : "blue");
    const findings = payload.findings.filter((finding) => finding.classification === classification);
    if (!findings.length) pdf.text("No findings in this classification.", 8, "grey", 8);
    findings.forEach((finding) => { pdf.ensure(58); pdf.text(finding.title, 10, "navy", 8); pdf.text(finding.statement, 8, "navy", 8); pdf.text(`Periods: ${finding.periodIds.join(", ") || "not applicable"}  |  Formula: ${finding.formula ?? "not applicable"}  |  Confidence: ${(finding.confidence * 100).toFixed(0)}%`, 7, "grey", 8); pdf.text(`Evidence: ${finding.evidenceIds.join(", ") || "none - explicitly unsupported"}`, 7, "grey", 8); });
  }
  pdf.text("LIMITATION", 9, "amber"); payload.limitations.forEach((item) => pdf.text(item, 8, "navy", 8));

  pdf.heading("Validation and controls");
  const c = payload.controls;
  pdf.text(`Applicable ${c.applicable}  |  Passed ${c.passed}  |  Failed ${c.failed}  |  Not applicable ${c.notApplicable}`, 10);
  pdf.text(`Coverage ${(c.coverage * 100).toFixed(1)}%  |  Validation ${c.validationStatus}  |  Open material review tasks ${c.openMaterialReviewTasks}`, 9, "blue");

  pdf.heading("Evidence appendix");
  payload.evidence.forEach((evidence) => { pdf.ensure(52); pdf.text(`${evidence.id}  /  ${(evidence.evidenceHash ?? "no hash").slice(0, 16)}`, 8, "blue"); pdf.text(`${evidence.sourceFilename}  |  ${evidence.sheetName ?? `Page ${evidence.pageNumber ?? "—"}`}  |  ${evidence.cellAddress ?? "—"}`, 8); pdf.text(`Row: ${evidence.rawRowLabel}  |  Column: ${evidence.rawColumnHeader}  |  Raw: ${String(evidence.rawCellValue)}`, 7, "grey", 8); pdf.gap(4); });

  pdf.heading("Methodology and limitations");
  pdf.text("Semantic mapping interprets the source structure. Deterministic code owns calculations and reconciliations, and material ambiguity requires human review. This report analyses the Income Statement only. Causal conclusions require operational, budget, or external evidence. It is decision support, not an audit opinion.", 9);
  pdf.heading("Report integrity metadata");
  for (const [key, value] of [["Run ID", payload.runId], ["Revision", String(payload.revision)], ["Analysis version", payload.analysisVersion], ["Report schema", payload.schemaVersion], ["Generation timestamp", payload.generatedAt], ["Validated snapshot integrity", payload.validatedSnapshotIntegrityReference], ["Report payload SHA-256", payloadHash]]) pdf.text(`${key}: ${value}`, 7, key.includes("SHA") ? "blue" : "grey");

  const objects: string[] = ["", "<< /Type /Catalog /Pages 2 0 R >>", ""];
  const pageIds: number[] = [];
  for (const [index, page] of pdf.pages.entries()) {
    page.commands.push(`BT /F1 7 Tf 0.38 0.43 0.50 rg ${MARGIN} 24 Td (ENTIMEMA  /  CONFIDENTIAL) Tj ET`);
    page.commands.push(`BT /F1 7 Tf 0.38 0.43 0.50 rg ${PAGE_WIDTH - 86} 24 Td (PAGE ${index + 1} OF ${pdf.pages.length}) Tj ET`);
    const content = page.commands.join("\n");
    const pageId = objects.length; pageIds.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${pageId + 2} 0 R >> >> /Contents ${pageId + 1} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  }
  objects[2] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`;
  let output = "%PDF-1.4\n% Entimema Financial Intelligence\n"; const offsets = [0];
  for (let id = 1; id < objects.length; id++) { offsets[id] = Buffer.byteLength(output); output += `${id} 0 obj\n${objects[id]}\nendobj\n`; }
  const xref = Buffer.byteLength(output); output += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id++) output += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(output, "latin1");
}

export function safeReportFilename(filename: string) {
  const stem = filename.replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "financial-intelligence";
  return `${stem}-entimema-report.pdf`;
}
