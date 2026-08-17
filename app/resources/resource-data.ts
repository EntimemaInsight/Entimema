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

/**
 * Resource editorial standard:
 * - `technicalTitle` preserves the subject's stable technical and SEO identity.
 * - `headline` creates analytical tension and implies a change in understanding.
 * - `slogan` develops that tension through a mechanism to its decision value.
 * - emphasis fields identify exact semantic phrases for the shared orange treatment.
 *
 * New Resources must define all three layers; an expressive headline never replaces
 * the technical terminology carried by search, metadata, headings and body content.
 */
export type ResourceRecord = {
  /** Stable technical identity used for search, SEO alignment and topical architecture. */
  technicalTitle: string;
  /** Editorial H1: introduces a tension and implies a transformation in understanding. */
  headline: string;
  /** Exact phrase within `headline` that marks its semantic pivot. */
  headlineEmphasis: string;
  slug: string;
  /** Supporting slogan: connects the tension to an analytical mechanism and decision value. */
  slogan: string;
  /** Optional exact phrase within `slogan` that receives restrained secondary emphasis. */
  sloganEmphasis?: string;
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
    technicalTitle: "Default Definition: The Boundary That Shapes Every PD Model",
    headline: "Default Definition: The Boundary That Shapes Every PD Model",
    headlineEmphasis: "Boundary That Shapes Every PD Model",
    slug: "pd-default-definition-target-construction",
    slogan: "A PD model does not discover default independently. It learns the definition of default embedded in its target—and carries that boundary into every probability and decision.",
    sloganEmphasis: "definition of default embedded in its target",
    author: authors.aleksandar,
    publishedAt: "2026-08-17",
    readingMinutes: 16,
    topic: "credit-risk",
    stream: "insights",
    featured: false,
    seoTitle: "Default Definition: The Boundary Shaping Every PD Model",
    metaDescription: "A practitioner framework for PD model target definition: default events, materiality, timing, obligor scope, cure, calibration, validation and monitoring.",
    canonicalPath: "/resources/pd-default-definition-target-construction",
    openGraphTitle: "Default Definition: The Boundary That Shapes Every PD Model",
    openGraphDescription: "A PD model learns the definition embedded in its target. See how that boundary propagates from event identification to credit decisions.",
    openGraphImage: "/resources/covers/pd-default-definition.png",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Align default methodology, source events, target construction, model purpose and validation." },
    relatedResourceSlugs: ["pd-model-observation-performance-windows", "pd-model-ranking-calibration", "pd-model-monitoring", "credit-vintage-analysis"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/pd-default-definition.png", motion: "none", alt: "Abstract editorial artwork showing credit-event trajectories crossing a structured analytical boundary from performing status into validated default states.", stages: ["Event", "Criteria", "Validity", "Scope", "Date", "Target", "Lifecycle"] },
  },
  {
    technicalTitle: "PD Model Observation and Performance Windows",
    headline: "A PD Model Can Learn the Wrong Risk on the Right Data",
    headlineEmphasis: "Wrong Risk",
    slug: "pd-model-observation-performance-windows",
    slogan: "Observation windows, time zero and performance horizons define the prediction clock—and therefore the economic question a credit-risk model actually learns.",
    sloganEmphasis: "define the prediction clock",
    author: authors.aleksandar,
    publishedAt: "2026-08-16",
    readingMinutes: 7,
    topic: "credit-risk",
    stream: "engineering",
    featured: false,
    seoTitle: "PD Model Observation & Performance Windows | Entimema",
    metaDescription: "Design observation and performance windows for PD models. Control time zero, leakage, seasoning, censoring and development-sample representativeness.",
    canonicalPath: "/resources/pd-model-observation-performance-windows",
    openGraphTitle: "A PD Model Can Learn the Wrong Risk on the Right Data",
    openGraphDescription: "Why observation windows, time zero and performance horizons define the risk question before PD modelling begins.",
    openGraphImage: "/resources/covers/pd-model-time-architecture.png",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Align model purpose, temporal sample architecture, default definition, portfolio evidence and validation." },
    relatedResourceSlugs: ["credit-vintage-analysis", "pd-model-ranking-calibration", "pd-model-monitoring"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/pd-model-time-architecture.png", motion: "none", alt: "Abstract editorial artwork showing historical information layers crossing a defined observation boundary into a future probability-of-default horizon.", stages: ["History", "Observation", "Time zero", "Performance", "Outcome", "Sample"] },
  },
  {
    technicalTitle: "PD Model Recalibration vs Redevelopment",
    headline: "A PD Model Has Deteriorated. Should You Recalibrate or Rebuild?",
    headlineEmphasis: "Recalibrate or Rebuild?",
    slug: "pd-model-recalibration-vs-redevelopment",
    slogan: "A compact diagnostic framework for matching model intervention to calibration failure, ranking deterioration, population change and structural instability.",
    sloganEmphasis: "matching model intervention",
    author: authors.aleksandar,
    publishedAt: "2026-08-16",
    readingMinutes: 7,
    topic: "credit-risk",
    stream: "insights",
    featured: false,
    seoTitle: "PD Model Recalibration vs Redevelopment | Entimema",
    metaDescription: "When should a deteriorating PD model be recalibrated or rebuilt? A practitioner decision framework based on discrimination, calibration and structural change.",
    canonicalPath: "/resources/pd-model-recalibration-vs-redevelopment",
    openGraphTitle: "A PD Model Has Deteriorated. Should You Recalibrate or Rebuild?",
    openGraphDescription: "Match PD model intervention to the actual failure across ranking, calibration, population, segments, data and decision policy.",
    openGraphImage: "/resources/covers/pd-model-recalibration-redevelopment.png",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Diagnose model deterioration and select proportionate recalibration, strategy or redevelopment responses." },
    relatedResourceSlugs: ["pd-model-monitoring", "pd-model-ranking-calibration", "credit-vintage-analysis"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/pd-model-recalibration-redevelopment.png", motion: "none", alt: "Editorial artwork showing one PD model separating into a calibrated probability surface and a structurally rebuilt analytical lattice.", stages: ["Signal", "Ranking", "Calibration", "Structure", "Intervention", "Validation"] },
  },
  {
    technicalTitle: "PD Model Monitoring",
    headline: "A PD Model Can Keep Working While Its Risk Starts to Drift",
    headlineEmphasis: "Risk Starts to Drift",
    slug: "pd-model-monitoring",
    slogan: "A diagnostic architecture for separating data, population, ranking, calibration, outcome and decision-system change before selecting a model response.",
    sloganEmphasis: "diagnostic architecture",
    author: authors.aleksandar,
    publishedAt: "2026-08-16",
    readingMinutes: 16,
    topic: "credit-risk",
    stream: "insights",
    featured: false,
    seoTitle: "PD Model Monitoring: Detect Credit Risk Drift | Entimema",
    metaDescription: "A practitioner framework for PD model monitoring across data integrity, population drift, discrimination, calibration, vintages and decision policy.",
    canonicalPath: "/resources/pd-model-monitoring",
    openGraphTitle: "PD Model Monitoring: How to Detect When Credit Risk Starts to Drift",
    openGraphDescription: "Detect PD model drift by connecting population, discrimination, calibration and outcomes to diagnosis, ownership and action.",
    openGraphImage: "/resources/covers/pd-model-monitoring.png",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Build model-monitoring systems that connect portfolio evidence, model performance, policy and governed action." },
    relatedResourceSlugs: ["pd-model-recalibration-vs-redevelopment", "pd-model-ranking-calibration", "credit-vintage-analysis"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/pd-model-monitoring.png", motion: "none", alt: "Editorial artwork for PD Model Monitoring showing ordered probability layers becoming unstable as calibration and portfolio signals drift.", stages: ["Data", "Population", "Ranking", "Calibration", "Outcome", "Decision", "Action"] },
  },
  {
    technicalTitle: "Manufacturing Cost Architecture",
    headline: "When Manufacturing Cost Stops Explaining the Business",
    headlineEmphasis: "Explaining the Business",
    slug: "building-a-manufacturing-cost-architecture",
    slogan: "Manufacturing cost becomes decision-useful when accounting values are connected to production stages, economic drivers and management decisions.",
    sloganEmphasis: "decision-useful",
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
    technicalTitle: "Working Capital Management",
    headline: "Working Capital Is an Operating System, Not a Balance-Sheet Number",
    headlineEmphasis: "Operating System",
    slug: "working-capital-as-a-system",
    slogan: "Receivables, inventory and payables reveal their cash and financing consequences only when KPI movements are traced through operating drivers, process owners and responsible actions.",
    sloganEmphasis: "operating drivers",
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
    technicalTitle: "Operational-Driver Forecasting",
    headline: "A Forecast Can Balance and Still Misread the Business",
    headlineEmphasis: "Misread the Business",
    slug: "operational-driver-forecasting",
    slogan: "Tracing operating drivers, constraints and financial relationships through the P&L, balance sheet and cash flow turns a coherent projection into a model management can interrogate.",
    sloganEmphasis: "a model management can interrogate",
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
    technicalTitle: "Credit Vintage Analysis",
    headline: "The Portfolio Average Can Hide the Risk Already Emerging",
    headlineEmphasis: "Risk Already Emerging",
    slug: "credit-vintage-analysis",
    slogan: "Aligning origination cohorts by credit age exposes vintage divergence early, while segmentation and validation determine whether the signal warrants a credit-policy response.",
    sloganEmphasis: "segmentation and validation",
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
    relatedResourceSlugs: ["pd-model-recalibration-vs-redevelopment", "pd-model-monitoring", "operational-driver-forecasting"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/credit-vintage-analysis.png", motion: "none", alt: "Editorial artwork for Credit Vintage Analysis showing layered credit vintage performance panels evolving through time.", stages: ["Cohort", "Credit age", "Performance", "Signal", "Decision"] },
  },
  {
    technicalTitle: "Credit Model Discrimination, Calibration and Decision Performance",
    headline: "A High Gini Does Not Make a Good Credit Decision",
    headlineEmphasis: "Good Credit Decision",
    slug: "high-gini-good-credit-decision",
    slogan: "A model can rank risk remarkably well and still support the wrong lending decision.",
    sloganEmphasis: "wrong lending decision",
    author: authors.aleksandar,
    publishedAt: "2026-08-16",
    readingMinutes: 8,
    topic: "credit-risk",
    stream: "insights",
    featured: false,
    seoTitle: "A High Gini Does Not Make a Good Credit Decision | Entimema",
    metaDescription: "Why credit model discrimination, calibration and decision performance must be monitored separately across the lending decision system.",
    canonicalPath: "/resources/high-gini-good-credit-decision",
    openGraphTitle: "A High Gini Does Not Make a Good Credit Decision",
    openGraphDescription: "A model can rank risk remarkably well and still support the wrong lending decision.",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Connect portfolio behaviour, models and policy evidence to controlled credit decisions." },
    relatedResourceSlugs: ["credit-vintage-analysis", "operational-driver-forecasting"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/high-gini-credit-decision.png", motion: "none", alt: "Editorial artwork for A High Gini Does Not Make a Good Credit Decision showing precisely ranked risk objects whose projections diverge across an underlying calibration surface.", stages: ["Population", "Score", "Ranking", "PD", "Policy", "Decision", "Outcome"] },
  },
  {
    technicalTitle: "Probability of Default Model Calibration",
    headline: "Your PD Model Ranks Risk. Calibration Decides What That Risk Means.",
    headlineEmphasis: "Calibration Decides What That Risk Means.",
    slug: "pd-model-ranking-calibration",
    slogan: "A borrower can remain in exactly the same relative risk position while the probability attached to that position changes materially.",
    sloganEmphasis: "probability attached to that position",
    author: authors.aleksandar,
    publishedAt: "2026-08-16",
    readingMinutes: 7,
    topic: "credit-risk",
    stream: "insights",
    featured: false,
    seoTitle: "PD Model Calibration: Ranking Risk vs Probability | Entimema",
    metaDescription: "Understand PD model calibration, why credit-risk ranking differs from absolute probability of default, and how calibration affects lending decisions.",
    canonicalPath: "/resources/pd-model-ranking-calibration",
    openGraphTitle: "Your PD Model Ranks Risk. Calibration Decides What That Risk Means.",
    openGraphDescription: "How unchanged credit-risk ordering can support materially different probabilities of default—and different lending decisions.",
    openGraphImage: "/resources/covers/pd-model-ranking-calibration.png",
    relatedCapability: { label: "Credit Risk", href: "/services/credit-risk", description: "Connect portfolio behaviour, models and policy evidence to controlled credit decisions." },
    relatedResourceSlugs: ["pd-model-recalibration-vs-redevelopment", "pd-model-monitoring", "high-gini-good-credit-decision", "credit-vintage-analysis"],
    status: "published",
    indexable: true,
    cover: { type: "editorial-artwork", src: "/resources/covers/pd-model-ranking-calibration.png", motion: "none", alt: "Editorial artwork for PD Model Calibration showing one fixed risk ordering mapped across two different absolute probability-of-default scales.", stages: ["Data", "Ranking", "Risk order", "Calibration", "PD", "Decision"] },
  },
  {
    technicalTitle:"ERP Data and Management Intelligence",headline:"ERP Records the Business. It Does Not Explain It.",headlineEmphasis:"Does Not Explain It.",slug:"from-erp-data-to-management-intelligence",
    slogan:"Reconciliation and consistent business semantics connect technical transactions to analytical models, giving management evidence it can use without confusing system accuracy with decision completeness.",
    sloganEmphasis:"decision completeness",
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

export function getPublishedResourcesByStream(stream: ResourceStream) {
  return publishedResources.filter((resource) => resource.stream === stream);
}

export const publishedInsightResources = getPublishedResourcesByStream("insights");
export const publishedEngineeringResources = getPublishedResourcesByStream("engineering");

const resourceThemeTopicSlugs: Partial<Record<(typeof resourceStreams.insights.themes)[number], ResourceTopicSlug>> = {
  "Credit Risk": "credit-risk",
  "CFO & Finance": "financial-architecture",
  Forecasting: "planning-and-forecasting",
  "Cost & Profitability": "cost-and-profitability",
  "Financial Data & ERP": "financial-data-and-erp",
  "Decision Intelligence": "decision-intelligence",
};

export function getResourceThemeHref(theme: string) {
  const topic = resourceThemeTopicSlugs[theme as keyof typeof resourceThemeTopicSlugs];
  return topic && publishedInsightResources.some((resource) => resource.topic === topic)
    ? `/resources?topic=${topic}`
    : undefined;
}

export function getPublishedResource(slug: string) {
  return publishedResources.find((resource) => resource.slug === slug);
}

export function getTopic(topic: ResourceTopicSlug) {
  return resourceTopics.find((item) => item.slug === topic);
}

export function getPublishedRelatedResources(resource: ResourceRecord) {
  const curatedOrder = new Map(resource.relatedResourceSlugs.map((slug, index) => [slug, index]));
  const topicDescription = getTopic(resource.topic)?.description ?? "";
  const sourceTerms = getRecommendationTerms(`${resource.technicalTitle} ${resource.headline} ${resource.slogan} ${topicDescription}`);
  const recommendationPool = resource.stream === "engineering"
    ? getPublishedResourcesByStream(resource.stream)
    : publishedResources;

  return recommendationPool
    .filter((candidate) => candidate.slug !== resource.slug)
    .map((candidate, index) => {
      const candidateTopic = getTopic(candidate.topic)?.description ?? "";
      const candidateTerms = getRecommendationTerms(`${candidate.technicalTitle} ${candidate.headline} ${candidate.slogan} ${candidateTopic}`);
      const sharedTerms = [...sourceTerms].filter((term) => candidateTerms.has(term)).length;
      const curatedIndex = curatedOrder.get(candidate.slug);
      const score = (curatedIndex === undefined ? 0 : 100 - curatedIndex)
        + (candidate.topic === resource.topic ? 40 : 0)
        + (candidate.stream === resource.stream ? 10 : 0)
        + sharedTerms;

      return { candidate, index, score };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

const recommendationStopWords = new Set([
  "and", "are", "becomes", "business", "decisions", "financial", "from", "how", "into", "management", "the", "their", "through", "when", "with",
]);

function getRecommendationTerms(value: string) {
  return new Set(
    value.toLocaleLowerCase().match(/[a-z]+/g)?.filter((term) => term.length > 3 && !recommendationStopWords.has(term)) ?? [],
  );
}
