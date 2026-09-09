import type { Metadata } from "next";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import { DemoTrigger } from "@/components/DemoDiscovery";
import InteractiveAgentCards from "./InteractiveAgentCards";
import styles from "./agent-manager.module.css";
import ui from "./product-ui.module.css";

export const metadata: Metadata = {
  title: "AI Agent Manager for Controlled Financial Workflows | Entimema",
  description: "Configure specialist financial AI agents around evidence, deterministic controls and human review from one governed workspace.",
  alternates: { canonical: "https://www.entimema.com/product/ai-agent-manager" },
};

const pillars = [
  ["01", "Domain-driven, finance-led.", "Specialist agents work inside defined financial tasks, evidence requirements and decision responsibilities."],
  ["02", "Configurable to your controls.", "Set context, tools, deterministic checks and escalation logic around each controlled workflow."],
  ["03", "Traceable and reviewable.", "Keep source evidence, control results and material human judgement visible throughout execution."],
] as const;

function Chrome({ title }: { title: string }) {
  return <div className={ui.chrome}><div className={ui.dots}><i/><i/><i/></div><strong>{title}</strong><div className={ui.chromeActions}><span>Inspect</span><b>Run test</b></div></div>;
}

function Navigation({ active }: { active: string }) {
  return <aside className={ui.nav}><strong>Entimema</strong>{["Agents","Workflows","Evidence","Controls","Review","Monitoring"].map(item => <span key={item} className={item === active ? ui.active : undefined}>{item}</span>)}</aside>;
}

function WorkflowWorkspace() {
  return <div className={ui.screen} aria-label="Illustrative Entimema Financial Intelligence agent workspace">
    <Chrome title="Financial Intelligence / Income Statement"/>
    <div className={ui.shell}>
      <Navigation active="Workflows"/>
      <section className={ui.workspace}>
        <header className={ui.workspaceHeader}><div><small>WORKFLOW</small><strong>Income Statement Analysis</strong></div><span>CONTROLLED PILOT UI</span></header>
        <div className={ui.flowColumn}>
          <div className={ui.flowNode}><em>01</em><div><b>Document intake</b><small>Register source file and period context</small></div><span>XLSX · text PDF</span></div><i className={ui.line}/>
          <div className={ui.flowNode}><em>02</em><div><b>Financial understanding</b><small>Interpret labels, structure, period and units</small></div><span>AI</span></div><i className={ui.line}/>
          <div className={`${ui.flowNode} ${ui.control}`}><em>03</em><div><b>Deterministic financial controls</b><small>Recalculate supported relationships and KPIs</small></div><span>CODE</span></div><i className={ui.line}/>
          <div className={`${ui.flowNode} ${ui.review}`}><em>04</em><div><b>Exception review</b><small>Escalate material ambiguity with source evidence</small></div><span>HUMAN</span></div><i className={ui.line}/>
          <div className={ui.flowNode}><em>05</em><div><b>Validated output</b><small>Structured financial model and findings</small></div><span>READY</span></div>
        </div>
      </section>
      <aside className={ui.inspector}><div className={ui.tabs}><span className={ui.selected}>Output</span><span>Evidence</span><span>Controls</span></div><div className={ui.panel}>
        <div className={ui.panelHeader}><div><small>FINANCIAL VALUE</small><strong>Revenue</strong></div><span className={ui.verified}>✓ VERIFIED</span></div>
        <div className={ui.dataTable}><div><span>FY 2025</span><b>€18,420,000</b></div><div><span>Cost of sales</span><b>€12,910,000</b></div><div><span>Gross profit</span><b>€5,510,000</b></div></div>
        <div className={ui.controlBox}><small>CONTROL RESULT</small><strong>Revenue − Cost of sales = Gross profit</strong><p>Difference: €0 · Source lineage: SRC–01</p></div>
      </div></aside>
    </div>
  </div>;
}

function ControlWorkspace() {
  return <div className={ui.screen} aria-label="Illustrative Entimema agent control configuration interface">
    <Chrome title="Agent Builder / Revenue validation"/>
    <div className={ui.splitShell}>
      <Navigation active="Controls"/>
      <section className={ui.logicCanvas}>
        <header className={ui.logicHeader}><div><small>CONTROL FLOW</small><strong>Revenue validation policy</strong></div><span>● Active</span></header>
        <div className={ui.logicFlow}>
          <div className={ui.logicNode}><em>AI</em><div><b>Map source value</b><small>Interpret financial meaning and source context</small></div></div>
          <div className={ui.line}/>
          <div className={`${ui.logicNode} ${ui.orange}`}><em>IF</em><div><b>Material ambiguity detected</b><small>Confidence, definition or source representation requires review</small></div></div>
          <div className={ui.logicBranch}/>
          <div className={ui.branchRow}><div className={ui.logicNode}><em>YES</em><div><b>Human review</b><small>Attach evidence and block decision</small></div></div><div className={ui.logicNode}><em>NO</em><div><b>Deterministic control</b><small>Recalculate and reconcile</small></div></div></div>
          <div className={ui.line}/>
          <div className={ui.logicNode}><em>✓</em><div><b>Release validated output</b><small>Record control result and lineage</small></div></div>
        </div>
      </section>
      <aside className={ui.configPanel}><div className={ui.tabs}><span className={ui.selected}>Logic</span><span>Inputs</span><span>Testing</span></div><div className={ui.form}>
        <div className={ui.field}><label>Owner</label><div className={ui.input}>Finance</div></div>
        <div className={ui.field}><label>Evidence requirement</label><div className={ui.tokenRow}><span className={ui.token}>Source file</span><span className={ui.token}>Period</span><span className={ui.token}>Value lineage</span></div></div>
        <div className={ui.field}><label>Arithmetic execution</label><div className={ui.input}>Deterministic code</div></div>
        <div className={ui.field}><label>Material exception</label><div className={ui.input}>Human review required</div></div>
        <div className={ui.testBox}><small>TEST RESULT</small><strong>Control passed</strong><p>Expected relationship reconciled with €0 difference.</p></div>
      </div></aside>
    </div>
  </div>;
}

function MonitoringWorkspace() {
  return <div className={ui.screen} aria-label="Illustrative Entimema agent monitoring interface">
    <Chrome title="Agent Monitoring / Financial Intelligence"/>
    <div className={ui.monitorShell}>
      <Navigation active="Monitoring"/>
      <section className={ui.monitorMain}>
        <header className={ui.monitorHeader}><div><small>EXECUTION MONITORING</small><strong>Financial Intelligence runs</strong></div><button type="button">New execution</button></header>
        <div className={ui.metricRow}><article className={ui.metric}><small>ACTIVE WORKFLOW</small><strong>1</strong><span>Controlled Pilot</span></article><article className={ui.metric}><small>VERIFIED VALUES</small><strong>24</strong><span>Current run</span></article><article className={ui.metric}><small>CONTROL DIFFERENCE</small><strong>€0</strong><span>Reconciled</span></article><article className={ui.metric}><small>OPEN EXCEPTIONS</small><strong>1</strong><span>Needs review</span></article></div>
        <div className={ui.executionArea}>
          <div className={ui.table}><div className={ui.tableHead}><span>Execution</span><span>Source</span><span>Status</span><span>Review</span></div><div className={ui.tableRow}><b>FI–0024</b><span>Income Statement</span><span className={ui.statusReview}>Review</span><span>1 item</span></div><div className={ui.tableRow}><b>FI–0023</b><span>Income Statement</span><span className={ui.statusGood}>Validated</span><span>Complete</span></div><div className={ui.tableRow}><b>FI–0022</b><span>Income Statement</span><span className={ui.statusGood}>Validated</span><span>Complete</span></div><div className={ui.tableRow}><b>FI–0021</b><span>Income Statement</span><span className={ui.statusGood}>Validated</span><span>Complete</span></div></div>
          <aside className={ui.detail}><small>FI–0024</small><strong>Execution detail</strong><p>English Income Statement · FY 2025 · source evidence registered.</p><div className={ui.detailStep}><span>Evidence</span><b>Complete</b></div><div className={ui.detailStep}><span>Interpretation</span><b>Complete</b></div><div className={ui.detailStep}><span>Controls</span><b>Passed</b></div><div className={ui.detailStep}><span>Review</span><b>1 exception</b></div><div className={ui.note}>Material ambiguity remains blocked until a finance reviewer records the judgement.</div></aside>
        </div>
      </section>
    </div>
  </div>;
}

export default function AgentManagerPage() {
  return <main className={styles.page}>
    <AnnouncementBar/><Navbar active="product"/>

    <section className={styles.hero}><div className="site-container">
      <span className={styles.badge}>AI Agent Manager</span>
      <h1>Put specialist AI agents to work.<br/><em>Keep financial control.</em></h1>
      <p>Configure governed agents for financial workflows — combining AI interpretation, deterministic controls, evidence and accountable human review.</p>
      <div className={styles.actions}><DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/><a href="#agents">Explore the architecture <span>→</span></a></div>
      <div className={styles.scope}>FINANCE-LED · EVIDENCE-GROUNDED · HUMAN-CONTROLLED</div>
    </div></section>

    <section className={styles.pillars}><div className="site-container"><div className={styles.pillarGrid}>{pillars.map(([n,t,c])=><article key={n}><span>{n}</span><h2>{t}</h2><p>{c}</p></article>)}</div></div></section>

    <section className={styles.agentLibrary} id="agents"><div className="site-container">
      <header className={styles.centerHeader}><span className={styles.badge}>Controlled agent architecture</span><h2>Specialist agents for work<br/><em>that finance needs to defend.</em></h2><p>Start with a bounded workflow. Keep every transformation, control and exception inspectable.</p></header>
      <InteractiveAgentCards/>
    </div></section>

    <section className={styles.productSection}><div className="site-container"><header className={styles.centerHeader}><span className={styles.badge}>Agent workflow</span><h2>See the product surface.<br/><em>From source file to verified result.</em></h2><p>A finance-grade workspace shows the workflow, source evidence, control state and output together.</p></header><WorkflowWorkspace/></div></section>

    <section className={styles.productSectionAlt}><div className="site-container"><header className={styles.centerHeader}><span className={styles.badge}>Agent controls</span><h2>Configure agents inside<br/><em>explicit financial boundaries.</em></h2><p>Build review logic around evidence and deterministic checks instead of hiding decisions inside a prompt.</p></header><ControlWorkspace/></div></section>

    <section className={styles.productSection}><div className="site-container"><header className={styles.centerHeader}><span className={styles.badge}>Agent monitoring</span><h2>Monitor the real execution state.<br/><em>Not just an AI response.</em></h2><p>Inspect runs, validations and material exceptions from one governed product interface.</p></header><MonitoringWorkspace/></div></section>

    <section className={styles.finalCta}><div className="site-container"><span className={styles.badge}>AI Agent Manager</span><h2>Start with one controlled<br/><em>financial workflow.</em></h2><p>See how Entimema combines specialist AI, deterministic controls and human review around financial evidence.</p><DemoTrigger className={styles.primaryCta} initialInterest="AI Agent Manager"/></div></section>
  </main>;
}
