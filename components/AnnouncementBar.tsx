"use client";

import Link from "next/link";
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
    <aside className="announcement" aria-label="Current announcement">
      <Link className="announcement__link" href="/resources">
        <span className="site-container announcement__inner">
          <p>Where finance, risk and AI become better decisions.</p>
          <span>Explore Resources <b aria-hidden="true">→</b></span>
        </span>
      </Link>
      <button
        className="announcement__close"
        type="button"
        aria-label="Close announcement"
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
