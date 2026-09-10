"use client";

import { useEffect, useRef } from "react";
import { SectionHeader } from "./ui";

const metrics = [
  {
    title: "Structured Financial Data",
    description: "Reported values, definitions and periods brought into one consistent view.",
    href: "#about",
    ariaLabel: "Go to the financial architecture and connected data section",
  },
  {
    title: "Controlled Analysis",
    description: "AI interpretation combined with deterministic validation, exceptions and human review.",
    href: "#approach",
    ariaLabel: "Go to the automation and decision architecture section",
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
      <path className="blueprint-focal-line" d="M405 360 575 168 760 250 920 92" />
      <circle className="blueprint-signal" r="4" />
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

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        section.classList.toggle("is-in-viewport", entry.isIntersecting);
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => {
      observer.disconnect();
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
              <span>Better decisions require</span>
              <span className="philosophy-section__accent">more than better data.</span>
            </>
          }
        />

        <div className="philosophy-section__composition philosophy-reveal philosophy-reveal--2">
          <blockquote className="philosophy-quote-card">
            <ArchitectureBlueprint className="philosophy-quote-card__blueprint" />
            <span className="philosophy-quote-card__mark" aria-hidden="true">“</span>
            <div className="philosophy-quote-card__principle"><i /><span>PRINCIPLE</span></div>
            <p>
              <span>Businesses rarely lack financial information.</span>
              <span className="philosophy-quote-card__muted">What they lack is a controlled way</span>
              <span>to turn it into validated, consistent</span>
              <span><strong>and decision-ready outputs.</strong></span>
            </p>
          </blockquote>

          <div className="philosophy-metrics" aria-label="Outcomes from integrated management systems">
            {metrics.map((metric) => (
              <article className="philosophy-metric-card" key={metric.title}>
                <div className="philosophy-metric-card__copy">
                  <span>{metric.title}</span>
                  <small>{metric.description}</small>
                </div>
                <a href={metric.href} aria-label={metric.ariaLabel}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h11M11 6l4 4-4 4" />
                  </svg>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
