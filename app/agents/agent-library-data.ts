export const agentCategories = [
  "All",
  "Onboarding",
  "Finance",
  "Credit",
  "Risk & Compliance",
] as const;

export type AgentCategory = Exclude<(typeof agentCategories)[number], "All">;

export type AgentDefinition = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categories: readonly AgentCategory[];
  visual: string;
};

export const agents: readonly AgentDefinition[] = [
  { id: "application-completeness", slug: "application-completeness", name: "Application Completeness Agent", description: "Checks applications for missing information and required documents.", categories: ["Onboarding", "Credit"], visual: "completeness" },
  { id: "document-classification", slug: "document-classification", name: "Document Classification Agent", description: "Classifies and organises financial and business documents by type and content.", categories: ["Onboarding"], visual: "classification" },
  { id: "financial-statement-extraction", slug: "financial-statement-extraction", name: "Financial Statement Extraction Agent", description: "Extracts and structures financial data from source documents.", categories: ["Onboarding", "Finance", "Credit"], visual: "extraction" },
  { id: "financial-spreading", slug: "financial-spreading", name: "Financial Spreading Agent", description: "Transforms financial statements into structured, analysis-ready data.", categories: ["Finance", "Credit"], visual: "spreading" },
  { id: "credit-memo", slug: "credit-memo", name: "Credit Memo Agent", description: "Structures credit analysis, evidence and rationale into decision-ready output.", categories: ["Credit"], visual: "memo" },
  { id: "credit-vintage-analysis", slug: "credit-vintage-analysis", name: "Credit Vintage Analysis Agent", description: "Analyses portfolio cohorts to identify deterioration patterns and emerging trends.", categories: ["Credit"], visual: "vintage" },
  { id: "portfolio-monitoring", slug: "portfolio-monitoring", name: "Portfolio Monitoring Agent", description: "Monitors portfolio performance and surfaces emerging risk signals.", categories: ["Credit", "Risk & Compliance"], visual: "portfolio" },
  { id: "pd-model-monitoring", slug: "pd-model-monitoring", name: "PD Model Monitoring Agent", description: "Tracks model performance, population stability, calibration and drift.", categories: ["Credit", "Risk & Compliance"], visual: "probability" },
  { id: "ifrs-9-ecl-analysis", slug: "ifrs-9-ecl-analysis", name: "IFRS 9 / ECL Analysis Agent", description: "Analyses expected credit loss movements and impairment drivers.", categories: ["Finance", "Risk & Compliance"], visual: "ecl" },
  { id: "p-and-l-variance", slug: "p-and-l-variance", name: "P&L Variance Agent", description: "Explains performance variances across actual, budget, forecast and prior periods.", categories: ["Finance"], visual: "variance" },
  { id: "cost-and-margin", slug: "cost-and-margin", name: "Cost & Margin Agent", description: "Analyses cost structures, allocation logic and margin performance.", categories: ["Finance"], visual: "margin" },
  { id: "budget-and-scenario", slug: "budget-and-scenario", name: "Budget & Scenario Agent", description: "Builds and evaluates budgets, forecasts and driver-based scenarios.", categories: ["Finance"], visual: "scenario" },
];
