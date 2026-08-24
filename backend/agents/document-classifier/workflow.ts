export const DOCUMENT_CLASSIFIER_WORKFLOW = {
  agent: "document_classifier",
  nodes: ["file_received", "fingerprint", "local_classification", "ai_fallback", "confidence_check", "routing"],
  edges: [["file_received", "fingerprint"], ["fingerprint", "local_classification"], ["local_classification", "ai_fallback"], ["ai_fallback", "confidence_check"], ["confidence_check", "routing"]],
} as const;
export type WorkflowNode = (typeof DOCUMENT_CLASSIFIER_WORKFLOW.nodes)[number];
export type ExecutionStep = { node: WorkflowNode; status: "completed" | "failed" | "skipped" };
export function executionTrace(aiCalled: boolean): ExecutionStep[] {
  return DOCUMENT_CLASSIFIER_WORKFLOW.nodes.map((node) => ({ node, status: node === "ai_fallback" && !aiCalled ? "skipped" : "completed" }));
}
