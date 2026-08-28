/** Temporary multipart boundary while private direct upload is inactive. */
// Vercel's 4.5 MiB request limit includes multipart framing. A decimal 4.5 MB
// file leaves 218,592 bytes for the browser-generated boundary and headers.
export const DOCUMENT_CLASSIFIER_MAX_FILE_BYTES = 4_500_000;
export const DOCUMENT_CLASSIFIER_MAX_REQUEST_BYTES = 4_718_592;
export const DOCUMENT_CLASSIFIER_MAX_FILE_LABEL = "4.5 MB";

export const DOCUMENT_CLASSIFIER_UPLOAD_FAILURE =
  "The file could not be uploaded. Please try again with a file smaller than 4.5 MB.";

export async function safeClassifierPayload(response: Response): Promise<Record<string, unknown> | null> {
  if (!(response.headers.get("content-type") ?? "").toLowerCase().includes("application/json")) return null;
  try {
    const value: unknown = await response.json();
    return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch {
    return null;
  }
}
