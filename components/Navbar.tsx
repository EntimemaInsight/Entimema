export default function Navbar() {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <a className="site-brand" href="#home" aria-label="Entimema — начало">
          <img src="/entimema-logo.png" alt="Entimema" width="300" height="85" />
        </a>

        <nav className="site-nav" aria-label="Основна навигация">
          <a className="is-active" href="#home">Начало</a>
          <a href="#services">Услуги</a>
          <a href="#about">За Entimema</a>
          <a href="#analyses">Анализи</a>
          <a href="#contact">Контакти</a>
        </nav>

        <button className="language-switch" type="button" aria-label="Избор на език">
          <span>BG</span>
          <span className="language-switch__chevron" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
