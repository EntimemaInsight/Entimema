import { classifyDocument } from "../../../agents/document-classifier/classifier";
import { routeClassification } from "../../../agents/document-classifier/router";
import { completedTrace } from "../../../agents/document-classifier/workflow";
import { AgentError } from "../../../lib/errors";
import { inspectUploadedFile } from "../../../lib/files";
export async function runDocumentClassifier(formData: FormData) {
  if ([...formData.keys()].some((key) => key !== "file") || formData.getAll("file").length !== 1) throw new AgentError("FILE_MISSING", 400, "Expected exactly one multipart file field named 'file'.");
  const document = await inspectUploadedFile(formData.get("file"));
  const classification = await classifyDocument(document);
  return { document, response: { agent: "document_classifier" as const, status: "completed" as const, classification, routing: routeClassification(classification), execution: completedTrace() } };
}
