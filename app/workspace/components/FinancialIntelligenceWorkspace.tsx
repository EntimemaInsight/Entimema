"use client";
import Link from "next/link";
import { useState } from "react";
import { CANONICAL_CONCEPTS, type FinancialRun, type ReviewDecision } from "@/backend/financial-intelligence/schema";
import type { FinancialAnalysis } from "@/backend/financial-intelligence/analysis";
import { DOCUMENT_CLASSIFIER_MAX_FILE_BYTES } from "@/lib/document-classifier-upload";

const errorText: Record<string, string> = {
  AUTHENTICATION_REQUIRED: "Your session expired. Sign in again.",
  ACCESS_FORBIDDEN: "Your account is not authorized for this workspace.",
  FILE_TOO_LARGE: "The file exceeds the 4.5 MB production boundary.",
  UNSUPPORTED_FILE_TYPE: "Use XLSX, XLSM, CSV, or a text-based PDF.",
  FILE_CORRUPT: "The document could not be safely read.",
  PERSISTENCE_UNAVAILABLE: "Financial run storage is temporarily unavailable. Try again later.",
  EXECUTION_RATE_LIMIT: "Too many executions. Try again shortly.",
};
export function FinancialIntelligenceWorkspace({
  user,
  operator,
}: {
  user: { name: string; email: string };
  operator: boolean;
}) {
  const [file, setFile] = useState<File | null>(null),
    [run, setRun] = useState<FinancialRun | null>(null),
    [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null),
    [analysisError, setAnalysisError] = useState(""),
    [reportBusy, setReportBusy] = useState(false),
    [reportError, setReportError] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [stage, setStage] = useState("result"),
    [evidenceId, setEvidenceId] = useState<string | null>(null),
    [mobilePeriod, setMobilePeriod] = useState(0),
    [view, setView] = useState<"workflow" | "runs" | "review">("workflow"),
    [runs, setRuns] = useState<
      Array<{
        runId: string;
        filename: string;
        selectedStatement: string | null;
        status: string;
        periods: number;
        financialRows: number;
        openTasks: number;
        createdAt: string;
        updatedAt: string;
        revision: number;
      }>
    >([]),
    [saveState, setSaveState] = useState("Saved"),
    [reviewDrafts, setReviewDrafts] = useState<Record<string,{action:ReviewDecision["action"];concept:string;confirmed:boolean}>>({}),
    [reviewBusy, setReviewBusy] = useState<string | null>(null),
    [reviewMessage, setReviewMessage] = useState("");
  const clearDerivedState = () => { setAnalysis(null); setAnalysisError(""); setReportError(""); setReportBusy(false); };
  const analysisQuery = (current: FinancialRun) => new URLSearchParams({revision:String(current.revision ?? 1),statement:current.source.selectedSection ?? "",snapshot:current.integrity,schema:current.schemaVersion}).toString();
  const evidence = run?.evidence.find((e) => e.id === evidenceId);
  async function loadRuns(reviewQueue = false) {
    setSaveState("Saving");
    try {
      const response = await fetch(reviewQueue ? "/api/financial-intelligence/runs/review" : "/api/financial-intelligence/runs", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      setRuns(await response.json());
      setSaveState("Saved");
    } catch {
      setSaveState("Save failed");
    }
  }
  async function openRun(id: string) {
    setBusy(true);
    clearDerivedState();
    try {
      const response = await fetch(`/api/financial-intelligence/runs/${id}${operator ? "/review" : ""}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      setRun(await response.json());
      setView("workflow");
      setSaveState("Saved");
    } catch {
      setError("The persisted run could not be opened safely.");
    } finally {
      setBusy(false);
    }
  }
  async function submitReview(taskId: string) {
    if (!run || reviewBusy) return;
    const draft=reviewDrafts[taskId];
    if (!draft?.confirmed) return;
    const decision:ReviewDecision={taskId,action:draft.action,...(draft.action==="remap"?{concept:draft.concept as ReviewDecision["concept"]}:{}),...(draft.action==="confirm_currency"?{currency:draft.concept}:{}),...(draft.action==="confirm_scale"?{unitScale:Number(draft.concept)}:{}),...(draft.action==="confirm_period"?{periodLabel:draft.concept}:{})};
    setReviewBusy(taskId); setReviewMessage(""); setError("");
    try {
      const response=await fetch(`/api/financial-intelligence/runs/${run.runId}/review`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({expectedRevision:run.revision,decision})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error_code??"FAILED");
      setRun(data); clearDerivedState();
      setReviewMessage(data.status==="validated"?"Review applied. Deterministic controls passed and the validated revision is ready.":"Review applied. The revised statement was recalculated; further verification remains.");
      setReviewDrafts(current=>{const next={...current};delete next[taskId];return next});
      void loadRuns();
    } catch(e) { setError(e instanceof Error&&e.message==="STALE_REVISION"?"This run changed. Reopen it before reviewing.":"The review decision could not be applied safely."); }
    finally { setReviewBusy(null); }
  }
  async function execute(selectedSheet?: string) {
    if (!file || busy) return;
    if (file.size > DOCUMENT_CLASSIFIER_MAX_FILE_BYTES) {
      setError(errorText.FILE_TOO_LARGE);
      return;
    }
    clearDerivedState();
    setBusy(true);
    setError("");
    try {
      const body = new FormData();
      body.set("file", file);
      if (selectedSheet) body.set("selectedSheet", selectedSheet);
      const response = await fetch("/api/financial-intelligence/run", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error_code ?? "FAILED");
      setRun(data);
      setStage("result");
      setSaveState("Saved");
      void loadRuns();
    } catch (e) {
      clearDerivedState();
      setError(
        errorText[e instanceof Error ? e.message : ""] ??
          "The execution could not be completed safely.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function runAnalysis() {
    if (!run || run.status !== "validated" || busy) return;
    setBusy(true);
    setError("");
    setAnalysisError("");
    try {
      const response = await fetch(
        `/api/financial-intelligence/runs/${run.runId}/analysis?${analysisQuery(run)}`,
        { cache: "no-store" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error_code ?? "FAILED");
      setAnalysis(data);
    } catch (e) {
      const message =
        e instanceof Error && e.message === "ANALYSIS_BLOCKED"
          ? "Financial analysis remains blocked until the Income Statement is validated."
          : "The financial analysis could not be generated safely.";
      setError(message);
      setAnalysisError(message);
    } finally {
      setBusy(false);
    }
  }
  async function downloadReport() {
    if (!run || !analysis || reportBusy) return;
    setReportBusy(true);
    setReportError("");
    try {
      const response = await fetch(`/api/financial-intelligence/runs/${run.runId}/report?${analysisQuery(run)}`, { cache: "no-store" });
      if (!response.ok) {
        const data = await response.json() as { message?: string };
        throw new Error(data.message ?? "Report generation failed");
      }
      const blobUrl = URL.createObjectURL(await response.blob());
      const disposition = response.headers.get("content-disposition") ?? "";
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = disposition.match(/filename="([^"]+)"/)?.[1] ?? "entimema-financial-intelligence-report.pdf";
      anchor.click();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setReportError(error instanceof Error ? error.message : "Report generation failed");
    } finally {
      setReportBusy(false);
    }
  }
  return (
    <main className="fiWorkspace">
      <header className="fiTop">
        <Link href="/workspace" className="brand">
          ENTIMEMA
        </Link>
        <div>
          <small>FINANCIAL INTELLIGENCE</small>
          <strong>Income Statement · v1</strong>
        </div>
        <span className="fiLive">● Live</span>
        <button onClick={() => execute()} disabled={!file || busy}>
          {busy ? "Executing…" : "Run workflow"}
        </button>
        <details>
          <summary>{user.name[0].toUpperCase()}</summary>
          <p>{user.email}</p>
        </details>
      </header>
      <nav className="fiRail">
        <Link href="/workspace/agents/document-classifier">Classifier</Link>
        <button
          aria-current={view === "workflow" ? "page" : undefined}
          onClick={() => setView("workflow")}
        >
          Execution
        </button>
        <button
          aria-current={view === "runs" ? "page" : undefined}
          onClick={() => {
            setView("runs");
            void loadRuns();
          }}
        >
          Runs
        </button>
        {operator && <button aria-current={view === "review" ? "page" : undefined} onClick={() => {setView("review");void loadRuns(true)}}>Review queue</button>}
        <span>{saveState}</span>
      </nav>
      <section className="fiMain">
        {view === "runs" || view === "review" ? (
          <section className="fiStatement">
            <header>
              <div>
                <small>{view === "review" ? "OPERATOR CONTROL" : "DURABLE WORKFLOW"}</small>
                <h1>{view === "review" ? "Specialist review queue" : "Financial runs"}</h1>
              </div>
            </header>
            <div className="fiTable">
              <div className="fiTr fiTh">
                <span>File / statement</span>
                <span>Status</span>
                <span>Metrics</span>
                <span>Updated / revision</span>
              </div>
              {runs.map((item) => (
                <div className="fiTr" key={item.runId}>
                  <span>
                    <strong>{item.filename}</strong>
                    <small>
                      {item.selectedStatement ?? "Statement not selected"}
                    </small>
                  </span>
                  <span>{item.status.replaceAll("_", " ")}</span>
                  <span>
                    {item.periods} periods · {item.financialRows} rows ·{" "}
                    {item.openTasks} open
                  </span>
                  <button onClick={() => openRun(item.runId)}>
                    {item.status === "review_required" ? "Resume" : "Open"} · r
                    {item.revision}
                  </button>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            <header>
              <div>
                <p className="eyebrow">Executable workflow</p>
                <h1>Traceable Income Statement</h1>
                <p>
                  Upload once. Classification, extraction, mapping and controls
                  reuse the inspected bytes in memory.
                </p>
              </div>
              <label className="fiUpload">
                <input
                  type="file"
                  accept=".xlsx,.xlsm,.csv,.pdf"
                  onChange={(e) => { clearDerivedState(); setRun(null); setFile(e.target.files?.[0] ?? null); }}
                />
                <span>{file ? file.name : "Choose financial statement"}</span>
                <small>
                  {file
                    ? `${(file.size / 1e6).toFixed(2)} MB`
                    : "XLSX, XLSM, CSV or text PDF · max 4.5 MB"}
                </small>
              </label>
            </header>
            {error && (
              <div role="alert" className="fiError">
                {error}
              </div>
            )}
            <div className="fiFlow" id="workflow">
              {(
                run?.workflow ??
                [
                  "File Intake",
                  "Document Classification",
                  "Statement Detection",
                  "Income Statement Extraction",
                  "Canonical Mapping",
                  "Financial Validation",
                  "Human Review",
                  "Validated Result",
                ].map((label, i) => ({
                  id: String(i),
                  label,
                  state: "idle" as const,
                }))
              ).map((s, i) => (
                <button
                  key={s.id}
                  className={s.state}
                  onClick={() => setStage(s.id)}
                >
                  <i>
                    {s.state === "completed"
                      ? "✓"
                      : s.state === "review_required"
                        ? "!"
                        : s.state === "blocked"
                          ? "×"
                          : i + 1}
                  </i>
                  <span>
                    <small>STAGE {i + 1}</small>
                    <strong>{s.label}</strong>
                    <em>{s.state.replaceAll("_", " ")}</em>
                  </span>
                </button>
              ))}
            </div>
            <div className="fiPanels">
              <section className="fiStatement">
                <header>
                  <div>
                    <small>CANONICAL INCOME STATEMENT</small>
                    <h2>
                      {run?.source.selectedSection ?? "Awaiting execution"}
                    </h2>
                  </div>
                  {run && (
                    <span className={`fiStatus ${run.status}`}>
                      {run.status.replaceAll("_", " ")}
                    </span>
                  )}
                </header>
                {!run ? (
                  <Empty />
                ) : (
                  <>
                    <div className="fiMeta">
                      <span>
                        Currency <b>{run.currency ?? "Unknown"}</b>
                      </span>
                      <span>
                        Scale{" "}
                        <b>{run.unitScale?.toLocaleString() ?? "Unknown"}</b>
                      </span>
                      <span>
                        Periods <b>{run.metrics.periods}</b>
                      </span>
                      <span>
                        Lines <b>{run.metrics.financialSourceRows}</b>
                      </span>
                      <span>
                        Extracted values <b>{run.metrics.extractedValues}</b>
                      </span>
                      <span>
                        Mapped rows <b>{run.metrics.canonicalMappedRows}</b>
                      </span>
                    </div>
                    <label className="fiMobilePeriod">
                      Period
                      <select
                        value={mobilePeriod}
                        onChange={(e) =>
                          setMobilePeriod(Number(e.target.value))
                        }
                      >
                        {run.periods.map((p, i) => (
                          <option value={i} key={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div
                      className="fiTable"
                      style={
                        {
                          "--mobile-period": mobilePeriod,
                          "--fi-periods": run.periods.length,
                        } as React.CSSProperties
                      }
                    >
                      <div className="fiTr fiTh">
                        <span>Reported line / mapping</span>
                        {run.periods.map((p, pi) => (
                          <span
                            className={
                              pi === mobilePeriod ? "mobileSelected" : undefined
                            }
                            key={p.id}
                          >
                            {p.label}
                          </span>
                        ))}
                      </div>
                      {group(run, "p_and_l").map((row) => (
                        <div className="fiTr" key={row.label}>
                          <span>
                            <strong>{row.label}</strong>
                            <small>
                              Interpreted financial line
                            </small>
                          </span>
                          {run.periods.map((p, pi) => {
                            const v = row.values.find(
                              (x) => x.periodId === p.id,
                            );
                            return (
                              <button
                                className={
                                  pi === mobilePeriod
                                    ? "mobileSelected"
                                    : undefined
                                }
                                key={p.id}
                                disabled={!v}
                                onClick={() => v && setEvidenceId(v.evidenceId)}
                              >
                                {v ? v.normalizedValue.toLocaleString() : "—"}
                                <small
                                  aria-label={
                                    v ? "Inspect evidence" : undefined
                                  }
                                >
                                  {v ? "⌕" : ""}
                                </small>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>
              <aside className="fiInspector">
                <header>
                  <small>INSPECTOR</small>
                  <strong>
                    {evidence
                      ? "Value evidence"
                      : stage === "review"
                        ? "Verification status"
                        : "Execution readiness"}
                  </strong>
                </header>
                {evidence ? (
                  <dl>
                    {Object.entries(evidence)
                      .filter(([, v]) => v !== undefined)
                      .map(([k, v]) => (
                        <div key={k}>
                          <dt>{k.replaceAll(/([A-Z])/g, " $1")}</dt>
                          <dd>{String(v)}</dd>
                        </div>
                      ))}
                  </dl>
                ) : run ? (
                  <>
                    {run.status === "review_required" ? (
                      operator && run.reviewTasks.length ? <OperatorReview run={run} drafts={reviewDrafts} setDrafts={setReviewDrafts} busy={reviewBusy} message={reviewMessage} submit={submitReview}/> :
                      <div className="fiTask"><strong>Specialist verification required</strong><p>Your document was received successfully, but Entimema needs to verify part of its financial structure before releasing the analysis.</p>{operator&&<p>Reopen this run from Runs to load the protected operator review context.</p>}</div>
                    ) : (
                      <div className="fiTask"><strong>Analysis ready</strong><p>The statement was interpreted and its financial relationships were verified.</p></div>
                    )}
                  </>
                ) : (
                  <Empty />
                )}
              </aside>
            </div>
            {run && (
              <section className="fiAnalysis">
                <header>
                  <div>
                    <small>TRACEABLE FINANCIAL ANALYSIS</small>
                    <h2>
                      {analysis
                        ? "Analysis ready"
                        : run.status === "validated"
                          ? "Validated data ready"
                          : "Analysis blocked"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    disabled={run.status !== "validated" || busy}
                    onClick={() => void runAnalysis()}
                  >
                    {busy
                      ? "Generating…"
                      : analysis
                        ? "Regenerate analysis"
                        : "Run analysis"}
                  </button>
                </header>
                {analysis && run?.status === "validated" && analysis.runId === run.runId && analysis.revision === (run.revision ?? 1) && analysis.validatedSnapshotHash === run.integrity ? (
                  <>
                    <div className="fiReportAction">
                      <div>
                        <strong>Client deliverable</strong>
                        <small>Server-generated from this owned, validated revision.</small>
                      </div>
                      <button type="button" disabled={reportBusy} onClick={() => void downloadReport()}>
                        {reportBusy ? "Generating report…" : "Download report"}
                      </button>
                      {reportError && <p role="alert">Report generation failed: {reportError}</p>}
                    </div>
                    <div className="fiAnalysisMetrics">
                      {analysis.metrics
                        .filter(
                          (metric) =>
                            metric.periodId === run.periods.at(-1)?.id,
                        )
                        .map((metric) => (
                          <article key={metric.key}>
                            <small>{metric.key.replaceAll("_", " ")}</small>
                            <strong>
                              {metric.unit === "ratio"
                                ? `${(metric.value * 100).toFixed(1)}%`
                                : metric.value.toLocaleString()}
                            </strong>
                            <span>{metric.formula}</span>
                          </article>
                        ))}
                    </div>
                    <div className="fiFindings">
                      {analysis.findings.map((finding) => (
                        <article key={finding.id}>
                          <span>
                            {finding.classification} · {finding.kind}
                          </span>
                          <strong>{finding.title}</strong>
                          <p>{finding.statement}</p>
                          <small>
                            {finding.evidenceIds.length} evidence reference
                            {finding.evidenceIds.length === 1 ? "" : "s"} ·
                            confidence {Math.round(finding.confidence * 100)}%
                          </small>
                        </article>
                      ))}
                    </div>
                  </>
                ) : (
                  <p role={analysisError ? "alert" : undefined}>
                    {analysisError ||
                      (run.status === "validated"
                        ? "Generate deterministic KPIs, variances and evidence-linked findings from this immutable revision."
                        : "Complete material review and validation before analysis can run.")}
                  </p>
                )}
                {!analysis && run.status !== "validated" && (
                  <p className="fiReportBlocked">Report download is blocked until validation and financial analysis are complete.</p>
                )}
              </section>
            )}
            {run?.auditEvents && (
              <section className="fiControls">
                <header>
                  <small>AUDIT TRAIL</small>
                  <b>Append-only material events</b>
                </header>
                {run.auditEvents.map((e) => (
                  <article key={e.eventId}>
                    <span>r{e.revision}</span>
                    <strong>{e.eventType.replaceAll("_", " ")}</strong>
                    <code>
                      {e.actor} · {new Date(e.timestamp).toLocaleString()}
                    </code>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
        <footer>
          Structured runs are persisted · uploaded document bytes are never
          retained · normal removal archives the run
        </footer>
      </section>
    </main>
  );
}
function OperatorReview({run,drafts,setDrafts,busy,message,submit}:{run:FinancialRun;drafts:Record<string,{action:ReviewDecision["action"];concept:string;confirmed:boolean}>;setDrafts:React.Dispatch<React.SetStateAction<Record<string,{action:ReviewDecision["action"];concept:string;confirmed:boolean}>>>;busy:string|null;message:string;submit:(taskId:string)=>Promise<void>}) {
 const tasks=run.reviewTasks.filter(task=>task.state==="open");
 return <div className="fiReview">
  <div className="fiTask"><span>OPERATOR CONTROL</span><strong>{tasks.length} material decision{tasks.length===1?"":"s"} open</strong><p>Each decision creates a revision and reruns deterministic controls. It cannot set validation directly.</p>{message&&<p role="status">{message}</p>}</div>
  {tasks.map(task=>{
   const values=run.values.filter(value=>value.sourceRowId===task.sourceRowId);
   const evidence=run.evidence.find(item=>item.id===task.evidenceId);
   const isMapping=Boolean(task.sourceRowId);
   const draft=drafts[task.id]??{action:(task.proposedConcept&&task.proposedConcept!=="other_reported_line"?"accept":"remap") as ReviewDecision["action"],concept:"",confirmed:false};
   const update=(patch:Partial<typeof draft>)=>setDrafts(current=>({...current,[task.id]:{...draft,...patch,confirmed:patch.action||patch.concept!==undefined?false:draft.confirmed}}));
   return <article className="fiTask" key={task.id}>
    <span>{(task.reason??"OTHER").replaceAll("_"," ")}</span><strong>{task.sourceLabel}</strong>
    {values.length>0&&<p>{values.map(value=>`${run.periods.find(period=>period.id===value.periodId)?.label}: ${value.normalizedValue.toLocaleString()}`).join(" · ")}</p>}
    <dl><div><dt>Source</dt><dd>{evidence?.cellAddress??evidence?.pageNumber??"Statement row"} · {values[0]?.section??"unresolved"}</dd></div><div><dt>Proposal</dt><dd>{task.proposedConcept?.replaceAll("_"," ")??"None"} · {Math.round(task.confidence*100)}%</dd></div>{task.supportingEvidence?.length?<div><dt>Mapping evidence</dt><dd>{task.supportingEvidence.join("; ")}</dd></div>:null}</dl>
    {isMapping ? <><label>Decision<select value={draft.action} onChange={event=>update({action:event.target.value as ReviewDecision["action"]})}>{task.proposedConcept&&task.proposedConcept!=="other_reported_line"&&<option value="accept">Accept proposal</option>}<option value="remap">Remap</option><option value="reject">Reject / unresolved</option></select></label>{draft.action==="remap"&&<label>Allowlisted concept<select value={draft.concept} onChange={event=>update({concept:event.target.value})}><option value="">Select concept…</option>{CANONICAL_CONCEPTS.filter(concept=>concept!=="other_reported_line").map(concept=><option key={concept} value={concept}>{concept.replaceAll("_"," ")}</option>)}</select></label>}</> : task.issueType==="unknown_currency"?<label>Currency<input value={draft.concept} onChange={event=>update({action:"confirm_currency",concept:event.target.value})}/></label>:task.issueType==="unknown_scale"?<label>Scale<select value={draft.concept} onChange={event=>update({action:"confirm_scale",concept:event.target.value})}><option value="">Select scale…</option>{[1,1000,1000000].map(scale=><option key={scale} value={scale}>{scale.toLocaleString()}</option>)}</select></label>:task.issueType==="ambiguous_period"?<label>Period label<input value={draft.concept} onChange={event=>update({action:"confirm_period",concept:event.target.value})}/></label>:<p>This control cannot be overridden. Correct prerequisite mappings or source evidence.</p>}
    {(isMapping||["unknown_currency","unknown_scale","ambiguous_period"].includes(task.issueType))&&<><label className="fiReviewConfirm"><input type="checkbox" checked={draft.confirmed} onChange={event=>setDrafts(current=>({...current,[task.id]:{...draft,confirmed:event.target.checked}}))}/> Confirm this audited decision</label><button disabled={!draft.confirmed||Boolean(busy)||(draft.action==="remap"&&!draft.concept)||(["confirm_currency","confirm_scale","confirm_period"].includes(draft.action)&&!draft.concept)} onClick={()=>void submit(task.id)}>{busy===task.id?"Recalculating…":"Apply and recalculate"}</button></>}
   </article>
  })}
 </div>
}
function Empty() {
  return (
    <div className="fiEmpty">
      <b>◇</b>
      <strong>No financial result yet</strong>
      <p>
        Run an eligible English Income Statement to inspect values and their
        source evidence.
      </p>
    </div>
  );
}
function group(run: FinancialRun, section: FinancialRun["values"][number]["section"]) {
  const rows = new Map<
    string,
    {
      label: string;
      concept: FinancialRun["values"][number]["concept"];
      method: string;
      values: FinancialRun["values"];
    }
  >();
  for (const v of run.values.filter((value) => value.section === section)) {
    const key = `${v.sourceLabel}:${v.concept}`;
    if (!rows.has(key))
      rows.set(key, {
        label: v.sourceLabel,
        concept: v.concept,
        method: v.mappingMethod,
        values: [],
      });
    rows.get(key)!.values.push(v);
  }
  return [...rows.values()];
}
