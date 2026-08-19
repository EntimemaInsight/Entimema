"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import ConversationPanel from "./ConversationPanel";
import DecisionMapView from "./DecisionMapView";
import ProblemStatePanel from "./ProblemStatePanel";
import { labScenarios } from "./fixtures";
import styles from "./concierge-lab.module.css";

export default function ConciergeLabShell() {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const scenario = useMemo(() => labScenarios.find((item) => item.id === scenarioId), [scenarioId]);
  const snapshot = scenario?.snapshots[Math.min(step, scenario.snapshots.length - 1)];

  function begin(id: string) { setScenarioId(id); setStep(0); setSelectedNode(null); }
  function reset() { setScenarioId(null); setStep(0); setSelectedNode(null); }

  if (!scenario || !snapshot) {
    return (
      <main className={styles.lab}>
        <LabHeader />
        <section className={styles.intake} aria-labelledby="intake-title">
          <span className={styles.eyebrow}>Concierge Lab · deterministic preview</span>
          <h1 id="intake-title">Bring the problem.</h1>
          <p>Turn an ambiguous financial or risk question into a traceable decision state.</p>
          <form className={styles.intakeForm} onSubmit={(event) => { event.preventDefault(); begin("working-capital"); }}>
            <label className={styles.srOnly} htmlFor="problem-input">Ask Entimema</label>
            <input id="problem-input" defaultValue="" placeholder="Ask Entimema" />
            <button type="submit">Begin</button>
          </form>
          <div className={styles.scenarioPicker} aria-label="Deterministic scenarios">
            {labScenarios.map((item) => <button key={item.id} onClick={() => begin(item.id)}>{item.label}</button>)}
          </div>
          <p className={styles.previewNote}>LAB / deterministic scenario · No live AI execution</p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.lab}>
      <LabHeader />
      <div className={styles.toolbar} aria-label="Lab controls">
        <span>LAB / deterministic scenario</span>
        <label>Scenario<select value={scenario.id} onChange={(event) => begin(event.target.value)}>{labScenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <button onClick={reset}>Reset</button>
        <button onClick={() => { setStep((value) => (value + 1) % scenario.snapshots.length); setSelectedNode(null); }}>Next State</button>
        <output>{snapshot.stage} · {step + 1}/{scenario.snapshots.length}</output>
      </div>
      <div className={styles.workspace}>
        <ConversationPanel prompt={scenario.prompt} turns={snapshot.conversation} />
        <div className={styles.stateWorkspace}>
          <ProblemStatePanel projection={snapshot.projection} synthesis={snapshot.synthesis} />
          <DecisionMapView map={snapshot.projection.decision_map} selectedId={selectedNode} onSelect={setSelectedNode} />
        </div>
      </div>
    </main>
  );
}

function LabHeader() {
  return <header className={styles.header}><Link href="/" aria-label="Entimema home"><BrandLogo /></Link><div><span>Concierge Lab</span><strong>Decision Intelligence Workspace</strong></div><span className={styles.privateLabel}>Private preview</span></header>;
}
