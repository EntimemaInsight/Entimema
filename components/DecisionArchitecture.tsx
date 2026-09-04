"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

type Mode = "finance" | "risk";

const subscribeToMobile = (onChange: () => void) => {
  const query = window.matchMedia("(max-width: 760px)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getMobileSnapshot = () => window.matchMedia("(max-width: 760px)").matches;
const getServerMobileSnapshot = () => false;

const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const getReducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getServerReducedMotionSnapshot = () => false;

const subscribeToPageVisibility = (onChange: () => void) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const getPageVisibilitySnapshot = () => document.visibilityState === "visible";
const getServerPageVisibilitySnapshot = () => true;

type Scene = {
  mode: Mode;
  name: string;
  role: string;
  image: string;
  company: string;
  industry: string;
  period: string;
  leftTitle: string;
  leftSteps: string[];
  leftResult: string;
  leftMeta: string;
  rightTitle: string;
  rightSteps: string[];
  rightResult: string;
  rightMeta: string;
  outputStates: { title: string; text: string }[];
};

const scenes: Record<Mode, Scene> = {
  finance: {
    mode: "finance",
    name: "Illustrative CFO Workspace",
    role: "Chief Financial Officer",
    image: "/elena-angelova-v2.webp",
    company: "Example Scenario",
    industry: "Manufacturing",
    period: "FY 2026",
    leftTitle: "Financial Intelligence",
    leftSteps: ["Connecting to ERP…", "Reading financial data…", "Checking consistency…", "Detecting anomalies…"],
    leftResult: "Insights generated.",
    leftMeta: "8 key findings.",
    rightTitle: "Management Intelligence",
    rightSteps: ["Analyzing performance…", "Running scenarios…", "Evaluating key drivers…", "Generating insights…"],
    rightResult: "Performance view ready.",
    rightMeta: "5 actions recommended.",
    outputStates: [
      { title: "Collecting data…", text: "ERP, budget and operational inputs are being synchronized." },
      { title: "Building financial model…", text: "Drivers, margins and cash-flow dependencies are being mapped." },
      { title: "Running scenarios…", text: "Base, stress and opportunity cases are being evaluated." },
      { title: "Decision Ready", text: "Management decision is ready for executive review." },
    ],
  },
  risk: {
    mode: "risk",
    name: "Illustrative Risk Workspace",
    role: "Risk Manager",
    image: "/elisaveta-geneva-v2.webp",
    company: "Example Scenario",
    industry: "Banking & Finance",
    period: "FY 2026",
    leftTitle: "Risk Intelligence",
    leftSteps: ["Collecting risk data…", "Calculating exposures…", "Assessing probabilities…", "Detecting risk drivers…"],
    leftResult: "Risk insights generated.",
    leftMeta: "7 key alerts.",
    rightTitle: "Scenario Analysis",
    rightSteps: ["Running stress scenarios…", "Evaluating impact…", "Testing assumptions…", "Generating risk view…"],
    rightResult: "Scenarios validated.",
    rightMeta: "4 scenarios completed.",
    outputStates: [
      { title: "Collecting exposures…", text: "Portfolio, market and operational risk inputs are being aligned." },
      { title: "Calculating risk profile…", text: "Probabilities, concentration and loss drivers are being assessed." },
      { title: "Running stress tests…", text: "Adverse scenarios and management limits are being tested." },
      { title: "Risk Assessment Complete", text: "Risk profile confirmed. Decision is ready for review." },
    ],
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

function AgentPanel({ side, scene, activeStep }: { side: "left" | "right"; scene: Scene; activeStep: number }) {
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
        <span><strong>{title}</strong><small>AI Agent · Live</small></span>
        <i className="executive-agent__live" aria-hidden="true" />
      </header>
      <div className="executive-agent__steps">
        {steps.map((step, i) => (
          <div className={`executive-agent__step ${i === activeStep ? "is-active" : ""} ${i < activeStep ? "is-complete" : ""}`} style={{ "--step": i } as React.CSSProperties} key={step}>
            <i />
            <span>{step}</span>
            {i < activeStep && <b aria-label="completed">✓</b>}
          </div>
        ))}
      </div>
      <div className="executive-agent__result"><span>✓</span><div><strong>{result}</strong><small>{meta}</small></div></div>
    </article>
  );
}

export default function DecisionArchitecture() {
  const ref = useRef<HTMLElement>(null);
  const switchTimer = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("finance");
  const [activeStep, setActiveStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [paused, setPaused] = useState(false);
  const isMobile = useSyncExternalStore(subscribeToMobile, getMobileSnapshot, getServerMobileSnapshot);
  const reduceMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getServerReducedMotionSnapshot);
  const pageVisible = useSyncExternalStore(subscribeToPageVisibility, getPageVisibilitySnapshot, getServerPageVisibilitySnapshot);
  const scene = scenes[mode];
  const displayedStep = reduceMotion ? 3 : activeStep;
  const mobileSequenceComplete = isMobile && displayedStep === 3;

  const requestMode = useCallback((nextMode: Mode) => {
    if (nextMode === mode || transitioning) return;
    setTransitioning(true);
    window.setTimeout(() => {
      setMode(nextMode);
      setActiveStep(0);
    }, 360);
    window.setTimeout(() => setTransitioning(false), 1050);
  }, [mode, transitioning]);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.16 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || isMobile || paused || reduceMotion || !pageVisible) return;
    switchTimer.current = window.setInterval(() => requestMode(mode === "finance" ? "risk" : "finance"), 9000);
    return () => {
      if (switchTimer.current) window.clearInterval(switchTimer.current);
    };
  }, [visible, isMobile, paused, reduceMotion, pageVisible, mode, requestMode]);

  useEffect(() => {
    if (!visible || transitioning || paused || reduceMotion || !pageVisible || mobileSequenceComplete) return;
    const duration = isMobile ? 2600 : 1120;
    const id = window.setTimeout(() => {
      setActiveStep((current) => isMobile ? Math.min(current + 1, 3) : (current + 1) % 4);
    }, duration);
    return () => window.clearTimeout(id);
  }, [visible, transitioning, paused, reduceMotion, pageVisible, mobileSequenceComplete, isMobile, mode, activeStep]);

  const output = scene.outputStates[displayedStep];

  const handlePlayback = () => {
    if (mobileSequenceComplete) {
      setActiveStep(0);
      setPaused(false);
      return;
    }
    setPaused((current) => !current);
  };

  return (
    <section className={`decision-architecture executive-intelligence is-${mode} ${visible ? "is-visible" : ""} ${transitioning ? "is-transitioning" : ""}`} id="analyses" ref={ref} aria-label="Interactive executive intelligence">
      <div className="site-container executive-intelligence__inner">
        <div className="executive-intelligence__canvas">
          <div className="executive-intelligence__dots" aria-hidden="true" />
          <div className="executive-intelligence__glow" aria-hidden="true" />

          <div className="executive-intelligence__layout">
            <AgentPanel side="left" scene={scene} activeStep={displayedStep} />

            <div className="executive-profile">
              <div className="executive-profile__image">
                <Image src={scene.image} alt={`${scene.name}, ${scene.role}`} fill loading="lazy" sizes="(max-width: 760px) 86vw, 420px" quality={92} />
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

            {!isMobile && <AgentPanel side="right" scene={scene} activeStep={(displayedStep + 2) % 4} />}
          </div>

          <div className="executive-intelligence__output" aria-live={visible ? "polite" : "off"} aria-atomic="true">
            <span className="executive-intelligence__check">{displayedStep === 3 ? "✓" : "·"}</span>
            <div><strong>{output.title}</strong><small>{output.text}</small></div>
            <span className="executive-intelligence__progress" aria-hidden="true"><i style={{ transform: `scaleX(${(displayedStep + 1) / 4})` }} /></span>
          </div>

          <div className="executive-intelligence__switch" role="group" aria-label="Change profile">
            <button className={mode === "finance" ? "is-active" : ""} onClick={() => requestMode("finance")} aria-label="Show CFO profile">Finance</button>
            <button className={mode === "risk" ? "is-active" : ""} onClick={() => requestMode("risk")} aria-label="Show Risk Manager profile">Risk</button>
          </div>
          {isMobile && !reduceMotion && (
            <button
              className="executive-intelligence__playback"
              type="button"
              aria-pressed={paused}
              aria-label={mobileSequenceComplete ? "Replay animation" : paused ? "Play animation" : "Pause animation"}
              onClick={handlePlayback}
            >
              <span aria-hidden="true">{mobileSequenceComplete ? "↻" : paused ? "▶" : "Ⅱ"}</span>
              {mobileSequenceComplete ? "Replay" : paused ? "Play" : "Pause"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
