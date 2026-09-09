"use client";

import { useState } from "react";
import styles from "./agent-manager.module.css";

const agents = [
  {
    eyebrow: "01 · FINANCIAL INTELLIGENCE",
    title: "Financial Statement Analysis Agent",
    copy: "Turn a tested English Income Statement into structured financial data, deterministic KPIs and a traceable result.",
    state: "CONTROLLED PILOT",
    visual: "analysis",
  },
  {
    eyebrow: "02 · CONTROL LAYER",
    title: "Financial Validation Agent",
    copy: "Apply explicit financial relationships and surface mismatches instead of accepting plausible output as truth.",
    state: "DETERMINISTIC",
    visual: "control",
  },
  {
    eyebrow: "03 · HUMAN AUTHORITY",
    title: "Exception Review Agent",
    copy: "Package material ambiguity with its evidence so a finance professional can resolve the judgement explicitly.",
    state: "HUMAN REVIEW",
    visual: "review",
  },
] as const;

type Agent = (typeof agents)[number];

function Preview({ agent }: { agent: Agent }) {
  if (agent.visual === "analysis") {
    return <div className={styles.libraryPreviewBody}>
      <div className={styles.previewDocument}><header><b>Income Statement</b><span>SRC–01</span></header><div><span>Revenue</span><strong>€18,420,000</strong></div><div><span>Cost of sales</span><strong>€12,910,000</strong></div><div><span>Gross profit</span><strong>€5,510,000</strong></div></div>
      <div className={styles.previewFlow}><b>Interpret</b><i>→</i><b>Structure</b><i>→</i><b>Verify</b><i>→</i><b>Deliver</b></div>
      <div className={styles.previewResult}><small>RESULT</small><strong>Validated financial model</strong><span>Source lineage attached</span></div>
    </div>;
  }
  if (agent.visual === "control") {
    return <div className={styles.libraryPreviewBody}>
      <div className={styles.previewEquation}><small>CONTROL 07</small><div><span>Revenue</span><strong>€18.42m</strong></div><em>−</em><div><span>Cost of sales</span><strong>€12.91m</strong></div><em>=</em><div><span>Gross profit</span><strong>€5.51m</strong></div></div>
      <div className={styles.previewResult}><small>CONTROL STATE</small><strong>Reconciled</strong><span className={styles.previewPass}>✓ €0 difference</span></div>
    </div>;
  }
  return <div className={styles.libraryPreviewBody}>
    <div className={styles.previewException}><small>EXCEPTION 01</small><strong>Definition requires review</strong><p>“Other operating income” differs between two source representations.</p><div><span>Evidence attached</span><span>Source comparison ready</span></div></div>
    <div className={styles.previewResult}><small>DECISION OWNER</small><strong>Finance reviewer</strong><span className={styles.previewWarn}>Human judgement required</span></div>
  </div>;
}

export default function InteractiveAgentCards() {
  const [active, setActive] = useState(0);
  const current = agents[active];
  return <>
    <div className={styles.agentCards} role="tablist" aria-label="Entimema specialist agents">
      {agents.map((agent, index) => <button key={agent.title} type="button" role="tab" aria-selected={active === index} className={active === index ? styles.agentCardActive : styles.agentCardButton} onClick={() => setActive(index)}>
        <div><span>{agent.eyebrow}</span><h3>{agent.title}</h3><p>{agent.copy}</p></div>
        <footer><span>{agent.state}</span><b>{active === index ? "Viewing" : "View agent"} →</b></footer>
      </button>)}
    </div>
    <div className={styles.libraryPreview} role="tabpanel" aria-live="polite" key={current.title}>
      <header><span>ENTIMEMA / AGENT PREVIEW</span><strong>{current.title}</strong><i>{current.state}</i></header>
      <Preview agent={current}/>
    </div>
  </>;
}
