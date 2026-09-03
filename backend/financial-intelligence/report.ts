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
  const validationTimestamp = run.validatedAt ?? (run.status === "validated" ? run.createdAt : undefined);
  if (run.status === "archived") throw new Error("REPORT_ARCHIVED");
  if (run.status !== "validated" || run.readiness.status !== "validated") throw new Error("REPORT_REQUIRES_VALIDATION");
  if (openMaterialReviewTasks) throw new Error("REPORT_OPEN_MATERIAL_REVIEW");
  if (failedMaterialControls) throw new Error("REPORT_FAILED_MATERIAL_CONTROL");
  if (!run.currency || !run.unitScale || !validationTimestamp) throw new Error("REPORT_REQUIRES_VALIDATION");

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
    validatedAt: validationTimestamp,
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
const MARGIN = 42;
const escapePdf = (text: string) => text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)").replaceAll(/[^\x20-\x7e]/g, "-");

type Tone = "ink" | "muted" | "accent" | "positive" | "paper" | "white";
type Font = "sans" | "bold" | "serif" | "serifBold";
type PdfPage = { commands: string[]; y: number; section: string };
class PdfLayout {
  pages: PdfPage[] = [];
  page!: PdfPage;
  private colors: Record<Tone, string> = { ink: "0.05 0.08 0.12", muted: "0.36 0.36 0.34", accent: "0.55 0.09 0.13", positive: "0.12 0.37 0.29", paper: "0.99 0.95 0.90", white: "1 1 1" };
  private fonts: Record<Font, string> = { sans: "F1", bold: "F2", serif: "F3", serifBold: "F4" };
  constructor() { this.addPage("Cover"); }
  addPage(section = "Financial Intelligence") {
    this.page = { commands: [], y: PAGE_HEIGHT - MARGIN, section };
    this.pages.push(this.page);
    this.fill(0, 0, PAGE_WIDTH, PAGE_HEIGHT, "paper");
    if (this.pages.length > 1) {
      this.at("ENTIMEMA", MARGIN, PAGE_HEIGHT - 29, 7, "bold", "accent", 1.7);
      this.at(section.toUpperCase(), PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 29, 6.5, "sans", "muted", 1.2, "right");
      this.line(MARGIN, PAGE_HEIGHT - 36, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - 36, "0.75 0.69 0.62", .5);
      this.page.y = PAGE_HEIGHT - 62;
    }
  }
  ensure(height: number, section = this.page.section) { if (this.page.y - height < MARGIN + 22) this.addPage(section); }
  fill(x: number, y: number, width: number, height: number, tone: Tone) { this.page.commands.push(`${this.colors[tone]} rg ${x} ${y} ${width} ${height} re f`); }
  line(x1: number, y1: number, x2: number, y2: number, color = "0.72 0.68 0.62", width = .5) { this.page.commands.push(`${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`); }
  at(value: string, x: number, y: number, size = 9, font: Font = "sans", tone: Tone = "ink", tracking = 0, align: "left" | "right" = "left") {
    const estimated = value.length * size * .5 + Math.max(0, value.length - 1) * tracking;
    const drawX = align === "right" ? x - estimated : x;
    this.page.commands.push(`BT /${this.fonts[font]} ${size} Tf ${tracking} Tc ${this.colors[tone]} rg ${drawX} ${y} Td (${escapePdf(value)}) Tj ET`);
  }
  wrap(value: string, x: number, y: number, width: number, size = 9, font: Font = "sans", tone: Tone = "ink", leading = size * 1.35) {
    const max = Math.max(8, Math.floor(width / (size * (font.startsWith("serif") ? .48 : .52))));
    const words = value.split(/\s+/); const lines: string[] = []; let line = "";
    for (const word of words) { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; }
    if (line) lines.push(line);
    lines.forEach((item, index) => this.at(item, x, y - index * leading, size, font, tone));
    return lines.length * leading;
  }
  text(value: string, size = 9, font: Font = "sans", tone: Tone = "ink", indent = 0) { const height = this.wrap(value, MARGIN + indent, this.page.y, PAGE_WIDTH - MARGIN * 2 - indent, size, font, tone); this.page.y -= height; }
  kicker(value: string) { this.at(value.toUpperCase(), MARGIN, this.page.y, 6.5, "bold", "accent", 1.5); this.page.y -= 18; }
  heading(value: string, deck?: string) { this.ensure(deck ? 70 : 46); this.at(value, MARGIN, this.page.y, 22, "serifBold", "ink"); this.page.y -= 29; if (deck) { this.page.y -= this.wrap(deck, MARGIN, this.page.y, 420, 9, "sans", "muted", 12); } this.line(MARGIN, this.page.y - 2, PAGE_WIDTH - MARGIN, this.page.y - 2, "0.55 0.09 0.13", 1.1); this.page.y -= 17; }
  gap(points = 8) { this.page.y -= points; }
}

const label = (key: string) => key.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export function renderFinancialReportPdf(report: HashedFinancialReport): Buffer {
  const { payload } = report;
  const pdf = new PdfLayout();
  const executivePeriod = payload.performance.find((row) => row.periodId === payload.executivePeriodId)?.periodLabel ?? payload.executivePeriodId;
  const monthly = payload.performance.filter((row) => row.periodId !== payload.executivePeriodId);
  const marginFinding = payload.findings.find((item) => item.id === "margin-operating_margin") ?? payload.findings.find((item) => item.classification === "calculation");

  pdf.at("ENTIMEMA", MARGIN, 785, 9, "bold", "accent", 2.4);
  pdf.line(MARGIN, 766, PAGE_WIDTH - MARGIN, 766, "0.55 0.09 0.13", 1.2);
  pdf.at("FINANCIAL INTELLIGENCE REPORT", MARGIN, 704, 7, "bold", "muted", 2);
  pdf.wrap("A controlled reading of financial performance", MARGIN, 650, 455, 33, "serifBold", "ink", 36);
  pdf.wrap(marginFinding?.statement ?? "Validated performance, interpreted through traceable financial evidence.", MARGIN, 535, 430, 13, "serif", "accent", 18);
  pdf.fill(MARGIN, 330, PAGE_WIDTH - MARGIN * 2, 136, "white");
  pdf.at("REPORT BASIS", MARGIN + 18, 442, 6.5, "bold", "accent", 1.4);
  [["Statement", payload.identity.statement], ["Period", payload.identity.periodCoverage], ["Reporting basis", `${payload.identity.currency}; scale ${payload.identity.unitScale.toLocaleString("en")}`], ["Source", payload.identity.filename]].forEach(([key, value], index) => { const y = 416 - index * 24; pdf.at(key, MARGIN + 18, y, 7, "sans", "muted"); pdf.at(value, MARGIN + 112, y, 8.5, "bold", "ink"); });
  pdf.at("VALIDATED", PAGE_WIDTH - MARGIN - 18, 442, 7, "bold", "positive", 1.2, "right");
  pdf.at(`Revision: ${payload.revision}`, PAGE_WIDTH - MARGIN - 18, 418, 7, "sans", "muted", .8, "right");
  pdf.wrap("Prepared as decision support from an integrity-checked Income Statement. This document is not an audit opinion.", MARGIN, 250, 430, 9, "serif", "muted", 13);

  pdf.addPage("Client report"); pdf.kicker("Executive briefing");
  pdf.heading("Profitability held at a strong level", `The validated ${executivePeriod} view establishes the earnings profile below. Interpretation remains bounded by the evidence contained in the Income Statement.`);
  const cards = payload.executiveMetrics;
  cards.forEach((item, index) => { const col = index % 4, row = Math.floor(index / 4), x = MARGIN + col * 128, y = pdf.page.y - row * 82; pdf.fill(x, y - 60, 116, 65, "white"); pdf.at(label(item.key), x + 10, y - 13, 5.8, "bold", "muted", .7); pdf.at(item.formatted.replace(` ${payload.identity.currency} x ${payload.identity.unitScale.toLocaleString("en")}`, ""), x + 10, y - 41, 17, item.unit === "ratio" ? "serifBold" : "bold", item.unit === "ratio" ? "accent" : "ink"); if (item.unit === "currency") pdf.at(`${payload.identity.currency} / scale ${payload.identity.unitScale.toLocaleString("en")}`, x + 10, y - 54, 5.5, "sans", "muted"); });
  pdf.page.y -= Math.ceil(cards.length / 4) * 82 + 8;
  pdf.at("WHAT THE EVIDENCE ESTABLISHES", MARGIN, pdf.page.y, 6.5, "bold", "accent", 1.2); pdf.page.y -= 20;
  payload.findings.filter((item) => item.classification === "calculation").slice(0, 3).forEach((item, index) => { const y = pdf.page.y; pdf.at(`0${index + 1}`, MARGIN, y, 13, "serifBold", "accent"); const height = pdf.wrap(item.statement, MARGIN + 34, y, 438, 10, "serif", "ink", 14); pdf.page.y -= Math.max(33, height + 10); });
  pdf.fill(MARGIN, pdf.page.y - 62, PAGE_WIDTH - MARGIN * 2, 62, "white"); pdf.at("EVIDENCE BOUNDARY", MARGIN + 14, pdf.page.y - 18, 6.5, "bold", "accent", 1); pdf.wrap(payload.limitations[0] ?? "Causal attribution requires operational and budget evidence.", MARGIN + 14, pdf.page.y - 37, 470, 8.5, "sans", "muted", 11); pdf.page.y -= 78;

  pdf.addPage("Client report"); pdf.kicker("Performance"); pdf.heading("Monthly earnings architecture", "Revenue, profit conversion and margin development. Full Year is excluded from sequential monthly comparisons.");
  const chart = (keys: string[], title: string, ratio: boolean) => { const x=MARGIN,y=pdf.page.y-142,w=PAGE_WIDTH-MARGIN*2,h=118; pdf.fill(x,y,w,h,"white"); pdf.at(title.toUpperCase(),x+12,y+h-18,6,"bold","muted",.9); const values=monthly.flatMap(row=>row.metrics.filter(m=>keys.includes(m.key)).map(m=>m.value)); const min=Math.min(0,...values),max=Math.max(...values,1); const tones=["0.55 0.09 0.13","0.12 0.28 0.40","0.12 0.37 0.29","0.50 0.43 0.34"]; keys.forEach((key,ki)=>{const pts=monthly.map((row,i)=>{const m=row.metrics.find(item=>item.key===key);const px=x+18+i*((w-36)/Math.max(1,monthly.length-1));const py=y+22+(((m?.value??0)-min)/(max-min))*(h-52);return [px,py]}); if(pts.length>1) pdf.page.commands.push(`${tones[ki]} RG 1.3 w ${pts.map(([px,py],i)=>`${px} ${py} ${i?"l":"m"}`).join(" ")} S`); pdf.at(label(key),x+14+ki*118,y+8,5.8,ki?"sans":"bold",ki===0?"accent":"muted");}); monthly.forEach((row,i)=>{if(i%2===0||i===monthly.length-1)pdf.at(row.periodLabel.split(" ")[0],x+18+i*((w-36)/Math.max(1,monthly.length-1)),y+22,5.2,"sans","muted",0,"left")}); pdf.page.y=y-18; void ratio; };
  chart(["revenue","gross_profit","operating_profit","net_income"],"Reported performance / indexed visual scale",false);
  chart(["gross_margin","operating_margin","net_margin"],"Margin progression",true);
  pdf.at("MONTHLY PERFORMANCE TABLE",MARGIN,pdf.page.y,6.5,"bold","accent",1.2); pdf.page.y-=18;
  const tableKeys=["revenue","gross_profit","operating_profit","net_income","gross_margin","operating_margin","net_margin"];
  const colW=(PAGE_WIDTH-MARGIN*2-72)/tableKeys.length; pdf.fill(MARGIN,pdf.page.y-18,PAGE_WIDTH-MARGIN*2,20,"white"); pdf.at("Period",MARGIN+6,pdf.page.y-12,5.5,"bold","muted"); tableKeys.forEach((key,i)=>pdf.at(label(key).replace("Operating ","Op. ").replace("Gross ","GP ").replace("Net ","Net "),MARGIN+72+i*colW,pdf.page.y-12,5,"bold","muted")); pdf.page.y-=23;
  monthly.forEach(row=>{pdf.ensure(18,"Performance"); pdf.line(MARGIN,pdf.page.y-3,PAGE_WIDTH-MARGIN,pdf.page.y-3,"0.83 0.79 0.73",.3);pdf.at(row.periodLabel,MARGIN+6,pdf.page.y-14,5.8,"sans","ink");tableKeys.forEach((key,i)=>{const m=row.metrics.find(item=>item.key===key);pdf.at(m?(m.unit==="ratio"?`${(m.value*100).toFixed(1)}%`:new Intl.NumberFormat("en",{maximumFractionDigits:1}).format(m.value)):"-",MARGIN+72+i*colW,pdf.page.y-14,5.7,"sans",m?"ink":"muted")});pdf.page.y-=18;});

  pdf.addPage("Client report"); pdf.kicker("Interpretation"); pdf.heading("Material movements", "Deterministic changes identify where to investigate; they do not establish causality.");
  if (!payload.materialMovements.length) { pdf.at("NO SEQUENTIAL MOVEMENT EXCEEDED THE MATERIALITY THRESHOLD",MARGIN,pdf.page.y,6.5,"bold","positive",.9); pdf.page.y-=30; }
  payload.materialMovements.slice(0,6).forEach((move,index)=>{pdf.ensure(48,"Movements and interpretation");const y=pdf.page.y;pdf.at(String(index+1).padStart(2,"0"),MARGIN,y,15,"serifBold","accent");pdf.at(`${label(move.metric)} / ${move.fromPeriod} to ${move.toPeriod}`,MARGIN+38,y,9,"bold","ink");pdf.at(move.percentage===null?"n/m":`${move.percentage>=0?"+":""}${(move.percentage*100).toFixed(1)}%`,PAGE_WIDTH-MARGIN,y,12,"serifBold",Math.abs(move.percentage??0)>=.1?"accent":"ink",0,"right");pdf.at(`${move.absolute>=0?"+":""}${new Intl.NumberFormat("en",{maximumFractionDigits:1}).format(move.absolute)} reported units`,MARGIN+38,y-18,7,"sans","muted");pdf.line(MARGIN,y-31,PAGE_WIDTH-MARGIN,y-31,"0.78 0.73 0.67",.4);pdf.page.y-=43;});
  pdf.gap(10); pdf.at("INTERPRETATION FRAME",MARGIN,pdf.page.y,6.5,"bold","accent",1.2);pdf.page.y-=19;
  const classes:["calculation"|"hypothesis",string][]=[["calculation","Observed and calculated"],["hypothesis","Hypothesis / requires further evidence"]];
  classes.forEach(([kind,title])=>{pdf.at(title.toUpperCase(),MARGIN,pdf.page.y,7,"bold",kind==="hypothesis"?"accent":"positive",1);pdf.page.y-=16;const items=payload.findings.filter(item=>item.classification===kind).slice(0,kind==="calculation"?3:1);items.forEach(item=>{pdf.ensure(48,"Movements and interpretation");pdf.at(item.title,MARGIN+12,pdf.page.y,9,"serifBold","ink");pdf.page.y-=16;pdf.page.y-=pdf.wrap(item.statement,MARGIN+12,pdf.page.y,480,8,"sans","muted",11)+9;});});
  pdf.gap(8); pdf.fill(MARGIN,pdf.page.y-102,PAGE_WIDTH-MARGIN*2,102,"white");
  pdf.at("ANALYTICAL FRAME",MARGIN+14,pdf.page.y-18,6.5,"bold","accent",1.1);
  [["Gross margin","Gross profit / revenue"],["Operating margin","Operating profit / revenue"],["Net margin","Net income / revenue"]].forEach(([metric,formula],index)=>{const x=MARGIN+14+index*166;pdf.at(metric,x,pdf.page.y-43,8,"serifBold","ink");pdf.at(formula,x,pdf.page.y-61,6.5,"sans","muted");});
  pdf.wrap("Movement is evidence. Attribution requires volume, price, mix, cost, headcount or budget data.",MARGIN+14,pdf.page.y-82,470,7.4,"sans","muted",10); pdf.page.y-=120;
  pdf.at("MANAGEMENT INVESTIGATION AGENDA",MARGIN,pdf.page.y,6.5,"bold","accent",1.1); pdf.page.y-=20;
  ["Separate price, volume and mix effects behind revenue development.","Reconcile gross-margin movement to input cost, discounting and product or customer mix.","Test operating leverage against headcount, discretionary spend and budget variance."].forEach((item,index)=>{pdf.at(`0${index+1}`,MARGIN,pdf.page.y,11,"serifBold","accent");pdf.wrap(item,MARGIN+32,pdf.page.y,452,8.2,"serif","ink",12);pdf.page.y-=32;});

  pdf.addPage("Assurance"); pdf.kicker("Validation"); pdf.heading("Controlled and traceable", "Released only after integrity, evidence, mapping and deterministic financial controls satisfy the workflow gates.");
  const c=payload.controls; const assurance=[["Status",c.validationStatus],["Controls",`${c.passed}/${c.applicable} passed`],["Coverage",`${(c.coverage*100).toFixed(0)}%`],["Open exceptions",String(c.openMaterialReviewTasks+c.failed)]];
  pdf.fill(MARGIN,pdf.page.y-74,PAGE_WIDTH-MARGIN*2,74,"white");assurance.forEach(([key,value],index)=>{const x=MARGIN+14+index*127;pdf.at(key.toUpperCase(),x,pdf.page.y-19,5.8,"bold","muted",.8);pdf.at(value,x,pdf.page.y-49,14,"serifBold",index===0||value==="0"?"positive":"ink");});pdf.page.y-=105;
  pdf.at("CONTROL BASIS",MARGIN,pdf.page.y,6.5,"bold","accent",1.2);pdf.page.y-=24;
  [["Semantic mapping","Source labels and periods resolve to the canonical Income Statement."],["Deterministic controls","Arithmetic, reconciliations and readiness remain rule-owned."],["Human authority","Material ambiguity blocks validation until resolved."],["Evidence lineage","Reported values retain source coordinates and integrity references."]].forEach(([title,body],index)=>{const y=pdf.page.y-index*55;pdf.at(title,MARGIN,y,9,"serifBold","ink");pdf.at(body,MARGIN+150,y,7.5,"sans","muted");pdf.line(MARGIN,y-15,PAGE_WIDTH-MARGIN,y-15,"0.82 0.78 0.72",.3);});pdf.page.y-=238;
  pdf.fill(MARGIN,pdf.page.y-72,PAGE_WIDTH-MARGIN*2,72,"white");pdf.at("SCOPE AND LIMITATION",MARGIN+14,pdf.page.y-18,6.5,"bold","accent",1);pdf.wrap("Income Statement decision support, not an audit opinion. Causal attribution, liquidity and cash conversion require operational, budget, Balance Sheet or Cash Flow evidence.",MARGIN+14,pdf.page.y-38,472,8.5,"serif","ink",12);pdf.page.y-=88;
  pdf.at("TRACEABILITY",MARGIN,pdf.page.y,6.5,"bold","accent",1.1);pdf.page.y-=18;pdf.wrap("Every reported value and analytical conclusion is linked to validated source evidence. The complete evidence register is retained within the Entimema Financial Intelligence workflow.",MARGIN,pdf.page.y,472,8,"serif","ink",12);pdf.page.y-=38;pdf.at(`Run ${payload.runId} / revision ${payload.revision}`,MARGIN,pdf.page.y,5.8,"sans","muted");

  const objects: string[] = ["", "<< /Type /Catalog /Pages 2 0 R >>", ""];
  const pageIds: number[] = [];
  for (const [index, page] of pdf.pages.entries()) {
    page.commands.push(`BT /F2 5.8 Tf 1 Tc 0.36 0.36 0.34 rg ${MARGIN} 24 Td (ENTIMEMA / CONFIDENTIAL) Tj ET`);
    page.commands.push(`BT /F1 5.8 Tf 0.36 0.36 0.34 rg ${PAGE_WIDTH - 88} 24 Td (PAGE ${index + 1} OF ${pdf.pages.length}) Tj ET`);
    const content = page.commands.join("\n");
    const pageId = objects.length; pageIds.push(pageId);
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${pageId + 2} 0 R /F2 ${pageId + 3} 0 R /F3 ${pageId + 4} 0 R /F4 ${pageId + 5} 0 R >> >> /Contents ${pageId + 1} 0 R >>`);
    objects.push(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>");
    objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>");
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
