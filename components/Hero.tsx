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
      <div className="site-container hero__layout">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span>Структурата превръща</span>
            <span className="hero__accent">стратегията в резултати.</span>
          </h1>
          <p className="hero__description">
            Изграждаме системи, които превръщат данните в решения, риска в предвидимост, а стратегията в изпълнение.
          </p>
        </div>

        <div className="service-list" id="services" aria-label="Основни направления">
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
