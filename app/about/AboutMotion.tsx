"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./about.module.css";

export default function AboutMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const groups = Array.from(root.querySelectorAll<HTMLElement>("[data-about-reveal]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      groups.forEach((group) => group.classList.add(styles.revealed));
      return;
    }

    const compactViewport = window.matchMedia("(max-width: 768px)").matches;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(styles.revealed);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: compactViewport ? 0.1 : 0.15,
        rootMargin: compactViewport ? "0px 0px -6% 0px" : "0px 0px -12% 0px",
      },
    );

    groups.forEach((group) => observer.observe(group));
    return () => observer.disconnect();
  }, []);

  return <div className={styles.motionRoot} ref={rootRef}>{children}</div>;
}
