export default function BrandLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`site-brand${compact ? " site-brand--compact" : ""}`}>
      <svg className="site-brand__mark" viewBox="0 0 48 48" role="img" aria-label="Entimema">
        <rect x="1" y="1" width="46" height="46" rx="13" fill="currentColor" />
        <path d="M14 14h20v4H19v4h12v4H19v4h15v4H14V14Z" fill="white" />
        <circle cx="35" cy="14" r="2.25" fill="#FF5A1F" />
      </svg>
      <span className="site-brand__word">Entimema</span>
    </span>
  );
}
