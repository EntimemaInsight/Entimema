import path from "node:path";
import { AgentError } from "./errors";

const SUPPORTED = {
  ".pdf": ["application/pdf"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream"],
  ".xlsm": ["application/vnd.ms-excel.sheet.macroenabled.12", "application/octet-stream"],
  ".xls": ["application/vnd.ms-excel", "application/octet-stream"],
  ".csv": ["text/csv", "application/csv", "text/plain", "application/vnd.ms-excel", "application/octet-stream"],
  ".txt": ["text/plain", "application/octet-stream"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream"],
} as const;
type SupportedExtension = keyof typeof SUPPORTED;
export type InspectedDocument = { fileName: string; extension: SupportedExtension; mimeType: string; size: number; buffer: Buffer };
const maxBytes = () => { const n = Number(process.env.DOCUMENT_CLASSIFIER_MAX_FILE_BYTES); return Number.isInteger(n) && n > 0 ? n : 20 * 1024 * 1024; };
const prefix = (buffer: Buffer, bytes: number[]) => bytes.every((byte, index) => buffer[index] === byte);

function assertMagic(extension: SupportedExtension, buffer: Buffer) {
  if (extension === ".pdf" && !prefix(buffer, [0x25, 0x50, 0x44, 0x46, 0x2d])) throw new Error("Invalid PDF signature");
  if ((extension === ".xlsx" || extension === ".xlsm" || extension === ".docx") && !prefix(buffer, [0x50, 0x4b])) throw new Error("Invalid ZIP signature");
  if (extension === ".xls" && !prefix(buffer, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1])) throw new Error("Invalid OLE signature");
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
  try { assertMagic(extension, buffer); }
  catch (error) { throw new AgentError("FILE_CORRUPT", 422, undefined, error); }
  return { fileName: value.name, extension, mimeType, size: value.size, buffer };
}
