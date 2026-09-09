"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./launch.module.css";
import { FinancialIntelligenceCta, FinancialIntelligenceViewAnalytics } from "./FinancialIntelligenceAnalytics";

const stages = [
  ["01", "Understand", "AI reads structure, labels and context."],
  ["02", "Structure", "Values enter one canonical financial model."],
  ["03", "Control", "Code recalculates identities and reconciliations."],
  ["04", "Review", "Material uncertainty stops for human judgement."],
  ["05", "Deliver", "The result leaves with evidence attached."],
] as const;
const values = [["Revenue", "€18,420,000", "FY 2025", "98.4%"], ["Cost of sales", "€12,910,000", "FY 2025", "99.1%"], ["Gross profit", "€5,510,000", "FY 2025", "100%"]] as const;

export default function EditorialExperience() {
  const pageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = pageRef.current; if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.setAttribute("data-visible", "true"); }), { threshold: .16 });
    root.querySelectorAll("[data-reveal]").forEach((node) => reveal.observe(node));
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = root.getBoundingClientRect();
        const reading = reduce ? 1 : Math.max(0, Math.min(1, -rect.top / (root.scrollHeight - window.innerHeight)));
        root.style.setProperty("--reading-progress", String(reading));
        root.querySelectorAll<HTMLElement>("[data-scene]").forEach((scene) => {
          const sceneRect = scene.getBoundingClientRect();
          const travel = sceneRect.height + window.innerHeight;
          const value = reduce ? 1 : Math.max(0, Math.min(1, (window.innerHeight - sceneRect.top) / travel));
          root.style.setProperty(`--${scene.dataset.scene}-progress`, String(value));
        });
      });
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); window.addEventListener("resize", onScroll);
    return () => { reveal.disconnect(); if (frame) window.cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  return <main ref={pageRef} className={styles.page}>
    <FinancialIntelligenceViewAnalytics /><div className={styles.readingBar} aria-hidden="true" />
    <header className={styles.hero}><div className={styles.heroGrid} aria-hidden="true" /><div className={styles.issueLine}><span>ENTIMEMA / FINANCIAL INTELLIGENCE</span><span>V1 · 09.09.2026</span></div><div className={styles.heroCopy}><p className={styles.kicker}>A CONTROLLED FINANCIAL WORKFLOW</p><h1><span>Financial data</span><br />deserves more than<br /><em>an AI answer.</em></h1><p className={styles.standfirst}>It deserves a chain of evidence, calculation and accountable judgement. This is the argument behind Financial Intelligence V1.</p></div><div className={styles.heroMachine} aria-hidden="true"><div className={styles.orbit}><span>PDF</span><span>XLSX</span><span>CSV</span></div><div className={styles.core}><small>UNCONTROLLED</small><b>?</b><i /></div><div className={styles.scanLine} /></div><a className={styles.scrollCue} href="#premise"><span>Scroll to examine</span><i>↓</i></a></header>
    <section id="premise" className={styles.premise}><div className={styles.chapter} data-reveal><span>01</span><p>THE PREMISE</p></div><div className={styles.premiseGrid}><h2 data-reveal>The problem is not extracting a number.</h2><div data-reveal><p className={styles.dropcap}>A number can be copied perfectly and still be wrong for the decision. Its period may differ. Its definition may drift. Its sign, currency or unit may be misunderstood. Its source may contradict another document.</p><p>Speed without control does not remove uncertainty. It merely delivers it earlier.</p></div></div><blockquote data-reveal>“The useful output is not a number. It is a number whose meaning, arithmetic and origin can survive examination.”</blockquote></section>
    <section className={styles.extraction} data-scene="extract" aria-label="From document to evidence"><div className={styles.stickyStage}><div className={styles.chapterLight}><span>02</span><p>FROM DOCUMENT TO EVIDENCE</p></div><div className={styles.documentScene}><div className={styles.paper} aria-hidden="true"><div className={styles.paperHead}>INCOME STATEMENT</div>{values.map(([name, value], i) => <div className={styles.paperRow} key={name} style={{ "--row": i } as React.CSSProperties}><span>{name}</span><b>{value}</b></div>)}<div className={styles.paperNoise} /></div><div className={styles.evidenceLine} aria-hidden="true"><i /><span>SRC–01 · ROW 14</span></div><div className={styles.valueCard} data-reveal><small>SELECTED CONCEPT</small><h3>Revenue</h3><strong>€18,420,000</strong><dl><div><dt>Period</dt><dd>FY 2025</dd></div><div><dt>Unit</dt><dd>EUR</dd></div><div><dt>Confidence</dt><dd>98.4%</dd></div><div><dt>Evidence</dt><dd>SRC–01 · Row 14</dd></div></dl></div></div><div className={styles.extractionCopy}><p>Financial Intelligence does not detach the value from its source.</p><p>It preserves the path back.</p></div></div></section>
    <section className={styles.workflow} data-scene="workflow"><div className={styles.chapter} data-reveal><span>03</span><p>THE CONTROLLED WORKFLOW</p></div><div className={styles.workflowIntro}><h2 data-reveal>Intelligence where meaning is ambiguous.<br/><em>Code where truth is arithmetic.</em></h2><p data-reveal>One execution surface. Five explicit states. No hidden leap from upload to answer.</p></div><div className={styles.rail}><div className={styles.railLine} aria-hidden="true"><i /></div>{stages.map(([number, title, copy]) => <article key={number} data-reveal><span>{number}</span><div><small>{number === "01" || number === "02" ? "AI REASONING" : number === "03" ? "DETERMINISTIC CODE" : number === "04" ? "HUMAN CONTROL" : "TRACEABLE OUTPUT"}</small><h3>{title}</h3><p>{copy}</p></div><b aria-hidden="true">↘</b></article>)}</div></section>
    <section className={styles.control} data-scene="control"><div className={styles.controlCopy} data-reveal><div className={styles.chapterLight}><span>04</span><p>PROOF, NOT PLAUSIBILITY</p></div><h2>The model must<br/>show its work.</h2><p>Every fixed relationship is recalculated. Every mismatch becomes visible. Material ambiguity is escalated rather than invented away.</p></div><div className={styles.reconciliation} aria-label="Reconciliation demonstration"><div className={styles.equation}><span>Revenue</span><b>€18.42m</b><i>−</i><span>Cost of sales</span><b>€12.91m</b><i>=</i><span>Gross profit</span><b>€5.51m</b></div><div className={styles.checkBeam} aria-hidden="true" /><div className={styles.pass}><span>CONTROL 07</span><strong>Reconciled</strong><b>€0 difference</b></div><div className={styles.exception}><span>EXCEPTION 01</span><strong>Definition requires review</strong><p>“Other operating income” differs between two sources.</p><button type="button" tabIndex={-1}>Human decision required</button></div></div></section>
    <section className={styles.output} data-scene="output"><div className={styles.chapter} data-reveal><span>05</span><p>THE OUTPUT</p></div><h2 data-reveal>Not confidence theatre.<br/><em>A defensible financial state.</em></h2><div className={styles.outputSpread}><div className={styles.report} data-reveal><header><b>ENTIMEMA</b><span>FI–0024</span></header><small>VALIDATED FINANCIAL MODEL</small><h3>FY 2025 review</h3><div className={styles.reportStatus}><i /> READY FOR DECISION</div>{values.map(([name, value, period, confidence]) => <div className={styles.reportRow} key={name}><span>{name}<small>{period}</small></span><strong>{value}</strong><em>{confidence}</em></div>)}<footer>12 controls passed · 1 judgement recorded · Full evidence lineage</footer></div><div className={styles.outputCopy} data-reveal><p>Comparable financial definitions.</p><p>Reconciliations that can be inspected.</p><p>Exceptions with named owners.</p><p>Findings connected to evidence.</p></div></div></section>
    <section className={styles.manifesto} data-scene="manifesto"><p data-reveal>THE MANIFESTO</p><h2 data-reveal>AI should not ask finance<br/>to surrender control.</h2><div className={styles.manifestoLines}>{["Unknown is not an assumption.", "Extraction is not validation.", "Confidence is not evidence.", "A claim is not a fact.", "A result is not ready until it can be defended."].map((line, i) => <p key={line} data-reveal><span>0{i + 1}</span>{line}</p>)}</div></section>
    <section className={styles.cta} id="pilot-checkout"><div className={styles.ctaRule} aria-hidden="true" /><p>FINANCIAL INTELLIGENCE V1 · FOUNDING PILOT</p><h2>Bring one financial problem.<br/><em>Leave with a controlled result.</em></h2><div className={styles.ctaActions}><FinancialIntelligenceCta href="/contact?topic=financial-data" kind="start_pilot" position="final">Commission a pilot <span>↗</span></FinancialIntelligenceCta><Link href="/services/financial-data">Examine the methodology <span>→</span></Link></div><small>One verified business · One agreed scope · Human-reviewed delivery</small></section>
  </main>;
}
