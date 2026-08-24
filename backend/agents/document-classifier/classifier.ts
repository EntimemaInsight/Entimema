import { createResponse, getDocumentClassifierModel } from "../../lib/openai";
import { AgentError } from "../../lib/errors";
import { compactFingerprint, type DocumentFingerprint } from "./fingerprint";
import { FAST_AI_JSON_SCHEMA, FastAIClassificationSchema, type FastAIClassification } from "./fast-schema";

export type AIClassifier = (fingerprint: DocumentFingerprint) => Promise<FastAIClassification>;
const instructions = "Classify the compact business-document fingerprint into the normalized taxonomy. Unknown is not an assumption. Return Unknown when evidence is insufficient. Do not infer routing or metadata.";

export const classifyFingerprintWithAI: AIClassifier = async (fingerprint) => {
  const response = await createResponse({
    model: getDocumentClassifierModel(), store: false, instructions, reasoning: { effort: "none" }, max_output_tokens: 200,
    input: compactFingerprint(fingerprint),
    text: { format: { type: "json_schema", name: "fast_document_classification", strict: true, schema: FAST_AI_JSON_SCHEMA } },
  });
  if (response.status !== "completed") throw new AgentError("CLASSIFICATION_FAILED", 502);
  try { return FastAIClassificationSchema.parse(JSON.parse(response.output_text)); }
  catch (error) { throw new AgentError("OPENAI_RESPONSE_INVALID", 502, undefined, error); }
};
