import Image from "next/image";
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
      <section className={styles.offices} aria-labelledby="offices-title">
        <div className="site-container">
          <header className={styles.officeHeader}>
            <h2 id="offices-title">Нашите офиси</h2>
            <p>Можете да ни намерите на тази локация.</p>
          </header>

          <article className={styles.officeCard}>
            <Image
              alt="Храм-паметник Александър Невски в София"
              className={styles.officeImage}
              fill
              sizes="(max-width: 680px) calc(100vw - 40px), 520px"
              src="/entimema-sofia-office.webp"
            />
            <a
              aria-label="Вижте бул. Черни връх 192А, София 1404, България в Google Maps"
              className={styles.mapsLink}
              href="https://www.google.com/maps/search/?api=1&amp;query=%D0%B1%D1%83%D0%BB.%20%D0%A7%D0%B5%D1%80%D0%BD%D0%B8%20%D0%B2%D1%80%D1%8A%D1%85%20192%D0%90%2C%20%D0%A1%D0%BE%D1%84%D0%B8%D1%8F%201404%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F"
              rel="noopener noreferrer"
              target="_blank"
            />
          </article>
        </div>
      </section>
    </main>
  );
}
