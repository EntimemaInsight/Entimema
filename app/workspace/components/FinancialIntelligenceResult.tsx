"use client";
import { useState } from "react";
import type {
  AnalysisKpi,
  Result,
} from "@/backend/financial-intelligence/v1/contract";
import styles from "./FinancialIntelligenceResult.module.css";

const number = new Intl.NumberFormat("en", { maximumFractionDigits: 6 });
export function financialNumber(value: number) {
  return value < 0
    ? `(${number.format(Math.abs(value))})`
    : number.format(value);
}
export function sourceLocation(ref: string) {
  const pdf = /^p(\d+):l(\d+):t(\d+)$/.exec(ref);
  if (pdf) return `Page ${pdf[1]}, line ${pdf[2]}, token ${pdf[3]}`;
  const cell = /^(?:'((?:[^']|'')+)'|([^!]+))!([A-Z]+[1-9]\d*)$/.exec(ref);
  if (cell)
    return `Sheet ${(cell[1] ?? cell[2]).replace(/''/g, "'")}, cell ${cell[3]}`;
  return "Source location unavailable";
}
function KpiValue({ kpi }: { kpi: AnalysisKpi }) {
  if (kpi.status === "valid")
    return (
      <>
        {number.format(kpi.value)}
        <span className={styles.percent}>%</span>
      </>
    );
  if (kpi.status === "sign_change")
    return (
      <>
        {kpi.direction === "positive_to_negative"
          ? "Positive to negative"
          : "Negative to positive"}
      </>
    );
  return (
    <>{kpi.status === "not_meaningful" ? "Not meaningful" : "Unavailable"}</>
  );
}
function Evidence({
  result,
  kpis,
  concepts = [],
}: {
  result: Result;
  kpis: AnalysisKpi[];
  concepts?: string[];
}) {
  const references = new Set(
    kpis.flatMap((k) => k.evidence.map((e) => e.sourceRef)),
  );
  const lines = result.lines.filter(
    (l) =>
      l.values.some((v) => references.has(v.sourceRef)) ||
      (l.concept && concepts.includes(l.concept)),
  );
  return lines.length ? (
    <ul className={styles.evidenceList}>
      {lines.map((line, i) => (
        <li key={i}>
          <strong>{line.label}</strong>
          {line.values
            .filter(
              (v) =>
                references.has(v.sourceRef) ||
                (line.concept && concepts.includes(line.concept)),
            )
            .map((v) => (
              <p key={v.sourceRef}>
                <span>
                  {v.period} · {financialNumber(v.value)}
                </span>
                <span>{sourceLocation(v.sourceRef)}</span>
              </p>
            ))}
        </li>
      ))}
    </ul>
  ) : (
    <p>No source inputs are available for this measure.</p>
  );
}
export function FinancialIntelligenceResult({ result }: { result: Result }) {
  const defaultPeriod =
    result.periods
      .filter((p) => /^\d{4}$/.test(p))
      .sort()
      .reverse()[0] ?? result.periods[0];
  const [period, setPeriod] = useState(defaultPeriod);
  const kpis = result.analysis.kpis.filter((k) => k.currentPeriod === period);
  const context = `${result.currency ?? "Currency not stated"} · ${result.scale ?? "Scale not stated"}`;
  return (
    <article className={styles.result} aria-label="Financial analysis result">
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          Financial intelligence / Income statement
        </p>
        <h2>{result.entity ?? "Your income statement"}</h2>
        <dl className={styles.metadata}>
          <div>
            <dt>Reporting periods</dt>
            <dd>{result.periods.join(" / ")}</dd>
          </div>
          <div>
            <dt>Currency</dt>
            <dd>{result.currency ?? "Not stated"}</dd>
          </div>
          <div>
            <dt>Scale</dt>
            <dd>{result.scale ?? "Not stated"}</dd>
          </div>
        </dl>
        <p className={styles.verified}>
          Financial values verified against your file.
        </p>
      </header>
      <section className={styles.summary} aria-labelledby="fi-summary">
        <p className={styles.sectionNumber}>01 / Overview</p>
        <h3 id="fi-summary">Executive Summary</h3>
        <p className={styles.summaryText}>{result.analysis.executiveSummary}</p>
      </section>
      <section className={styles.section} aria-labelledby="fi-kpis">
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionNumber}>02 / Performance</p>
            <h3 id="fi-kpis">Key Performance Indicators</h3>
          </div>
          <label className={styles.periodLabel}>
            Result period
            <select value={period} onChange={(e) => setPeriod(e.target.value)}>
              {result.periods.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.kpis}>
          {kpis.map((kpi) => {
            const prior = result.analysis.kpis.find(
              (k) =>
                k.label === kpi.label &&
                k.currentPeriod === String(Number(period) - 1),
            );
            return (
              <section
                className={styles.kpi}
                key={kpi.id}
                aria-label={kpi.label}
              >
                <h4>{kpi.label}</h4>
                <p
                  className={
                    kpi.status === "valid" ? styles.kpiValue : styles.kpiState
                  }
                >
                  <KpiValue kpi={kpi} />
                </p>
                <p className={styles.status}>
                  {kpi.status === "valid"
                    ? "Calculated from verified values"
                    : kpi.status === "sign_change"
                      ? "Sign change · percentage not meaningful"
                      : kpi.reason}
                </p>
                {kpi.type === "margin" && prior?.status === "valid" && (
                  <p className={styles.comparison}>
                    {prior.currentPeriod}: {number.format(prior.value)}%
                  </p>
                )}
                {kpi.type === "growth" &&
                  kpi.currentValue !== undefined &&
                  kpi.priorValue !== undefined && (
                    <p className={styles.comparison}>
                      {kpi.priorPeriod}: {financialNumber(kpi.priorValue)} →{" "}
                      {period}: {financialNumber(kpi.currentValue)}
                      <br />
                      {context}
                    </p>
                  )}
                <details className={styles.evidence}>
                  <summary>
                    View evidence
                    <span className={styles.srOnly}>
                      {" "}
                      for {kpi.label}, {period}
                    </span>
                  </summary>
                  <Evidence result={result} kpis={[kpi]} />
                </details>
              </section>
            );
          })}
        </div>
      </section>
      <section className={styles.section} aria-labelledby="fi-findings">
        <p className={styles.sectionNumber}>03 / Interpretation</p>
        <h3 id="fi-findings">Key Findings</h3>
        <ol className={styles.findings}>
          {result.analysis.findings.slice(0, 5).map((finding) => (
            <li key={finding.id}>
              <div>
                <h4>{finding.title}</h4>
                <span className={styles.severity}>
                  {finding.severity === "attention"
                    ? "Requires attention"
                    : finding.severity === "positive"
                      ? "Positive development"
                      : "Observation"}
                </span>
              </div>
              <p>{finding.statement}</p>
              <details className={styles.evidence}>
                <summary>
                  View evidence
                  <span className={styles.srOnly}> for {finding.title}</span>
                </summary>
                <Evidence
                  result={result}
                  kpis={result.analysis.kpis.filter((k) =>
                    finding.evidence.kpiIds.includes(k.id),
                  )}
                  concepts={finding.evidence.sourceConcepts}
                />
              </details>
            </li>
          ))}
        </ol>
      </section>
      <section className={styles.section} aria-labelledby="fi-statement">
        <p className={styles.sectionNumber}>04 / Source statement</p>
        <h3 id="fi-statement">Verified Income Statement</h3>
        <p className={styles.context}>
          {context}. Per-share units remain as stated in source labels. Negative
          values are shown in parentheses.
        </p>
        <div
          className={styles.tableScroll}
          tabIndex={0}
          role="region"
          aria-label="Verified income statement, scroll horizontally for all periods"
        >
          <table className={styles.table}>
            <caption>
              {result.lines.length} source lines ·{" "}
              {result.verification.verifiedValues} verified values
            </caption>
            <thead>
              <tr>
                <th scope="col">Line item</th>
                {result.periods.map((p) => (
                  <th scope="col" key={p}>
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.lines.map((line, i) => (
                <tr
                  key={i}
                  className={
                    line.aggregationRole === "total"
                      ? styles.total
                      : line.aggregationRole === "subtotal"
                        ? styles.subtotal
                        : undefined
                  }
                >
                  <th scope="row">{line.label}</th>
                  {result.periods.map((p) => {
                    const value = line.values.find((v) => v.period === p);
                    return (
                      <td key={p}>
                        {value ? (
                          financialNumber(value.value)
                        ) : (
                          <span className={styles.notReported}>
                            Not reported
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className={styles.section} aria-labelledby="fi-source">
        <p className={styles.sectionNumber}>05 / Traceability</p>
        <h3 id="fi-source">Source Evidence</h3>
        <p className={styles.context}>
          Trace the statement back to the values and locations in your file.
        </p>
        <details className={styles.evidence}>
          <summary>View evidence for the full statement</summary>
          <ul className={styles.evidenceList}>
            {result.lines.map((line, i) => (
              <li key={i}>
                <strong>{line.label}</strong>
                {line.values.map((v) => (
                  <p key={v.sourceRef}>
                    <span>
                      {v.period} · {financialNumber(v.value)}
                    </span>
                    <span>{sourceLocation(v.sourceRef)}</span>
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </details>
      </section>
    </article>
  );
}
