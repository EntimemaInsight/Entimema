import Link from "next/link";
import BrandLogo from "./BrandLogo";

type NavKey = "home" | "services" | "about" | "analyses" | "contact";

const items: Array<{ key: NavKey; label: string; href: string }> = [
  { key: "home", label: "Начало", href: "/" },
  { key: "services", label: "Услуги", href: "/services" },
  { key: "about", label: "За Entimema", href: "/about" },
  { key: "analyses", label: "Анализи", href: "/#insights" },
];

export default function Navbar({ active = "home" }: { active?: NavKey }) {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner">
        <Link className="site-header__brand" href="/" aria-label="Entimema – начало">
          <BrandLogo />
        </Link>

        <nav className="site-nav" aria-label="Основна навигация">
          {items.map((item) => (
            <Link
              key={item.key}
              className={active === item.key ? "is-active" : undefined}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <button className="language-switch" type="button" aria-label="Избор на език">
            <span>BG</span><span className="language-switch__chevron" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
