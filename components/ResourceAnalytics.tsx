"use client";

import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { ANALYTICS_READY_EVENT, trackAnalyticsEvent } from "@/lib/analytics";

export function ResourceViewAnalytics({ resourceSlug, resourceTitle, resourceTopic }: { resourceSlug: string; resourceTitle: string; resourceTopic: string }) {
  const elapsed = useRef(false);
  const sent = useRef(false);
  useEffect(() => {
    elapsed.current = false;
    sent.current = false;
    const send = () => {
      if (!elapsed.current || sent.current || document.visibilityState !== "visible") return;
      sent.current = trackAnalyticsEvent("resource_view", { resource_slug: resourceSlug, resource_title: resourceTitle, resource_topic: resourceTopic });
    };
    const timer = window.setTimeout(() => { elapsed.current = true; send(); }, 8000);
    window.addEventListener(ANALYTICS_READY_EVENT, send);
    document.addEventListener("visibilitychange", send);
    return () => { window.clearTimeout(timer); window.removeEventListener(ANALYTICS_READY_EVENT, send); document.removeEventListener("visibilitychange", send); };
  }, [resourceSlug, resourceTitle, resourceTopic]);
  return null;
}

export function RelatedCapabilityLink({ href, resourceSlug, children }: { href: string; resourceSlug: string; children: ReactNode }) {
  return <Link href={href} onClick={() => trackAnalyticsEvent("related_capability_click", { resource_slug: resourceSlug, capability_slug: href.replace(/^\/services\//, ""), link_position: "article_related_capability" })}>{children}</Link>;
}
