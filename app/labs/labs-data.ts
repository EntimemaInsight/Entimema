import { ORGANIZATION_ID, SITE_URL, WEBSITE_ID } from "../../lib/structured-data";

export const labsTitle = "Entimema Labs | Financial Intelligence, Credit Risk and Decision Systems";
export const labsDescription = "Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.";
export const labsUrl = `${SITE_URL}/labs`;
export const labsSchema = {
  "@context": "https://schema.org", "@type": "WebPage", "@id": `${labsUrl}#webpage`,
  url: labsUrl, name: labsTitle, description: labsDescription,
  isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORGANIZATION_ID },
};
export const domains = [
  { title: "Financial Intelligence", description: "We research how heterogeneous financial information can be interpreted, harmonised, reconciled and transformed into traceable management insight.", points: ["Financial data structures and canonical schemas", "Management reporting and decision models", "Planning, forecasting and performance logic", "Controls, reconciliation and analytical traceability"] },
  { title: "Credit Risk", description: "We develop practitioner-grade frameworks for measuring, monitoring and operationalising credit risk across the decision lifecycle.", points: ["Risk measurement and portfolio monitoring", "Scorecards, probability of default and calibration", "Decision strategies and early-warning systems", "Model governance, validation and explainability"] },
  { title: "Decision Systems", description: "We examine how model intelligence, deterministic controls and human review can be composed into reliable financial workflows.", points: ["Evidence and decision lineage", "Confidence, exceptions and escalation", "Controlled AI-assisted workflows", "Human judgement in high-stakes decisions"] },
] as const;
export const process = [
  { title: "Observe", description: "Start with a recurring financial or risk decision that fails under real operating conditions." },
  { title: "Formalise", description: "Separate evidence, assumptions, methodology, calculations, uncertainty and judgement." },
  { title: "Test", description: "Challenge the framework through analytical examples, failure modes and control requirements." },
  { title: "Operationalise", description: "Translate the validated logic into a workflow, analytical system or decision-support product." },
  { title: "Improve", description: "Use monitored outcomes and validated human corrections to refine the system." },
] as const;
export const principles = [
  { title: "Evidence before inference", description: "Conclusions must remain connected to identifiable evidence, while assumptions and unknowns stay visible." },
  { title: "Models interpret; rules control", description: "Model intelligence supports semantic interpretation and contextual reasoning. Deterministic logic owns arithmetic, reconciliations and fixed controls." },
  { title: "Uncertainty must be surfaced", description: "Ambiguity should trigger confidence assessment, clarification or human review—not an invented answer." },
  { title: "Traceability is part of the product", description: "Every material output should preserve the path from source evidence through transformation to decision." },
] as const;
export const outputs = ["Practitioner research and methodological frameworks", "Financial and credit-risk decision architectures", "Controlled analytical workflows", "Validation, monitoring and governance methods", "Reusable components for Entimema products and client work"] as const;
