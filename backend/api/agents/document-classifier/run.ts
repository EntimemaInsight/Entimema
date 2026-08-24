import { classifyFingerprintWithAI, type AIClassifier } from "../../../agents/document-classifier/classifier";
import { createDocumentFingerprint } from "../../../agents/document-classifier/fingerprint";
import { classifyFingerprint, familyForDocumentType, localResultToClassification } from "../../../agents/document-classifier/local-classifier";
import { routeClassification } from "../../../agents/document-classifier/router";
import type { Classification } from "../../../agents/document-classifier/schema";
import { executionTrace } from "../../../agents/document-classifier/workflow";
import { AgentError } from "../../../lib/errors";
import { inspectUploadedFile } from "../../../lib/files";

export type ClassificationSource = "local" | "ai" | "hybrid";
export type Timing = { file_validation_ms: number; fingerprint_ms: number; local_classification_ms: number; ai_classification_ms: number; routing_ms: number; total_ms: number };
type Dependencies = { aiClassifier?: AIClassifier };
const elapsed = (started: number) => Number((performance.now() - started).toFixed(2));
const localThreshold = () => { const value = Number(process.env.DOCUMENT_CLASSIFIER_LOCAL_FAST_PATH_THRESHOLD); return Number.isFinite(value) && value >= 0.75 && value <= 1 ? value : 0.92; };

export async function runDocumentClassifier(formData: FormData, dependencies: Dependencies = {}) {
  const totalStarted = performance.now();
  const validationStarted = performance.now();
  if ([...formData.keys()].some((key) => key !== "file") || formData.getAll("file").length !== 1) throw new AgentError("FILE_MISSING", 400, "Expected exactly one multipart file field named 'file'.");
  const document = await inspectUploadedFile(formData.get("file"));
  const file_validation_ms = elapsed(validationStarted);

  const fingerprintStarted = performance.now();
  const fingerprint = await createDocumentFingerprint(document);
  const fingerprint_ms = elapsed(fingerprintStarted);

  const localStarted = performance.now();
  const local = classifyFingerprint(fingerprint);
  const local_classification_ms = elapsed(localStarted);

  let classification: Classification;
  let classificationSource: ClassificationSource = "local";
  let ai_classification_ms = 0;
  let aiCalls = 0;
  if (local.local_confidence >= localThreshold()) classification = localResultToClassification(local);
  else {
    const aiStarted = performance.now();
    const ai = await (dependencies.aiClassifier ?? classifyFingerprintWithAI)(fingerprint);
    ai_classification_ms = elapsed(aiStarted); aiCalls = 1;
    classificationSource = local.local_confidence >= 0.75 ? "hybrid" : "ai";
    const mismatch = local.local_document_type !== "Unknown" && local.local_document_type !== ai.document_type;
    classification = {
      document_family: ai.document_family ?? familyForDocumentType(ai.document_type), document_type: ai.document_type,
      document_subtype: null, source_system: null, entity_name: null, reporting_period: null, currency: null, language: null,
      confidence: Number(Math.max(0, ai.confidence - (mismatch ? 0.1 : 0)).toFixed(2)), data_quality: "fair",
      issues: mismatch ? ["Local fingerprint and AI fallback classifications differ."] : [],
    };
  }

  const routingStarted = performance.now();
  const routing = routeClassification(classification);
  const routing_ms = elapsed(routingStarted);
  const timing: Timing = { file_validation_ms, fingerprint_ms, local_classification_ms, ai_classification_ms, routing_ms, total_ms: elapsed(totalStarted) };
  return { document, response: { agent: "document_classifier" as const, status: "completed" as const, classification, classification_source: classificationSource, local_classification: local, openai_call_count: aiCalls, routing, execution: executionTrace(aiCalls > 0), timing } };
}
