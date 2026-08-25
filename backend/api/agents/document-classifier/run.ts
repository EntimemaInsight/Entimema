import { classifyFingerprintWithAI, type AIClassifier } from "../../../agents/document-classifier/classifier";
import { createDocumentFingerprint, createFallbackFingerprint, FingerprintError, type DocumentFingerprint, type FingerprintFailureReason } from "../../../agents/document-classifier/fingerprint";
import { classifyFingerprint, familyForDocumentType, localResultToClassification, type LocalClassification } from "../../../agents/document-classifier/local-classifier";
import { routeClassification } from "../../../agents/document-classifier/router";
import type { Classification } from "../../../agents/document-classifier/schema";
import { executionTrace } from "../../../agents/document-classifier/workflow";
import { AgentError } from "../../../lib/errors";
import { inspectUploadedFile } from "../../../lib/files";

export type ClassificationSource = "local" | "ai" | "hybrid";
export type Timing = { file_validation_ms: number; fingerprint_ms: number; local_classification_ms: number; ai_classification_ms: number; routing_ms: number; total_ms: number };
type FingerprintFactory = typeof createDocumentFingerprint;
type Dependencies = { aiClassifier?: AIClassifier; fingerprintFactory?: FingerprintFactory };
const elapsed = (started: number) => Number((performance.now() - started).toFixed(2));
const localThreshold = () => { const value = Number(process.env.DOCUMENT_CLASSIFIER_LOCAL_FAST_PATH_THRESHOLD); return Number.isFinite(value) && value >= 0.75 && value <= 1 ? value : 0.92; };
const emptyLocalClassification = (): LocalClassification => ({ local_document_type: "Unknown", local_confidence: 0, local_signals: [] });

function aiResultToClassification(ai: Awaited<ReturnType<AIClassifier>>, local: LocalClassification, fingerprintFallback: boolean): Classification {
  const mismatch = !fingerprintFallback && local.local_document_type !== "Unknown" && local.local_document_type !== ai.document_type;
  const unknown = ai.document_type === "Unknown" || ai.document_family === "Unknown";
  const confidence = Math.min(ai.confidence - (mismatch ? 0.1 : 0), unknown ? 0.59 : 1);
  const issues = mismatch ? ["Local fingerprint and AI fallback classifications differ."] : unknown ? ["Classification could not be established from the available evidence."] : [];
  return {
    document_family: ai.document_family ?? familyForDocumentType(ai.document_type), document_type: ai.document_type,
    document_subtype: null, source_system: null, entity_name: null, reporting_period: null, currency: null, language: null,
    confidence: Number(Math.max(0, confidence).toFixed(2)), data_quality: fingerprintFallback || unknown ? "poor" : "fair", issues,
  };
}

export async function runDocumentClassifier(formData: FormData, dependencies: Dependencies = {}) {
  const totalStarted = performance.now();
  const validationStarted = performance.now();
  if ([...formData.keys()].some((key) => key !== "file") || formData.getAll("file").length !== 1) throw new AgentError("FILE_MISSING", 400, "Expected exactly one multipart file field named 'file'.");
  const document = await inspectUploadedFile(formData.get("file"));
  const file_validation_ms = elapsed(validationStarted);

  const fingerprintStarted = performance.now();
  let fingerprint: DocumentFingerprint;
  let fingerprintFailure: FingerprintFailureReason | null = null;
  try { fingerprint = await (dependencies.fingerprintFactory ?? createDocumentFingerprint)(document); }
  catch (error) {
    if (document.extension !== ".pdf" || !(error instanceof FingerprintError)) throw error;
    fingerprintFailure = error.reason;
    fingerprint = createFallbackFingerprint(document);
  }
  const fingerprint_ms = elapsed(fingerprintStarted);

  let local = emptyLocalClassification();
  let local_classification_ms = 0;
  if (!fingerprintFailure) {
    const localStarted = performance.now();
    local = classifyFingerprint(fingerprint);
    local_classification_ms = elapsed(localStarted);
  }

  let classification: Classification;
  let classificationSource: ClassificationSource = "local";
  let ai_classification_ms = 0;
  let aiCalls = 0;
  if (!fingerprintFailure && local.local_confidence >= localThreshold()) classification = localResultToClassification(local);
  else {
    const aiStarted = performance.now();
    const ai = await (dependencies.aiClassifier ?? classifyFingerprintWithAI)(fingerprint);
    ai_classification_ms = elapsed(aiStarted); aiCalls = 1;
    classificationSource = fingerprintFailure ? "ai" : local.local_confidence >= 0.75 ? "hybrid" : "ai";
    classification = aiResultToClassification(ai, local, Boolean(fingerprintFailure));
  }

  const routingStarted = performance.now();
  const routing = routeClassification(classification);
  const routing_ms = elapsed(routingStarted);
  const timing: Timing = { file_validation_ms, fingerprint_ms, local_classification_ms, ai_classification_ms, routing_ms, total_ms: elapsed(totalStarted) };
  const diagnostics = fingerprintFailure ? [{ node: "fingerprint" as const, code: fingerprintFailure, message: "Local document inspection unavailable — AI fallback used." }] : [];
  return { document, response: { agent: "document_classifier" as const, status: "completed" as const, classification, classification_source: classificationSource, local_classification: local, openai_call_count: aiCalls, routing, execution: executionTrace(aiCalls > 0, Boolean(fingerprintFailure)), diagnostics, timing } };
}