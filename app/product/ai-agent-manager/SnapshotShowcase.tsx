"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./snapshot-showcase.module.css";

const screens = [
  {
    eyebrow: "Agent workflow",
    title: "A product surface that looks and behaves like finance software.",
    copy: "The workflow, evidence, control state and financial output stay visible in one governed workspace.",
    variant: "workflow",
    label: "Entimema Financial Intelligence workflow product snapshot",
  },
  {
    eyebrow: "Agent controls",
    title: "Configure financial boundaries inside the product — not inside a hidden prompt.",
    copy: "Review logic, evidence requirements and deterministic arithmetic are represented as explicit product configuration.",
    variant: "config",
    label: "Entimema Agent Manager control configuration product snapshot",
  },
  {
    eyebrow: "Agent monitoring",
    title: "Monitor execution state, controls and exceptions from one screen.",
    copy: "Runs remain inspectable from source registration through deterministic checks and material human review.",
    variant: "monitoring",
    label: "Entimema Agent Manager monitoring product snapshot",
  },
] as const;

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.dataset.visible = "true";
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`${styles.reveal} ${className}`}>{children}</div>;
}

function Snapshot({ variant, label }: { variant: "libraryFinancial" | "libraryReview" | "workflow" | "config" | "monitoring"; label: string }) {
  return <div className={`${styles.snapshotRaster} ${styles[variant]}`} role="img" aria-label={label}/>;
}

export default function SnapshotShowcase() {
  return <>
    <section className={styles.library} id="agents">
      <div className="site-container">
        <header className={styles.header}>
          <span>Agent Library</span>
          <h2>Specialist financial agents.<br/><em>One controlled execution system.</em></h2>
          <p>Explore how Entimema packages financial understanding, deterministic control and accountable review into specialist workflow components.</p>
        </header>
        <div className={styles.libraryGrid}>
          <Reveal className={styles.libraryCard}><Snapshot variant="libraryFinancial" label="Financial Statement Analysis Agent product snapshot"/></Reveal>
          <Reveal className={styles.libraryCard}><Snapshot variant="libraryReview" label="Exception Review Agent product snapshot"/></Reveal>
        </div>
        <div className={styles.libraryAction}><Link href="/agents">Discover Agent Library <span>→</span></Link></div>
      </div>
    </section>

    {screens.map((screen, index) => <section key={screen.variant} className={index % 2 ? styles.sectionAlt : styles.section}>
      <div className="site-container">
        <header className={styles.header}>
          <span>{screen.eyebrow}</span>
          <h2>{screen.title}</h2>
          <p>{screen.copy}</p>
        </header>
        <Reveal className={styles.snapshotWrap}>
          <div className={styles.snapshotGlow}/>
          <Snapshot variant={screen.variant} label={screen.label}/>
        </Reveal>
      </div>
    </section>)}
  </>;
}
