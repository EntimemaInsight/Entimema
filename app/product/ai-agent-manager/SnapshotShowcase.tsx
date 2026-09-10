"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./snapshot-showcase.module.css";

const screens = [
  {
    id: "analysis", eyebrow: "Financial analysis",
    title: "From source statement to financial understanding.",
    copy: "Explore an income statement with structured values, deterministic KPIs and the source evidence alongside each result.",
    agent: "Financial Statement Analysis Agent", role: "Structure & interpret",
    summary: "Source-grounded values and supported financial KPIs within the verified pilot scope.",
    detail: "Revenue, margins and financial line items remain connected to their original workbook cells.",
    alt: "Entimema income statement workspace showing FY2025 revenue of €12.48m, a twelve-row financial table and the Gross Profit source-cell inspector.",
  },
  {
    id: "controls", eyebrow: "Financial controls",
    title: "Every financial relationship. Open to inspection.",
    copy: "See the arithmetic, source references and result of each deterministic check. Keep reconciliation separate from interpretation.",
    agent: "Financial Validation / Control Agent", role: "Reconcile & validate",
    summary: "A proposed specialist surface for deterministic checks and explicit exceptions.",
    detail: "Six checks pass; two require review. Gross profit reconciles to the source with a €0 difference.",
    alt: "Entimema Controls workspace with eight validation results, six passes, two review items and an inspector showing Revenue minus Cost of Sales equals Gross Profit with a €0 difference.",
  },
  {
    id: "review", eyebrow: "Human review",
    title: "Keep judgement with the people accountable for it.",
    copy: "Bring the exception, materiality and source context into one review surface, with the proposed interpretation ready for a human decision.",
    agent: "Exception Review Agent", role: "Inspect & resolve",
    summary: "A proposed review workspace for material exceptions and accountable human judgement.",
    detail: "A €312,000 expense needs classification review. Its source value is preserved while supporting context is requested.",
    alt: "Entimema Human Review workspace showing two exceptions, a €312,000 expense at 2.5% of revenue, source evidence, a proposed interpretation and reviewer approval controls.",
  },
] as const;

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Keep server-rendered content visible without JavaScript; animate only below the fold.
    if (node.getBoundingClientRect().top < window.innerHeight) return;
    node.dataset.pending = "true";
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        delete node.dataset.pending;
        observer.disconnect();
      }
    }, { threshold: 0, rootMargin: "0px 0px -48px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${styles.reveal} ${className}`}>{children}</div>;
}

export default function SnapshotShowcase() {
  return <>
    <section className={styles.library} id="agents">
      <div className={styles.container}>
        <Reveal>
          <header className={styles.header}>
            <span>Agent Library</span>
            <h2>Specialist financial agents.<br/><em>One controlled execution system.</em></h2>
            <p>Explore financial analysis, deterministic control and human review as connected workflow components in the Entimema Agent Library.</p>
          </header>
          <div className={styles.libraryGrid}>
            {screens.map((screen, index) => <a key={screen.id} href={`#${screen.id}`} className={styles.libraryCard}>
              <div className={styles.cardTop}><span>0{index + 1} / {screen.role}</span><span>Interface preview</span></div>
              <h3>{screen.agent}</h3>
              <p>{screen.summary}</p>
              <div className={styles.cardImage}><Image src={`/product/ai-agent-manager/${screen.id}.webp`} alt="" width={1440} height={820} sizes="(max-width: 800px) 90vw, 400px" quality={90}/></div>
              <footer>Explore workspace <span aria-hidden="true">↗</span></footer>
            </a>)}
          </div>
        </Reveal>
        <p className={styles.libraryNote}>Agent Manager interfaces are product previews, not standalone agent availability claims.</p>
        <div className={styles.libraryAction}><Link href="/agents">Discover Agent Library <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>
    {screens.map((screen, index) => <section id={screen.id} key={screen.id} className={index % 2 ? styles.sectionAlt : styles.section}>
      <Reveal className={styles.container}>
        <header className={styles.header}>
          <span>{screen.eyebrow}</span><h2>{screen.title}</h2><p>{screen.copy}</p>
        </header>
        <figure className={styles.snapshotWrap}>
          <div className={styles.snapshotGlow} aria-hidden="true"/>
          <a className={styles.imageLink} href={`/product/ai-agent-manager/${screen.id}.webp`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${screen.eyebrow.toLowerCase()} screenshot (new tab)`}>
            <Image className={styles.screenshot} src={`/product/ai-agent-manager/${screen.id}.webp`} alt={screen.alt} width={1440} height={820} sizes="(max-width: 700px) calc(100vw - 32px), (max-width: 1400px) calc(100vw - 80px), 1320px" quality={90}/>
          </a>
          <figcaption><div><span className={styles.previewLabel}>Product preview</span><p>{screen.detail} Fictional sample data.</p></div><a href={`/product/ai-agent-manager/${screen.id}.webp`} target="_blank" rel="noopener noreferrer">View full size <span aria-hidden="true">↗</span></a></figcaption>
        </figure>
      </Reveal>
    </section>)}
  </>;
}
