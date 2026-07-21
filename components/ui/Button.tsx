import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button(props: ButtonProps | LinkProps) {
  if ("href" in props && props.href) {
    const { children, variant = "primary", className = "", ...linkProps } = props;
    const classes = ["ui-button", `ui-button--${variant}`, className].filter(Boolean).join(" ");
    return <a className={classes} {...linkProps}>{children}</a>;
  }

  const { children, variant = "primary", className = "", ...buttonProps } = props as ButtonProps;
  const classes = ["ui-button", `ui-button--${variant}`, className].filter(Boolean).join(" ");
  return <button className={classes} {...buttonProps}>{children}</button>;
}
