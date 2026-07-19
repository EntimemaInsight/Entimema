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
            Начинът на мислене определя
            <br />
            <em>качеството на решенията.</em>
          </h2>
        </div>

        <div className="philosophy-section__copy philosophy-reveal philosophy-reveal--2">
          <p>
            Организациите рядко се провалят поради липса на информация. По-често липсва
            връзката между отделните управленски функции, която превръща информацията в
            последователни решения.
          </p>
          <p className="philosophy-section__closing">
            Именно тази идея стои зад името Entimema.
          </p>
        </div>
      </div>
    </section>
  );
}
