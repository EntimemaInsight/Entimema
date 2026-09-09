import Link from "next/link";
import styles from "./launch.module.css";
import conversion from "./conversion.module.css";
import ProductExplainer from "./ProductExplainer";
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
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>AI financial statement analysis · controlled founding pilot</p>
            <h1>Financial analysis you can verify.</h1>
            <p className={styles.standfirst}>Bring an English Income Statement in XLSX or text-based PDF. Financial Intelligence V1 structures the statement, verifies supported calculations with deterministic controls, surfaces material exceptions and returns a traceable, human-reviewed result.</p>
            <div className={conversion.heroActions}>
              <FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="hero"><span className={conversion.heroPrimary}>Analyze my statement <span>↗</span></span></FinancialIntelligenceCta>
              <Link className={conversion.heroSecondary} href="#execution-proof">See the product in action <span>↓</span></Link>
            </div>
          </div>
          <aside className={styles.heroNote}><span className={styles.issueNumber}>01</span><p>The first commercial scope is deliberately narrow. The question is not whether AI can produce an answer. It is whether finance can inspect how that answer was produced.</p></aside>
        </div>
        <div className={styles.heroFooter}><span>Founding pilot</span><span>Income Statement · Evidence · Control</span></div>
      </header>

      <div className={conversion.proofBar} aria-label="Verified pilot characteristics">
        <div><small>Input</small><strong>English Income Statement</strong></div>
        <div><small>Formats</small><strong>XLSX · text-based PDF</strong></div>
        <div><small>Control</small><strong>Deterministic financial checks</strong></div>
        <div><small>Delivery</small><strong>Traceable · human-reviewed</strong></div>
      </div>

      <section className={styles.premise}>
        <div className={styles.sectionLabel}><span>01</span><p>The premise</p></div>
        <div className={styles.premiseGrid}><h2>The problem is not extracting a number.</h2><div className={styles.bodyCopy}><p className={styles.dropcap}>A number can be copied perfectly and still be wrong for the decision. Its period may differ. Its definition may drift. Its sign, currency or unit may be misunderstood. Its source may contradict another document.</p><p>Speed without control does not remove uncertainty. It merely delivers it earlier.</p></div></div>
        <blockquote>“The useful output is not a number. It is a number whose meaning, arithmetic and origin can survive examination.”</blockquote>
      </section>

      <div id="execution-proof"><ProductExplainer /></div>

      <section className={styles.output}>
        <div className={styles.sectionLabel}><span>02</span><p>Founding pilot scope</p></div>
        <div className={styles.sectionLead}><h2>Start with one Income Statement.</h2><p>V1 is being sold as a controlled pilot, not as universal document automation. The verified input scope is English-language Income Statements supplied as XLSX or text-based PDF.</p></div>
        <div className={styles.report}>
          <header><b>ENTIMEMA / V1 VERIFIED SCOPE</b><span>FOUNDING PILOT · 2026</span></header>
          <div className={styles.reportTitle}><div><p>Commercial boundary</p><h3>Known scope before broad claims.</h3></div><span>One agreed statement<br />One controlled execution</span></div>
          <div className={styles.reportRow}><span>Statement<small>Verified today</small></span><strong>Income Statement</strong><em>IN SCOPE</em></div>
          <div className={styles.reportRow}><span>Language<small>Verified today</small></span><strong>English</strong><em>IN SCOPE</em></div>
          <div className={styles.reportRow}><span>Formats<small>Verified today</small></span><strong>XLSX · text-based PDF</strong><em>IN SCOPE</em></div>
          <div className={styles.reportRow}><span>Control model<small>Execution boundary</small></span><strong>AI semantics · deterministic arithmetic · human review</strong><em>CONTROLLED</em></div>
          <footer>Not represented as verified: OCR or scanned documents · whole annual reports · multilingual statements · arbitrary financial statement types</footer>
        </div>
      </section>

      <section className={styles.evidence}>
        <div className={styles.sectionLabel}><span>03</span><p>From document to evidence</p></div>
        <div className={styles.sectionLead}><h2>The value and its source remain one object.</h2><p>Financial Intelligence does not detach a figure from the document that gives it meaning. The path back is part of the output.</p></div>
        <figure className={styles.evidenceSpread}>
          <div className={styles.document}><header><b>Income statement</b><span>SRC–01</span></header>{values.map(([name, value], index) => <div className={index === 0 ? styles.selectedRow : styles.documentRow} key={name}><span>{name}</span><strong>{value}</strong></div>)}<div className={styles.documentLines} aria-hidden="true"><i /><i /><i /><i /></div></div>
          <figcaption className={styles.lineageCard}><p>Selected concept</p><h3>Revenue</h3><strong>€18,420,000</strong><dl><div><dt>Period</dt><dd>FY 2025</dd></div><div><dt>Unit</dt><dd>EUR</dd></div><div><dt>Confidence</dt><dd>98.4%</dd></div><div><dt>Evidence</dt><dd>SRC–01 · Row 14</dd></div></dl></figcaption>
        </figure>
        <p className={styles.caption}>FIG. 01 — A value becomes usable only when definition, period and evidence remain attached.</p>
      </section>

      <section className={styles.workflow}>
        <div className={styles.sectionLabel}><span>04</span><p>The controlled workflow</p></div>
        <div className={styles.sectionLead}><h2>Intelligence where meaning is ambiguous. <em>Code where truth is arithmetic.</em></h2><p>One execution surface. Five explicit states. No hidden leap from upload to answer.</p></div>
        <div className={styles.stageTable}>{stages.map(([number, title, copy, owner]) => <div className={styles.stageRow} key={number}><span>{number}</span><p>{owner}</p><h3>{title}</h3><p>{copy}</p></div>)}</div>
      </section>

      <section className={styles.control}>
        <div className={styles.sectionLabel}><span>05</span><p>Proof, not plausibility</p></div>
        <div className={styles.sectionLead}><h2>The model must show its work.</h2><p>Every supported fixed relationship is recalculated. Every mismatch becomes visible. Material ambiguity is escalated rather than invented away.</p></div>
        <div className={styles.controlSpread}>
          <div className={styles.equation}><div><span>Revenue</span><strong>€18.42m</strong></div><i>−</i><div><span>Cost of sales</span><strong>€12.91m</strong></div><i>=</i><div><span>Gross profit</span><strong>€5.51m</strong></div></div>
          <div className={styles.controlResults}><div className={styles.pass}><span>Control 07</span><strong>Reconciled</strong><b>€0 difference</b></div><div className={styles.exception}><span>Exception 01</span><strong>Definition requires review</strong><p>“Other operating income” differs between two sources.</p><b>Human decision required</b></div></div>
        </div>
      </section>

      <section className={styles.output}>
        <div className={styles.sectionLabel}><span>06</span><p>The output</p></div>
        <div className={styles.sectionLead}><h2>Not confidence theatre. <em>A defensible financial state.</em></h2><p>Comparable definitions, inspectable reconciliations and findings connected to evidence.</p></div>
        <div className={styles.report}><header><b>ENTIMEMA / VALIDATED FINANCIAL MODEL</b><span>FI–0024 · FY 2025</span></header><div className={styles.reportTitle}><div><p>Decision state</p><h3>Ready for decision</h3></div><span>12 controls passed<br />1 judgement recorded</span></div>{values.map(([name, value, period, confidence]) => <div className={styles.reportRow} key={name}><span>{name}<small>{period}</small></span><strong>{value}</strong><em>{confidence}</em></div>)}<footer>Full evidence lineage attached</footer></div>
      </section>

      <section className={conversion.pilotBridge}>
        <div className={conversion.pilotBridgeGrid}>
          <div>
            <span className={conversion.sectionLabel}>LOW-FRICTION PRODUCT PROOF</span>
            <h2>Bring one statement. <em>Judge the result yourself.</em></h2>
            <p>The founding pilot is designed to answer one commercial question quickly: does a controlled Financial Intelligence execution create enough value on your own financial data to justify the next paid workflow?</p>
            <div className={conversion.pilotActions}>
              <FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="explainer">Start with my statement <span>↗</span></FinancialIntelligenceCta>
              <Link href="/services/financial-data">Review the methodology <span>→</span></Link>
            </div>
          </div>
          <aside className={conversion.pilotCard}>
            <div><span>You provide</span><strong>1 English Income Statement</strong></div>
            <div><span>Accepted</span><strong>XLSX or text-based PDF</strong></div>
            <div><span>We return</span><strong>Structured, controlled, traceable result</strong></div>
            <div><span>Human control</span><strong>Material exceptions reviewed</strong></div>
            <div><span>Next step</span><strong>Paid workflow only if value is proven</strong></div>
          </aside>
        </div>
      </section>

      <section className={styles.manifesto}><p className={styles.kicker}>The operating principles</p><h2>AI should not ask finance to surrender control.</h2><div className={styles.manifestoLines}>{["Unknown is not an assumption.", "Extraction is not validation.", "Confidence is not evidence.", "A claim is not a fact.", "A result is not ready until it can be defended."].map((line, index) => <p key={line}><span>0{index + 1}</span>{line}</p>)}</div></section>

      <section className={styles.cta} id="pilot-checkout"><p>Financial Intelligence V1 · Founding pilot</p><h2>Test it on your Income Statement. <em>Leave with a controlled result.</em></h2><div className={styles.ctaActions}><FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="final">Analyze my statement <span>↗</span></FinancialIntelligenceCta><Link href="/services/financial-data">Examine the methodology <span>→</span></Link></div><small>Current verified input scope: English XLSX or text-based PDF Income Statement · Human-reviewed delivery</small></section>
    </article>
  </main>;
}
