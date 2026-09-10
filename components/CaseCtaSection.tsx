import styles from "./CaseCtaSection.module.css";
import { DemoTrigger } from "./DemoDiscovery";

export default function CaseCtaSection() {
  return (
    <section className={`case-cta ${styles.section}`} aria-labelledby="case-cta-title">
      <div className={`site-container case-cta__inner ${styles.inner}`}>
        <h2 className={styles.heading} id="case-cta-title">You already have the data.<br />The question is what you do with it.</h2>
        <p className={`case-cta__support ${styles.support}`}>Bring the financial workflow that still depends on manual preparation, disconnected files or unverified outputs.<br />We&apos;ll help you turn it into a controlled, repeatable process.</p>
        <DemoTrigger className={`primary-cta primary-cta--light case-cta__link ${styles.cta}`}>
          <span>Discuss your workflow</span>
        </DemoTrigger>
      </div>
    </section>
  );
}
