import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import { runDocumentClassifier } from "../../backend/api/agents/document-classifier/run";
import type { AIClassifier } from "../../backend/agents/document-classifier/classifier";
import { familyForDocumentType } from "../../backend/agents/document-classifier/local-classifier";
import { VALIDATION_CASES, type ValidationCase } from "./document-classifier-cases";

type RecordResult = {
  test_id: string; filename: string; expected_document_type: string; actual_document_type: string;
  expected_route: string; actual_route: string; confidence: number; classification_source: string;
  openai_call_count: number; review_required: boolean; duration_ms: number; pass_fail: "PASS" | "FAIL"; notes: string;
};

const percentile = (values: number[], percentileValue: number) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return Number(sorted[Math.min(sorted.length - 1, Math.ceil(percentileValue * sorted.length) - 1)].toFixed(2));
};

function form(filename: string, content: string | Uint8Array, mime = "text/csv") {
  const part: BlobPart = typeof content === "string" ? content : content.buffer.slice(content.byteOffset, content.byteOffset + content.byteLength) as ArrayBuffer;
  const data = new FormData(); data.set("file", new File([part], filename, { type: mime })); return data;
}

const liveAI = process.env.VALIDATION_LIVE_AI === "1";

async function execute(validationCase: ValidationCase): Promise<RecordResult> {
  const ai: AIClassifier = async () => ({ document_type: validationCase.expectedDocumentType, confidence: validationCase.aiConfidence ?? 0.88, document_family: familyForDocumentType(validationCase.expectedDocumentType) });
  const dependencies = validationCase.expectedSource === "local" ? { aiClassifier: async () => { throw new Error("Expected local case invoked AI fallback."); } } : liveAI ? {} : { aiClassifier: ai };
  const result = await runDocumentClassifier(form(validationCase.filename, validationCase.content, validationCase.filename.endsWith(".txt") ? "text/plain" : "text/csv"), dependencies);
  const response = result.response;
  const passed = response.classification.document_type === validationCase.expectedDocumentType && response.routing.recommended_agent === validationCase.expectedRoute && response.classification_source === validationCase.expectedSource;
  return { test_id: validationCase.testId, filename: validationCase.filename, expected_document_type: validationCase.expectedDocumentType, actual_document_type: response.classification.document_type, expected_route: validationCase.expectedRoute, actual_route: response.routing.recommended_agent, confidence: response.classification.confidence, classification_source: response.classification_source, openai_call_count: response.openai_call_count, review_required: response.routing.review_required, duration_ms: response.timing.total_ms, pass_fail: passed ? "PASS" : "FAIL", notes: validationCase.notes };
}

async function benchmarkRealWorkbook(): Promise<RecordResult | null> {
  const workbookPath = path.resolve("test-input/1.xlsx");
  if (!fs.existsSync(workbookPath)) return null;
  const data = form("1.xlsx", fs.readFileSync(workbookPath), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  const result = await runDocumentClassifier(data, { aiClassifier: async () => { throw new Error("Protected benchmark must remain on the zero-OpenAI fast path."); } });
  const response = result.response;
  const passed = response.classification.document_type === "Financial Statements" && response.routing.recommended_agent === "financial_spreading" && response.openai_call_count === 0;
  return { test_id: "REAL-FS-001", filename: "1.xlsx", expected_document_type: "Financial Statements", actual_document_type: response.classification.document_type, expected_route: "financial_spreading", actual_route: response.routing.recommended_agent, confidence: response.classification.confidence, classification_source: response.classification_source, openai_call_count: response.openai_call_count, review_required: response.routing.review_required, duration_ms: response.timing.total_ms, pass_fail: passed ? "PASS" : "FAIL", notes: "Ignored local benchmark; no source content is included in this report." };
}

async function main() {
  if (liveAI) loadEnvConfig(process.cwd(), true, console, true);
  const records = await Promise.all(VALIDATION_CASES.map(execute));
  const benchmark = await benchmarkRealWorkbook(); if (benchmark) records.push(benchmark);
  const passes = records.filter((record) => record.pass_fail === "PASS").length;
  const local = records.filter((record) => record.classification_source === "local");
  const ai = records.filter((record) => record.classification_source !== "local");
  const manual = records.filter((record) => record.review_required);
  const falsePositives = records.filter((record) => record.actual_document_type !== record.expected_document_type && record.confidence > 0.9 && !record.review_required).length;
  const durations = records.map((record) => record.duration_ms);
  const summary = { total_tests: records.length, passes, failures: records.length - passes, accuracy_percent: Number((passes / records.length * 100).toFixed(2)), routing_accuracy_percent: Number((records.filter((record) => record.actual_route === record.expected_route).length / records.length * 100).toFixed(2)), local_classification_percent: Number((local.length / records.length * 100).toFixed(2)), ai_fallback_percent: Number((ai.length / records.length * 100).toFixed(2)), manual_review_percent: Number((manual.length / records.length * 100).toFixed(2)), average_latency_ms: Number((durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(2)), p50_latency_ms: percentile(durations, 0.5), p90_latency_ms: percentile(durations, 0.9), local_latency: { p50_ms: percentile(local.map((record) => record.duration_ms), 0.5), p90_ms: percentile(local.map((record) => record.duration_ms), 0.9), max_ms: Number(Math.max(...local.map((record) => record.duration_ms)).toFixed(2)) }, ai_fallback_latency: { p50_ms: percentile(ai.map((record) => record.duration_ms), 0.5), p90_ms: percentile(ai.map((record) => record.duration_ms), 0.9), max_ms: Number(Math.max(...ai.map((record) => record.duration_ms)).toFixed(2)), measurement: liveAI ? "live OpenAI Responses API" : "deterministic mock" }, false_positive_count: falsePositives };
  const output = { generated_at: new Date().toISOString(), summary, records };
  fs.mkdirSync(path.resolve("tests/results"), { recursive: true });
  fs.writeFileSync(path.resolve("tests/results/document-classifier-validation.json"), `${JSON.stringify(output, null, 2)}\n`);
  const rows = records.map((record) => `| ${record.test_id} | ${record.expected_document_type} | ${record.actual_document_type} | ${record.actual_route} | ${record.confidence.toFixed(2)} | ${record.classification_source} | ${record.openai_call_count} | ${record.review_required} | ${record.duration_ms.toFixed(2)} | ${record.pass_fail} |`).join("\n");
  const markdown = `# Document Classifier Validation\n\nGenerated: ${output.generated_at}\n\n## Summary\n\n- Total: ${summary.total_tests}\n- Passes: ${summary.passes}\n- Classification accuracy: ${summary.accuracy_percent}%\n- Routing accuracy: ${summary.routing_accuracy_percent}%\n- Local / AI: ${summary.local_classification_percent}% / ${summary.ai_fallback_percent}%\n- Manual review: ${summary.manual_review_percent}%\n- False-positive automatic routes: ${summary.false_positive_count}\n- Overall P50 / P90: ${summary.p50_latency_ms} ms / ${summary.p90_latency_ms} ms\n- Local P50 / P90 / max: ${summary.local_latency.p50_ms} / ${summary.local_latency.p90_ms} / ${summary.local_latency.max_ms} ms\n- AI fallback P50 / P90 / max: ${summary.ai_fallback_latency.p50_ms} / ${summary.ai_fallback_latency.p90_ms} / ${summary.ai_fallback_latency.max_ms} ms (${summary.ai_fallback_latency.measurement})\n\n## Matrix\n\n| Test | Expected type | Actual type | Route | Confidence | Source | AI calls | Review | Duration ms | Result |\n|---|---|---|---|---:|---|---:|---|---:|---|\n${rows}\n\nAI fallback measurement: ${summary.ai_fallback_latency.measurement}. Ordinary unit tests remain deterministic and make no network calls. The production fallback contract remains the compact strict schema.\n`;
  fs.writeFileSync(path.resolve("tests/results/document-classifier-validation.md"), markdown);
  console.log(JSON.stringify(summary));
  if (summary.accuracy_percent < 90 || summary.routing_accuracy_percent < 95 || summary.false_positive_count > 0 || summary.failures > 0) process.exitCode = 1;
}

void main();
