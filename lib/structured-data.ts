export const SITE_URL = "https://www.entimema.net";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/about#founder`;

type BreadcrumbItem = {
  name: string;
  item?: string;
};

type ServiceSchemaInput = {
  path: `/services/${string}`;
  name: string;
  description: string;
  breadcrumbSection: "Finance" | "Decision Science";
  breadcrumbName: string;
};

/** Safely serialize a JSON-LD payload for an inline script element. */
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function createBreadcrumbSchema(items: readonly BreadcrumbItem[], id?: string) {
  return {
    "@type": "BreadcrumbList",
    ...(id ? { "@id": id } : {}),
    itemListElement: items.map(({ name, item }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      ...(item ? { item } : {}),
    })),
  };
}

export function createHomeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Entimema",
        url: SITE_URL,
        logo: `${SITE_URL}/entimema-logo.png`,
        description: "Entimema connects finance, risk, data, models and technology to build clearer decision systems for real business environments.",
        founder: { "@id": FOUNDER_ID },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "Entimema",
        url: SITE_URL,
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

export function createFounderSchema() {
  const pageUrl = `${SITE_URL}/about`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": FOUNDER_ID,
        name: "Aleksandar Dimitrov",
        url: pageUrl,
        jobTitle: "Founder",
        worksFor: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        isPartOf: { "@id": WEBSITE_ID },
        about: [{ "@id": ORGANIZATION_ID }, { "@id": FOUNDER_ID }],
      },
    ],
  };
}

export function createServicePageSchema({ path, name, description, breadcrumbSection, breadcrumbName }: ServiceSchemaInput) {
  const pageUrl = `${SITE_URL}${path}`;
  const pageId = `${pageUrl}#webpage`;
  const serviceId = `${pageUrl}#service`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": serviceId,
        name,
        description,
        url: pageUrl,
        provider: { "@id": ORGANIZATION_ID },
        mainEntityOfPage: { "@id": pageId },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: pageUrl,
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": serviceId },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      createBreadcrumbSchema(
        [
          { name: "Home", item: `${SITE_URL}/` },
          { name: breadcrumbSection },
          { name: breadcrumbName, item: pageUrl },
        ],
        `${pageUrl}#breadcrumb`,
      ),
    ],
  };
}
