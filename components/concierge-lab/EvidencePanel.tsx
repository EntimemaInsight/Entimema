"use client";

import { useRef, useState } from "react";
import styles from "./concierge-lab.module.css";
import type { ArtifactView } from "./types";

export default function EvidencePanel({ sessionId, artifacts, onComplete }: { sessionId: string; artifacts: ArtifactView[]; onComplete: (payload: Record<string, unknown>) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  async function upload(file: File) {
    setStatus(`Uploading ${file.name}…`);
    const response = await fetch(`/api/concierge/sessions/${encodeURIComponent(sessionId)}/evidence`, { method: "POST", body: file, headers: { "content-type": file.type || "application/octet-stream", "x-filename": file.name, "x-command-id": crypto.randomUUID() } });
    const payload = await response.json();
    if (!response.ok) { setStatus(payload.validation_error ?? payload.errors?.[0]?.message ?? "Evidence rejected."); return; }
    onComplete(payload); setStatus("Extraction complete. Candidates await validation.");
  }
  return <section className={styles.evidencePanel} aria-label="Evidence intake"><div><strong>Evidence</strong><button type="button" onClick={() => input.current?.click()}>+Evidence</button></div><input ref={input} className={styles.srOnly} type="file" accept=".pdf,.xlsx,.csv" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />{status && <p role="status">{status}</p>}<ul>{artifacts.map((artifact) => <li key={artifact.id}><span>{artifact.filename}</span><small>{artifact.status} · {(artifact.byte_size / 1024).toFixed(1)} KB</small></li>)}</ul></section>;
}
