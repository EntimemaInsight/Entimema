import styles from "../decision-automation/decision-automation.module.css";

const metrics = [
  ["Active Agents", "12", "10 operating"],
  ["Cases Processed", "2,486", "+18.2%"],
  ["Escalation Rate", "7.4%", "within policy"],
  ["Successful Execution", "98.6%", "+1.1 pts"],
];

const agents = [
  ["Portfolio Monitoring Agent", "Monitoring"],
  ["Credit Review Agent", "Analysing"],
  ["AML Investigation Agent", "Action Prepared"],
  ["Exception Agent", "Escalated"],
  ["Human Review", "Completed"],
];

export default function RiskAgentOperations() {
  return (
    <div className={styles.dashboard} aria-label="Illustrative risk AI agent operations dashboard">
      <div className={styles.dashboardTop}><div><span className={styles.dashboardEyebrow}>CONTROLLED RISK EXECUTION</span><h2>Risk Agent Operations</h2></div><span className={styles.demoBadge}>Agents Active</span></div>
      <div className={styles.metrics}>{metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}</div>
      <section className={styles.flowPanel} aria-labelledby="agent-activity-title">
        <div className={styles.chartHeading}><div><span>RULES · PERMISSIONS · AUDIT TRAIL</span><h3 id="agent-activity-title">Agent Activity</h3></div><span className={styles.executionBadge}>HUMAN OVERSIGHT</span></div>
        <div className={styles.flow}>{agents.map(([agent, status], index) => <div className={index === agents.length - 1 ? styles.flowDecision : ""} key={agent}><i>{index === agents.length - 1 ? "✓" : `0${index + 1}`}</i><span>{agent}<small>{status}</small></span></div>)}</div>
        <div className={styles.outcomeRail}><span className={styles.approve}>Monitoring <b>8</b></span><span className={styles.review}>Analysing <b>3</b></span><span className={styles.escalate}>Escalated <b>1</b></span><span className={styles.reject}>Completed <b>142</b></span></div>
      </section>
      <div className={styles.moduleGrid}>
        <section><span>Human Review Queue</span><strong>18</strong><small>cases pending review</small></section>
        <section><span>Agent Performance</span><strong>98.6%</strong><small>successful executions</small></section>
        <section><span>Escalations</span><strong>7.4%</strong><small>policy-based routing</small></section>
        <section><span>Execution Log</span><strong>2,486</strong><small>traceable actions</small></section>
      </div>
      <div className={styles.dashboardFooter}><span>Activity History</span><span>Human Review Queue</span><span>Agent Performance</span><span>Execution Log</span></div>
    </div>
  );
}
