import test from "node:test";
import assert from "node:assert/strict";
import { getDocumentClassifierConfig, mapOpenAIError } from "../../../backend/lib/openai";

test("missing model configuration is a controlled 503", () => {
  const before = { key: process.env.OPENAI_API_KEY, model: process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL };
  delete process.env.OPENAI_API_KEY; delete process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL;
  assert.throws(() => getDocumentClassifierConfig(), { code: "MODEL_SERVICE_UNAVAILABLE", httpStatus: 503 });
  if (before.key === undefined) delete process.env.OPENAI_API_KEY; else process.env.OPENAI_API_KEY = before.key;
  if (before.model === undefined) delete process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL; else process.env.OPENAI_DOCUMENT_CLASSIFIER_MODEL = before.model;
});

test("timeout, rate limit, and provider failures map without provider details", () => {
  const timeout = new Error("sensitive timeout body"); timeout.name = "AbortError";
  assert.equal(mapOpenAIError(timeout).code, "OPENAI_TIMEOUT");
  assert.equal(mapOpenAIError({ status: 429, body: "sensitive" }).code, "OPENAI_RATE_LIMIT");
  const unavailable = mapOpenAIError({ status: 503, body: "sensitive" });
  assert.equal(unavailable.code, "MODEL_SERVICE_UNAVAILABLE");
  assert.equal(unavailable.message.includes("sensitive"), false);
});
