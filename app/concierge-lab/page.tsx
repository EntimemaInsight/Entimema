import type { Metadata } from "next";
import ConciergeLabShell from "@/components/concierge-lab/ConciergeLabShell";

export const metadata: Metadata = {
  title: "Concierge Lab | Entimema",
  description: "Private live and fixture interface for the Entimema Decision Intelligence Workspace.",
  robots: { index: false, follow: false },
};

export default function ConciergeLabPage() {
  return <ConciergeLabShell />;
}
