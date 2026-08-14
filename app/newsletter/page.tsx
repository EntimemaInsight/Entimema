import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./newsletter.module.css";

export default function NewsletterPage() {
  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.placeholder} aria-labelledby="newsletter-title">
        <p>ENTIMEMA INSIGHTS</p>
        <h1 id="newsletter-title">Newsletter subscriptions are coming soon.</h1>
        <div>We are preparing a dedicated subscription experience for Entimema&apos;s research across finance, risk and decision science.</div>
        <Link href="/resources">Return to Resources <span aria-hidden="true">→</span></Link>
      </section>
    </main>
  );
}
