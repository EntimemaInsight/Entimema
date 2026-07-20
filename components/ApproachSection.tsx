"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

type SystemCardProps = {
  kind: "finance" | "risk";
  number: string;
  title: string;
  description: string;
  href: string;
};

function SystemCard({ kind, number, title, description, href }: SystemCardProps) {
  return (
    <article className={`approach-card approach-card--concept approach-card--${kind}`}>
      <div className="approach-card__number">{number}</div>
      <div className="approach-card__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <Link className="approach-card__link" href={href}>
        <span>Вижте подхода</span>
        <span aria-hidden="true">→</span>
      </Link>
    </article>
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
    <section className="approach-section" id="about" ref={ref}>
      <div className="site-container approach-section__inner">
        <div className="approach-section__intro reveal reveal--1">
          <h2>
            Финанси и риск,
            <br />
            <em>мислени като една система.</em>
          </h2>
        </div>

        <p className="approach-section__lead reveal reveal--2">
          Финансовата архитектура и управлението на риска създават най-голяма стойност,
          когато споделят обща логика, данни и методология. Различни дисциплини — една
          система за по-добри решения.
        </p>

        <div className="approach-section__cards reveal reveal--3">
          <SystemCard
            kind="finance"
            number="01"
            title="Финансова архитектура"
            description="Свързваме планирането, отчетността, контрола и управленските решения в последователна финансова система."
            href="/services/financial-architecture"
          />
          <SystemCard
            kind="risk"
            number="02"
            title="Управление на риска"
            description="Изграждаме измерими модели и процеси за оценка, наблюдение и вземане на решения в условия на несигурност."
            href="/services/risk-management"
          />
        </div>
      </div>
    </section>
  );
}
