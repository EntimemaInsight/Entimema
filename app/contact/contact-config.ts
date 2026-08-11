export const topicOptions = {
  "cfo-function": "CFO Advisory",
  "budgets-and-forecasting": "Planning & Forecasting",
  "management-reporting": "Management Reporting",
  "cost-profitability": "Cost & Margin Management",
  "financial-data": "Financial Data",
  "financial-ai-agents": "Finance AI Agents",
  "credit-risk": "Credit Risk",
  "aml-compliance": "AML & Compliance",
  "decision-automation": "Decision Intelligence",
  "risk-ai-agents": "Risk AI Agents",
} as const;

export const partnershipTypes = [
  "Technology partner",
  "Data or software provider",
  "Consulting partner",
  "Academic or research partnership",
  "Development partner — Entimema Labs",
  "Affiliate partner",
  "Other",
] as const;

export const clientInquiryTypes = [
  "Technical question",
  "Data or model",
  "Change to an existing project",
  "Access or documentation",
  "Other",
] as const;

export const problemAreas = [
  "Financial performance",
  "Risk & forecasting",
  "Management reporting",
  "ERP & data",
  "Other",
] as const;

export type TopicKey = keyof typeof topicOptions;

export function isTopicKey(value: string): value is TopicKey {
  return Object.prototype.hasOwnProperty.call(topicOptions, value);
}

export function problemAreaForTopic(value: string | undefined): typeof problemAreas[number] {
  if (!value || !isTopicKey(value)) return "Other";
  if (value === "management-reporting") return "Management reporting";
  if (value === "financial-data" || value === "financial-ai-agents") return "ERP & data";
  if (value === "credit-risk" || value === "aml-compliance" || value === "decision-automation" || value === "risk-ai-agents") return "Risk & forecasting";
  return "Financial performance";
}
