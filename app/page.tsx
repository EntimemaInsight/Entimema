import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="site-page">
      <section className="home-stage" aria-label="Entimema начало">
        <AnnouncementBar />
        <Navbar />
        <Hero />
      </section>
    </main>
  );
}
