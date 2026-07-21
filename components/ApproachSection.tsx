"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { SectionHeader } from "./ui";

type SystemCardProps = {
  kind: "finance" | "risk";
  title: string;
  href: string;
};

function FinanceIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 48V30M26 48V20M38 48V35M50 48V13" />
      <path d="M10 50h44" />
      <path d="m13 27 13-9 12 12 13-17" />
      <circle cx="13" cy="27" r="2.5" />
      <circle cx="26" cy="18" r="2.5" />
      <circle cx="38" cy="30" r="2.5" />
      <circle cx="51" cy="13" r="2.5" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="21" />
      <circle cx="32" cy="32" r="13" />
      <circle cx="32" cy="32" r="4" />
      <path d="M32 7v7M32 50v7M7 32h7M50 32h7" />
      <path d="m45 19 6-6" />
    </svg>
  );
}

function SystemCard({ kind, title, href }: SystemCardProps) {
  return (
    <Link className={`approach-tile approach-tile--${kind}`} href={href}>
      <span className="approach-tile__icon">
        {kind === "finance" ? <FinanceIcon /> : <RiskIcon />}
      </span>
      <span className="approach-tile__title">{title}</span>
    </Link>
  );
}

export default function ApproachSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="approach-section approach-section--tiles" id="about" ref={ref}>
      <div className="approach-section__dotfield" aria-hidden="true" />
      <div className="site-container approach-section__inner">
        <SectionHeader
          className="approach-section__intro reveal reveal--1"
          subtitleClassName="approach-section__lead reveal reveal--2"
          title={
            <>
              <span>Финанси и риск,</span>
              <span className="approach-section__accent">мислени като една система.</span>
            </>
          }
          subtitle={
            <>
              Финансовата архитектура и управлението на риска създават най-голяма стойност,
              когато споделят обща логика, данни и методология. Различни дисциплини — една
              система за по-добри решения.
            </>
          }
        />
        <div className="approach-section__tiles reveal reveal--3">
          <SystemCard kind="finance" title="Finance" href="/services/financial-architecture" />
          <SystemCard kind="risk" title="Risk" href="/services/risk-management" />
        </div>
      </div>
    </section>
  );
}
