import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Services | Entimema",
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
