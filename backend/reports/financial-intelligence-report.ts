import type { AnalysisKpi, Result } from "../financial-intelligence/v1/contract";
import { statementSchema } from "../financial-intelligence/v1/contract";

export const REPORT_TITLE = "Entimema Financial Intelligence";
export const VERIFICATION_NOTE =
  "Financial values in this report were verified against the uploaded source document before analysis.";

type ReportLine = Result["lines"][number];
export type ReportModel = {
  entity: string;
  statement: "Income Statement";
  periods: string[];
  currency: string;
  scale: string;
  executiveSummary: string;
  kpis: AnalysisKpi[];
  findings: Result["analysis"]["findings"];
  lines: ReportLine[];
  verifiedValues: number;
};

function isFiniteOptional(value: unknown) {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

/** Validates the presentation contract without invoking any analysis code. */
export function parseReportResult(input: unknown): Result {
  if (!input || typeof input !== "object") throw new Error("Invalid report result");
  const candidate = input as Partial<Result>;
  let statement;
  try {
    statement = statementSchema.parse({
      statementType: candidate.statementType,
      entity: candidate.entity,
      currency: candidate.currency,
      scale: candidate.scale,
      periods: candidate.periods,
      lines: candidate.lines,
    });
  } catch { throw new Error("Invalid report statement"); }
  const analysis = candidate.analysis;
  if (!analysis || typeof analysis.executiveSummary !== "string" || !Array.isArray(analysis.kpis) || !Array.isArray(analysis.findings))
    throw new Error("Invalid report analysis");
  for (const kpi of analysis.kpis) {
    if (!kpi || typeof kpi.id !== "string" || typeof kpi.label !== "string" ||
      !["valid", "unavailable", "not_meaningful", "sign_change"].includes(kpi.status) ||
      !isFiniteOptional(kpi.currentValue) || !isFiniteOptional(kpi.priorValue) ||
      !Array.isArray(kpi.evidence) || kpi.evidence.some((e) => !Number.isFinite(e.value)))
      throw new Error("Invalid report KPI");
    if (kpi.status === "valid" && !Number.isFinite(kpi.value)) throw new Error("Invalid report KPI value");
  }
  for (const finding of analysis.findings) {
    if (!finding || typeof finding.title !== "string" || typeof finding.statement !== "string" ||
      !["positive", "attention", "neutral"].includes(finding.severity))
      throw new Error("Invalid report finding");
  }
  if (!candidate.verification || !Number.isInteger(candidate.verification.verifiedValues))
    throw new Error("Invalid report verification");
  return { ...candidate, ...statement } as Result;
}

/** A lossless projection: values and authored prose are references from Result, never recalculated. */
export function createReportModel(result: Result): ReportModel {
  return {
    entity: result.entity ?? "Entity not stated",
    statement: "Income Statement",
    periods: result.periods,
    currency: result.currency ?? "Not stated",
    scale: result.scale ?? "Not stated",
    executiveSummary: result.analysis.executiveSummary,
    kpis: result.analysis.kpis,
    findings: result.analysis.findings.slice(0, 5),
    lines: result.lines,
    verifiedValues: result.verification.verifiedValues,
  };
}

const fmt = new Intl.NumberFormat("en", { maximumFractionDigits: 6 });
export function reportNumber(value: number) {
  return value < 0 ? `(${fmt.format(Math.abs(value))})` : fmt.format(value);
}
export function reportKpi(kpi: AnalysisKpi) {
  if (kpi.status === "valid") return `${fmt.format(kpi.value)}%`;
  if (kpi.status === "sign_change")
    return kpi.direction === "positive_to_negative" ? "Positive to negative" : "Negative to positive";
  return kpi.status === "not_meaningful" ? "Not meaningful" : "Unavailable";
}

export function reportFilename(result: Result) {
  const clean = (value: string) => value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);
  const entity = clean(result.entity ?? "Entity") || "Entity";
  const period = clean([...result.periods].filter((p) => /^\d{4}$/.test(p)).sort().at(-1) ?? result.periods[0] ?? "Period") || "Period";
  return `Entimema_Financial_Intelligence_${entity}_${period}.pdf`;
}

type Page = string[];
const PAGE_W = 595.28, PAGE_H = 841.89, M = 48, BOTTOM = 62;
function ascii(value: string) {
  return value.replace(/[–—]/g, "-").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[^\x20-\x7e]/g, "?");
}
function esc(value: string) { return ascii(value).replace(/([\\()])/g, "\\$1"); }
function wrap(value: string, width: number, size: number) {
  const limit = Math.max(8, Math.floor(width / (size * 0.52)));
  const words = ascii(value).split(/\s+/); const lines: string[] = []; let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length <= limit) line = next;
    else { if (line) lines.push(line); line = word; }
  }
  if (line) lines.push(line); return lines.length ? lines : [""];
}

export function generateFinancialReport(result: Result, generatedOn = new Date()): Buffer {
  const model = createReportModel(result); const pages: Page[] = [[]]; let y = PAGE_H - M;
  const page = () => pages[pages.length - 1];
  const raw = (s: string) => page().push(s);
  const text = (value: string, x: number, atY: number, size = 10, bold = false) =>
    raw(`BT /${bold ? "F2" : "F1"} ${size} Tf 0.02 0.06 0.16 rg 1 0 0 1 ${x.toFixed(2)} ${atY.toFixed(2)} Tm (${esc(value)}) Tj ET`);
  const rule = (atY: number, heavy = false) => raw(`${heavy ? 1.2 : 0.45} w 0.75 0.78 0.82 RG ${M} ${atY} m ${PAGE_W-M} ${atY} l S`);
  const newPage = () => { pages.push([]); y = PAGE_H - M; };
  const need = (height: number) => { if (y - height < BOTTOM) newPage(); };
  const paragraph = (value: string, size = 10, width = PAGE_W - M * 2, gap = 5) => {
    const lines = wrap(value, width, size); need(lines.length * (size + 4) + gap);
    for (const line of lines) { text(line, M, y, size); y -= size + 4; } y -= gap;
  };
  const heading = (value: string, kicker: string) => { need(48); text(kicker.toUpperCase(), M, y, 7, true); y -= 19; text(value, M, y, 16, true); y -= 25; };

  text(REPORT_TITLE.toUpperCase(), M, y, 8, true); text(generatedOn.toISOString().slice(0, 10), PAGE_W - M - 56, y, 8); y -= 30;
  text(model.entity, M, y, 25, true); y -= 24; text(model.statement, M, y, 12); y -= 28; rule(y, true); y -= 20;
  paragraph(`Periods  ${model.periods.join(" / ")}    Currency  ${model.currency}    Scale  ${model.scale}`, 9);
  paragraph("Financial values verified against the uploaded source.", 9); y -= 8;
  heading("Executive Summary", "01 / Overview"); paragraph(model.executiveSummary, 13, PAGE_W - M * 2, 12);
  heading("Key Performance Indicators", "02 / Performance");
  for (const kpi of model.kpis) {
    need(38); text(`${kpi.label} - ${kpi.currentPeriod}`, M, y, 9, true); text(reportKpi(kpi), M + 280, y, 10, true); y -= 15;
    const status = kpi.status === "valid" ? "Valid - calculated from verified values" : kpi.status === "sign_change" ? "Sign change - percentage not meaningful" : `${kpi.status === "not_meaningful" ? "Not meaningful" : "Unavailable"}${"reason" in kpi ? ` - ${kpi.reason}` : ""}`;
    paragraph(status, 8, PAGE_W - M * 2, 5); rule(y); y -= 12;
  }
  heading("Key Findings", "03 / Interpretation");
  model.findings.forEach((finding, index) => { need(45); text(`${String(index + 1).padStart(2, "0")}  ${finding.title}`, M, y, 10, true); text(finding.severity.replace("attention", "requires attention"), PAGE_W - M - 90, y, 7); y -= 17; paragraph(finding.statement, 9, PAGE_W - M * 2, 11); });

  const labelW = 235, numericW = (PAGE_W - M * 2 - labelW) / Math.max(1, model.periods.length);
  const tableHeader = () => { text("Line item", M, y, 8, true); model.periods.forEach((p, i) => text(p, M + labelW + i * numericW + 4, y, 8, true)); y -= 12; rule(y, true); y -= 14; };
  heading("Verified Income Statement", "04 / Source statement"); paragraph(`${model.currency} - ${model.scale}. Negative values are shown in parentheses.`, 8); tableHeader();
  for (const line of model.lines) {
    const labelLines = wrap(line.label, labelW - 10, 8);
    const rowHeight = Math.max(18, labelLines.length * 11 + 7);
    if (y - rowHeight < BOTTOM) { newPage(); text("VERIFIED INCOME STATEMENT (CONTINUED)", M, y, 8, true); y -= 24; tableHeader(); }
    if (line.aggregationRole !== "detail") rule(y + 9, line.aggregationRole === "total");
    labelLines.forEach((label, index) => text(label, M, y - index * 11, 8, line.aggregationRole !== "detail"));
    model.periods.forEach((p, i) => { const value = line.values.find((v) => v.period === p); const shown = value ? reportNumber(value.value) : "Not reported"; text(shown, M + labelW + i * numericW + 4, y, 8, line.aggregationRole === "total"); }); y -= 18;
    y -= rowHeight - 18;
  }
  need(105); y -= 12; rule(y, true); y -= 30; heading("Source / Verification Note", "05 / Verification"); paragraph(VERIFICATION_NOTE, 10); paragraph(`${model.verifiedValues} financial values verified.`, 8);

  pages.forEach((commands, i) => { commands.push(`BT /F1 7 Tf 0.3 0.34 0.4 rg 1 0 0 1 ${M} 30 Tm (ENTIMEMA / FINANCIAL INTELLIGENCE) Tj ET`); commands.push(`BT /F1 7 Tf 0.3 0.34 0.4 rg 1 0 0 1 ${PAGE_W-M-38} 30 Tm (PAGE ${i+1} / ${pages.length}) Tj ET`); });
  return pdf(pages);
}

function pdf(pages: Page[]) {
  const objects: string[] = []; const add = (body: string) => (objects.push(body), objects.length);
  const font = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const bold = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds: number[] = [], contentIds: number[] = [];
  pages.forEach((commands) => { const content = commands.join("\n"); contentIds.push(add(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`)); pageIds.push(0); });
  const pagesId = objects.length + pages.length + 1;
  pages.forEach((_, i) => { pageIds[i] = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> >> /Contents ${contentIds[i]} 0 R >>`); });
  add(`<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  const catalog = add(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);
  let out = "%PDF-1.4\n%Entimema\n"; const offsets = [0]; objects.forEach((body, i) => { offsets.push(Buffer.byteLength(out)); out += `${i+1} 0 obj\n${body}\nendobj\n`; });
  const xref = Buffer.byteLength(out); out += `xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map((n) => `${String(n).padStart(10,"0")} 00000 n `).join("\n")}\ntrailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out);
}
