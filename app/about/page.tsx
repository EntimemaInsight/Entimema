import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GENERAL_CONSULTING_CTA } from "@/lib/cta-labels";
import AboutHeader from "@/components/AboutHeader";
import styles from "./about.module.css";
import AboutMotion from "./AboutMotion";
import { createFounderSchema, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About Entimema | Financial Architecture & Decision Science",
  description: "Entimema connects finance, risk, data, models and technology to build clearer decision systems for real business environments.",
  alternates: { canonical: "/about" },
};

const pillars = [
  { title: "FINANCIAL MANAGEMENT", subtitle: "Controlling, accounting and management reporting.", text: "Financial disciplines connected to the decisions and operating environment they support.", icon: "pie" },
  { title: "RISK & MODELS", subtitle: "Credit risk and quantitative analysis.", text: "Models interpreted within the policy, operational and management context where decisions are made.", icon: "chart" },
  { title: "SYSTEMS & DATA", subtitle: "SAP, ERP and operational environments.", text: "Financial logic, operations and data structured to work together as one practical system.", icon: "data" },
  { title: "AI & AUTOMATION", subtitle: "Integrations, agents and controlled workflows.", text: "Technology used to reduce complexity while human judgement and accountability remain in control.", icon: "ai" },
];

const principles = [
  ["CONTEXT BEFORE TOOLS", "Start with the business question. Choose the model, technology or method only after the problem is understood."],
  ["ANALYSIS MUST LEAD TO ACTION", "A model creates value when it changes a real management decision."],
  ["FINANCE AND RISK BELONG TO OPERATIONS", "They work best when connected to how the business actually runs."],
  ["TECHNOLOGY SHOULD REDUCE COMPLEXITY", "AI and automation should make decisions clearer and execution more consistent — not simply add another layer of technology."],
];

const workSteps = [
  "UNDERSTAND THE CONTEXT — We begin with the business environment, the decision and the people who depend on it.",
  "STRUCTURE THE PROBLEM — We separate symptoms from causes and define the variables, constraints and relationships that matter.",
  "BUILD THE MODEL — We translate the problem into financial logic, analytical models, decision rules or system architecture.",
  "TEST IN THE REAL ENVIRONMENT — We test assumptions against actual data, operational constraints and real decision scenarios.",
  "EMBED THE SOLUTION — We connect the model to reporting, workflows, systems or decision processes where it creates practical value.",
  "IMPROVE THROUGH FEEDBACK — We observe outcomes, challenge assumptions and refine the system as new evidence emerges.",
];

function PillarIcon({ type }: { type: string }) {
  if (type === "pie") return <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16 3v13h13A13 13 0 1 1 16 3Z"/><path d="M19 3.5A12.5 12.5 0 0 1 28.5 13H19Z"/></svg>;
  if (type === "chart") return <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M4 27V5M4 27h24"/><path d="m8 22 6-7 5 3 8-10"/><path d="M22 8h5v5"/></svg>;
  if (type === "data") return <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><ellipse cx="16" cy="7" rx="10" ry="4"/><path d="M6 7v9c0 2.2 4.5 4 10 4s10-1.8 10-4V7M6 16v9c0 2.2 4.5 4 10 4s10-1.8 10-4v-9"/></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M16 2v28M2 16h28M6 6l20 20M26 6 6 26"/><circle cx="16" cy="16" r="4"/></svg>;
}

export default function AboutPage() {
  return (
    <main className={`about-page about-typography ${styles.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(createFounderSchema()) }} />
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
                const [cx, cy] = p.split(","); return <circle key={p} cx={cx} cy={cy} r="5" />;
              })}
            </g>
          </svg>
        </div>

        <AboutMotion>
          <div className="about-shell">
            <div className={`about-intro ${styles.heroReveal}`} data-about-reveal="hero">
              <p className="about-eyebrow">ABOUT ENTIMEMA</p>
              <h1>Better decisions need more than data.<br />They need structure.</h1>
              <span className="about-accent-rule" />
              <p className="about-lead">Entimema connects finance, risk, data and technology into decision systems built for real business environments.</p>
            </div>

            <section className={styles.narrativeSection} aria-labelledby="about-why-title" data-about-reveal="section">
              <p className={styles.narrativeLabel}>WHY ENTIMEMA</p>
              <div className={styles.narrativeGrid}>
                <h2 id="about-why-title">More information does not create more control.<br />Better structure does.</h2>
                <div className={styles.narrativeCopy}>
                  <p>Most organisations already have data, models and systems. The problem is that they often operate with different definitions, different logic and different decision paths.</p>
                  <p>Entimema connects them into one practical architecture — from evidence to action.</p>
                </div>
              </div>
            </section>

            <section className={styles.narrativeSection} aria-labelledby="about-thinking-title" data-about-reveal="section">
              <p className={styles.narrativeLabel}>WAY OF THINKING</p>
              <div className={styles.narrativeGrid}>
                <h2 id="about-thinking-title">A model matters only when it changes the decision.</h2>
                <ol className={styles.principles}>
                  {principles.map(([title, copy]) => <li key={title}><strong>{title}</strong><span>{copy}</span></li>)}
                </ol>
              </div>
            </section>

            <section className={styles.narrativeSection} aria-labelledby="about-work-title" data-about-reveal="section">
              <p className={styles.narrativeLabel}>HOW WE WORK</p>
              <div className={styles.narrativeGrid}>
                <h2 id="about-work-title">From the real problem to a system that works.</h2>
                <ol className={styles.workSequence}>
                  {workSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>)}
                </ol>
              </div>
            </section>

            <article className={`founder-card ${styles.experienceReveal}`} data-about-reveal="experience">
              <div className="founder-card__portrait">
                <Image src="/aleksandar-about.png" alt="Aleksandar Dimitrov, Founder of Entimema" fill sizes="(max-width: 900px) 100vw, 34vw" />
              </div>
              <div className="founder-card__content">
                <div className="founder-card__bio">
                  <p className="founder-card__label">FOUNDER</p>
                  <h2>Built from practice, not theory alone.</h2>
                  <p>Entimema is shaped by experience across financial management, controlling, accounting, SAP and ERP environments, credit risk, quantitative analysis and automation.</p>
                  <p>That perspective matters because models do not operate in isolation. They have to work inside real reporting cycles, operational constraints, systems and management decisions.</p>
                  <p><strong>Alexander Dimitrov</strong><br />Founder, Entimema</p>
                  <p className={styles.personalStatement}>The best model is not the most complex one. It is the one an organisation can understand, use and improve.</p>
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
              <span>ENTIMEMA LABS</span>
              <div>
                <h2 id="about-future-title">Expertise should become repeatable.</h2>
                <p>Entimema Labs is where financial and risk expertise becomes reusable models, AI-assisted workflows and decision tools — while human judgement remains in control.</p>
                <p>It is the bridge from individual advisory projects to repeatable systems and technology-enabled solutions.</p>
              </div>
            </section>

            <section className={styles.conversation} aria-labelledby="about-conversation-title" data-about-reveal="section">
              <p className={styles.narrativeLabel}>NEXT STEP</p>
              <h2 id="about-conversation-title">Every strong model starts with the right question.</h2>
              <p>Bring us the decision, process or system you are trying to improve. We will start by understanding the structure behind it.</p>
              <Link href="/contact">{GENERAL_CONSULTING_CTA}</Link>
            </section>
          </div>
        </AboutMotion>
      </section>
      <footer className={styles.minimalFooter}>
        <div className={styles.minimalFooterInner}>
          <span>© 2026 Entimema</span>
          <Link href="/privacy">Privacy</Link>
        </div>
      </footer>
    </main>
  );
}
