"use client";
import { useState } from "react";
import type { Result } from "@/backend/financial-intelligence/v1/contract";
import { DOCUMENT_CLASSIFIER_MAX_FILE_BYTES } from "@/lib/document-classifier-upload";
import { FinancialIntelligenceResult } from "./FinancialIntelligenceResult";
import { RUNS_KEY, readRuns, type StoredRun } from "./RunsTable";
import styles from "./FinancialIntelligenceWorkspace.module.css";

const nodes = [
  { id: "source", mark: "SD", type: "Source", title: "Source document", detail: "A supported XLSX, XLS, CSV or text-based PDF income statement." },
  { id: "intake", mark: "IN", type: "AI", title: "Intelligent intake", detail: "Identifies document structure, periods and financial meaning." },
  { id: "extract", mark: "EX", type: "AI", title: "Financial extraction", detail: "Extracts reported lines and values without inventing missing data." },
  { id: "periods", mark: "PH", type: "Control", title: "Period harmonization", detail: "Normalizes reporting periods for consistent comparison." },
  { id: "mapping", mark: "CM", type: "AI + schema", title: "Canonical mapping", detail: "Maps source lines into the Entimema financial schema." },
  { id: "validation", mark: "DV", type: "Deterministic", title: "Deterministic validation", detail: "Runs arithmetic, reconciliation and supported financial checks." },
  { id: "confidence", mark: "CE", type: "Control", title: "Confidence & exceptions", detail: "Surfaces ambiguity and routes material exceptions for review." },
  { id: "review", mark: "HR", type: "Human", title: "Human review", detail: "Keeps material judgement and acceptance under human control." },
  { id: "output", mark: "TO", type: "Output", title: "Traceable output", detail: "Returns review-ready analysis with source evidence." },
] as const;

type NodeId = (typeof nodes)[number]["id"];

export function FinancialIntelligenceWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<NodeId>("source");
  const selectedNode = nodes.find((node) => node.id === selected) ?? nodes[0];

  function nodeState(id: NodeId) {
    if (result) return id === "review" ? "Review required" : "Complete";
    if (busy) {
      if (id === "source") return "Complete";
      if (id === "review" || id === "output") return "Pending";
      return "Running";
    }
    if (id === "source" && file) return "Ready";
    return "Pending";
  }

  async function execute() {
    if (!file || busy) return;
    setResult(null);
    setError("");
    if (file.size > DOCUMENT_CLASSIFIER_MAX_FILE_BYTES) {
      setError("The file exceeds the 4.5 MB upload limit.");
      return;
    }
    setBusy(true);
    setSelected("intake");
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/financial-intelligence/run", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "The file could not be processed.");
      setResult(data);
      setSelected("review");
      const completed = data as Result;
      const stored: StoredRun = {
        runId: crypto.randomUUID(), timestamp: new Date().toISOString(),
        documentType: "Income statement", source: file.name, confidence: 1,
        route: "financial_intelligence", duration: completed.timings.totalMs, status: "completed",
      };
      sessionStorage.setItem(RUNS_KEY, JSON.stringify([stored, ...readRuns()].slice(0, 25)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The file could not be processed.");
      setSelected("source");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.workspace}>
      <header className={styles.command}>
        <div>
          <p>FINANCE / FINANCIAL INTELLIGENCE / V1</p>
          <h1>Income Statement Analysis</h1>
          <span>Controlled extraction, validation and review with source traceability.</span>
        </div>
        <button onClick={() => void execute()} disabled={!file || busy}>
          {busy ? "Running analysis…" : "Run analysis"}
        </button>
      </header>

      <div className={styles.canvas}>
        <aside className={styles.sourcePanel} aria-label="Source document">
          <p>SOURCE</p>
          <h2>Bring the document</h2>
          <label className={styles.fileControl} htmlFor="fi-file">
            <span aria-hidden="true">＋</span>
            <strong>{file ? file.name : "Choose source file"}</strong>
            <small>XLSX, XLS, CSV or text-based PDF<br />Up to 4.5 MB</small>
          </label>
          <input
            id="fi-file" className={styles.nativeInput} type="file" accept=".xlsx,.xls,.csv,.pdf"
            disabled={busy}
            onChange={(event) => {
              setFile(event.target.files?.[0] ?? null);
              setResult(null);
              setError("");
              setSelected("source");
            }}
          />
          <dl>
            <div><dt>Workflow</dt><dd>Income statement</dd></div>
            <div><dt>Release</dt><dd>V1</dd></div>
            <div><dt>Access</dt><dd>Controlled beta</dd></div>
          </dl>
        </aside>

        <section className={styles.flow} aria-label="Financial Intelligence workflow">
          <div className={styles.canvasLabel}><span>WORKFLOW</span><small>{busy ? "RUNNING" : result ? "REVIEW READY" : "DRAFT"}</small></div>
          <ol>
            {nodes.map((node, index) => {
              const state = nodeState(node.id);
              return (
                <li key={node.id}>
                  <button
                    type="button"
                    className={[styles.node, styles[node.type.toLowerCase().replaceAll(" ", "").replace("+", "plus")], selected === node.id ? styles.selected : "", state === "Running" ? styles.running : "", state === "Complete" ? styles.complete : "", state === "Review required" ? styles.review : ""].filter(Boolean).join(" ")}
                    onClick={() => setSelected(node.id)}
                    aria-pressed={selected === node.id}
                  >
                    <span className={styles.nodeMark}>{node.mark}</span>
                    <span><small>{node.type.toUpperCase()}</small><strong>{node.title}</strong></span>
                    <em>{state}</em>
                  </button>
                  {index < nodes.length - 1 && <span className={styles.connector} aria-hidden="true">↓</span>}
                </li>
              );
            })}
          </ol>
        </section>

        <aside className={styles.inspector} aria-live="polite">
          <p>INSPECT</p>
          <div className={styles.inspectTitle}><span>{selectedNode.mark}</span><div><small>{selectedNode.type}</small><h2>{selectedNode.title}</h2></div></div>
          <p className={styles.detail}>{selectedNode.detail}</p>
          <dl>
            <div><dt>State</dt><dd>{nodeState(selectedNode.id)}</dd></div>
            <div><dt>Control owner</dt><dd>{selectedNode.type === "Human" ? "Reviewer" : selectedNode.type.includes("AI") ? "AI + controls" : "System"}</dd></div>
            <div><dt>Evidence</dt><dd>{selectedNode.id === "source" ? (file ? file.name : "Not provided") : result ? "Available in result" : "Created during run"}</dd></div>
          </dl>
          {selectedNode.id === "review" && <div className={styles.reviewNote}><strong>Human control</strong><span>Exceptions and material judgements must be reviewed before the output is accepted.</span></div>}
        </aside>
      </div>

      <div className={styles.status} role="status">
        {busy ? "Processing the source document and running controls…" : result ? "Result ready. Review the verified values and source evidence below." : "Select a source document to begin."}
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {result && <FinancialIntelligenceResult result={result} />}
    </div>
  );
}
