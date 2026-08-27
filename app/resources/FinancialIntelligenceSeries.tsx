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

const kpiTreeStages = [
  ["management-reporting-for-cfo-decisions", "Support decisions", "Management reporting for CFO decisions"],
  ["financial-kpi-trees", "Trace drivers", "Financial KPI trees"],
] as const;

const lineageStages = [
  ["financial-kpi-trees", "Trace drivers", "Financial KPI trees"],
  ["financial-data-lineage", "Inspect evidence", "Financial data lineage"],
] as const;

const spreadsheetStages = [
  ["financial-data-lineage", "Inspect evidence", "Financial data lineage"],
  ["beyond-spreadsheet-automation", "Govern execution", "Governed spreadsheet workflows"],
] as const;

export const financialIntelligenceSlugs: ReadonlySet<string> = new Set(
  [...waveOneStages, ...waveTwoStages, ...managementReportingStages, ...kpiTreeStages, ...lineageStages, ...spreadsheetStages].map(([slug]) => slug),
);

export default function FinancialIntelligenceSeries({ currentSlug }: { currentSlug: string }) {
  const isSpreadsheet = currentSlug === "beyond-spreadsheet-automation";
  const isLineage = currentSlug === "financial-data-lineage";
  const isKpiTree = currentSlug === "financial-kpi-trees";
  const isManagementReporting = currentSlug === "management-reporting-for-cfo-decisions";
  const isWaveTwo = waveTwoStages.some(([slug]) => slug === currentSlug);
  const stages = isSpreadsheet ? spreadsheetStages : isLineage ? lineageStages : isKpiTree ? kpiTreeStages : isManagementReporting ? managementReportingStages : isWaveTwo ? waveTwoStages : waveOneStages;
  return (
    <nav className={styles.seriesNavigation} aria-label={`Financial Intelligence Research ${isSpreadsheet ? "FIR-13 to FIR-14" : isLineage ? "FIR-12 to FIR-13" : isKpiTree ? "FIR-11 to FIR-12" : isManagementReporting ? "FIR-10 to FIR-11" : isWaveTwo ? "Wave 2" : "Wave 1"} series`}>
      <span>FINANCIAL INTELLIGENCE RESEARCH · {isSpreadsheet ? "FIR-13 → FIR-14" : isLineage ? "FIR-12 → FIR-13" : isKpiTree ? "FIR-11 → FIR-12" : isManagementReporting ? "FIR-10 → FIR-11" : isWaveTwo ? "WAVE 2" : "WAVE 1"}</span>
      <ol>
        {stages.map(([slug, label, accessibleLabel], index) => (
          <li key={slug}>
            <small>{index + (isSpreadsheet ? 13 : isLineage ? 12 : isKpiTree ? 11 : isManagementReporting ? 10 : 1)}</small>
            {slug === currentSlug ? <strong aria-current="page">{label}</strong> : <Link href={`/resources/${slug}`}>{accessibleLabel}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
