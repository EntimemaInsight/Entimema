"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { DemoTrigger } from "@/components/DemoDiscovery";
import styles from "./platform.module.css";

const layers = [
  {
    number: "01",
    label: "Evidence Infrastructure",
    title: "Every conclusion begins with evidence.",
    benefits: [
      ["Bind every value", "to its source file, sheet, cell or page."],
      ["Preserve original meaning", "across extraction and normalization."],
      ["Review the evidence", "before any conclusion reaches a decision."],
    ],
  },
  {
    number: "02",
    label: "Financial Context Layer",
    title: "Different documents. One financial language.",
    benefits: [
      ["Align every period", "without breaking the connection to source."],
      ["Normalize definitions", "into one controlled financial language."],
      ["Retain reported labels", "beside every canonical mapping."],
    ],
  },
  {
    number: "03",
    label: "Control & Validation Engine",
    title: "AI interprets. Controls determine what can be trusted.",
    benefits: [
      ["Recalculate every total", "with deterministic, code-owned logic."],
      ["Expose every difference", "as an explicit, reviewable exception."],
      ["Block unsupported outputs", "before they reach decision-makers."],
    ],
  },
  {
    number: "04",
    label: "Decision Workspace",
    title: "Uncertainty is surfaced—not hidden.",
    benefits: [
      [
        "See the full context",
        "with findings, calculations and evidence together.",
      ],
      ["Investigate exceptions", "without leaving the decision record."],
      ["Keep authority human", "wherever material judgment is required."],
    ],
  },
  {
    number: "05",
    label: "Decision-ready Output",
    title: "A result that can survive the next question.",
    benefits: [
      [
        "Deliver verified analysis",
        "with every conclusion linked to evidence.",
      ],
      ["Export one controlled record", "for review, challenge and reuse."],
      ["Defend the result", "with complete lineage from source to decision."],
    ],
  },
] as const;

/*
const statement = [
  ["Revenue", "revenue", "1,200", "1,000"],
  ["Cost of Sales", "cost_of_sales", "(720)", "(650)"],
  ["Gross Profit", "gross_profit", "480", "350"],
  ["Operating Expenses", "operating_expenses", "(250)", "(220)"],
  ["Operating Profit", "operating_profit", "230", "130"],
  ["Net Income", "net_income", "150", "82"],
] as const;

function ProductScreen({ active }: { active: number }) {
  return (
    <div
      className={styles.screen}
      aria-label={`${layers[active].label} product screen`}
    >
      <div className={styles.screenBar}>
        <div className={styles.brandMark}>E</div>
        <strong>Financial Intelligence</strong>
        <span>Sanitised V1 acceptance run</span>
        <i />
        <button type="button">AD</button>
      </div>
      <div className={styles.screenBody}>
        <aside>
          <b>FINANCIAL INTELLIGENCE</b>
          {["Intake", "Statement", "Controls", "Analysis", "Evidence"].map(
            (item, index) => (
              <span
                className={active === index ? styles.navActive : ""}
                key={item}
              >
                0{index + 1}&nbsp;&nbsp; {item}
              </span>
            ),
          )}
          <small>RUN FI-250914-018</small>
        </aside>
        <section className={styles.screenContent}>
          <header className={styles.productHeader}>
            <div>
              <span>FINANCIAL INTELLIGENCE / INCOME STATEMENT</span>
              <h4>Controlled Company</h4>
            </div>
            <b>VERIFIED</b>
          </header>
          {active === 0 && (
            <div className={styles.intakeView}>
              <div className={styles.uploadZone}>
                <span>XLSX</span>
                <div>
                  <h5>minimal-income-statement.xlsx</h5>
                  <p>18 values · 9 financial lines · 2 reporting periods</p>
                </div>
                <b>INGESTED</b>
              </div>
              <div className={styles.processRail}>
                <div>
                  <b>01</b>
                  <span>Mechanical read</span>
                  <small>Complete</small>
                </div>
                <i />
                <div>
                  <b>02</b>
                  <span>Financial extraction</span>
                  <small>Complete</small>
                </div>
                <i />
                <div>
                  <b>03</b>
                  <span>Source binding</span>
                  <small>18 / 18</small>
                </div>
              </div>
              <div className={styles.sourcePreview}>
                <span>Source preview</span>
                <strong>Sheet ‘P&amp;L’</strong>
                <code>B5:C13</code>
              </div>
            </div>
          )}
          {active === 1 && (
            <div className={styles.statementView}>
              <div className={styles.viewHeading}>
                <div>
                  <span>04 / SOURCE STATEMENT</span>
                  <h5>Verified Income Statement</h5>
                </div>
                <p>
                  EUR · thousands
                  <br />
                  2025 / 2024
                </p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Line item</th>
                    <th>Canonical concept</th>
                    <th>2025</th>
                    <th>2024</th>
                  </tr>
                </thead>
                <tbody>
                  {statement.map((row, index) => (
                    <tr
                      key={row[0]}
                      className={
                        [2, 4, 5].includes(index) ? styles.totalRow : ""
                      }
                    >
                      <td>{row[0]}</td>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {active === 2 && (
            <div className={styles.controlView}>
              <div className={styles.viewHeading}>
                <div>
                  <span>VALIDATION / RECONCILIATION</span>
                  <h5>Deterministic controls</h5>
                </div>
                <b className={styles.pass}>ALL CONTROLS PASSED</b>
              </div>
              <div className={styles.controlGrid}>
                <article>
                  <span>Gross profit reconciliation</span>
                  <div>
                    <strong>1,200</strong>
                    <i>−</i>
                    <strong>720</strong>
                    <i>=</i>
                    <strong>480</strong>
                  </div>
                  <footer>
                    <small>Reported 480</small>
                    <b>0.00 · PASS</b>
                  </footer>
                </article>
                <article>
                  <span>Net income bridge</span>
                  <div>
                    <strong>230</strong>
                    <i>−</i>
                    <strong>30</strong>
                    <i>−</i>
                    <strong>50</strong>
                  </div>
                  <footer>
                    <small>Reported 150</small>
                    <b>0.00 · PASS</b>
                  </footer>
                </article>
              </div>
              <div className={styles.auditRow}>
                <span>Calculation owner</span>
                <strong>Deterministic engine</strong>
                <span>Validation status</span>
                <strong>Complete</strong>
                <span>Material exceptions</span>
                <strong>0</strong>
              </div>
            </div>
          )}
          {active === 3 && (
            <div className={styles.analysisView}>
              <div className={styles.viewHeading}>
                <div>
                  <span>02 / PERFORMANCE</span>
                  <h5>Key Performance Indicators</h5>
                </div>
                <p>
                  Result period
                  <br />
                  <strong>2025</strong>
                </p>
              </div>
              <div className={styles.kpis}>
                {[
                  ["Revenue growth", "20.0%"],
                  ["Gross margin", "40.0%"],
                  ["Operating margin", "19.17%"],
                  ["Net margin", "12.5%"],
                ].map(([label, value]) => (
                  <article key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                    <small>Calculated from verified values</small>
                    <b>VIEW EVIDENCE ↗</b>
                  </article>
                ))}
              </div>
              <div className={styles.finding}>
                <span>01</span>
                <div>
                  <b>Operating leverage improved materially</b>
                  <p>
                    Operating profit increased faster than revenue while the
                    operating margin expanded.
                  </p>
                </div>
                <em>POSITIVE DEVELOPMENT</em>
              </div>
            </div>
          )}
          {active === 4 && (
            <div className={styles.evidenceView}>
              <div className={styles.viewHeading}>
                <div>
                  <span>05 / TRACEABILITY</span>
                  <h5>Source Evidence</h5>
                </div>
                <button type="button">Download controlled PDF</button>
              </div>
              <div className={styles.evidenceGrid}>
                {[
                  ["Revenue", "1,200", "‘P&L’!B5"],
                  ["Gross Profit", "480", "‘P&L’!B7"],
                  ["Operating Profit", "230", "‘P&L’!B9"],
                  ["Net Income", "150", "‘P&L’!B13"],
                ].map(([label, value, ref]) => (
                  <article key={label}>
                    <div>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                    <code>{ref}</code>
                    <b>VERIFIED</b>
                  </article>
                ))}
              </div>
              <div className={styles.outputReady}>
                <div>
                  <span>Decision record</span>
                  <strong>Analysis, statement and lineage complete</strong>
                </div>
                <b>READY FOR REVIEW</b>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
*/

function EvidenceLabels({ active }: { active: number }) {
  const sets = [
    [
      <div key="agent">
        <span>Financial document intake</span>
        <strong>Read submitted statements</strong>
      </div>,
      <div key="file" className={styles.micro}>
        <i>XLSX</i>
        <strong>Source file ingested</strong>
      </div>,
      <div key="check">
        <span>Source verification</span>
        <strong>Are all material values traceable?</strong>
      </div>,
    ],
    [
      <div key="period">
        <span>Reporting context</span>
        <strong>2025 / 2024 · EUR thousands</strong>
      </div>,
      <div key="map" className={styles.micro}>
        <i>↳</i>
        <strong>9 lines canonicalised</strong>
      </div>,
      <div key="meaning">
        <span>Source meaning retained</span>
        <strong>Reported label ↔ canonical concept</strong>
      </div>,
    ],
    [
      <div key="rule">
        <span>Deterministic rule</span>
        <strong>Revenue − Cost of Sales = Gross Profit</strong>
      </div>,
      <div key="pass" className={styles.micro}>
        <i>✓</i>
        <strong>0.00 difference · Pass</strong>
      </div>,
      <div key="exception">
        <span>Exception policy</span>
        <strong>No material exception detected</strong>
      </div>,
    ],
    [
      <div key="kpi">
        <span>Verified analysis</span>
        <strong>Gross margin&nbsp; 40.0%</strong>
      </div>,
      <div key="growth" className={styles.micro}>
        <i>↗</i>
        <strong>Revenue growth&nbsp; 20.0%</strong>
      </div>,
      <div key="review">
        <span>Human review</span>
        <strong>Evidence remains one click away</strong>
      </div>,
    ],
    [
      <div key="record">
        <span>Decision record</span>
        <strong>Analysis, statement and lineage</strong>
      </div>,
      <div key="values" className={styles.micro}>
        <i>✓</i>
        <strong>18 / 18 values verified</strong>
      </div>,
      <div key="output">
        <span>Controlled output</span>
        <strong>Ready for financial review</strong>
      </div>,
    ],
  ];
  return (
    <div className={styles.evidenceLabels} key={active}>
      {sets[active]}
    </div>
  );
}

function ArchitectureStack({
  active,
  progress,
  entryProgress,
  labelsProgress,
  onSelect,
}: {
  active: number;
  progress: number;
  entryProgress: number;
  labelsProgress: number;
  onSelect: (index: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const layerGap = 62 + entryProgress * 5 + progress * 7;
  const firstMicro = 1 / 3;
  const secondMicro = 2 / 3;
  const entryOffset =
    entryProgress <= firstMicro
      ? (entryProgress / firstMicro) * 8.22
      : entryProgress <= secondMicro
        ? 8.22 + ((entryProgress - firstMicro) / firstMicro) * (28.17 - 8.22)
        : 28.17 +
          ((entryProgress - secondMicro) / firstMicro) * (46.26 - 28.17);

  return (
    <div
      className={styles.visualStage}
      style={
        {
          "--progress": progress,
          "--stack-x": `${entryOffset + progress * 12}px`,
          "--stack-y": `${entryProgress * 2}px`,
          "--active-lift": `${10 + progress * 17}px`,
          "--labels-opacity": labelsProgress,
          "--labels-x": `${(1 - labelsProgress) * -22}px`,
          "--labels-blur": `${(1 - labelsProgress) * 5}px`,
        } as CSSProperties
      }
    >
      <div
        className={styles.stack}
        aria-label={`Active architecture layer: ${layers[active].label}`}
      >
        {layers.map((layer, index) => (
          <button
            type="button"
            className={`${styles.stackLayer} ${index === active ? styles.activeLayer : ""} ${index < active ? styles.passedLayer : ""} ${hovered === index ? styles.hoveredLayer : ""} ${hovered !== null && hovered !== index ? styles.hoverMuted : ""}`}
            style={
              {
                "--layer-y": `${index * layerGap}px`,
                zIndex: layers.length - index,
                opacity: hovered === null || hovered === index ? 1 : 0.82,
                filter:
                  hovered === null || hovered === index
                    ? undefined
                    : "saturate(.82) brightness(1)",
                translate:
                  hovered === index
                    ? "-36px 0"
                    : hovered !== null
                      ? "-6px 0"
                      : undefined,
                scale: hovered === index ? "1.006" : undefined,
              } as CSSProperties
            }
            key={layer.label}
            onClick={() => onSelect(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            aria-label={`View ${layer.label}`}
          >
            <strong>{layer.label}</strong>
          </button>
        ))}
      </div>
      <EvidenceLabels active={active} />
    </div>
  );
}

export default function PlatformExperience() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [entryProgress, setEntryProgress] = useState(0);
  const [labelsProgress, setLabelsProgress] = useState(0);
  const steps = useRef<Array<HTMLElement | null>>([]);
  const architectureGrid = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const center = window.innerHeight * 0.52;
      let best = 0,
        distance = Infinity;
      steps.current.forEach((step, index) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        const d = Math.abs(rect.top + rect.height * 0.5 - center);
        if (d < distance) {
          distance = d;
          best = index;
        }
      });
      setActive(best);
      const first = steps.current[0],
        last = steps.current.at(-1),
        grid = architectureGrid.current;
      if (first && last && grid) {
        const start = grid.getBoundingClientRect().top + window.scrollY - 80;
        const travelled = Math.max(0, window.scrollY - start);
        const end =
          last.getBoundingClientRect().bottom +
          window.scrollY -
          window.innerHeight;
        const rawProgress = Math.max(
          0,
          Math.min(1, (window.scrollY - start) / Math.max(1, end - start)),
        );
        const entryRaw = Math.min(1, travelled / 240);
        const revealRaw = Math.max(0, Math.min(1, (travelled - 420) / 240));
        setProgress(rawProgress);
        setEntryProgress(entryRaw);
        setLabelsProgress(revealRaw * revealRaw * (3 - 2 * revealRaw));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const selectLayer = (index: number) => {
    const step = steps.current[index];
    if (!step) return;

    setActive(index);
    const rect = step.getBoundingClientRect();
    const top =
      window.scrollY + rect.top + rect.height * 0.5 - window.innerHeight * 0.52;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <section
        className={styles.journey}
        aria-label="Financial intelligence platform architecture"
      >
        <div
          className={`site-container ${styles.journeyGrid}`}
          ref={architectureGrid}
        >
          <div className={styles.copyColumn}>
            <header className={styles.hero}>
              <h1>
                Financial intelligence, built to be <em>defended.</em>
              </h1>
              <p className={styles.heroLead}>
                From source evidence to a decision-ready output—inside one
                controlled, traceable system.
              </p>
              <div className={styles.actions}>
                <DemoTrigger
                  className="primary-cta hero__cta"
                  initialInterest="Platform overview"
                />
              </div>
            </header>
            {layers.map((layer, index) => (
              <article
                className={`${styles.storyStep} ${index === active ? styles.activeStep : ""}`}
                ref={(node) => {
                  steps.current[index] = node;
                }}
                key={layer.label}
              >
                <div className={styles.stepTop}>
                  <b>{layer.label}</b>
                </div>
                <h3>{layer.title}</h3>
                <ul>
                  {layer.benefits.map(([lead, detail]) => (
                    <li key={lead}>
                      <strong>{lead}</strong> {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className={styles.stickyColumn}>
            <ArchitectureStack
              active={active}
              progress={progress}
              entryProgress={entryProgress}
              labelsProgress={labelsProgress}
              onSelect={selectLayer}
            />
          </div>
        </div>
      </section>
      <section className={styles.finalCta}>
        <div className="site-container">
          <h2>
            Turn financial documents into verified intelligence your team can
            defend.
          </h2>
          <div className={styles.finalActions}>
            <DemoTrigger
              className="primary-cta primary-cta--light"
              initialInterest="Financial Intelligence V1"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
