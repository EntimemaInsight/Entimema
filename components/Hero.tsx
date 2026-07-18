const services = [
  { number: "01", title: "ФИНАНСОВА АРХИТЕКТУРА", description: "Структурата определя резултата." },
  { number: "02", title: "КРЕДИТЕН РИСК", description: "Рискът трябва да бъде измерим." },
  { number: "03", title: "ФИНАНСОВА ТРАНСФОРМАЦИЯ", description: "Ефективността се проектира." },
  { number: "04", title: "ДАННИ, AI И АВТОМАТИЗАЦИЯ", description: "Данните създават стойност в контекст." },
  { number: "05", title: "CFO ФУНКЦИЯ", description: "Финансовата функция се изгражда." },
];

const orangeDots = [
  [10.7, 0.7], [81.8, 0.8], [97.8, 0.8], [4.5, 12.4], [27.9, 11.9], [35.8, 8.7],
  [49.8, 11.9], [94.3, 21.2], [98.9, 36.8], [2.2, 83.2], [42.2, 87.4], [52.3, 93.8],
  [94.6, 95.5], [34.2, 99.2], [86.8, 99.2]
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__blue-dots" aria-hidden="true" />
      <div className="hero__orange-dots" aria-hidden="true">
        {orangeDots.map(([left, top], index) => (
          <i key={index} style={{ left: `${left}%`, top: `${top}%` }} />
        ))}
      </div>

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
