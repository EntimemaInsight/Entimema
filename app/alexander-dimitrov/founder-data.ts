import { publishedResources } from "../resources/resource-data";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL } from "@/lib/structured-data";

export const founderName = "Alexander Dimitrov";
export const portraitPath = "/alexander-dimitrov-founder.webp";
export const portraitAlt = "Alexander Dimitrov, Founder of Entimema";
export const founderUrl = `${SITE_URL}/alexander-dimitrov`;
export const biography = [
  "Alexander Dimitrov is the Founder of Entimema, a financial and decision-intelligence company building controlled systems for finance, risk and high-stakes business decisions.",
  "His work is shaped by experience across financial management, controlling, accounting, SAP and ERP environments, credit risk, quantitative analysis and automation. This combination has given him a practical view of a problem that organisations repeatedly encounter: data, models and systems may all exist, yet still fail to produce a decision that people can understand, control and improve.",
  "At Entimema, Alexander leads the development of financial methodologies, decision workflows, practitioner research and AI-assisted products. His focus is on translating specialist knowledge into traceable systems in which model intelligence, deterministic controls and human judgement each have a clearly defined role.",
];
export const thesis = "The best model is not the most complex one. It is the one that can operate inside a real organisation—across its data, systems, constraints and decision responsibilities.";
export const areas = [
  { title: "Financial Management", description: "Management reporting, planning, controlling, cost and margin architecture." },
  { title: "Credit Risk & Decision Science", description: "Credit-risk methodology, quantitative analysis, decision strategies and model governance." },
  { title: "Systems & Data", description: "SAP, ERP environments, financial data structures, reconciliation and evidence lineage." },
  { title: "AI & Controlled Workflows", description: "AI-assisted financial processes combining model interpretation, deterministic controls and human review." },
];

const selectedSlugs = [
  "ai-financial-analysis-models-rules-controls",
  "financial-data-lineage",
  "management-reporting-for-cfo-decisions",
  "credit-scorecard-development-explainable-risk-ranking",
  "traceable-financial-analysis-workflow",
  "beyond-spreadsheet-automation",
];

// The existing author record identifies the Founder by affiliation and profile
// path. Match that identity without propagating the legacy name spelling or
// changing shared Resources content during this sprint.
export const selectedArticles = selectedSlugs.flatMap((slug) => {
  const article = publishedResources.find((resource) => resource.slug === slug);
  return article?.author.affiliation === "Entimema" && article.author.profilePath === "/about"
    ? [article]
    : [];
});

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: founderName,
  url: founderUrl,
  image: `${SITE_URL}${portraitPath}`,
  jobTitle: "Founder",
  worksFor: { "@id": ORGANIZATION_ID },
  sameAs: ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"],
  knowsAbout: areas.map(({ title }) => title),
};

