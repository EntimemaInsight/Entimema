"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DynamicArchitectureCanvas.module.css";

type Card = {
  title: string;
  meta: string;
  eyebrow: string;
  statuses: readonly string[];
  group: "finance" | "operations" | "risk";
};

const cards: readonly Card[] = [
  { title: "Financial Data", meta: "P&L · Cash Flow · Budget", eyebrow: "SOURCE 01", statuses: ["Syncing", "Validated", "Modeled", "Live"], group: "finance" },
  { title: "Operating Signals", meta: "Process · Capacity · KPI", eyebrow: "SOURCE 02", statuses: ["Reading", "Mapped", "Connected", "Live"], group: "operations" },
  { title: "Business Context", meta: "Goals · Constraints · Priorities", eyebrow: "CONTEXT", statuses: ["Parsing", "Structured", "Aligned", "Ready"], group: "operations" },
  { title: "Risk Factors", meta: "Exposure · Scenarios · Controls", eyebrow: "RISK CORE", statuses: ["Scanning", "Flagged", "Stress-tested", "Controlled"], group: "risk" },
  { title: "Market Environment", meta: "Trends · Competition · Demand", eyebrow: "EXTERNAL", statuses: ["Tracking", "Compared", "Weighted", "Current"], group: "finance" },
  { title: "Decision Criteria", meta: "Impact · Resilience · Velocity", eyebrow: "GOVERNANCE", statuses: ["Defining", "Scored", "Prioritized", "Approved"], group: "risk" },
] as const;

const phaseLabels = [
  "Connecting knowledge",
  "Validating signals",
  "Mapping dependencies",
  "Building decision architecture",
  "Executive decision ready",
] as const;

const paths = [
  "M216 132 C380 145 455 224 570 282",
  "M204 310 C365 310 458 310 570 310",
  "M242 500 C392 468 470 405 580 350",
  "M1184 132 C1020 145 945 224 830 282",
  "M1196 310 C1035 310 942 310 830 310",
  "M1158 500 C1008 468 930 405 820 350",
  "M700 402 C700 460 700 512 700 566",
] as const;

const layers = [
  ["01", "Trusted context", "Normalized inputs and shared definitions"],
  ["02", "Decision models", "Dependencies, scenarios and trade-offs"],
  ["03", "Governance logic", "Controls, ownership and measurable criteria"],
] as const;

export default function DynamicArchitectureCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerFrame = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [hoveredGroup, setHoveredGroup] = useState<Card["group"] | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "80px 0px -80px",
      threshold: 0.12,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = svgRef.current;
    if (reduceMotion) {
      svg?.pauseAnimations();
      const reducedFrame = window.requestAnimationFrame(() => setPhase(4));
      return () => window.cancelAnimationFrame(reducedFrame);
    }
    if (!active) {
      svg?.pauseAnimations();
      return;
    }
    svg?.unpauseAnimations();
    const resetFrame = window.requestAnimationFrame(() => setPhase(0));
    const timer = window.setInterval(() => setPhase((current) => (current + 1) % 5), 2400);
    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.clearInterval(timer);
    };
  }, [active]);

  useEffect(() => () => {
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

  const updateParallax = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !ref.current || pointerFrame.current) return;
    const { clientX, clientY } = event;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--pointer-x", String((clientX - rect.left) / rect.width - 0.5));
      node.style.setProperty("--pointer-y", String((clientY - rect.top) / rect.height - 0.5));
      pointerFrame.current = null;
    });
  };

  const resetParallax = () => {
    ref.current?.style.setProperty("--pointer-x", "0");
    ref.current?.style.setProperty("--pointer-y", "0");
    setHoveredGroup(null);
  };

  return (
    <div
      className={`${styles.canvas} ${active ? styles.active : ""} ${styles[`phase${phase}`]} ${hoveredGroup ? styles[`hover${hoveredGroup}`] : ""}`}
      ref={ref}
      onPointerMove={updateParallax}
      onPointerLeave={resetParallax}
      aria-label="Dynamic management architecture"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowPrimary}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowSecondary}`} aria-hidden="true" />
      <div className={styles.shimmers} aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </div>

      <div className={styles.status} aria-live="polite">
        <i /><span>{phaseLabels[phase]}</span><b>{String(phase + 1).padStart(2, "0")} / 05</b>
      </div>

      <svg ref={svgRef} className={styles.connections} viewBox="0 0 1400 610" preserveAspectRatio="none" aria-hidden="true">
        {paths.map((path, index) => (
          <path className={`${styles.line} ${styles[`line${index + 1}`]}`} d={path} pathLength="1" key={path} />
        ))}
        {paths.slice(0, 6).map((path, index) => (
          <circle className={`${styles.packet} ${styles[`packet${index + 1}`]}`} r="3.6" key={path}>
            <animateMotion path={path} dur={`${3.35 + index * 0.31}s`} begin={`${index * -0.67}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {cards.map((card, index) => (
        <article
          className={`${styles.knowledgeCard} ${styles[`card${index + 1}`]} ${styles[`group${card.group}`]}`}
          onPointerEnter={() => setHoveredGroup(card.group)}
          onPointerLeave={() => setHoveredGroup(null)}
          key={card.title}
        >
          <div className={styles.cardTopline}><span>{card.eyebrow}</span><i /></div>
          <strong>{card.title}</strong>
          <p>{card.meta}</p>
          <div className={styles.cardStatus}><i /><span>{card.statuses[(phase + index) % card.statuses.length]}</span></div>
          <span className={styles.nodePulse} aria-hidden="true" />
        </article>
      ))}

      <section className={styles.architecture} aria-label="Management architecture">
        <header className={styles.architectureHeader}>
          <span className={styles.architectureIcon} aria-hidden="true"><i /><i /><i /></span>
          <span><small>ENTIMEMA INTELLIGENCE</small><strong>Decision Architecture</strong></span>
          <b>LIVE</b>
        </header>
        <div className={styles.layers}>
          {layers.map(([number, title, description], index) => (
            <div className={styles.layer} style={{ "--layer": index } as React.CSSProperties} key={title}>
              <span>{number}</span><div><strong>{title}</strong><small>{description}</small></div><i />
            </div>
          ))}
        </div>
        <div className={styles.architectureProgress}><i /><i /><i /><i /></div>
      </section>

      <div className={styles.decision}>
        <span className={styles.decisionIcon} aria-hidden="true">✓</span>
        <span><small>OUTPUT / VERIFIED</small><strong>Executive Decision</strong><span>Clear, measurable and ready for action.</span></span>
        <i className={styles.decisionSignal} aria-hidden="true" />
      </div>
    </div>
  );
}
