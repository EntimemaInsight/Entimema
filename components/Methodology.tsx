const steps = [
  {
    number: "01",
    title: "РАЗБИРАНЕ",
    points: ["Цели и контекст", "Процеси и зависимости", "Ключови ограничения"],
    icon: "search",
  },
  {
    number: "02",
    title: "ДИАГНОСТИКА",
    points: ["Данни и системи", "Контроли и рискове", "Модел на управление"],
    icon: "diagnostic",
  },
  {
    number: "03",
    title: "ДИЗАЙН НА РЕШЕНИЕТО",
    points: ["Архитектура", "Логика и методология", "Технологичен подход"],
    icon: "design",
    featured: true,
  },
  {
    number: "04",
    title: "ИЗПЪЛНЕНИЕ",
    points: ["Имплементация", "Интеграция", "Управление на промяната"],
    icon: "execution",
  },
  {
    number: "05",
    title: "УПРАВЛЕНИЕ И РАЗВИТИЕ",
    points: ["Измерване", "Оптимизация", "Надграждане"],
    icon: "growth",
  },
] as const;

type IconName = (typeof steps)[number]["icon"];

function StepIcon({ name }: { name: IconName }) {
  if (name === "search") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="27" cy="27" r="14" />
        <path d="m38 38 12 12" />
        <path d="M14 27h26M27 14v26" opacity=".42" />
      </svg>
    );
  }
  if (name === "diagnostic") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect x="14" y="12" width="32" height="40" rx="5" />
        <path d="M22 24h16M22 32h11M22 40h18" />
        <circle cx="47" cy="44" r="9" />
        <path d="m53 50 6 6" />
      </svg>
    );
  }
  if (name === "design") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="19" />
        <path d="M18 30h28M22 20c5 4 15 4 20 0M22 44c5-4 15-4 20 0" />
        <path d="M25 16c-3 7-3 25 0 32M39 16c3 7 3 25 0 32" />
      </svg>
    );
  }
  if (name === "execution") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 18h28v28H18z" />
        <path d="M24 38 30 32l5 5 9-11" />
        <path d="M41 26h3v3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M13 48h38" />
      <path d="M18 44V31h8v13M29 44V23h8v21M40 44V15h8v29" />
      <path d="m17 23 10-7 9 4 13-10" />
    </svg>
  );
}

export default function Methodology() {
  return (
    <section className="methodology" id="methodology" aria-labelledby="methodology-title">
      <div className="methodology__dots" aria-hidden="true" />
      <div className="site-container methodology__inner">
        <div className="methodology__eyebrow">03 — МЕТОДОЛОГИЯ</div>
        <h2 className="methodology__title" id="methodology-title">
          <span>Всяко решение</span>
          <span className="methodology__accent">започва с разбиране.</span>
        </h2>

        <div className="methodology__flow" aria-label="Пет стъпки на методологията">
          <div className="methodology__rail" aria-hidden="true" />
          {steps.map((step) => (
            <article className={`methodology-step${("featured" in step && step.featured) ? " is-featured" : ""}`} key={step.number}>
              <div className="methodology-step__icon">
                <StepIcon name={step.icon} />
              </div>
              <div className="methodology-step__number">{step.number}</div>
              <h3>{step.title}</h3>
              <ul>
                {step.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
            </article>
          ))}
        </div>

        <div className="methodology__statement">
          <p>Не предлагаме готови решения.</p>
          <p>Изграждаме ги спрямо реалността на бизнеса.</p>
        </div>
      </div>
    </section>
  );
}
