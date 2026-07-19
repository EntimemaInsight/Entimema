"use client";

import { useEffect, useRef } from "react";

const financeItems = [
  "Финансово планиране",
  "Финансово моделиране",
  "Управленска отчетност",
  "Управление чрез KPI",
  "Ликвидност",
  "Финансов контрол",
  "Управление на разходите",
  "CFO функция",
];

const riskItems = [
  "Апликационен скоринг",
  "AI системи за решения",
  "Поведенчески скоринг",
  "Fraud Detection",
  "PD / LGD / EAD модели",
  "Стрес тестове",
  "IFRS 9 модели",
  "Сценариен анализ",
];

type SystemCardProps = {
  kind: "finance" | "risk";
  title: string;
  description: string;
  items: string[];
  href: string;
};

function SystemCard({ kind, title, description, items, href }: SystemCardProps) {
  return (
    <article className={`approach-card approach-card--${kind}`}>
      <div className="approach-card__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      <div className="approach-card__items" aria-label={`Области в ${title}`}>
        {items.map((label) => (
          <div className="approach-card__item" key={label}>
            <b>{label}</b>
          </div>
        ))}
      </div>

      <a className="approach-card__link" href={href}>
        <span>Вижте подхода</span>
        <span aria-hidden="true">→</span>
      </a>
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
          Финансовите системи, управлението на риска и решенията,
          базирани на изкуствен интелект, създават стойност, когато стъпват
          върху обща логика и последователна методология. Приложенията се
          различават. Принципите остават постоянни.
        </p>

        <div className="approach-section__cards reveal reveal--3">
          <SystemCard
            kind="finance"
            title="Финансова архитектура"
            description="Осигурява последователност между финансовата информация, контрола и управленските решения."
            items={financeItems}
            href="/services"
          />
          <SystemCard
            kind="risk"
            title="Управление на риска"
            description="Обединява оценката, наблюдението и вземането на решения в обща рамка."
            items={riskItems}
            href="/services"
          />
        </div>
      </div>
    </section>
  );
}
