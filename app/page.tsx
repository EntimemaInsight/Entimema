import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DecisionArchitecture from "@/components/DecisionArchitecture";
import ApproachSection from "@/components/ApproachSection";
import PhilosophySection from "@/components/PhilosophySection";
import ProcessSection from "@/components/ProcessSection";
import CaseCtaSection from "@/components/CaseCtaSection";

export default function Home() {
  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar />
      <section className="home-stage" aria-label="Entimema начало">
        <Hero />
      </section>
      <DecisionArchitecture />
      <ApproachSection />
      <PhilosophySection />
      <ProcessSection />
      <CaseCtaSection />
    </main>
  );
}
