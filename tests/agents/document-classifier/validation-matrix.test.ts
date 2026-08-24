import test from "node:test";
import assert from "node:assert/strict";
import { classifyFingerprint } from "../../../backend/agents/document-classifier/local-classifier";
import { routeClassification } from "../../../backend/agents/document-classifier/router";
import type { DocumentFingerprint } from "../../../backend/agents/document-classifier/fingerprint";
import { VALIDATION_CASES } from "../../validation/document-classifier-cases";

function fingerprint(filename: string, textWindow: string): DocumentFingerprint { return { fileName: filename, extension: filename.endsWith(".txt") ? ".txt" : ".csv", mimeType: filename.endsWith(".txt") ? "text/plain" : "text/csv", sheetNames: [], headers: textWindow.split(/\r?\n/)[0]?.split(",") ?? [], representativeRows: [], dimensions: [], dateSignals: [], currencySignals: [], textWindow }; }

for (const validationCase of VALIDATION_CASES.filter((entry) => entry.expectedSource === "local")) {
  test(`matrix ${validationCase.testId}: ${validationCase.expectedDocumentType}`, () => {
    const local = classifyFingerprint(fingerprint(validationCase.filename, validationCase.content));
    assert.equal(local.local_document_type, validationCase.expectedDocumentType);
    assert.ok(local.local_confidence >= 0.92);
    const route = routeClassification({ document_family: "Other", document_type: local.local_document_type, document_subtype: null, source_system: null, entity_name: null, reporting_period: null, currency: null, language: null, confidence: local.local_confidence, data_quality: "good", issues: [] });
    assert.equal(route.recommended_agent, validationCase.expectedRoute);
  });
}
