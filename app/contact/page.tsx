import Navbar from "@/components/Navbar";
import ContactExperience from "./ContactExperience";
import styles from "./contact.module.css";

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;

  return (
    <main className="contact-page">
      <Navbar active="contact" />
      <section className={styles.contact} aria-labelledby="contact-title">
        <div className="site-container">
          <header className={styles.hero}>
            <h1 id="contact-title">Свържете се с нас</h1>
            <p>Тук сме, за да отговорим на въпросите ви.</p>
          </header>
          <ContactExperience initialTopic={topic} />
        </div>
      </section>
    </main>
  );
}
