"use client";

import { useEffect, useRef } from "react";
import { isTopicKey } from "./contact-config";
import styles from "./contact.module.css";
import { ANALYTICS_READY_EVENT, previousInternalPath, trackAnalyticsEvent } from "@/lib/analytics";
import { useContactModal } from "@/components/DemoDiscovery";

type Intent = "project" | "partnership" | "client";
type IconProps = { className?: string };

function ProjectIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 32 32"><path d="M7.5 4.5h11l6 6v17h-17z" /><path d="M18.5 4.5v6h6M11.5 16h9M11.5 21h9" /></svg>;
}

function PartnershipIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 32 32"><circle cx="7" cy="16" r="3.5" /><circle cx="25" cy="8" r="3.5" /><circle cx="25" cy="24" r="3.5" /><path d="m10.2 14.5 11.6-5M10.2 17.5l11.6 5" /></svg>;
}

function ClientIcon({ className }: IconProps) {
  return <svg aria-hidden="true" className={className} fill="none" focusable="false" viewBox="0 0 32 32"><circle cx="13" cy="10" r="5" /><path d="M4.5 27c.6-5.4 3.4-8 8.5-8 3.4 0 5.8 1.2 7.2 3.7M21 16.5l2.5 2.5 5-5" /></svg>;
}

const paths = [
  { intent: "project" as const, title: "New Project", Icon: ProjectIcon },
  { intent: "partnership" as const, title: "Partnerships", Icon: PartnershipIcon },
  { intent: "client" as const, title: "Existing Clients", Icon: ClientIcon },
];

export default function ContactExperience({ initialTopic }: { initialTopic?: string }) {
  const validTopic = initialTopic && isTopicKey(initialTopic) ? initialTopic : undefined;
  const openContact = useContactModal();
  const openedInitialTopic = useRef(false);
  const triggerRefs = useRef<Record<Intent, HTMLButtonElement | null>>({ project: null, partnership: null, client: null });

  useEffect(() => {
    if (!validTopic || openedInitialTopic.current || !triggerRefs.current.project) return;
    openedInitialTopic.current = true;
    openContact("project", triggerRefs.current.project, validTopic);
  }, [openContact, validTopic]);

  useEffect(() => {
    let sent = false;
    const send = () => {
      if (sent) return;
      sent = trackAnalyticsEvent("contact_view", {
        previous_internal_path: previousInternalPath(),
      });
    };
    send();
    window.addEventListener(ANALYTICS_READY_EVENT, send);
    return () => window.removeEventListener(ANALYTICS_READY_EVENT, send);
  }, []);

  return (
    <>
      <div className={styles.paths} aria-label="Inquiry type">
        {paths.map(({ intent: pathIntent, title, Icon }) => (
          <button
            aria-haspopup="dialog"
            className={styles.path}
            key={pathIntent}
            onClick={(event) => openContact(pathIntent, event.currentTarget, validTopic)}
            ref={(element) => { triggerRefs.current[pathIntent] = element; }}
            type="button"
          >
            <span className={styles.iconFrame} aria-hidden="true"><Icon className={styles.icon} /></span>
            <span className={styles.title}>{title}</span>
          </button>
        ))}
      </div>

      <p className={styles.emailFallback}>Prefer email? Write to us at <a href="mailto:office@entimema.net">office@entimema.net</a>.</p>
    </>
  );
}
