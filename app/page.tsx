import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ApproachSection from "@/components/ApproachSection";
import PhilosophySection from "@/components/PhilosophySection";

export default function Home() {
  return (
    <main className="site-page">
      <AnnouncementBar />
      <Navbar />
      <section className="home-stage" aria-label="Entimema начало">
        <Hero />
      </section>
      <ApproachSection />
      <PhilosophySection />
    </main>
  );
}
