export type AgentLog = { run_id: string; agent: "document_classifier"; event: string; file_type?: string; file_size?: number; document_family?: string | null; document_type?: string | null; confidence?: number; routing_result?: string; duration_ms?: number; error_code?: string };
export function logAgentEvent(level: "info" | "error", entry: AgentLog) {
  const record = JSON.stringify({ timestamp: new Date().toISOString(), level, service: "entimema-agent-api", ...entry });
  if (level === "error") console.error(record); else console.info(record);
}
