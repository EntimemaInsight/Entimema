"use client";

import { useEffect, useState } from "react";
import styles from "./launch.module.css";

const stages = [
  { number: "01", label: "Interpret", title: "Understand the evidence", copy: "Financial meaning, reporting period, unit and context are identified across the submitted sources.", owner: "MODEL", state: "SOURCE REGISTERED" },
  { number: "02", label: "Control", title: "Test what must be exact", copy: "Totals, identities, periods and cross-document relationships are checked with deterministic logic.", owner: "RULES", state: "CONTROLS PASSED" },
  { number: "03", label: "Review", title: "Escalate material uncertainty", copy: "Low-confidence mappings and contradictions become visible review tasks. The workflow does not guess.", owner: "HUMAN", state: "EXCEPTION RESOLVED" },
  { number: "04", label: "Decide", title: "Deliver a traceable result", copy: "The validated model, findings and evidence lineage are assembled into a controlled financial output.", owner: "SYSTEM", state: "READY FOR DECISION" },
] as const;

export default function ProductExplainer() {
  const [active, setActive] = useState(0);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setInterval(() => setActive((current) => (current + 1) % stages.length), 2800); return () => window.clearInterval(timer); }, []);
  const stage = stages[active];
  return <section id="method" className={styles.method} aria-labelledby="method-title"><div className={styles.sectionHead}><p className={styles.marker}>THE METHOD</p><h2 id="method-title">Four responsibilities. One evidence chain.</h2><p>Select a stage to inspect how the result moves from interpretation to control.</p></div><div className={styles.methodGrid}><ol>{stages.map((item, index) => <li key={item.number}><button aria-current={active === index ? "step" : undefined} onClick={() => setActive(index)} type="button"><span>{item.number}</span><b>{item.label}</b><i aria-hidden="true">→</i></button></li>)}</ol><div className={styles.stagePanel} aria-live="polite"><header><span>{stage.owner} RESPONSIBILITY</span><b>{stage.number} / 04</b></header><div className={styles.stageBody}><small>{stage.label.toUpperCase()}</small><h3>{stage.title}</h3><p>{stage.copy}</p><div className={styles.trace}><span>SRC—01</span><i/><span>VAL—{stage.number}</span><i/><strong>{stage.state}</strong></div></div></div></div></section>;
}
