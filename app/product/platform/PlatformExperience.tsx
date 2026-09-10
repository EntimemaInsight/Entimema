"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DemoTrigger } from "@/components/DemoDiscovery";
import styles from "./platform.module.css";

const layers = [
  { number: "01", short: "Evidence", label: "Evidence Infrastructure", title: "Every conclusion begins with evidence.", copy: "Financial documents enter one controlled record. Every extracted value remains attached to its original file, sheet and cell." },
  { number: "02", short: "Context", label: "Financial Context Layer", title: "Different documents. One financial language.", copy: "Periods, definitions and reported values are aligned into a canonical financial structure without losing their source meaning." },
  { number: "03", short: "Control", label: "Control & Validation Engine", title: "AI interprets. Controls determine what can be trusted.", copy: "Deterministic calculations test financial relationships. A plausible answer cannot silently pass as a verified result." },
  { number: "04", short: "Workspace", label: "Decision Workspace", title: "Uncertainty is surfaced—not hidden.", copy: "Evidence, exceptions and calculated findings remain visible together, so finance professionals retain review authority." },
  { number: "05", short: "Workflows", label: "Financial Intelligence Workflows", title: "One controlled architecture. Multiple financial workflows.", copy: "Start with Financial Statements Intelligence V1. Extend the same governed foundation into recurring financial workflows." },
] as const;

function ProductEvidence({ active }: { active: number }) {
  if (active === 0) return <div className={`${styles.productEvidence} ${styles.evidenceOne}`}><header><span>V1 ACCEPTANCE RUN</span><b>VERIFIED SOURCE</b></header><div className={styles.fileRow}><i>XLSX</i><div><strong>minimal-income-statement.xlsx</strong><span>Sheet P&amp;L · 9 financial lines</span></div></div><div className={styles.sourceRow}><span>Revenue · 2025</span><strong>1,200</strong><small>‘P&amp;L’!B5</small></div><footer><span>18 / 18 values bound to source</span><b>PASS</b></footer></div>;
  if (active === 1) return <div className={`${styles.productEvidence} ${styles.evidenceTwo}`}><header><span>CANONICAL MODEL</span><b>MAPPED</b></header><div className={styles.mappingHead}><span>Source label</span><span>Canonical concept</span></div><div className={styles.mappingRow}><strong>Revenue</strong><i>→</i><strong>revenue</strong></div><div className={styles.mappingRow}><strong>Cost of Sales</strong><i>→</i><strong>cost_of_sales</strong></div><div className={styles.mappingMeta}><span>EUR · thousands</span><span>2025 / 2024</span></div></div>;
  if (active === 2) return <div className={`${styles.productEvidence} ${styles.evidenceThree}`}><header><span>DETERMINISTIC CONTROL</span><b>RECONCILED</b></header><div className={styles.equation}><div><span>Revenue</span><strong>1,200</strong></div><i>−</i><div><span>Cost of sales</span><strong>720</strong></div><i>=</i><div><span>Gross profit</span><strong>480</strong></div></div><footer><span>Calculated difference</span><b>0.00 · PASS</b></footer></div>;
  if (active === 3) return <div className={`${styles.productEvidence} ${styles.evidenceFour}`}><header><span>FINANCIAL INTELLIGENCE / 2025</span><b>READY</b></header><div className={styles.kpiGrid}><div><span>Revenue growth</span><strong>20.0%</strong><small>Verified values</small></div><div><span>Gross margin</span><strong>40.0%</strong><small>Deterministic KPI</small></div><div><span>Operating margin</span><strong>19.17%</strong><small>Evidence linked</small></div></div><footer><span>Source statement · findings · lineage</span><b>REVIEWABLE</b></footer></div>;
  return <div className={`${styles.productEvidence} ${styles.evidenceFive}`}><header><span>WORKFLOW PORTFOLIO</span><b>CONTROLLED FOUNDATION</b></header><div className={styles.workflowRow}><span>Financial Statements Intelligence</span><b>AVAILABLE NOW</b></div><div className={styles.workflowRow}><span>Receivables Intelligence</span><b>NEXT</b></div><div className={styles.workflowRow}><span>Credit Risk Intelligence</span><b>PLANNED</b></div><footer><span>One evidence and control standard</span><b>EXPANDABLE</b></footer></div>;
}

function ArchitectureStack({ active }: { active: number }) {
  return <div className={styles.stackStage} aria-label={`Active architecture layer: ${layers[active].label}`}><div className={styles.stackAura} /><div className={styles.stack}>{layers.map((layer, index) => <div className={`${styles.stackLayer} ${index === active ? styles.activeLayer : ""} ${index < active ? styles.passedLayer : ""}`} style={{ "--layer": index } as CSSProperties} key={layer.label}><span>{layer.number}</span><strong>{layer.label}</strong></div>)}</div><div className={styles.layerIndex}><span>{layers[active].number}</span><strong>{layers[active].short}</strong></div><ProductEvidence active={active} /></div>;
}

export default function PlatformExperience() {
  const [active, setActive] = useState(0);
  const steps = useRef<Array<HTMLElement | null>>([]);
  useEffect(() => {
    const observers = steps.current.map((step, index) => {
      if (!step) return null;
      const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setActive(index); }, { rootMargin: "-38% 0px -38% 0px", threshold: 0 });
      observer.observe(step);
      return observer;
    });
    return () => observers.forEach((observer) => observer?.disconnect());
  }, []);

  return <div className={styles.page}>
    <section className={styles.hero}><div className={`site-container ${styles.heroInner}`}><p className={styles.eyebrow}>ENTIMEMA FINANCIAL INTELLIGENCE</p><h1>One architecture for financial decisions <em>you can defend.</em></h1><div className={styles.heroBottom}><p>Connect financial evidence, AI interpretation, deterministic controls and human authority in one traceable system.</p><div className={styles.actions}><DemoTrigger className={styles.primaryCta} initialInterest="Platform overview" /><Link href="/financial-intelligence-launch">Explore Financial Intelligence V1 <span>→</span></Link></div></div></div><div className={styles.heroRule}><span>Evidence in</span><i /><span>Decision-ready output</span></div></section>
    <section className={styles.architecture} aria-labelledby="architecture-heading"><div className={styles.architectureIntro}><p>THE CONTROLLED FINANCIAL ARCHITECTURE</p><h2 id="architecture-heading">Five connected layers.<br/><em>One standard of financial truth.</em></h2><span>Scroll to examine the system</span></div><div className={`site-container ${styles.architectureGrid}`}><div className={styles.stickyColumn}><ArchitectureStack active={active} /></div><div className={styles.copyColumn}>{layers.map((layer, index) => <article className={`${styles.storyStep} ${index === active ? styles.activeStep : ""}`} ref={(node) => { steps.current[index] = node; }} key={layer.label}><div className={styles.stepTop}><span>{layer.number}</span><i /><b>{layer.label}</b></div><h3>{layer.title}</h3><p>{layer.copy}</p><small>{index === 0 ? "REAL V1 ACCEPTANCE EVIDENCE" : index === 4 ? "CURRENT PRODUCT ROADMAP" : "LIVE PRODUCT LOGIC"}</small></article>)}</div></div></section>
    <section className={styles.systemProof}><div className={`site-container ${styles.proofGrid}`}><div><p className={styles.eyebrow}>WHY THE ARCHITECTURE MATTERS</p><h2>Intelligence becomes valuable when control <em>survives every layer.</em></h2></div><div className={styles.proofList}><article><span>01</span><div><strong>No unsupported values</strong><p>Every material output preserves a reference to the evidence that produced it.</p></div></article><article><span>02</span><div><strong>No hidden arithmetic</strong><p>Code owns calculations, reconciliations and fixed financial rules.</p></div></article><article><span>03</span><div><strong>No silent uncertainty</strong><p>Ambiguity becomes an exception with evidence and a named review state.</p></div></article></div></div></section>
    <section className={styles.finalCta}><div className="site-container"><p>FINANCIAL INTELLIGENCE V1 · AVAILABLE NOW</p><h2>From financial evidence to a result<br/><em>your organisation can defend.</em></h2><span>Start with one controlled Income Statement workflow. Prove the value. Expand from evidence.</span><div className={styles.finalActions}><DemoTrigger className={styles.lightCta} initialInterest="Financial Intelligence V1" /><Link href="/financial-intelligence-launch">See the V1 workflow <b>→</b></Link></div></div></section>
  </div>;
}
