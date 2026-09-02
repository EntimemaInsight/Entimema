"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./resources.module.css";

function Icon({ name }: { name: "linkedin" | "email" | "link" | "save" }) {
  if (name === "linkedin") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6.5 8.1H3V21h3.5V8.1ZM4.8 3a2.05 2.05 0 1 0 0 4.1A2.05 2.05 0 0 0 4.8 3ZM21 13.6c0-3.9-2.1-5.8-4.9-5.8-2.3 0-3.3 1.2-3.9 2.1V8.1H8.7V21h3.5v-6.4c0-1.7.3-3.4 2.5-3.4 2.1 0 2.2 2 2.2 3.5V21H21v-7.4Z" /></svg>;
  if (name === "email") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5.5h18v13H3v-13Zm1.5 1.7 7.5 5.4 7.5-5.4M4.5 17l5.4-5m9.6 5-5.4-5" /></svg>;
  if (name === "link") return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9.5 14.5 14.5 9M7.4 17.6l-1 1a3.5 3.5 0 0 1-5-5l3.2-3.2a3.5 3.5 0 0 1 5 0M16.6 6.4l1-1a3.5 3.5 0 1 1 5 5l-3.2 3.2a3.5 3.5 0 0 1-5 0" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5.5 3.5h13v17L12 16.4l-6.5 4.1v-17Z" /></svg>;
}

export default function ArticleUtilities({ slug, title, targetId, variant = "insights" }: { slug: string; title: string; targetId: string; variant?: "insights" | "engineering" }) {
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sectionCount, setSectionCount] = useState(1);
  const feedbackTimer = useRef<number | null>(null);
  const canonicalUrl = `https://www.entimema.com/resources/${slug}`;

  useEffect(() => {
    const initialStateFrame = window.requestAnimationFrame(() => {
      setSaved(window.localStorage.getItem(`entimema:saved:${slug}`) === "true");
    });
    const update = () => {
      const target = document.getElementById(targetId);
      if (!target) return;
      setSectionCount(Math.max(1, target.querySelectorAll("section[id]").length));
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

  useEffect(() => () => {
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
  }, []);

  function announce(message: string) {
    setFeedback(message);
    if (feedbackTimer.current) window.clearTimeout(feedbackTimer.current);
    feedbackTimer.current = window.setTimeout(() => setFeedback(""), 2400);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setCopied(true);
      announce("Article link copied");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      announce("Copy unavailable — use the address bar");
    }
  }

  function toggleSaved() {
    const next = !saved;
    setSaved(next);
    window.localStorage.setItem(`entimema:saved:${slug}`, String(next));
    announce(next ? "Saved in this browser" : "Removed from saved articles");
  }

  const progressStyle = { "--reading-progress": progress } as CSSProperties;
  const complete = progress >= 0.995;

  return (
    <aside className={`${styles.articleUtilities} ${variant === "engineering" ? styles.engineeringUtilities : ""}`} aria-label="Article tools">
      <div className={styles.readingProgress} aria-label={complete ? "Article read" : `${Math.round(progress * 100)}% read`} role="img" style={progressStyle}>
        <span className={styles.spineLabel} aria-hidden="true">{variant === "engineering" ? "TRACE" : "READ"}</span>
        <div className={styles.spineTrack} aria-hidden="true">
          <i className={styles.spineValue} />
          {Array.from({ length: sectionCount }, (_, index) => (
            <i className={styles.spineSection} key={index} style={{ "--section-position": sectionCount === 1 ? 0 : index / (sectionCount - 1) } as CSSProperties} />
          ))}
          <i className={styles.spineCursor} />
        </div>
        <span className={styles.spineStatus} aria-hidden="true">{complete ? (variant === "engineering" ? "✓ COMPLETE" : "✓ READ") : `${progress === 0 ? (variant === "engineering" ? "IDLE" : "0%") : `${Math.round(progress * 100)}%`}`}</span>
      </div>
      <a aria-label="Share on LinkedIn" data-label="Share on LinkedIn" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`} onClick={() => announce("Opening LinkedIn share")} rel="noopener noreferrer" target="_blank"><Icon name="linkedin" /><span>LinkedIn</span></a>
      <a aria-label="Share by email" data-label="Share by email" href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(canonicalUrl)}`} onClick={() => announce("Opening a new email")}><Icon name="email" /><span>Email</span></a>
      <button aria-label={copied ? "Link copied" : "Copy article link"} data-label={copied ? "Copied" : "Copy article link"} data-state={copied ? "active" : undefined} onClick={copyLink} type="button"><Icon name="link" /><span>{copied ? "Copied" : "Copy link"}</span></button>
      <button aria-pressed={saved} aria-label={saved ? "Remove saved article" : "Save article"} data-label={saved ? "Saved in this browser" : "Save in this browser"} onClick={toggleSaved} type="button"><Icon name="save" /><span>{saved ? "Saved" : "Save"}</span></button>
      <div className={`${styles.utilityFeedback} ${feedback ? styles.utilityFeedbackVisible : ""}`} role="status" aria-live="polite">{feedback}</div>
    </aside>
  );
}
