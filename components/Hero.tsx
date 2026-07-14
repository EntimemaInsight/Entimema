const services = [
  ["01", "FINANCIAL ARCHITECTURE", "Building finance functions that scale."],
  ["02", "CREDIT RISK INTELLIGENCE", "Quantifying uncertainty through data and models."],
  ["03", "FINANCIAL (RE)STRUCTURING", "Improving performance through financial transformation."],
  ["04", "DATA, AI & AUTOMATION", "Connecting finance, technology and intelligent processes."],
  ["05", "CFO AS A SERVICE", "Strategic financial leadership when you need it most."],
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="page-shell hero__grid">
        <div className="hero__left">
          <div className="progress" aria-hidden="true">
            <span className="progress__top" />
            <span className="progress__active" />
          </div>

          <div className="hero__copy">
            <h1>
              Structure<br />before
              <span className="accent">decisions</span>
            </h1>
            <p className="hero__lead">
              We build financial systems,<br />
              quantify risk and drive performance<br />
              through data, models and insight.
            </p>
          </div>
        </div>

        <div className="services" id="services">
          {services.map(([number, title, description]) => (
            <article className="service" key={number}>
              <div className="service__number">{number}</div>
              <div className="service__dash" aria-hidden="true" />
              <div>
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
