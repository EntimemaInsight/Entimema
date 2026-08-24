import type { Classification } from "./schema";
import type { DocumentFingerprint } from "./fingerprint";
import type { DocumentFamily, DocumentType } from "./taxonomy";

export type LocalClassification = { local_document_type: DocumentType; local_confidence: number; local_signals: string[] };
type Rule = { type: DocumentType; family: DocumentFamily; requiredGroups: string[][]; optional: string[]; base: number };

const RULES: Rule[] = [
  { type: "Trial Balance", family: "Accounting", requiredGroups: [["account", "account description", "account name"], ["debit"], ["credit"], ["opening balance", "closing balance", "ending balance"]], optional: ["trial balance", "balance brought forward"], base: 0.94 },
  { type: "Accounts Receivable Aging", family: "Accounting", requiredGroups: [["customer", "debtor"], ["invoice", "document number"], ["due date", "days overdue", "aging bucket"], ["amount", "balance"]], optional: ["currency", "posting date", "baseline date", "receivables", "current", "past due"], base: 0.93 },
  { type: "General Ledger", family: "Accounting", requiredGroups: [["gl account", "g/l account", "general ledger"], ["posting date"], ["document number", "document no"], ["amount", "debit", "credit"]], optional: ["cost center", "profit center", "text", "reference"], base: 0.93 },
  { type: "Bank Statement", family: "Treasury", requiredGroups: [["value date", "transaction date"], ["iban", "account number"], ["balance"], ["debit", "credit", "amount"]], optional: ["counterparty", "reference", "bank statement", "transaction description"], base: 0.93 },
  { type: "Financial Statements", family: "Finance", requiredGroups: [["revenue", "sales"], ["gross profit", "operating profit", "ebitda", "net income", "net profit"], ["assets", "total assets"], ["liabilities", "equity", "total equity"]], optional: ["cash", "inventory", "receivables", "cost of sales", "income statement", "balance sheet", "p&l", "profit and loss"], base: 0.95 },
];

const normalize = (value: string) => value.toLowerCase().replace(/[_\-]+/g, " ").replace(/\s+/g, " ").trim();
const includesTerm = (corpus: string, term: string) => corpus.includes(normalize(term));

const FAMILY_BY_TYPE: Partial<Record<DocumentType, DocumentFamily>> = { "Financial Statements": "Finance", "Balance Sheet": "Accounting", "Income Statement": "Accounting", "Cash Flow Statement": "Finance", "Trial Balance": "Accounting", "General Ledger": "Accounting", "Accounts Receivable Aging": "Accounting", "Accounts Payable Aging": "Accounting", "Bank Statement": "Treasury", "Invoice Register": "Accounting", "Sales Invoice": "Commercial", "Purchase Invoice": "Accounting", Budget: "Finance", Forecast: "Finance", "Management Report": "Finance", "Tax Return": "Tax", "VAT Report": "Tax", "Payroll Report": "HR", "Loan Agreement": "Legal", "Credit Application": "Credit Risk", "Covenant Report": "Credit Risk", Contract: "Legal", "Audit Report": "Accounting", "SAP Export": "Operations", "Other Financial Dataset": "Finance", Unknown: "Unknown" };
export function familyForDocumentType(type: DocumentType): DocumentFamily { return FAMILY_BY_TYPE[type] ?? "Other"; }

export function classifyFingerprint(fingerprint: DocumentFingerprint): LocalClassification {
  const corpus = normalize([fingerprint.fileName, ...fingerprint.sheetNames, ...fingerprint.headers, fingerprint.textWindow].join("\n"));
  const candidates = RULES.map((rule) => {
    const groupMatches = rule.requiredGroups.map((group) => group.find((term) => includesTerm(corpus, term))).filter((term): term is string => Boolean(term));
    const optionalMatches = rule.optional.filter((term) => includesTerm(corpus, term));
    const requiredRatio = groupMatches.length / rule.requiredGroups.length;
    const confidence = requiredRatio === 1 ? Math.min(0.99, rule.base + Math.min(0.04, optionalMatches.length * 0.01)) : Math.min(0.74, requiredRatio * 0.7 + Math.min(0.04, optionalMatches.length * 0.01));
    return { type: rule.type, confidence, signals: [...groupMatches, ...optionalMatches] };
  }).sort((a, b) => b.confidence - a.confidence);
  const best = candidates[0];
  if (!best || best.confidence < 0.4) return { local_document_type: "Unknown", local_confidence: best?.confidence ?? 0, local_signals: best?.signals ?? [] };
  return { local_document_type: best.type, local_confidence: Number(best.confidence.toFixed(2)), local_signals: [...new Set(best.signals)] };
}

export function localResultToClassification(result: LocalClassification): Classification {
  return { document_family: familyForDocumentType(result.local_document_type), document_type: result.local_document_type, document_subtype: null, source_system: null, entity_name: null, reporting_period: null, currency: null, language: null, confidence: result.local_confidence, data_quality: result.local_confidence >= 0.92 ? "good" : "fair", issues: [] };
}
