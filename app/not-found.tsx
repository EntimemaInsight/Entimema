import Link from "next/link";
import Navbar from "@/components/Navbar";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <Navbar />
      <section className={styles.section} aria-labelledby="not-found-title">
        <div className={`site-container ${styles.inner}`}>
          <p className={styles.code}>404</p>
          <h1 id="not-found-title">Page not found.</h1>
          <p>The address may have changed, or the page may no longer exist.</p>
          <nav className={styles.links} aria-label="Page recovery">
            <Link href="/">Return home</Link>
            <Link href="/services">Explore services</Link>
            <Link href="/contact">Contact Entimema</Link>
          </nav>
        </div>
      </section>
    </main>
  );
}
