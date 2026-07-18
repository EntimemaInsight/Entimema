const services = [
  ["01", "ФИНАНСОВА АРХИТЕКТУРА", "Структурата определя резултата."],
  ["02", "КРЕДИТЕН РИСК", "Рискът трябва да бъде измерим."],
  ["03", "ФИНАНСОВА ТРАНСФОРМАЦИЯ", "Ефективността се проектира."],
  ["04", "ДАННИ, AI И АВТОМАТИЗАЦИЯ", "Данните създават стойност в контекст."],
  ["05", "CFO ФУНКЦИЯ", "Финансовата функция се изгражда."],
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="dot-field" aria-hidden="true" />
      <div className="page-shell hero__grid">
        <div className="hero__copy">
          <h1>
            Структурата<br />
            превръща
            <span className="accent">стратегията в<br />резултати.</span>
          </h1>
          <p className="hero__lead">
            Изграждаме системи, които превръщат<br />
            данните в решения, риска – в предвидимост,<br />
            а стратегията – в изпълнение.
          </p>
        </div>

        <div className="services" id="services">
          {services.map(([number, title, description]) => (
            <article className="service" key={number}>
              <div className="service__number">{number}</div>
              <div className="service__dash" aria-hidden="true" />
              <div className="service__content">
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
