"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import ConversationPanel from "./ConversationPanel";
import DecisionMapView from "./DecisionMapView";
import ProblemStatePanel from "./ProblemStatePanel";
import { labScenarios } from "./fixtures";
import styles from "./concierge-lab.module.css";
import type { CaseResponse, ConversationTurn, DecisionWorkspaceProjection, LiveMessageResponse, RuntimeError } from "./types";

const CASE_KEY = "entimema.concierge.case-id";

export default function ConciergeLabShell() {
  const [mode, setMode] = useState<"FIXTURE" | "LIVE">("LIVE");
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedUnknown, setSelectedUnknown] = useState<string | null>(null);
  const scenario = useMemo(() => labScenarios.find((item) => item.id === scenarioId), [scenarioId]);
  const snapshot = scenario?.snapshots[Math.min(step, scenario.snapshots.length - 1)];
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [projection, setProjection] = useState<DecisionWorkspaceProjection | null>(null);
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [recovering, setRecovering] = useState(true);
  const [runtimeError, setRuntimeError] = useState<RuntimeError | null>(null);

  useEffect(() => {
    const caseId = window.localStorage.getItem(CASE_KEY);
    if (!caseId) { queueMicrotask(() => setRecovering(false)); return; }
    void fetch(`/api/concierge/sessions/${encodeURIComponent(caseId)}`, { cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() as CaseResponse }))
      .then(({ response, body }) => {
        if (!response.ok) { window.localStorage.removeItem(CASE_KEY); return; }
        setMode("LIVE"); setSessionId(body.session_id); setProjection(body.workspace_projection); setVersion(body.state_version);
        setTurns(body.conversation.map((turn) => ({ role: turn.actor === "USER" ? "User" : "Entimema", text: turn.text })));
      }).catch(() => setRuntimeError({ code: "CASE_RECOVERY_UNAVAILABLE", message: "The durable Case could not be restored. You can retry by refreshing.", retryable: true }))
      .finally(() => setRecovering(false));
  }, []);

  function begin(id: string) { setScenarioId(id); setStep(0); setSelectedNode(null); setSelectedUnknown(null); }
  function applyCase(body: CaseResponse | LiveMessageResponse) {
    setSessionId(body.session_id); setProjection(body.workspace_projection);
    setVersion("problem_state_version" in body ? body.problem_state_version : body.state_version);
    setTurns(body.conversation.map((turn) => ({ role: turn.actor === "USER" ? "User" : "Entimema", text: turn.text })));
  }
  async function beginLive(initialMessage: string) {
    if (!initialMessage.trim()) return;
    setBusy(true); setRuntimeError(null);
    try {
      const response = await fetch("/api/concierge/sessions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ mode: "LIVE" }) });
      const created = await response.json() as CaseResponse & { errors?: RuntimeError[] };
      if (!response.ok) throw created.errors?.[0] ?? { code: "RUNTIME_UNAVAILABLE", message: "Live runtime unavailable.", retryable: true };
      window.localStorage.setItem(CASE_KEY, created.session_id); applyCase(created);
      await submitLive(initialMessage, created.session_id, created.state_version);
    } catch (error) { setRuntimeError(error as RuntimeError); } finally { setBusy(false); }
  }
  async function submitLive(text = message, activeSession = sessionId, activeVersion = version, unknownId = selectedUnknown) {
    if (!activeSession || !text.trim()) return;
    setBusy(true); setRuntimeError(null);
    try {
      const response = await fetch(`/api/concierge/sessions/${encodeURIComponent(activeSession)}/messages`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ message: text.trim(), client_turn_id: crypto.randomUUID(), selected_unknown_id: unknownId, session_context_version: activeVersion }) });
      const body = await response.json() as LiveMessageResponse & { errors?: RuntimeError[] };
      if (!response.ok) throw body.errors?.[0] ?? { code: "RUNTIME_UNAVAILABLE", message: "Live runtime unavailable.", retryable: true };
      applyCase(body); setMessage(""); setSelectedUnknown(null);
    } catch (error) { setRuntimeError(error as RuntimeError); } finally { setBusy(false); }
  }
  function resetAll() { setScenarioId(null); setStep(0); setSelectedNode(null); setSelectedUnknown(null); setSessionId(null); setProjection(null); setTurns([]); setVersion(0); setRuntimeError(null); window.localStorage.removeItem(CASE_KEY); }
  function focusUnknown(id: string, question: string) { setSelectedUnknown(id); setSelectedNode(id); setMessage(question); requestAnimationFrame(() => document.getElementById("lab-input")?.focus()); }

  if (recovering) return <main className={styles.lab}><LabHeader /><p className={styles.recovering} role="status">Restoring durable Case…</p></main>;
  const activeProjection = mode === "LIVE" ? projection : snapshot?.projection ?? null;
  const activeTurns = mode === "LIVE" ? turns : snapshot?.conversation ?? [];
  const activePrompt = mode === "FIXTURE" ? scenario?.prompt ?? "" : "";

  if (!activeProjection) return <main className={styles.lab}><LabHeader /><section className={styles.intake} aria-labelledby="intake-title"><span className={styles.eyebrow}>Concierge · Decision Intelligence</span><h1 id="intake-title">Bring the problem.</h1><p>Ask Entimema. Your conversation will open a durable Case, while canonical state remains the analytical authority.</p><div className={styles.modeControl} aria-label="Workspace source"><button className={mode === "LIVE" ? styles.modeActive : ""} onClick={() => setMode("LIVE")}>LIVE CASE</button><button className={mode === "FIXTURE" ? styles.modeActive : ""} onClick={() => setMode("FIXTURE")}>GUIDED PREVIEW</button></div><form className={styles.intakeForm} onSubmit={(event) => { event.preventDefault(); const input = new FormData(event.currentTarget).get("problem")?.toString() ?? ""; if (mode === "LIVE") void beginLive(input); else begin("working-capital"); }}><label className={styles.srOnly} htmlFor="problem-input">Bring the problem / Ask Entimema</label><input id="problem-input" name="problem" placeholder="Bring the problem / Ask Entimema" required /><button type="submit" disabled={busy}>{busy ? "Forming Case…" : "Open Case"}</button></form>{runtimeError && <RuntimeNotice error={runtimeError} />}{mode === "FIXTURE" && <div className={styles.scenarioPicker} aria-label="Canonical projection previews">{labScenarios.map((item) => <button key={item.id} onClick={() => begin(item.id)}>{item.label}</button>)}</div>}<p className={styles.previewNote}>{mode === "FIXTURE" ? "Deterministic canonical projections" : "Durable runtime · canonical projection"}</p></section></main>;

  const caseLabel = mode === "LIVE" ? sessionId?.slice(0, 8) : `preview-${scenario?.id}`;
  return <main className={styles.lab}><LabHeader /><div className={styles.toolbar} aria-label="Case controls"><span>Case {caseLabel} · {activeProjection.workspace_phase?.replaceAll("_", " ") ?? activeProjection.problem_status}</span>{mode === "FIXTURE" && <><label>Projection<select value={scenario?.id} onChange={(event) => begin(event.target.value)}>{labScenarios.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label><button onClick={() => { setStep((value) => (value + 1) % (scenario?.snapshots.length ?? 1)); setSelectedNode(null); }}>Next canonical state</button></>}<button onClick={resetAll}>Close Case</button><output>State v{mode === "LIVE" ? version : step}</output></div>{runtimeError && <RuntimeNotice error={runtimeError} />}<div className={styles.workspace}><ConversationPanel prompt={activePrompt} turns={activeTurns} live={mode === "LIVE"} value={message} busy={busy} onValue={setMessage} onSubmit={() => void submitLive()} sessionId={mode === "LIVE" ? sessionId ?? undefined : undefined} artifacts={activeProjection.artifacts ?? []} onEvidence={(payload) => setProjection((current) => current ? { ...current, ...payload } as DecisionWorkspaceProjection : current)} selectedUnknown={selectedUnknown ? activeProjection.unknowns.find((item) => item.id === selectedUnknown) : undefined} /><div className={styles.stateWorkspace}><ProblemStatePanel projection={activeProjection} synthesis={snapshot?.synthesis ?? null} onUnknown={focusUnknown} selectedId={selectedNode} onSelect={setSelectedNode} /><DecisionMapView map={activeProjection.decision_map} selectedId={selectedNode} onSelect={(id) => { setSelectedNode(id); const unknown = activeProjection.unknowns.find((item) => item.id === id); if (unknown) focusUnknown(unknown.id, unknown.clarification_target); }} /></div></div></main>;
}

function RuntimeNotice({ error }: { error: RuntimeError }) { return <div className={styles.runtimeError} role="status"><strong>Case service notice</strong><p>{error.message}</p></div>; }
function LabHeader() { return <header className={styles.header}><Link href="/" aria-label="Entimema home"><BrandLogo /></Link><div><span>Concierge</span><strong>Decision Intelligence Workspace</strong></div><span className={styles.privateLabel}>Private workspace</span></header>; }
