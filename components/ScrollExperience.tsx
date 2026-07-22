"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".hero__copy",
  ".service-row",
  ".approach-section__intro",
  ".approach-section__lead",
  ".approach-card",
  ".process-heading",
  ".process-quote",
  ".trust-layer > *",
].join(",");

export default function ScrollExperience() {
  useEffect(() => {
    const revealNodes = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    revealNodes.forEach((node, index) => {
      node.classList.add("motion-reveal");
      node.style.setProperty("--motion-order", String(index % 6));
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).classList.add("is-in-view");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    revealNodes.forEach((node) => observer.observe(node));
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
