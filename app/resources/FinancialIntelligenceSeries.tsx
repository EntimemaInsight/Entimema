import Link from "next/link";
import styles from "./resources.module.css";

const stages = [
  ["financial-data-normalisation", "Normalise"],
  ["trial-balance-to-financial-statements", "Map"],
  ["financial-data-validation-control-layer", "Validate"],
  ["confidence-human-review-ai-finance", "Review"],
  ["traceable-financial-analysis-workflow", "Analyse"],
  ["horizontal-and-vertical-financial-analysis", "Compare"],
  ["variance-analysis-price-volume-mix-cost-drivers", "Explain"],
] as const;

export const financialIntelligenceSlugs: ReadonlySet<string> = new Set(stages.map(([slug]) => slug));

export default function FinancialIntelligenceSeries({ currentSlug }: { currentSlug: string }) {
  return (
    <nav className={styles.seriesNavigation} aria-label="Financial Intelligence Research series">
      <span>FINANCIAL INTELLIGENCE RESEARCH SERIES</span>
      <ol>
        {stages.map(([slug, label], index) => (
          <li key={slug}>
            <small>{index + 1}</small>
            {slug === currentSlug ? <strong aria-current="page">{label}</strong> : <Link href={`/resources/${slug}`}>{label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
