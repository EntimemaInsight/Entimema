const principles = [
  { key: "01", title: "Systems thinking", text: "Connect finance, risk, processes and data in one management architecture." },
  { key: "02", title: "Measurable outcomes", text: "Begin each decision with clear criteria for impact, control and resilience." },
  { key: "03", title: "Technical implementation", text: "Design models and automation that can be implemented, used and developed over time." },
  { key: "04", title: "Independent perspective", text: "Focus on business value rather than a specific software product or provider." },
];

export default function TrustLayer() {
  return (
    <section className="trust-layer" aria-label="Why Entimema">
      <div className="site-container trust-layer__inner">
        <div className="trust-layer__heading">
          <h2>The rigour of the finance function.<br /><em>The discipline of a technology product.</em></h2>
        </div>
        <div className="trust-layer__grid">
          {principles.map((item) => (
            <article key={item.key}><span>{item.key}</span><h3>{item.title}</h3><p>{item.text}</p></article>
          ))}
        </div>
      </div>
    </section>
  );
}
