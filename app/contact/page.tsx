import BrandLogo from "@/components/BrandLogo";
import Navbar from "@/components/Navbar";
import styles from "./contact.module.css";

type IconProps = {
  className?: string;
};

function ProjectIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
    >
      <path d="M7.5 4.5h11l6 6v17h-17z" />
      <path d="M18.5 4.5v6h6M11.5 16h9M11.5 21h9" />
    </svg>
  );
}

function PartnershipIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
    >
      <circle cx="7" cy="16" r="3.5" />
      <circle cx="25" cy="8" r="3.5" />
      <circle cx="25" cy="24" r="3.5" />
      <path d="m10.2 14.5 11.6-5M10.2 17.5l11.6 5" />
    </svg>
  );
}

function ClientIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      viewBox="0 0 32 32"
    >
      <circle cx="13" cy="10" r="5" />
      <path d="M4.5 27c.6-5.4 3.4-8 8.5-8 3.4 0 5.8 1.2 7.2 3.7M21 16.5l2.5 2.5 5-5" />
    </svg>
  );
}

const contactPaths = [
  { title: "Нов проект", subject: "Нов проект", Icon: ProjectIcon },
  { title: "Партньорства", subject: "Партньорства", Icon: PartnershipIcon },
  { title: "Текущи клиенти", subject: "Текущ клиент", Icon: ClientIcon },
];

export default function ContactPage() {
  return (
    <main className="contact-page">
      <Navbar active="contact" />
      <section className={styles.contact} aria-labelledby="contact-title">
        <div className="site-container">
          <header className={styles.hero}>
            <h1 id="contact-title">Свържете се с нас</h1>
            <p>Тук сме, за да отговорим на въпросите ви.</p>
          </header>

          <nav className={styles.paths} aria-label="Вид запитване">
            {contactPaths.map(({ title, subject, Icon }) => (
              <a
                className={styles.path}
                href={`mailto:office@entimema.net?subject=${encodeURIComponent(subject)}`}
                key={title}
              >
                <span className={styles.iconFrame} aria-hidden="true">
                  <Icon className={styles.icon} />
                </span>
                <span className={styles.title}>{title}</span>
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>
      <footer className="contact-footer">
        <div className="site-container">
          <BrandLogo compact />
          <span>© 2026 Entimema</span>
        </div>
      </footer>
    </main>
  );
}
