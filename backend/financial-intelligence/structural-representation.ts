import { createHash } from "node:crypto";
import pdfParse from "pdf-parse";
import * as XLSX from "xlsx";
import type { InspectedDocument } from "../lib/files";

export type StructuralCell = {
  ref: string;
  row: number;
  column: number;
  kind: "text" | "number" | "date" | "boolean";
  value: string | number | boolean;
  formula?: string;
};

export type StructuralSheet = {
  name: string;
  usedRange: string | null;
  cells: StructuralCell[];
  merges: string[];
};

export type WorkbookStructuralRepresentation = {
  version: "financial-source.v2";
  workbookId: string;
  sheets: StructuralSheet[];
  stats: {
    workbookSheets: number;
    structuralRows: number;
    nonEmptyCells: number;
  };
};

const idFor = (document: InspectedDocument) =>
  createHash("sha256").update(document.buffer).digest("hex").slice(0, 20);

const statsFor = (sheets: StructuralSheet[]) => ({
  workbookSheets: sheets.length,
  structuralRows: sheets.reduce(
    (total, sheet) => total + new Set(sheet.cells.map((cell) => cell.row)).size,
    0,
  ),
  nonEmptyCells: sheets.reduce((total, sheet) => total + sheet.cells.length, 0),
});

function spreadsheetStructure(document: InspectedDocument): WorkbookStructuralRepresentation {
  const workbook = XLSX.read(document.buffer, {
    type: "buffer",
    cellFormula: true,
    cellDates: true,
    cellText: true,
  });

  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const cells: StructuralCell[] = [];

    for (const ref of Object.keys(sheet).filter((key) => !key.startsWith("!"))) {
      const cell = sheet[ref];
      if (cell?.v === undefined || cell.v === null || cell.v === "") continue;
      const coordinate = XLSX.utils.decode_cell(ref);
      const raw = cell.v instanceof Date ? cell.v.toISOString().slice(0, 10) : cell.v;
      const kind =
        cell.v instanceof Date
          ? "date"
          : typeof raw === "number"
            ? "number"
            : typeof raw === "boolean"
              ? "boolean"
              : "text";
      cells.push({
        ref,
        row: coordinate.r + 1,
        column: coordinate.c + 1,
        kind,
        value: raw as string | number | boolean,
        ...(cell.f ? { formula: cell.f } : {}),
      });
    }

    cells.sort((a, b) => a.row - b.row || a.column - b.column);
    return {
      name,
      usedRange: sheet["!ref"] ?? null,
      cells,
      merges: (sheet["!merges"] ?? []).map(XLSX.utils.encode_range),
    };
  });

  return {
    version: "financial-source.v2",
    workbookId: idFor(document),
    sheets,
    stats: statsFor(sheets),
  };
}

const numericToken = /\(?-?\d[\d,]*(?:\.\d+)?\)?%?/g;

function parseNumericToken(token: string): number | null {
  const trimmed = token.trim();
  const negative = trimmed.startsWith("(") && trimmed.endsWith(")");
  const percent = trimmed.endsWith("%");
  const cleaned = trimmed.replace(/[(),%]/g, "");
  if (!cleaned || !/^-?\d+(?:\.\d+)?$/.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;
  const signed = negative ? -Math.abs(value) : value;
  return percent ? signed / 100 : signed;
}

function textLinesToSheet(name: string, text: string): StructuralSheet {
  const lines = text
    .replace(/\u00a0/g, " ")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const cells: StructuralCell[] = [];
  lines.forEach((line, index) => {
    const row = index + 1;
    const matches = [...line.matchAll(numericToken)];
    let label = line;
    for (const match of matches) {
      if (typeof match.index !== "number") continue;
      label =
        label.slice(0, match.index) +
        " ".repeat(match[0].length) +
        label.slice(match.index + match[0].length);
    }
    label = label.replace(/\s+/g, " ").trim();

    if (label) {
      cells.push({ ref: `A${row}`, row, column: 1, kind: "text", value: label });
    } else {
      cells.push({ ref: `A${row}`, row, column: 1, kind: "text", value: line });
    }

    matches.forEach((match, tokenIndex) => {
      const value = parseNumericToken(match[0]);
      if (value === null) return;
      const column = tokenIndex + 2;
      cells.push({
        ref: `${XLSX.utils.encode_col(column - 1)}${row}`,
        row,
        column,
        kind: "number",
        value,
      });
    });
  });

  return {
    name,
    usedRange: cells.length ? `A1:${XLSX.utils.encode_col(Math.max(...cells.map((c) => c.column)) - 1)}${lines.length}` : null,
    cells,
    merges: [],
  };
}

/**
 * Lossless source-access boundary for V1. It performs no financial classification,
 * statement detection, period inference, canonical mapping, or accounting judgement.
 * Those responsibilities belong exclusively to the AI Financial Understanding layer.
 */
export async function buildFinancialSourceRepresentation(
  document: InspectedDocument,
): Promise<WorkbookStructuralRepresentation> {
  if ([".xlsx", ".xlsm", ".xls", ".csv"].includes(document.extension)) {
    return spreadsheetStructure(document);
  }

  if (document.extension === ".pdf") {
    const parsed = await pdfParse(document.buffer);
    const text = parsed.text?.trim() ?? "";
    if (!text) throw new Error("IMAGE_ONLY_OR_EMPTY_PDF");
    const sheets = [textLinesToSheet("PDF", text)];
    return {
      version: "financial-source.v2",
      workbookId: idFor(document),
      sheets,
      stats: statsFor(sheets),
    };
  }

  if (document.extension === ".txt") {
    const sheets = [textLinesToSheet("Text", document.buffer.toString("utf8"))];
    return {
      version: "financial-source.v2",
      workbookId: idFor(document),
      sheets,
      stats: statsFor(sheets),
    };
  }

  throw new Error("UNSUPPORTED_FINANCIAL_SOURCE");
}

/** Compatibility wrapper for existing spreadsheet-only tests and helpers. */
export function buildWorkbookStructuralRepresentation(
  document: InspectedDocument,
): WorkbookStructuralRepresentation {
  if (![".xlsx", ".xlsm", ".xls", ".csv"].includes(document.extension)) {
    throw new Error("SPREADSHEET_STRUCTURE_REQUIRED");
  }
  return spreadsheetStructure(document);
}

export function compactWorkbookStructure(
  structure: WorkbookStructuralRepresentation,
  maxChars = 55_000,
) {
  const payload = JSON.stringify({
    version: structure.version,
    sheets: structure.sheets.map((sheet) => ({
      name: sheet.name,
      usedRange: sheet.usedRange,
      cells: sheet.cells,
      merges: sheet.merges,
    })),
  });
  if (payload.length > maxChars) throw new Error("FINANCIAL_SOURCE_TOO_LARGE");
  return payload;
}
