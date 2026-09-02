import Link from "next/link";
import type { ResourceRecord } from "./resource-data";
import styles from "./resources.module.css";

type Cluster = {
  label: string;
  title: string;
  description: string;
  resources: readonly [slug: string, label: string][];
};

const authorityClusters: readonly Cluster[] = [
  {
    label: "Credit decisioning",
    title: "From risk evidence to an executable lending decision",
    description: "A governed decision architecture connects affordability, risk appetite, limits, pricing and controlled experimentation rather than treating each decision as a separate rule.",
    resources: [
      ["credit-decision-engine-architecture", "Decision engine architecture"],
      ["affordability-decisioning-ability-to-pay", "Affordability decisioning"],
      ["credit-risk-cut-off-strategy", "Cut-off strategy"],
      ["credit-limit-assignment-exposure-strategy", "Limit and exposure strategy"],
      ["risk-based-pricing-credit-decisioning", "Risk-based pricing"],
      ["champion-challenger-credit-strategy-testing", "Champion challenger testing"],
    ],
  },
  {
    label: "Credit risk models",
    title: "From model construction to validated operational use",
    description: "Ranking, scaling and calibration become decision-useful only when model design, implementation evidence and independent validation remain connected.",
    resources: [
      ["credit-scorecard-development-explainable-risk-ranking", "Credit scorecard development"],
      ["weight-of-evidence-information-value-credit-scoring", "Weight of Evidence and IV"],
      ["logistic-regression-credit-risk-production-scorecard", "Production logistic regression"],
      ["score-scaling-points-to-double-odds-credit-scores", "Score scaling and PDO"],
      ["model-calibration-drift-pd-risk-level", "Calibration and drift"],
      ["credit-risk-model-validation", "Model validation"],
    ],
  },
  {
    label: "Financial intelligence",
    title: "From fragmented evidence to a controlled financial decision",
    description: "AI interpretation, deterministic validation, evidence lineage and human judgement form one governed workflow from source data to management action.",
    resources: [
      ["ai-financial-analysis-models-rules-controls", "AI in financial analysis"],
      ["financial-data-validation-control-layer", "Financial data validation"],
      ["financial-data-lineage", "Financial data lineage"],
      ["traceable-financial-analysis-workflow", "Traceable financial analysis"],
      ["management-reporting-for-cfo-decisions", "Management reporting"],
      ["working-capital-analysis", "Working capital analysis"],
    ],
  },
];

export default function ResearchAuthorityPath({ resource }: { resource: ResourceRecord }) {
  const cluster = authorityClusters.find(({ resources }) => resources.some(([slug]) => slug === resource.slug));

  return (
    <section aria-label="Entimema research and execution pathways" className={styles.authorityPath}>
      {cluster ? (
        <div className={styles.authorityCluster}>
          <header>
            <span>RESEARCH ARCHITECTURE · {cluster.label}</span>
            <h2>{cluster.title}</h2>
            <p>{cluster.description}</p>
          </header>
          <nav aria-label={`${cluster.label} research pathway`}>
            <ol>
              {cluster.resources.map(([slug, label], index) => (
                <li key={slug}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  {slug === resource.slug
                    ? <strong aria-current="page">{label}</strong>
                    : <Link href={`/resources/${slug}`}>{label}</Link>}
                </li>
              ))}
            </ol>
          </nav>
        </div>
      ) : null}

      <div className={styles.executionBridge}>
        <div>
          <span>FROM METHODOLOGY TO CONTROLLED EXECUTION</span>
          <p>{resource.relatedCapability.description}</p>
        </div>
        <nav aria-label="Entimema commercial pathways">
          <Link href={resource.relatedCapability.href}>{resource.relatedCapability.label} capability <b aria-hidden="true">→</b></Link>
          <Link href="/financial-intelligence-launch">Financial Intelligence <b aria-hidden="true">→</b></Link>
          <Link href="/contact">Discuss a workflow <b aria-hidden="true">→</b></Link>
        </nav>
      </div>
    </section>
  );
}
