export const productDestinations = [
  {
    title: "Entimema Finance Platform",
    description: "Turn financial data into validated, decision-ready outputs.",
    href: "/product/platform",
    group: "platform",
  },
  {
    title: "Entimema Risk Platform",
    description: "Build consistent, explainable credit and risk decision workflows.",
    status: "Coming soon",
    group: "platform",
  },
  {
    title: "AI Agent Manager",
    description: "A controlled environment for specialized financial and risk AI agents.",
    href: "/product/ai-agent-manager",
    group: "capability",
  },
] as const;

export const productFeature = {
  label: "What's new",
  title: "Financial Intelligence V1",
  description: "See how an Income Statement becomes validated, traceable financial analysis.",
  href: "/financial-intelligence-launch",
} as const;

export const serviceGroups = [
  {
    category: "Finance",
    items: [
      {
        title: "Financial Reporting & Analysis",
        description: "Turn financial data into reliable reporting and decision-ready analysis.",
        href: "/services/management-reporting",
      },
      {
        title: "Planning & Scenario Modelling",
        description: "Build driver-based plans, forecasts and scenarios.",
        href: "/services/budgets-and-forecasting",
      },
      {
        title: "Cost & Profitability Analysis",
        description: "Understand cost drivers, margins and product profitability.",
        href: "/services/cost-and-profitability",
      },
      {
        title: "CFO Advisory",
        description: "Strengthen financial control, decision support and finance execution.",
        href: "/services/cfo-function",
      },
    ],
  },
  {
    category: "Risk & Decisioning",
    items: [
      {
        title: "Credit Risk & Decisioning",
        description: "Improve credit decisions with stronger risk methodology and controlled workflows.",
        href: "/services/credit-risk",
      },
      {
        title: "AML & Fraud Investigation",
        description: "Strengthen AML and fraud controls with consistent, reviewable investigations.",
        href: "/services/aml-compliance",
      },
    ],
  },
] as const;

export const resourceDocumentation = [
  {
    title: "Product documentation",
    description: "Learn how to use Financial Intelligence and review its outputs.",
    href: "/workspace/documentation",
  },
  {
    title: "Data & security",
    description: "Understand how access, documents and processing are controlled.",
    href: "/workspace/data-security",
  },
  {
    title: "Integrations",
    description: "Learn about integrations on Entimema.",
    status: "Coming soon",
  },
] as const;
