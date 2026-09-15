"use client";

import { useState } from "react";
import styles from "./feature.module.css";

const stages = [
  { number: "01", label: "Evidence", title: "Source registered", detail: "FY2025_Income_Statement.xlsx", metric: "184 values", state: "REGISTERED" },
  { number: "02", label: "Meaning", title: "Revenue interpreted", detail: "Revenue · FY 2025 · EUR", metric: "98.4% confidence", state: "MAPPED" },
  { number: "03", label: "Control", title: "Identity recalculated", detail: "Revenue − COGS = Gross profit", metric: "Difference €0", state: "PASSED" },
  { number: "04", label: "Review", title: "Exception resolved", detail: "Other operating income definition", metric: "Evidence attached", state: "REVIEWED" },
  { number: "05", label: "Decision", title: "Model validated", detail: "Financial model + findings + lineage", metric: "Ready for use", state: "READY" },
] as const;

export default function ProductExplainer() {
  const [active, setActive] = useState(0);
  const stage = stages[active];

  return <section className={styles.execution} aria-labelledby="execution-title">
    <div className={styles.sectionLabel}>PRODUCT IN PRACTICE</div>
    <div className={styles.executionHead}>
      <h2 id="execution-title">One value.<br/><span>A complete audit trail.</span></h2>
      <p>Select a stage to see how evidence, interpretation, control and review remain connected throughout the execution.</p>
    </div>
    <div className={styles.executionSurface}>
      <div className={styles.executionTabs} role="tablist" aria-label="Execution stages">
        {stages.map((item, index) => <button key={item.number} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)}><span>{item.number}</span><b>{item.label}</b><i /></button>)}
      </div>
      <div className={styles.executionDemo} role="tabpanel">
        <header><span>ILLUSTRATIVE RUN · FI–0024</span><b><i /> CONTROLLED EXECUTION</b></header>
        <div className={styles.valueJourney}>
          <div className={styles.valueSource}><small>{stage.label.toUpperCase()}</small><h3>{stage.title}</h3><p>{stage.detail}</p></div>
          <div className={styles.valuePath}><i /><span>{stage.number}</span><i /></div>
          <div className={styles.valueState}><small>CURRENT STATE</small><strong>{stage.state}</strong><p>{stage.metric}</p></div>
        </div>
        <footer><span>Source lineage retained</span><span>Deterministic controls visible</span><span>Human judgement recorded</span></footer>
      </div>
    </div>
  </section>;
}
