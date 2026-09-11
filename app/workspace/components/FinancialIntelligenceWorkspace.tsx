"use client";
import { FinancialIntelligenceResult } from "./FinancialIntelligenceResult";
import { useState } from "react";
import type { Result } from "@/backend/financial-intelligence/v1/contract";
import { DOCUMENT_CLASSIFIER_MAX_FILE_BYTES } from "@/lib/document-classifier-upload";
import { RUNS_KEY, readRuns, type StoredRun } from "./RunsTable";
import styles from "./FinancialIntelligenceWorkspace.module.css";

const stages = ["Intake", "Extraction", "Validation", "Review", "Output"];

export function FinancialIntelligenceWorkspace() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function execute() {
    if (!file || busy) return;
    setResult(null);
    setError("");
    if (file.size > DOCUMENT_CLASSIFIER_MAX_FILE_BYTES) {
      setError("The file exceeds the 4.5 MB upload limit.");
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/financial-intelligence/run", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "The file could not be processed.");
      setResult(data);
      const completed = data as Result;
      const stored: StoredRun = {
        runId: crypto.randomUUID(), timestamp: new Date().toISOString(),
        documentType: "Income statement", source: file.name, confidence: 1,
        route: "financial_intelligence", duration: completed.timings.totalMs, status: "completed",
      };
      sessionStorage.setItem(RUNS_KEY, JSON.stringify([stored, ...readRuns()].slice(0, 25)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The file could not be processed.");
    } finally { setBusy(false); }
  }
  return (
    <div className={styles.workspace}>
      <header className={styles.intro}>
        <p>INCOME STATEMENT ANALYSIS · V1</p>
        <h1>Start a controlled analysis.</h1>
        <p>
          Upload a supported income statement. Entimema will extract and harmonize financial
          lines, run deterministic controls and return a review-ready result with source traceability.
        </p>
      </header>

      <ol className={styles.process} aria-label="Analysis stages">
        {stages.map((stage, index) => <li key={stage}><span>{index + 1}</span>{stage}</li>)}
      </ol>

      <section className={styles.upload} aria-label="Source document">
        <div className={styles.uploadHeading}>
          <div><p>SOURCE DOCUMENT</p><h2>Income statement</h2></div>
          <span>{file ? "Ready to run" : "Awaiting file"}</span>
        </div>
        <label className={styles.fileControl} htmlFor="fi-file">
          <strong>{file ? file.name : "Choose a source document"}</strong>
          <small>XLSX, XLS, CSV or text-based PDF · Up to 4.5 MB</small>
        </label>
        <input
          id="fi-file" className={styles.nativeInput} type="file" accept=".xlsx,.xls,.csv,.pdf"
          disabled={busy}
          onChange={(event) => { setFile(event.target.files?.[0] ?? null); setResult(null); setError(""); }}
        />
        <div className={styles.runRow}>
          <p>Runs apply the controls and review boundaries defined for this workflow.</p>
          <button onClick={() => void execute()} disabled={!file || busy}>
            {busy ? "Running analysis…" : "Run analysis"}
          </button>
        </div>
      </section>
      <div className={styles.status} role="status" aria-live="polite">
        {busy ? "Processing the source document and running controls…" : result ? "Result ready. Review the verified values and source evidence below." : ""}
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {result && <FinancialIntelligenceResult result={result} />}
    </div>
  );
}
