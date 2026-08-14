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
export type ResourceStream = "insights" | "engineering";

export const resourceStreams = {
  insights: {
    label: "Insights",
    href: "/resources",
    description: "Practitioner research for finance, risk and management decisions.",
    themes: ["Credit Risk", "CFO & Finance", "Forecasting", "Cost & Profitability", "Financial Data & ERP", "Decision Intelligence"],
  },
  engineering: {
    label: "Engineering & Research",
    href: "/resources/engineering",
    description: "Technical research, modelling and analytical implementation.",
    themes: ["Credit Risk Modelling", "Data Science", "Model Validation", "Decision Engines", "Analytical Automation"],
  },
} as const satisfies Record<ResourceStream, { label: string; href: string; description: string; themes: readonly string[] }>;

type ResourceVisualBase = {
  /** Controls the restrained treatment used by the listing-page artwork. */
  motion?: "none" | "drift" | "trace";
  /** Retained for compact navigation previews; not rendered on editorial covers. */
  stages: readonly string[];
};

export type ResourceCover = ResourceVisualBase & {
  type: "editorial-artwork";
  src: `/resources/covers/${string}.${"png" | "jpg" | "jpeg" | "webp" | "avif"}`;
  alt: string;
  focalPoint?: `${number}% ${number}%`;
} | ResourceVisualBase & {
  type: "image";
  src: string;
  alt: string;
  focalPoint?: `${number}% ${number}%`;
} | ResourceVisualBase & {
  type: "photography";
  src: string;
  alt: string;
  focalPoint?: `${number}% ${number}%`;
};

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
  stream: ResourceStream;
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
  cover: ResourceCover;
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
    deck: "Manufacturing cost becomes decision-useful when accounting values can be connected to production stages, economic drivers and management decisions.",
    author: authors.aleksandar,
    publishedAt: "2026-08-11",
    readingMinutes: 12,
    topic: "cost-and-profitability",
    stream: "insights",
    featured: true,
    seoTitle: "Building a Manufacturing Cost Architecture | Entimema",
    metaDescription: "A practitioner framework connecting manufacturing cost, production stages, capacity, economic drivers, variance and management decisions.",
    canonicalPath: "/resources/building-a-manufacturing-cost-architecture",
    openGraphTitle: "Building a Manufacturing Cost Architecture",
    openGraphDescription: "A practitioner framework connecting manufacturing cost, production stages, capacity, economic drivers and management decisions.",
    relatedCapability: {
      label: "Cost & Margin Management",
      href: "/services/cost-and-profitability",
      description: "Build cost and margin systems that show where value is created, lost and changed by management action.",
    },
    relatedResourceSlugs: ["working-capital-as-a-system", "operational-driver-forecasting"],
    status: "published",
    indexable: true,
    cover: {
      type: "editorial-artwork",
      src: "/resources/covers/manufacturing-cost-architecture.png",
      motion: "none",
      alt: "Editorial artwork for Building a Manufacturing Cost Architecture showing layered industrial materials in a cinematic material study.",
      focalPoint: "0% 50%",
      stages: ["Inputs", "Intermediates", "Conversion", "Production", "Capacity", "Product economics", "Decision"],
    },
  },
  {
    title: "Working Capital as a System",
    slug: "working-capital-as-a-system",
    deck: "Working capital is the financial expression of operating processes: how commercial, inventory and supplier decisions become cash and financing requirements.",
    author: authors.aleksandar,
    publishedAt: "2026-08-11",
    readingMinutes: 12,
    topic: "planning-and-forecasting",
    stream: "insights",
    featured: false,
    seoTitle: "Working Capital as a System | Entimema",
    metaDescription: "A practitioner framework connecting working-capital drivers, operating processes, cash conversion, financing requirements and management decisions.",
    canonicalPath: "/resources/working-capital-as-a-system",
    openGraphTitle: "Working Capital as a System",
    openGraphDescription: "A practitioner framework for understanding how operations become working-capital positions, cash effects and financing decisions.",
    relatedCapability: { label: "Planning & Forecasting", href: "/services/budgets-and-forecasting", description: "Connect operational drivers, cash mechanics and scenarios to a planning system management can use." },
    relatedResourceSlugs: ["building-a-manufacturing-cost-architecture", "operational-driver-forecasting"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/working-capital-system.png", motion: "none", alt: "Editorial artwork for Working Capital as a System showing a continuous translucent glass sculpture representing liquidity and operating flow.", stages: ["Receivables", "Inventory", "Payables", "Cash", "Financing", "Decision"] },
  },
  {
    title: "Operational-Driver Forecasting",
    slug: "operational-driver-forecasting",
    deck: "Financial forecasts become more decision-useful when outcomes can be traced back to the operating assumptions, business relationships and constraints that created them.",
    author: authors.aleksandar,
    publishedAt: "2026-08-11",
    readingMinutes: 12,
    topic: "planning-and-forecasting",
    stream: "insights",
    featured: false,
    seoTitle: "Operational-Driver Forecasting | Entimema",
    metaDescription: "A practitioner framework connecting operating drivers, financial statements, scenarios and management decisions in an integrated forecast model.",
    canonicalPath: "/resources/operational-driver-forecasting",
    openGraphTitle: "Operational-Driver Forecasting",
    openGraphDescription: "Forecast the operating causes first, then trace their effects through financial statements, scenarios and management decisions.",
    relatedCapability: { label: "Planning & Forecasting", href: "/services/budgets-and-forecasting", description: "Build integrated forecasts that connect operating assumptions, financial outcomes, cash and management decisions." },
    relatedResourceSlugs: ["working-capital-as-a-system", "building-a-manufacturing-cost-architecture"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/operational-driver-forecasting.png", motion: "none", alt: "Editorial artwork for Operational-Driver Forecasting showing multiple luminous future trajectories across a cinematic landscape.", stages: ["Drivers", "Business model", "P&L / BS / Cash", "Scenario", "Decision"] },
  },
  {
    title: "Credit Vintage Analysis",
    slug: "credit-vintage-analysis",
    deck: "Portfolio averages describe the book today; vintage analysis reveals how origination cohorts develop at comparable stages of credit age.",
    author: authors.aleksandar,
    publishedAt: "2026-08-11",
    readingMinutes: 12,
    topic: "credit-risk",
    stream: "insights",
    featured: false,
    seoTitle: "Credit Vintage Analysis | Entimema",
    metaDescription: "A practitioner framework for comparing credit cohorts by months on book, investigating vintage divergence and connecting risk signals to validated decisions.",
    canonicalPath: "/resources/credit-vintage-analysis",
    openGraphTitle: "Credit Vintage Analysis",
    openGraphDescription: "Understand how credit cohorts develop through time and how vintage divergence becomes a signal for investigation—not an automatic diagnosis.",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Connect portfolio behaviour, models and policy evidence to controlled credit decisions." },
    relatedResourceSlugs: ["operational-driver-forecasting"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/credit-vintage-analysis.png", motion: "none", alt: "Editorial artwork for Credit Vintage Analysis showing layered credit vintage performance panels evolving through time.", stages: ["Cohort", "Credit age", "Performance", "Signal", "Decision"] },
  },
  {
    title:"From ERP Data to Management Intelligence",slug:"from-erp-data-to-management-intelligence",
    deck:"ERP data becomes decision-useful only after transactions are reconciled, given consistent business meaning and connected to analytical models and management decisions.",
    author:authors.aleksandar,publishedAt:"2026-08-11",readingMinutes:12,topic:"financial-data-and-erp",stream:"insights",featured:false,
    seoTitle:"From ERP Data to Management Intelligence | Entimema",
    metaDescription:"A practitioner framework connecting ERP transactions, reconciliation, business semantics, analytical models and management decisions.",
    canonicalPath:"/resources/from-erp-data-to-management-intelligence",openGraphTitle:"From ERP Data to Management Intelligence",
    openGraphDescription:"How reconciled ERP transactions become structured business meaning, analytical models and management decisions.",
    relatedCapability:{label:"Financial Data",href:"/services/financial-data",description:"Build reconciled financial-data foundations that connect ERP transactions to management analysis and decisions."},
    relatedResourceSlugs:["building-a-manufacturing-cost-architecture","working-capital-as-a-system","operational-driver-forecasting"],status:"published",indexable:true,
    cover:{type:"editorial-artwork",src:"/resources/covers/erp-management-intelligence.png",motion:"none",alt:"Editorial artwork showing fragmented ERP transaction data resolving into a structured analytical intelligence installation.",stages:["Transactions","Reconcile","Semantics","Model","Decision"]},
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
