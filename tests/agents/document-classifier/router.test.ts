import test from "node:test"; import assert from "node:assert/strict"; import { routeClassification } from "../../../backend/agents/document-classifier/router"; import type { Classification } from "../../../backend/agents/document-classifier/schema";
function item(confidence: number, document_type: Classification["document_type"] = "Trial Balance"): Classification { return { document_family: document_type === "Unknown" ? "Unknown" : "Accounting", document_type, document_subtype: null, source_system: null, entity_name: null, reporting_period: null, currency: null, language: null, confidence, data_quality: "good", issues: [] }; }
test("high confidence routes automatically", () => assert.deepEqual(routeClassification(item(0.8)), { recommended_agent: "financial_spreading", review_required: false }));
test("medium confidence requires review", () => assert.equal(routeClassification(item(0.6)).review_required, true));
test("low confidence routes manually", () => assert.equal(routeClassification(item(0.59)).recommended_agent, "manual_review"));
test("unknown routes manually", () => assert.equal(routeClassification(item(0.99, "Unknown")).recommended_agent, "manual_review"));
