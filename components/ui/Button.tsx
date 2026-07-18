import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  className?: string;
};

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Button(props: ButtonProps | LinkProps) {
  const variant = props.variant ?? "primary";
  const classes = ["ui-button", `ui-button--${variant}`, props.className ?? ""].filter(Boolean).join(" ");

  if ("href" in props && props.href) {
    const { children, variant: _variant, className: _className, ...linkProps } = props;
    return <a className={classes} {...linkProps}>{children}</a>;
  }

  const { children, variant: _variant, className: _className, ...buttonProps } = props as ButtonProps;
  return <button className={classes} {...buttonProps}>{children}</button>;
}
