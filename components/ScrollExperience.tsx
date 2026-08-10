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
    const isServiceDetail = window.location.pathname.startsWith("/services/");

    if (isServiceDetail) {
      const main = document.querySelector<HTMLElement>("main");
      const heroParts = main?.querySelectorAll<HTMLElement>(":scope > section:first-of-type > .site-container > *") ?? [];
      const sectionCompositions = main?.querySelectorAll<HTMLElement>(":scope > section:not(:first-of-type) > .site-container") ?? [];
      const processSteps = main?.querySelectorAll<HTMLElement>("ol > li") ?? [];

      heroParts.forEach((node, index) => {
        node.classList.add(index === 0 ? "motion-service-hero" : "motion-service-dashboard");
        node.style.setProperty("--motion-order", String(index));
        revealNodes.push(node);
      });
      sectionCompositions.forEach((node) => {
        node.classList.add("motion-service-section");
        revealNodes.push(node);
      });
      processSteps.forEach((node, index) => {
        node.classList.add("motion-service-step");
        node.style.setProperty("--motion-order", String(index % 6));
        revealNodes.push(node);
      });
    }

    revealNodes.forEach((node, index) => {
      node.classList.add("motion-reveal");
      if (!node.style.getPropertyValue("--motion-order")) {
        node.style.setProperty("--motion-order", String(index % 6));
      }
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-in-view"));
      return;
    }

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
