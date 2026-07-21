type Step = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  icon: "understand" | "structure" | "model" | "automate" | "develop";
};

const steps: Step[] = [
  {
    number: "01",
    title: "Разбиране",
    description: "Навлизаме в контекста, целите и ограниченията на бизнеса.",
    bullets: ["Интервюта с ключови участници", "Анализ на процесите", "Критични точки", "Критерии за успех"],
    icon: "understand",
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
    icon: "automate",
  },
  {
    number: "05",
    title: "Развитие",
    description: "Измерваме резултатите и развиваме системите във времето.",
    bullets: ["Мониторинг на резултатите", "Анализ на отклоненията", "Актуализация на моделите", "Непрекъснато подобрение"],
    icon: "develop",
  },
];

function StepIcon({ type }: { type: Step["icon"] }) {
  const common = { viewBox: "0 0 160 120", role: "img", "aria-hidden": true } as const;

  if (type === "understand") {
    return (
      <svg {...common}>
        <rect className="ui-shell" x="18" y="14" width="124" height="92" rx="24" />
        <circle className="ui-focus" cx="70" cy="56" r="22" />
        <path className="ui-hairline" d="M86 72l18 18" />
        <path className="ui-bar--accent" d="M56 50a15 15 0 0 1 20-8" />
      </svg>
    );
  }

  if (type === "structure") {
    return (
      <svg {...common}>
        <rect className="ui-shell" x="18" y="14" width="124" height="92" rx="24" />
        <rect className="ui-node" x="68" y="28" width="24" height="20" rx="4" />
        <rect className="ui-node" x="34" y="74" width="24" height="20" rx="4" />
        <rect className="ui-node--accent" x="102" y="74" width="24" height="20" rx="4" />
        <path className="ui-hairline" d="M80 48v15M46 63h68M46 63v11M114 63v11" />
      </svg>
    );
  }

  if (type === "model") {
    return (
      <svg {...common}>
        <rect className="ui-shell" x="18" y="14" width="124" height="92" rx="24" />
        <path className="ui-axis" d="M42 84V38M42 84h78" />
        <path className="ui-hairline" d="M54 71l18-16 17 9 23-27" />
        <circle className="ui-dot" cx="54" cy="71" r="3.4" />
        <circle className="ui-dot" cx="72" cy="55" r="3.4" />
        <circle className="ui-dot" cx="89" cy="64" r="3.4" />
        <path className="ui-bar--accent" d="M105 37h7v7" />
      </svg>
    );
  }

  if (type === "automate") {
    return (
      <svg {...common}>
        <rect className="ui-shell" x="18" y="14" width="124" height="92" rx="24" />
        <circle className="ui-focus" cx="80" cy="60" r="20" />
        <circle className="ui-focus-core" cx="80" cy="60" r="7" />
        <path className="ui-hairline" d="M80 30v10M80 80v10M50 60H40M120 60h-10M59 39l7 7M101 39l-7 7M59 81l7-7M101 81l-7-7" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect className="ui-shell" x="18" y="14" width="124" height="92" rx="24" />
      <path className="ui-axis" d="M42 84h78M52 84V68M72 84V56M92 84V44M112 84V30" />
      <path className="ui-bar--accent" d="M50 57l22-10 18-8 22-18M104 21h8v8" />
    </svg>
  );
}

export default function ProcessSection() {
  return (
    <section className="process-section process-section--static" id="approach" aria-labelledby="process-title">
      <div className="site-container process-section__inner">
        <div className="process-heading">
          <h2 id="process-title">
            Всяко решение
            <br />
            <em>започва с разбиране.</em>
          </h2>
        </div>

        <div className="process-quote">
          <i aria-hidden="true" />
          <p>
            Променя се контекстът,
            <br />
            а не логиката.
          </p>
        </div>

        <div className="process-flow" aria-label="Етапи на работа">
          {steps.map((step, index) => (
            <div className="process-flow__unit" key={step.number}>
              <article className={`process-step${index === 2 ? " process-step--featured" : ""}`}>
                <div className="process-step__icon">
                  <StepIcon type={step.icon} />
                </div>
                <div className="process-step__copy">
                  <span className="process-step__number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <ul>
                    {step.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
              {index < steps.length - 1 && (
                <span className="process-connector" aria-hidden="true">
                  <span>›</span>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="process-summary">
          <div className="process-summary__item process-summary__item--primary">
            <p>
              Целта е проста:
              <br />
              <strong>
                да превърнем <em>сложността в яснота,</em>
                <br /> а анализа — в <em>действие.</em>
              </strong>
            </p>
          </div>
          <span className="process-summary__divider" aria-hidden="true" />
          <div className="process-summary__item">
            <p>
              Така изграждаме
              <br />
              <strong>устойчиви системи за растеж.</strong>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
