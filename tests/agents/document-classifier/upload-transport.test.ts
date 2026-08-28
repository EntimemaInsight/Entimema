import test from "node:test";
import assert from "node:assert/strict";
import { DOCUMENT_CLASSIFIER_UPLOAD_FAILURE, safeClassifierPayload } from "../../../lib/document-classifier-upload";

test("non-JSON, empty, and invalid JSON transport responses are controlled", async () => {
  assert.equal(await safeClassifierPayload(new Response("<html>gateway error</html>", { headers: { "content-type": "text/html" } })), null);
  assert.equal(await safeClassifierPayload(new Response("", { headers: { "content-type": "text/plain" } })), null);
  assert.equal(await safeClassifierPayload(new Response("not-json", { headers: { "content-type": "application/json" } })), null);
  assert.equal(DOCUMENT_CLASSIFIER_UPLOAD_FAILURE, "The file could not be uploaded. Please try again with a file smaller than 4.5 MB.");
});
