"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./ui";

type SystemCardProps = {
  kind: "finance" | "risk";
  title: [string, string];
  href: string;
};

function FinanceIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 48V30M26 48V20M38 48V35M50 48V13" />
      <path d="M10 50h44" />
      <path d="m13 27 13-9 12 12 13-17" />
      <circle cx="13" cy="27" r="2.5" />
      <circle cx="26" cy="18" r="2.5" />
      <circle cx="38" cy="30" r="2.5" />
      <circle cx="51" cy="13" r="2.5" />
    </svg>
  );
}

function RiskIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="21" />
      <circle cx="32" cy="32" r="13" />
      <circle cx="32" cy="32" r="4" />
      <path d="M32 7v7M32 50v7M7 32h7M50 32h7" />
      <path d="m45 19 6-6" />
    </svg>
  );
}

function SystemCard({ kind, title, href }: SystemCardProps) {
  return (
    <Link className={`approach-tile approach-tile--${kind}`} href={href}>
      <span className="approach-tile__icon">
        {kind === "finance" ? <FinanceIcon /> : <RiskIcon />}
      </span>
      <span className="approach-tile__title">
        <span>{title[0]}</span>
        <span>{title[1]}</span>
      </span>
    </Link>
  );
}

export default function ApproachSection() {
  const ref = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const [activeCard, setActiveCard] = useState(0);

  const selectCard = (direction: -1 | 1) => {
    setActiveCard((current) => (current + direction + 2) % 2);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="approach-section approach-section--tiles" id="about" ref={ref}>
      <div className="approach-section__dotfield" aria-hidden="true" />
      <div className="site-container approach-section__inner">
        <SectionHeader
          className="approach-section__intro reveal reveal--1"
          subtitleClassName="approach-section__lead reveal reveal--2"
          title={
            <>
              <span>Your numbers are connected.</span>
              <span className="approach-section__accent">Your decisions should be too.</span>
            </>
          }
          subtitle={
            <>
              Margins affect cash.<br />
              Cash changes risk.<br />
              Risk changes decisions.<br />
              We connect the system behind them.
            </>
          }
        />
        <div
          className="approach-carousel reveal reveal--3"
          aria-label="Our disciplines"
          aria-roledescription="carousel"
          onTouchStart={(event) => {
            touchStartX.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartX.current === null) return;
            const distance = event.changedTouches[0]?.clientX - touchStartX.current;
            touchStartX.current = null;
            if (Math.abs(distance) < 42) return;
            selectCard(distance < 0 ? 1 : -1);
          }}
        >
          <div className="approach-carousel__viewport">
            <div
              className="approach-section__tiles"
              data-active-card={activeCard}
            >
              <SystemCard kind="finance" title={["Financial", "Architecture"]} href="/services/cfo-function" />
              <SystemCard kind="risk" title={["Decision", "Science"]} href="/services/credit-risk" />
            </div>
          </div>
          {activeCard === 1 ? (
            <button
              className="approach-carousel__control approach-carousel__control--previous"
              type="button"
              aria-label="Show Financial Architecture"
              onClick={() => selectCard(-1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m14.5 5-7 7 7 7" />
              </svg>
            </button>
          ) : (
            <button
              className="approach-carousel__control approach-carousel__control--next"
              type="button"
              aria-label="Show Decision Science"
              onClick={() => selectCard(1)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.5 5 7 7-7 7" />
              </svg>
            </button>
          )}
          <span className="sr-only" aria-live="polite">
            {activeCard === 0 ? "Financial Architecture" : "Decision Science"}, slide {activeCard + 1} of 2
          </span>
        </div>
      </div>
    </section>
  );
}
