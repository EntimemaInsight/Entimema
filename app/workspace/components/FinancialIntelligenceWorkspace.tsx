"use client";
import Link from "next/link";
import { useState } from "react";
import type { Result } from "@/backend/financial-intelligence/v1/contract";
import { DOCUMENT_CLASSIFIER_MAX_FILE_BYTES } from "@/lib/document-classifier-upload";
import styles from "./FinancialIntelligenceWorkspace.module.css";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 6 });
export function FinancialIntelligenceWorkspace({
  user,
}: {
  user: { name: string; email: string };
}) {
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
    <main className={styles.workspace}>
      <header className={styles.header}>
        <Link href="/workspace">ENTIMEMA</Link>
        <span>{user.name}</span>
      </header>
      <div className={styles.intro}>
        <p>FINANCIAL INTELLIGENCE / V1</p>
        <h1>Read your income statement.</h1>
        <p>
          Upload a P&amp;L to see its financial lines, profitability and
          year-over-year performance.
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
          ? "Processing your income statement…"
          : result
            ? "Result ready. Financial values verified against your file."
            : ""}
      </div>
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      {result && (
        <section className={styles.result} aria-label="Result">
          <p className={styles.eyebrow}>RESULT / INCOME STATEMENT</p>
          <h2>{result.entity ?? "Income Statement"}</h2>
          <dl className={styles.metadata}>
            <div>
              <dt>Currency</dt>
              <dd>{result.currency ?? "Not stated"}</dd>
            </div>
            <div>
              <dt>Scale</dt>
              <dd>{result.scale ?? "Not stated"}</dd>
            </div>
            <div>
              <dt>Periods</dt>
              <dd>{result.periods.join(" · ")}</dd>
            </div>
          </dl>
          <div
            className={styles.table}
            tabIndex={0}
            role="region"
            aria-label="Financial lines, scroll horizontally for all periods"
          >
            <table>
              <caption>
                Source financial lines · {result.verification.verifiedValues}{" "}
                verified values
              </caption>
              <thead>
                <tr>
                  <th scope="col">Line item</th>
                  {result.periods.map((period) => (
                    <th scope="col" key={period}>
                      {period}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.lines.map((line, i) => (
                  <tr key={i}>
                    <th scope="row">{line.label}</th>
                    {result.periods.map((period) => {
                      const value = line.values.find(
                        (value) => value.period === period,
                      );
                      return (
                        <td key={period}>
                          {value ? (
                            <>
                              <span>{number.format(value.value)}</span>
                              <small>{value.sourceRef}</small>
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {result.kpis.length > 0 && (
            <div className={styles.kpis}>
              {result.kpis.map((kpi) => (
                <article key={`${kpi.label}:${kpi.period}`}>
                  <p>
                    {kpi.label} · {kpi.period}
                  </p>
                  <strong>{number.format(kpi.value)}%</strong>
                </article>
              ))}
            </div>
          )}
          <section className={styles.analysis}>
            <h3>Financial interpretation</h3>
            <p>{result.summary}</p>
            <ul>
              {result.findings.map((finding, i) => (
                <li key={i}>{finding}</li>
              ))}
            </ul>
          </section>
        </section>
      )}
    </main>
  );
}
