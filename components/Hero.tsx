const services = [
  { number: "01", title: "ФИНАНСОВА АРХИТЕКТУРА", description: "Структурата определя резултата." },
  { number: "02", title: "КРЕДИТЕН РИСК", description: "Рискът трябва да бъде измерим." },
  { number: "03", title: "ФИНАНСОВА ТРАНСФОРМАЦИЯ", description: "Ефективността се проектира." },
  { number: "04", title: "ДАННИ, AI И АВТОМАТИЗАЦИЯ", description: "Данните създават стойност в контекст." },
  { number: "05", title: "CFO ФУНКЦИЯ", description: "Финансовата функция се изгражда." },
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__dots" aria-hidden="true" />
      <div className="site-container hero__layout">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span>Структурата</span>
            <span>превръща</span>
            <span className="hero__accent">стратегията в</span>
            <span className="hero__accent">резултати.</span>
          </h1>
          <p className="hero__description">
            <span>Изграждаме системи, които превръщат</span>
            <span>данните в решения, риска – в предвидимост,</span>
            <span>а стратегията – в изпълнение.</span>
          </p>
        </div>

        <div className="service-list" id="services">
          {services.map((service) => (
            <article className="service-row" key={service.number}>
              <div className="service-row__number">{service.number}</div>
              <span className="service-row__rule" aria-hidden="true" />
              <div className="service-row__copy">
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
