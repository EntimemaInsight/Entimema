"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./DynamicArchitectureCanvas.module.css";

const cards = [
  ["Финансови данни", "P&L · Cash flow · Budget"],
  ["Оперативни сигнали", "Процеси · Капацитет · KPI"],
  ["Бизнес контекст", "Цели · Ограничения · Приоритети"],
  ["Рискови фактори", "Експозиции · Сценарии · Контрол"],
  ["Пазарна среда", "Трендове · Конкуренция · Търсене"],
  ["Управленски критерии", "Ефект · Устойчивост · Скорост"],
] as const;

const phaseLabels = [
  "Свързване на знанието",
  "Структуриране на сигналите",
  "Групиране на зависимостите",
  "Изграждане на архитектура",
  "Решение, готово за действие",
] as const;

const paths = [
  "M220 130 C390 150 455 225 570 285",
  "M205 310 C360 310 455 310 570 310",
  "M245 500 C390 470 470 405 580 350",
  "M1180 130 C1010 150 945 225 830 285",
  "M1195 310 C1040 310 945 310 830 310",
  "M1155 500 C1010 470 930 405 820 350",
  "M700 400 C700 465 700 510 700 565",
] as const;

export default function DynamicArchitectureCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.18 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase(0);
    const timer = window.setInterval(() => {
      setPhase((current) => (current >= 4 ? 0 : current + 1));
    }, 1800);
    return () => window.clearInterval(timer);
  }, [active]);

  return (
    <div
      className={`${styles.canvas} ${active ? styles.active : ""} ${styles[`phase${phase}`]}`}
      ref={ref}
      aria-label="Динамична управленска архитектура"
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.status} aria-live="polite"><i />{phaseLabels[phase]}</div>

      <svg className={styles.connections} viewBox="0 0 1400 610" preserveAspectRatio="none" aria-hidden="true">
        {paths.map((path) => <path className={styles.line} d={path} key={path} />)}
        {paths.slice(0, 6).map((path, index) => (
          <circle className={styles.packet} r="4" key={path}>
            <animateMotion path={path} dur={`${3.2 + index * 0.24}s`} begin={`${index * -0.55}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {cards.map(([title, meta], index) => (
        <article className={`${styles.knowledgeCard} ${styles[`card${index + 1}`]}`} key={title}>
          <strong>{title}</strong><span>{meta}</span>
        </article>
      ))}

      <section className={styles.architecture} aria-label="Управленска архитектура">
        <header className={styles.architectureHeader}>
          <span className={styles.architectureIcon} aria-hidden="true">◇</span>
          <span><strong>Management Architecture</strong><span>Единна логика за решение</span></span>
        </header>
        <div className={styles.layers}>
          {["Контекст и достоверни данни", "Модели, зависимости и сценарии", "Контрол, критерии и отговорност"].map((layer, index) => (
            <div className={styles.layer} style={{ "--layer": index } as React.CSSProperties} key={layer}><i />{layer}</div>
          ))}
        </div>
      </section>

      <div className={styles.decision}>
        <span className={styles.decisionIcon} aria-hidden="true">✓</span>
        <span><strong>Executive Decision</strong><span>Ясно, измеримо и готово за управленско действие.</span></span>
      </div>
    </div>
  );
}
