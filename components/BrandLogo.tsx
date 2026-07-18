export default function BrandLogo() {
  return (
    <a className="site-brand" href="#home" aria-label="Entimema — начало">
      <svg
        className="site-brand__mark"
        viewBox="0 0 72 72"
        role="img"
        aria-label="Entimema"
      >
        <defs>
          <linearGradient id="entimemaMark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0A225F" />
            <stop offset="1" stopColor="#061746" />
          </linearGradient>
          <filter id="markShadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodColor="#071848" floodOpacity="0.16" />
          </filter>
        </defs>
        <rect x="2" y="2" width="68" height="68" rx="9" fill="url(#entimemaMark)" filter="url(#markShadow)" />
        <path d="M28 21.5H48.5V26H33.5V34.6H45.3V39H33.5V50H49V54.5H28V39H22.2V34.6H28V21.5Z" fill="white" />
        <rect x="13" y="50" width="9.5" height="4.5" rx=".7" fill="white" />
      </svg>
      <span className="site-brand__word">Entimema</span>
    </a>
  );
}
