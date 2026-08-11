import type { MetadataRoute } from "next";
import { publishedResources } from "./resources/resource-data";

const routes = [
  "",
  "/about",
  "/contact",
  "/privacy",
  "/resources",
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
  const coreRoutes = routes.map((route) => ({ url: `https://entimema.net${route}` }));
  const resourceRoutes = publishedResources.map((resource) => ({
    url: `https://entimema.net${resource.canonicalPath}`,
    lastModified: resource.updatedAt ?? resource.publishedAt,
  }));

  return [...coreRoutes, ...resourceRoutes];
}
