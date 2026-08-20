export type EpistemicVerdict =
  | "VALIDATED"
  | "CONDITIONALLY_VALID"
  | "INSUFFICIENT_EVIDENCE"
  | "CONTRADICTED"
  | "OUT_OF_SCOPE"
  | "FORBIDDEN_INFERENCE"
  | "TRACEABILITY_FAILURE";

export type DecisionReadiness = "BLOCKED" | "FORMATION_READY" | "ANALYSIS_READY" |
  "ANALYSIS_IN_PROGRESS" | "DECISION_SUPPORT_READY" | "CONDITIONAL" | "DECISION_READY";
export type DecisionMapNodeType =
  | "PROBLEM" | "CLAIM" | "EVIDENCE" | "UNKNOWN" | "HYPOTHESIS"
  | "CONTRADICTION" | "AGENT" | "FINDING" | "RECOMMENDATION";
export type DecisionMapEdgeType =
  | "SUPPORTS" | "CONTRADICTS" | "REQUIRES" | "ROUTES_TO" | "PRODUCES" | "DEPENDS_ON";

export interface EpistemicVetoView {
  active: boolean;
  verdict: EpistemicVerdict;
  blocking_reason: string | null;
  contradiction_ids: string[];
  unknown_ids: string[];
  required_next_action: string;
}

export interface DecisionMapNode {
  id: string;
  node_type: DecisionMapNodeType;
  label: string;
  detail?: string;
  metadata?: Record<string, string | number | string[]>;
}
export interface DecisionMapEdge { source_id: string; target_id: string; edge_type: DecisionMapEdgeType }
export interface DecisionMap { nodes: DecisionMapNode[]; edges: DecisionMapEdge[] }

export interface EvidenceView { id: string; proposition: string; evidence_type: string; source: string }
export interface ClaimView { id: string; proposition: string; source: string; status: string }
export interface UnknownView { id: string; variable: string; why_needed: string; materiality: string; clarification_target: string }
export interface HypothesisView { id: string; proposition: string; status: string; support: number; against: number }
export interface ContradictionView { id: string; proposition_a: string; proposition_b: string; issue: string; status: string }
export interface FindingView { id: string; agent_id: string; proposition: string; type: string; limitations: string[] }
export interface AgentModuleView { id: string; label: string; domain: string; task: string; status: string }
export interface ReconciliationView { id: string; left: string; right: string; classification: string; true_conflict: boolean }

export interface DecisionWorkspaceProjection {
  declared_problem: string | null;
  operational_problem: string | null;
  problem_status: string;
  workspace_phase?: string;
  blockers?: string[];
  reported_claims: ClaimView[];
  validated_evidence: EvidenceView[];
  unknowns: UnknownView[];
  active_hypotheses: HypothesisView[];
  contradictions: ContradictionView[];
  epistemic_verdict: EpistemicVerdict;
  epistemic_veto: EpistemicVetoView;
  routing_plan: { plan_type: string; ready: boolean };
  active_agents: AgentModuleView[];
  validated_agent_findings: FindingView[];
  reconciliation_status: string;
  reconciliation: ReconciliationView[];
  final_recommendations: RecommendationView[];
  unresolved_items: string[];
  decision_readiness: DecisionReadiness;
  human_decision_required: boolean;
  decision_map: DecisionMap;
}

export interface RecommendationView {
  id: string; proposition: string; supporting_finding_ids: string[]; evidence_ids: string[];
  assumption_ids: string[]; decision_severity: string; reversibility: string;
}
export interface UserSynthesisView {
  what_we_know: string[]; what_we_infer: string[]; what_remains_unknown: string[];
  what_matters_for_decision: string[]; recommended_actions: string[];
  what_would_change_recommendation: string[]; epistemic_status: EpistemicVerdict;
}
export interface ConversationTurn { role: "User" | "Entimema"; text: string }
export interface ConversationTurnView { turn_id: string; actor: "USER" | "ENTIMEMA"; text: string; timestamp: string; action_type?: string | null; related_state_ids: string[]; status: string }
export interface RuntimeError { code: string; message: string; retryable: boolean }
export interface LiveMessageResponse {
  session_id: string; accepted_turn_id: string; assistant_message?: string | null;
  next_best_question?: string | null; dialogue_state: string; problem_state_version: number;
  workspace_projection: DecisionWorkspaceProjection; conversation: ConversationTurnView[];
  runtime_actions: string[]; epistemic_verdict: EpistemicVerdict;
  decision_readiness: DecisionReadiness; execution_summary: Record<string, unknown>;
  errors: RuntimeError[]; warnings: string[];
}
export interface LabSnapshot {
  stage: string; projection: DecisionWorkspaceProjection; synthesis: UserSynthesisView | null;
  conversation: ConversationTurn[];
}
export interface LabScenario { id: string; label: string; prompt: string; snapshots: LabSnapshot[] }
