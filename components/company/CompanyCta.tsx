import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./company.module.css";

/** Company-only presentation; callers retain the existing label, arrow and href. */
export default function CompanyCta({ className = "", ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`${className} ${styles.cta}`} data-company-cta />;
}
