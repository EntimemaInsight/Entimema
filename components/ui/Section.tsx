import type { HTMLAttributes, ReactNode } from "react";

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "section" | "article";
};

export default function Section({ children, as: Tag = "section", className = "", ...props }: SectionProps) {
  const classes = ["ui-section", className].filter(Boolean).join(" ");
  return <Tag className={classes} {...props}>{children}</Tag>;
}
