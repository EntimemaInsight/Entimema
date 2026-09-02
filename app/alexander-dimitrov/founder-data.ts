import { publishedResources } from "../resources/resource-data";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL } from "@/lib/structured-data";

export const founderName = "Alexander Dimitrov";
export const founderAlternateNames = ["Aleksandar Dimitrov", "Александър Димитров"] as const;
export const portraitPath = "/alexander-dimitrov-founder-natural.jpg";
export const portraitAlt = "Alexander Dimitrov, Founder of Entimema";
export const founderUrl = `${SITE_URL}/alexander-dimitrov`;
export const founderPageId = `${founderUrl}#profile-page`;
export const portraitId = `${founderUrl}#portrait`;

// Practitioner facts are limited to the previously approved Founder biography.
// The thematic passages below interpret those disciplines, not additional career history.
export const profileIntro = "Founder of Entimema, a decision-intelligence company connecting financial evidence, quantitative models, deterministic controls, AI reasoning and human judgment within traceable Finance and Risk workflows.";
export const identityStatement = "Aleksandar Dimitrov · Александър Димитров";
export const biography = [
  "Alexander’s work is centred on a question that precedes any individual model or technology: how financial reality becomes data, how that data acquires meaning, how uncertainty is represented, and how evidence is transformed into decisions that an institution can explain, control and act upon.",
  "Entimema emerged from the conviction that better financial decisions require more than better models or greater automation. They require a coherent architecture through which evidence, analysis, judgment and action remain connected.",
];
export const thesis = "The value of a model is not determined by complexity alone. It is determined by whether the model can operate responsibly inside a real institution—across its data, definitions, systems, constraints and decision accountabilities.";

// Preserve the existing Person-schema vocabulary and shared identity conventions.
export const areas = [
  { title: "Financial Management", description: "Management reporting, planning, controlling, cost and margin architecture." },
  { title: "Credit Risk & Decision Science", description: "Credit-risk methodology, quantitative analysis, decision strategies and model governance." },
  { title: "Systems & Data", description: "SAP, ERP environments, financial data structures, reconciliation and evidence lineage." },
  { title: "AI & Controlled Workflows", description: "AI-assisted financial processes combining model interpretation, deterministic controls and human review." },
];

export const foundations = [
  { title: "Financial meaning", description: "Financial data is not a neutral representation of reality. Definitions, recognition rules, classifications, periods and management perspectives determine what a number means before it enters any model. Reliable decisions begin by preserving that meaning as information moves from source transactions to analysis." },
  { title: "Data and representation", description: "Analytical work transforms financial events into variables, structures and comparable observations. That transformation requires choices about granularity, time, missing information, reconciliation and measurement. Unless those choices remain visible, analytical precision can conceal uncertainty in the underlying evidence." },
  { title: "Risk and uncertainty", description: "Quantitative models make patterns, probabilities and decision boundaries explicit, but a model is always a representation rather than the decision itself. Its outputs acquire institutional meaning only when assumptions, limitations, uncertainty and consequences are understood in the context in which the model is used." },
  { title: "Systems and decision execution", description: "Enterprise systems and workflows determine how evidence, models and rules operate beyond the analytical environment. A decision becomes institutionally usable when its inputs can be traced, its calculations controlled, its uncertainty surfaced and material exceptions directed to human judgment." },
];
export const structuralProblems = [
  { title: "Data", description: "Availability does not establish meaning. The origin, definition and transformation of financial data determine what can legitimately be concluded from it." },
  { title: "Models", description: "An analytical output is not yet a decision. Its assumptions, uncertainty and intended use must remain visible when it enters an operational process." },
  { title: "Rules", description: "A deterministic result may be reproducible while its underlying business logic remains implicit, outdated or disconnected from the evidence it governs." },
  { title: "Automation", description: "Execution does not, by itself, establish control. A faster process can reproduce the same ambiguity at greater speed and scale." },
];
export const principles = [
  "Models can interpret patterns, estimate uncertainty and support judgment. Deterministic controls must continue to own arithmetic, reconciliations, accounting identities and fixed decision constraints.",
  "Human judgment remains necessary where evidence is incomplete, definitions conflict or consequences are material. Traceability keeps the path from source evidence to conclusion open to examination. Practical usability allows the reasoning to survive beyond the analytical environment in which it was created.",
  "The objective is not to remove professional judgment from Finance and Risk. It is to give that judgment a stronger evidential and operational structure.",
];
export const whyEntimema = [
  "Entimema operates within an emerging category: Decision Intelligence for Finance and Risk.",
  "Its purpose is to connect financial evidence, analytical models, deterministic rules, AI-assisted interpretation and human judgment within end-to-end workflows. The workflow—not an isolated model or AI agent—is the relevant product boundary.",
  "This means moving beyond the automation of individual tasks toward an institutional architecture in which data can be interpreted without losing its financial meaning, calculations can be controlled, uncertainty can be made explicit, exceptions can reach the right person and every material conclusion can be traced back to its evidence.",
  "Entimema turns that thesis into a programme of work across practitioner research, financial methodologies, decision workflows and Financial Intelligence products. The ambition is to make specialist reasoning reusable without making it opaque—and operational without separating it from human responsibility.",
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
  knowsAbout: areas.map(({ title }) => title),
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
