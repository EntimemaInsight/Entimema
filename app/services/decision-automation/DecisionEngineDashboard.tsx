import styles from "./decision-automation.module.css";

const metrics = [
  ["Decision Volume", "48,920", "+12.4%"],
  ["Approval Rate", "64.8%", "+2.7 pts"],
  ["Human Review Rate", "11.6%", "−3.2 pts"],
  ["Average Decision Time", "1.8s", "−0.6s"],
];

const flow = ["Input Data", "Data Enrichment", "Model Score", "Business Rules", "Decision"];

export default function DecisionEngineDashboard() {
  return (
    <div className={styles.dashboard} aria-label="Illustrative decision engine dashboard">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>DECISION ENGINE</span><h2>Decision Management</h2></div><span className={styles.demoBadge}>Active Strategy</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <section className={styles.flowPanel} aria-labelledby="decision-flow-title">
        <div className={styles.chartHeading}><div><span>EXECUTION LAYER</span><h3 id="decision-flow-title">Decision Flow</h3></div><span className={styles.executionBadge}>EXECUTING</span></div>
        <div className={styles.flow}>{flow.map((step, index) => <div className={index === flow.length - 1 ? styles.flowDecision : ""} key={step}><i>{index < 4 ? `0${index + 1}` : "✓"}</i><span>{step}</span></div>)}</div>
        <div className={styles.outcomeRail}><span className={styles.approve}>Approve <b>64.8%</b></span><span className={styles.review}>Human Review <b>11.6%</b></span><span className={styles.reject}>Decline <b>20.9%</b></span><span className={styles.escalate}>Escalate <b>2.7%</b></span></div>
      </section>
      <div className={styles.moduleGrid}>
        <section><span>Strategy Performance</span><strong>+8.4%</strong><small>risk-adjusted outcome</small></section>
        <section><span>Champion vs Challenger</span><div className={styles.strategyBars}><i><b /></i><i><b /></i></div><small>Champion leads by 4.2 pts</small></section>
        <section><span>Rule Execution</span><strong>27 / 27</strong><small>rules evaluated</small></section>
        <section><span>Exceptions</span><strong>1.3%</strong><small>within threshold</small></section>
      </div>
      <div className={styles.dashboardFooter}><span>Decision Distribution</span><span>Decision History</span><span>Strategy Performance</span><span>Rule Execution</span></div>
    </div>
  );
}
