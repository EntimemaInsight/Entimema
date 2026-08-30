import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID } from "../../lib/structured-data";
import { publishedResources } from "../resources/resource-data";

export const labsTitle = "Entimema Labs | Financial Intelligence, Credit Risk and Decision Systems";
export const labsDescription = "Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.";
export const labsUrl = `${SITE_URL}/labs`;

// Resolve canonical records without copying or changing shared publication metadata.
export function researchWork(slug: string) {
  const resource = publishedResources.find((item) => item.slug === slug);
  if (!resource) throw new Error(`Labs references an unpublished or missing resource: ${slug}`);
  return resource;
}
export const evidenceStates = [
  { title: "Open question", description: "An unresolved problem to investigate." },
  { title: "Methodological position", description: "A proposed way to reason, measure or test." },
  { title: "Published research", description: "Work available for inspection and challenge." },
  { title: "Implemented capability", description: "A method put to work within a defined scope." },
] as const;
export const domains = [
  {
    id: "financial-intelligence", title: "Financial Intelligence",
    question: "How can heterogeneous financial information become an analytical model without losing accounting meaning?",
    investigations: [
      "Canonical schemas, data normalisation and the meaning of periods, currencies and units.",
      "Reporting, planning and forecasting logic connected to the decisions they support.",
      "Reconciliation, evidence lineage and the point at which interpretation needs human review.",
    ],
    boundary: "The research scope is wider than the current Income Statement workflow. Reporting, planning and forecasting topics are not all implemented product capabilities.",
    work: ["financial-data-normalisation", "financial-data-validation-control-layer"],
  },
  {
    id: "credit-risk", title: "Credit Risk",
    question: "How should predictive risk models connect to decision strategy, monitoring and governance?",
    investigations: [
      "Scorecards, probability of default and calibration: what a risk estimate does and does not establish.",
      "Portfolio monitoring, decision strategies and early-warning signals across the credit lifecycle.",
      "Validation and explainability in relation to the decision a model is intended to support.",
    ],
    boundary: "This is methodological research. The publications do not imply that Entimema operates a production lending platform or a live credit-decision engine.",
    work: ["credit-decision-engine-architecture", "credit-scorecard-development-explainable-risk-ranking"],
  },
  {
    id: "decision-systems", title: "Decision Systems",
    question: "How can model interpretation, deterministic controls and human judgement form one auditable decision system?",
    investigations: [
      "The relationships between source evidence, claims, assumptions and unresolved unknowns.",
      "Confidence, materiality, exceptions and the conditions for escalation or abstention.",
      "How rules and human review constrain AI-assisted workflows while preserving decision lineage.",
    ],
    boundary: "An architecture defines responsibilities; it does not, by itself, demonstrate accuracy, safe autonomy or empirical validation.",
    work: ["ai-financial-analysis-models-rules-controls", "confidence-human-review-ai-finance"],
  },
] as const;
export const process = [
  { title: "Observe", description: "Identify a recurring practitioner problem and the operating conditions in which it appears." },
  { title: "Formalise", description: "Separate evidence, definitions, assumptions, calculations and judgement so each can be examined." },
  { title: "Test", description: "Challenge methodology, calculations and controls through analytical examples and explicit failure modes." },
  { title: "Operationalise", description: "Translate elements that meet their stated checks into workflows, rules or analytical systems, preserving the limits of those checks." },
  { title: "Improve", description: "Use observed exceptions and validated corrections to identify where a method or implementation needs refinement." },
] as const;
export const applicationSteps = [
  { title: "Research question", description: "What must be established before an extracted financial value can support analysis?", slug: "ai-financial-analysis-models-rules-controls", linkLabel: "Interpretation and control" },
  { title: "Methodology", description: "Preserve accounting meaning through canonical concepts, periods, currency and scale. Keep interpretation separate from proof of arithmetic.", slug: "financial-data-normalisation", linkLabel: "Financial data normalisation" },
  { title: "Implementation", description: "Income Statement v1 connects extracted values and canonical mappings to source and evidence references that can be inspected.", slug: "financial-data-lineage", linkLabel: "Evidence lineage" },
  { title: "Control", description: "Deterministic reconciliation checks financial relationships. Readiness gates identify failed controls, missing evidence and unresolved material issues.", slug: "financial-data-validation-control-layer", linkLabel: "Validation controls" },
  { title: "Human review", description: "Review tasks expose ambiguity and proposed mappings. Supported review decisions are recorded and the affected checks are recalculated.", slug: "confidence-human-review-ai-finance", linkLabel: "Confidence and review" },
] as const;
const selectedWork = [
  { slug: "ai-financial-analysis-models-rules-controls", reason: "Defines the responsibilities of interpretation, arithmetic and professional judgement." },
  { slug: "financial-data-lineage", reason: "Examines the path from a reported value back to its evidence and transformations." },
  { slug: "confidence-human-review-ai-finance", reason: "Asks when uncertainty should become a review decision rather than an automated answer." },
  { slug: "financial-data-validation-control-layer", reason: "Makes the checks between extraction and analysis explicit." },
  { slug: "credit-decision-engine-architecture", reason: "Connects risk estimates to policy, affordability and the responsibilities of a lending decision." },
  { slug: "credit-scorecard-development-explainable-risk-ranking", reason: "Examines how borrower information becomes an explainable risk ranking, before it becomes a decision." },
] as const;
export const selectedPublications = selectedWork.map(({ slug, reason }) => ({ resource: researchWork(slug), reason }));
export const openQuestions = [
  "How much ambiguity can be resolved automatically before a financial interpretation requires human review?",
  "How should confidence interact with materiality when a small error can change a consequential decision?",
  "How should decision lineage remain inspectable as source data, definitions and models change?",
  "How can financial and risk workflows preserve professional judgement while making routine execution repeatable?",
] as const;

// Describe only the visible selected-publications index, using existing article IDs.
// Labs remains a page published by Entimema, not an independent organisation.
export const labsSchema = {
  "@context": "https://schema.org", "@type": "WebPage", "@id": `${labsUrl}#webpage`,
  url: labsUrl, name: labsTitle, description: labsDescription,
  isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORGANIZATION_ID },
  publisher: { "@id": ORGANIZATION_ID },
  mentions: {
    "@type": "ItemList", "@id": `${labsUrl}#selected-work`,
    name: "Selected methodological work",
    numberOfItems: selectedPublications.length,
    itemListElement: selectedPublications.map(({ resource }, index) => ({
      "@type": "ListItem", position: index + 1,
      item: {
        "@type": "Article", "@id": `${SITE_URL}${resource.canonicalPath}#article`,
        url: `${SITE_URL}${resource.canonicalPath}`, headline: resource.headline,
      },
    })),
  },
};
