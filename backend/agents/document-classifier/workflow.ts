export const DOCUMENT_CLASSIFIER_WORKFLOW = {
  agent: "document_classifier", nodes: ["file_received", "document_inspection", "classification", "confidence_check", "routing"],
  edges: [["file_received", "document_inspection"], ["document_inspection", "classification"], ["classification", "confidence_check"], ["confidence_check", "routing"]],
} as const;
export type WorkflowNode = (typeof DOCUMENT_CLASSIFIER_WORKFLOW.nodes)[number];
export type ExecutionStep = { node: WorkflowNode; status: "completed" | "failed" };
export const completedTrace = (): ExecutionStep[] => DOCUMENT_CLASSIFIER_WORKFLOW.nodes.map((node) => ({ node, status: "completed" }));
