import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ResourceArticle from "../ResourceArticle";
import ManufacturingCostArticle, { manufacturingCostSections } from "../ManufacturingCostArticle";
import WorkingCapitalArticle, { workingCapitalSections } from "../WorkingCapitalArticle";
import OperationalDriverForecastingArticle, { operationalForecastSections } from "../OperationalDriverForecastingArticle";
import { getPublishedResource, getTopic, publishedResources } from "../resource-data";

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
  const baseUrl = "https://entimema.net";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: resource.title,
    description: resource.deck,
    datePublished: resource.publishedAt,
    dateModified: resource.updatedAt ?? resource.publishedAt,
    mainEntityOfPage: `${baseUrl}${resource.canonicalPath}`,
    author: { "@type": "Person", name: resource.author.name, url: resource.author.profilePath ? `${baseUrl}${resource.author.profilePath}` : undefined },
    publisher: { "@type": "Organization", name: "Entimema", url: baseUrl },
    articleSection: topic?.label,
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Resources", item: `${baseUrl}/resources` },
      { "@type": "ListItem", position: 2, name: topic?.label },
      { "@type": "ListItem", position: 3, name: resource.title, item: `${baseUrl}${resource.canonicalPath}` },
    ],
  };
  const isWorkingCapital = resource.slug === "working-capital-as-a-system";
  const isOperationalForecast = resource.slug === "operational-driver-forecasting";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <ResourceArticle resource={resource} sections={isOperationalForecast ? [...operationalForecastSections] : isWorkingCapital ? [...workingCapitalSections] : [...manufacturingCostSections]}>
        {isOperationalForecast ? <OperationalDriverForecastingArticle /> : isWorkingCapital ? <WorkingCapitalArticle /> : <ManufacturingCostArticle />}
      </ResourceArticle>
    </>
  );
}
