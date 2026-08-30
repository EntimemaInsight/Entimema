"use client";

import { useId, useState } from "react";
import { graphBoundary, graphEdges, graphLabel, graphNodes, relatedEdges, type GraphEdge, type GraphNodeId } from "./decision-graph-data";
import styles from "./DecisionGraph.module.css";

// The only client behaviour is local selection. All concepts and relationships render on the server.
export default function DecisionGraph() {
  const [selected, setSelected] = useState<GraphNodeId | null>(null);
  const figureId = useId();
  const incident = selected ? relatedEdges(selected) : [];
  const related = new Set(incident.flatMap(edge => [edge.from, edge.to]));
  const state = (id: GraphNodeId) => selected === id ? "selected" : !selected || related.has(id) ? "related" : "quiet";
  const edgeState = (edge: GraphEdge) => !selected ? "neutral" : incident.includes(edge) ? "selected" : "quiet";

  function connector(edge: GraphEdge) {
    const diagonal = edge.id === "clarify" || edge.id === "interpret";
    const vertical = edge.id === "investigate" || edge.id === "control";
    const path = diagonal ? edge.id === "clarify" ? "M 2 2 L 98 98" : "M 98 2 L 2 98" : vertical ? "M 50 2 L 50 94" : "M 2 50 L 94 50";
    const markerId = `${figureId}-${edge.id}`;
    return <div key={edge.id} className={`${styles.edge} ${styles[edge.id]}`} data-edge={edge.id} data-state={edgeState(edge)}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs><marker id={markerId} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M 1 1 L 7 4 L 1 7" /></marker></defs>
        <path d={path} markerEnd={`url(#${markerId})`} vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={styles.edgeLabel}><span className={styles.srOnly}>{graphLabel(edge.from)} → </span>{edge.label}{!vertical && !diagonal && <span className={styles.direction} aria-hidden="true">→</span>}<span className={styles.srOnly}> → {graphLabel(edge.to)}</span></span>
    </div>;
  }

  return <figure className={styles.figure} id="decision-architecture" aria-labelledby={`${figureId}-heading`} aria-describedby={`${figureId}-description`} onKeyDown={event => { if (event.key === "Escape") setSelected(null); }}>
    <header className={styles.intro}>
      <p className="editorial-eyebrow">Decision architecture</p>
      <h3 className="editorial-headline-lg" id={`${figureId}-heading`}>A decision is more than a model output.</h3>
      <p className="editorial-body-md" id={`${figureId}-description`}>Evidence, interpretation, deterministic control and professional judgement have different responsibilities. Follow the relationships; they are not a single automatic chain.</p>
    </header>
    <p className={styles.instruction}>Select or focus a concept to inspect its connections. Every responsibility is visible without interaction.</p>
    <div className={styles.canvas} role="group" aria-label="Decision concepts and their relationships">
      {graphNodes.map(node => <div className={`${styles.nodeCell} ${styles[node.id]}`} key={node.id}>
        <button type="button" className={styles.node} data-node={node.id} data-state={state(node.id)} aria-pressed={selected === node.id} aria-controls={`${figureId}-detail`} aria-label={node.label} aria-describedby={`${figureId}-${node.id}-description`} onFocus={() => setSelected(node.id)} onClick={() => setSelected(node.id)}>
          <span className={styles.nodeTitle}><strong>{node.label}</strong><span className={styles.selectionMark} aria-hidden="true">{selected === node.id ? "●" : "○"}</span></span>
          <span className={styles.nodeDescription} id={`${figureId}-${node.id}-description`}>{node.description}</span>
        </button>
        <div className={styles.mobileRelations}>{graphEdges.filter(edge => edge.from === node.id && edge.kind === "reasoning").map(edge => <p key={edge.id} data-mobile-edge={edge.id} data-state={edgeState(edge)}>{edge.label} <span aria-hidden="true">→</span> <strong>{graphLabel(edge.to)}</strong></p>)}</div>
      </div>)}
      {graphEdges.filter(edge => edge.kind === "reasoning").map(connector)}
      <p className={styles.parallelNote}>Separate responsibilities.<br />A model does not validate its own financial controls. An unresolved unknown need not become a hypothesis.</p>
    </div>
    <div className={styles.lineage} aria-label="Decision lineage">
      <p className="editorial-technical-label">Decision → retains the relevant path</p>
      <ul>{graphEdges.filter(edge => edge.kind === "lineage").map(edge => <li key={edge.id} data-edge={edge.id} data-state={edgeState(edge)}><span>{edge.label.replace("retains ", "")}</span><strong>{graphLabel(edge.to)}</strong></li>)}</ul>
      <p className="editorial-caption">These are retained references, not instructions to repeat the process. A model output is not the final decision.</p>
    </div>
    <div className={styles.detailShell}>
      <div className={styles.detailStack} id={`${figureId}-detail`} role="status" aria-live="polite" aria-atomic="true">
        <div className={styles.detail} data-visible={!selected} aria-hidden={Boolean(selected)}><p className="editorial-technical-label">Read the architecture</p><p>The upper branch separates a source, an assertion and a testable proposition. Unknowns remain separate. Interpretation and controls can each expose a review need; the decision keeps references to its relevant path.</p></div>
        {graphNodes.map(node => <div className={styles.detail} data-visible={selected === node.id} aria-hidden={selected !== node.id} key={node.id}>
          <p className="editorial-technical-label">{node.label} / responsibility</p><p>{node.detail}</p>
        </div>)}
      </div>
      <button type="button" className={styles.reset} onClick={() => setSelected(null)}>Reset emphasis</button>
    </div>
    <figcaption className={styles.boundary}>{graphBoundary}</figcaption>
  </figure>;
}
