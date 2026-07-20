"use client";

import { useEffect, useRef } from "react";

export default function PhilosophySection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="philosophy-section" id="philosophy" ref={ref}>
      <div className="site-container philosophy-section__inner">
        <div className="philosophy-section__title philosophy-reveal philosophy-reveal--1">
          <h2>
            <span>Начинът на мислене определя</span>
            <span className="philosophy-section__accent">качеството на решенията.</span>
          </h2>
        </div>

        <blockquote className="philosophy-section__quote philosophy-reveal philosophy-reveal--2">
          <span className="philosophy-section__quote-mark" aria-hidden="true">“</span>
          <p>
            Организациите рядко се провалят поради липса на информация. По-често липсва
            връзката между отделните управленски функции, която превръща информацията в
            последователни решения.
          </p>
        </blockquote>
      </div>
    </section>
  );
}
