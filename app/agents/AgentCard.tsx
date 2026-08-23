import Link from "next/link";
import { agentMarks } from "./AgentMarks";
import type { AgentDefinition } from "./agent-library-data";
import styles from "./agent-library.module.css";
export default function AgentCard({ agent }: { agent: AgentDefinition }) {
  const Mark = agentMarks[agent.mark];
  return (
    <article>
      <Link className={styles.card} href={agent.href} aria-label={`Explore ${agent.name}`}>
        <span className={`${styles.markField} ${styles[`tone${agent.tone}`]}`} aria-hidden="true">
          <Mark className={styles.mark} />
        </span>
        <h3>{agent.name}</h3>
      </Link>
    </article>
  );
}
