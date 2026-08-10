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

export type TopicKey = keyof typeof topicOptions;

export function isTopicKey(value: string): value is TopicKey {
  return Object.prototype.hasOwnProperty.call(topicOptions, value);
}
