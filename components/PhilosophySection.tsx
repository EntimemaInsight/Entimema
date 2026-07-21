"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./ui";

const metrics = [
  {
    value: "98%+",
    start: 97.9,
    end: 98,
    label: "по-бързи решения чрез интегрирани данни",
  },
  {
    value: "95%+",
    start: 94.8,
    end: 95,
    label: "намаляване на ръчната работа чрез автоматизация",
  },
] as const;

function ArchitectureBlueprint({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
      <g className="blueprint-grid">
        {Array.from({ length: 11 }, (_, index) => <path d={`M${index * 100} 0V620`} key={`v-${index}`} />)}
        {Array.from({ length: 8 }, (_, index) => <path d={`M0 ${index * 88}H1000`} key={`h-${index}`} />)}
      </g>
      <g className="blueprint-structure">
        <path d="M90 470 250 292 405 360 575 168 760 250 920 92" />
        <path d="M90 470H405V360H760V250H920" />
        <path d="M250 292V112M575 168V520M760 250V78" />
        <path d="M160 530 310 420 490 482 650 340 860 410" />
      </g>
      <g className="blueprint-nodes">
        {[[90,470],[250,292],[405,360],[575,168],[760,250],[920,92],[310,420],[650,340],[860,410]].map(([x,y]) => (
          <g transform={`translate(${x} ${y})`} key={`${x}-${y}`}><circle r="7" /><circle r="2" /></g>
        ))}
      </g>
      <g className="blueprint-coordinates">
        <text x="76" y="494">A-01</text><text x="560" y="150">C-04</text><text x="878" y="78">E-07</text>
        <path d="M72 510h54M72 506v8M126 506v8M548 128h54M548 124v8M602 124v8" />
      </g>
    </svg>
  );
}

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);
  const animationFrame = useRef<number | null>(null);
  const [metricValues, setMetricValues] = useState<number[]>(metrics.map((metric) => metric.start));

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setMetricValues(metrics.map((metric) => metric.end));
            observer.disconnect();
            return;
          }
          const startedAt = performance.now();
          const animateMetrics = (now: number) => {
            const progress = Math.min((now - startedAt) / 720, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setMetricValues(metrics.map((metric) => metric.start + (metric.end - metric.start) * eased));
            if (progress < 1) animationFrame.current = window.requestAnimationFrame(animateMetrics);
          };
          animationFrame.current = window.requestAnimationFrame(animateMetrics);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
      if (animationFrame.current) window.cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  return (
    <section className="philosophy-section philosophy-section--split" id="philosophy" ref={ref}>
      <div className="philosophy-section__dotfield" aria-hidden="true" />
      <ArchitectureBlueprint className="philosophy-section__blueprint" />
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
            <ArchitectureBlueprint className="philosophy-quote-card__blueprint" />
            <span className="philosophy-quote-card__mark" aria-hidden="true">“</span>
            <div className="philosophy-quote-card__principle"><i /><span>ПРИНЦИП</span></div>
            <p>
              <span>Организациите рядко се провалят</span>
              <span className="philosophy-quote-card__muted">поради липса на информация.</span>
              <span>По-често липсва <em>структурата</em>, която превръща информацията</span>
              <span>в <strong>последователни решения.</strong></span>
            </p>
          </blockquote>

          <div className="philosophy-metrics" aria-label="Резултати от интегрирани управленски системи">
            {metrics.map((metric, index) => (
              <article className="philosophy-metric-card" key={metric.value}>
                <strong aria-label={metric.value}>
                  {metricValues[index] >= metric.end - 0.005 ? metric.value : `${metricValues[index].toFixed(1)}%`}
                </strong>
                <span>{metric.label}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
