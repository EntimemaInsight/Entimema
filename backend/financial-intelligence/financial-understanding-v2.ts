import { createHash } from "node:crypto";
import { createConfiguredResponse, type OpenAITransport } from "../lib/openai";
import type { InspectedDocument } from "../lib/files";
import {
  CANONICAL_CONCEPTS,
  type CanonicalConcept,
  type CanonicalValue,
  type Evidence,
  type Period,
  type SourceRow,
  type StatementSection,
} from "./schema";
import { normalizeValue } from "./validation";
import {
  compactWorkbookStructure,
  type StructuralCell,
  type WorkbookStructuralRepresentation,
} from "./structural-representation";

export const FINANCIAL_UNDERSTANDING_CONTRACT_VERSION = "financial-understanding.v2" as const;
// This is a product latency budget, not a reliability timeout. Exceeding it is
// a truthful performance failure; callers must not extend it and keep waiting.
export const FINANCIAL_UNDERSTANDING_TIMEOUT_MS = 7_000;

export function getFinancialUnderstandingRequestConfig(apiKey: string) {
  const configuredTimeout = Number(process.env.FINANCIAL_UNDERSTANDING_TIMEOUT_MS);
  const timeoutMs =
    Number.isInteger(configuredTimeout) && configuredTimeout > 0
      ? Math.min(configuredTimeout, FINANCIAL_UNDERSTANDING_TIMEOUT_MS)
      : FINANCIAL_UNDERSTANDING_TIMEOUT_MS;
  return { apiKey, timeoutMs, attempts: 1 as const };
}

export type FinancialUnderstandingModelResult = {
  documentType: "financial_statement" | "unsupported";
  statementType: "income_statement" | null;
  entityName: string | null;
  currency: string | null;
  scale: 1 | 1000 | 1000000 | null;
  periods: Array<{
    id: string;
    label: string;
    sourceSheet: string;
    sourceCellRef: string;
    designation: Period["designation"];
    type: Period["type"];
  }>;
  financialLines: Array<{
    sourceId: string;
    sourceSheet: string;
    sourceRow: number;
    sourceLabelCellRef: string;
    sourceLabel: string;
    sourceValueRefs: Array<{ periodId: string; cellRef: string }>;
    sourceSection: StatementSection;
    sourceLineType: "subtotal" | "component";
    canonicalConceptCandidate: CanonicalConcept | null;
    confidence: number;
    evidence: string[];
  }>;
  excludedContent: Array<{ sourceId: string; reason: string }>;
  ambiguities: Array<{ sourceId: string | null; reason: string }>;
};

export type FinancialUnderstandingTelemetry = {
  executionPathVersion: "financial-understanding.v2";
  financialUnderstandingInvoked: boolean;
  persistenceMs?: number;
  uploadFormParsingMs?: number;
  mechanicalReadMs: number;
  payloadPreparationMs: number;
  hydrationMs: number;
  responseParsingMs: number;
  timeToFirstUsefulResultMs: number;
  structuralScanMs: number;
  financialUnderstandingMs: number;
  validationMs: number;
  totalExecutionMs: number;
  workbookSheets: number;
  structuralRows: number;
  financialLinesReturned: number;
  periodsReturned: number;
  model: string | null;
  requestPayloadChars: number;
  estimatedInputTokens: number;
  outputTokens: number | null;
  confidenceSummary: { minimum: number; average: number };
  ambiguityCount: number;
  modelCalls: number;
  maxOutputTokens: number;
};

const periodTypes = ["month","quarter","year","ytd","annual_total","forecast","budget","comparative","variance","percentage","helper","unknown"] as const;
const designations = ["actual","budget","forecast","comparative","unknown"] as const;
const sections = ["p_and_l","oci","total_comprehensive_income","attribution","metadata","unresolved"] as const;
const topKeys = ["documentType","statementType","entityName","currency","scale","periods","financialLines","excludedContent","ambiguities"] as const;
const lineKeys = ["sourceId","sourceSheet","sourceRow","sourceLabelCellRef","sourceLabel","sourceValueRefs","sourceSection","sourceLineType","canonicalConceptCandidate","confidence","evidence"] as const;
const periodKeys = ["id","label","sourceSheet","sourceCellRef","designation","type"] as const;

const schema = {
  type: "object",
  additionalProperties: false,
  required: [...topKeys],
  properties: {
    documentType: { type: "string", enum: ["financial_statement", "unsupported"] },
    statementType: { type: ["string", "null"], enum: ["income_statement", null] },
    entityName: { type: ["string", "null"] },
    currency: { type: ["string", "null"], pattern: "^[A-Z]{3}$" },
    scale: { type: ["number", "null"], enum: [1, 1000, 1000000, null] },
    periods: { type: "array", items: { type: "object", additionalProperties: false, required: [...periodKeys], properties: {
      id: { type: "string" }, label: { type: "string" }, sourceSheet: { type: "string" }, sourceCellRef: { type: "string" },
      designation: { type: "string", enum: [...designations] }, type: { type: "string", enum: [...periodTypes] },
    }}},
    financialLines: { type: "array", items: { type: "object", additionalProperties: false, required: [...lineKeys], properties: {
      sourceId: { type: "string" }, sourceSheet: { type: "string" }, sourceRow: { type: "integer" }, sourceLabelCellRef: { type: "string" }, sourceLabel: { type: "string" },
      sourceValueRefs: { type: "array", items: { type: "object", additionalProperties: false, required: ["periodId","cellRef"], properties: { periodId: { type: "string" }, cellRef: { type: "string" } } } },
      sourceSection: { type: "string", enum: [...sections] }, sourceLineType: { type: "string", enum: ["subtotal","component"] },
      canonicalConceptCandidate: { type: ["string","null"], enum: [...CANONICAL_CONCEPTS, null] }, confidence: { type: "number", minimum: 0, maximum: 1 },
      evidence: { type: "array", maxItems: 5, items: { type: "string", maxLength: 160 } },
    }}},
    excludedContent: { type: "array", items: { type: "object", additionalProperties: false, required: ["sourceId","reason"], properties: { sourceId: { type: "string" }, reason: { type: "string", maxLength: 160 } } } },
    ambiguities: { type: "array", items: { type: "object", additionalProperties: false, required: ["sourceId","reason"], properties: { sourceId: { type: ["string","null"] }, reason: { type: "string", maxLength: 160 } } } },
  },
} as const;

const exactKeys = (value: Record<string, unknown>, keys: readonly string[]) => Object.keys(value).length === keys.length && keys.every((key) => key in value);
const normalizeLabel = (label: string) => label.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, " ").trim();
const stable = (...value: unknown[]) => createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

const numeric = (cell: StructuralCell | undefined): number | null => {
  if (cell?.kind === "number") return cell.value as number;
  if (typeof cell?.value !== "string" || !/^\(?-?[\d,.]+\)?$/.test(cell.value.trim())) return null;
  const negative = cell.value.trim().startsWith("(");
  const parsed = Number(cell.value.replace(/[(),]/g, ""));
  return Number.isFinite(parsed) ? (negative ? -Math.abs(parsed) : parsed) : null;
};

export function parseFinancialUnderstandingResult(raw: unknown): FinancialUnderstandingModelResult {
  if (!raw || typeof raw !== "object") throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
  const result = raw as Record<string, unknown>;
  if (!exactKeys(result, topKeys) || !["financial_statement","unsupported"].includes(String(result.documentType)) || !["income_statement",null].includes(result.statementType as never) || !(result.entityName === null || typeof result.entityName === "string") || !(result.currency === null || (typeof result.currency === "string" && /^[A-Z]{3}$/.test(result.currency))) || ![1,1000,1000000,null].includes(result.scale as never) || !Array.isArray(result.periods) || !Array.isArray(result.financialLines) || !Array.isArray(result.excludedContent) || !Array.isArray(result.ambiguities)) throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");

  const periods = result.periods as Array<Record<string, unknown>>;
  const periodIds = new Set<string>();
  for (const period of periods) {
    if (!exactKeys(period, periodKeys) || ![period.id,period.label,period.sourceSheet,period.sourceCellRef].every((value) => typeof value === "string") || periodIds.has(period.id as string) || !designations.includes(period.designation as never) || !periodTypes.includes(period.type as never)) throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
    periodIds.add(period.id as string);
  }

  const sourceIds = new Set<string>();
  for (const line of result.financialLines as Array<Record<string, unknown>>) {
    if (!exactKeys(line, lineKeys) || typeof line.sourceId !== "string" || sourceIds.has(line.sourceId) || typeof line.sourceSheet !== "string" || !Number.isInteger(line.sourceRow) || typeof line.sourceLabelCellRef !== "string" || typeof line.sourceLabel !== "string" || !Array.isArray(line.sourceValueRefs) || !sections.includes(line.sourceSection as never) || !["subtotal","component"].includes(String(line.sourceLineType)) || !(line.canonicalConceptCandidate === null || (CANONICAL_CONCEPTS as readonly unknown[]).includes(line.canonicalConceptCandidate)) || typeof line.confidence !== "number" || line.confidence < 0 || line.confidence > 1 || !Array.isArray(line.evidence) || !line.evidence.every((value) => typeof value === "string")) throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
    const seenPeriods = new Set<string>();
    for (const ref of line.sourceValueRefs as Array<Record<string, unknown>>) {
      if (!ref || typeof ref !== "object" || !exactKeys(ref, ["periodId","cellRef"]) || typeof ref.periodId !== "string" || !periodIds.has(ref.periodId) || seenPeriods.has(ref.periodId) || typeof ref.cellRef !== "string") throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
      seenPeriods.add(ref.periodId);
    }
    sourceIds.add(line.sourceId);
  }
  return result as FinancialUnderstandingModelResult;
}

export function hydrateUnderstanding(document: InspectedDocument, structure: WorkbookStructuralRepresentation, result: FinancialUnderstandingModelResult) {
  const sheetMap = new Map(structure.sheets.map((sheet) => [sheet.name, new Map(sheet.cells.map((cell) => [cell.ref, cell]))]));
  const periods: Period[] = result.periods.map((period) => {
    const cell = sheetMap.get(period.sourceSheet)?.get(period.sourceCellRef);
    if (!cell || String(cell.value).trim() !== period.label.trim()) throw new Error("UNVERIFIED_PERIOD_LINEAGE");
    return {
      id: period.id, originalHeader: String(cell.value), label: period.label, type: period.type, endDate: null,
      year: Number(/\b(19|20)\d{2}\b/.exec(period.label)?.[0]) || null, month: null, quarter: null, designation: period.designation,
      durationMonths: period.type === "month" ? 1 : period.type === "quarter" ? 3 : ["year","annual_total"].includes(period.type) ? 12 : null,
      sourceColumn: cell.column, confidence: 1, reviewRequired: false,
    };
  });
  const periodMap = new Map(periods.map((period) => [period.id, period]));
  const rows: SourceRow[] = [];
  const evidence: Evidence[] = [];
  const values: CanonicalValue[] = [];

  for (const line of result.financialLines) {
    const cells = sheetMap.get(line.sourceSheet);
    const labelCell = cells?.get(line.sourceLabelCellRef);
    if (!labelCell || labelCell.row !== line.sourceRow || String(labelCell.value).trim() !== line.sourceLabel.trim()) throw new Error("UNVERIFIED_SOURCE_LINEAGE");
    rows.push({ rowNumber: line.sourceRow, label: line.sourceLabel, normalizedLabel: normalizeLabel(line.sourceLabel), role: line.sourceLineType === "subtotal" ? "subtotal" : "financial_line" });

    for (const { periodId, cellRef } of line.sourceValueRefs) {
      const cell = cells?.get(cellRef);
      const source = numeric(cell);
      const period = periodMap.get(periodId);
      if (!cell || source === null || !period || cell.row !== line.sourceRow) throw new Error("UNVERIFIED_NUMERIC_LINEAGE");
      const concept = line.canonicalConceptCandidate ?? "other_reported_line";
      const normalized = normalizeValue(source, concept);
      const evidenceId = `ev-${stable(document.fileName, line.sourceSheet, cellRef, cell.value)}`;
      evidence.push({
        id: evidenceId,
        sourceFilename: document.fileName,
        kind: document.extension === ".pdf" ? "pdf" : document.extension === ".csv" ? "csv" : "spreadsheet",
        sheetName: line.sourceSheet,
        cellAddress: cellRef,
        rowNumber: cell.row,
        columnNumber: cell.column,
        rawRowLabel: line.sourceLabel,
        rawColumnHeader: period.originalHeader,
        rawCellValue: cell.value as string | number,
        formulaPresent: Boolean(cell.formula),
        structuralContext: `${line.sourceSection} ${line.sourceLineType}`,
        extractionMethod: "deterministic-source-reference",
      });
      values.push({
        id: `value-${evidenceId}`,
        sourceRowId: line.sourceId,
        sourceLabel: line.sourceLabel,
        normalizedLabel: normalizeLabel(line.sourceLabel),
        concept,
        lineType: line.sourceLineType,
        originalValue: cell.value as string | number,
        normalizedValue: normalized,
        sourceSign: source < 0 ? "negative" : source > 0 ? "positive" : "zero",
        canonicalSign: normalized < 0 ? "negative" : normalized > 0 ? "positive" : "zero",
        normalizationRule: normalized === source ? "source sign retained" : "expense converted to positive magnitude",
        periodId,
        currency: result.currency,
        unitScale: result.scale,
        mappingMethod: "model-assisted",
        mappingConfidence: line.confidence,
        mappingExplanation: line.evidence.join("; ") || "AI Financial Understanding",
        reviewState: line.sourceSection === "p_and_l" && (concept === "other_reported_line" || line.confidence < 0.68) ? "required" : "not_required",
        evidenceId,
        section: line.sourceSection,
        semanticConfidence: line.confidence,
        structuralConfidence: 1,
        signConsistency: 1,
        evidenceReferences: [evidenceId],
        contractVersion: FINANCIAL_UNDERSTANDING_CONTRACT_VERSION,
        excludedFromControls: line.sourceSection !== "p_and_l",
        originalProposal: concept,
      });
    }
  }

  return { periods, rows, evidence, values, currency: result.currency, scale: result.scale, selected: result.financialLines[0]?.sourceSheet ?? null };
}

export async function understandFinancials(structure: WorkbookStructuralRepresentation, injected?: OpenAITransport) {
  const model = process.env.FINANCIAL_UNDERSTANDING_MODEL?.trim() || process.env.FINANCIAL_SEMANTIC_MODEL?.trim() || null;
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const enabled = process.env.FINANCIAL_UNDERSTANDING_ENABLED === "true" || process.env.FINANCIAL_SEMANTIC_RESOLVER_ENABLED === "true";
  const payloadStarted = performance.now();
  const payload = compactWorkbookStructure(structure);
  const payloadPreparationMs = Math.round(performance.now() - payloadStarted);
  const maxOutputTokens = 2200;
  const started = performance.now();
  if (!enabled || !model || !apiKey) throw new Error("FINANCIAL_UNDERSTANDING_PROVIDER_UNAVAILABLE");

  const response = await createConfiguredResponse({
    model,
    store: false,
    instructions: "Interpret the supplied source representation as a whole. Identify one supported English Income Statement, entity, explicit currency/scale, periods, P&L/OCI boundaries, line types, and only allowlisted canonical concepts. Return source cell references only; never emit, copy, calculate, or transform customer financial numbers. Every period, label, and value reference must exist in the supplied source. Return unsupported rather than guess. Do not claim validation status.",
    input: payload,
    max_output_tokens: maxOutputTokens,
    text: { format: { type: "json_schema", name: "financial_understanding", strict: true, schema } },
  }, getFinancialUnderstandingRequestConfig(apiKey), injected);

  if (response.status !== "completed") throw new Error("OPENAI_RESPONSE_INVALID");
  const parsingStarted = performance.now();
  const result = parseFinancialUnderstandingResult(JSON.parse(response.output_text));
  const responseParsingMs = Math.round(performance.now() - parsingStarted);
  if (result.documentType !== "financial_statement" || result.statementType !== "income_statement" || !result.periods.length || !result.financialLines.length) throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
  return {
    result,
    model,
    durationMs: Math.round(performance.now() - started),
    requestPayloadChars: payload.length,
    estimatedInputTokens: Math.ceil(payload.length / 4),
    outputTokens: response.usage?.output_tokens ?? null,
    modelCalls: 1,
    maxOutputTokens,
    payloadPreparationMs,
    responseParsingMs,
  };
}
