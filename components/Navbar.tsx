import Image from "next/image";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="page-shell navbar__inner">
        <a className="brand" href="#home" aria-label="Entimema — начало">
          <Image
            src="/entimema-logo.png"
            alt="Entimema"
            width={310}
            height={94}
            priority
            className="brand__logo"
          />
        </a>

        <nav className="navlinks" aria-label="Основна навигация">
          <a className="active" href="#home">Начало</a>
          <a href="#services">Услуги</a>
          <a href="#about">За Entimema</a>
          <a href="#analyses">Анализи</a>
          <a href="#contact">Контакти</a>
        </nav>

        <button className="language" type="button" aria-label="Избор на език">
          <span>BG</span>
          <span className="language__chevron" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
