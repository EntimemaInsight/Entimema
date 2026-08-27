import Link from "next/link";
import styles from "./resources.module.css";

const waveOneStages = [
  ["financial-data-normalisation", "Normalise", "Financial data normalisation"],
  ["trial-balance-to-financial-statements", "Map", "Trial balance mapping"],
  ["financial-data-validation-control-layer", "Validate", "Financial data validation controls"],
  ["confidence-human-review-ai-finance", "Review", "Confidence and human review"],
  ["traceable-financial-analysis-workflow", "Analyse", "Traceable financial analysis workflow"],
] as const;

const waveTwoStages = [
  ["horizontal-and-vertical-financial-analysis", "Compare", "Horizontal and vertical financial analysis"],
  ["variance-analysis-price-volume-mix-cost-drivers", "Explain", "Price, volume, mix and cost-driver decomposition"],
  ["working-capital-analysis", "Diagnose liquidity", "Working-capital and cash-conversion analysis"],
  ["profit-vs-cash-flow-reconstruction", "Reconstruct cash", "Profit-to-cash reconstruction"],
  ["month-end-reporting-workflow", "Operationalise", "Controlled month-end reporting workflow"],
] as const;

const managementReportingStages = [
  ["month-end-reporting-workflow", "Operationalise", "Controlled month-end reporting workflow"],
  ["management-reporting-for-cfo-decisions", "Support decisions", "Management reporting for CFO decisions"],
] as const;

export const financialIntelligenceSlugs: ReadonlySet<string> = new Set(
  [...waveOneStages, ...waveTwoStages, ...managementReportingStages].map(([slug]) => slug),
);

export default function FinancialIntelligenceSeries({ currentSlug }: { currentSlug: string }) {
  const isManagementReporting = currentSlug === "management-reporting-for-cfo-decisions";
  const isWaveTwo = waveTwoStages.some(([slug]) => slug === currentSlug);
  const stages = isManagementReporting ? managementReportingStages : isWaveTwo ? waveTwoStages : waveOneStages;
  return (
    <nav className={styles.seriesNavigation} aria-label={`Financial Intelligence Research ${isManagementReporting ? "FIR-10 to FIR-11" : isWaveTwo ? "Wave 2" : "Wave 1"} series`}>
      <span>FINANCIAL INTELLIGENCE RESEARCH · {isManagementReporting ? "FIR-10 → FIR-11" : isWaveTwo ? "WAVE 2" : "WAVE 1"}</span>
      <ol>
        {stages.map(([slug, label, accessibleLabel], index) => (
          <li key={slug}>
            <small>{index + (isManagementReporting ? 10 : 1)}</small>
            {slug === currentSlug ? <strong aria-current="page">{label}</strong> : <Link href={`/resources/${slug}`}>{accessibleLabel}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
