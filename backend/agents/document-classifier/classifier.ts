import { createResponse, getDocumentClassifierModel } from "../../lib/openai";
import type { InspectedDocument } from "../../lib/files";
import { AgentError } from "../../lib/errors";
import { buildDocumentPrompt, DOCUMENT_CLASSIFIER_INSTRUCTIONS } from "./prompt";
import { MODEL_CLASSIFICATION_JSON_SCHEMA } from "./schema";
import { parseModelJson } from "./validator";
export async function classifyDocument(document: InspectedDocument) {
  const response = await createResponse({ model: getDocumentClassifierModel(), store: false, instructions: DOCUMENT_CLASSIFIER_INSTRUCTIONS,
    input: buildDocumentPrompt(document.fileName, document.mimeType, document.extractedText),
    text: { format: { type: "json_schema", name: "document_classification", strict: true, schema: MODEL_CLASSIFICATION_JSON_SCHEMA } },
  });
  if (response.status !== "completed") throw new AgentError("CLASSIFICATION_FAILED", 502);
  return parseModelJson(response.output_text);
}
