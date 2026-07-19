export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`site-brand${compact ? " site-brand--compact" : ""}`}>
      <svg
        className="site-brand__mark"
        viewBox="0 0 64 64"
        role="img"
        aria-label="Entimema"
      >
        <rect x="3" y="3" width="58" height="58" rx="14" fill="#071B52" />
        <path
          d="M18 18h28v6H25v8h17v6H25v8h21v6H18V38h-6v-6h6V18Z"
          fill="white"
        />
      </svg>
      <span className="site-brand__word">Entimema</span>
    </span>
  );
}
