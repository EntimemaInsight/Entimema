import Image from "next/image";
import Link from "next/link";
import AboutHeader from "@/components/AboutHeader";
import styles from "./about.module.css";
import AboutMotion from "./AboutMotion";

const pillars = [
  {
    title: "Финансово управление",
    subtitle: "Контролинг, счетоводство и управленска отчетност",
    text: "Практическа перспектива към планирането, измерването и финансовата дисциплина в реална бизнес среда.",
    icon: "pie",
  },
  {
    title: "Риск и модели",
    subtitle: "Кредитен риск и количествен анализ",
    text: "Свързване на моделите с управленския контекст, вместо изолирането им като отделна аналитична функция.",
    icon: "chart",
  },
  {
    title: "Системи и данни",
    subtitle: "SAP, ERP и производствена среда",
    text: "Разбиране как финансовата логика, операциите и данните трябва да работят заедно в една система.",
    icon: "data",
  },
  {
    title: "AI и автоматизация",
    subtitle: "Интеграции и работни процеси",
    text: "Използване на AI там, където той намалява ръчната работа и прави анализа по-последователен.",
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

        <AboutMotion>
        <div className="about-shell">
          <div className={`about-intro ${styles.heroReveal}`} data-about-reveal="hero">
            <p className="about-eyebrow">ЗА ENTIMEMA</p>
            <h1>Управлението започва там,<br/>където данните придобиват смисъл.</h1>
            <span className="about-accent-rule" />
            <p className="about-lead">
              Entimema свързва финансовото управление, риска, данните и технологиите в системи, които могат да се използват всеки ден.<br/>
              Подходът ни започва с разбиране на бизнеса и завършва с работещ начин за вземане на решения.
            </p>
          </div>

          <section className={styles.narrativeSection} aria-labelledby="about-why-title" data-about-reveal="section">
            <p className={styles.narrativeLabel}>ЗАЩО ENTIMEMA</p>
            <div className={styles.narrativeGrid}>
              <h2 id="about-why-title">Повече данни не означават по-добро управление.</h2>
              <div className={styles.narrativeCopy}>
                <p>Организациите рядко страдат от липса на информация. По-често финансите, рискът и операциите работят с различна логика, а важните зависимости остават между системите и екипите.</p>
                <p>Entimema съществува, за да свърже тези части в практичен управленски модел — с общи определения, измерими зависимости и ясен път от анализа до действието.</p>
              </div>
            </div>
          </section>

          <section className={styles.narrativeSection} aria-labelledby="about-thinking-title" data-about-reveal="section">
            <p className={styles.narrativeLabel}>НАЧИНЪТ НА МИСЛЕНЕ</p>
            <div className={styles.narrativeGrid}>
              <h2 id="about-thinking-title">Решението има стойност само ако работи в реална среда.</h2>
              <ol className={styles.principles}>
                <li><strong>Първо разбираме контекста.</strong><span>Инструментът идва след въпроса, не преди него.</span></li>
                <li><strong>Анализът трябва да води до действие.</strong><span>Моделът е полезен, когато променя конкретно управленско решение.</span></li>
                <li><strong>Финансите и рискът са част от операциите.</strong><span>Те работят най-добре като обща система, а не като отделни функции.</span></li>
                <li><strong>Технологията трябва да намалява сложността.</strong><span>AI и автоматизацията са средства за по-последователна работа, не само етикети.</span></li>
              </ol>
            </div>
          </section>

          <section className={styles.narrativeSection} aria-labelledby="about-work-title" data-about-reveal="section">
            <p className={styles.narrativeLabel}>КАК РАБОТИМ</p>
            <div className={styles.narrativeGrid}>
              <h2 id="about-work-title">От реалния казус до работещата система.</h2>
              <ol className={styles.workSequence}>
                {["Разбираме контекста", "Структурираме проблема", "Изграждаме модела", "Тестваме в реална среда", "Предаваме работещо решение", "Подобряваме чрез резултатите"].map((step, index) => (
                  <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
                ))}
              </ol>
            </div>
          </section>

          <article className={`founder-card ${styles.experienceReveal}`} data-about-reveal="experience">
            <div className="founder-card__portrait">
              <Image src="/aleksandar-about.png" alt="Александър Димитров, основател на Entimema" fill priority sizes="(max-width: 900px) 100vw, 34vw" />
            </div>
            <div className="founder-card__content">
              <div className="founder-card__bio">
                <p className="founder-card__label">ОПИТЪТ ЗАД ПОДХОДА</p>
                <h2>Александър Димитров</h2>
                <p>Подходът на Entimema е формиран от работа във финансово управление, контролинг, счетоводство, SAP и ERP среди, кредитен риск, количествен анализ и автоматизация.</p>
                <p>Тази перспектива свързва управленската отчетност с реалните операции — включително в производствена среда — и позволява моделите, данните и AI интеграциите да бъдат оценявани според това как работят на практика.</p>
                <p className={styles.personalStatement}>Създадох Entimema, защото доброто решение не е най-сложният модел, а този, който организацията може да разбере, използва и подобрява.</p>
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

          <section className={`about-labs-seed ${styles.futureSection}`} aria-labelledby="about-future-title" data-about-reveal="emphasis">
            <span>КАКВО ИЗГРАЖДАМЕ</span>
            <div>
              <h2 id="about-future-title">Експертиза, превърната в повторяеми системи.</h2>
              <p>Entimema започва като консултантска компания и постепенно развива AI-подпомогнати финансови и рискови решения. Посоката е ясна: човешката преценка да остане водеща, а автоматизацията да поеме повтаряемата работа и да направи добрите практики по-последователни.</p>
              <p>Това не е традиционен консултантски модел и не е просто софтуер. Това е практичен път от експертизата към системи и продукти, изграждани върху реални управленски казуси.</p>
            </div>
          </section>

          <section className={styles.conversation} aria-labelledby="about-conversation-title" data-about-reveal="section">
            <p className={styles.narrativeLabel}>СЛЕДВАЩАТА СТЪПКА</p>
            <h2 id="about-conversation-title">Всеки устойчив модел започва с точно разбиране на конкретния казус.</h2>
            <Link href="/contact">Обсъдете вашия казус <span aria-hidden="true">→</span></Link>
          </section>
        </div>
        </AboutMotion>
      </section>
    </main>
  );
}
