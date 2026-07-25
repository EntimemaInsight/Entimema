import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";
import styles from "./contact.module.css";

const contactPaths = [
  { title: "Нов проект", subject: "Нов проект", icon: "document" },
  { title: "Партньорства", subject: "Партньорства", icon: "connected" },
  { title: "Текущи клиенти", subject: "Текущ клиент", icon: "account" },
] as const;

function ContactIcon({ type }: { type: (typeof contactPaths)[number]["icon"] }) {
  return (
    <svg className={styles.icon} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      {type === "document" && (
        <>
          <path d="M9 3.5h9l5 5V28.5H9z" />
          <path d="M18 3.5v5h5M13 15h6M13 20h6" />
        </>
      )}
      {type === "connected" && (
        <>
          <circle cx="8" cy="16" r="3.5" />
          <circle cx="24" cy="8" r="3.5" />
          <circle cx="24" cy="24" r="3.5" />
          <path d="m11.2 14.4 9.6-4.8M11.2 17.6l9.6 4.8" />
        </>
      )}
      {type === "account" && (
        <>
          <circle cx="13" cy="10" r="5" />
          <path d="M4.5 27c.7-5.2 3.5-8 8.5-8 3 0 5.2 1 6.6 2.9M21 26l2.5 2.5 5-6" />
        </>
      )}
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="contact-page">
      <Navbar active="contact" />
      <section className={styles.content} aria-labelledby="contact-title">
        <div className="site-container">
          <header className={styles.intro}>
            <h1 id="contact-title">Свържете се с нас</h1>
            <p>Тук сме, за да отговорим на въпросите ви.</p>
          </header>

          <nav className={styles.paths} aria-label="Вид запитване">
            {contactPaths.map(({ title, subject, icon }) => (
              <a
                className={styles.path}
                href={`mailto:office@entimema.net?subject=${encodeURIComponent(subject)}`}
                key={title}
              >
                <ContactIcon type={icon} />
                <span className={styles.pathFooter}>
                  <span>{title}</span>
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>
      <footer className="contact-footer"><div className="site-container"><BrandLogo compact /><span>© 2026 Entimema</span></div></footer>
    </main>
  );
}
