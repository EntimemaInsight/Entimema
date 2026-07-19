"use client";

import { useEffect, useRef } from "react";

const steps = [
  { no: "01", title: "Разбиране", text: "Започваме с контекста — целите, ограниченията, данните и начина, по който решенията се вземат днес.", icon: "eye" },
  { no: "02", title: "Структуриране", text: "Подреждаме проблема в ясна логика — процеси, зависимости, показатели и точки на управленско въздействие.", icon: "structure" },
  { no: "03", title: "Моделиране", text: "Превръщаме логиката в работещ модел — финансов, рисков или оперативен, който може да бъде измерван и тестван.", icon: "model" },
  { no: "04", title: "Автоматизация", text: "Вграждаме модела в процесите чрез данни, системи и AI, така че решенията да бъдат по-бързи и последователни.", icon: "automation" },
  { no: "05", title: "Развитие", text: "Следим резултатите, валидираме допусканията и развиваме системата заедно с бизнеса.", icon: "growth" },
];

function StepIcon({ type }: { type: string }) {
  if (type === "eye") return <svg viewBox="0 0 64 64"><path d="M6 32s10-16 26-16 26 16 26 16-10 16-26 16S6 32 6 32Z"/><circle cx="32" cy="32" r="8"/></svg>;
  if (type === "structure") return <svg viewBox="0 0 64 64"><path d="M32 10v10M17 24h30M17 24v10M47 24v10M32 20v14"/><rect x="9" y="34" width="16" height="14" rx="2"/><rect x="24" y="34" width="16" height="14" rx="2"/><rect x="39" y="34" width="16" height="14" rx="2"/></svg>;
  if (type === "model") return <svg viewBox="0 0 64 64"><rect x="10" y="12" width="18" height="18" rx="3"/><rect x="36" y="12" width="18" height="18" rx="3"/><rect x="23" y="36" width="18" height="18" rx="3"/><path d="M28 21h8M19 30l10 8M45 30l-10 8"/></svg>;
  if (type === "automation") return <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="9"/><path d="M32 7v8M32 49v8M7 32h8M49 32h8M14 14l6 6M44 44l6 6M50 14l-6 6M20 44l-6 6"/><circle cx="32" cy="32" r="22" strokeDasharray="5 6"/></svg>;
  return <svg viewBox="0 0 64 64"><path d="M8 50h48M14 44l12-12 9 8 15-20"/><path d="M42 20h8v8"/><path d="M16 46V30M30 46V22M44 46V14" opacity=".35"/></svg>;
}

export default function MethodologySection() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("is-visible");
        io.disconnect();
      }
    }, { threshold: .18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="methodology" id="methodology" ref={ref}>
      <div className="methodology__dots" aria-hidden="true" />
      <div className="site-container methodology__inner">
        <header className="methodology__header methodology-reveal">
          <h2>Променя се контекстът,<br/><em>а не логиката.</em></h2>
        </header>

        <div className="methodology__steps">
          {steps.map((step, index) => (
            <article className={`methodology-step methodology-reveal methodology-reveal--${index + 1}`} key={step.no}>
              <div className="methodology-step__icon"><StepIcon type={step.icon}/></div>
              <div className="methodology-step__number">{step.no}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {index < steps.length - 1 && <span className="methodology-step__arrow" aria-hidden="true">→</span>}
            </article>
          ))}
        </div>

        <div className="methodology__statement methodology-reveal methodology-reveal--6">
          <span className="methodology__statement-mark">✦</span>
          <p>Подходът ни е последователен, измерим и приложим — независимо дали изграждаме финансова архитектура, риск модел или AI система.</p>
        </div>
      </div>
    </section>
  );
}
