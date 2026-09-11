"use client";
import { FinancialIntelligenceResult } from "./FinancialIntelligenceResult";
import { useState } from "react";
import type { Result } from "@/backend/financial-intelligence/v1/contract";
import { DOCUMENT_CLASSIFIER_MAX_FILE_BYTES } from "@/lib/document-classifier-upload";
import { RUNS_KEY, readRuns, type StoredRun } from "./RunsTable";
import styles from "./FinancialIntelligenceWorkspace.module.css";

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
      const response = await fetch("/api/financial-intelligence/run", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "The file could not be processed.");
      setResult(data);
      const completed = data as Result;
      const stored: StoredRun = {
        runId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        documentType: "Income statement",
        source: file.name,
        confidence: 1,
        route: "financial_intelligence",
        duration: completed.timings.totalMs,
        status: "completed",
      };
      sessionStorage.setItem(RUNS_KEY, JSON.stringify([stored, ...readRuns()].slice(0, 25)));
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The file could not be processed.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className={styles.workspace}>
      <div className={styles.intro}>
        <p>FINANCIAL INTELLIGENCE · V1</p>
        <h1>New financial analysis</h1>
        <p>
          Upload an income statement to produce structured financial lines,
          verified KPIs and traceable findings.
        </p>
      </div>
      <section className={styles.upload} aria-label="Upload income statement">
        <label htmlFor="fi-file">Income statement file</label>
        <input
          id="fi-file"
          type="file"
          accept=".xlsx,.xls,.csv,.pdf"
          disabled={busy}
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setResult(null);
            setError("");
          }}
        />
        <p>XLSX, XLS, CSV or text-based PDF · Up to 4.5 MB</p>
        <button onClick={() => void execute()} disabled={!file || busy}>
          {busy ? "Processing…" : "Execute"}
        </button>
      </section>
      <div role="status" aria-live="polite">
        {busy
          ? "Processing financial statement…"
          : result
            ? "Result ready. Financial values verified against your file."
            : ""}
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {result && <FinancialIntelligenceResult result={result} />}
    </div>
  );
}
