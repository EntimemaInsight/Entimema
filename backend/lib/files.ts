import path from "node:path";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { AgentError } from "./errors";
const SUPPORTED = {
  ".pdf": ["application/pdf"], ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream"],
  ".xls": ["application/vnd.ms-excel", "application/octet-stream"], ".csv": ["text/csv", "application/csv", "text/plain", "application/vnd.ms-excel", "application/octet-stream"],
  ".txt": ["text/plain", "application/octet-stream"], ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream"],
} as const;
type SupportedExtension = keyof typeof SUPPORTED;
export type InspectedDocument = { fileName: string; extension: SupportedExtension; mimeType: string; size: number; extractedText: string };
const maxBytes = () => { const n = Number(process.env.DOCUMENT_CLASSIFIER_MAX_FILE_BYTES); return Number.isInteger(n) && n > 0 ? n : 20 * 1024 * 1024; };
const prefix = (buffer: Buffer, bytes: number[]) => bytes.every((byte, i) => buffer[i] === byte);
function assertMagic(ext: SupportedExtension, buffer: Buffer) {
  if (ext === ".pdf" && !prefix(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) throw new Error("Invalid PDF signature");
  if ((ext === ".xlsx" || ext === ".docx") && !prefix(buffer, [0x50, 0x4b])) throw new Error("Invalid ZIP signature");
  if (ext === ".xls" && !prefix(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) throw new Error("Invalid OLE signature");
}
function decodeText(buffer: Buffer) {
  if (buffer.includes(0)) throw new AgentError("FILE_CORRUPT", 422, "The text file contains invalid binary data.");
  return new TextDecoder("utf-8", { fatal: true }).decode(buffer).replace(/^\uFEFF/, "");
}
function spreadsheetText(buffer: Buffer) {
  const book = XLSX.read(buffer, { type: "buffer", cellDates: true, password: "" });
  if (!book.SheetNames.length) throw new Error("Workbook has no sheets");
  return book.SheetNames.map((name) => `[Sheet: ${name}]\n${XLSX.utils.sheet_to_csv(book.Sheets[name], { blankrows: false })}`).join("\n\n");
}
export async function inspectUploadedFile(value: FormDataEntryValue | null): Promise<InspectedDocument> {
  if (!(value instanceof File) || !value.name.trim()) throw new AgentError("FILE_MISSING", 400);
  if (!value.size) throw new AgentError("FILE_CORRUPT", 422, "The uploaded file is empty.");
  if (value.size > maxBytes()) throw new AgentError("FILE_TOO_LARGE", 413);
  const extension = path.extname(value.name).toLowerCase() as SupportedExtension;
  if (!(extension in SUPPORTED)) throw new AgentError("UNSUPPORTED_FILE_TYPE", 415);
  const mimeType = value.type.toLowerCase() || "application/octet-stream";
  if (!(SUPPORTED[extension] as readonly string[]).includes(mimeType)) throw new AgentError("UNSUPPORTED_FILE_TYPE", 415, "The file extension and MIME type do not match a supported format.");
  const buffer = Buffer.from(await value.arrayBuffer());
  try {
    assertMagic(extension, buffer); let extractedText: string;
    if (extension === ".pdf") { if (buffer.includes(Buffer.from("/Encrypt"))) throw new AgentError("FILE_ENCRYPTED", 422); const { default: pdf } = await import("pdf-parse"); extractedText = (await pdf(buffer)).text; }
    else if (extension === ".docx") extractedText = (await mammoth.extractRawText({ buffer })).value;
    else if (extension === ".xlsx" || extension === ".xls") extractedText = spreadsheetText(buffer);
    else extractedText = decodeText(buffer);
    if (!extractedText.trim()) throw new AgentError("FILE_CORRUPT", 422, "No readable document content was found.");
    if (extractedText.length > 200_000) extractedText = `${extractedText.slice(0, 200_000)}\n[Content truncated by safe preprocessing limit]`;
    return { fileName: value.name, extension, mimeType, size: value.size, extractedText };
  } catch (error) {
    if (error instanceof AgentError) throw error;
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("password") || message.includes("encrypt")) throw new AgentError("FILE_ENCRYPTED", 422, undefined, error);
    throw new AgentError("FILE_CORRUPT", 422, undefined, error);
  }
}
