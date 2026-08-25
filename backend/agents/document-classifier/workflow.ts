export const DOCUMENT_CLASSIFIER_WORKFLOW = {
  agent: "document_classifier",
  nodes: ["file_received", "fingerprint", "local_classification", "ai_fallback", "confidence_check", "routing"],
  edges: [["file_received", "fingerprint"], ["fingerprint", "local_classification"], ["local_classification", "ai_fallback"], ["ai_fallback", "confidence_check"], ["confidence_check", "routing"]],
} as const;
export type WorkflowNode = (typeof DOCUMENT_CLASSIFIER_WORKFLOW.nodes)[number];
export type ExecutionStep = { node: WorkflowNode; status: "completed" | "failed" | "skipped" };
export function executionTrace(aiCalled: boolean, fingerprintFallback = false): ExecutionStep[] {
  return DOCUMENT_CLASSIFIER_WORKFLOW.nodes.map((node) => {
    if (fingerprintFallback && node === "fingerprint") return { node, status: "failed" };
    if (fingerprintFallback && node === "local_classification") return { node, status: "skipped" };
    if (node === "ai_fallback" && !aiCalled) return { node, status: "skipped" };
    return { node, status: "completed" };
  });
}