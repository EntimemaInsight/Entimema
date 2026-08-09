export const topicOptions = {
  "cfo-function": "CFO функция",
  "budgets-and-forecasting": "Бюджети и прогнози",
  "management-reporting": "Управленска отчетност",
  "cost-profitability": "Себестойност и рентабилност",
  "financial-data": "Финансови данни",
  "financial-ai-agents": "Финансови AI агенти",
  "credit-risk": "Кредитен риск",
  "aml-compliance": "AML и съответствие",
  "decision-automation": "Автоматизация на решения",
  "risk-ai-agents": "Рискови AI агенти",
} as const;

export type TopicKey = keyof typeof topicOptions;

export function isTopicKey(value: string): value is TopicKey {
  return Object.prototype.hasOwnProperty.call(topicOptions, value);
}
