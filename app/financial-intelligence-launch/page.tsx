import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { FOUNDER_ID, ORGANIZATION_ID, SITE_URL, WEBSITE_ID, createBreadcrumbSchema, serializeJsonLd } from "@/lib/structured-data";
import EditorialExperience from "./EditorialExperience";

const path = "/financial-intelligence-launch";
const url = `${SITE_URL}${path}`;
const title = "Financial Intelligence V1 — The case for controlled financial AI";
const description = "A visual manifesto for turning financial documents into validated, traceable and decision-ready outputs.";

export const metadata: Metadata = {
  title: { absolute: `${title} | Entimema` }, description,
  alternates: { canonical: url },
  openGraph: { type: "article", url, title, description, siteName: "Entimema", publishedTime: "2026-09-09", authors: [`${SITE_URL}/alexander-dimitrov`], images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: "Entimema Financial Intelligence — evidence to decision architecture" }] },
  twitter: { card: "summary_large_image", title, description, images: [`${url}/opengraph-image`] },
};

const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "Article", "@id": `${url}#article`, url, headline: title, description, datePublished: "2026-09-09", author: { "@id": FOUNDER_ID }, publisher: { "@id": ORGANIZATION_ID }, isPartOf: { "@id": WEBSITE_ID } }, createBreadcrumbSchema([{ name: "Entimema", item: `${SITE_URL}/` }, { name: "Financial Intelligence V1", item: url }], `${url}#breadcrumb`)] };

export default function FinancialIntelligenceLaunchPage() {
  return <><Navbar active="product" /><EditorialExperience /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /></>;
}
