import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";

export default function ServicesPage() {
  return (
    <main className="site-page services-page">
      <AnnouncementBar />
      <Navbar active="services" />
      <ServicesSection />
    </main>
  );
}
