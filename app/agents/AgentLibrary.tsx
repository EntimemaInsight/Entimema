"use client";

import { useMemo, useRef, useState } from "react";
import { DemoTrigger } from "@/components/DemoDiscovery";
import { agentMarks } from "./AgentMarks";
import { agentCategories, agents, type AgentCategory, type AgentDefinition } from "./agent-library-data";
import AgentCard from "./AgentCard";
import styles from "./agent-library.module.css";

export default function AgentLibrary() {
  const [active, setActive] = useState<(typeof agentCategories)[number]>("All");
  const [selected, setSelected] = useState<AgentDefinition | null>(null);
  const referenceRef = useRef<HTMLDivElement>(null);
  const visible = useMemo(() => active === "All" ? agents : agents.filter((agent) => agent.categories.includes(active)), [active]);

  function selectAgent(agent: AgentDefinition) {
    setSelected(agent);
    requestAnimationFrame(() => referenceRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }));
  }

  function selectUseCase(category: AgentCategory) {
    setActive(category);
    requestAnimationFrame(() => document.getElementById("agent-library-filters")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }));
  }

  return (
    <section className={styles.library} aria-labelledby="agent-library-title">
      <div className={styles.inner}>
        <header className={styles.heading}>
          <h2 id="agent-library-title">
            <span>Decision intelligence,</span>{" "}
            <span className={styles.headingEmphasis}>deployed.</span>
          </h2>
        </header>
        {selected && <AgentReference agent={selected} onUseCaseSelect={selectUseCase} referenceRef={referenceRef} />}
        <nav className={styles.filters} id="agent-library-filters" aria-label="Agent categories">
          {agentCategories.map((category) => (
            <button key={category} type="button" className={active === category ? styles.activeFilter : styles.filter} aria-pressed={active === category} onClick={() => setActive(category)}>{category}</button>
          ))}
        </nav>
        <div className={styles.grid} aria-live="polite" aria-label={`${visible.length} agents shown`}>
          {visible.map((agent) => (
            <AgentCard agent={agent} key={agent.id} onSelect={selectAgent} selected={selected?.id === agent.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentReference({ agent, onUseCaseSelect, referenceRef }: { agent: AgentDefinition; onUseCaseSelect: (category: AgentCategory) => void; referenceRef: React.RefObject<HTMLDivElement | null> }) {
  const Mark = agentMarks[agent.mark];
  return (
    <div className={styles.referenceAnchor} ref={referenceRef}>
      <article aria-labelledby="active-agent-name" className={styles.reference} data-agent={agent.id} id="active-agent-reference">
        <div className={styles.referenceMain}>
          <span className={`${styles.markField} ${styles.referenceMarkField}`} aria-hidden="true"><Mark className={`${styles.mark} ${styles.referenceMark}`} /></span>
          <h3 id="active-agent-name">{agent.name}</h3>
          <p>{agent.description}</p>
          <DemoTrigger className={styles.referenceCta}>Request a demo <span aria-hidden="true">↗</span></DemoTrigger>
        </div>
        <aside className={styles.useCases} aria-labelledby="use-cases-title">
          <h4 id="use-cases-title">Use Cases</h4>
          <div>
            {agent.categories.map((category) => <button aria-label={`Filter Agent Library by ${category}`} key={category} onClick={() => onUseCaseSelect(category)} type="button"><span>{category}</span><span aria-hidden="true">→</span></button>)}
          </div>
        </aside>
      </article>
    </div>
  );
}
