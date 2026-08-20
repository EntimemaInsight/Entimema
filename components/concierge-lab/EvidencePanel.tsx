"use client";
import { useRef, useState } from "react";
import styles from "./concierge-lab.module.css";
import type { ArtifactView } from "./types";
export default function EvidencePanel({ sessionId, artifacts, onComplete }: { sessionId: string; artifacts: ArtifactView[]; onComplete: (payload: Record<string, unknown>) => void }) {
  const input = useRef<HTMLInputElement>(null); const [status, setStatus] = useState<string | null>(null);
  async function upload(file: File) { setStatus(`Registering ${file.name}…`); const response = await fetch(`/api/concierge/sessions/${encodeURIComponent(sessionId)}/evidence`, { method: "POST", body: file, headers: { "content-type": file.type || "application/octet-stream", "x-filename": file.name, "x-command-id": crypto.randomUUID() } }); const payload = await response.json(); if (!response.ok) { setStatus(payload.validation_error ?? payload.errors?.[0]?.message ?? "Evidence intake could not continue."); return; } onComplete(payload); setStatus("Extracted · candidates pending canonical validation"); }
  return <div className={styles.evidenceCapture}><button type="button" onClick={() => input.current?.click()}>+Evidence <small>PDF · XLSX · CSV</small></button><input ref={input} className={styles.srOnly} type="file" accept=".pdf,.xlsx,.csv" aria-label="Add evidence" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />{status && <p role="status">{status}</p>}{artifacts.length > 0 && <details><summary>{artifacts.length} artifact{artifacts.length === 1 ? "" : "s"}</summary><ul>{artifacts.map((artifact) => <li key={artifact.id}><span>{artifact.filename}</span><small>{artifact.status.replaceAll("_", " ")}</small></li>)}</ul></details>}</div>;
}
