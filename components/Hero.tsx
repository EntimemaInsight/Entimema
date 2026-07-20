import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="site-container hero__layout hero__layout--editorial">
        <div className="hero__copy hero__copy--editorial">
          <h1 className="hero__title hero__title--editorial">
            <span>Структурата превръща</span>
            <span className="hero__accent">стратегията в резултати.</span>
          </h1>
          <p className="hero__description hero__description--editorial">
            Най-силните организации не управляват отделни функции. Те свързват финансите,
            риска, данните и технологиите в една последователна управленска архитектура.
          </p>

          <div className="hero__proof" aria-label="Основни области на експертиза">
            <span>Финансова архитектура</span>
            <i aria-hidden="true" />
            <span>Управление на риска</span>
            <i aria-hidden="true" />
            <span>AI и автоматизация</span>
          </div>

          <Link className="hero__cta" href="/contact">
            Обсъдете казус <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
