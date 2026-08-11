import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Services | Entimema",
  description: "Financial architecture and decision science across CFO advisory, planning, reporting, financial data, AI agents, credit risk, AML and decision intelligence.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <main className="site-page services-page">
      <AnnouncementBar />
      <Navbar active="services" />
      <ServicesSection />
    </main>
  );
}
