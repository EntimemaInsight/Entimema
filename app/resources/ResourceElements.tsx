import type { ReactNode } from "react";
import styles from "./resources.module.css";

export function ResourceFigure({ children, caption, label }: { children: ReactNode; caption: string; label: string }) {
  return (
    <figure className={styles.figure} aria-label={label}>
      <div className={styles.figureStage}>{children}</div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export function ResourceTable({ caption, headers, rows }: { caption: string; headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label={`${caption}. Scroll horizontally when needed.`}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead><tr>{headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

export function EntimemaFramework({ title, description, steps }: { title: string; description?: string; steps: string[] }) {
  return (
    <figure className={styles.framework}>
      <figcaption><span>ENTIMEMA FRAMEWORK</span><strong>{title}</strong>{description ? <small>{description}</small> : null}</figcaption>
      <ol>{steps.map((step) => <li key={step}><span>{step}</span></li>)}</ol>
    </figure>
  );
}

export function KeyObservation({ title = "Key observation", children }: { title?: string; children: ReactNode }) {
  return <aside className={styles.observation}><span>{title}</span><div>{children}</div></aside>;
}

export function DecisionImplication({ children }: { children: ReactNode }) {
  return <aside className={styles.implication}><span>DECISION IMPLICATION</span><div>{children}</div></aside>;
}

export function Formula({ label, children }: { label: string; children: ReactNode }) {
  return <figure className={styles.formula}><div aria-label={label}>{children}</div><figcaption>{label}</figcaption></figure>;
}
