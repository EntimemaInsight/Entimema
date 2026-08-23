import AgentCard from "../AgentCard";
import { agentMarks } from "../AgentMarks";
import { agents } from "../agent-library-data";
import styles from "./eam-family-sheet.module.css";

// Temporary development surface. Import into a local-only page when conducting
// an EAM family review; it is intentionally not connected to production routing.
export default function EamFamilySheet() {
  return <main className={styles.sheet}>
    <header><span>ENTIMEMA / EAM–01</span><h1>Analytical Miniatures family sheet</h1><p>Silhouette · analytical architecture · decision signal</p></header>
    <section aria-labelledby="large-marks"><h2 id="large-marks">A — mark only / close inspection</h2><div className={styles.largeGrid}>
      {agents.map((agent) => { const Mark = agentMarks[agent.mark]; return <figure key={agent.id}><div className={`${styles.largeField} ${styles[`tone${agent.tone}`]}`}><Mark /></div><figcaption>{agent.name}</figcaption></figure>; })}
    </div></section>
    <section aria-labelledby="production-marks"><h2 id="production-marks">B — production tile / recognition</h2><div className={styles.productionGrid}>
      {agents.map((agent) => { const Mark = agentMarks[agent.mark]; return <figure key={agent.id}><div className={`${styles.productionField} ${styles[`tone${agent.tone}`]}`}><Mark /></div><figcaption>{agent.name}</figcaption></figure>; })}
    </div></section>
    <section className={styles.grayscale} aria-labelledby="grayscale-marks"><h2 id="grayscale-marks">C — grayscale / optical density</h2><div className={styles.productionGrid}>
      {agents.map((agent) => { const Mark = agentMarks[agent.mark]; return <figure key={agent.id}><div className={styles.productionField}><Mark /></div><figcaption>{agent.name}</figcaption></figure>; })}
    </div></section>
    <section aria-labelledby="card-marks"><h2 id="card-marks">D — full card / production context</h2><div className={styles.cardGrid}>{agents.map((agent) => <AgentCard agent={agent} key={agent.id} />)}</div></section>
  </main>;
}
