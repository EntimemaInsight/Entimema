export default function Navbar() {
  return (
    <header className="navbar">
      <div className="page-shell navbar__inner">
        <a className="brand" href="#home" aria-label="Entimema home">
          <span className="brand__mark" aria-hidden="true"><span /></span>
          <span className="brand__text">Entimema</span>
        </a>

        <nav className="navlinks" aria-label="Primary navigation">
          <a className="active" href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="#insights">Insights</a>
          <a href="#contact">Contact</a>
        </nav>

        <button className="language" aria-label="Choose language">
          <span>EN</span>
          <span className="language__chevron" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
