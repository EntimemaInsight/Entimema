import { publishedResources } from "../resources/resource-data";
import { FINAI_ID, FOUNDER_ID, ORGANIZATION_ID, SITE_URL } from "@/lib/structured-data";

export const founderName = "Alexander Dimitrov";
export const founderAlternateNames = ["Aleksandar Dimitrov", "Александър Димитров"] as const;
export const portraitPath = "/alexander-dimitrov-founder-natural.jpg";
export const portraitAlt = "Alexander Dimitrov, Founder of Entimema";
export const founderUrl = `${SITE_URL}/alexander-dimitrov`;
export const founderPageId = `${founderUrl}#profile-page`;
export const portraitId = `${founderUrl}#portrait`;

// Practitioner facts are limited to the previously approved Founder biography.
// The thematic passages below interpret those disciplines, not additional career history.
export const profileIntro = "Founder of Entimema · Finance, Financial Intelligence and Credit Risk";
export const identityStatement = "Aleksandar Dimitrov · Александър Димитров";
export const biography = [
  "Alexander Dimitrov is a finance and risk practitioner whose experience spans CFO leadership, accounting, controlling, SAP-enabled financial management, credit risk and IFRS 9. He founded Entimema to turn specialist financial reasoning into controlled, traceable workflows that can operate in practice.",
  "His perspective is shaped by recurring operating problems: fragmented source data, inconsistent definitions, spreadsheet-dependent analysis, opaque model outputs and decisions that are difficult to reproduce or defend.",
];
export const thesis = "Financial AI becomes useful only when it preserves meaning, exposes uncertainty and remains accountable to evidence.";

// Preserve the existing Person-schema vocabulary and shared identity conventions.
export const areas = [
  { title: "Financial Management", description: "Management reporting, planning, controlling, cost and margin architecture." },
  { title: "Credit Risk & Decision Science", description: "Credit-risk methodology, quantitative analysis, decision strategies and model governance." },
  { title: "Systems & Data", description: "SAP, ERP environments, financial data structures, reconciliation and evidence lineage." },
  { title: "AI & Controlled Workflows", description: "AI-assisted financial processes combining model interpretation, deterministic controls and human review." },
];

export const foundations = [
  { title: "Finance leadership", description: "Management reporting, planning, performance analysis and the practical requirements of CFO decision support." },
  { title: "Accounting & controlling", description: "Accounting meaning, reconciliations, cost and margin structures, controls and management information." },
  { title: "SAP FI/CO & financial systems", description: "How financial definitions, processes and controls operate across enterprise data and systems." },
  { title: "Credit risk & IFRS 9", description: "Risk methodology, quantitative analysis, model outputs, governance and their connection to credit decisions." },
  { title: "Financial modelling", description: "Models and scenarios designed around the decisions, assumptions and limitations they need to support." },
  { title: "Applied AI", description: "Specialized AI operating inside controlled financial workflows with deterministic validation and human review." },
];
export const structuralProblems = [
  { title: "Data", description: "Availability does not establish meaning. The origin, definition and transformation of financial data determine what can legitimately be concluded from it." },
  { title: "Models", description: "An analytical output is not yet a decision. Its assumptions, uncertainty and intended use must remain visible when it enters an operational process." },
  { title: "Rules", description: "A deterministic result may be reproducible while its underlying business logic remains implicit, outdated or disconnected from the evidence it governs." },
  { title: "Automation", description: "Execution does not, by itself, establish control. A faster process can reproduce the same ambiguity at greater speed and scale." },
];
export const principles = [
  "Financial meaning precedes modelling. A number must retain its definition, period, unit and source before it can support analysis.",
  "A model is not a decision. Models interpret patterns and context; deterministic logic owns arithmetic, reconciliations and fixed controls.",
  "Human judgement remains necessary where evidence is incomplete, definitions conflict or consequences are material.",
];
export const whyEntimema = [
  "Entimema was founded to turn specialist finance and risk reasoning into controlled, repeatable workflows.",
  "The workflow—not an isolated model or AI agent—is the commercial boundary. It connects source evidence, interpretation, calculations, exceptions and human review in one accountable process.",
  "The objective is to make specialist reasoning reusable without making it opaque, and operational without separating it from human responsibility.",
];
export const productBridge = "The same concerns—financial meaning, data representation, reconciliation, evidence lineage, model interpretation, deterministic controls, explicit uncertainty and human review—come together in Entimema Financial Intelligence as operational financial workflows.";
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

// Author bylines may use the alternate Latin transliteration. Resolve both
// spellings to the canonical Founder profile and Person entity.
export const selectedArticles = selectedSlugs.flatMap((slug) => {
  const article = publishedResources.find((resource) => resource.slug === slug);
  return article?.author.affiliation === "Entimema" && article.author.profilePath === "/alexander-dimitrov"
    ? [article]
    : [];
});

export const personSchema = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: founderName,
  alternateName: founderAlternateNames,
  givenName: "Alexander",
  familyName: "Dimitrov",
  nationality: "Bulgarian",
  url: founderUrl,
  image: { "@id": portraitId },
  jobTitle: "Founder",
  worksFor: { "@id": ORGANIZATION_ID },
  sameAs: ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"],
  knowsAbout: [...areas.map(({ title }) => title), { "@id": FINAI_ID }],
};

/**
 * Keep the public profile, portrait and Person in one connected authority graph.
 * The visible portrait remains byte-for-byte unchanged; this only makes its
 * identity, dimensions and relationship to the Founder profile explicit.
 */
export const founderProfileSchema = {
  "@context": "https://schema.org",
  "@graph": [
    personSchema,
    {
      "@type": "ProfilePage",
      "@id": founderPageId,
      url: founderUrl,
      name: `${founderName} | Founder of Entimema`,
      description: profileIntro,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: { "@id": FOUNDER_ID },
      primaryImageOfPage: { "@id": portraitId },
    },
    {
      "@type": "ImageObject",
      "@id": portraitId,
      contentUrl: `${SITE_URL}${portraitPath}`,
      url: `${SITE_URL}${portraitPath}`,
      width: 400,
      height: 400,
      caption: portraitAlt,
      representativeOfPage: true,
      about: { "@id": FOUNDER_ID },
    },
  ],
};
