"use client";

import { useEffect, useRef } from "react";

type Step = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  icon: "search" | "structure" | "model" | "automation" | "growth";
};

const steps: Step[] = [
  {
    number: "01",
    title: "Разбиране",
    description: "Навлизаме в контекста, целите и ограниченията на бизнеса.",
    bullets: ["Интервюта с ключови участници", "Анализ на процесите", "Критични точки", "Критерии за успех"],
    icon: "search",
  },
  {
    number: "02",
    title: "Структуриране",
    description: "Превръщаме сложността в ясна логика, процеси и данни.",
    bullets: ["Бизнес архитектура", "KPI система", "Архитектура на данните", "Управленска рамка"],
    icon: "structure",
  },
  {
    number: "03",
    title: "Моделиране",
    description: "Изграждаме модели за резултати, риск и сценарии.",
    bullets: ["Финансово моделиране", "Моделиране на риска", "Сценарийни анализи", "What-if симулации"],
    icon: "model",
  },
  {
    number: "04",
    title: "Автоматизация",
    description: "Автоматизираме потоците, изчисленията и отчетността.",
    bullets: ["Автоматизация на процеси", "Потоци от данни", "Автоматизирана отчетност", "Системна интеграция"],
    icon: "automation",
  },
  {
    number: "05",
    title: "Развитие",
    description: "Измерваме резултатите и развиваме системите във времето.",
    bullets: ["Мониторинг на резултатите", "Анализ на отклоненията", "Актуализация на моделите", "Непрекъснато подобрение"],
    icon: "growth",
  },
];

function StepIcon({ type }: { type: Step["icon"] }) {
  if (type === "search") {
    return <svg viewBox="0 0 96 96" aria-hidden="true"><circle cx="41" cy="40" r="24"/><path d="M58 58 77 77"/><path className="accent" d="M28 40a13 13 0 0 1 13-13"/></svg>;
  }
  if (type === "structure") {
    return <svg viewBox="0 0 96 96" aria-hidden="true"><rect x="37" y="14" width="22" height="22"/><rect x="14" y="60" width="22" height="22"/><rect className="accent" x="60" y="60" width="22" height="22"/><path d="M48 36v14M25 50h46M25 50v10M71 50v10"/></svg>;
  }
  if (type === "model") {
    return <svg viewBox="0 0 96 96" aria-hidden="true"><path d="M18 15v65h65"/><path className="accent" d="m24 66 20-20 16 9 20-25"/><path className="accent" d="M69 30h11v11"/><circle cx="42" cy="25" r="3"/><circle cx="60" cy="30" r="3"/><circle cx="69" cy="68" r="3"/><circle cx="48" cy="72" r="3"/></svg>;
  }
  if (type === "automation") {
    return <svg viewBox="0 0 96 96" aria-hidden="true"><path d="m48 12 6 9 11-2 2 11 10 5-5 10 5 10-10 5-2 11-11-2-6 9-6-9-11 2-2-11-10-5 5-10-5-10 10-5 2-11 11 2z"/><circle className="accent" cx="48" cy="45" r="13"/></svg>;
  }
  return <svg viewBox="0 0 96 96" aria-hidden="true"><path d="M18 78V58h14v20M42 78V43h14v35M66 78V28h14v50"/><path className="accent" d="M18 45c21-2 38-12 59-31"/><path className="accent" d="M66 14h11v11"/></svg>;
}

function Connector() {
  return <div className="process-connector" aria-hidden="true"><span>›</span></div>;
}

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("is-visible");
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="process-section" id="approach" ref={ref}>
      <div className="process-dots process-dots--left" aria-hidden="true" />
      <div className="process-dots process-dots--right" aria-hidden="true" />
      <div className="site-container process-section__inner">
        <div className="process-heading process-reveal process-reveal--1">
          <h2>Всяко решение<br /><em>започва с разбиране.</em></h2>
        </div>
        <div className="process-quote process-reveal process-reveal--2">
          <i aria-hidden="true" />
          <p>Променя се контекстът,<br />а не логиката.</p>
        </div>

        <div className="process-flow process-reveal process-reveal--3">
          {steps.map((step, index) => (
            <div className="process-flow__unit" key={step.number} style={{ "--step-delay": `${index * 90}ms` } as React.CSSProperties}>
              <article className={`process-step ${index === 2 ? "process-step--featured" : ""}`}>
                <div className="process-step__icon"><StepIcon type={step.icon} /></div>
                <div className="process-step__copy">
                  <span className="process-step__number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <ul>{step.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </div>
              </article>
              {index < steps.length - 1 && <Connector />}
            </div>
          ))}
        </div>

        <div className="process-summary process-reveal process-reveal--4">
          <div className="process-summary__item process-summary__item--primary">
            <div className="process-summary__icon process-summary__icon--chart"><StepIcon type="growth" /></div>
            <p>Целта е проста:<br /><strong>да превърнем <em>сложността в яснота,</em><br />а анализа — в <em>действие.</em></strong></p>
          </div>
          <span className="process-summary__divider" aria-hidden="true" />
          <div className="process-summary__item">
            <div className="process-summary__icon"><svg viewBox="0 0 96 96" aria-hidden="true"><path d="M48 13c9 8 19 10 27 11v20c0 19-10 31-27 39-17-8-27-20-27-39V24c8-1 18-3 27-11z"/></svg></div>
            <p>Така изграждаме<br /><strong>устойчиви системи за растеж.</strong></p>
          </div>
        </div>
      </div>
    </section>
  );
}
