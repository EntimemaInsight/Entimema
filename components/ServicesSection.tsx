import Link from "next/link";

const services = [
  {
    number: "01",
    title: "Финансова архитектура",
    description: "Проектираме финансови системи, които превръщат данните в управленски решения, а стратегията – в изпълнение.",
    cta: "Разгледайте финансовата архитектура",
    href: "/services/financial-architecture",
    icon: "architecture",
    tone: "peach",
  },
  {
    number: "02",
    title: "Кредитен риск",
    description: "Изграждаме модели и системи за оценка, мониторинг и управление на кредитния риск за банки и небанкови финансови институции.",
    cta: "Разгледайте решенията",
    href: "/services/credit-risk",
    icon: "shield",
    tone: "sand",
  },
  {
    number: "03",
    title: "Данни, AI и автоматизация",
    description: "Свързваме данни, изкуствен интелект и автоматизация в единна среда за по-бързи и по-добри управленски решения.",
    cta: "Разгледайте решенията",
    href: "/services/data-ai-automation",
    icon: "data",
    tone: "lavender",
  },
  {
    number: "04",
    title: "Финансова трансформация",
    description: "Трансформираме финансовата функция чрез процеси, технологии и управленски модели, които повишават ефективността.",
    cta: "Разгледайте трансформацията",
    href: "/services/finance-transformation",
    icon: "people",
    tone: "peach",
  },
  {
    number: "05",
    title: "CFO функция",
    description: "Изграждаме или поемаме CFO функцията като стратегически партньор на бизнеса – от планирането до управленските решения.",
    cta: "Разгледайте CFO услугите",
    href: "/services/cfo",
    icon: "dashboard",
    tone: "mint",
  },
  {
    number: "06",
    title: "AI решения за финанси",
    description: "Разработваме AI агенти, които автоматизират финансовия анализ, подпомагат вземането на решения и работят като дигитални членове на финансовия екип.",
    cta: "Разгледайте AI решенията",
    href: "/services/ai-finance",
    icon: "ai",
    tone: "sky",
    badge: "НОВО",
  },
] as const;

function ServiceIcon({ name }: { name: (typeof services)[number]["icon"] }) {
  if (name === "architecture") return <svg viewBox="0 0 64 64"><path d="M32 8 10 20v24l22 12 22-12V20L32 8Z"/><circle cx="32" cy="8" r="4"/><circle cx="10" cy="20" r="4"/><circle cx="54" cy="20" r="4"/><circle cx="10" cy="44" r="4"/><circle cx="54" cy="44" r="4"/><circle cx="32" cy="56" r="4"/><path d="M32 12v16m-18-6 14 8m22-8-14 8m-22 12 14-8m22 8-14-8m-4-2v20"/><path className="accent" d="m28 28 4 4 5-6"/></svg>;
  if (name === "shield") return <svg viewBox="0 0 64 64"><path d="M32 7c8 7 14 8 22 10v14c0 13-8 21-22 27C18 52 10 44 10 31V17c8-2 14-3 22-10Z"/><path d="M16 21v10c0 9 5 15 16 20 11-5 16-11 16-20V21"/><path className="accent" d="m24 31 6 6 11-14"/></svg>;
  if (name === "data") return <svg viewBox="0 0 64 64"><ellipse cx="22" cy="14" rx="13" ry="6"/><path d="M9 14v27c0 3 6 6 13 6s13-3 13-6V14M9 27c0 3 6 6 13 6s13-3 13-6M9 40c0 3 6 6 13 6"/><path d="M42 17h8v10h-8v12h8v10h-8M35 22h7m-7 22h7"/><circle className="accent" cx="54" cy="22" r="4"/><circle className="accent" cx="54" cy="44" r="4"/></svg>;
  if (name === "people") return <svg viewBox="0 0 64 64"><circle cx="32" cy="13" r="7"/><path d="M20 30c1-8 23-8 24 0v6H20v-6ZM15 49c0-6-10-6-10 0v7h10v-7Zm44 0c0-6-10-6-10 0v7h10v-7ZM27 49c0-6-10-6-10 0v7h10v-7Zm20 0c0-6-10-6-10 0v7h10v-7ZM10 43v-7h44v7M32 36v13"/></svg>;
  if (name === "dashboard") return <svg viewBox="0 0 64 64"><rect x="8" y="10" width="48" height="35" rx="2"/><path d="M20 54h24M27 45v9m10-9v9M14 17h22v22H14V17Zm28 1h8m-8 7h8m-8 7h8"/><circle cx="25" cy="28" r="7"/><path className="accent" d="M25 21v7h6"/></svg>;
  return <svg viewBox="0 0 64 64"><path d="M31 7c-12 0-20 8-20 19 0 7 4 11 8 15 3 3 4 7 4 12h18c0-5 1-9 4-12 4-4 8-8 8-15C53 15 44 7 31 7Z"/><path d="M25 57h14M21 32h9l4-8 5 15 4-7h10"/><circle className="accent" cx="20" cy="32" r="3"/><circle className="accent" cx="34" cy="24" r="3"/><circle className="accent" cx="39" cy="39" r="3"/><circle className="accent" cx="53" cy="32" r="3"/></svg>;
}

export default function ServicesSection() {
  return (
    <section className="services-hero" aria-labelledby="services-title">
      <div className="services-hero__dots" aria-hidden="true" />
      <div className="site-container services-hero__inner">
        <div className="services-hero__heading">
          <h1 id="services-title">Превръщаме<br/><em>сложността в яснота.</em></h1>
        </div>
        <p className="services-hero__lead">Всяка област носи собствена стойност.<br/>Заедно изграждат интегрирана<br/>управленска архитектура.</p>

        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              {"badge" in service && service.badge ? <span className="service-card__badge">{service.badge}</span> : null}
              <div className={`service-card__icon service-card__icon--${service.tone}`}>
                <ServiceIcon name={service.icon} />
              </div>
              <div className="service-card__copy">
                <div className="service-card__number">{service.number}</div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
              </div>
              <Link className="service-card__link" href={service.href}>
                <span>{service.cta}</span><b aria-hidden="true">→</b>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
