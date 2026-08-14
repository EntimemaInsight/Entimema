"use client";

import { useEffect, useState } from "react";
import type { ArticleSection } from "./ResourceArticle";
import styles from "./resources.module.css";

function ContentsList({ sections, activeId, onNavigate }: { sections: ArticleSection[]; activeId: string; onNavigate?: () => void }) {
  return (
    <ol>
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} aria-current={activeId === section.id ? "location" : undefined} onClick={onNavigate}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            {section.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default function ArticleContents({ sections }: { sections: ArticleSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const headings = sections.map(({ id }) => document.getElementById(id)).filter((heading): heading is HTMLElement => Boolean(heading));
    if (!headings.length) return;

    const setSectionFromPosition = () => {
      const current = [...headings].reverse().find((heading) => heading.getBoundingClientRect().top <= 180);
      setActiveId(current?.id ?? headings[0].id);
    };
    const observer = new IntersectionObserver(setSectionFromPosition, { rootMargin: "-140px 0px -65% 0px" });
    headings.forEach((heading) => observer.observe(heading));
    setSectionFromPosition();
    window.addEventListener("hashchange", setSectionFromPosition);
    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", setSectionFromPosition);
    };
  }, [sections]);

  return (
    <>
      <nav className={styles.toc} aria-label="Article contents">
        <span>CONTENTS</span>
        <ContentsList sections={sections} activeId={activeId} />
      </nav>
      <details className={styles.mobileToc}>
        <summary>Contents <span aria-hidden="true">+</span></summary>
        <nav aria-label="Article contents">
          <ContentsList sections={sections} activeId={activeId} onNavigate={() => (document.activeElement as HTMLElement | null)?.closest("details")?.removeAttribute("open")} />
        </nav>
      </details>
    </>
  );
}
