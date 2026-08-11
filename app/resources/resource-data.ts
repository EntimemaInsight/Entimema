export const resourceTopics = [
  { slug: "financial-architecture", label: "Financial Architecture", description: "Finance-function structure, management control and the systems behind financial decisions." },
  { slug: "planning-and-forecasting", label: "Planning & Forecasting", description: "Drivers, forecasts, cash and scenarios connected to management action." },
  { slug: "cost-and-profitability", label: "Cost & Profitability", description: "Cost mechanics, manufacturing economics, margin and decision-useful profitability." },
  { slug: "credit-risk", label: "Credit Risk", description: "Models, portfolio behaviour, policy and risk decisions across the credit lifecycle." },
  { slug: "financial-data-and-erp", label: "Financial Data & ERP", description: "Reliable financial information from transactions and semantics to management use." },
  { slug: "decision-intelligence", label: "Decision Intelligence", description: "Models, rules, uncertainty and traceable operational decision systems." },
  { slug: "finance-and-risk-ai", label: "Finance & Risk AI", description: "Controlled agents, trusted context, oversight and bounded execution." },
] as const;

export type ResourceTopicSlug = (typeof resourceTopics)[number]["slug"];
export type ResourceStatus = "draft" | "published";

export type ResourceAuthor = {
  name: string;
  affiliation: string;
  profilePath?: string;
};

export type RelatedCapability = {
  label: string;
  href: string;
  description: string;
};

export type ResourceRecord = {
  title: string;
  slug: string;
  deck: string;
  author: ResourceAuthor;
  publishedAt?: string;
  updatedAt?: string;
  readingMinutes: number;
  topic: ResourceTopicSlug;
  featured: boolean;
  seoTitle: string;
  metaDescription: string;
  canonicalPath: `/resources/${string}`;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImage?: string;
  relatedCapability: RelatedCapability;
  relatedResourceSlugs: string[];
  status: ResourceStatus;
  indexable: boolean;
};

const authors = {
  aleksandar: {
    name: "Aleksandar Dimitrov",
    affiliation: "Entimema",
    profilePath: "/about",
  },
} satisfies Record<string, ResourceAuthor>;

export const resources: ResourceRecord[] = [
  {
    title: "Building a Manufacturing Cost Architecture",
    slug: "building-a-manufacturing-cost-architecture",
    deck: "A future practitioner framework for connecting manufacturing economics, financial data and management decisions.",
    author: authors.aleksandar,
    readingMinutes: 8,
    topic: "cost-and-profitability",
    featured: true,
    seoTitle: "Building a Manufacturing Cost Architecture | Entimema",
    metaDescription: "A practitioner framework for connecting materials, conversion costs, production stages, margin and management decisions.",
    canonicalPath: "/resources/building-a-manufacturing-cost-architecture",
    openGraphTitle: "Building a Manufacturing Cost Architecture",
    openGraphDescription: "A practitioner framework for connecting manufacturing economics, financial data and management decisions.",
    relatedCapability: {
      label: "Cost & Margin Management",
      href: "/services/cost-and-profitability",
      description: "Build cost and margin systems that show where value is created, lost and changed by management action.",
    },
    relatedResourceSlugs: [],
    status: "draft",
    indexable: false,
  },
];

export const publishedResources = resources.filter(
  (resource): resource is ResourceRecord & { status: "published"; indexable: true; publishedAt: string } =>
    resource.status === "published" && resource.indexable === true && Boolean(resource.publishedAt),
);

export function getPublishedResource(slug: string) {
  return publishedResources.find((resource) => resource.slug === slug);
}

export function getTopic(topic: ResourceTopicSlug) {
  return resourceTopics.find((item) => item.slug === topic);
}

export function getPublishedRelatedResources(resource: ResourceRecord) {
  return resource.relatedResourceSlugs
    .map((slug) => getPublishedResource(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3);
}
