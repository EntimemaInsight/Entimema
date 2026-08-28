import test from "node:test"; import assert from "node:assert/strict"; import { inspectUploadedFile } from "../../../backend/lib/files"; import { runDocumentClassifier } from "../../../backend/api/agents/document-classifier/run";
test("rejects missing file", async () => assert.rejects(() => inspectUploadedFile(null), { code: "FILE_MISSING" }));
test("rejects unsupported type", async () => assert.rejects(() => inspectUploadedFile(new File(["x"], "x.exe", { type: "application/octet-stream" })), { code: "UNSUPPORTED_FILE_TYPE" }));
test("accepts synthetic CSV", async () => { const result = await inspectUploadedFile(new File(["Account,Debit,Credit\n1000,100,0"], "trial.csv", { type: "text/csv" })); assert.equal(result.extension, ".csv"); });
test("rejects corrupt magic signature", async () => assert.rejects(() => inspectUploadedFile(new File(["not pdf"], "x.pdf", { type: "application/pdf" })), { code: "FILE_CORRUPT" }));
test("rejects extension and MIME mismatch", async () => assert.rejects(() => inspectUploadedFile(new File(["x"], "x.csv", { type: "application/pdf" })), { code: "UNSUPPORTED_FILE_TYPE" }));
test("rejects oversized files", async () => {
  const before = process.env.DOCUMENT_CLASSIFIER_MAX_FILE_BYTES; process.env.DOCUMENT_CLASSIFIER_MAX_FILE_BYTES = "2";
  try { await assert.rejects(() => inspectUploadedFile(new File(["123"], "x.csv", { type: "text/csv" })), { code: "FILE_TOO_LARGE" }); }
  finally { if (before === undefined) delete process.env.DOCUMENT_CLASSIFIER_MAX_FILE_BYTES; else process.env.DOCUMENT_CLASSIFIER_MAX_FILE_BYTES = before; }
});
test("requires exactly one field named file", async () => {
  const extra = new FormData(); extra.set("file", new File(["x"], "x.csv", { type: "text/csv" })); extra.set("note", "x");
  await assert.rejects(() => runDocumentClassifier(extra), { code: "FILE_MISSING" });
  const duplicate = new FormData(); duplicate.append("file", new File(["x"], "x.csv", { type: "text/csv" })); duplicate.append("file", new File(["y"], "y.csv", { type: "text/csv" }));
  await assert.rejects(() => runDocumentClassifier(duplicate), { code: "FILE_MISSING" });
});
