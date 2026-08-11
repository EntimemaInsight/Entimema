import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DecisionArchitecture from "@/components/DecisionArchitecture";
import ApproachSection from "@/components/ApproachSection";
import PhilosophySection from "@/components/PhilosophySection";
import ConversionTrustSection from "@/components/ConversionTrustSection";
import ProcessSection from "@/components/ProcessSection";
import CaseCtaSection from "@/components/CaseCtaSection";

export const metadata: Metadata = {
  title: "Entimema | Financial Architecture, Decision Science & AI",
  description: "Financial architecture, decision science and AI agents for better financial, risk and management decisions.",
};

export default function Home() {
  return (
    <main className="site-page">
      <a className="skip-link" href="#home">Skip to main content</a>
      <AnnouncementBar />
      <Navbar />
      <section className="home-stage" aria-label="Entimema home">
        <Hero />
      </section>
      <DecisionArchitecture />
      <ApproachSection />
      <PhilosophySection />
      <ConversionTrustSection />
      <ProcessSection />
      <CaseCtaSection />
    </main>
  );
}
