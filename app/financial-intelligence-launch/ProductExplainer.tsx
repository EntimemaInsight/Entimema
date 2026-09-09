"use client";

import { useEffect, useState } from "react";
import styles from "./launch.module.css";

const stages = [
  { number: "01", label: "Intelligence", title: "Interpret the evidence", copy: "Financial meaning, period, unit and context are resolved across the submitted sources.", owner: "MODEL", state: "SOURCE UNDERSTOOD" },
  { number: "02", label: "Control", title: "Verify what must be exact", copy: "Totals, accounting identities and cross-document relationships are tested with deterministic logic.", owner: "RULES", state: "CONTROLS PASSED" },
  { number: "03", label: "Judgement", title: "Escalate uncertainty", copy: "Contradictions and low-confidence mappings become explicit review tasks. Nothing material is silently guessed.", owner: "HUMAN", state: "EXCEPTION RESOLVED" },
  { number: "04", label: "Decision", title: "Deliver with lineage", copy: "The validated model and findings are assembled into a result that retains its evidence path.", owner: "SYSTEM", state: "READY FOR DECISION" },
] as const;

export default function ProductExplainer() {
  const [active, setActive] = useState(0);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const timer = window.setInterval(() => setActive((value) => (value + 1) % stages.length), 3200); return () => window.clearInterval(timer); }, []);
  const stage = stages[active];
  return <section id="workflow" className={styles.workflow} aria-labelledby="workflow-title">
    <div className={styles.workflowIntro}><p className={styles.eyebrow}><span /> One governed workflow</p><h2 id="workflow-title">From source to decision,<br/>without losing control.</h2><p>Each responsibility is explicit. Select a stage to inspect the execution logic.</p></div>
    <div className={styles.workflowSurface}>
      <ol>{stages.map((item, index) => <li key={item.number}><button aria-current={active === index ? "step" : undefined} onClick={() => setActive(index)} type="button"><span>{item.number}</span><b>{item.label}</b><i aria-hidden="true">→</i></button></li>)}</ol>
      <div className={styles.stagePanel} aria-live="polite"><header><span>{stage.owner} RESPONSIBILITY</span><b>{stage.number} / 04</b></header><div><small>{stage.state}</small><h3>{stage.title}</h3><p>{stage.copy}</p><footer><span>SOURCE</span><i /><strong>{stage.owner}</strong><i /><b>DECISION</b></footer></div></div>
    </div>
  </section>;
}
