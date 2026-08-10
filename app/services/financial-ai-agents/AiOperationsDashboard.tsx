import styles from "./financial-ai-agents.module.css";

const metrics = [
  ["Automated Tasks", "1,284", "+18% this month"],
  ["Successful Execution", "99.4%", "Stable"],
  ["Hours Saved", "326h", "This quarter"],
  ["Agent Utilisation", "87%", "12 active agents"],
];

export default function AiOperationsDashboard() {
  return (
    <div className={styles.dashboard} aria-label="AI operations dashboard">
      <div className={styles.dashboardTop}>
        <div><span className={styles.dashboardEyebrow}>FINANCE OPERATIONS</span><h2>AI Operations</h2></div>
        <span className={styles.demoBadge}>Live execution</span>
      </div>
      <div className={styles.metrics}>
        {metrics.map(([label, value, note]) => <div className={styles.metric} key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>
      <div className={styles.charts}>
        <section className={styles.chartPanel} aria-labelledby="automation-trend-title">
          <div className={styles.chartHeading}><div><span>Automation Trend</span><h3 id="automation-trend-title">Completed Runs</h3></div><div className={styles.legend}><i />Completed <i />Scheduled</div></div>
          <svg className={styles.lineChart} viewBox="0 0 420 150" role="img" aria-label="Steady growth in automated finance tasks">
            <g className={styles.gridLines}><path d="M10 25H410M10 75H410M10 125H410" /></g>
            <path className={styles.forecastLine} d="M12 118C70 108 100 96 145 89S222 76 275 62S352 46 408 38" />
            <path className={styles.actualLine} d="M12 124C60 119 98 101 145 104S222 80 275 76S350 45 408 25" />
          </svg>
          <div className={styles.axis}><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="workflow-status-title">
          <div className={styles.chartHeading}><div><span>Workflow Status</span><h3 id="workflow-status-title">Execution Status</h3></div></div>
          <div className={styles.statusTrack}><div><strong>38</strong><span>Completed</span></div><div><strong>7</strong><span>In Progress</span></div><div><strong>3</strong><span>Queued</span></div></div>
        </section>
      </div>
      <div className={styles.operationsGrid}>
        <section className={styles.chartPanel} aria-labelledby="agent-activity-title">
          <div className={styles.chartHeading}><div><span>Agent Activity</span><h3 id="agent-activity-title">Recent Finance Operations</h3></div></div>
          <div className={styles.activityList}>
            <div className={styles.activityRow}><i /><span>Margin variance analysis</span><strong>Completed</strong></div>
            <div className={styles.activityRow}><i /><span>Management report update</span><strong>In Progress</strong></div>
          </div>
        </section>
        <section className={styles.cashPanel} aria-labelledby="execution-queue-title">
          <div className={styles.chartHeading}><div><span>Execution Queue</span><h3 id="execution-queue-title">Next Operations</h3></div></div>
          <div className={styles.queueList}><div className={styles.queueRow}><span>Cash validation</span><strong>09:30</strong></div><div className={styles.queueRow}><span>ERP close</span><strong>10:00</strong></div></div>
        </section>
      </div>
    </div>
  );
}
