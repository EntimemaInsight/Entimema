import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceArticle from "../ResourceArticle";
import ManufacturingCostArticle, { manufacturingCostSections } from "../ManufacturingCostArticle";
import WorkingCapitalArticle, { workingCapitalSections } from "../WorkingCapitalArticle";
import OperationalDriverForecastingArticle, { operationalForecastSections } from "../OperationalDriverForecastingArticle";
import CreditVintageAnalysisArticle, { creditVintageSections } from "../CreditVintageAnalysisArticle";
import HighGiniCreditDecisionArticle, { highGiniCreditDecisionSections } from "../HighGiniCreditDecisionArticle";
import PdModelCalibrationArticle, { pdModelCalibrationSections } from "../PdModelCalibrationArticle";
import PdModelMonitoringArticle, { pdModelMonitoringSections } from "../PdModelMonitoringArticle";
import PdModelRecalibrationArticle, { pdModelRecalibrationSections } from "../PdModelRecalibrationArticle";
import PdModelTimeArchitectureArticle, { pdModelTimeArchitectureSections } from "../PdModelTimeArchitectureArticle";
import PdDefaultDefinitionArticle, { pdDefaultDefinitionSections } from "../PdDefaultDefinitionArticle";
import ErpManagementIntelligenceArticle, { erpIntelligenceSections } from "../ErpManagementIntelligenceArticle";
import LogisticRegressionScorecardArticle, { logisticRegressionScorecardSections } from "../LogisticRegressionScorecardArticle";
import CreditRiskCutOffArticle, { creditRiskCutOffSections } from "../CreditRiskCutOffArticle";
import CreditDecisionEngineArticle, { creditDecisionEngineSections } from "../CreditDecisionEngineArticle";
import RollRateMigrationArticle, { rollRateMigrationSections } from "../RollRateMigrationArticle";
import EarlyWarningIndicatorsArticle, { earlyWarningIndicatorsSections } from "../EarlyWarningIndicatorsArticle";
import CreditPortfolioMonitoringArticle, { creditPortfolioMonitoringSections } from "../CreditPortfolioMonitoringArticle";
import CreditRiskModelValidationArticle, { creditRiskModelValidationSections } from "../CreditRiskModelValidationArticle";
import CreditRiskValidationPipelineArticle, { creditRiskValidationPipelineSections } from "../CreditRiskValidationPipelineArticle";
import IFRS9ProvisioningEngineArticle, { ifrs9ProvisioningSections } from "../IFRS9ProvisioningEngineArticle";
import AutomatedVintageAnalysisArticle, { automatedVintageSections } from "../AutomatedVintageAnalysisArticle";
import AutomatedRollRateMigrationArticle, { automatedRollRateSections } from "../AutomatedRollRateMigrationArticle";
import { getPublishedResource, getTopic, publishedResources, resourceStreams } from "../resource-data";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, createBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedResources.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/resources/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const resource = getPublishedResource(slug);
  if (!resource) return {};

  return {
    title: resource.seoTitle,
    description: resource.metaDescription,
    alternates: { canonical: resource.canonicalPath },
    openGraph: {
      type: "article",
      url: resource.canonicalPath,
      title: resource.openGraphTitle,
      description: resource.openGraphDescription,
      publishedTime: resource.publishedAt,
      modifiedTime: resource.updatedAt,
      authors: [resource.author.name],
      images: resource.openGraphImage ? [resource.openGraphImage] : undefined,
    },
    twitter: {
      card: resource.openGraphImage ? "summary_large_image" : "summary",
      title: resource.openGraphTitle,
      description: resource.openGraphDescription,
      images: resource.openGraphImage ? [resource.openGraphImage] : undefined,
    },
  };
}

export default async function ResourcePage({ params }: PageProps<"/resources/[slug]">) {
  const { slug } = await params;
  const resource = getPublishedResource(slug);
  if (!resource) notFound();

  const topic = getTopic(resource.topic);
  const stream = resourceStreams[resource.stream];
  const pageUrl = `${SITE_URL}${resource.canonicalPath}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: resource.headline,
        description: resource.slogan,
        url: pageUrl,
        datePublished: resource.publishedAt,
        ...(resource.updatedAt ? { dateModified: resource.updatedAt } : {}),
        mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
        author: { "@id": FOUNDER_ID },
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@id": WEBSITE_ID },
        articleSection: stream.label,
        about: [
          { "@type": "Thing", name: topic?.label ?? resource.topic },
          { "@type": "Thing", name: resource.technicalTitle },
        ],
        ...("src" in resource.cover ? { image: `${SITE_URL}${resource.openGraphImage ?? resource.cover.src}` } : {}),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": `${pageUrl}#article` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      createBreadcrumbSchema(
        [
          { name: "Resources", item: `${SITE_URL}/resources` },
          ...(resource.stream === "engineering" ? [{ name: stream.label, item: `${SITE_URL}${stream.href}` }] : []),
          { name: resource.technicalTitle },
        ],
        `${pageUrl}#breadcrumb`,
      ),
    ],
  };
  const isWorkingCapital = resource.slug === "working-capital-as-a-system";
  const isOperationalForecast = resource.slug === "operational-driver-forecasting";
  const isCreditVintage = resource.slug === "credit-vintage-analysis";
  const isHighGiniCreditDecision = resource.slug === "high-gini-good-credit-decision";
  const isPdModelCalibration = resource.slug === "pd-model-ranking-calibration";
  const isPdModelMonitoring = resource.slug === "pd-model-monitoring";
  const isPdModelRecalibration = resource.slug === "pd-model-recalibration-vs-redevelopment";
  const isPdModelTimeArchitecture = resource.slug === "pd-model-observation-performance-windows";
  const isPdDefaultDefinition = resource.slug === "pd-default-definition-target-construction";
  const isErpIntelligence = resource.slug === "from-erp-data-to-management-intelligence";
  const isLogisticRegressionScorecard = resource.slug === "logistic-regression-credit-risk-scorecards";
  const isCreditRiskCutOff = resource.slug === "credit-risk-cut-off-strategy";
  const isCreditDecisionEngine = resource.slug === "credit-decision-engine-architecture";
  const isRollRateMigration = resource.slug === "roll-rate-analysis-migration-matrices";
  const isEarlyWarningIndicators = resource.slug === "early-warning-indicators-credit-risk";
  const isCreditPortfolioMonitoring = resource.slug === "credit-portfolio-monitoring-architecture";
  const isCreditRiskModelValidation = resource.slug === "credit-risk-model-validation";
  const isCreditRiskValidationPipeline = resource.slug === "credit-risk-model-validation-pipeline";
  const isIFRS9ProvisioningEngine = resource.slug === "r-ifrs9-ecl-ai-assisted-provisioning";
  const isAutomatedVintageAnalysis = resource.slug === "automating-credit-vintage-analysis-r-ai-portfolio-analyst";
  const isAutomatedRollRate = resource.slug === "automating-roll-rate-migration-analysis-r-ai-collections-analyst";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
      <ResourceArticle resource={resource} sections={isAutomatedRollRate ? [...automatedRollRateSections] : isAutomatedVintageAnalysis ? [...automatedVintageSections] : isIFRS9ProvisioningEngine ? [...ifrs9ProvisioningSections] : isCreditRiskValidationPipeline ? [...creditRiskValidationPipelineSections] : isCreditRiskModelValidation ? [...creditRiskModelValidationSections] : isCreditPortfolioMonitoring ? [...creditPortfolioMonitoringSections] : isEarlyWarningIndicators ? [...earlyWarningIndicatorsSections] : isRollRateMigration ? [...rollRateMigrationSections] : isCreditDecisionEngine ? [...creditDecisionEngineSections] : isCreditRiskCutOff ? [...creditRiskCutOffSections] : isLogisticRegressionScorecard ? [...logisticRegressionScorecardSections] : isPdDefaultDefinition ? [...pdDefaultDefinitionSections] : isPdModelTimeArchitecture ? [...pdModelTimeArchitectureSections] : isPdModelRecalibration ? [...pdModelRecalibrationSections] : isPdModelMonitoring ? [...pdModelMonitoringSections] : isErpIntelligence ? [...erpIntelligenceSections] : isPdModelCalibration ? [...pdModelCalibrationSections] : isHighGiniCreditDecision ? [...highGiniCreditDecisionSections] : isCreditVintage ? [...creditVintageSections] : isOperationalForecast ? [...operationalForecastSections] : isWorkingCapital ? [...workingCapitalSections] : [...manufacturingCostSections]}>
        {isAutomatedRollRate ? <AutomatedRollRateMigrationArticle /> : isAutomatedVintageAnalysis ? <AutomatedVintageAnalysisArticle /> : isIFRS9ProvisioningEngine ? <IFRS9ProvisioningEngineArticle /> : isCreditRiskValidationPipeline ? <CreditRiskValidationPipelineArticle /> : isCreditRiskModelValidation ? <CreditRiskModelValidationArticle /> : isCreditPortfolioMonitoring ? <CreditPortfolioMonitoringArticle /> : isEarlyWarningIndicators ? <EarlyWarningIndicatorsArticle /> : isRollRateMigration ? <RollRateMigrationArticle /> : isCreditDecisionEngine ? <CreditDecisionEngineArticle /> : isCreditRiskCutOff ? <CreditRiskCutOffArticle /> : isLogisticRegressionScorecard ? <LogisticRegressionScorecardArticle /> : isPdDefaultDefinition ? <PdDefaultDefinitionArticle /> : isPdModelTimeArchitecture ? <PdModelTimeArchitectureArticle /> : isPdModelRecalibration ? <PdModelRecalibrationArticle /> : isPdModelMonitoring ? <PdModelMonitoringArticle /> : isErpIntelligence ? <ErpManagementIntelligenceArticle /> : isPdModelCalibration ? <PdModelCalibrationArticle /> : isHighGiniCreditDecision ? <HighGiniCreditDecisionArticle /> : isCreditVintage ? <CreditVintageAnalysisArticle /> : isOperationalForecast ? <OperationalDriverForecastingArticle /> : isWorkingCapital ? <WorkingCapitalArticle /> : <ManufacturingCostArticle />}
      </ResourceArticle>
    </>
  );
}
