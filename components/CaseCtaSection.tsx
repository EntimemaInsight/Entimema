import styles from "./CaseCtaSection.module.css";
import { PRIMARY_COMMERCIAL_CTA } from "@/lib/cta-labels";
import { DemoTrigger } from "./DemoDiscovery";

export default function CaseCtaSection() {
  return (
    <section className={`case-cta ${styles.section}`} aria-labelledby="case-cta-title">
      <div className={`site-container case-cta__inner ${styles.inner}`}>
        <h2 className={styles.heading} id="case-cta-title">You already have the data.<br />The question is what you do with it.</h2>
        <p className={`case-cta__support ${styles.support}`}>Bring us the decision you&apos;re facing.<br />We&apos;ll help you build the structure behind it.</p>
        <DemoTrigger className={`primary-cta primary-cta--light case-cta__link ${styles.cta}`}>
          <span>{PRIMARY_COMMERCIAL_CTA}</span>
        </DemoTrigger>
      </div>
    </section>
  );
}
