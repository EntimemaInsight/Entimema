export const SITE_URL = "https://www.entimema.com";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const FOUNDER_ID = `${SITE_URL}/alexander-dimitrov#person`;
export const FINAI_URL = `${SITE_URL}/finai`;
export const FINAI_ID = `${FINAI_URL}#term`;

type BreadcrumbItem = {
  name: string;
  item?: string;
};

type ServiceSchemaInput = {
  path: `/services/${string}`;
  name: string;
  description: string;
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
        knowsAbout: { "@id": FINAI_ID },
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

export function createFinaiSchema() {
  const pageId = `${FINAI_URL}#webpage`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": FINAI_ID,
        name: "FinAI",
        alternateName: "Financial Artificial Intelligence",
        description: "FinAI by Entimema is a governed approach to AI agents for Finance and Risk, connecting model reasoning, deterministic controls, traceable evidence and accountable human judgement.",
        url: FINAI_URL,
        inDefinedTermSet: { "@id": `${FINAI_URL}#definition` },
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${FINAI_URL}#definition`,
        name: "FinAI by Entimema",
        url: FINAI_URL,
        creator: { "@id": FOUNDER_ID },
        publisher: { "@id": ORGANIZATION_ID },
        hasDefinedTerm: { "@id": FINAI_ID },
      },
      {
        "@type": "WebPage",
        "@id": pageId,
        url: FINAI_URL,
        name: "FinAI by Entimema",
        description: "A governed architecture for AI agents in Finance and Risk, developed by Entimema and its founder Alexander Dimitrov.",
        isPartOf: { "@id": WEBSITE_ID },
        about: [
          { "@id": FINAI_ID },
          { "@id": ORGANIZATION_ID },
          { "@id": FOUNDER_ID },
        ],
        mainEntity: { "@id": FINAI_ID },
        author: { "@id": FOUNDER_ID },
        publisher: { "@id": ORGANIZATION_ID },
        breadcrumb: { "@id": `${FINAI_URL}#breadcrumb` },
      },
      createBreadcrumbSchema(
        [
          { name: "Entimema", item: `${SITE_URL}/` },
          { name: "FinAI", item: FINAI_URL },
        ],
        `${FINAI_URL}#breadcrumb`,
      ),
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
        name: "Alexander Dimitrov",
        alternateName: ["Aleksandar Dimitrov", "Александър Димитров"],
        givenName: "Alexander",
        familyName: "Dimitrov",
        url: `${SITE_URL}/alexander-dimitrov`,
        jobTitle: "Founder",
        worksFor: { "@id": ORGANIZATION_ID },
        sameAs: ["https://www.linkedin.com/in/alexander-dimitrov-entimema/"],
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

export function createServicePageSchema({ path, name, description, breadcrumbName }: ServiceSchemaInput) {
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
          { name: "Entimema", item: `${SITE_URL}/` },
          { name: "Services", item: `${SITE_URL}/services` },
          { name: breadcrumbName, item: pageUrl },
        ],
        `${pageUrl}#breadcrumb`,
      ),
    ],
  };
}
