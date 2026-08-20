"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import ConversationPanel from "./ConversationPanel";
import DecisionMapView from "./DecisionMapView";
import ProblemStatePanel from "./ProblemStatePanel";
import EvidencePanel from "./EvidencePanel";
import { labScenarios } from "./fixtures";
import styles from "./concierge-lab.module.css";
import type { ConversationTurn, DecisionWorkspaceProjection, LiveMessageResponse, RuntimeError } from "./types";

export default function ConciergeLabShell() {
  const [mode, setMode] = useState<"FIXTURE" | "LIVE">("FIXTURE");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const scenario = useMemo(() => labScenarios.find((item) => item.id === scenarioId), [scenarioId]);
  const snapshot = scenario?.snapshots[Math.min(step, scenario.snapshots.length - 1)];
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [projection, setProjection] = useState<DecisionWorkspaceProjection | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);

  function begin(id: string) { setScenarioId(id); setStep(0); setSelectedNode(null); }
  function reset() { setScenarioId(null); setStep(0); setSelectedNode(null); }

  async function beginLive(initialMessage: string) {
    setBusy(true); setRuntimeError(null);
    try {
      const createdResponse = await fetch("/api/concierge/sessions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "LIVE" }) });
      const created = await createdResponse.json();
      if (!createdResponse.ok) throw created.errors?.[0] ?? { code: "RUNTIME_UNAVAILABLE", message: "Live runtime unavailable.", retryable: true };
      setSessionId(created.session_id); setProjection(created.workspace_projection); setVersion(created.state_version);
      if (initialMessage.trim()) await submitLive(initialMessage, created.session_id, created.state_version);
    } catch (error) { setRuntimeError(error as RuntimeError); } finally { setBusy(false); }
  }

  async function submitLive(text = message, activeSession = sessionId, activeVersion = version) {
    if (!activeSession || !text.trim() || busy) return;
    setBusy(true); setRuntimeError(null);
    try {
      const response = await fetch(`/api/concierge/sessions/${encodeURIComponent(activeSession)}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text.trim(), client_turn_id: crypto.randomUUID(), session_context_version: activeVersion }) });
      const body = await response.json() as LiveMessageResponse & { errors?: RuntimeError[] };
      if (!response.ok) throw body.errors?.[0] ?? { code: "RUNTIME_UNAVAILABLE", message: "Live runtime unavailable.", retryable: true };
      setProjection(body.workspace_projection); setVersion(body.problem_state_version);
      setTurns(body.conversation.map((turn) => ({ role: turn.actor === "USER" ? "User" : "Entimema", text: turn.text })));
      setMessage("");
    } catch (error) { setRuntimeError(error as RuntimeError); } finally { setBusy(false); }
  }

  function resetAll() { reset(); setSessionId(null); setProjection(null); setTurns([]); setVersion(0); setRuntimeError(null); }

  if ((mode === "FIXTURE" && (!scenario || !snapshot)) || (mode === "LIVE" && !projection)) {
    return (
      <main className={styles.lab}>
        <LabHeader />
        <section className={styles.intake} aria-labelledby="intake-title">
          <span className={styles.eyebrow}>Concierge Lab · {mode === "LIVE" ? "live runtime" : "deterministic preview"}</span>
          <h1 id="intake-title">Bring the problem.</h1>
          <p>Turn an ambiguous financial or risk question into a traceable decision state.</p>
          <div className={styles.modeControl}><button className={mode === "FIXTURE" ? styles.modeActive : ""} onClick={() => setMode("FIXTURE")}>FIXTURE</button><button className={mode === "LIVE" ? styles.modeActive : ""} onClick={() => setMode("LIVE")}>LIVE</button></div>
          <form className={styles.intakeForm} onSubmit={(event) => { event.preventDefault(); const input = new FormData(event.currentTarget).get("problem")?.toString() ?? ""; if (mode === "LIVE") void beginLive(input); else begin("working-capital"); }}>
            <label className={styles.srOnly} htmlFor="problem-input">Ask Entimema</label>
            <input id="problem-input" name="problem" defaultValue="" placeholder="Ask Entimema" />
            <button type="submit" disabled={busy}>{busy ? "Connecting…" : "Begin"}</button>
          </form>
          {runtimeError && <div className={styles.runtimeError} role="alert"><strong>{runtimeError.code.replaceAll("_", " ")}</strong><p>{runtimeError.message}</p></div>}
          {mode === "FIXTURE" && <div className={styles.scenarioPicker} aria-label="Deterministic scenarios">
            {labScenarios.map((item) => <button key={item.id} onClick={() => begin(item.id)}>{item.label}</button>)}
          </div>}
          <p className={styles.previewNote}>{mode === "FIXTURE" ? "LAB / deterministic scenario · No live AI execution" : "LAB / live constrained interpreter · Runtime controls state"}</p>
        </section>
      </main>
    );
  }

  if (mode === "LIVE" && projection) {
    return <main className={styles.lab}><LabHeader /><div className={styles.toolbar}><span>LAB / LIVE runtime</span><button onClick={resetAll}>Reset</button><output>State v{version}</output></div>{runtimeError && <div className={styles.runtimeError} role="alert"><strong>{runtimeError.code.replaceAll("_", " ")}</strong><p>{runtimeError.message}</p></div>}<EvidencePanel sessionId={sessionId ?? ""} artifacts={projection.artifacts ?? []} onComplete={(payload) => setProjection((current) => current ? { ...current, ...payload } as DecisionWorkspaceProjection : current)} /><div className={styles.workspace}><ConversationPanel prompt="" turns={turns} live value={message} busy={busy} onValue={setMessage} onSubmit={() => void submitLive()} /><div className={styles.stateWorkspace}><ProblemStatePanel projection={projection} synthesis={null} /><DecisionMapView map={projection.decision_map} selectedId={selectedNode} onSelect={setSelectedNode} /></div></div></main>;
  }

  if (!scenario || !snapshot) return null;

  return (
    <main className={styles.lab}>
      <LabHeader />
      <div className={styles.toolbar} aria-label="Lab controls">
        <span>LAB / deterministic scenario</span>
        <label>Scenario<select value={scenario.id} onChange={(event) => begin(event.target.value)}>{labScenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        <button onClick={resetAll}>Reset</button>
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
