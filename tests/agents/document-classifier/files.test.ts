import test from "node:test"; import assert from "node:assert/strict"; import { inspectUploadedFile } from "../../../backend/lib/files"; import { runDocumentClassifier } from "../../../backend/api/agents/document-classifier/run"; import { DOCUMENT_CLASSIFIER_MAX_FILE_BYTES } from "../../../lib/document-classifier-upload";
test("rejects missing file", async () => assert.rejects(() => inspectUploadedFile(null), { code: "FILE_MISSING" }));
test("rejects unsupported type", async () => assert.rejects(() => inspectUploadedFile(new File(["x"], "x.exe", { type: "application/octet-stream" })), { code: "UNSUPPORTED_FILE_TYPE" }));
test("accepts synthetic CSV", async () => { const result = await inspectUploadedFile(new File(["Account,Debit,Credit\n1000,100,0"], "trial.csv", { type: "text/csv" })); assert.equal(result.extension, ".csv"); });
test("rejects corrupt magic signature", async () => assert.rejects(() => inspectUploadedFile(new File(["not pdf"], "x.pdf", { type: "application/pdf" })), { code: "FILE_CORRUPT" }));
test("rejects extension and MIME mismatch", async () => assert.rejects(() => inspectUploadedFile(new File(["x"], "x.csv", { type: "application/pdf" })), { code: "UNSUPPORTED_FILE_TYPE" }));
test("rejects oversized files", async () => {
  await assert.rejects(() => inspectUploadedFile(new File([new Uint8Array(DOCUMENT_CLASSIFIER_MAX_FILE_BYTES + 1)], "x.csv", { type: "text/csv" })), { code: "FILE_TOO_LARGE" });
});
test("accepts a file exactly at the temporary boundary", async () => {
  const file = await inspectUploadedFile(new File([new Uint8Array(DOCUMENT_CLASSIFIER_MAX_FILE_BYTES)], "x.csv", { type: "text/csv" }));
  assert.equal(file.size, 4_500_000);
});
test("requires exactly one field named file", async () => {
  const extra = new FormData(); extra.set("file", new File(["x"], "x.csv", { type: "text/csv" })); extra.set("note", "x");
  await assert.rejects(() => runDocumentClassifier(extra), { code: "FILE_MISSING" });
  const duplicate = new FormData(); duplicate.append("file", new File(["x"], "x.csv", { type: "text/csv" })); duplicate.append("file", new File(["y"], "y.csv", { type: "text/csv" }));
  await assert.rejects(() => runDocumentClassifier(duplicate), { code: "FILE_MISSING" });
});
