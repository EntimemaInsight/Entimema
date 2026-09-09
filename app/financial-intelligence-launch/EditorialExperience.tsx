import Link from "next/link";
import styles from "./launch.module.css";
import { FinancialIntelligenceCta, FinancialIntelligenceViewAnalytics } from "./FinancialIntelligenceAnalytics";

const stages = [
  ["01", "Understand", "AI reads structure, labels and context.", "AI reasoning"],
  ["02", "Structure", "Values enter one canonical financial model.", "AI reasoning"],
  ["03", "Control", "Code recalculates identities and reconciliations.", "Deterministic code"],
  ["04", "Review", "Material uncertainty stops for human judgement.", "Human control"],
  ["05", "Deliver", "The result leaves with evidence attached.", "Traceable output"],
] as const;

const values = [
  ["Revenue", "€18,420,000", "FY 2025", "98.4%"],
  ["Cost of sales", "€12,910,000", "FY 2025", "99.1%"],
  ["Gross profit", "€5,510,000", "FY 2025", "100%"],
] as const;

export default function EditorialExperience() {
  return <main className={styles.page}>
    <FinancialIntelligenceViewAnalytics />
    <article>
      <header className={styles.hero}>
        <div className={styles.masthead}><span>ENTIMEMA</span><span>FINANCIAL INTELLIGENCE · V1</span><span>09 SEPTEMBER 2026</span></div>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}><p className={styles.kicker}>A controlled financial workflow</p><h1>Financial data deserves more than an AI answer.</h1><p className={styles.standfirst}>It deserves a chain of evidence, calculation and accountable judgement. This is the argument behind Financial Intelligence V1.</p></div>
          <aside className={styles.heroNote}><span className={styles.issueNumber}>01</span><p>One document can contain hundreds of numbers. The decisive question is not whether a model can read them, but whether the result can survive examination.</p></aside>
        </div>
        <div className={styles.heroFooter}><span>Product release</span><span>Financial architecture · Evidence · Control</span></div>
      </header>

      <section className={styles.premise}>
        <div className={styles.sectionLabel}><span>01</span><p>The premise</p></div>
        <div className={styles.premiseGrid}><h2>The problem is not extracting a number.</h2><div className={styles.bodyCopy}><p className={styles.dropcap}>A number can be copied perfectly and still be wrong for the decision. Its period may differ. Its definition may drift. Its sign, currency or unit may be misunderstood. Its source may contradict another document.</p><p>Speed without control does not remove uncertainty. It merely delivers it earlier.</p></div></div>
        <blockquote>“The useful output is not a number. It is a number whose meaning, arithmetic and origin can survive examination.”</blockquote>
      </section>

      <section className={styles.evidence}>
        <div className={styles.sectionLabel}><span>02</span><p>From document to evidence</p></div>
        <div className={styles.sectionLead}><h2>The value and its source remain one object.</h2><p>Financial Intelligence does not detach a figure from the document that gives it meaning. The path back is part of the output.</p></div>
        <figure className={styles.evidenceSpread}>
          <div className={styles.document}><header><b>Income statement</b><span>SRC–01</span></header>{values.map(([name, value], index) => <div className={index === 0 ? styles.selectedRow : styles.documentRow} key={name}><span>{name}</span><strong>{value}</strong></div>)}<div className={styles.documentLines} aria-hidden="true"><i /><i /><i /><i /></div></div>
          <figcaption className={styles.lineageCard}><p>Selected concept</p><h3>Revenue</h3><strong>€18,420,000</strong><dl><div><dt>Period</dt><dd>FY 2025</dd></div><div><dt>Unit</dt><dd>EUR</dd></div><div><dt>Confidence</dt><dd>98.4%</dd></div><div><dt>Evidence</dt><dd>SRC–01 · Row 14</dd></div></dl></figcaption>
        </figure>
        <p className={styles.caption}>FIG. 01 — A value becomes usable only when definition, period and evidence remain attached.</p>
      </section>

      <section className={styles.workflow}>
        <div className={styles.sectionLabel}><span>03</span><p>The controlled workflow</p></div>
        <div className={styles.sectionLead}><h2>Intelligence where meaning is ambiguous. <em>Code where truth is arithmetic.</em></h2><p>One execution surface. Five explicit states. No hidden leap from upload to answer.</p></div>
        <div className={styles.stageTable}>{stages.map(([number, title, copy, owner]) => <div className={styles.stageRow} key={number}><span>{number}</span><p>{owner}</p><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </section>

      <section className={styles.control}>
        <div className={styles.sectionLabel}><span>04</span><p>Proof, not plausibility</p></div>
        <div className={styles.sectionLead}><h2>The model must show its work.</h2><p>Every fixed relationship is recalculated. Every mismatch becomes visible. Material ambiguity is escalated rather than invented away.</p></div>
        <div className={styles.controlSpread}>
          <div className={styles.equation}><div><span>Revenue</span><strong>€18.42m</strong></div><i>−</i><div><span>Cost of sales</span><strong>€12.91m</strong></div><i>=</i><div><span>Gross profit</span><strong>€5.51m</strong></div></div>
          <div className={styles.controlResults}><div className={styles.pass}><span>Control 07</span><strong>Reconciled</strong><b>€0 difference</b></div><div className={styles.exception}><span>Exception 01</span><strong>Definition requires review</strong><p>“Other operating income” differs between two sources.</p><b>Human decision required</b></div></div>
        </div>
      </section>

      <section className={styles.output}>
        <div className={styles.sectionLabel}><span>05</span><p>The output</p></div>
        <div className={styles.sectionLead}><h2>Not confidence theatre. <em>A defensible financial state.</em></h2><p>Comparable definitions, inspectable reconciliations and findings connected to evidence.</p></div>
        <div className={styles.report}><header><b>ENTIMEMA / VALIDATED FINANCIAL MODEL</b><span>FI–0024 · FY 2025</span></header><div className={styles.reportTitle}><div><p>Decision state</p><h3>Ready for decision</h3></div><span>12 controls passed<br />1 judgement recorded</span></div>{values.map(([name, value, period, confidence]) => <div className={styles.reportRow} key={name}><span>{name}<small>{period}</small></span><strong>{value}</strong><em>{confidence}</em></div>)}<footer>Full evidence lineage attached</footer></div>
      </section>

      <section className={styles.manifesto}><p className={styles.kicker}>The manifesto</p><h2>AI should not ask finance to surrender control.</h2><div className={styles.manifestoLines}>{["Unknown is not an assumption.", "Extraction is not validation.", "Confidence is not evidence.", "A claim is not a fact.", "A result is not ready until it can be defended."].map((line, index) => <p key={line}><span>0{index + 1}</span>{line}</p>)}</div></section>

      <section className={styles.cta} id="pilot-checkout"><p>Financial Intelligence V1 · Founding pilot</p><h2>Bring one financial problem. <em>Leave with a controlled result.</em></h2><div className={styles.ctaActions}><FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="final">Commission a pilot <span>↗</span></FinancialIntelligenceCta><Link href="/services/financial-data">Examine the methodology <span>→</span></Link></div><small>One verified business · One agreed scope · Human-reviewed delivery</small></section>
    </article>
  </main>;
}
