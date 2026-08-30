import { publishedResources } from "../resources/resource-data";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL } from "@/lib/structured-data";

export const founderName = "Alexander Dimitrov";
export const portraitPath = "/alexander-dimitrov-founder-natural.jpg";
export const portraitAlt = "Alexander Dimitrov, Founder of Entimema";
export const founderUrl = `${SITE_URL}/alexander-dimitrov`;

// Practitioner facts are limited to the previously approved Founder biography.
// The thematic passages below interpret those disciplines, not additional career history.
export const profileIntro = "His work sits across finance, accounting and controlling, credit risk, financial systems and decision architecture.";
export const biography = [
  "Alexander Dimitrov’s experience spans financial management, SAP and ERP environments, credit risk, quantitative analysis and automation.",
  "At Entimema, he leads the development of financial methodologies, decision workflows, practitioner research and AI-assisted products.",
];
export const thesis = "The best model is not the most complex one. It is the one that can operate inside a real organisation—across its data, systems, constraints and decision responsibilities.";

// Preserve the existing Person-schema vocabulary and shared identity conventions.
export const areas = [
  { title: "Financial Management", description: "Management reporting, planning, controlling, cost and margin architecture." },
  { title: "Credit Risk & Decision Science", description: "Credit-risk methodology, quantitative analysis, decision strategies and model governance." },
  { title: "Systems & Data", description: "SAP, ERP environments, financial data structures, reconciliation and evidence lineage." },
  { title: "AI & Controlled Workflows", description: "AI-assisted financial processes combining model interpretation, deterministic controls and human review." },
];

export const foundations = [
  { title: "Finance", description: "Planning, reporting, cost and margin architecture connect measurement to management choices. The question is what a number allows someone to understand and decide." },
  { title: "Accounting & controlling", description: "Accounting and controlling provide the financial basis for those choices. Reconciliation and consistent financial logic make that basis explainable and open to review." },
  { title: "Credit risk & decision science", description: "Credit-risk methodology and quantitative analysis bring uncertainty and decision boundaries into view. Model governance keeps interpretation connected to the responsibilities of the decision." },
  { title: "Systems & decision workflows", description: "SAP, ERP and financial data structures connect the model to its operating environment. Controlled workflows carry evidence, interpretation and human review into repeatable use." },
];
export const structuralProblems = [
  { title: "Data", description: "Availability does not ensure understanding." },
  { title: "Models", description: "An analytical result is not yet a decision." },
  { title: "Reports", description: "Information does not determine what happens next." },
  { title: "Automation", description: "Execution does not, by itself, establish control." },
];
export const principles = [
  "Model interpretation gives financial information meaning. Deterministic controls test the calculations and constraints on which a decision depends.",
  "Human judgement remains responsible for the conclusion. Traceability makes the path open to review; practical usability makes it possible to work with the result.",
];
export const whyEntimema = [
  "The practitioner question becomes an institutional one: how can financial decisions be made understandable, traceable and useful inside the organisation?",
  "Entimema gives that question a programme of work: financial methodologies, decision workflows, practitioner research and AI-assisted products. Specialist knowledge becomes a system that can be used, examined and improved.",
];
export const productBridge = "The same concerns—financial data, reconciliation, evidence lineage, model interpretation, deterministic controls and human review—come together in Financial Intelligence as operational financial workflows.";
export const researchQuestions: Record<string, string> = {
  "ai-financial-analysis-models-rules-controls": "What should a model interpret, and what must a financial control verify?",
  "financial-data-lineage": "Can a financial conclusion be followed back to its source?",
  "management-reporting-for-cfo-decisions": "Which information helps a CFO make the decision?",
  "credit-scorecard-development-explainable-risk-ranking": "How does borrower data become an explainable lending signal?",
  "traceable-financial-analysis-workflow": "How can evidence remain visible from intake to management review?",
  "beyond-spreadsheet-automation": "What makes a financial model repeatable and controlled in use?",
};

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
