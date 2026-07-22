"use client";

import { useEffect, useState } from "react";

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
    root.classList.toggle("announcement-collapsed", isDismissed);

    return () => {
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
