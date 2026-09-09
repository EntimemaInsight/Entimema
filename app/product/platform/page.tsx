import type { Metadata } from "next";
import ProductStory from "../ProductStory";

export const metadata: Metadata = {
  title: "Controlled Financial Decision Platform | Entimema",
  description: "Connect evidence, AI interpretation, deterministic controls and human review in one traceable financial decision workflow.",
  alternates: { canonical: "https://www.entimema.com/product/platform" },
};

const capabilities = [
  ["01", "Intelligent intake", "Turn fragmented financial documents and data into structured decision context."],
  ["02", "Workflow orchestration", "Coordinate AI tasks, rules, approvals and people in one controlled sequence."],
  ["03", "Validation engine", "Test outputs against explicit policies, calculations and evidence requirements."],
  ["04", "Exception workspace", "Route material uncertainty to the right person with the full context intact."],
  ["05", "Decision record", "Preserve evidence, controls, reasoning and approvals as one reviewable record."],
  ["06", "Composable architecture", "Start with one workflow and extend the same control model as needs evolve."],
] as const;

export default function PlatformPage() {
  return <ProductStory story={{
    kind: "platform",
    eyebrow: "ENTIMEMA DECISION PLATFORM",
    heroLabel: "Platform overview",
    title: <>Financial decisions, controlled from <em>evidence to action.</em></>,
    lead: "Connect financial evidence, AI interpretation, deterministic controls and human review in one traceable workflow.",
    sectionEyebrow: "ONE DECISION ARCHITECTURE",
    sectionTitle: <>Everything the decision needs.<br /><em>Nothing outside your control.</em></>,
    sectionLead: "A modular financial decision layer designed to make complex work faster, consistent and defensible.",
    capabilities,
  }} />;
}
