import type { Metadata } from "next";
import ProductStory from "../ProductStory";

export const metadata: Metadata = {
  title: "AI Agent Manager for Financial Workflows | Entimema",
  description: "Configure, govern and monitor specialist financial AI agents with explicit policies, evidence and human review.",
  alternates: { canonical: "https://www.entimema.com/product/ai-agent-manager" },
};

const capabilities = [
  ["01", "Specialist agents", "Deploy agents around defined financial tasks, evidence and decision responsibilities."],
  ["02", "Configurable behaviour", "Set instructions, tools, context and escalation logic for each workflow."],
  ["03", "Deterministic guardrails", "Bind probabilistic AI work to explicit rules, calculations and policy checks."],
  ["04", "Human authority", "Escalate material exceptions while automating the work around the decision."],
  ["05", "Operational visibility", "See what every agent used, produced, checked and handed over for review."],
  ["06", "Controlled improvement", "Evaluate outcomes and apply approved corrections without losing traceability."],
] as const;

export default function AgentManagerPage() {
  return <ProductStory story={{
    kind: "agents",
    eyebrow: "ENTIMEMA AI AGENT MANAGER",
    heroLabel: "AI Agent Manager",
    title: <>Put financial AI agents to work. <em>Keep every decision under control.</em></>,
    lead: "Configure specialist agents, bind them to rules and evidence, review exceptions and monitor decision quality from one control plane.",
    sectionEyebrow: "CONTROL BEFORE SCALE",
    sectionTitle: <>AI agents built for financial work.<br /><em>Governance built into every run.</em></>,
    sectionLead: "Move beyond generic automation with agents designed around financial evidence, policy and accountable human judgment.",
    capabilities,
  }} />;
}
