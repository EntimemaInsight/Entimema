import test from "node:test";
import assert from "node:assert/strict";
import { createDocumentClassifierPostHandler } from "../../../backend/api/agents/document-classifier/http";
import { AgentError } from "../../../backend/lib/errors";
import type { AgentLog } from "../../../backend/lib/logging";

const allow = async () => ({ actorId: "actor-safe-id" });
const limiter = { async consume() {} };
const sensitive = "CONFIDENTIAL revenue 987654 customer Secret Holdings";
const request = (body?: FormData) => new Request("http://localhost/api/agents/document-classifier/run", { method: "POST", body });

test("unauthenticated POST returns 401 before multipart parsing or classification", async () => {
  let parsed = 0, classified = 0;
  const input = new Request("http://localhost/run", { method: "POST" });
  Object.defineProperty(input, "formData", { value: async () => { parsed++; return new FormData(); } });
  const handler = createDocumentClassifierPostHandler({ authorize: async () => { throw new AgentError("AUTHENTICATION_REQUIRED", 401); }, rateLimiter: limiter, classifier: async () => { classified++; throw new Error("unreachable"); }, logger() {} });
  const response = await handler(input);
  assert.equal(response.status, 401); assert.equal(parsed, 0); assert.equal(classified, 0);
  assert.equal((await response.json()).error_code, "AUTHENTICATION_REQUIRED");
});

test("authenticated but disallowed identity returns 403 before body parsing", async () => {
  let parsed = 0;
  const input = new Request("http://localhost/run", { method: "POST" });
  Object.defineProperty(input, "formData", { value: async () => { parsed++; return new FormData(); } });
  const handler = createDocumentClassifierPostHandler({ authorize: async () => { throw new AgentError("ACCESS_FORBIDDEN", 403); }, rateLimiter: limiter, logger() {} });
  const response = await handler(input);
  assert.equal(response.status, 403); assert.equal(parsed, 0);
  assert.equal((await response.json()).error_code, "ACCESS_FORBIDDEN");
});

test("allowed identity reaches the classifier and local path makes no model call", async () => {
  let modelCalls = 0;
  const form = new FormData();
  form.set("file", new File(["Revenue,Cost of Sales,Gross Profit,EBITDA,Net Income,Total Assets,Liabilities,Equity,Cash,Inventory,Receivables"], "synthetic.csv", { type: "text/csv" }));
  const handler = createDocumentClassifierPostHandler({ authorize: allow, rateLimiter: limiter, classifier: async (data) => {
    const { runDocumentClassifier } = await import("../../../backend/api/agents/document-classifier/run");
    return runDocumentClassifier(data, { aiClassifier: async () => { modelCalls++; throw new Error("model must not run"); } });
  }, logger() {} });
  const response = await handler(request(form)); const payload = await response.json();
  assert.equal(response.status, 200); assert.equal(payload.classification_source, "local"); assert.equal(modelCalls, 0);
});

test("malformed multipart is a controlled 400", async () => {
  const handler = createDocumentClassifierPostHandler({ authorize: allow, rateLimiter: limiter, logger() {} });
  const response = await handler(new Request("http://localhost/run", { method: "POST", headers: { "content-type": "multipart/form-data; boundary=missing" }, body: "invalid" }));
  assert.equal(response.status, 400); assert.equal((await response.json()).error_code, "FILE_MISSING");
});

test("execution logs contain safe metadata but not document content", async () => {
  const entries: AgentLog[] = [];
  const form = new FormData(); form.set("file", new File([sensitive], "synthetic.txt", { type: "text/plain" }));
  const handler = createDocumentClassifierPostHandler({ authorize: allow, rateLimiter: limiter, classifier: async (data) => {
    const { runDocumentClassifier } = await import("../../../backend/api/agents/document-classifier/run");
    return runDocumentClassifier(data, { aiClassifier: async () => ({ document_type: "Unknown", document_family: "Unknown", confidence: 0.2 }) });
  }, logger(_level, entry) { entries.push(entry); } });
  assert.equal((await handler(request(form))).status, 200);
  assert.equal(JSON.stringify(entries).includes(sensitive), false);
  assert.equal(entries[0]?.actor_id, "actor-safe-id");
});
