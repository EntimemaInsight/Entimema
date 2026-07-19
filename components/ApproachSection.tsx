"use client";

import { useEffect, useRef } from "react";

const financeItems = [
  "Мениджърска отчетност",
  "Финансово моделиране",
  "Бюджетиране и прогнозиране",
  "Управление чрез KPI",
  "Парични потоци и ликвидност",
  "Финансов контрол",
  "Управление на разходите",
  "Външен финансов директор",
];

const riskItems = [
  "Апликационен скоринг",
  "AI системи за решения",
  "Поведенчески скоринг",
  "Мониторинг на портфейли",
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
};

function SystemCard({ kind, title, description, items }: SystemCardProps) {
  const href = kind === "finance" ? "#financial-architecture" : "#credit-risk";
  const linkLabel =
    kind === "finance"
      ? "Разгледайте финансовата архитектура"
      : "Разгледайте решенията";

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
        <span>{linkLabel}</span>
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
          Финансовите системи, моделите за кредитен риск и решенията,
          базирани на изкуствен интелект, създават стойност, когато стъпват
          върху обща логика и последователна методология. Приложенията се
          различават. Принципите остават постоянни.
        </p>

        <div className="approach-section__cards reveal reveal--3">
          <SystemCard
            kind="finance"
            title="Финансова архитектура"
            description="Проектираме финансови системи, които превръщат данните в ясни управленски решения и се развиват заедно с бизнеса."
            items={financeItems}
          />
          <SystemCard
            kind="risk"
            title="Кредитен риск"
            description="Разработваме системи за оценка, мониторинг и автоматизация на кредитния риск — от скоринг модели до решения, подпомагани от изкуствен интелект."
            items={riskItems}
          />
        </div>
      </div>
    </section>
  );
}
