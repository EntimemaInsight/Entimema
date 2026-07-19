"use client";

import { useEffect, useRef, type ReactNode } from "react";

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
  const Frame = ({ children, label }: { children: ReactNode; label: string }) => (
    <svg viewBox="0 0 132 96" role="img" aria-label={label}>
      <rect className="ui-shell" x="1" y="1" width="130" height="94" rx="18" />
      <rect className="ui-panel" x="10" y="10" width="112" height="76" rx="13" />
      {children}
    </svg>
  );

  if (type === "search") {
    return <Frame label="Разбиране"><>
      <rect className="ui-chip" x="20" y="21" width="34" height="7" rx="3.5" />
      <rect className="ui-muted" x="20" y="35" width="52" height="6" rx="3" />
      <rect className="ui-muted" x="20" y="47" width="39" height="6" rx="3" />
      <circle className="ui-focus" cx="91" cy="48" r="17" />
      <circle className="ui-focus-core" cx="91" cy="48" r="6" />
      <path className="ui-accent-line" d="m103 60 10 10" />
      <path className="ui-hairline" d="M20 67h42" />
    </></Frame>;
  }
  if (type === "structure") {
    return <Frame label="Структуриране"><>
      <rect className="ui-node" x="18" y="21" width="28" height="19" rx="6" />
      <rect className="ui-node" x="52" y="21" width="28" height="19" rx="6" />
      <rect className="ui-node ui-node--accent" x="86" y="21" width="28" height="19" rx="6" />
      <path className="ui-hairline" d="M32 40v18h68V40M66 40v18" />
      <rect className="ui-muted" x="33" y="66" width="66" height="7" rx="3.5" />
    </></Frame>;
  }
  if (type === "model") {
    return <Frame label="Моделиране"><>
      <path className="ui-axis" d="M20 70V25h90" />
      <path className="ui-hairline" d="M20 52h90M44 25v45M68 25v45M92 25v45" />
      <path className="ui-accent-line" d="m25 62 20-14 17 7 19-22 25 8" />
      <circle className="ui-dot" cx="45" cy="48" r="3.4" />
      <circle className="ui-dot" cx="81" cy="33" r="3.4" />
      <rect className="ui-pill" x="80" y="58" width="28" height="9" rx="4.5" />
    </></Frame>;
  }
  if (type === "automation") {
    return <Frame label="Автоматизация"><>
      <rect className="ui-node" x="17" y="29" width="30" height="22" rx="7" />
      <rect className="ui-node" x="85" y="29" width="30" height="22" rx="7" />
      <rect className="ui-node ui-node--accent" x="51" y="60" width="30" height="18" rx="7" />
      <path className="ui-hairline" d="M47 40h38M66 40v20" />
      <path className="ui-accent-line" d="m75 35 10 5-10 5" />
      <circle className="ui-status" cx="32" cy="40" r="3.2" />
      <circle className="ui-status" cx="100" cy="40" r="3.2" />
    </></Frame>;
  }
  return <Frame label="Развитие"><>
    <rect className="ui-bar" x="22" y="58" width="14" height="17" rx="4" />
    <rect className="ui-bar" x="44" y="49" width="14" height="26" rx="4" />
    <rect className="ui-bar" x="66" y="39" width="14" height="36" rx="4" />
    <rect className="ui-bar ui-bar--accent" x="88" y="27" width="14" height="48" rx="4" />
    <path className="ui-accent-line" d="M23 46c18-1 35-9 52-20l19 3" />
    <path className="ui-accent-line" d="m86 23 9 6-9 5" />
  </></Frame>;
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
