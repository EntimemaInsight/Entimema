"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./snapshot-showcase.module.css";

const screens = [
  {
    eyebrow: "Agent workflow",
    title: "A product surface that looks and behaves like finance software.",
    copy: "The workflow, evidence, control state and financial output stay visible in one governed workspace.",
    src: "/product/ai-agent-manager/workflow-snapshot.svg",
    alt: "Entimema Financial Intelligence workflow product preview",
  },
  {
    eyebrow: "Agent controls",
    title: "Configure financial boundaries inside the product — not inside a hidden prompt.",
    copy: "Review logic, evidence requirements and deterministic arithmetic are represented as explicit product configuration.",
    src: "/product/ai-agent-manager/config-snapshot.svg",
    alt: "Entimema Agent Manager control configuration product preview",
  },
  {
    eyebrow: "Agent monitoring",
    title: "Monitor execution state, controls and exceptions from one screen.",
    copy: "Runs remain inspectable from source registration through deterministic checks and material human review.",
    src: "/product/ai-agent-manager/monitoring-snapshot.svg",
    alt: "Entimema Agent Manager monitoring product preview",
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
          <Reveal className={styles.libraryCard}><img src="/product/ai-agent-manager/agent-library-financial.svg" alt="Financial Statement Analysis Agent preview"/></Reveal>
          <Reveal className={styles.libraryCard}><img src="/product/ai-agent-manager/agent-library-review.svg" alt="Exception Review Agent preview"/></Reveal>
        </div>
        <div className={styles.libraryAction}><Link href="/agents">Discover Agent Library <span>→</span></Link></div>
      </div>
    </section>

    {screens.map((screen, index) => <section key={screen.src} className={index % 2 ? styles.sectionAlt : styles.section}>
      <div className="site-container">
        <header className={styles.header}>
          <span>{screen.eyebrow}</span>
          <h2>{screen.title}</h2>
          <p>{screen.copy}</p>
        </header>
        <Reveal className={styles.snapshotWrap}>
          <div className={styles.snapshotGlow}/>
          <img className={styles.snapshot} src={screen.src} alt={screen.alt}/>
        </Reveal>
      </div>
    </section>)}
  </>;
}
