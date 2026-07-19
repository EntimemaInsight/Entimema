const principles = [
  { key: "01", title: "Системно мислене", text: "Свързваме финансите, риска, процесите и данните в единна управленска архитектура." },
  { key: "02", title: "Измерим резултат", text: "Всяко решение започва с ясни критерии за ефект, контрол и устойчивост." },
  { key: "03", title: "Технологична реализация", text: "Проектираме модели и автоматизации, които могат да бъдат внедрени, използвани и развивани." },
  { key: "04", title: "Независима перспектива", text: "Работим с фокус върху реалната стойност за бизнеса, не върху конкретен софтуер или доставчик." },
];

export default function TrustLayer() {
  return (
    <section className="trust-layer" aria-label="Защо Entimema">
      <div className="site-container trust-layer__inner">
        <div className="trust-layer__heading">
          <p className="section-eyebrow">Как работим</p>
          <h2>Строгостта на финансовата функция.<br /><em>Скоростта на технологичен продукт.</em></h2>
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
