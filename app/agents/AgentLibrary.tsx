"use client";

import { useMemo, useState } from "react";
import { agentCategories, agents } from "./agent-library-data";
import AgentCard from "./AgentCard";
import styles from "./agent-library.module.css";

export default function AgentLibrary() {
  const [active, setActive] = useState<(typeof agentCategories)[number]>("All");
  const visible = useMemo(() => active === "All" ? agents : agents.filter((agent) => agent.categories.includes(active)), [active]);

  return (
    <section className={styles.library} aria-labelledby="agent-library-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="agent-library-title">
            <span>Decision intelligence,</span>{" "}
            <span className={styles.headingEmphasis}>deployed.</span>
          </h2>
        </header>
        <nav className={styles.filters} aria-label="Agent categories">
          {agentCategories.map((category) => (
            <button key={category} type="button" className={active === category ? styles.activeFilter : styles.filter} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>
          ))}
        </nav>
        <div className={styles.grid} aria-live="polite" aria-label={`${visible.length} agents shown`}>
          {visible.map((agent) => (
            <AgentCard agent={agent} key={agent.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
