import type { WorkspaceRun } from "@/lib/workspace-runs";

// Legacy classifier runs remain browser-local until that internal agent is productized.
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

export function RunsTable({ runs }: { runs: WorkspaceRun[] }) {
  if (!runs.length)
    return (
      <div className="emptyRuns">
        <strong>No runs yet</strong>
        <span>Complete a Financial Intelligence analysis to create the first execution record.</span>
        <small>Execution history is retained within your restricted Workspace.</small>
      </div>
    );

  return (
    <div className="runsTable">
      <div className="runHead"><span>Run</span><span>Time</span><span>Document</span><span>Source</span><span>Control status</span><span>Workflow</span><span>Duration</span><span>Status</span></div>
      {runs.map((run) => (
        <div className="runRecord" key={run.run_id}>
          <code>{run.run_id.slice(0, 8)}</code>
          <time dateTime={run.created_at}>{new Date(run.created_at).toLocaleString("en-GB")}</time>
          <span>{run.document_type}</span>
          <span>{run.source_name}</span>
          <span>{run.control_status === "completed" ? "Verified" : "Review required"}</span>
          <span>{run.workflow_id.replaceAll("-", " ")}</span>
          <span>{Math.round(run.duration_ms)} ms</span>
          <span className={`tableStatus ${run.control_status}`}>{run.control_status.replaceAll("-", " ")}</span>
        </div>
      ))}
    </div>
  );
}
