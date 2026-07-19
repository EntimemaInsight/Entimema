import Link from "next/link";
import EntimemaIllustration from "./EntimemaIllustration";

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
                <EntimemaIllustration name={{ architecture: "finance", shield: "risk", data: "data", people: "transformation", dashboard: "cfo", ai: "ai" }[service.icon] as "finance" | "risk" | "data" | "transformation" | "cfo" | "ai"} />
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
