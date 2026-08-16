"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import BrandLogo from "./BrandLogo";
import WhatWeDoMegaMenu from "./WhatWeDoMegaMenu";
import ResourcesMegaMenu from "./ResourcesMegaMenu";

type NavKey = "home" | "services" | "about" | "resources" | "agents" | "contact";

export default function Navbar({ active = "home" }: { active?: NavKey }) {
  function handleBrandClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname === "/") {
      event.preventDefault();
      window.scrollTo(0, 0);
    }
  }

  return (
    <header className="site-header">
      <div className="site-container site-header__inner site-header__inner--editorial">
        <Link className="site-header__brand" href="/" aria-label="Entimema – home" onClick={handleBrandClick}>
          <BrandLogo />
        </Link>

        <nav className="site-nav site-nav--editorial" aria-label="Main navigation">
          <WhatWeDoMegaMenu active={active === "services"} />

          <ResourcesMegaMenu active={active === "resources"} />
          <Link
            className={active === "agents" ? "is-active" : undefined}
            href="/agents"
            aria-current={active === "agents" ? "page" : undefined}
          >
            Agent Library
          </Link>
          <Link
            className={active === "about" ? "is-active" : undefined}
            href="/about"
            aria-current={active === "about" ? "page" : undefined}
          >
            About
          </Link>
        </nav>

        <div className="site-header__actions">
          <WhatWeDoMegaMenu active={active === "services"} mobile />
          <Link className="primary-cta primary-cta--compact header-cta" href="/contact">
            Contact us
          </Link>
        </div>
      </div>
    </header>
  );
}
