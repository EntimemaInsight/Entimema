import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { graphBoundary, graphEdges, graphNodes, relatedEdges } from "../../app/labs/decision-graph-data";

test("eight distinct responsibilities have concise static descriptions", () => {
  assert.deepEqual(graphNodes.map(n => n.label), ["Evidence", "Claim", "Hypothesis", "Unknown", "Rule", "Model", "Human Judgment", "Decision"]);
  assert.equal(new Set(graphNodes.map(n => n.id)).size, 8);
  for (const node of graphNodes) {
    const words = node.description.split(/\s+/).length;
    assert.ok(words >= 12 && words <= 30, node.label);
  }
  for (const edge of graphEdges) {
    assert.ok(graphNodes.some(n => n.id === edge.from));
    assert.ok(graphNodes.some(n => n.id === edge.to));
    assert.notEqual(edge.from, edge.to);
  }
});
test("support is not identity and a hypothesis is not a fact", () => {
  assert.ok(graphEdges.some(e => e.from === "evidence" && e.to === "claim" && e.label === "supports / challenges"));
  assert.match(graphNodes.find(n => n.id === "claim")!.description, /not automatically a fact/);
  assert.match(graphNodes.find(n => n.id === "hypothesis")!.description, /does not establish it as fact/);
});
test("unknowns do not automatically turn into assumptions or hypotheses", () => {
  assert.equal(graphEdges.some(e => e.from === "unknown" && e.to === "hypothesis"), false);
  const unknown = graphNodes.find(n => n.id === "unknown")!;
  assert.match(unknown.description, /stays explicit.*documented assumption/);
  assert.match(unknown.detail, /does not automatically become an assumption or a hypothesis/);
  assert.ok(graphEdges.some(e => e.from === "unknown" && e.to === "human"));
});
test("model and rule retain independent responsibilities and review paths", () => {
  assert.match(graphNodes.find(n => n.id === "model")!.description, /Interprets, estimates or classifies/);
  assert.match(graphNodes.find(n => n.id === "rule")!.description, /Tests a defined calculation, condition or boundary/);
  for (const from of ["rule", "model"]) assert.ok(graphEdges.some(e => e.from === from && e.to === "human"));
  assert.equal(graphEdges.some(e => e.from === "model" && e.to === "decision" && e.kind === "reasoning"), false);
  assert.ok(graphEdges.some(e => e.from === "human" && e.to === "decision" && e.label === "informs"));
});
test("decision retains evidence, interpretation, controls and judgement as references", () => {
  const lineage = graphEdges.filter(e => e.kind === "lineage");
  assert.ok(lineage.every(e => e.from === "decision"));
  assert.deepEqual(lineage.map(e => e.to), ["evidence", "model", "rule", "human"]);
  assert.match(graphBoundary, /not a map of implemented Income Statement v1 features/);
});
test("selection includes only incident edges, not a fabricated automatic chain", () => {
  assert.deepEqual(relatedEdges("model").map(e => e.id), ["investigate", "interpret", "retain-model"]);
  assert.equal(relatedEdges("unknown").some(e => e.to === "decision"), false);
});
test("graph is an isolated selection component at the existing method transition", () => {
  const page = readFileSync("app/labs/page.tsx", "utf8");
  const graph = readFileSync("app/labs/DecisionGraph.tsx", "utf8");
  assert.doesNotMatch(page, /use client/);
  assert.ok(page.indexOf("<DecisionGraph />") > page.indexOf('id="investigation-method"'));
  assert.ok(page.indexOf("<DecisionGraph />") < page.indexOf('id="applied-system"'));
  assert.match(graph, /aria-pressed/);
  assert.match(graph, /onFocus/);
  assert.match(graph, /role="status"/);
  assert.doesNotMatch(graph, /useEffect|fetch\(|requestAnimationFrame|<canvas|setInterval/);
});
