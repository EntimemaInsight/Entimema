import test from "node:test"; import assert from "node:assert/strict";
import { ModelClassificationSchema } from "../../../backend/agents/document-classifier/schema"; import { parseModelJson } from "../../../backend/agents/document-classifier/validator";
const valid = { document_family: "Accounting", document_type: "Trial Balance", document_subtype: null, source_system: null, entity_name: "Synthetic Ltd.", reporting_period: { from: "2025-01-01", to: "2025-12-31" }, currency: "EUR", language: "English", confidence: 0.96, data_quality: "good", issues: [], recommended_agent: "financial_spreading" };
test("accepts strict schema", () => assert.equal(ModelClassificationSchema.parse(valid).document_type, "Trial Balance"));
test("rejects malformed model output", () => { assert.throws(() => parseModelJson("not json"), { code: "OPENAI_RESPONSE_INVALID" }); assert.throws(() => parseModelJson(JSON.stringify({ ...valid, confidence: 4 })), { code: "OPENAI_RESPONSE_INVALID" }); });
test("caps unknown confidence", () => { const result = parseModelJson(JSON.stringify({ ...valid, document_family: "Unknown", document_type: "Unknown", confidence: 0.95 })); assert.equal(result.confidence, 0.59); });
