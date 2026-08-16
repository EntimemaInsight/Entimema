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
import ErpManagementIntelligenceArticle, { erpIntelligenceSections } from "../ErpManagementIntelligenceArticle";
import { getPublishedResource, getTopic, publishedResources } from "../resource-data";
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
        articleSection: topic?.label,
        image: `${SITE_URL}${resource.openGraphImage ?? resource.cover.src}`,
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
          { name: topic?.label ?? resource.topic },
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
  const isErpIntelligence = resource.slug === "from-erp-data-to-management-intelligence";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleSchema) }} />
      <ResourceArticle resource={resource} sections={isPdModelMonitoring ? [...pdModelMonitoringSections] : isErpIntelligence ? [...erpIntelligenceSections] : isPdModelCalibration ? [...pdModelCalibrationSections] : isHighGiniCreditDecision ? [...highGiniCreditDecisionSections] : isCreditVintage ? [...creditVintageSections] : isOperationalForecast ? [...operationalForecastSections] : isWorkingCapital ? [...workingCapitalSections] : [...manufacturingCostSections]}>
        {isPdModelMonitoring ? <PdModelMonitoringArticle /> : isErpIntelligence ? <ErpManagementIntelligenceArticle /> : isPdModelCalibration ? <PdModelCalibrationArticle /> : isHighGiniCreditDecision ? <HighGiniCreditDecisionArticle /> : isCreditVintage ? <CreditVintageAnalysisArticle /> : isOperationalForecast ? <OperationalDriverForecastingArticle /> : isWorkingCapital ? <WorkingCapitalArticle /> : <ManufacturingCostArticle />}
      </ResourceArticle>
    </>
  );
}
