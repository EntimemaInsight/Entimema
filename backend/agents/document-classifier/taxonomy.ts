export const DOCUMENT_FAMILIES = ["Finance", "Accounting", "Treasury", "Tax", "Credit Risk", "Commercial", "Legal", "Corporate", "HR", "Operations", "Other", "Unknown"] as const;
export const DOCUMENT_TYPES = ["Financial Statements", "Balance Sheet", "Income Statement", "Cash Flow Statement", "Trial Balance", "General Ledger", "Accounts Receivable Aging", "Accounts Payable Aging", "Bank Statement", "Invoice Register", "Sales Invoice", "Purchase Invoice", "Budget", "Forecast", "Management Report", "Tax Return", "VAT Report", "Payroll Report", "Loan Agreement", "Credit Application", "Covenant Report", "Contract", "Audit Report", "SAP Export", "Other Financial Dataset", "Unknown"] as const;
export type DocumentFamily = (typeof DOCUMENT_FAMILIES)[number];
export type DocumentType = (typeof DOCUMENT_TYPES)[number];
export const EXPECTED_FAMILIES: Partial<Record<DocumentType, readonly DocumentFamily[]>> = {
  "Financial Statements": ["Finance", "Accounting"], "Balance Sheet": ["Finance", "Accounting"], "Income Statement": ["Finance", "Accounting"],
  "Cash Flow Statement": ["Finance", "Accounting", "Treasury"], "Trial Balance": ["Accounting", "Finance"], "General Ledger": ["Accounting"],
  "Accounts Receivable Aging": ["Accounting", "Finance", "Commercial"], "Accounts Payable Aging": ["Accounting", "Finance", "Operations"],
  "Bank Statement": ["Treasury", "Finance", "Accounting"], Budget: ["Finance"], Forecast: ["Finance"], "Tax Return": ["Tax"],
  "VAT Report": ["Tax", "Accounting"], "Payroll Report": ["HR", "Accounting"], "Loan Agreement": ["Legal", "Credit Risk", "Finance"],
  "Credit Application": ["Credit Risk"], "Covenant Report": ["Credit Risk", "Finance"], Contract: ["Legal", "Commercial"], "Audit Report": ["Accounting", "Finance", "Corporate"],
};
