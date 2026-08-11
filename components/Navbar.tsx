"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import WhatWeDoMegaMenu from "./WhatWeDoMegaMenu";
import ResourcesMegaMenu from "./ResourcesMegaMenu";

type NavKey = "home" | "services" | "about" | "resources" | "contact";

export default function Navbar({ active = "home" }: { active?: NavKey }) {
  return (
    <header className="site-header">
      <div className="site-container site-header__inner site-header__inner--editorial">
        <Link className="site-header__brand" href="/" aria-label="Entimema – home">
          <BrandLogo />
        </Link>

        <nav className="site-nav site-nav--editorial" aria-label="Main navigation">
          <WhatWeDoMegaMenu active={active === "services"} />

          <ResourcesMegaMenu active={active === "resources"} />
          <Link
            className={active === "about" ? "is-active" : undefined}
            href="/about"
            aria-current={active === "about" ? "page" : undefined}
          >
            ABOUT
          </Link>
        </nav>

        <div className="site-header__actions">
          <WhatWeDoMegaMenu active={active === "services"} mobile />
          <Link className="primary-cta primary-cta--compact header-cta" href="/contact">
            CONTACT US <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
