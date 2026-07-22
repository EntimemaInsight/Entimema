import Image from "next/image";
import AboutHeader from "@/components/AboutHeader";
import styles from "./about.module.css";

const pillars = [
  {
    title: "Финанси",
    subtitle: "Корпоративни финанси, контролинг и FP&A",
    text: "Проектиране на финансови системи, които подобряват планирането, отчетността и управленските решения.",
    icon: "pie",
  },
  {
    title: "Риск",
    subtitle: "Количествено моделиране и анализ на риска",
    text: "Изграждане на аналитични модели, които измерват риска и подпомагат по-добрите управленски решения.",
    icon: "chart",
  },
  {
    title: "Системи",
    subtitle: "ERP, архитектура на данните и автоматизация",
    text: "Свързване на системи, данни и процеси в единна финансова архитектура.",
    icon: "data",
  },
  {
    title: "Agentic AI",
    subtitle: "AI агенти, Copilots и интелигентни работни процеси",
    text: "Прилагане на Agentic AI за автоматизация на финансови процеси и подпомагане на управленските решения.",
    icon: "ai",
  },
];

function PillarIcon({ type }: { type: string }) {
  if (type === "pie") return <svg viewBox="0 0 32 32"><path d="M16 3v13h13A13 13 0 1 1 16 3Z"/><path d="M19 3.5A12.5 12.5 0 0 1 28.5 13H19Z"/></svg>;
  if (type === "chart") return <svg viewBox="0 0 32 32"><path d="M4 27V5M4 27h24"/><path d="m8 22 6-7 5 3 8-10"/><path d="M22 8h5v5"/></svg>;
  if (type === "data") return <svg viewBox="0 0 32 32"><ellipse cx="16" cy="7" rx="10" ry="4"/><path d="M6 7v9c0 2.2 4.5 4 10 4s10-1.8 10-4V7M6 16v9c0 2.2 4.5 4 10 4s10-1.8 10-4v-9"/></svg>;
  return <svg viewBox="0 0 32 32"><path d="M16 2v28M2 16h28M6 6l20 20M26 6 6 26"/><circle cx="16" cy="16" r="4"/></svg>;
}

export default function AboutPage() {
  return (
    <main className={`about-page ${styles.page}`}>
      <AboutHeader />
      <section className="about-hero">
        <div className="about-network" aria-hidden="true">
          <svg viewBox="0 0 760 760" preserveAspectRatio="xMidYMid slice">
            <g className="about-network__lines">
              <path d="M300 0 235 95 315 275 140 330 375 440 650 355 520 155 235 95" />
              <path d="M315 275 485 220 520 155M315 275 375 440 520 610M375 440 210 665M650 355 760 505M520 610 720 760" />
            </g>
            <g className="about-network__nodes">
              {["235,95","315,275","140,330","375,440","650,355","520,155","485,220","520,610","210,665"].map((p) => {
                const [cx,cy]=p.split(','); return <circle key={p} cx={cx} cy={cy} r="5" />;
              })}
            </g>
          </svg>
        </div>

        <div className="about-shell">
          <div className="about-intro">
            <p className="about-eyebrow">ЗА ENTIMEMA</p>
            <h1>Изграждаме финансови<br/>системи. Създаваме увереност.</h1>
            <span className="about-accent-rule" />
            <p className="about-lead">
              Entimema е създадена около една проста идея: добрите решения са следствие от добре изградени системи.<br/>
              Изграждаме финансова архитектура, която прави организациите по-ясни, по-предвидими и по-управляеми.
            </p>
          </div>

          <article className="founder-card">
            <div className="founder-card__portrait">
              <Image src="/aleksandar-about.png" alt="Александър Димитров, основател на Entimema" fill priority sizes="(max-width: 900px) 100vw, 34vw" />
            </div>
            <div className="founder-card__content">
              <div className="founder-card__bio">
                <p className="founder-card__label">ОСНОВАТЕЛ</p>
                <h2>Александър Димитров</h2>
                <p>Работи в пресечната точка на корпоративните финанси, количественото моделиране на риска и Agentic AI. Проектира финансови системи, които превръщат сложността в по-добри управленски решения.</p>
                <p>Работата му свързва стратегия, данни и технологии в единна финансова архитектура, която създава по-ясна основа за планиране, измерване и вземане на решения.</p>
              </div>
              <div className="founder-pillars">
                {pillars.map((pillar) => (
                  <section className="founder-pillar" key={pillar.title}>
                    <div className="founder-pillar__title"><PillarIcon type={pillar.icon} /><h3>{pillar.title}</h3></div>
                    <p className="founder-pillar__subtitle">{pillar.subtitle}</p>
                    <p>{pillar.text}</p>
                  </section>
                ))}
              </div>
            </div>
          </article>

          <div className="about-labs-seed">
            <span>ENTIMEMA LABS</span>
            <p>Изследователската и продуктова линия на Entimema — мястото, в което финансовата архитектура, моделирането и Agentic AI ще се превръщат в собствени технологии.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
