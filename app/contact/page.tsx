import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactExperience from "./ContactExperience";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact us | Entimema",
  description: "Tell us the financial, risk, reporting or data problem you are trying to solve.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;

  return (
    <main className="contact-page">
      <Navbar active="contact" />
      <section className={styles.contact} aria-labelledby="contact-title">
        <div className="site-container">
          <header className={styles.hero}>
            <h1 id="contact-title">Tell us the problem.</h1>
            <p>Start with the decision, model or system you are trying to improve.</p>
          </header>
          <ContactExperience initialTopic={topic} />
        </div>
      </section>
    </main>
  );
}
