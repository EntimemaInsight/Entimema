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
          <Link className="header-cta hero__cta" href="/contact">
            Обсъдете казус
          </Link>
        </div>
      </div>
    </section>
  );
}
