"use client";

import { useEffect, useRef } from "react";
import { SectionHeader } from "./ui";

const metrics = [
  {
    value: "98%+",
    label: "по-бързи решения чрез интегрирани данни",
  },
  {
    value: "95%+",
    label: "намаляване на ръчната работа чрез автоматизация",
  },
] as const;

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="philosophy-section philosophy-section--split" id="philosophy" ref={ref}>
      <div className="philosophy-section__dotfield" aria-hidden="true" />
      <div className="site-container philosophy-section__inner">
        <SectionHeader
          className="philosophy-section__title philosophy-reveal philosophy-reveal--1"
          title={
            <>
              <span>Начинът на мислене определя</span>
              <span className="philosophy-section__accent">качеството на решенията.</span>
            </>
          }
        />

        <div className="philosophy-section__composition philosophy-reveal philosophy-reveal--2">
          <blockquote className="philosophy-quote-card">
            <span className="philosophy-quote-card__mark" aria-hidden="true">“</span>
            <p>
              <span>Организациите рядко се провалят</span>
              <span className="philosophy-quote-card__muted">поради липса на информация.</span>
              <span>По-често липсва <em>структурата</em>, която превръща информацията</span>
              <span>в <strong>последователни решения.</strong></span>
            </p>
          </blockquote>

          <div className="philosophy-metrics" aria-label="Резултати от интегрирани управленски системи">
            {metrics.map((metric) => (
              <article className="philosophy-metric-card" key={metric.value}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
