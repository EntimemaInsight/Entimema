import type { AgentGlyphName } from "./AgentGlyphs";
export const agentCategories = ["All", "Onboarding", "Finance", "Credit", "Risk & Compliance"] as const;
export type AgentCategory = Exclude<(typeof agentCategories)[number], "All">;
export type AgentDefinition = { id: string; slug: string; name: string; href: string; categories: readonly AgentCategory[]; glyph: AgentGlyphName; tone: 1 | 2 | 3 | 4 | 5 | 6 };
export const agents: readonly AgentDefinition[] = [
  { id: "application-completeness", slug: "application-completeness", name: "Application Completeness Agent", href: "/services/risk-ai-agents", categories: ["Onboarding", "Credit"], glyph: "closure", tone: 1 },
  { id: "document-classification", slug: "document-classification", name: "Document Classification Agent", href: "/services/risk-ai-agents", categories: ["Onboarding"], glyph: "ordering", tone: 4 },
  { id: "financial-statement-extraction", slug: "financial-statement-extraction", name: "Financial Statement Extraction Agent", href: "/services/financial-ai-agents", categories: ["Onboarding", "Finance", "Credit"], glyph: "extraction", tone: 2 },
  { id: "financial-spreading", slug: "financial-spreading", name: "Financial Spreading Agent", href: "/services/financial-ai-agents", categories: ["Finance", "Credit"], glyph: "normalization", tone: 5 },
  { id: "credit-memo", slug: "credit-memo", name: "Credit Memo Agent", href: "/services/credit-risk", categories: ["Credit"], glyph: "synthesis", tone: 3 },
  { id: "credit-vintage-analysis", slug: "credit-vintage-analysis", name: "Credit Vintage Analysis Agent", href: "/resources/credit-vintage-analysis", categories: ["Credit"], glyph: "cohorts", tone: 6 },
  { id: "portfolio-monitoring", slug: "portfolio-monitoring", name: "Portfolio Monitoring Agent", href: "/services/credit-risk", categories: ["Credit", "Risk & Compliance"], glyph: "observation", tone: 2 },
  { id: "pd-model-monitoring", slug: "pd-model-monitoring", name: "PD Model Monitoring Agent", href: "/resources/pd-model-monitoring", categories: ["Credit", "Risk & Compliance"], glyph: "stability", tone: 4 },
  { id: "ifrs-9-ecl-analysis", slug: "ifrs-9-ecl-analysis", name: "IFRS 9 / ECL Analysis Agent", href: "/resources/ifrs-9-expected-credit-loss-architecture", categories: ["Finance", "Risk & Compliance"], glyph: "stages", tone: 1 },
  { id: "p-and-l-variance", slug: "p-and-l-variance", name: "P&L Variance Agent", href: "/services/management-reporting", categories: ["Finance"], glyph: "deviation", tone: 5 },
  { id: "cost-and-margin", slug: "cost-and-margin", name: "Cost & Margin Agent", href: "/services/cost-and-profitability", categories: ["Finance"], glyph: "residual", tone: 3 },
  { id: "budget-and-scenario", slug: "budget-and-scenario", name: "Budget & Scenario Agent", href: "/services/budgets-and-forecasting", categories: ["Finance"], glyph: "branching", tone: 6 },
];
