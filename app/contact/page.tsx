import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactExperience from "./ContactExperience";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact us | Entimema",
  description: "We’re here to help answer your questions.",
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;

  return (
    <main className="contact-page">
      <Navbar active="contact" />
      <section className={styles.contact} aria-labelledby="contact-title">
        <div className="site-container">
          <header className={styles.hero}>
            <h1 id="contact-title">Contact us</h1>
            <p>We’re here to help answer your questions.</p>
          </header>
          <ContactExperience initialTopic={topic} />
        </div>
      </section>
    </main>
  );
}
