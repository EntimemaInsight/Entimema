"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type FooterHomeLinkProps = {
  children: ReactNode;
  className: string;
};

export default function FooterHomeLink({ children, className }: FooterHomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={className}
      href="/"
      aria-label="Entimema — go to homepage"
      onNavigate={(event) => {
        if (pathname !== "/") return;

        event.preventDefault();

        if (window.location.hash || window.location.search) {
          window.history.replaceState(window.history.state, "", "/");
        }

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: reducedMotion ? "auto" : "smooth",
        });
      }}
    >
      {children}
    </Link>
  );
}
