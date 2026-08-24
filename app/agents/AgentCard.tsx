import Image from "next/image";
import { agentMarks } from "./AgentMarks";
import type { AgentDefinition } from "./agent-library-data";
import styles from "./agent-library.module.css";
export default function AgentCard({ agent, onSelect = () => undefined, selected = false }: { agent: AgentDefinition; onSelect?: (agent: AgentDefinition) => void; selected?: boolean }) {
  const Mark = agentMarks[agent.mark];
  return (
    <article>
      <button aria-controls="active-agent-reference" aria-pressed={selected} className={`${styles.card} ${selected ? styles.selectedCard : ""}`} onClick={() => onSelect(agent)} type="button">
        {agent.signatureImage ? (
          <span className={styles.signatureField} aria-hidden="true">
            <Image className={styles.signatureImage} src={agent.signatureImage} alt="" fill sizes="44px" />
          </span>
        ) : (
          <span className={`${styles.markField} ${styles[`tone${agent.tone}`]}`} aria-hidden="true">
            <Mark className={styles.mark} />
          </span>
        )}
        <h3>{agent.name}</h3>
      </button>
    </article>
  );
}
