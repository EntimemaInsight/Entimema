"use client";

import { useEffect, useRef } from "react";

const signals = [
  { label: "Бюджет", className: "decision-node decision-node--budget" },
  { label: "Ликвидност", className: "decision-node decision-node--liquidity" },
  { label: "Марж", className: "decision-node decision-node--margin" },
  { label: "Кредитен риск", className: "decision-node decision-node--credit" },
  { label: "Fraud", className: "decision-node decision-node--fraud" },
  { label: "Сценарии", className: "decision-node decision-node--scenario" },
];

export default function DecisionArchitecture() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add("is-visible");
      },
      { threshold: 0.22 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="decision-architecture" ref={ref} aria-labelledby="decision-title">
      <div className="site-container decision-architecture__inner">
        <div className="decision-architecture__intro">
          <p className="decision-architecture__eyebrow">ЕДНА УПРАВЛЕНСКА ЛОГИКА</p>
          <h2 id="decision-title">От информация към решение.</h2>
          <p>
            Данните придобиват стойност, когато бъдат свързани в ясна система за анализ,
            оценка и действие.
          </p>
        </div>

        <div className="decision-canvas" aria-label="Анимирана архитектура на решенията">
          <svg className="decision-lines" viewBox="0 0 1200 620" aria-hidden="true">
            <path d="M170 160 C330 160 360 270 520 300" />
            <path d="M170 310 C330 310 360 300 520 300" />
            <path d="M170 470 C330 470 360 330 520 300" />
            <path d="M1030 160 C870 160 840 270 680 300" />
            <path d="M1030 310 C870 310 840 300 680 300" />
            <path d="M1030 470 C870 470 840 330 680 300" />
            <path className="decision-lines__out" d="M600 365 C600 430 600 458 600 510" />
          </svg>

          {signals.map((signal) => (
            <div className={signal.className} key={signal.label}>
              <span>{signal.label}</span>
            </div>
          ))}

          <div className="decision-core">
            <span className="decision-core__pulse" aria-hidden="true" />
            <small>ENTIMEMA</small>
            <strong>Decision<br />Architecture</strong>
          </div>

          <div className="decision-output">
            <span className="decision-output__status"><i />Решение готово</span>
            <strong>Ясна управленска посока</strong>
            <small>Финанси · Риск · Данни · Действие</small>
          </div>
        </div>
      </div>
    </section>
  );
}
