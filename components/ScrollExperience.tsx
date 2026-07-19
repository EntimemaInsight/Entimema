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
  ".process-flow__unit",
  ".process-summary",
  ".trust-layer > *",
].join(",");

export default function ScrollExperience() {
  useEffect(() => {
    const root = document.documentElement;
    let previousY = window.scrollY;
    let frame = 0;

    const updateScrollState = () => {
      const currentY = window.scrollY;
      root.classList.toggle("is-scrolled", currentY > 24);
      root.classList.toggle("scrolling-down", currentY > previousY && currentY > 120);
      root.classList.toggle("scrolling-up", currentY < previousY || currentY <= 120);
      previousY = currentY;
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollState);
    };

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
    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("is-scrolled", "scrolling-down", "scrolling-up");
    };
  }, []);

  return null;
}
