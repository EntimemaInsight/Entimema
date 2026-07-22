import Link from "next/link";
import styles from "./CaseCtaSection.module.css";

export default function CaseCtaSection() {
  return (
    <section className={`case-cta ${styles.section}`} aria-labelledby="case-cta-title">
      <div className={`site-container case-cta__inner ${styles.inner}`}>
        <h2 className={styles.heading} id="case-cta-title">Следващото <span className={styles.noBreak}>по-добро</span>{" "}решение започва с разговор.</h2>
        <Link className={`primary-cta primary-cta--light case-cta__link ${styles.cta}`} href="/contact">
          <span>Обсъдете вашия казус</span><b aria-hidden="true">→</b>
        </Link>
      </div>
    </section>
  );
}
