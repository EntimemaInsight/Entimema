"use client";

import { useSyncExternalStore } from "react";
import { ANALYTICS_PREFERENCES_EVENT, isProductionAnalyticsHost } from "@/lib/analytics";

const subscribeToClientMount = () => () => undefined;
const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function AnalyticsPreferencesButton({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(subscribeToClientMount, () => true, () => false);
  if (!mounted || !measurementId || !/^G-[A-Z0-9]+$/.test(measurementId) || !isProductionAnalyticsHost()) return null;
  return <button className={className} onClick={() => window.dispatchEvent(new Event(ANALYTICS_PREFERENCES_EVENT))} type="button">Review analytics preferences</button>;
}
