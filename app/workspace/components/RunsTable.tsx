"use client";
import { useEffect, useState } from "react";

export type StoredRun = {
  runId: string;
  timestamp: string;
  documentType: string;
  source: string;
  confidence: number;
  route: string;
  duration: number;
  status: string;
};

export const RUNS_KEY = "entimema.workspace.runs.v1";

export function readRuns(): StoredRun[] {
  try {
    return JSON.parse(sessionStorage.getItem(RUNS_KEY) ?? "[]") as StoredRun[];
  } catch {
    return [];
  }
}

export function RunsTable() {
  const [runs, setRuns] = useState<StoredRun[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setRuns(readRuns()));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!runs.length)
    return (
      <div className="emptyRuns">
        <strong>No runs yet</strong>
        <span>Complete a Financial Intelligence analysis to create the first execution record.</span>
        <small>Run history is session-based during the private beta.</small>
      </div>
    );

  return (
    <div className="runsTable">
      <div className="runHead"><span>Run</span><span>Time</span><span>Document</span><span>Source</span><span>Control status</span><span>Workflow</span><span>Duration</span><span>Status</span></div>
      {runs.map((run) => (
        <div className="runRecord" key={run.runId}>
          <code>{run.runId.slice(0, 8)}</code>
          <time>{new Date(run.timestamp).toLocaleTimeString()}</time>
          <span>{run.documentType}</span>
          <span>{run.source}</span>
          <span>{run.route === "financial_intelligence" ? "Verified" : `${Math.round(run.confidence * 100)}%`}</span>
          <span>{run.route.replaceAll("_", " ")}</span>
          <span>{Math.round(run.duration)} ms</span>
          <span className={`tableStatus ${run.status}`}>{run.status}</span>
        </div>
      ))}
    </div>
  );
}
