import test from "node:test";
import assert from "node:assert/strict";
import { runDocumentClassifier } from "../../../backend/api/agents/document-classifier/run";
import { FingerprintError } from "../../../backend/agents/document-classifier/fingerprint";
import { AgentError } from "../../../backend/lib/errors";
import type { AIClassifier } from "../../../backend/agents/document-classifier/classifier";

function syntheticPdf(text = "") {
  const escaped = text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
  const stream = text ? `BT /F1 11 Tf 72 720 Td (${escaped}) Tj ET` : "";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
  ];
  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(Buffer.byteLength(body)); body += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  body += offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`).join("");
  body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const form = new FormData();
  form.set("file", new File([body], "synthetic.pdf", { type: "application/pdf" }));
  return form;
}

function extractedPdfFingerprint(text: string) {
  return async () => ({ fileName: "synthetic.pdf", extension: ".pdf", mimeType: "application/pdf", sheetNames: [], headers: [text], representativeRows: [[text]], dimensions: ["1x1"], dateSignals: [], currencySignals: [], textWindow: text });
}
const forbiddenAI: AIClassifier = async () => { throw new Error("AI should not be called"); };

test("normal text PDF retains the local fast path", async () => {
  const result = await runDocumentClassifier(syntheticPdf("Revenue Cost of Sales Gross Profit EBITDA Net Income Total Assets Liabilities Equity Cash Inventory Receivables"), { aiClassifier: forbiddenAI, fingerprintFactory: extractedPdfFingerprint("Revenue Cost of Sales Gross Profit EBITDA Net Income Total Assets Liabilities Equity Cash Inventory Receivables") });
  assert.equal(result.response.classification_source, "local");
  assert.equal(result.response.openai_call_count, 0);
  assert.equal(result.response.execution.find((step) => step.node === "fingerprint")?.status, "completed");
});

test("weakly structured text PDF uses AI fallback", async () => {
  const ai: AIClassifier = async () => ({ document_type: "Trial Balance", confidence: 0.94, document_family: "Accounting" });
  const result = await runDocumentClassifier(syntheticPdf("Internal reference amount date"), { aiClassifier: ai, fingerprintFactory: extractedPdfFingerprint("Internal reference amount date") });
  assert.equal(result.response.classification_source, "ai");
  assert.equal(result.response.openai_call_count, 1);
  assert.equal(result.response.execution.find((step) => step.node === "fingerprint")?.status, "completed");
});

test("blank valid PDF triggers safe fallback with truthful trace", async () => {
  const ai: AIClassifier = async () => ({ document_type: "Management Report", confidence: 0.83, document_family: "Corporate" });
  const result = await runDocumentClassifier(syntheticPdf(), { aiClassifier: ai });
  assert.equal(result.response.status, "completed");
  assert.equal(result.response.diagnostics[0]?.code, "extraction_failed");
  assert.deepEqual(result.response.execution.map(({ node, status }) => [node, status]), [
    ["file_received", "completed"], ["fingerprint", "failed"], ["local_classification", "skipped"],
    ["ai_fallback", "completed"], ["confidence_check", "completed"], ["routing", "completed"],
  ]);
});

test("parser unavailable is distinguished from extraction failure", async () => {
  const ai: AIClassifier = async () => ({ document_type: "Unknown", confidence: 0.3, document_family: "Unknown" });
  const result = await runDocumentClassifier(syntheticPdf("ignored"), { aiClassifier: ai, fingerprintFactory: async () => { throw new FingerprintError("parser_unavailable"); } });
  assert.equal(result.response.diagnostics[0]?.code, "parser_unavailable");
});

test("fallback uncertainty becomes Unknown manual review", async () => {
  const ai: AIClassifier = async () => ({ document_type: "Unknown", confidence: 0.99, document_family: "Unknown" });
  const result = await runDocumentClassifier(syntheticPdf(), { aiClassifier: ai, fingerprintFactory: async () => { throw new FingerprintError("extraction_failed"); } });
  assert.equal(result.response.classification.document_type, "Unknown");
  assert.equal(result.response.classification.confidence, 0.59);
  assert.equal(result.response.routing.recommended_agent, "manual_review");
  assert.equal(result.response.routing.review_required, true);
});

test("total fallback failure remains a controlled failure", async () => {
  const ai: AIClassifier = async () => { throw new AgentError("CLASSIFICATION_FAILED", 502); };
  await assert.rejects(() => runDocumentClassifier(syntheticPdf(), { aiClassifier: ai, fingerprintFactory: async () => { throw new FingerprintError("extraction_failed"); } }), { code: "CLASSIFICATION_FAILED" });
});

test("empty PDF upload remains invalid", async () => {
  const form = new FormData();
  form.set("file", new File([], "empty.pdf", { type: "application/pdf" }));
  await assert.rejects(() => runDocumentClassifier(form), { code: "FILE_CORRUPT" });
});