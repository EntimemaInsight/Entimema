"use client";

import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 18;

export default function AnnouncementBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsDismissed(window.sessionStorage.getItem("entimema-announcement-dismissed") === "1");
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const updateScrollState = () => {
      root.classList.toggle(
        "announcement-collapsed",
        isDismissed || window.scrollY > SCROLL_THRESHOLD,
      );
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollState);
    };

    updateScrollState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("announcement-collapsed");
    };
  }, [isDismissed]);

  return (
    <aside className="announcement" aria-label="Актуално съобщение">
      <div className="site-container announcement__inner">
        <p>Финансовите системи се променят. AI, данните и анализът на риска създават ново поколение управленски решения.</p>
        <a href="#analyses">Разгледайте анализите <span aria-hidden="true">→</span></a>
      </div>
      <button
        className="announcement__close"
        type="button"
        aria-label="Затвори съобщението"
        onClick={() => {
          window.sessionStorage.setItem("entimema-announcement-dismissed", "1");
          setIsDismissed(true);
        }}
      >
        ×
      </button>
    </aside>
  );
}
