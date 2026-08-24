import test from "node:test";
import assert from "node:assert/strict";
import { classifyFingerprint } from "../../../backend/agents/document-classifier/local-classifier";
import type { DocumentFingerprint } from "../../../backend/agents/document-classifier/fingerprint";

function fingerprint(text: string): DocumentFingerprint {
  return { fileName: "synthetic.csv", extension: ".csv", mimeType: "text/csv", sheetNames: [], headers: [], representativeRows: [], dimensions: ["10x8"], dateSignals: [], currencySignals: [], textWindow: text };
}

const cases = [
  ["Financial Statements", "Revenue Cost of Sales Gross Profit EBITDA Net Income Total Assets Liabilities Equity Cash Inventory Receivables"],
  ["Trial Balance", "Account Account Description Opening Balance Debit Credit Closing Balance"],
  ["Accounts Receivable Aging", "Customer Invoice Document Number Posting Date Due Date Amount Currency Days Overdue"],
  ["General Ledger", "GL Account Posting Date Document Number Debit Credit Amount Text Cost Center Profit Center"],
  ["Bank Statement", "Value Date Transaction Date IBAN Counterparty Debit Credit Balance Reference"],
] as const;

for (const [documentType, text] of cases) {
  test(`strong ${documentType} fingerprint`, () => {
    const result = classifyFingerprint(fingerprint(text));
    assert.equal(result.local_document_type, documentType);
    assert.ok(result.local_confidence >= 0.92);
    assert.ok(result.local_signals.length >= 4);
  });
}

test("ambiguous fingerprint remains below fast-path threshold", () => {
  const result = classifyFingerprint(fingerprint("Internal report reference amount date"));
  assert.ok(result.local_confidence < 0.75);
});
