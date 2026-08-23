import Link from "next/link";
import { agentGlyphs } from "./AgentGlyphs";
import type { AgentDefinition } from "./agent-library-data";
import styles from "./agent-library.module.css";
export default function AgentCard({ agent }: { agent: AgentDefinition }) {
  const Glyph = agentGlyphs[agent.glyph];
  return (
    <article>
      <Link className={styles.card} href={agent.href} aria-label={`Explore ${agent.name}`}>
        <span className={`${styles.glyphField} ${styles[`tone${agent.tone}`]}`} aria-hidden="true">
          <Glyph className={styles.glyph} />
        </span>
        <h3>{agent.name}</h3>
      </Link>
    </article>
  );
}
