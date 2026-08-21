"use client";

import { useMemo, useState } from "react";
import { agentCategories, agents } from "./agent-library-data";
import AgentVisual from "./AgentVisual";
import styles from "./agent-library.module.css";

export default function AgentLibrary() {
  const [active, setActive] = useState<(typeof agentCategories)[number]>("All");
  const visible = useMemo(() => active === "All" ? agents : agents.filter((agent) => agent.categories.includes(active)), [active]);

  return (
    <section className={styles.library} aria-labelledby="agent-library-title">
      <div className={`site-container ${styles.inner}`}>
        <h2 id="agent-library-title">Decision intelligence, deployed.</h2>
        <div className={styles.filters} aria-label="Filter agents by business use case">
          {agentCategories.map((category) => (
            <button key={category} type="button" className={active === category ? styles.activeFilter : styles.filter} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>
          ))}
        </div>
        <div className={styles.grid} aria-live="polite">
          {visible.map((agent) => (
            <article className={styles.card} key={agent.id}>
              <AgentVisual kind={agent.visual} label={`${agent.name} abstract visual`} />
              <h3>{agent.name}</h3>
              <p>{agent.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
