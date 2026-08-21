import { agentGlyphs } from "./AgentGlyphs";
import type { AgentDefinition } from "./agent-library-data";
import styles from "./agent-library.module.css";
export default function AgentCard({ agent }: { agent: AgentDefinition }) { const Glyph = agentGlyphs[agent.glyph]; return <article className={styles.card}><div className={`${styles.glyphField} ${styles[`tone${agent.tone}`]}`}><Glyph className={styles.glyph} /></div><h3>{agent.name}</h3></article>; }
