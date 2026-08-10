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
      const heroParts = Array.from(main?.querySelectorAll<HTMLElement>(":scope > section:first-of-type > .site-container > *") ?? []);
      const sectionCompositions = Array.from(main?.querySelectorAll<HTMLElement>(":scope > section:not(:first-of-type) > .site-container") ?? []);

      const register = (node: HTMLElement, motionClass: string, order = 0) => {
        node.classList.add(motionClass);
        node.style.setProperty("--motion-order", String(order));
        revealNodes.push(node);
      };

      const heroCopy = heroParts[0];
      if (heroCopy) {
        Array.from(heroCopy.children).forEach((child, index) => {
          register(child as HTMLElement, "motion-service-hero", Math.min(index, 5));
        });
      }
      const dashboard = heroParts[1];
      if (dashboard) register(dashboard, "motion-service-dashboard");

      sectionCompositions.forEach((composition) => {
        let registeredChildren = 0;
        const header = composition.querySelector<HTMLElement>(":scope > [class*='sectionHeader']");
        if (header) {
          Array.from(header.children).forEach((child) => {
            const element = child as HTMLElement;
            const isBody = element.tagName === "P";
            register(element, isBody ? "motion-service-body" : "motion-service-heading", isBody ? 1 : 0);
            registeredChildren += 1;
          });
        }

        const groups = composition.querySelectorAll<HTMLElement>(
          ":scope > [class*='capabilityGrid'], :scope > [class*='outcomeGrid'], :scope > [class*='useCaseGrid'], :scope > [class*='relatedGrid'], :scope > ol",
        );
        groups.forEach((group) => {
          const groupClass = group.className;
          const motionClass = groupClass.includes("relatedGrid")
            ? "motion-service-related"
            : group.tagName === "OL"
              ? "motion-service-step"
              : groupClass.includes("outcomeGrid")
                ? "motion-service-outcome"
                : "motion-service-card";
          Array.from(group.children).forEach((child, index) => {
            register(child as HTMLElement, motionClass, index);
            registeredChildren += 1;
          });
        });

        const narrative = composition.querySelector<HTMLElement>(":scope > [class*='caseExample']");
        if (narrative) {
          const storyParts = narrative.querySelectorAll<HTMLElement>(":scope > :not(dl), :scope > dl > div");
          storyParts.forEach((part, index) => register(part, "motion-service-story", index));
          registeredChildren += storyParts.length;
        }

        const finalCta = composition.querySelector<HTMLElement>(":scope > [class*='ctaBlock']");
        if (finalCta) {
          Array.from(finalCta.children).forEach((child, index) => {
            register(child as HTMLElement, "motion-service-cta", index);
            registeredChildren += 1;
          });
        }

        if (registeredChildren === 0) register(composition, "motion-service-section");
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
