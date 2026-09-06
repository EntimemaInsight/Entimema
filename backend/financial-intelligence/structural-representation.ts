import { createHash } from "node:crypto";
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
export type StructuralSheet = { name: string; usedRange: string | null; cells: StructuralCell[]; merges: string[] };
export type WorkbookStructuralRepresentation = {
  version: "workbook-structure.v1";
  workbookId: string;
  sheets: StructuralSheet[];
  stats: { workbookSheets: number; structuralRows: number; nonEmptyCells: number };
};

const idFor = (document: InspectedDocument) =>
  createHash("sha256").update(document.buffer).digest("hex").slice(0, 20);

/** Extracts only source facts needed for interpretation; styles and workbook binary never leave this boundary. */
export function buildWorkbookStructuralRepresentation(document: InspectedDocument): WorkbookStructuralRepresentation {
  if (![".xlsx", ".xlsm", ".csv"].includes(document.extension)) {
    return { version: "workbook-structure.v1", workbookId: idFor(document), sheets: [], stats: { workbookSheets: 0, structuralRows: 0, nonEmptyCells: 0 } };
  }
  const workbook = XLSX.read(document.buffer, { type: "buffer", cellFormula: true, cellDates: true, cellText: true });
  const sheets = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const cells: StructuralCell[] = [];
    for (const ref of Object.keys(sheet).filter((key) => !key.startsWith("!"))) {
      const cell = sheet[ref];
      if (cell?.v === undefined || cell.v === null || cell.v === "") continue;
      const coordinate = XLSX.utils.decode_cell(ref);
      const raw = cell.v instanceof Date ? cell.v.toISOString().slice(0, 10) : cell.v;
      const kind = cell.v instanceof Date ? "date" : typeof raw === "number" ? "number" : typeof raw === "boolean" ? "boolean" : "text";
      cells.push({ ref, row: coordinate.r + 1, column: coordinate.c + 1, kind, value: raw as string | number | boolean, ...(cell.f ? { formula: cell.f } : {}) });
    }
    cells.sort((a, b) => a.row - b.row || a.column - b.column);
    return { name, usedRange: sheet["!ref"] ?? null, cells, merges: (sheet["!merges"] ?? []).map(XLSX.utils.encode_range) };
  });
  return {
    version: "workbook-structure.v1",
    workbookId: idFor(document),
    sheets,
    stats: {
      workbookSheets: sheets.length,
      structuralRows: sheets.reduce((total, sheet) => total + new Set(sheet.cells.map((cell) => cell.row)).size, 0),
      nonEmptyCells: sheets.reduce((total, sheet) => total + sheet.cells.length, 0),
    },
  };
}

export function compactWorkbookStructure(structure: WorkbookStructuralRepresentation, maxChars = 40_000) {
  const payload = JSON.stringify({ version: structure.version, sheets: structure.sheets });
  if (payload.length > maxChars) throw new Error("WORKBOOK_STRUCTURE_TOO_LARGE");
  return payload;
}
