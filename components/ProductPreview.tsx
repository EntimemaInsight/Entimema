export default function ProductPreview() {
  return (
    <div className="product-preview" aria-label="Демонстрационен интерфейс на Entimema OS">
      <div className="product-preview__topbar">
        <div className="product-preview__identity">
          <span className="product-preview__signal" />
          <span>Entimema OS</span>
        </div>
        <div className="product-preview__status"><i /> Live model</div>
      </div>

      <div className="product-preview__body">
        <div className="product-preview__heading">
          <div><span>Executive scenario</span><strong>Base case · Q3 2026</strong></div>
          <button type="button" aria-label="Избор на сценарий">Scenario <b>⌄</b></button>
        </div>

        <div className="product-preview__metrics">
          <article><span>Revenue</span><strong>€12.8m</strong><em>+8.4%</em></article>
          <article><span>EBITDA</span><strong>€2.1m</strong><em>+1.7 pp</em></article>
          <article><span>Cash runway</span><strong>18.4 mo</strong><em className="is-neutral">stable</em></article>
        </div>

        <div className="product-preview__chart">
          <div className="product-preview__chart-head"><span>Forecast confidence</span><strong>94.6%</strong></div>
          <svg viewBox="0 0 520 180" role="img" aria-label="Прогнозна линия">
            <defs>
              <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0B2D72" stopOpacity=".18" />
                <stop offset="1" stopColor="#0B2D72" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="preview-grid" d="M0 35H520M0 80H520M0 125H520M85 0V180M170 0V180M255 0V180M340 0V180M425 0V180" />
            <path className="preview-area" d="M0 145C55 138 79 126 118 130C159 134 180 105 220 109C266 114 294 83 334 87C381 92 400 58 441 63C472 66 497 42 520 30V180H0Z" />
            <path className="preview-line" d="M0 145C55 138 79 126 118 130C159 134 180 105 220 109C266 114 294 83 334 87C381 92 400 58 441 63C472 66 497 42 520 30" />
            <circle className="preview-point" cx="520" cy="30" r="5" />
          </svg>
        </div>

        <div className="product-preview__decision">
          <div><span>AI recommendation</span><strong>Protect margin before accelerating growth.</strong></div>
          <span className="product-preview__confidence">High confidence</span>
        </div>
      </div>
    </div>
  );
}
