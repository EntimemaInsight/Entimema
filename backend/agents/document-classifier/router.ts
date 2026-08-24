import type { Classification } from "./schema";
import type { DocumentType } from "./taxonomy";
export const ROUTING_MAP: Partial<Record<DocumentType, string>> = {
  "Financial Statements": "financial_spreading", "Balance Sheet": "financial_spreading", "Income Statement": "financial_spreading",
  "Cash Flow Statement": "financial_spreading", "Trial Balance": "financial_spreading", "General Ledger": "financial_data_preparation",
  "Accounts Receivable Aging": "receivables_analysis", "Accounts Payable Aging": "payables_analysis", "Bank Statement": "cash_flow_analysis",
  Budget: "budget_analysis", Forecast: "forecast_analysis", Unknown: "manual_review",
};
const threshold = (name: string, fallback: number) => { const value = Number(process.env[name]); return Number.isFinite(value) && value >= 0 && value <= 1 ? value : fallback; };
export function getConfidenceThresholds() {
  const automatic = threshold("DOCUMENT_CLASSIFIER_AUTOMATIC_THRESHOLD", 0.8), review = threshold("DOCUMENT_CLASSIFIER_REVIEW_THRESHOLD", 0.6);
  return review < automatic ? { automatic, review } : { automatic: 0.8, review: 0.6 };
}
export function routeClassification(classification: Classification) {
  const { automatic, review } = getConfidenceThresholds();
  if (classification.document_type === "Unknown" || classification.confidence < review) return { recommended_agent: "manual_review", review_required: true };
  const recommended_agent = ROUTING_MAP[classification.document_type] ?? "manual_review";
  return { recommended_agent, review_required: classification.confidence < automatic || recommended_agent === "manual_review" };
}
