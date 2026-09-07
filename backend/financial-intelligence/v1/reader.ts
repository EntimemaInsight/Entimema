import { normalizePdfNumbers, pdfTokens } from "./pdf-numbers";
import * as XLSX from "xlsx";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import type { InspectedDocument } from "../../lib/files";
import { AgentError } from "../../lib/errors";

export type Cell = {
  ref: string;
  sheet: string;
  row: number;
  column: number;
  raw: string | number | boolean;
  displayed: string;
  numeric: number | null;
  structure?: {
    formula?: string;
    numberFormat?: string;
    rowOutlineLevel?: number;
    rowHidden?: boolean;
    columnHidden?: boolean;
    fill?: string;
  };
};
export type Source = {
  text: string;
  cells: Map<string, Cell>;
  format: "spreadsheet" | "pdf";
};
const MAX_CELLS = 20_000;
const MAX_CHARS = 120_000;

/** Numeric syntax only. Ambiguous text stays unverified; no financial sign/scale inference. */
export function sourceNumber(raw: unknown): number | null {
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  if (typeof raw !== "string") return null;
  let value = raw.trim().replace(/\u2212/g, "-");
  const negative = /^\(.*\)$/.test(value);
  if (negative) value = value.slice(1, -1).trim();
  if (/^\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:[.,]\d+)?$/.test(value))
    value = value.replace(/[ \u00a0\u202f]/g, "");
  if (/^[+-]?\d{1,3}(?:,\d{3})+\.\d+$/.test(value))
    value = value.replace(/,/g, "");
  else if (/^[+-]?\d{1,3}(?:\.\d{3})+,\d+$/.test(value))
    value = value.replace(/\./g, "").replace(",", ".");
  else if (/^[+-]?\d+,\d{1,2}$/.test(value)) value = value.replace(",", ".");
  // A lone comma followed by three digits is ambiguous (decimal or grouping).
  if (
    !/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(value) ||
    (negative && /^[+-]/.test(value))
  )
    return null;
  const number = Number(value) * (negative ? -1 : 1);
  return Number.isFinite(number) ? number : null;
}

export function sourceRef(sheet: string, ref: string) {
  return `'${sheet.replace(/'/g, "''")}'!${ref}`;
}

function compact(
  cells: Map<string, Cell>,
  format: Source["format"],
  merges = new Map<string, string[]>(),
): Source {
  if (!cells.size)
    throw new AgentError(
      "FILE_CORRUPT",
      422,
      "No readable text or cells. Scanned PDFs require OCR, which is not supported.",
    );
  if (cells.size > MAX_CELLS)
    throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
  const parts: string[] = [];
  let priorSheet: string | undefined,
    priorRow = 0;
  for (const cell of cells.values()) {
    if (format === "spreadsheet") {
      if (cell.sheet !== priorSheet) {
        parts.push(
          "SHEET " +
            JSON.stringify(cell.sheet) +
            " | mergedRanges " +
            JSON.stringify(merges.get(cell.sheet) ?? []),
        );
        priorSheet = cell.sheet;
        priorRow = 0;
      }
      if (cell.row !== priorRow) {
        if (cell.row > priorRow + 1)
          parts.push("BLANK_ROWS " + (priorRow + 1) + ":" + (cell.row - 1));
        parts.push("ROW " + cell.row);
        priorRow = cell.row;
      }
    }
    parts.push(
      cell.ref +
        " | " +
        JSON.stringify(cell.raw) +
        (String(cell.raw) !== cell.displayed
          ? " | displayed " + JSON.stringify(cell.displayed)
          : "") +
        (cell.structure
          ? " | structure " + JSON.stringify(cell.structure)
          : ""),
    );
  }
  const text = parts.join("\n");
  if (text.length > MAX_CHARS)
    throw new AgentError(
      "WORKBOOK_LIMIT_EXCEEDED",
      413,
      "The document exceeds the compact reading limit. No content was silently omitted.",
    );
  return { text, cells, format };
}

type PdfItem = { str: string; transform: number[] };
export async function readMechanically(
  document: InspectedDocument,
): Promise<Source> {
  const cells = new Map<string, Cell>();
  try {
    if (document.extension === ".pdf") {
      let page = 0;
      let pageFailure: unknown;
      // PDF.js requires native typed-array slicing; Node Buffer.slice has view semantics.
      // The legacy declaration says Buffer, but its runtime accepts Uint8Array.
      const parsed = await pdfParse(new Uint8Array(document.buffer) as Buffer, {
        max: 51,
        pagerender: async (data: {
          getTextContent: (options: object) => Promise<{ items: PdfItem[] }>;
        }) => {
          page++;
          try {
            if (page > 50) throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
            const content = await data.getTextContent({
              normalizeWhitespace: false,
              disableCombineTextItems: false,
            });
            if (!content.items.some((item) => item.str.trim()))
              throw new AgentError(
                "FILE_CORRUPT",
                422,
                "A PDF page has no readable text. OCR is not supported.",
              );
            const rows: Array<{ y: number; items: PdfItem[] }> = [];
            for (const item of content.items
              .filter((item) => item.str.trim())
              .sort(
                (a, b) =>
                  b.transform[5] - a.transform[5] ||
                  a.transform[4] - b.transform[4],
              )) {
              let row = rows.find(
                (row) => Math.abs(row.y - item.transform[5]) < 2,
              );
              if (!row) {
                row = { y: item.transform[5], items: [] };
                rows.push(row);
              }
              row.items.push(item);
            }
            rows.forEach((row, index) => {
              let column = 0;
              for (const item of row.items.sort(
                (a, b) => a.transform[4] - b.transform[4],
              )) {
                for (const token of pdfTokens(item.str)) {
                  const ref = `p${page}:l${index + 1}:t${++column}`;
                  cells.set(ref, {
                    ref,
                    sheet: `Page ${page}`,
                    row: index + 1,
                    column,
                    raw: token,
                    displayed: token,
                    numeric: sourceNumber(token),
                  });
                  if (cells.size > MAX_CELLS)
                    throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
                }
              }
            });
            return "";
          } catch (error) {
            pageFailure = error;
            throw error;
          }
        },
      });
      if (pageFailure) throw pageFailure;
      if (parsed.numpages > 50 || parsed.numrender !== page)
        throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
      normalizePdfNumbers(cells);
      return compact(cells, "pdf");
    }
    if (![".xlsx", ".xls", ".csv"].includes(document.extension))
      throw new AgentError(
        "UNSUPPORTED_FILE_TYPE",
        415,
        "Use XLSX, XLS, CSV, or a text-based PDF.",
      );
    const workbook = XLSX.read(document.buffer, {
      type: "buffer",
      raw: document.extension === ".csv",
      cellText: true,
      cellDates: false,
      cellFormula: true,
      cellNF: true,
      cellStyles: true,
      sheetRows: 2001,
    });
    if (workbook.SheetNames.length > 50)
      throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
    const merges = new Map<string, string[]>();
    for (const name of workbook.SheetNames) {
      const sheet = workbook.Sheets[name];
      merges.set(
        name,
        (sheet["!merges"] ?? []).map((range) => XLSX.utils.encode_range(range)),
      );
      if (sheet["!fullref"] && sheet["!fullref"] !== sheet["!ref"])
        throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
      const refs = Object.keys(sheet)
        .filter((ref) => /^[A-Z]+[1-9]\d*$/.test(ref))
        .sort((a, b) => {
          const x = XLSX.utils.decode_cell(a),
            y = XLSX.utils.decode_cell(b);
          return x.r - y.r || x.c - y.c;
        });
      for (const address of refs) {
        const cell = sheet[address];
        if (cell.f && cell.v == null)
          throw new AgentError(
            "FILE_CORRUPT",
            422,
            "A formula has no saved result. Recalculate and save the workbook first.",
          );
        if (cell.v == null || cell.v === "") continue;
        const coordinate = XLSX.utils.decode_cell(address),
          ref = sourceRef(name, address);
        const raw = cell.v as string | number | boolean;
        const structure: NonNullable<Cell["structure"]> = {};
        if (cell.f) structure.formula = cell.f;
        if (cell.z && cell.z !== "General")
          structure.numberFormat = String(cell.z);
        const row = sheet["!rows"]?.[coordinate.r],
          column = sheet["!cols"]?.[coordinate.c];
        if (row?.level) structure.rowOutlineLevel = row.level;
        if (row?.hidden) structure.rowHidden = true;
        if (column?.hidden) structure.columnHidden = true;
        const fill: unknown = cell.s?.fgColor?.rgb;
        if (typeof fill === "string" && /^[0-9A-F]{6,8}$/i.test(fill))
          structure.fill = fill;
        cells.set(ref, {
          ref,
          sheet: name,
          row: coordinate.r + 1,
          column: coordinate.c + 1,
          raw,
          displayed: cell.w ?? String(raw),
          numeric: cell.t === "e" ? null : sourceNumber(raw),
          ...(Object.keys(structure).length ? { structure } : {}),
        });
        if (cells.size > MAX_CELLS)
          throw new AgentError("WORKBOOK_LIMIT_EXCEEDED", 413);
      }
    }
    return compact(cells, "spreadsheet", merges);
  } catch (error) {
    if (error instanceof AgentError) throw error;
    throw new AgentError(
      "FILE_CORRUPT",
      422,
      "The file could not be read mechanically.",
      error,
    );
  }
}
