import type { AgentGlyphName } from "./AgentGlyphs";
export const agentCategories = ["All", "Onboarding", "Finance", "Credit", "Risk & Compliance"] as const;
export type AgentCategory = Exclude<(typeof agentCategories)[number], "All">;
export type AgentDefinition = { id: string; slug: string; name: string; categories: readonly AgentCategory[]; glyph: AgentGlyphName; tone: 1 | 2 | 3 | 4 };
export const agents: readonly AgentDefinition[] = [
  { id: "application-completeness", slug: "application-completeness", name: "Application Completeness Agent", categories: ["Onboarding", "Credit"], glyph: "closure", tone: 1 },
  { id: "document-classification", slug: "document-classification", name: "Document Classification Agent", categories: ["Onboarding"], glyph: "ordering", tone: 2 },
  { id: "financial-statement-extraction", slug: "financial-statement-extraction", name: "Financial Statement Extraction Agent", categories: ["Onboarding", "Finance", "Credit"], glyph: "extraction", tone: 3 },
  { id: "financial-spreading", slug: "financial-spreading", name: "Financial Spreading Agent", categories: ["Finance", "Credit"], glyph: "normalization", tone: 4 },
  { id: "credit-memo", slug: "credit-memo", name: "Credit Memo Agent", categories: ["Credit"], glyph: "synthesis", tone: 2 },
  { id: "credit-vintage-analysis", slug: "credit-vintage-analysis", name: "Credit Vintage Analysis Agent", categories: ["Credit"], glyph: "cohorts", tone: 1 },
  { id: "portfolio-monitoring", slug: "portfolio-monitoring", name: "Portfolio Monitoring Agent", categories: ["Credit", "Risk & Compliance"], glyph: "observation", tone: 3 },
  { id: "pd-model-monitoring", slug: "pd-model-monitoring", name: "PD Model Monitoring Agent", categories: ["Credit", "Risk & Compliance"], glyph: "stability", tone: 4 },
  { id: "ifrs-9-ecl-analysis", slug: "ifrs-9-ecl-analysis", name: "IFRS 9 / ECL Analysis Agent", categories: ["Finance", "Risk & Compliance"], glyph: "stages", tone: 1 },
  { id: "p-and-l-variance", slug: "p-and-l-variance", name: "P&L Variance Agent", categories: ["Finance"], glyph: "deviation", tone: 3 },
  { id: "cost-and-margin", slug: "cost-and-margin", name: "Cost & Margin Agent", categories: ["Finance"], glyph: "residual", tone: 4 },
  { id: "budget-and-scenario", slug: "budget-and-scenario", name: "Budget & Scenario Agent", categories: ["Finance"], glyph: "branching", tone: 2 },
];
