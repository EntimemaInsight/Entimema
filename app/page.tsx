import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustLayer from "@/components/TrustLayer";
import ApproachSection from "@/components/ApproachSection";
import ProcessSection from "@/components/ProcessSection";

export default function Home() {
  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar />
      <section className="home-stage" aria-label="Entimema начало"><Hero /></section>
      <TrustLayer />
      <ApproachSection />
      <ProcessSection />
    </main>
  );
}
