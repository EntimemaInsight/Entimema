import BrandLogo from "@/components/BrandLogo";
import Navbar from "@/components/Navbar";
import styles from "./contact.module.css";

type ContactIcon = "document" | "handshake" | "user";

const contactPaths: Array<{
  title: string;
  subject: string;
  icon: ContactIcon;
}> = [
  { title: "Нов проект", subject: "Нов проект", icon: "document" },
  { title: "Партньорства", subject: "Партньорства", icon: "handshake" },
  { title: "Текущи клиенти", subject: "Текущ клиент", icon: "user" },
];

function ContactPathIcon({ icon }: { icon: ContactIcon }) {
  if (icon === "document") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M8.5 3.5h10l5 5v20h-15z" />
        <path d="M18.5 3.5v5h5M12.5 15h7M12.5 20h7" />
      </svg>
    );
  }

  if (icon === "handshake") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m3.5 11 5-3 5 3.5 4-2 6 3.5 5 5-4 4-3-1-2 2-3-1.5-2 1-6.5-6.5-3 1z" />
        <path d="m11 12.5 4.5 4.5a2.1 2.1 0 0 0 3 0l2-2M8.5 20l3.5-3.5M21.5 20.5l-5-5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="10.5" r="6" />
      <path d="M5.5 28.5c.7-6.1 4.4-9.5 10.5-9.5s9.8 3.4 10.5 9.5" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className={styles.page}>
      <Navbar active="contact" />

      <section className={styles.hero} aria-labelledby="contact-heading">
        <div className={`site-container ${styles.heroInner}`}>
          <header className={styles.intro}>
            <h1 id="contact-heading">Свържете се с нас</h1>
            <p>Тук сме, за да отговорим на въпросите ви.</p>
          </header>

          <nav className={styles.paths} aria-label="Вид запитване">
            {contactPaths.map(({ title, subject, icon }) => (
              <a
                className={styles.path}
                href={`mailto:office@entimema.net?subject=${encodeURIComponent(subject)}`}
                key={title}
              >
                <span className={styles.icon}>
                  <ContactPathIcon icon={icon} />
                </span>
                <span className={styles.cardFooter}>
                  <span>{title}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`site-container ${styles.footerInner}`}>
          <BrandLogo compact />
          <span>© 2026 Entimema</span>
        </div>
      </footer>
    </main>
  );
}
