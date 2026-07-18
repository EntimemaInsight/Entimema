import type { HTMLAttributes, ReactNode } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Container({ children, className = "", ...props }: ContainerProps) {
  const classes = ["site-container", className].filter(Boolean).join(" ");
  return <div className={classes} {...props}>{children}</div>;
}
