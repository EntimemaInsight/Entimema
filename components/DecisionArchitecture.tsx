"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  outputStates: { title: string; text: string }[];
};

const scenes: Record<Mode, Scene> = {
  finance: {
    mode: "finance",
    name: "Elena Angelova",
    role: "Главен финансов директор",
    image: "/elena-angelova.webp",
    company: "Индустриална група",
    industry: "Производство",
    period: "FY 2026",
    topTags: ["P&L", "Баланс", "Парични потоци", "Бюджет", "KPI"],
    orbitTags: ["Прогноза", "Оборотен капитал", "Управленски отчет", "Финансов модел", "Управленски анализ", "Сценариен анализ", "Доклад за ръководството", "Подкрепа при вземане на решения"],
    leftTitle: "Финансова интелигентност",
    leftSteps: ["Свързване с ERP…", "Четене на финансовите данни…", "Проверка за последователност…", "Откриване на аномалии…"],
    leftResult: "Анализът е генериран.",
    leftMeta: "8 ключови извода.",
    rightTitle: "Управленска интелигентност",
    rightSteps: ["Анализ на представянето…", "Изпълнение на сценарии…", "Оценка на ключовите фактори…", "Генериране на изводи…"],
    rightResult: "Управленският преглед е готов.",
    rightMeta: "5 препоръчани действия.",
    outputStates: [
      { title: "Събиране на данни…", text: "ERP, бюджетните и оперативните данни се синхронизират." },
      { title: "Изграждане на финансов модел…", text: "Драйверите, маржовете и зависимостите в паричните потоци се картографират." },
      { title: "Изпълнение на сценарии…", text: "Оценяват се базовият, стресовият и оптимистичният сценарий." },
      { title: "Решението е готово", text: "Управленското решение е готово за преглед от ръководството." },
    ],
  },
  risk: {
    mode: "risk",
    name: "Elisaveta Geneva",
    role: "Риск мениджър",
    image: "/elisaveta-geneva.webp",
    company: "Финансова група",
    industry: "Банкиране и финанси",
    period: "FY 2026",
    topTags: ["Кредитен риск", "Пазарен риск", "Ликвиден риск", "Оперативен риск", "Регулаторно съответствие"],
    orbitTags: ["PD / LGD", "Сценариен анализ", "Стрес тестване", "Експозиция", "Концентрация", "Рисково табло", "Откриване на измами", "Подкрепа при вземане на решения"],
    leftTitle: "Рискова интелигентност",
    leftSteps: ["Събиране на рискови данни…", "Изчисляване на експозициите…", "Оценка на вероятностите…", "Откриване на рисковите фактори…"],
    leftResult: "Рисковият анализ е генериран.",
    leftMeta: "7 ключови сигнала.",
    rightTitle: "Сценариен анализ",
    rightSteps: ["Изпълнение на стрес сценарии…", "Оценка на въздействието…", "Тестване на допусканията…", "Генериране на рисковия преглед…"],
    rightResult: "Сценариите са валидирани.",
    rightMeta: "4 завършени сценария.",
    outputStates: [
      { title: "Събиране на експозициите…", text: "Портфейлните, пазарните и оперативните рискови данни се съгласуват." },
      { title: "Изчисляване на рисковия профил…", text: "Оценяват се вероятностите, концентрацията и факторите за загуба." },
      { title: "Изпълнение на стрес тестове…", text: "Тестват се неблагоприятните сценарии и управленските лимити." },
      { title: "Оценката на риска е завършена", text: "Рисковият профил е потвърден. Решението е готово за преглед." },
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
        <span><strong>{title}</strong><small>AI агент · Активен</small></span>
        <i className="executive-agent__live" aria-hidden="true" />
      </header>
      <div className="executive-agent__steps">
        {steps.map((step, i) => (
          <div className={`executive-agent__step ${i === activeStep ? "is-active" : ""} ${i < activeStep ? "is-complete" : ""}`} style={{ "--step": i } as React.CSSProperties} key={step}>
            <i />
            <span>{step}</span>
            {i < activeStep && <b aria-label="завършено">✓</b>}
          </div>
        ))}
      </div>
      <div className="executive-agent__result"><span>✓</span><div><strong>{result}</strong><small>{meta}</small></div></div>
    </article>
  );
}

export default function DecisionArchitecture() {
  const ref = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const switchTimer = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<Mode>("finance");
  const [activeStep, setActiveStep] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const scene = scenes[mode];

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
    const svg = svgRef.current;
    if (!svg) return;
    if (visible && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    switchTimer.current = window.setInterval(() => requestMode(mode === "finance" ? "risk" : "finance"), 9000);
    return () => {
      if (switchTimer.current) window.clearInterval(switchTimer.current);
    };
  }, [visible, mode, requestMode]);

  useEffect(() => {
    if (!visible || transitioning) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setActiveStep((current) => (current + 1) % 4), 1120);
    return () => window.clearInterval(id);
  }, [visible, mode, transitioning]);

  const tags = useMemo(() => scene.topTags, [scene]);
  const output = scene.outputStates[activeStep];

  return (
    <section className={`decision-architecture executive-intelligence is-${mode} ${visible ? "is-visible" : ""} ${transitioning ? "is-transitioning" : ""}`} ref={ref} aria-label="Интерактивна управленска информация">
      <div className="site-container executive-intelligence__inner">
        <div className="executive-intelligence__canvas">
          <div className="executive-intelligence__dots" aria-hidden="true" />
          <div className="executive-intelligence__sparkles" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
          <div className="executive-intelligence__glow" aria-hidden="true" />

          <div className="executive-intelligence__top-tags">
            {tags.map((tag, index) => <span style={{ "--tag": index } as React.CSSProperties} key={tag}>{tag}</span>)}
          </div>

          <svg ref={svgRef} className="executive-intelligence__connections" viewBox="0 0 1400 760" preserveAspectRatio="none" aria-hidden="true">
            {[
              "M700 118 C700 175 700 205 700 245",
              "M430 120 C470 172 515 196 576 238",
              "M970 120 C930 172 885 196 824 238",
              "M345 380 C430 380 480 380 545 380",
              "M1055 380 C970 380 920 380 855 380",
              "M700 520 C700 565 700 588 700 630",
            ].map((path, index) => <path d={path} key={path} className={`executive-line executive-line--${index + 1}`} />)}
            <circle className="executive-data-pulse executive-data-pulse--1" r="4"><animateMotion dur="3.8s" repeatCount="indefinite" path="M430 120 C470 172 515 196 576 238" /></circle>
            <circle className="executive-data-pulse executive-data-pulse--2" r="4"><animateMotion dur="4.4s" begin="-1.8s" repeatCount="indefinite" path="M970 120 C930 172 885 196 824 238" /></circle>
            <circle className="executive-data-pulse executive-data-pulse--3" r="4"><animateMotion dur="3.3s" begin="-.8s" repeatCount="indefinite" path="M345 380 C430 380 480 380 545 380" /></circle>
            <circle className="executive-data-pulse executive-data-pulse--4" r="4"><animateMotion dur="3.7s" begin="-2.4s" repeatCount="indefinite" path="M1055 380 C970 380 920 380 855 380" /></circle>
            <circle className="executive-data-pulse executive-data-pulse--5" r="4"><animateMotion dur="3.1s" begin="-1.2s" repeatCount="indefinite" path="M700 520 C700 565 700 588 700 630" /></circle>
          </svg>

          <div className="executive-intelligence__layout">
            <AgentPanel side="left" scene={scene} activeStep={activeStep} />

            <div className="executive-profile">
              <div className="executive-profile__image">
                <Image src={scene.image} alt={`${scene.name}, ${scene.role}`} fill priority sizes="(max-width: 760px) 86vw, 420px" quality={96} />
                <div className="executive-profile__scan" aria-hidden="true" />
                <div className="executive-profile__veil" />
              </div>
              <div className="executive-profile__identity">
                <strong>{scene.name}</strong>
                <span>{scene.role}</span>
                <dl>
                  <div><dt>Компания</dt><dd>{scene.company}</dd></div>
                  <div><dt>Сектор</dt><dd>{scene.industry}</dd></div>
                  <div><dt>Период</dt><dd>{scene.period}</dd></div>
                </dl>
              </div>
            </div>

            <AgentPanel side="right" scene={scene} activeStep={(activeStep + 2) % 4} />
          </div>

          <div className="executive-intelligence__orbit">
            {scene.orbitTags.map((tag, index) => <span className={`executive-orbit-tag executive-orbit-tag--${index + 1}`} style={{ "--tag": index } as React.CSSProperties} key={tag}>{tag}</span>)}
          </div>

          <div className="executive-intelligence__output" aria-live="polite">
            <span className="executive-intelligence__check">{activeStep === 3 ? "✓" : "·"}</span>
            <div><strong>{output.title}</strong><small>{output.text}</small></div>
            <span className="executive-intelligence__progress" aria-hidden="true"><i style={{ transform: `scaleX(${(activeStep + 1) / 4})` }} /></span>
          </div>

          <div className="executive-intelligence__switch" role="group" aria-label="Смяна на профил">
            <button className={mode === "finance" ? "is-active" : ""} onClick={() => requestMode("finance")} aria-label="Покажи CFO профил">Финанси</button>
            <button className={mode === "risk" ? "is-active" : ""} onClick={() => requestMode("risk")} aria-label="Покажи профила на риск мениджъра">Риск</button>
          </div>
        </div>
      </div>
    </section>
  );
}
