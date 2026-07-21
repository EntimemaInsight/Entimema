"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CaseCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => section.classList.toggle("is-visible", entry.isIntersecting),
      { threshold: 0.24 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="case-cta" aria-labelledby="case-cta-title" ref={sectionRef}>
      <div className="site-container case-cta__inner">
        <h2 id="case-cta-title">Следващото по-добро решение започва с един разговор.</h2>
        <p className="case-cta__support">Най-добрите решения започват с правилния въпрос.</p>
        <Link className="case-cta__link" href="/contact">
          <span>Обсъдете вашия казус</span> <b aria-hidden="true">→</b>
        </Link>
      </div>
    </section>
  );
}
