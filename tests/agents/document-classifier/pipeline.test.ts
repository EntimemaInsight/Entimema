import test from "node:test";
import assert from "node:assert/strict";
import { runDocumentClassifier } from "../../../backend/api/agents/document-classifier/run";
import type { AIClassifier } from "../../../backend/agents/document-classifier/classifier";

function form(text: string) {
  const data = new FormData();
  data.set("file", new File([text], "synthetic.csv", { type: "text/csv" }));
  return data;
}

test("local fast path skips OpenAI and returns timing", async () => {
  let calls = 0;
  const ai: AIClassifier = async () => { calls++; return { document_type: "Unknown", confidence: 0.1, document_family: "Unknown" }; };
  const result = await runDocumentClassifier(form("Revenue,Cost of Sales,Gross Profit,EBITDA,Net Income,Total Assets,Liabilities,Equity,Cash,Inventory,Receivables"), { aiClassifier: ai });
  assert.equal(calls, 0);
  assert.equal(result.response.classification_source, "local");
  assert.equal(result.response.openai_call_count, 0);
  assert.equal(result.response.execution.find((step) => step.node === "ai_fallback")?.status, "skipped");
  assert.equal(result.response.routing.recommended_agent, "financial_spreading");
  assert.ok(result.response.timing.total_ms >= 0);
  assert.equal(result.response.timing.ai_classification_ms, 0);
});

test("ambiguous path invokes AI", async () => {
  let calls = 0;
  const ai: AIClassifier = async () => { calls++; return { document_type: "Trial Balance", confidence: 0.95, document_family: "Accounting" }; };
  const result = await runDocumentClassifier(form("Internal business export with reference and amount"), { aiClassifier: ai });
  assert.equal(calls, 1);
  assert.equal(result.response.classification_source, "ai");
  assert.equal(result.response.openai_call_count, 1);
  assert.equal(result.response.execution.find((step) => step.node === "ai_fallback")?.status, "completed");
});

test("low AI confidence routes to manual review", async () => {
  const ai: AIClassifier = async () => ({ document_type: "Financial Statements", confidence: 0.42, document_family: "Finance" });
  const result = await runDocumentClassifier(form("Ambiguous internal export"), { aiClassifier: ai });
  assert.equal(result.response.routing.recommended_agent, "manual_review");
  assert.equal(result.response.routing.review_required, true);
});
