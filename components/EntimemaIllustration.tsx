import type React from "react";

type IllustrationName =
  | "finance"
  | "risk"
  | "data"
  | "transformation"
  | "cfo"
  | "ai"
  | "understand"
  | "structure"
  | "model"
  | "automate"
  | "scale";

export default function EntimemaIllustration({
  name,
  compact = false,
}: {
  name: IllustrationName;
  compact?: boolean;
}) {
  const className = `ent-illustration${compact ? " ent-illustration--compact" : ""}`;

  if (name === "finance") {
    return (
      <svg className={className} viewBox="0 0 180 112" aria-hidden="true">
        <g className="ent-illustration__surface">
          <rect x="12" y="14" width="156" height="84" rx="18" />
          <path d="M12 38h156" />
        </g>
        <g className="ent-illustration__muted">
          <rect x="28" y="52" width="32" height="28" rx="6" />
          <rect x="74" y="45" width="32" height="35" rx="6" />
          <rect x="120" y="34" width="32" height="46" rx="6" />
        </g>
        <path className="ent-illustration__accent" d="m30 74 26-18 23 9 30-24 38 8" />
        <circle className="ent-illustration__accent-fill" cx="109" cy="41" r="3.5" />
        <circle className="ent-illustration__accent-fill" cx="147" cy="49" r="3.5" />
      </svg>
    );
  }

  if (name === "risk") {
    return (
      <svg className={className} viewBox="0 0 180 112" aria-hidden="true">
        <g className="ent-illustration__surface">
          <rect x="10" y="14" width="160" height="84" rx="18" />
        </g>
        <g className="ent-illustration__muted">
          <rect x="25" y="34" width="36" height="44" rx="9" />
          <rect x="72" y="34" width="36" height="44" rx="9" />
          <rect x="119" y="34" width="36" height="44" rx="9" />
          <path d="M61 56h11M108 56h11" />
        </g>
        <circle className="ent-illustration__accent-fill" cx="43" cy="46" r="5" />
        <path className="ent-illustration__accent" d="m83 57 6 6 10-14" />
        <path className="ent-illustration__accent" d="M129 62h16M137 54v16" />
      </svg>
    );
  }

  if (name === "data") {
    return (
      <svg className={className} viewBox="0 0 180 112" aria-hidden="true">
        <g className="ent-illustration__surface"><rect x="10" y="14" width="160" height="84" rx="18" /></g>
        <g className="ent-illustration__muted">
          <rect x="24" y="31" width="38" height="18" rx="7" />
          <rect x="24" y="63" width="38" height="18" rx="7" />
          <rect x="118" y="47" width="38" height="18" rx="7" />
          <path d="M62 40h24m0 0v32m0-16h32M62 72h24" />
        </g>
        <circle className="ent-illustration__accent-fill" cx="86" cy="56" r="7" />
        <path className="ent-illustration__accent" d="M81 56h10M86 51v10" />
      </svg>
    );
  }

  if (name === "transformation") {
    return (
      <svg className={className} viewBox="0 0 180 112" aria-hidden="true">
        <g className="ent-illustration__surface"><rect x="10" y="14" width="160" height="84" rx="18" /></g>
        <g className="ent-illustration__muted">
          <rect x="25" y="38" width="42" height="36" rx="9" />
          <rect x="113" y="38" width="42" height="36" rx="9" />
          <path d="M67 56h46" />
        </g>
        <path className="ent-illustration__accent" d="m101 47 12 9-12 9" />
        <path className="ent-illustration__accent" d="M35 49h22M35 57h16M35 65h10" />
        <path className="ent-illustration__accent" d="M123 48h22M123 56h22M123 64h22" />
      </svg>
    );
  }

  if (name === "cfo") {
    return (
      <svg className={className} viewBox="0 0 180 112" aria-hidden="true">
        <g className="ent-illustration__surface"><rect x="10" y="14" width="160" height="84" rx="18" /><path d="M10 38h160" /></g>
        <g className="ent-illustration__muted">
          <rect x="24" y="49" width="54" height="34" rx="8" />
          <rect x="90" y="49" width="66" height="10" rx="5" />
          <rect x="90" y="69" width="48" height="10" rx="5" />
        </g>
        <path className="ent-illustration__accent" d="m31 73 12-10 10 4 16-14" />
        <circle className="ent-illustration__accent-fill" cx="69" cy="53" r="3.5" />
      </svg>
    );
  }

  if (name === "ai") {
    return (
      <svg className={className} viewBox="0 0 180 112" aria-hidden="true">
        <g className="ent-illustration__surface"><rect x="10" y="14" width="160" height="84" rx="18" /></g>
        <g className="ent-illustration__muted">
          <circle cx="43" cy="56" r="14" />
          <circle cx="90" cy="56" r="18" />
          <circle cx="137" cy="56" r="14" />
          <path d="M57 56h15M108 56h15" />
        </g>
        <path className="ent-illustration__accent" d="M83 56h14M90 49v14" />
        <circle className="ent-illustration__accent-fill" cx="43" cy="56" r="4" />
        <circle className="ent-illustration__accent-fill" cx="137" cy="56" r="4" />
      </svg>
    );
  }

  const stageMap: Record<Exclude<IllustrationName, "finance" | "risk" | "data" | "transformation" | "cfo" | "ai">, React.ReactNode> = {
    understand: <><circle cx="38" cy="44" r="17" /><path d="m51 57 14 14" /><path className="ent-illustration__accent" d="M30 44h16M38 36v16" /></>,
    structure: <><rect x="18" y="24" width="40" height="40" rx="10" /><path d="M38 64v14M22 78h32" /><path className="ent-illustration__accent" d="M28 34h20M28 44h14M28 54h18" /></>,
    model: <><rect x="17" y="23" width="42" height="42" rx="10" /><path d="M27 77h22" /><path className="ent-illustration__accent" d="m26 53 8-10 8 5 8-14" /></>,
    automate: <><circle cx="38" cy="45" r="19" /><path d="M38 19v8M38 63v8M12 45h8M56 45h8" /><path className="ent-illustration__accent" d="m32 45 5 5 9-12" /></>,
    scale: <><path d="M18 64h42V22" /><path d="m24 55 10-10 9 5 14-18" /><path className="ent-illustration__accent" d="M48 32h9v9" /></>,
  };

  return <svg className={className} viewBox="0 0 76 88" aria-hidden="true"><g className="ent-illustration__muted">{stageMap[name]}</g></svg>;
}
