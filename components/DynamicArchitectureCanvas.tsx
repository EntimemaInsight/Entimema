"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DynamicArchitectureCanvas.module.css";

type Card = {
  title: string;
  meta: string;
  eyebrow: string;
  statuses: readonly string[];
  group: "finance" | "operations" | "risk";
};

const cards: readonly Card[] = [
  { title: "Финансови данни", meta: "P&L · Парични потоци · Бюджет", eyebrow: "ИЗТОЧНИК 01", statuses: ["Синхронизиране", "Валидирано", "Моделирано", "Активно"], group: "finance" },
  { title: "Оперативни сигнали", meta: "Процес · Капацитет · KPI", eyebrow: "ИЗТОЧНИК 02", statuses: ["Прочитане", "Картографирано", "Свързано", "Активно"], group: "operations" },
  { title: "Бизнес контекст", meta: "Цели · Ограничения · Приоритети", eyebrow: "КОНТЕКСТ", statuses: ["Анализиране", "Структурирано", "Съгласувано", "Готово"], group: "operations" },
  { title: "Рискови фактори", meta: "Експозиция · Сценарии · Контроли", eyebrow: "ЯДРО НА РИСКА", statuses: ["Сканиране", "Маркирано", "Стрес тествано", "Контролирано"], group: "risk" },
  { title: "Пазарна среда", meta: "Тенденции · Конкуренция · Търсене", eyebrow: "ВЪНШНА СРЕДА", statuses: ["Проследяване", "Сравнено", "Претеглено", "Актуално"], group: "finance" },
  { title: "Критерии за решение", meta: "Въздействие · Устойчивост · Скорост", eyebrow: "УПРАВЛЕНИЕ", statuses: ["Дефиниране", "Оценено", "Приоритизирано", "Одобрено"], group: "risk" },
] as const;

const phaseLabels = [
  "Свързване на знанието",
  "Валидиране на сигналите",
  "Картографиране на зависимостите",
  "Изграждане на Decision Architecture",
  "Управленското решение е готово",
] as const;

const paths = [
  "M216 132 C380 145 455 224 570 282",
  "M204 310 C365 310 458 310 570 310",
  "M242 500 C392 468 470 405 580 350",
  "M1184 132 C1020 145 945 224 830 282",
  "M1196 310 C1035 310 942 310 830 310",
  "M1158 500 C1008 468 930 405 820 350",
  "M700 402 C700 460 700 512 700 566",
] as const;

const layers = [
  ["01", "Надежден контекст", "Нормализирани входни данни и общи дефиниции"],
  ["02", "Модели за решения", "Зависимости, сценарии и компромиси"],
  ["03", "Логика на управление", "Контроли, отговорности и измерими критерии"],
] as const;

export default function DynamicArchitectureCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointerBounds = useRef<DOMRect | null>(null);
  const pointerFrame = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [hoveredGroup, setHoveredGroup] = useState<Card["group"] | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "80px 0px -80px",
      threshold: 0.12,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const svg = svgRef.current;
    if (reduceMotion) {
      svg?.pauseAnimations();
      const reducedFrame = window.requestAnimationFrame(() => setPhase(4));
      return () => window.cancelAnimationFrame(reducedFrame);
    }
    if (!active) {
      svg?.pauseAnimations();
      return;
    }
    svg?.unpauseAnimations();
    const timer = window.setInterval(() => setPhase((current) => (current + 1) % 5), 2400);
    return () => {
      window.clearInterval(timer);
    };
  }, [active]);

  useEffect(() => () => {
    if (pointerFrame.current) window.cancelAnimationFrame(pointerFrame.current);
  }, []);

  const updateParallax = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || !ref.current || pointerFrame.current) return;
    const { clientX, clientY } = event;
    pointerFrame.current = window.requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      const rect = pointerBounds.current;
      if (!rect) {
        pointerFrame.current = null;
        return;
      }
      node.style.setProperty("--pointer-x", String((clientX - rect.left) / rect.width - 0.5));
      node.style.setProperty("--pointer-y", String((clientY - rect.top) / rect.height - 0.5));
      pointerFrame.current = null;
    });
  };

  const resetParallax = () => {
    setHoveredGroup(null);
  };

  return (
    <div
      className={`${styles.canvas} ${active ? styles.active : ""} ${styles[`phase${phase}`]} ${hoveredGroup ? styles[`hover${hoveredGroup}`] : ""}`}
      ref={ref}
      onPointerEnter={() => { if (ref.current) pointerBounds.current = ref.current.getBoundingClientRect(); }}
      onPointerMove={updateParallax}
      onPointerLeave={resetParallax}
      aria-label="Динамична управленска архитектура"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowPrimary}`} aria-hidden="true" />
      <div className={`${styles.glow} ${styles.glowSecondary}`} aria-hidden="true" />
      <div className={styles.shimmers} aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </div>

      <div className={styles.status} aria-live="polite">
        <i /><span>{phaseLabels[phase]}</span><b>{String(phase + 1).padStart(2, "0")} / 05</b>
      </div>

      <svg ref={svgRef} className={styles.connections} viewBox="0 0 1400 610" preserveAspectRatio="none" aria-hidden="true">
        {paths.map((path, index) => (
          <path className={`${styles.line} ${styles[`line${index + 1}`]}`} d={path} pathLength="1" key={path} />
        ))}
        {paths.slice(0, 6).map((path, index) => (
          <circle className={`${styles.packet} ${styles[`packet${index + 1}`]}`} r="3.6" key={path}>
            <animateMotion path={path} dur={`${3.35 + index * 0.31}s`} begin={`${index * -0.67}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {cards.map((card, index) => (
        <article
          className={`${styles.knowledgeCard} ${styles[`card${index + 1}`]} ${styles[`group${card.group}`]}`}
          onPointerEnter={() => setHoveredGroup(card.group)}
          onPointerLeave={() => setHoveredGroup(null)}
          key={card.title}
        >
          <div className={styles.cardTopline}><span>{card.eyebrow}</span><i /></div>
          <strong>{card.title}</strong>
          <p>{card.meta}</p>
          <div className={styles.cardStatus}><i /><span>{card.statuses[(phase + index) % card.statuses.length]}</span></div>
          <span className={styles.nodePulse} aria-hidden="true" />
        </article>
      ))}

      <section className={styles.architecture} aria-label="Управленска архитектура">
        <header className={styles.architectureHeader}>
          <span className={styles.architectureIcon} aria-hidden="true"><i /><i /><i /></span>
          <span><small>УПРАВЛЕНСКА ИНТЕЛИГЕНТНОСТ</small><strong>Decision Architecture</strong></span>
          <b>АКТИВНО</b>
        </header>
        <div className={styles.layers}>
          {layers.map(([number, title, description], index) => (
            <div className={styles.layer} style={{ "--layer": index } as React.CSSProperties} key={title}>
              <span>{number}</span><div><strong>{title}</strong><small>{description}</small></div><i />
            </div>
          ))}
        </div>
        <div className={styles.architectureProgress}><i /><i /><i /><i /></div>
      </section>

      <div className={styles.decision}>
        <span className={styles.decisionIcon} aria-hidden="true">✓</span>
        <span><small>РЕЗУЛТАТ / ПОТВЪРДЕНО</small><strong>Управленско решение</strong><span>Ясно, измеримо и готово за действие.</span></span>
        <i className={styles.decisionSignal} aria-hidden="true" />
      </div>
    </div>
  );
}
