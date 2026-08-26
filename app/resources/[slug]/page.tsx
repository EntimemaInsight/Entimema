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
import FinancialDataNormalisationArticle, { financialDataNormalisationSections } from "../FinancialDataNormalisationArticle";
import TrialBalanceMappingArticle, { trialBalanceMappingSections } from "../TrialBalanceMappingArticle";
import FinancialDataValidationArticle, { financialDataValidationSections } from "../FinancialDataValidationArticle";
import LogisticRegressionScorecardArticle, { logisticRegressionScorecardSections } from "../LogisticRegressionScorecardArticle";
import CreditRiskCutOffArticle, { creditRiskCutOffSections } from "../CreditRiskCutOffArticle";
import CreditDecisionEngineArticle, { creditDecisionEngineSections } from "../CreditDecisionEngineArticle";
import CreditPolicyRulesArticle, { creditPolicyRulesSections } from "../CreditPolicyRulesArticle";
import AffordabilityDecisioningArticle, { affordabilityDecisioningSections } from "../AffordabilityDecisioningArticle";
import CreditLimitAssignmentArticle, { creditLimitAssignmentSections } from "../CreditLimitAssignmentArticle";
import RiskBasedPricingArticle, { riskBasedPricingSections } from "../RiskBasedPricingArticle";
import ChampionChallengerStrategyArticle, { championChallengerStrategySections } from "../ChampionChallengerStrategyArticle";
import DecisionEngineMonitoringArticle, { decisionEngineMonitoringSections } from "../DecisionEngineMonitoringArticle";
import ConsumerCreditEarlyWarningArticle, { consumerCreditEarlyWarningSections } from "../ConsumerCreditEarlyWarningArticle";
import BehaviouralCreditScoringArticle, { behaviouralCreditScoringSections } from "../BehaviouralCreditScoringArticle";
import CollectionsPrioritisationArticle, { collectionsPrioritisationSections } from "../CollectionsPrioritisationArticle";
import CureRedefaultAnalyticsArticle, { cureRedefaultAnalyticsSections } from "../CureRedefaultAnalyticsArticle";
import PromiseToPayAnalyticsArticle, { promiseToPayAnalyticsSections } from "../PromiseToPayAnalyticsArticle";
import HiddenInfrastructureDebtArticle, { hiddenInfrastructureDebtSections } from "../HiddenInfrastructureDebtArticle";
import PaymentIsNotBalanceArticle, { paymentIsNotBalanceSections } from "../PaymentIsNotBalanceArticle";
import SingleCustomerViewArticle, { singleCustomerViewSections } from "../SingleCustomerViewArticle";
import BatchRiskDecisionLatencyArticle, { batchRiskDecisionLatencySections } from "../BatchRiskDecisionLatencyArticle";
import RollRateMigrationArticle, { rollRateMigrationSections } from "../RollRateMigrationArticle";
import EarlyWarningIndicatorsArticle, { earlyWarningIndicatorsSections } from "../EarlyWarningIndicatorsArticle";
import CreditPortfolioMonitoringArticle, { creditPortfolioMonitoringSections } from "../CreditPortfolioMonitoringArticle";
import CreditRiskModelValidationArticle, { creditRiskModelValidationSections } from "../CreditRiskModelValidationArticle";
import CreditRiskValidationPipelineArticle, { creditRiskValidationPipelineSections } from "../CreditRiskValidationPipelineArticle";
import IFRS9ProvisioningEngineArticle, { ifrs9ProvisioningSections } from "../IFRS9ProvisioningEngineArticle";
import AutomatedVintageAnalysisArticle, { automatedVintageSections } from "../AutomatedVintageAnalysisArticle";
import AutomatedRollRateMigrationArticle, { automatedRollRateSections } from "../AutomatedRollRateMigrationArticle";
import AIAgentsCreditRiskArticle, { aiAgentsCreditRiskSections } from "../AIAgentsCreditRiskArticle";
import HighRiskConsumerLendingArticle, { highRiskConsumerLendingSections } from "../HighRiskConsumerLendingArticle";
import RejectInferenceArticle, { rejectInferenceSections } from "../RejectInferenceArticle";
import CreditScorecardDevelopmentArticle, { creditScorecardDevelopmentSections } from "../CreditScorecardDevelopmentArticle";
import WoeInformationValueArticle, { woeInformationValueSections } from "../WoeInformationValueArticle";
import LogisticRegressionCreditRiskArticle, { logisticRegressionCreditRiskSections } from "../LogisticRegressionCreditRiskArticle";
import ScoreScalingPdoArticle, { scoreScalingPdoSections } from "../ScoreScalingPdoArticle";
import PopulationStabilityIndexArticle, { populationStabilityIndexSections } from "../PopulationStabilityIndexArticle";
import ModelCalibrationDriftArticle, { modelCalibrationDriftSections } from "../ModelCalibrationDriftArticle";
import Ifrs9ExpectedCreditLossArticle, { ifrs9ExpectedCreditLossSections } from "../Ifrs9ExpectedCreditLossArticle";
import SignificantIncreaseCreditRiskArticle, { significantIncreaseCreditRiskSections } from "../SignificantIncreaseCreditRiskArticle";
import LifetimePdTermStructuresArticle, { lifetimePdTermStructuresSections } from "../LifetimePdTermStructuresArticle";
import Ifrs9LgdArticle, { ifrs9LgdSections } from "../Ifrs9LgdArticle";
import Ifrs9EadArticle, { ifrs9EadSections } from "../Ifrs9EadArticle";
import Ifrs9MacroeconomicScenariosArticle, { ifrs9MacroeconomicScenariosSections } from "../Ifrs9MacroeconomicScenariosArticle";
import Ifrs9EclValidationArticle, { ifrs9EclValidationSections } from "../Ifrs9EclValidationArticle";
import TemporalFinancialStateArticle, { temporalFinancialStateSections } from "../TemporalFinancialStateArticle";
import IdempotentFinancialEventsArticle, { idempotentFinancialEventsSections } from "../IdempotentFinancialEventsArticle";
import AccountStateReconstructionArticle, { accountStateReconstructionSections } from "../AccountStateReconstructionArticle";
import LateEventRestatementArticle, { lateEventRestatementSections } from "../LateEventRestatementArticle";
import ReversalCorrectionArticle, { reversalCorrectionSections } from "../ReversalCorrectionArticle";
import ReliableDpdEngineArticle, { reliableDpdEngineSections } from "../ReliableDpdEngineArticle";
import CreditDataModelArticle, { creditDataModelSections } from "../CreditDataModelArticle";
import EntityResolutionArticle, { entityResolutionSections } from "../EntityResolutionArticle";
import GoldenCustomerStateArticle, { goldenCustomerStateSections } from "../GoldenCustomerStateArticle";
import ConnectedExposureArticle, { connectedExposureSections } from "../ConnectedExposureArticle";
import PointInTimeCustomerStateArticle, { pointInTimeCustomerStateSections } from "../PointInTimeCustomerStateArticle";
import CreditRiskFeatureStoreArticle, { creditRiskFeatureStoreSections } from "../CreditRiskFeatureStoreArticle";
import PointInTimeCreditFeaturesArticle, { pointInTimeCreditFeaturesSections } from "../PointInTimeCreditFeaturesArticle";
import EventDrivenCreditArchitectureArticle, { eventDrivenCreditArchitectureSections } from "../EventDrivenCreditArchitectureArticle";
import StreamingBehaviouralFeaturesArticle, { streamingBehaviouralFeaturesSections } from "../StreamingBehaviouralFeaturesArticle";
import RealTimeExposureArticle, { realTimeExposureSections } from "../RealTimeExposureArticle";
import DecisionTriggersArticle, { decisionTriggersSections } from "../DecisionTriggersArticle";
import PipelineResilienceArticle, { pipelineResilienceSections } from "../PipelineResilienceArticle";
import SemanticDataContractsArticle, { semanticDataContractsSections } from "../SemanticDataContractsArticle";
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
  const isFinancialDataNormalisation = resource.slug === "financial-data-normalisation";
  const isTrialBalanceMapping = resource.slug === "trial-balance-to-financial-statements";
  const isFinancialDataValidation = resource.slug === "financial-data-validation-control-layer";
  const isLogisticRegressionScorecard = resource.slug === "logistic-regression-credit-risk-scorecards";
  const isCreditRiskCutOff = resource.slug === "credit-risk-cut-off-strategy";
  const isCreditDecisionEngine = resource.slug === "credit-decision-engine-architecture";
  const isCreditPolicyRules = resource.slug === "credit-policy-rules-lending-rulebook-governance";
  const isAffordabilityDecisioning = resource.slug === "affordability-decisioning-ability-to-pay";
  const isCreditLimitAssignment = resource.slug === "credit-limit-assignment-exposure-strategy";
  const isRiskBasedPricing = resource.slug === "risk-based-pricing-credit-decisioning";
  const isChampionChallengerStrategy = resource.slug === "champion-challenger-credit-strategy-testing";
  const isDecisionEngineMonitoring = resource.slug === "decision-engine-monitoring-strategy-drift";
  const isConsumerCreditEarlyWarning = resource.slug === "consumer-credit-early-warning-systems";
  const isBehaviouralCreditScoring = resource.slug === "behavioural-credit-scoring-post-origination-risk";
  const isCollectionsPrioritisation = resource.slug === "collections-prioritisation-intervention-value";
  const isCureRedefaultAnalytics = resource.slug === "cure-redefault-analytics-sustainable-recovery";
  const isPromiseToPayAnalytics = resource.slug === "promise-to-pay-analytics-collections";
  const isHiddenInfrastructureDebt = resource.slug === "hidden-infrastructure-debt-modern-lending";
  const isPaymentIsNotBalance = resource.slug === "payment-is-not-the-balance";
  const isSingleCustomerView = resource.slug === "single-customer-view-is-usually-a-fiction";
  const isBatchRiskDecisionLatency = resource.slug === "why-batch-risk-is-becoming-a-business-risk";
  const isRollRateMigration = resource.slug === "roll-rate-analysis-migration-matrices";
  const isEarlyWarningIndicators = resource.slug === "early-warning-indicators-credit-risk";
  const isCreditPortfolioMonitoring = resource.slug === "credit-portfolio-monitoring-architecture";
  const isCreditRiskModelValidation = resource.slug === "credit-risk-model-validation";
  const isCreditRiskValidationPipeline = resource.slug === "credit-risk-model-validation-pipeline";
  const isIFRS9ProvisioningEngine = resource.slug === "r-ifrs9-ecl-ai-assisted-provisioning";
  const isAutomatedVintageAnalysis = resource.slug === "automating-credit-vintage-analysis-r-ai-portfolio-analyst";
  const isAutomatedRollRate = resource.slug === "automating-roll-rate-migration-analysis-r-ai-collections-analyst";
  const isAIAgentsCreditRisk = resource.slug === "ai-agents-credit-risk-controlled-deterministic-models";
  const isHighRiskConsumerLending = resource.slug === "high-risk-consumer-lending-risk-adjusted-economics";
  const isRejectInference = resource.slug === "reject-inference-credit-risk-rejected-applicants";
  const isCreditScorecardDevelopment = resource.slug === "credit-scorecard-development-explainable-risk-ranking";
  const isWoeInformationValue = resource.slug === "weight-of-evidence-information-value-credit-scoring";
  const isLogisticRegressionCreditRisk = resource.slug === "logistic-regression-credit-risk-production-scorecard";
  const isScoreScalingPdo = resource.slug === "score-scaling-points-to-double-odds-credit-scores";
  const isPopulationStabilityIndex = resource.slug === "population-stability-index-credit-risk-model-monitoring";
  const isModelCalibrationDrift = resource.slug === "model-calibration-drift-pd-risk-level";
  const isIfrs9ExpectedCreditLoss = resource.slug === "ifrs-9-expected-credit-loss-architecture";
  const isSignificantIncreaseCreditRisk = resource.slug === "significant-increase-credit-risk-ifrs-9-stage-2";
  const isLifetimePdTermStructures = resource.slug === "lifetime-pd-term-structures-ifrs-9";
  const isIfrs9Lgd = resource.slug === "ifrs-9-lgd-recovery-cash-flows";
  const isIfrs9Ead = resource.slug === "ifrs-9-ead-credit-conversion-factors";
  const isIfrs9MacroeconomicScenarios = resource.slug === "forward-looking-macroeconomic-scenarios-ifrs-9";
  const isIfrs9EclValidation = resource.slug === "ifrs-9-ecl-validation-backtesting";
  const isTemporalFinancialState = resource.slug === "event-time-processing-time-posting-time-credit-systems";
  const isIdempotentFinancialEvents = resource.slug === "idempotency-payment-credit-event-processing";
  const isAccountStateReconstruction = resource.slug === "reconstructing-account-state-financial-events";
  const isLateEventRestatement = resource.slug === "late-arriving-events-backdated-corrections";
  const isReversalCorrection = resource.slug === "reversals-chargebacks-corrections-risk-state";
  const isReliableDpdEngine = resource.slug === "building-reliable-dpd-engine";
  const isCreditDataModel = resource.slug === "customer-facility-account-exposure-credit-data-model";
  const isEntityResolution = resource.slug === "why-customer-id-is-not-enough-entity-resolution-lending";
  const isGoldenCustomerState = resource.slug === "building-golden-customer-record-without-data-silo";
  const isConnectedExposure = resource.slug === "joint-borrowers-multiple-facilities-connected-exposures";
  const isPointInTimeCustomerState = resource.slug === "point-in-time-customer-state-reconstruction";
  const isCreditRiskFeatureStore = resource.slug === "credit-risk-feature-store-respects-time";
  const isPointInTimeCreditFeatures = resource.slug === "point-in-time-correct-features-credit-models";
  const isEventDrivenCreditArchitecture = resource.slug === "batch-etl-event-driven-credit-risk-architecture";
  const isStreamingBehaviouralFeatures = resource.slug === "streaming-behavioural-features-early-warning";
  const isRealTimeExposure = resource.slug === "real-time-utilisation-exposure-monitoring";
  const isDecisionTriggers = resource.slug === "event-driven-decision-triggers-lending-systems";
  const isPipelineResilience = resource.slug === "backpressure-failure-recovery-financial-event-pipelines";
  const isSemanticDataContracts = resource.slug === "detecting-silent-schema-changes-risk-models";

  if (isFinancialDataValidation) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...financialDataValidationSections]}>
          <FinancialDataValidationArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isTrialBalanceMapping) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...trialBalanceMappingSections]}>
          <TrialBalanceMappingArticle />
        </ResourceArticle>
      </>
    );
  }
  if (isFinancialDataNormalisation) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...financialDataNormalisationSections]}>
          <FinancialDataNormalisationArticle />
        </ResourceArticle>
      </>
    );
  }
  if (isSemanticDataContracts) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...semanticDataContractsSections]}>
          <SemanticDataContractsArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isPipelineResilience) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...pipelineResilienceSections]}>
          <PipelineResilienceArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isDecisionTriggers) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...decisionTriggersSections]}>
          <DecisionTriggersArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isRealTimeExposure) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...realTimeExposureSections]}>
          <RealTimeExposureArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isStreamingBehaviouralFeatures) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...streamingBehaviouralFeaturesSections]}>
          <StreamingBehaviouralFeaturesArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isEventDrivenCreditArchitecture) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...eventDrivenCreditArchitectureSections]}>
          <EventDrivenCreditArchitectureArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isPointInTimeCreditFeatures) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...pointInTimeCreditFeaturesSections]}>
          <PointInTimeCreditFeaturesArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isCreditRiskFeatureStore) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...creditRiskFeatureStoreSections]}>
          <CreditRiskFeatureStoreArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isPointInTimeCustomerState) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...pointInTimeCustomerStateSections]}>
          <PointInTimeCustomerStateArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isConnectedExposure) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...connectedExposureSections]}>
          <ConnectedExposureArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isGoldenCustomerState) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...goldenCustomerStateSections]}>
          <GoldenCustomerStateArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isEntityResolution) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...entityResolutionSections]}>
          <EntityResolutionArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isCreditDataModel) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...creditDataModelSections]}>
          <CreditDataModelArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isReliableDpdEngine) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...reliableDpdEngineSections]}>
          <ReliableDpdEngineArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isReversalCorrection) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...reversalCorrectionSections]}>
          <ReversalCorrectionArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isLateEventRestatement) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...lateEventRestatementSections]}>
          <LateEventRestatementArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isAccountStateReconstruction) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...accountStateReconstructionSections]}>
          <AccountStateReconstructionArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isIdempotentFinancialEvents) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...idempotentFinancialEventsSections]}>
          <IdempotentFinancialEventsArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isTemporalFinancialState) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={[...temporalFinancialStateSections]}>
          <TemporalFinancialStateArticle />
        </ResourceArticle>
      </>
    );
  }

  if (isCreditPolicyRules || isAffordabilityDecisioning || isCreditLimitAssignment || isRiskBasedPricing || isChampionChallengerStrategy || isDecisionEngineMonitoring || isConsumerCreditEarlyWarning || isBehaviouralCreditScoring || isCollectionsPrioritisation || isCureRedefaultAnalytics || isPromiseToPayAnalytics || isHiddenInfrastructureDebt || isPaymentIsNotBalance || isSingleCustomerView || isBatchRiskDecisionLatency) {
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
        <ResourceArticle resource={resource} sections={isBatchRiskDecisionLatency ? [...batchRiskDecisionLatencySections] : isSingleCustomerView ? [...singleCustomerViewSections] : isPaymentIsNotBalance ? [...paymentIsNotBalanceSections] : isHiddenInfrastructureDebt ? [...hiddenInfrastructureDebtSections] : isPromiseToPayAnalytics ? [...promiseToPayAnalyticsSections] : isCureRedefaultAnalytics ? [...cureRedefaultAnalyticsSections] : isCollectionsPrioritisation ? [...collectionsPrioritisationSections] : isBehaviouralCreditScoring ? [...behaviouralCreditScoringSections] : isConsumerCreditEarlyWarning ? [...consumerCreditEarlyWarningSections] : isDecisionEngineMonitoring ? [...decisionEngineMonitoringSections] : isChampionChallengerStrategy ? [...championChallengerStrategySections] : isRiskBasedPricing ? [...riskBasedPricingSections] : isCreditLimitAssignment ? [...creditLimitAssignmentSections] : isAffordabilityDecisioning ? [...affordabilityDecisioningSections] : [...creditPolicyRulesSections]}>
          {isBatchRiskDecisionLatency ? <BatchRiskDecisionLatencyArticle /> : isSingleCustomerView ? <SingleCustomerViewArticle /> : isPaymentIsNotBalance ? <PaymentIsNotBalanceArticle /> : isHiddenInfrastructureDebt ? <HiddenInfrastructureDebtArticle /> : isPromiseToPayAnalytics ? <PromiseToPayAnalyticsArticle /> : isCureRedefaultAnalytics ? <CureRedefaultAnalyticsArticle /> : isCollectionsPrioritisation ? <CollectionsPrioritisationArticle /> : isBehaviouralCreditScoring ? <BehaviouralCreditScoringArticle /> : isConsumerCreditEarlyWarning ? <ConsumerCreditEarlyWarningArticle /> : isDecisionEngineMonitoring ? <DecisionEngineMonitoringArticle /> : isChampionChallengerStrategy ? <ChampionChallengerStrategyArticle /> : isRiskBasedPricing ? <RiskBasedPricingArticle /> : isCreditLimitAssignment ? <CreditLimitAssignmentArticle /> : isAffordabilityDecisioning ? <AffordabilityDecisioningArticle /> : <CreditPolicyRulesArticle />}
        </ResourceArticle>
      </>
    );
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
      <ResourceArticle resource={resource} sections={isIfrs9EclValidation ? [...ifrs9EclValidationSections] : isIfrs9MacroeconomicScenarios ? [...ifrs9MacroeconomicScenariosSections] : isIfrs9Ead ? [...ifrs9EadSections] : isIfrs9Lgd ? [...ifrs9LgdSections] : isLifetimePdTermStructures ? [...lifetimePdTermStructuresSections] : isSignificantIncreaseCreditRisk ? [...significantIncreaseCreditRiskSections] : isIfrs9ExpectedCreditLoss ? [...ifrs9ExpectedCreditLossSections] : isModelCalibrationDrift ? [...modelCalibrationDriftSections] : isPopulationStabilityIndex ? [...populationStabilityIndexSections] : isScoreScalingPdo ? [...scoreScalingPdoSections] : isLogisticRegressionCreditRisk ? [...logisticRegressionCreditRiskSections] : isWoeInformationValue ? [...woeInformationValueSections] : isCreditScorecardDevelopment ? [...creditScorecardDevelopmentSections] : isRejectInference ? [...rejectInferenceSections] : isHighRiskConsumerLending ? [...highRiskConsumerLendingSections] : isAIAgentsCreditRisk ? [...aiAgentsCreditRiskSections] : isAutomatedRollRate ? [...automatedRollRateSections] : isAutomatedVintageAnalysis ? [...automatedVintageSections] : isIFRS9ProvisioningEngine ? [...ifrs9ProvisioningSections] : isCreditRiskValidationPipeline ? [...creditRiskValidationPipelineSections] : isCreditRiskModelValidation ? [...creditRiskModelValidationSections] : isCreditPortfolioMonitoring ? [...creditPortfolioMonitoringSections] : isEarlyWarningIndicators ? [...earlyWarningIndicatorsSections] : isRollRateMigration ? [...rollRateMigrationSections] : isCreditDecisionEngine ? [...creditDecisionEngineSections] : isCreditRiskCutOff ? [...creditRiskCutOffSections] : isLogisticRegressionScorecard ? [...logisticRegressionScorecardSections] : isPdDefaultDefinition ? [...pdDefaultDefinitionSections] : isPdModelTimeArchitecture ? [...pdModelTimeArchitectureSections] : isPdModelRecalibration ? [...pdModelRecalibrationSections] : isPdModelMonitoring ? [...pdModelMonitoringSections] : isErpIntelligence ? [...erpIntelligenceSections] : isPdModelCalibration ? [...pdModelCalibrationSections] : isHighGiniCreditDecision ? [...highGiniCreditDecisionSections] : isCreditVintage ? [...creditVintageSections] : isOperationalForecast ? [...operationalForecastSections] : isWorkingCapital ? [...workingCapitalSections] : [...manufacturingCostSections]}>
        {isIfrs9EclValidation ? <Ifrs9EclValidationArticle /> : isIfrs9MacroeconomicScenarios ? <Ifrs9MacroeconomicScenariosArticle /> : isIfrs9Ead ? <Ifrs9EadArticle /> : isIfrs9Lgd ? <Ifrs9LgdArticle /> : isLifetimePdTermStructures ? <LifetimePdTermStructuresArticle /> : isSignificantIncreaseCreditRisk ? <SignificantIncreaseCreditRiskArticle /> : isIfrs9ExpectedCreditLoss ? <Ifrs9ExpectedCreditLossArticle /> : isModelCalibrationDrift ? <ModelCalibrationDriftArticle /> : isPopulationStabilityIndex ? <PopulationStabilityIndexArticle /> : isScoreScalingPdo ? <ScoreScalingPdoArticle /> : isLogisticRegressionCreditRisk ? <LogisticRegressionCreditRiskArticle /> : isWoeInformationValue ? <WoeInformationValueArticle /> : isCreditScorecardDevelopment ? <CreditScorecardDevelopmentArticle /> : isRejectInference ? <RejectInferenceArticle /> : isHighRiskConsumerLending ? <HighRiskConsumerLendingArticle /> : isAIAgentsCreditRisk ? <AIAgentsCreditRiskArticle /> : isAutomatedRollRate ? <AutomatedRollRateMigrationArticle /> : isAutomatedVintageAnalysis ? <AutomatedVintageAnalysisArticle /> : isIFRS9ProvisioningEngine ? <IFRS9ProvisioningEngineArticle /> : isCreditRiskValidationPipeline ? <CreditRiskValidationPipelineArticle /> : isCreditRiskModelValidation ? <CreditRiskModelValidationArticle /> : isCreditPortfolioMonitoring ? <CreditPortfolioMonitoringArticle /> : isEarlyWarningIndicators ? <EarlyWarningIndicatorsArticle /> : isRollRateMigration ? <RollRateMigrationArticle /> : isCreditDecisionEngine ? <CreditDecisionEngineArticle /> : isCreditRiskCutOff ? <CreditRiskCutOffArticle /> : isLogisticRegressionScorecard ? <LogisticRegressionScorecardArticle /> : isPdDefaultDefinition ? <PdDefaultDefinitionArticle /> : isPdModelTimeArchitecture ? <PdModelTimeArchitectureArticle /> : isPdModelRecalibration ? <PdModelRecalibrationArticle /> : isPdModelMonitoring ? <PdModelMonitoringArticle /> : isErpIntelligence ? <ErpManagementIntelligenceArticle /> : isPdModelCalibration ? <PdModelCalibrationArticle /> : isHighGiniCreditDecision ? <HighGiniCreditDecisionArticle /> : isCreditVintage ? <CreditVintageAnalysisArticle /> : isOperationalForecast ? <OperationalDriverForecastingArticle /> : isWorkingCapital ? <WorkingCapitalArticle /> : <ManufacturingCostArticle />}
      </ResourceArticle>
    </>
  );
}
