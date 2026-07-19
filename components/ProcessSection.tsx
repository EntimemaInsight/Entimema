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
  const shell = (content: ReactNode) => (
    <svg viewBox="0 0 120 88" aria-hidden="true">
      <rect className="frame" x="1" y="1" width="118" height="86" rx="16" />
      <path className="chrome" d="M1 21h118" />
      <circle className="chrome-dot" cx="14" cy="11" r="2" />
      <circle className="chrome-dot" cx="22" cy="11" r="2" />
      <circle className="chrome-dot" cx="30" cy="11" r="2" />
      {content}
    </svg>
  );

  if (type === "search") {
    return shell(<>
      <rect x="12" y="31" width="42" height="9" rx="4.5" />
      <rect className="muted" x="12" y="47" width="31" height="6" rx="3" />
      <circle className="accent-fill" cx="84" cy="49" r="14" />
      <path className="accent-line" d="m94 59 10 10" />
    </>);
  }
  if (type === "structure") {
    return shell(<>
      <rect x="15" y="32" width="24" height="15" rx="4" />
      <rect x="48" y="32" width="24" height="15" rx="4" />
      <rect className="accent-box" x="81" y="32" width="24" height="15" rx="4" />
      <path className="muted-line" d="M27 47v12h66V47M60 47v12" />
      <rect className="muted" x="33" y="64" width="54" height="6" rx="3" />
    </>);
  }
  if (type === "model") {
    return shell(<>
      <path className="muted-line" d="M15 67V33h88" />
      <path className="accent-line" d="m19 62 18-14 16 7 17-20 25 8" />
      <circle className="accent-fill" cx="37" cy="48" r="3" />
      <circle className="accent-fill" cx="70" cy="35" r="3" />
      <rect className="muted" x="76" y="55" width="24" height="8" rx="4" />
    </>);
  }
  if (type === "automation") {
    return shell(<>
      <rect x="13" y="34" width="27" height="19" rx="5" />
      <rect x="80" y="34" width="27" height="19" rx="5" />
      <rect className="accent-box" x="47" y="56" width="27" height="16" rx="5" />
      <path className="muted-line" d="M40 43h40M60 43v13" />
      <path className="accent-line" d="m72 40 8 3-8 3" />
    </>);
  }
  return shell(<>
    <rect x="15" y="52" width="15" height="16" rx="3" />
    <rect x="38" y="43" width="15" height="25" rx="3" />
    <rect x="61" y="34" width="15" height="34" rx="3" />
    <rect className="accent-box" x="84" y="27" width="15" height="41" rx="3" />
    <path className="accent-line" d="M16 40c20-1 38-9 58-22l18 3" />
  </>);
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
