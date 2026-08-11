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
  alternates: { canonical: "/" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Entimema",
  url: "https://www.entimema.net",
  logo: "https://www.entimema.net/entimema-logo.png",
  founder: {
    "@type": "Person",
    name: "Aleksandar Dimitrov",
    url: "https://www.entimema.net/about",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Entimema",
  url: "https://www.entimema.net",
  publisher: {
    "@type": "Organization",
    name: "Entimema",
    url: "https://www.entimema.net",
  },
};

export default function Home() {
  return (
    <main className="site-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }} />
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
