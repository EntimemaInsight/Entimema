"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "finance" | "risk";

type Scene = {
  mode: Mode;
  name: string;
  role: string;
  image: string;
  company: string;
  industry: string;
  period: string;
  topTags: string[];
  orbitTags: string[];
  leftTitle: string;
  leftSteps: string[];
  leftResult: string;
  leftMeta: string;
  rightTitle: string;
  rightSteps: string[];
  rightResult: string;
  rightMeta: string;
  outputTitle: string;
  outputText: string;
};

const scenes: Record<Mode, Scene> = {
  finance: {
    mode: "finance",
    name: "Elena Angelova",
    role: "Chief Financial Officer",
    image: "/elena-angelova.webp",
    company: "Industrial Group",
    industry: "Manufacturing",
    period: "FY 2026",
    topTags: ["P&L", "Balance Sheet", "Cash Flow", "Budget", "KPI"],
    orbitTags: ["Forecast", "Working Capital", "Management Report", "Financial Model", "Management Analysis", "Scenario Analysis", "Board Report", "Decision Support"],
    leftTitle: "Financial Intelligence",
    leftSteps: ["Connecting to ERP…", "Reading financial data…", "Checking consistency…", "Detecting anomalies…"],
    leftResult: "Insights generated.",
    leftMeta: "8 key findings.",
    rightTitle: "Management Intelligence",
    rightSteps: ["Analyzing performance…", "Running scenarios…", "Evaluating key drivers…", "Generating insights…"],
    rightResult: "Performance view ready.",
    rightMeta: "5 actions recommended.",
    outputTitle: "Decision Ready",
    outputText: "Management decision is ready for review.",
  },
  risk: {
    mode: "risk",
    name: "Elisaveta Geneva",
    role: "Risk Manager",
    image: "/elisaveta-geneva.webp",
    company: "Financial Group",
    industry: "Banking & Finance",
    period: "FY 2026",
    topTags: ["Credit Risk", "Market Risk", "Liquidity Risk", "Operational Risk", "Compliance"],
    orbitTags: ["PD / LGD", "Scenario Analysis", "Stress Testing", "Exposure", "Concentration", "Risk Dashboard", "Fraud Detection", "Decision Support"],
    leftTitle: "Risk Intelligence",
    leftSteps: ["Collecting risk data…", "Calculating exposures…", "Assessing probabilities…", "Detecting risk drivers…"],
    leftResult: "Risk insights generated.",
    leftMeta: "7 key alerts.",
    rightTitle: "Scenario Analysis",
    rightSteps: ["Running stress scenarios…", "Evaluating impact…", "Testing assumptions…", "Generating risk view…"],
    rightResult: "Scenarios validated.",
    rightMeta: "4 scenarios completed.",
    outputTitle: "Risk Assessment Complete",
    outputText: "Risk profile confirmed. Decision ready.",
  },
};

function MiniIcon({ type }: { type: "brain" | "shield" | "chart" }) {
  if (type === "shield") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 19 6v5c0 4.8-2.7 8.2-7 10-4.3-1.8-7-5.2-7-10V6l7-3Z"/><path d="m9 12 2 2 4-5"/></svg>;
  }
  if (type === "chart") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/><path d="M16 7h3v3"/></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3c1.2 0 2.2-.7 3-1.6.8.9 1.8 1.6 3 1.6a3 3 0 0 0 3-3v-1a3 3 0 0 0 2-3 3 3 0 0 0-2-3V7a3 3 0 0 0-3-3c-1.2 0-2.2.7-3 1.6C11.2 4.7 10.2 4 9 4Z"/><path d="M12 6v12M8 8h4M12 10h4M8 14h4M12 16h4"/></svg>;
}

function AgentPanel({ side, scene }: { side: "left" | "right"; scene: Scene }) {
  const finance = scene.mode === "finance";
  const title = side === "left" ? scene.leftTitle : scene.rightTitle;
  const steps = side === "left" ? scene.leftSteps : scene.rightSteps;
  const result = side === "left" ? scene.leftResult : scene.rightResult;
  const meta = side === "left" ? scene.leftMeta : scene.rightMeta;
  const accent = side === "left" ? "violet" : finance ? "navy" : "orange";

  return (
    <article className={`executive-agent executive-agent--${side} executive-agent--${accent}`}>
      <header className="executive-agent__header">
        <span className="executive-agent__icon"><MiniIcon type={side === "left" ? "brain" : finance ? "chart" : "shield"} /></span>
        <span><strong>{title}</strong><small>AI Agent</small></span>
      </header>
      <div className="executive-agent__steps">
        {steps.map((step, i) => <div className="executive-agent__step" style={{ "--step": i } as React.CSSProperties} key={step}><i />{step}</div>)}
      </div>
      <div className="executive-agent__result"><span>✓</span><div><strong>{result}</strong><small>{meta}</small></div></div>
    </article>
  );
}

export default function DecisionArchitecture() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("finance");
  const scene = scenes[mode];

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setMode((current) => current === "finance" ? "risk" : "finance"), 7800);
    return () => window.clearInterval(id);
  }, [visible]);

  const tags = useMemo(() => scene.topTags, [scene]);

  return (
    <section className={`decision-architecture executive-intelligence is-${mode} ${visible ? "is-visible" : ""}`} ref={ref} aria-labelledby="decision-title">
      <div className="site-container executive-intelligence__inner">
        <h2 id="decision-title" className="sr-only">Интерактивна архитектура на управленските решения</h2>
        <div className="executive-intelligence__canvas">
          <div className="executive-intelligence__dots" aria-hidden="true" />
          <div className="executive-intelligence__glow" aria-hidden="true" />

          <div className="executive-intelligence__top-tags" key={`${mode}-top`}>
            {tags.map((tag, index) => <span style={{ "--tag": index } as React.CSSProperties} key={tag}>{tag}</span>)}
          </div>

          <svg className="executive-intelligence__connections" viewBox="0 0 1400 760" preserveAspectRatio="none" aria-hidden="true">
            <path d="M700 118 C700 175 700 205 700 245" />
            <path d="M430 120 C470 172 515 196 576 238" />
            <path d="M970 120 C930 172 885 196 824 238" />
            <path d="M345 380 C430 380 480 380 545 380" />
            <path d="M1055 380 C970 380 920 380 855 380" />
            <path d="M700 520 C700 565 700 588 700 630" />
          </svg>

          <div className="executive-intelligence__layout" key={mode}>
            <AgentPanel side="left" scene={scene} />

            <div className="executive-profile">
              <div className="executive-profile__image">
                <Image src={scene.image} alt={`${scene.name}, ${scene.role}`} fill priority sizes="(max-width: 760px) 86vw, 420px" />
                <div className="executive-profile__veil" />
              </div>
              <div className="executive-profile__identity">
                <strong>{scene.name}</strong>
                <span>{scene.role}</span>
                <dl>
                  <div><dt>Company</dt><dd>{scene.company}</dd></div>
                  <div><dt>Industry</dt><dd>{scene.industry}</dd></div>
                  <div><dt>Period</dt><dd>{scene.period}</dd></div>
                </dl>
              </div>
            </div>

            <AgentPanel side="right" scene={scene} />
          </div>

          <div className="executive-intelligence__orbit" key={`${mode}-orbit`}>
            {scene.orbitTags.map((tag, index) => <span className={`executive-orbit-tag executive-orbit-tag--${index + 1}`} style={{ "--tag": index } as React.CSSProperties} key={tag}>{tag}</span>)}
          </div>

          <div className="executive-intelligence__output" key={`${mode}-output`}>
            <span className="executive-intelligence__check">✓</span>
            <div><strong>{scene.outputTitle}</strong><small>{scene.outputText}</small></div>
          </div>

          <div className="executive-intelligence__switch" role="group" aria-label="Смяна на профил">
            <button className={mode === "finance" ? "is-active" : ""} onClick={() => setMode("finance")} aria-label="Покажи CFO профил">Finance</button>
            <button className={mode === "risk" ? "is-active" : ""} onClick={() => setMode("risk")} aria-label="Покажи Risk Manager профил">Risk</button>
          </div>
        </div>
      </div>
    </section>
  );
}
