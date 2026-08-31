"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./launch.module.css";

const steps = [
  ["Start with the documents the business already uses.", "Financial statements, spreadsheets, management reports and system exports enter one governed intake."],
  ["Interpret what every value represents.", "AI identifies financial meaning, reporting period, units, definitions and context across inconsistent sources."],
  ["Test what must be exact.", "Deterministic rules recalculate totals, reconcile statements, test accounting identities and detect inconsistencies."],
  ["Ask a human where judgement matters.", "Material ambiguity becomes a review task with the evidence attached. The workflow does not silently guess."],
  ["Move forward with analysis you can examine and defend.", "The result combines a validated financial model, visible controls, resolved exceptions, findings and traceable evidence."],
] as const;

function EvidenceVisual({ stage }: { stage: number }) {
  return <figure className={styles.explainerFigure} data-stage={stage} aria-label={`Stage ${stage}: ${steps[stage - 1][0]}`}>
    <div className={styles.figureHeader}><span>VALUE PATH / 01—05</span><b>{String(stage).padStart(2, "0")}</b></div>
    <div className={styles.figureBody}>
      <div className={styles.sourceDocs}><span>PDF<small>SRC–01 · Revenue</small></span><span>XLSX<small>SRC–02 · FY 2025</small></span><span>CSV<small>SRC–03 · EUR</small></span></div>
      <div className={styles.evidencePath} aria-hidden="true" />
      <div className={styles.valueRecord}><small>{stage === 1 ? "EVIDENCE REGISTERED" : "SOURCE CONNECTION RETAINED"}</small><strong>REVENUE</strong><dl><div><dt>Period</dt><dd>FY 2025</dd></div><div><dt>Unit</dt><dd>EUR</dd></div><div><dt>Evidence</dt><dd>SRC–01:14</dd></div></dl></div>
      {stage >= 3 && <div className={styles.controlRecord}><small>RULES CHECK THE NUMBERS</small><span>Control total</span><b>PASSED</b><span>Period consistency</span><b>PASSED</b></div>}
      {stage === 4 && <div className={styles.reviewRecord}><small>HUMAN REVIEW</small><strong>Definition needs judgement</strong><span>Evidence SRC–01:14 attached</span><b>RESOLVED</b></div>}
      {stage === 5 && <div className={styles.finalRecord}><small>VALIDATED ANALYSIS</small><strong>Ready for decision</strong><span>✓ Evidence lineage</span><span>✓ Controls passed</span><span>✓ Exception resolved</span></div>}
    </div>
    <figcaption>{stage === 1 && "Documents enter a governed evidence boundary with source identifiers."}{stage === 2 && "The system understands what the value means while keeping its source attached."}{stage === 3 && "Rules check that totals reconcile and periods remain consistent."}{stage === 4 && "A person resolves material uncertainty using the attached evidence."}{stage === 5 && "A controlled result retains its model, findings, controls and evidence lineage."}</figcaption>
  </figure>;
}

export default function ProductExplainer() {
  const [active, setActive] = useState(1);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.step));
    }, { rootMargin: "-30% 0px -45%", threshold: [0, .4, .8] });
    document.querySelectorAll(`.${styles.explainerStep}`).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return <section id="how-it-works" className={styles.explainer} aria-labelledby="explainer-title">
    <header><p className={styles.marker}>HOW FINANCIAL INTELLIGENCE WORKS</p><h2 id="explainer-title">One controlled path from evidence to decision.</h2><p>Follow a financial value from the source document to the final analysis.</p></header>
    <table className={styles.formula}><caption className="sr-only">Financial Intelligence explanatory formula</caption><thead><tr><th>Input</th><th>Interpretation</th><th>Control</th><th>Result</th></tr></thead><tbody><tr><td>Financial documents</td><td>AI understands meaning</td><td>Rules verify; humans resolve</td><td>Validated analysis</td></tr></tbody></table>
    <div className={styles.scrolly}>
      <div className={styles.stepColumn}>{steps.map(([heading, copy], index) => <section className={styles.explainerStep} data-step={index + 1} key={heading} aria-current={active === index + 1 ? "step" : undefined}><span>0{index + 1}</span><h3>{heading}</h3><p>{copy}</p><div className={styles.mobileVisual}><EvidenceVisual stage={index + 1} /></div></section>)}</div>
      <div className={styles.stickyVisual}><EvidenceVisual stage={active} /></div>
    </div>
    <nav className={styles.explainerActions} aria-label="Explainer next steps"><Link href="/contact?topic=financial-data">Request a private walkthrough</Link><Link href="#old-condition">Explore the architecture</Link></nav>
  </section>;
}
