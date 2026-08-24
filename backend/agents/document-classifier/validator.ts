import { AgentError } from "../../lib/errors";
import { ClassificationSchema, ModelClassificationSchema, type Classification } from "./schema";
import { EXPECTED_FAMILIES } from "./taxonomy";
const addIssue = (issues: string[], issue: string) => { if (!issues.includes(issue)) issues.push(issue); };
export function validateModelOutput(value: unknown): Classification {
  const parsed = ModelClassificationSchema.safeParse(value);
  if (!parsed.success) throw new AgentError("OPENAI_RESPONSE_INVALID", 502, undefined, parsed.error);
  const { recommended_agent: _ignored, ...candidate } = parsed.data;
  const issues = [...candidate.issues]; let confidence = candidate.confidence;
  if (candidate.document_type === "Unknown" || candidate.document_family === "Unknown") { confidence = Math.min(confidence, 0.59); addIssue(issues, "Classification could not be established from the available evidence."); }
  const expected = EXPECTED_FAMILIES[candidate.document_type];
  if (expected && !expected.includes(candidate.document_family)) { confidence = Math.max(0, confidence - 0.2); addIssue(issues, "Document family and document type are internally inconsistent."); }
  if (candidate.reporting_period?.from && candidate.reporting_period.to && candidate.reporting_period.from > candidate.reporting_period.to) { confidence = Math.max(0, confidence - 0.2); addIssue(issues, "Reporting period start date is after its end date."); }
  if (candidate.data_quality === "poor") confidence = Math.min(confidence, 0.69);
  if (issues.length >= 3) confidence = Math.max(0, confidence - 0.1);
  return ClassificationSchema.parse({ ...candidate, confidence: Number(confidence.toFixed(2)), issues });
}
export function parseModelJson(text: string) {
  if (!text.trim()) throw new AgentError("OPENAI_RESPONSE_INVALID", 502);
  try { return validateModelOutput(JSON.parse(text)); }
  catch (error) { if (error instanceof AgentError) throw error; throw new AgentError("OPENAI_RESPONSE_INVALID", 502, undefined, error); }
}
