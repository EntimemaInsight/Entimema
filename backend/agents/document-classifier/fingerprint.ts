import mammoth from "mammoth";
import * as XLSX from "xlsx";
import type { InspectedDocument } from "../../lib/files";
import { AgentError } from "../../lib/errors";

const MAX_TEXT_BYTES = 64 * 1024;
const MAX_SHEETS = 12;
const MAX_ROWS = 80;
const MAX_COLUMNS = 16;
const MAX_COMPACT_CHARACTERS = 32_000;

export type DocumentFingerprint = {
  fileName: string;
  extension: string;
  mimeType: string;
  sheetNames: string[];
  headers: string[];
  representativeRows: string[][];
  dimensions: string[];
  dateSignals: string[];
  currencySignals: string[];
  textWindow: string;
};

function unique(values: string[], limit = 80) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].slice(0, limit);
}

function textSignals(text: string) {
  const dateSignals = text.match(/\b(?:19|20)\d{2}(?:[-/.]\d{1,2}(?:[-/.]\d{1,2})?)?\b/g) ?? [];
  const currencySignals = text.match(/\b(?:USD|EUR|GBP|BGN|CHF|JPY|CNY|CAD|AUD)\b|[$€£¥]/gi) ?? [];
  return { dateSignals: unique(dateSignals, 20), currencySignals: unique(currencySignals.map((value) => value.toUpperCase()), 12) };
}

function decodeText(buffer: Buffer) {
  return new TextDecoder("utf-8", { fatal: true }).decode(buffer.subarray(0, MAX_TEXT_BYTES)).replace(/^\uFEFF/, "");
}

function workbookFingerprint(document: InspectedDocument): DocumentFingerprint {
  const workbook = XLSX.read(document.buffer, { type: "buffer", cellDates: true, password: "", sheetRows: MAX_ROWS });
  if (!workbook.SheetNames.length) throw new Error("Workbook has no sheets");
  const representativeRows: string[][] = [];
  const headers: string[] = [];
  const dimensions: string[] = [];

  for (const name of workbook.SheetNames.slice(0, MAX_SHEETS)) {
    const sheet = workbook.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, blankrows: false }).slice(0, MAX_ROWS);
    const cleanRows = rows.map((row) => row.slice(0, MAX_COLUMNS).map((cell) => String(cell ?? "").trim()).filter(Boolean)).filter((row) => row.length);
    representativeRows.push(...cleanRows);
    if (cleanRows[0]) headers.push(...cleanRows[0]);
    const range = sheet["!ref"] ? XLSX.utils.decode_range(sheet["!ref"]) : null;
    if (range) dimensions.push(`${name}:${range.e.r - range.s.r + 1}x${range.e.c - range.s.c + 1}`);
  }

  const textWindow = [workbook.SheetNames.join(" | "), ...representativeRows.map((row) => row.join(" | "))].join("\n").slice(0, MAX_COMPACT_CHARACTERS);
  return { fileName: document.fileName, extension: document.extension, mimeType: document.mimeType, sheetNames: workbook.SheetNames.slice(0, MAX_SHEETS), headers: unique(headers), representativeRows: representativeRows.slice(0, 300), dimensions, ...textSignals(textWindow), textWindow };
}

export async function createDocumentFingerprint(document: InspectedDocument): Promise<DocumentFingerprint> {
  try {
    if (document.extension === ".xlsx" || document.extension === ".xls") return workbookFingerprint(document);
    let textWindow: string;
    if (document.extension === ".docx") textWindow = (await mammoth.extractRawText({ buffer: document.buffer })).value.slice(0, MAX_COMPACT_CHARACTERS);
    else if (document.extension === ".pdf") {
      if (document.buffer.includes(Buffer.from("/Encrypt"))) throw new AgentError("FILE_ENCRYPTED", 422);
      const { default: pdf } = await import("pdf-parse");
      textWindow = (await pdf(document.buffer)).text.slice(0, MAX_COMPACT_CHARACTERS);
    } else textWindow = decodeText(document.buffer).slice(0, MAX_COMPACT_CHARACTERS);
    if (!textWindow.trim()) throw new AgentError("FILE_CORRUPT", 422, "No readable document content was found.");
    const rows = textWindow.split(/\r?\n/).filter(Boolean).slice(0, MAX_ROWS);
    const delimiter = document.extension === ".csv" ? ([",", ";", "\t", "|"].sort((a, b) => (rows[0]?.split(b).length ?? 0) - (rows[0]?.split(a).length ?? 0))[0]) : null;
    const representativeRows = rows.map((row) => delimiter ? row.split(delimiter).slice(0, MAX_COLUMNS).map((cell) => cell.trim()) : [row.trim()]);
    return { fileName: document.fileName, extension: document.extension, mimeType: document.mimeType, sheetNames: [], headers: representativeRows[0] ?? [], representativeRows, dimensions: representativeRows[0] ? [`${representativeRows.length}x${representativeRows[0].length}`] : [], ...textSignals(textWindow), textWindow };
  } catch (error) {
    if (error instanceof AgentError) throw error;
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("password") || message.includes("encrypt")) throw new AgentError("FILE_ENCRYPTED", 422, undefined, error);
    throw new AgentError("FILE_CORRUPT", 422, undefined, error);
  }
}

export function compactFingerprint(fingerprint: DocumentFingerprint) {
  return JSON.stringify({ filename: fingerprint.fileName, sheet_names: fingerprint.sheetNames, headers: fingerprint.headers, dimensions: fingerprint.dimensions, representative_rows: fingerprint.representativeRows.slice(0, 24), date_signals: fingerprint.dateSignals, currency_signals: fingerprint.currencySignals });
}
