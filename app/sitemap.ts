import type { MetadataRoute } from "next";

const routes = [
  "",
  "/about",
  "/contact",
  "/privacy",
  "/services",
  "/services/cfo-function",
  "/services/budgets-and-forecasting",
  "/services/management-reporting",
  "/services/cost-and-profitability",
  "/services/financial-data",
  "/services/financial-ai-agents",
  "/services/credit-risk",
  "/services/aml-compliance",
  "/services/decision-automation",
  "/services/risk-ai-agents",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `https://entimema.net${route}` }));
}
