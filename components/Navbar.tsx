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

  function handleAgentLibraryClick(event: MouseEvent<HTMLAnchorElement>) {
    if (window.location.pathname !== "/agents") return;

    event.preventDefault();
    window.history.replaceState(null, "", "/agents");
    window.dispatchEvent(new Event("agent-library:reset"));
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <header className="site-header">
      <div className="site-header__inner site-header__inner--editorial">
        <div className="site-header__left">
          <Link className="site-header__brand" href="/" aria-label="Entimema – home" onClick={handleBrandClick}>
            <BrandLogo />
          </Link>

          <nav className="site-nav site-nav--editorial" aria-label="Main navigation">
            <WhatWeDoMegaMenu active={active === "services"} />
            <Link
              className={`site-nav__item${active === "agents" ? " is-active" : ""}`}
              href="/agents"
              aria-current={active === "agents" ? "page" : undefined}
              onClick={handleAgentLibraryClick}
            >
              Agent Library
            </Link>
            <ResourcesMegaMenu active={active === "resources"} />
            <ResourcesMegaMenu variant="company" />
          </nav>
        </div>

        <div className="site-header__actions">
          <WhatWeDoMegaMenu active={active === "services"} mobile />
          <Link className="primary-cta primary-cta--compact header-cta" href="/contact" aria-current={active === "contact" ? "page" : undefined}>
            Contact us
          </Link>
        </div>
      </div>
    </header>
  );
}
