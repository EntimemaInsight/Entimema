"use client";

import Link from "next/link";
import { useState } from "react";
import BrandLogo from "./BrandLogo";

type NavKey = "home" | "services" | "about" | "analyses" | "contact";

const financeItems = [
  "Финансово планиране",
  "Финансово моделиране",
  "Управленска отчетност",
  "Управление чрез KPI",
  "Ликвидност",
  "Финансов контрол",
  "Управление на разходите",
  "CFO функция",
];

const riskItems = [
  "Апликационен скоринг",
  "Поведенчески скоринг",
  "PD / LGD / EAD модели",
  "IFRS 9 модели",
  "AI системи за решения",
  "Fraud Detection",
  "Стрес тестове",
  "Сценариен анализ",
];

export default function Navbar({ active = "home" }: { active?: NavKey }) {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isKeyboardDismissed, setIsKeyboardDismissed] = useState(false);

  return (
    <header className="site-header">
      <div className="site-container site-header__inner site-header__inner--editorial">
        <Link className="site-header__brand" href="/" aria-label="Entimema – начало">
          <BrandLogo />
        </Link>

        <nav className="site-nav site-nav--editorial" aria-label="Основна навигация">
          <div
            className={`site-nav__mega-trigger${isServicesOpen ? " is-open" : ""}${isKeyboardDismissed ? " is-escape-closed" : ""}`}
            onMouseEnter={() => {
              setIsKeyboardDismissed(false);
              setIsServicesOpen(true);
            }}
            onMouseLeave={() => setIsServicesOpen(false)}
            onFocusCapture={() => {
              if (!isKeyboardDismissed) setIsServicesOpen(true);
            }}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsServicesOpen(false);
                setIsKeyboardDismissed(false);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setIsServicesOpen(false);
                setIsKeyboardDismissed(true);
                event.currentTarget.querySelector<HTMLAnchorElement>("a")?.focus();
              }
              if (event.key === "ArrowDown") {
                setIsKeyboardDismissed(false);
                setIsServicesOpen(true);
              }
            }}
          >
            <Link
              className={active === "services" ? "is-active" : undefined}
              href="/services"
              aria-current={active === "services" ? "page" : undefined}
              aria-expanded={isServicesOpen && !isKeyboardDismissed}
              aria-controls="services-mega-menu"
              aria-haspopup="true"
            >
              Какво правим
              <span className="site-nav__chevron" aria-hidden="true" />
            </Link>

            <div className="mega-menu" id="services-mega-menu" aria-label="Какво правим">
              <div className="site-container mega-menu__inner">
                <section className="mega-menu__column" aria-labelledby="mega-finance">
                  <div className="mega-menu__heading">
                    <span>01</span>
                    <h2 id="mega-finance">Финансова архитектура</h2>
                  </div>
                  <p>Свързваме планирането, отчетността и контрола в единна управленска система.</p>
                  <div className="mega-menu__links">
                    {financeItems.map((item) => (
                      <Link key={item} href="/services/financial-architecture">
                        {item}<span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="mega-menu__column" aria-labelledby="mega-risk">
                  <div className="mega-menu__heading">
                    <span>02</span>
                    <h2 id="mega-risk">Управление на риска</h2>
                  </div>
                  <p>Изграждаме модели и AI решения за оценка, наблюдение и вземане на решения.</p>
                  <div className="mega-menu__links">
                    {riskItems.map((item) => (
                      <Link key={item} href="/services/risk-management">
                        {item}<span aria-hidden="true">→</span>
                      </Link>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>

          <Link
            className={active === "analyses" ? "is-active" : undefined}
            href="/insights"
            aria-current={active === "analyses" ? "page" : undefined}
          >
            Анализи
          </Link>
          <Link
            className={active === "about" ? "is-active" : undefined}
            href="/about"
            aria-current={active === "about" ? "page" : undefined}
          >
            За Entimema
          </Link>
        </nav>

        <div className="site-header__actions">
          <Link className="primary-cta primary-cta--compact header-cta" href="/contact">
            Контакти
          </Link>
          <button className="language-switch" type="button" aria-label="Избор на език">
            <span>BG</span>
            <span className="language-switch__chevron" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
