export const graphNodes = [
  { id: "evidence", label: "Evidence", description: "Source information that can support or challenge a claim; its origin and limitations remain available for inspection.", detail: "A source supports a claim only within what it actually establishes. Contradictory evidence must remain visible." },
  { id: "claim", label: "Claim", description: "An assertion to assess against evidence. It may motivate a hypothesis, but is not automatically a fact.", detail: "Keep the assertion separate from its support. Agreement with a model output does not establish the claim." },
  { id: "hypothesis", label: "Hypothesis", description: "A proposition to investigate or test, including through a model. Interpretation alone does not establish it as fact.", detail: "Specify what would support or challenge the proposition before treating an estimate as evidence for it." },
  { id: "unknown", label: "Unknown", description: "Missing or unresolved information stays explicit until clarified or addressed through a documented assumption; material uncertainty may require review.", detail: "An unknown does not automatically become an assumption or a hypothesis. Clarify it, document its treatment or retain it as unresolved." },
  { id: "rule", label: "Rule", description: "Tests a defined calculation, condition or boundary. A passed control establishes only what that particular check covers.", detail: "Arithmetic reconciliation can pass while an interpretation remains wrong. Controls and interpretation have different responsibilities." },
  { id: "model", label: "Model", description: "Interprets, estimates or classifies within stated limits. Its output neither owns deterministic financial control nor constitutes the final decision.", detail: "Model-assisted interpretation can expose uncertainty or conflict with a control. Consequential exceptions may require professional review." },
  { id: "human", label: "Human Judgment", description: "Assesses material ambiguity, exceptions and consequences, documenting the basis for resolution or the need for further investigation.", detail: "Review is a responsibility, not a ceremonial approval. Judgement may request clarification or withhold a decision when support is insufficient." },
  { id: "decision", label: "Decision", description: "Records an accountable conclusion while retaining the relevant evidence, interpretation, controls and professional judgement behind it.", detail: "The retained path makes a conclusion open to review. Neither a model estimate nor a passed rule is the decision itself." },
] as const;
export type GraphNodeId = typeof graphNodes[number]["id"];
export type GraphEdge = { id: string; from: GraphNodeId; to: GraphNodeId; label: string; kind: "reasoning" | "lineage" };
export const graphEdges: readonly GraphEdge[] = [
  { id: "support", from: "evidence", to: "claim", label: "supports / challenges", kind: "reasoning" },
  { id: "propose", from: "claim", to: "hypothesis", label: "may generate", kind: "reasoning" },
  { id: "investigate", from: "hypothesis", to: "model", label: "may be investigated through", kind: "reasoning" },
  { id: "clarify", from: "unknown", to: "human", label: "may require clarification or review", kind: "reasoning" },
  { id: "control", from: "rule", to: "human", label: "may surface a control exception", kind: "reasoning" },
  { id: "interpret", from: "model", to: "human", label: "may surface material ambiguity", kind: "reasoning" },
  { id: "inform", from: "human", to: "decision", label: "informs", kind: "reasoning" },
  { id: "retain-evidence", from: "decision", to: "evidence", label: "retains evidence", kind: "lineage" },
  { id: "retain-model", from: "decision", to: "model", label: "retains interpretation", kind: "lineage" },
  { id: "retain-rule", from: "decision", to: "rule", label: "retains controls", kind: "lineage" },
  { id: "retain-human", from: "decision", to: "human", label: "retains judgement", kind: "lineage" },
];
export const graphLabel = (id: GraphNodeId) => graphNodes.find(node => node.id === id)!.label;
export const relatedEdges = (id: GraphNodeId) => graphEdges.filter(edge => edge.from === id || edge.to === id);
export const edgeText = (edge: GraphEdge) => `${graphLabel(edge.from)} → ${edge.label} → ${graphLabel(edge.to)}`;
export const graphBoundary = "This is a methodological architecture, not a map of implemented Income Statement v1 features. The applied-system example below defines that workflow’s actual scope.";
