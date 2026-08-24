import test from "node:test"; import assert from "node:assert/strict"; import { inspectUploadedFile } from "../../../backend/lib/files";
test("rejects missing file", async () => assert.rejects(() => inspectUploadedFile(null), { code: "FILE_MISSING" }));
test("rejects unsupported type", async () => assert.rejects(() => inspectUploadedFile(new File(["x"], "x.exe", { type: "application/octet-stream" })), { code: "UNSUPPORTED_FILE_TYPE" }));
test("accepts synthetic CSV", async () => { const result = await inspectUploadedFile(new File(["Account,Debit,Credit\n1000,100,0"], "trial.csv", { type: "text/csv" })); assert.equal(result.extension, ".csv"); });
