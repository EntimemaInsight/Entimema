"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./demo.module.css";
import reportStyles from "./report.module.css";

const workflow = [
  ["IN", "AI", "Intelligent intake"],
  ["EX", "AI", "Financial extraction"],
  ["PH", "CONTROL", "Period harmonization"],
  ["CM", "AI + SCHEMA", "Canonical mapping"],
  ["DV", "DETERMINISTIC", "Deterministic validation"],
  ["CE", "CONTROL", "Confidence & exceptions"],
  ["HR", "HUMAN", "Human review"],
  ["TO", "OUTPUT", "Traceable output"],
] as const;

const sourceLines = [
  ["Revenue", "12,480,000"],
  ["Cost of sales", "(8,360,000)"],
  ["Gross profit", "4,120,000"],
  ["Administrative and other", "(2,760,000)"],
  ["EBITDA", "1,360,000"],
  ["Net income", "820,000"],
] as const;

const sampleReportHref = "/demo/Entimema_Financial_Intelligence_Northstar_FY2025.pdf";

export function FinancialIntelligenceDemo() {
  const [completed, setCompleted] = useState(false);
  const [selected, setSelected] = useState(0);
  const selectedNode = workflow[selected];

  return (
    <div className={styles.demo}>
      <header className={styles.hero}>
        <div>
          <p>INTERACTIVE PRODUCT DEMO · DEMONSTRATION DATA</p>
          <h1>See a financial statement become a controlled, review-ready analysis.</h1>
        </div>
        <div>
          <p>Follow one pre-validated Income Statement through Entimema&apos;s Financial Intelligence workflow. No upload, account or customer data is required.</p>
          <span>Approximately 4 minutes</span>
        </div>
      </header>

      <section className={styles.workspace} aria-label="Financial Intelligence demonstration">
        <header className={styles.command}>
          <div><small>FINANCE / FINANCIAL INTELLIGENCE / V1</small><strong>Northstar Manufacturing Ltd · FY 2025</strong></div>
          <button type="button" onClick={() => { setCompleted(true); setSelected(5); }} disabled={completed}>
            {completed ? "Demo analysis complete" : "Start the demo analysis →"}
          </button>
        </header>

        <div className={styles.surface}>
          <aside className={styles.source}>
            <p>SOURCE DOCUMENT</p>
            <div className={styles.document}>
              <header><span>NM</span><div><strong>Income Statement</strong><small>FY 2025 · EUR</small></div></header>
              <dl>{sourceLines.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </div>
            <small>Fictional company · Pre-validated demonstration document</small>
          </aside>

          <section className={styles.canvas}>
            <div className={styles.canvasMeta}><span>WORKFLOW</span><small>{completed ? "REVIEW READY" : "READY"}</small></div>
            <ol>{workflow.map(([mark, type, title], index) => (
              <li key={title}>
                <button
                  type="button"
                  className={[styles.node, selected === index ? styles.selected : "", completed ? styles.complete : "", title === "Human review" && completed ? styles.review : ""].filter(Boolean).join(" ")}
                  onClick={() => setSelected(index)}
                  aria-pressed={selected === index}
                >
                  <span>{mark}</span><span><small>{type}</small><strong>{title}</strong></span>
                  <em>{completed ? (title === "Human review" ? "Required" : "Complete") : "Pending"}</em>
                </button>
                {index < workflow.length - 1 ? <i aria-hidden="true">↓</i> : null}
              </li>
            ))}</ol>
          </section>

          <aside className={styles.inspector}>
            <p>INSPECT</p>
            <div className={styles.inspectHeading}><span>{selectedNode[0]}</span><div><small>{selectedNode[1]}</small><h2>{selectedNode[2]}</h2></div></div>
            {completed ? selectedNode[2] === "Confidence & exceptions" ? (
              <div className={styles.exception}><strong>1 item requires review</strong><p>&ldquo;Administrative and other&rdquo; was mapped to Operating expenses with medium confidence.</p><dl><div><dt>Source value</dt><dd>€2,760,000</dd></div><div><dt>Action</dt><dd>Confirm mapping</dd></div></dl></div>
            ) : (
              <div className={styles.controlResult}><strong>Control completed</strong><p>This stage completed using the pre-validated demonstration result.</p></div>
            ) : <p className={styles.inspectorCopy}>Run the demo analysis, then select any workflow block to inspect its state and evidence.</p>}
          </aside>
        </div>
      </section>

      {completed ? (
        <section className={styles.result} aria-labelledby="demo-result">
          <div className={styles.resultHeading}><div><p>PRE-VALIDATED RESULT</p><h2 id="demo-result">A result built for review, not blind acceptance.</h2></div><span>REVIEW REQUIRED</span></div>
          <div className={styles.metrics}>
            <article><small>Revenue</small><strong>€12.48m</strong><span>Source traced</span></article>
            <article><small>Gross margin</small><strong>33.0%</strong><span>Deterministically calculated</span></article>
            <article><small>EBITDA margin</small><strong>10.9%</strong><span>Deterministically calculated</span></article>
            <article><small>Net margin</small><strong>6.6%</strong><span>Deterministically calculated</span></article>
          </div>
          <div className={styles.evidence}>
            <article><p>DETERMINISTIC CHECK</p><h3>Gross profit reconciles</h3><code>€12.48m − €8.36m = €4.12m</code><span>Passed</span></article>
            <article><p>EXCEPTION</p><h3>Mapping confirmation required</h3><span>&ldquo;Administrative and other&rdquo; → Operating expenses</span><b>Human review</b></article>
            <article><p>SOURCE LINEAGE</p><h3>Every material value remains traceable</h3><span>Source label, reported value and period are retained with the normalized output.</span><b>Available</b></article>
          </div>
          <article className={reportStyles.preview} aria-labelledby="sample-report-title">
            <div className={reportStyles.sheet} aria-hidden="true">
              <span>E N T I M E M A</span>
              <small>FINANCIAL INTELLIGENCE · DEMONSTRATION REPORT</small>
              <strong>A financial analysis<br />you can inspect.</strong>
              <i />
              <b>Northstar Manufacturing Ltd</b>
              <em>FY 2025 · EUR · 5 pages</em>
            </div>
            <div className={reportStyles.copy}>
              <p>TRACEABLE DELIVERABLE</p>
              <h3 id="sample-report-title">Take the analysis with you.</h3>
              <span>The sample report packages the executive summary, structured statement, deterministic checks, evidence lineage, review items and decision boundaries into one CFO-ready document.</span>
              <ul>
                <li>Fictional company and pre-validated data</li>
                <li>Reported facts separated from calculations and judgement</li>
                <li>No account, upload or customer information required</li>
              </ul>
              <div className={reportStyles.actions}>
                <a href={sampleReportHref} target="_blank" rel="noreferrer">View the complete sample report <span aria-hidden="true">↗</span></a>
                <a href={sampleReportHref} download="Entimema_Financial_Intelligence_Northstar_FY2025.pdf">Download the sample report · PDF <span aria-hidden="true">↓</span></a>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      <section className={styles.conversion}>
        <div><p>CONTROLLED PILOT</p><h2>Run Financial Intelligence on your own documents.</h2><span>Move from this demonstration to a scoped, paid pilot with restricted Workspace access.</span></div>
        <div>
          <Link href="/pilot/financial-intelligence">Configure a paid pilot →</Link>
          <Link href="/financial-intelligence-launch">Explore Financial Intelligence V1</Link>
        </div>
      </section>
    </div>
  );
}
