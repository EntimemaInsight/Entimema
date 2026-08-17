type BrandLogoProps = {
  compact?: boolean;
  reversed?: boolean;
};

export default function BrandLogo({ compact = false, reversed = false }: BrandLogoProps) {
  return (
    <span className={`site-brand${compact ? " site-brand--compact" : ""}${reversed ? " site-brand--reversed" : ""}`}>
      <svg
        className="site-brand__mark"
        viewBox="0 0 64 64"
        aria-hidden="true"
        focusable="false"
      >
        <rect x="3" y="3" width="58" height="58" rx="14" fill={reversed ? "white" : "#071B52"} />
        <path
          d="M18 18h28v6H25v8h17v6H25v8h21v6H18V38h-6v-6h6V18Z"
          fill={reversed ? "#071B52" : "white"}
        />
      </svg>
      <span className="site-brand__word">Entimema</span>
    </span>
  );
}
