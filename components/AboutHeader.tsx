import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function AboutHeader() {
  return (
    <header className="about-header">
      <div className="about-header__inner">
        <Link href="/" aria-label="Entimema – начало" className="about-header__brand">
          <BrandLogo compact />
        </Link>
        <nav className="about-header__nav" aria-label="Навигация за Entimema">
          <Link href="/about" className="is-active" aria-current="page">За Entimema</Link>
          <Link href="/contact">Контакти</Link>
          <Link href="/" className="about-header__home">
            <span>entimema.net</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" /></svg>
          </Link>
        </nav>
      </div>
    </header>
  );
}
