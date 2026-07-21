import type { ElementType, ReactNode } from "react";

type SectionHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  variant?: "display" | "section";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export default function SectionHeader({
  title,
  subtitle,
  children,
  as = "h2",
  id,
  variant = "section",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: SectionHeaderProps) {
  const Heading = as as ElementType;
  const classes = ["section-header", `section-header--${variant}`, className]
    .filter(Boolean)
    .join(" ");
  const titleClasses = ["section-header__title", titleClassName].filter(Boolean).join(" ");
  const subtitleClasses = ["section-header__subtitle", subtitleClassName].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <Heading className={titleClasses} id={id}>
        {title}
      </Heading>
      {subtitle ? <p className={subtitleClasses}>{subtitle}</p> : null}
      {children ? <div className="section-header__content">{children}</div> : null}
    </div>
  );
}
