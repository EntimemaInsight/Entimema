import type { DecisionMap, LabScenario, LabSnapshot } from "./types";

const evidence = (id: string, proposition: string, evidence_type = "RETRIEVED") => ({ id, proposition, evidence_type, source: "Deterministic lab fixture" });
const map = (nodes: DecisionMap["nodes"], edges: DecisionMap["edges"]): DecisionMap => ({ nodes, edges });

function snapshot(overrides: Partial<LabSnapshot["projection"]>, stage = "ANALYSIS_READY"): LabSnapshot {
  const projection: LabSnapshot["projection"] = {
    declared_problem: "We need to understand the decision.",
    operational_problem: "Determine the evidence-bound drivers relevant to the target decision.",
    problem_status: stage,
    reported_claims: [], validated_evidence: [], unknowns: [], active_hypotheses: [], contradictions: [],
    epistemic_verdict: "CONDITIONALLY_VALID",
    epistemic_veto: { active: false, verdict: "CONDITIONALLY_VALID", blocking_reason: null, contradiction_ids: [], unknown_ids: [], required_next_action: "PROCEED" },
    routing_plan: { plan_type: "SINGLE_AGENT", ready: true }, active_agents: [], validated_agent_findings: [],
    reconciliation_status: "NOT_REQUIRED", reconciliation: [], final_recommendations: [], unresolved_items: [],
    decision_readiness: "ANALYSIS_READY", human_decision_required: false, decision_map: map([], []),
    ...overrides,
  };
  return { stage, projection, synthesis: null, conversation: [] };
}

const wcEvidence = [
  { ...evidence("e-ar", "Accounts receivable increased by €4.8m."), source: { artifact_id: "artifact-pnl", extraction_id: "extract-25", location: { sheet: "P&L", cell: "F27" } }, source_filename: "FY2025_PnL.xlsx", formula: "=SUM(F10:F26)" },
  evidence("e-inv", "Inventory increased by €0.3m."),
  evidence("e-ap", "Accounts payable remained broadly stable."),
];
const wcMap = map(
  [
    { id: "p-wc", node_type: "PROBLEM", label: "Cash conversion deterioration" },
    { id: "c-profit", node_type: "CLAIM", label: "Company is highly profitable" },
    ...wcEvidence.map((item) => ({ id: item.id, node_type: "EVIDENCE" as const, label: item.proposition })),
    { id: "u-capex", node_type: "UNKNOWN", label: "CapEx during the period", detail: "Needed to explain total cash movement.", metadata: { materiality: "HIGH", clarification: "What was capital expenditure during the period?" } },
    { id: "h-ar", node_type: "HYPOTHESIS", label: "Receivables growth absorbed operating cash", metadata: { status: "ACTIVE", support: 2, against: 1 } },
    { id: "FIN_WORKING_CAPITAL_001", node_type: "AGENT", label: "Working Capital", metadata: { domain: "FINANCE", task: "Working-capital movement" } },
    { id: "f-wc", node_type: "FINDING", label: "Operating working capital absorbed €5.1m" },
    { id: "r-wc", node_type: "RECOMMENDATION", label: "Review receivables collection actions", metadata: { evidence_path: ["e-ar", "e-inv", "e-ap"], assumptions: [], unknowns: ["u-capex"] } },
  ],
  [
    { source_id: "c-profit", target_id: "p-wc", edge_type: "SUPPORTS" },
    { source_id: "e-ar", target_id: "h-ar", edge_type: "SUPPORTS" },
    { source_id: "p-wc", target_id: "FIN_WORKING_CAPITAL_001", edge_type: "ROUTES_TO" },
    { source_id: "FIN_WORKING_CAPITAL_001", target_id: "f-wc", edge_type: "PRODUCES" },
    { source_id: "r-wc", target_id: "f-wc", edge_type: "DEPENDS_ON" },
    { source_id: "u-capex", target_id: "r-wc", edge_type: "REQUIRES" },
  ],
);

const workingCapital: LabScenario = {
  id: "working-capital", label: "Working Capital", prompt: "We are profitable but always short of cash.",
  snapshots: [
    snapshot({ declared_problem: "We are profitable but always short of cash.", operational_problem: null, reported_claims: [{ id: "c-profit", proposition: "Company is highly profitable.", source: "User", status: "REPORTED" }], unknowns: [{ id: "u-period", variable: "Analysis period", why_needed: "Comparable balances require a defined period.", materiality: "HIGH", clarification_target: "Which reporting period should be analysed?" }], decision_readiness: "BLOCKED", routing_plan: { plan_type: "NO_ADMISSIBLE_AGENT", ready: false }, epistemic_verdict: "INSUFFICIENT_EVIDENCE", epistemic_veto: { active: true, verdict: "INSUFFICIENT_EVIDENCE", blocking_reason: "Material period and balance inputs remain unknown.", contradiction_ids: [], unknown_ids: ["u-period"], required_next_action: "REQUEST_EVIDENCE" }, decision_map: map([], []) }, "PROBLEM_FORMATION"),
    snapshot({ declared_problem: "We are profitable but always short of cash.", operational_problem: "Determine the principal drivers of cash conversion deterioration.", reported_claims: [{ id: "c-profit", proposition: "Company is highly profitable.", source: "User", status: "REPORTED" }], validated_evidence: wcEvidence, unknowns: [{ id: "u-capex", variable: "CapEx during the period", why_needed: "Needed to explain total cash movement.", materiality: "HIGH", clarification_target: "What was capital expenditure during the period?" }], active_hypotheses: [{ id: "h-ar", proposition: "Receivables growth is absorbing operating cash.", status: "ACTIVE", support: 2, against: 1 }], active_agents: [{ id: "FIN_WORKING_CAPITAL_001", label: "Working Capital", domain: "Finance", task: "Working-capital movement", status: "ACTIVE" }], decision_map: wcMap }, "ANALYSIS_READY"),
    { ...snapshot({ declared_problem: "We are profitable but always short of cash.", operational_problem: "Determine the principal drivers of cash conversion deterioration.", reported_claims: [{ id: "c-profit", proposition: "Company is highly profitable.", source: "User", status: "REPORTED" }], validated_evidence: wcEvidence, unknowns: [{ id: "u-capex", variable: "CapEx during the period", why_needed: "Needed to explain total cash movement.", materiality: "HIGH", clarification_target: "What was capital expenditure during the period?" }], active_hypotheses: [{ id: "h-ar", proposition: "Receivables growth is absorbing operating cash.", status: "ACTIVE", support: 2, against: 1 }], active_agents: [{ id: "FIN_WORKING_CAPITAL_001", label: "Working Capital", domain: "Finance", task: "Working-capital movement", status: "COMPLETE" }], validated_agent_findings: [{ id: "f-wc", agent_id: "FIN_WORKING_CAPITAL_001", proposition: "Operating working capital absorbed €5.1m.", type: "CALCULATED", limitations: ["Financing and investing cash flows remain unresolved."] }], final_recommendations: [{ id: "r-wc", proposition: "Review receivables collection actions before changing financing policy.", supporting_finding_ids: ["f-wc"], evidence_ids: ["e-ar", "e-inv", "e-ap"], assumption_ids: [], decision_severity: "MEDIUM", reversibility: "REVERSIBLE" }], decision_readiness: "CONDITIONAL", human_decision_required: true, decision_map: wcMap }, "DECISION_READY"), synthesis: { what_we_know: ["Receivables and inventory increased while payables were stable."], what_we_infer: ["Operating working capital absorbed €5.1m."], what_remains_unknown: ["CapEx, debt-service payments, and owner distributions."], what_matters_for_decision: ["Working-capital action cannot explain total cash movement alone."], recommended_actions: ["Review receivables collection actions."], what_would_change_recommendation: ["Material investing or financing cash flows."], epistemic_status: "CONDITIONALLY_VALID" } },
  ],
};

const mixedRisk = snapshot({ declared_problem: "Payment behaviour improved, but liquidity remains under pressure.", operational_problem: "Assess observable credit-risk dimensions without estimating probability of default.", validated_evidence: [evidence("e-pay", "Payment behaviour is improving.", "REPORTED_OBSERVATION"), evidence("e-liq", "Liquidity headroom is deteriorating.", "CALCULATED")], active_agents: [{ id: "CR_DIAGNOSTIC_001", label: "Credit Risk Diagnostic", domain: "Credit Risk", task: "Dimension-specific diagnostic", status: "COMPLETE" }], validated_agent_findings: [{ id: "f-pay", agent_id: "CR_DIAGNOSTIC_001", proposition: "Payment behaviour is improving.", type: "VALIDATED FINDING", limitations: ["No aggregate score."] }, { id: "f-liq", agent_id: "CR_DIAGNOSTIC_001", proposition: "Liquidity is deteriorating.", type: "VALIDATED FINDING", limitations: ["No PD estimate."] }], decision_readiness: "CONDITIONAL", human_decision_required: true, decision_map: map([{ id: "e-pay", node_type: "EVIDENCE", label: "Payment behaviour improving" }, { id: "e-liq", node_type: "EVIDENCE", label: "Liquidity deteriorating" }, { id: "f-pay", node_type: "FINDING", label: "Payment behaviour improving" }, { id: "f-liq", node_type: "FINDING", label: "Liquidity deteriorating" }], [{ source_id: "e-pay", target_id: "f-pay", edge_type: "SUPPORTS" }, { source_id: "e-liq", target_id: "f-liq", edge_type: "SUPPORTS" }]) }, "AGENT_RESULTS");

const reconciliation = snapshot({ declared_problem: "The subledger does not agree with the general ledger.", operational_problem: "Reconcile exact canonical keys and isolate traceable variances.", validated_evidence: [evidence("e-a", "Source A: INV-104 = €420k"), evidence("e-b", "Source B: INV-104 = €340k")], active_agents: [{ id: "ENG_RECONCILIATION_001", label: "Reconciliation", domain: "Engineering", task: "Exact-key comparison", status: "COMPLETE" }], validated_agent_findings: [{ id: "f-rec", agent_id: "ENG_RECONCILIATION_001", proposition: "INV-104 has an €80k value mismatch; INV-119 is missing in Source B.", type: "RECONCILIATION FINDING", limitations: ["Exact keys only; no fuzzy matching."] }], reconciliation_status: "COMPLETE", reconciliation: [{ id: "rec-1", left: "Source A €420k", right: "Source B €340k", classification: "VALUE MISMATCH", true_conflict: false }], decision_readiness: "DECISION_READY", human_decision_required: true, final_recommendations: [{ id: "r-rec", proposition: "Resolve INV-104 and INV-119 before relying on the ledger total.", supporting_finding_ids: ["f-rec"], evidence_ids: ["e-a", "e-b"], assumption_ids: [], decision_severity: "MEDIUM", reversibility: "REVERSIBLE" }], decision_map: map([{ id: "e-a", node_type: "EVIDENCE", label: "Source A" }, { id: "e-b", node_type: "EVIDENCE", label: "Source B" }, { id: "ENG_RECONCILIATION_001", node_type: "AGENT", label: "Reconciliation" }, { id: "f-rec", node_type: "FINDING", label: "€80k mismatch" }, { id: "r-rec", node_type: "RECOMMENDATION", label: "Resolve unmatched items" }], [{ source_id: "ENG_RECONCILIATION_001", target_id: "f-rec", edge_type: "PRODUCES" }, { source_id: "r-rec", target_id: "f-rec", edge_type: "DEPENDS_ON" }]) }, "DECISION_READY");

const crossDomain = snapshot({ declared_problem: "Can we meet near-term and 12-month liquidity obligations?", operational_problem: "Separate current cash-conversion capacity from stressed 12-month debt-service resilience.", validated_evidence: [evidence("e-current", "Current liquidity coverage is adequate.", "CALCULATED"), evidence("e-stress", "12-month stressed debt service is weak.", "MODEL_PRODUCED")], active_agents: [{ id: "FIN_WORKING_CAPITAL_001", label: "Working Capital", domain: "Finance", task: "Current liquidity", status: "COMPLETE" }, { id: "CR_DIAGNOSTIC_001", label: "Credit Risk Diagnostic", domain: "Credit Risk", task: "12-month stress", status: "COMPLETE" }], validated_agent_findings: [{ id: "f-current", agent_id: "FIN_WORKING_CAPITAL_001", proposition: "Current liquidity is adequate.", type: "VALIDATED FINDING", limitations: ["Current horizon only."] }, { id: "f-stress", agent_id: "CR_DIAGNOSTIC_001", proposition: "12-month stressed debt-service resilience is weak.", type: "VALIDATED FINDING", limitations: ["Stressed scenario."] }], reconciliation_status: "DIFFERENT HORIZON", reconciliation: [{ id: "rec-horizon", left: "Current liquidity adequate", right: "12-month stressed resilience weak", classification: "DIFFERENT HORIZON · NO TRUE CONFLICT", true_conflict: false }], decision_readiness: "CONDITIONAL", human_decision_required: true, decision_map: map([{ id: "f-current", node_type: "FINDING", label: "Current liquidity adequate" }, { id: "f-stress", node_type: "FINDING", label: "12-month resilience weak" }], []) }, "AGENT_RESULTS");

const veto = snapshot({ declared_problem: "The company is profitable.", operational_problem: "Resolve whether profitability refers to EBITDA or net result before proceeding.", reported_claims: [{ id: "c-prof", proposition: "Company is profitable.", source: "User", status: "REPORTED" }], validated_evidence: [evidence("e-loss", "Net result is -€1.2m.", "RETRIEVED")], contradictions: [{ id: "x-profit", proposition_a: "Company is profitable.", proposition_b: "Net result is -€1.2m.", issue: "Possible EBITDA vs Net Profit definition mismatch", status: "OPEN" }], epistemic_verdict: "CONTRADICTED", epistemic_veto: { active: true, verdict: "CONTRADICTED", blocking_reason: "Profitability definitions are not aligned.", contradiction_ids: ["x-profit"], unknown_ids: [], required_next_action: "RESOLVE_CONTRADICTION" }, routing_plan: { plan_type: "NO_ADMISSIBLE_AGENT", ready: false }, decision_readiness: "BLOCKED", decision_map: map([{ id: "c-prof", node_type: "CLAIM", label: "Company is profitable" }, { id: "e-loss", node_type: "EVIDENCE", label: "Net result -€1.2m" }, { id: "x-profit", node_type: "CONTRADICTION", label: "Profitability definition mismatch" }], [{ source_id: "e-loss", target_id: "c-prof", edge_type: "CONTRADICTS" }]) }, "BLOCKED");

function scenario(id: string, label: string, prompt: string, final: LabSnapshot): LabScenario {
  return { id, label, prompt, snapshots: [{ ...final, stage: "INITIAL", conversation: [{ role: "User", text: prompt }] }, final] };
}

export const labScenarios: LabScenario[] = [
  workingCapital,
  scenario("mixed-risk", "Credit Risk · Mixed Signals", "Payment behaviour improved, but liquidity deteriorated.", mixedRisk),
  scenario("reconciliation", "Reconciliation", "Why do the subledger and GL totals differ?", reconciliation),
  scenario("cross-domain", "Cross-Domain Liquidity", "Can we meet near-term and 12-month obligations?", crossDomain),
  scenario("veto", "Epistemic Veto", "The company is profitable, despite the reported loss.", veto),
];
