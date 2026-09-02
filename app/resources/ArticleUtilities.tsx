"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./resources.module.css";

const circumference = 2 * Math.PI * 18;

function Icon({ name }: { name: "linkedin" | "email" | "link" | "save" }) {
  if (name === "linkedin") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.1H3V21h3.5V8.1ZM4.8 3a2.05 2.05 0 1 0 0 4.1A2.05 2.05 0 0 0 4.8 3ZM21 13.6c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.9 2.1V8.1H8.7V21h3.5v-6.4c0-1.7.3-3.4 2.5-3.4 2.1 0 2.2 2 2.2 3.5V21H21v-7.4Z" /></svg>;
  if (name === "email") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5.5h18v13H3v-13Zm1.5 1.7 7.5 5.4 7.5-5.4M4.5 17l5.4-5m9.6 5-5.4-5" /></svg>;
  if (name === "link") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9.5 14.5 14.5 9M7.4 17.6l-1 1a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0M16.6 6.4l1-1a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5.5 3.5h13v17L12 16.4l-6.5 4.1v-17Z" /></svg>;
}

export default function ArticleUtilities({ slug, title, targetId }: { slug: string; title: string; targetId: string }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const canonicalUrl = `https://www.entimema.com/resources/${slug}`;

  useEffect(() => {
    const initialStateFrame = window.requestAnimationFrame(() => {
      setSaved(window.localStorage.getItem(`entimema:saved:${slug}`) === "true");
    });
    const update = () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const start = window.scrollY + rect.top - window.innerHeight * 0.24;
      const finish = window.scrollY + rect.bottom - window.innerHeight * 0.72;
      const next = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, finish - start)));
      setProgress(next);
      if (next >= 0.995) window.localStorage.setItem(`entimema:read:${slug}`, "true");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.cancelAnimationFrame(initialStateFrame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [slug, targetId]);

  async function copyLink() {
    await navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    window.localStorage.setItem(`entimema:saved:${slug}`, String(next));
  }

  const progressStyle = { "--reading-progress": circumference * (1 - progress) } as CSSProperties;
  const complete = progress >= 0.995;

  return (
    <aside className={styles.articleUtilities} aria-label="Article tools">
      <div className={styles.readingProgress} aria-label={complete ? "Article read" : `${Math.round(progress * 100)}% read`} role="img">
        <svg aria-hidden="true" viewBox="0 0 44 44" style={progressStyle}>
          <circle className={styles.progressTrack} cx="22" cy="22" r="18" />
          <circle className={styles.progressValue} cx="22" cy="22" r="18" />
        </svg>
        {complete ? <span aria-hidden="true">✓</span> : null}
      </div>
      <a aria-label="Share on LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`} rel="noopener noreferrer" target="_blank"><Icon name="linkedin" /><span>LinkedIn</span></a>
      <a aria-label="Share by email" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(canonicalUrl)}`}><Icon name="email" /><span>Email</span></a>
      <button aria-label={copied ? "Link copied" : "Copy article link"} onClick={copyLink} type="button"><Icon name="link" /><span>{copied ? "Copied" : "Copy link"}</span></button>
      <button aria-pressed={saved} aria-label={saved ? "Remove saved article" : "Save article"} onClick={toggleSaved} type="button"><Icon name="save" /><span>{saved ? "Saved" : "Save"}</span></button>
    </aside>
  );
}
