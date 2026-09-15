"use client";

import { useEffect } from "react";

export default function EditorialReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-fi-reveal]"));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    root.dataset.fiMotion = "ready";
    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => { element.dataset.fiVisible = "true"; });
      return () => { delete root.dataset.fiMotion; };
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.fiVisible = "true";
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.08 });

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      delete root.dataset.fiMotion;
    };
  }, []);

  return null;
}
