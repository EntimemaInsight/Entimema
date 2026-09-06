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

const periodTypes = [
  "month",
  "quarter",
  "year",
  "ytd",
  "annual_total",
  "forecast",
  "budget",
  "comparative",
  "variance",
  "percentage",
  "helper",
  "unknown",
];
const designations = ["actual", "budget", "forecast", "comparative", "unknown"];
const sections = [
  "p_and_l",
  "oci",
  "total_comprehensive_income",
  "attribution",
  "metadata",
  "unresolved",
];

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "documentType",
    "statementType",
    "entityName",
    "currency",
    "scale",
    "periods",
    "financialLines",
    "excludedContent",
    "ambiguities",
  ],
  properties: {
    documentType: { type: "string", enum: ["financial_statement", "unsupported"] },
    statementType: { type: ["string", "null"], enum: ["income_statement", null] },
    entityName: { type: ["string", "null"] },
    currency: { type: ["string", "null"], pattern: "^[A-Z]{3}$" },
    scale: { type: ["number", "null"], enum: [1, 1000, 1000000, null] },
    periods: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "label", "sourceSheet", "sourceCellRef", "designation", "type"],
        properties: {
          id: { type: "string" },
          label: { type: "string" },
          sourceSheet: { type: "string" },
          sourceCellRef: { type: "string" },
          designation: { type: "string", enum: designations },
          type: { type: "string", enum: periodTypes },
        },
      },
    },
    financialLines: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "sourceId",
          "sourceSheet",
          "sourceRow",
          "sourceLabelCellRef",
          "sourceLabel",
          "sourceValueRefs",
          "sourceSection",
          "sourceLineType",
          "canonicalConceptCandidate",
          "confidence",
          "evidence",
        ],
        properties: {
          sourceId: { type: "string" },
          sourceSheet: { type: "string" },
          sourceRow: { type: "integer" },
          sourceLabelCellRef: { type: "string" },
          sourceLabel: { type: "string" },
          sourceValueRefs: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["periodId", "cellRef"],
              properties: {
                periodId: { type: "string" },
                cellRef: { type: "string" },
              },
            },
          },
          sourceSection: { type: "string", enum: sections },
          sourceLineType: { type: "string", enum: ["subtotal", "component"] },
          canonicalConceptCandidate: {
            type: ["string", "null"],
            enum: [...CANONICAL_CONCEPTS, null],
          },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          evidence: { type: "array", maxItems: 5, items: { type: "string", maxLength: 160 } },
        },
      },
    },
    excludedContent: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sourceId", "reason"],
        properties: {
          sourceId: { type: "string" },
          reason: { type: "string", maxLength: 160 },
        },
      },
    },
    ambiguities: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sourceId", "reason"],
        properties: {
          sourceId: { type: ["string", "null"] },
          reason: { type: "string", maxLength: 160 },
        },
      },
    },
  },
} as const;

const exactKeys = (x: Record<string, unknown>, keys: string[]) =>
  Object.keys(x).length === keys.length && keys.every((key) => key in x);

const normalizeLabel = (label: string) =>
  label
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export function parseFinancialUnderstandingResult(raw: unknown): FinancialUnderstandingModelResult {
  if (!raw || typeof raw !== "object") throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
  const x = raw as Record<string, unknown>;
  const top = [
    "documentType",
    "statementType",
    "entityName",
    "currency",
    "scale",
    "periods",
    "financialLines",
    "excludedContent",
    "ambiguities",
  ];
  if (
    !exactKeys(x, top) ||
    !["financial_statement", "unsupported"].includes(String(x.documentType)) ||
    !["income_statement", null].includes(x.statementType as never) ||
    !(x.entityName === null || typeof x.entityName === "string") ||
    !(x.currency === null || (typeof x.currency === "string" && /^[A-Z]{3}$/.test(x.currency))) ||
    ![1, 1000, 1000000, null].includes(x.scale as never) ||
    !Array.isArray(x.periods) ||
    !Array.isArray(x.financialLines) ||
    !Array.isArray(x.excludedContent) ||
    !Array.isArray(x.ambiguities)
  ) {
    throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
  }

  const periods = x.periods as Array<Record<string, unknown>>;
  const lines = x.financialLines as Array<Record<string, unknown>>;
  const periodIds = new Set<string>();
  for (const period of periods) {
    if (
      !exactKeys(period, ["id", "label", "sourceSheet", "sourceCellRef", "designation", "type"]) ||
      ![period.id, period.label, period.sourceSheet, period.sourceCellRef].every((v) => typeof v === "string") ||
      periodIds.has(period.id as string) ||
      !designations.includes(String(period.designation)) ||
      !periodTypes.includes(String(period.type))
    ) {
      throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
    }
    periodIds.add(period.id as string);
  }

  const sourceIds = new Set<string>();
  for (const line of lines) {
    if (
      !exactKeys(line, [
        "sourceId",
        "sourceSheet",
        "sourceRow",
        "sourceLabelCellRef",
        "sourceLabel",
        "sourceValueRefs",
        "sourceSection",
        "sourceLineType",
        "canonicalConceptCandidate",
        "confidence",
        "evidence",
      ]) ||
      typeof line.sourceId !== "string" ||
      sourceIds.has(line.sourceId) ||
      typeof line.sourceSheet !== "string" ||
      !Number.isInteger(line.sourceRow) ||
      typeof line.sourceLabelCellRef !== "string" ||
      typeof line.sourceLabel !== "string" ||
      !Array.isArray(line.sourceValueRefs) ||
      !sections.includes(String(line.sourceSection)) ||
      !["subtotal", "component"].includes(String(line.sourceLineType)) ||
      !(line.canonicalConceptCandidate === null || (CANONICAL_CONCEPTS as readonly unknown[]).includes(line.canonicalConceptCandidate)) ||
      typeof line.confidence !== "number" ||
      line.confidence < 0 ||
      line.confidence > 1 ||
      !Array.isArray(line.evidence) ||
      !line.evidence.every((v) => typeof v === "string")
    ) {
      throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
    }
    const seenPeriods = new Set<string>();
    for (const ref of line.sourceValueRefs as Array<Record<string, unknown>>) {
      if (
        !ref ||
        typeof ref !== "object" ||
        !exactKeys(ref, ["periodId", "cellRef"]) ||
        typeof ref.periodId !== "string" ||
        !periodIds.has(ref.periodId) ||
        seenPeriods.has(ref.periodId) ||
        typeof ref.cellRef !== "string"
      ) {
        throw new Error("INVALID_FINANCIAL_UNDERSTANDING_OUTPUT");
      }
      seenPeriods.add(ref.periodId);
    }
    sourceIds.add(line.sourceId);
  }
  return x as FinancialUnderstandingModelResult;
}

const stable = (...value: unknown[]) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);

const numeric = (cell: StructuralCell | undefined) => {
  if (cell?.kind === "number") return cell.value as number;
  if (typeof cell?.value !== "string" || !/^\(?-?[\d,.]+\)?$/.test(cell.value.trim())) return null;
  const negative = cell.value.trim().startsWith("(");
  const parsed = Number(cell.value.replace(/[(),]/g, ""));
  return Number.isFinite(parsed) ? (negative ? -Math.abs(parsed) : parsed) : null;
};

export function hydrateUnderstanding(
  document: InspectedDocument,
  structure: WorkbookStructuralRepresentation,
  result: FinancialUnderstandingModelResult,
) {
  const sheetMap = new Map(
    structure.sheets.map((sheet) => [sheet.name, new Map(sheet.cells.map((cell) => [cell.ref, cell]))]),
  );
  const periods: Period[] = result.periods.map((period) => {
    const cell = sheetMap.get(period.sourceSheet)?.get(period.sourceCellRef);
    if (!cell || String(cell.value).trim() !== period.label.trim()) throw new Error("UNVERIFIED_PERIOD_LINEAGE");
    return {
      id: period.id,
      originalHeader: String(cell.value),
      label: period.label,
      type: period.type,
      endDate: null,
      year: Number(/\b(19|20)\d{2}\b/.exec(period.label)?.[0]) || null,
      month: null,
      quarter: null,
      designation: period.designation,
      durationMonths: period.type === "month" ? 1 : period.type === "quarter" ? 3 : ["year", "annual_total"].includes(period.type) ? 12 : null,
      sourceColumn: cell.column,
      confidence: 1,
      reviewRequired: false,
    };
  });
  const periodMap = new Map(periods.map((period) => [period.id, period]));
  const rows: SourceRow[] = [];
  const evidence: Evidence[] = [];
  const values: CanonicalValue[] = [];

  for (const line of result.financialLines) {
    const cells = sheetMap.get(line.sourceSheet);
    const labelCell = cells?.get(line.sourceLabelCellRef);
    if (!labelCell || labelCell.row !== line.sourceRow || String(labelCell.value).trim() !== line.sourceLabel.trim()) {
      throw new Error("UNVERIFIED_SOURCE_LINEAGE");
    }
    rows.push({
      rowNumber: line.sourceRow,
      label: line.sourceLabel,
      normalizedLabel: normalizeLabel(line.sourceLabel),
      role: line.sourceLineType === "subtotal" ? "subtotal" : "financial_line",
    });

    for (const { periodId, cellRef } of line.sourceValueRefs) {
      const cell = cells?.get(cellRef);
      const source = numeric(cell);
      const period = periodMap.get(periodId);
      if (!cell || source === null || !period || cell.row !== line.sourceRow) throw new Error("UNVERIFIED_NUMERIC_LINEAGE");
      const evidenceId = `ev-${stable(document.fileName, line.sourceSheet, cellRef, cell.value)}`;
      const