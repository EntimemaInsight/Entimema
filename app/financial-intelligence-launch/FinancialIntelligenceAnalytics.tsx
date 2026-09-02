"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { ANALYTICS_READY_EVENT, trackAnalyticsEvent } from "@/lib/analytics";

type CtaKind = "private_walkthrough" | "workflow" | "architecture" | "research";

export function FinancialIntelligenceViewAnalytics() {
  const elapsed = useRef(false);
  const sent = useRef(false);

  useEffect(() => {
    const send = () => {
      if (!elapsed.current || sent.current || document.visibilityState !== "visible") return;
      sent.current = trackAnalyticsEvent("financial_intelligence_view", {
        page_variant: "launch_editorial",
      });
    };
    const timer = window.setTimeout(() => {
      elapsed.current = true;
      send();
    }, 8000);
    window.addEventListener(ANALYTICS_READY_EVENT, send);
    document.addEventListener("visibilitychange", send);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(ANALYTICS_READY_EVENT, send);
      document.removeEventListener("visibilitychange", send);
    };
  }, []);

  return null;
}

export function FinancialIntelligenceCta({
  children,
  href,
  kind,
  position,
}: {
  children: ReactNode;
  href: string;
  kind: CtaKind;
  position: "hero" | "explainer" | "final";
}) {
  return (
    <Link
      href={href}
      onClick={() => trackAnalyticsEvent("financial_intelligence_cta_click", {
        cta_kind: kind,
        cta_position: position,
        destination: href.split("?")[0].split("#")[0] || "/financial-intelligence-launch",
      })}
    >
      {children}
    </Link>
  );
}
