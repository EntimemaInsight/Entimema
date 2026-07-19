import Link from "next/link";
import ProductPreview from "./ProductPreview";

const capabilities = [
  "Финансова архитектура",
  "Кредитен риск",
  "Финансова трансформация",
  "Данни, AI и автоматизация",
  "CFO функция",
];

export default function Hero() {
  return (
    <section className="hero hero--premium" id="home">
      <div className="hero-glow" aria-hidden="true" />
      <div className="site-container hero-premium__layout">
        <div className="hero-premium__copy">
          <p className="hero-eyebrow"><span /> AI operating systems for finance</p>
          <h1 className="hero-premium__title">
            Финансови решения,<br />
            <em>проектирани за действие.</em>
          </h1>
          <p className="hero-premium__description">
            Entimema изгражда финансови, рискови и AI системи, които превръщат сложността в ясни управленски решения.
          </p>
          <div className="hero-premium__actions">
            <Link className="button button--primary" href="/contact">Обсъдете казус <span>↗</span></Link>
            <Link className="button button--quiet" href="/services">Разгледайте решенията <span>→</span></Link>
          </div>
          <div className="hero-proof">
            <span><i /> Finance</span><span><i /> Risk</span><span><i /> Data & AI</span>
          </div>
        </div>

        <div className="hero-premium__visual"><ProductPreview /></div>

        <div className="capability-rail" aria-label="Основни направления">
          {capabilities.map((item, index) => (
            <Link href="/services" key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
