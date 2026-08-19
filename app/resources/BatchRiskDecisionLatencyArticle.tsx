import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./batch-risk-decision-latency.module.css";

export const batchRiskDecisionLatencySections = [
  { id: "batch", label: "Batch is not the enemy" }, { id: "budget", label: "Latency budget" },
  { id: "chain", label: "End-to-end latency" }, { id: "freshness", label: "Freshness and time" },
  { id: "sla", label: "Decision SLA" }, { id: "lead", label: "Lead time" },
  { id: "decisions", label: "Decision examples" }, { id: "matrix", label: "Freshness matrix" },
  { id: "value", label: "Value and ROI" }, { id: "architecture", label: "Tiered architecture" },
  { id: "control", label: "Speed and control" }, { id: "case", label: "Vertical-slice case" },
  { id: "observability", label: "Decision observability" }, { id: "models", label: "Model integrity" },
  { id: "institutions", label: "Bank and non-bank" }, { id: "agent", label: "Freshness Agent" },
] as const;

export default function BatchRiskDecisionLatencyArticle() { return <div className={styles.articleBody}>
  <section id="batch">
    <p className={styles.lead}>Nothing is technically broken. Every job ran successfully. But the customer changed after the last refresh, so the institution is making a correct decision about an old state.</p>
    <KeyObservation title="The central thesis"><p><strong>Batch processing is not obsolete. But when the value of a financial decision decays faster than the data supporting it are refreshed, latency stops being an IT characteristic and becomes a business-risk parameter.</strong></p></KeyObservation>
    <div className={styles.dual}><article><b>BATCH REMAINS EXCELLENT</b><p>Monthly ECL, regulatory reporting, portfolio analytics, financial close and periodic model monitoring need completeness, control and reproducibility—not artificial immediacy.</p></article><article><b>THE DESIGN TEST</b><p>Collections, exposure, limit and behavioural decisions may become economically different while they wait. Their cadence must follow the decision need.</p></article></div>
    <Formula label="The architectural objective"><span className={styles.formula}>Batch → Bad &nbsp; is false. &nbsp; Latency ↔ Decision Need</span></Formula>
    <p>Do not begin with “Should this system be real-time?” Begin with: <strong>what is the maximum acceptable information delay before the decision becomes economically different?</strong></p>
  </section>

  <section id="budget"><h2>The latency budget belongs to the decision</h2>
    <Formula label="Entimema decision latency budget"><span className={styles.formula}>LatencyBudget<sub>D</sub> = f(RiskChangeVelocity, DecisionMateriality, InterventionWindow, Reversibility)</span></Formula>
    <p>This is a design framework, not a universal numerical formula. It asks how stale information can become before decision D materially changes in value, risk or customer outcome.</p>
    <div className={styles.four}><article><b>RISK-STATE VELOCITY</b><p>How quickly the relevant state can change. A structural characteristic usually moves more slowly than utilisation, payment failure, new delinquency or exposure.</p></article><article><b>DECISION MATERIALITY</b><p>How strongly an error can change exposure, loss, customer treatment or operating cost.</p></article><article><b>INTERVENTION WINDOW</b><p>The time between the signal and the latest useful action. If the pipeline consumes it, prediction arrives without practical value.</p></article><article><b>REVERSIBILITY</b><p>An internal alert is easier to reverse than customer contact, an exposure increase or a credit decision.</p></article></div>
    <Formula label="Conceptual risk-change velocity"><span className={styles.formula}>Velocity<sub>risk</sub> = Δ RiskState / Δt</span></Formula>
    <Formula label="Useful intervention window"><span className={styles.formula}>Window<sub>action</sub> = T<sub>latest useful action</sub> − T<sub>signal</sub></span></Formula>
    <p>When <strong>DecisionLatency ≈ Window<sub>action</sub></strong>, the intervention may be technically delivered and economically late.</p>
  </section>

  <section id="chain"><h2>Measure the whole path from event to action</h2>
    <EntimemaFramework title="Financial Event to Outcome" steps={["Financial event", "Data availability", "Feature construction", "Model refresh", "Decision", "Action", "Outcome"]} />
    <Formula label="Total event-to-action latency"><span className={styles.formula}>L<sub>total</sub> = L<sub>event</sub> + L<sub>ingestion</sub> + L<sub>processing</sub> + L<sub>feature</sub> + L<sub>model</sub> + L<sub>workflow</sub> + L<sub>action</sub></span></Formula>
    <ResourceTable caption="Where decision latency accumulates" headers={["Layer", "What it measures", "Typical mechanism"]} rows={[
      ["Event", "Economic event → institutional availability", "PSP, bureau or external-provider delay"], ["Ingestion", "Availability → received data", "Scheduled file, polling, batch API or warehouse load"], ["Processing", "Received → analytically usable", "ETL, joins, reconciliation and aggregation"], ["Feature", "Usable raw data → refreshed feature", "Separate feature-store cadence"], ["Model", "Ready features → current score", "Scoring cadence, not model compute time"], ["Workflow", "Score → executable decision", "Queue, case, review or orchestration backlog"], ["Action", "Decision → customer or system action", "Approval, downstream batch or operations capacity"],
    ]} />
    <p>A payment can arrive at noon, reach the raw table at 12:05 and remain absent from a behavioural feature until midnight. A model callable in milliseconds but scored nightly is not operationally real-time. A score created instantly and left in a queue for 12 hours creates little value. <strong>Real-time scoring without real-time workflow is cosmetic architecture.</strong></p>
  </section>

  <section id="freshness"><h2>A decision is no fresher than its stalest material input</h2>
    <Formula label="The stalest-link principle"><span className={styles.formula}>Freshness<sub>Decision</sub> = min(Freshness<sub>critical inputs</sub>)</span></Formula>
    <p>Real-time utilisation, yesterday’s balance, a weekly bureau record and monthly income do not form one coherent “current” customer. Each material input needs an effective time, and different variables can legitimately have different natural cadences.</p>
    <ResourceTable caption="Feature velocity is decision-specific" headers={["Category", "Illustrative features", "Design implication"]} rows={[["Higher velocity", "Payment, utilisation, current DPD", "Test whether delay changes an active decision"], ["Medium velocity", "Bureau indebtedness, recent behavioural score", "Align source cadence and materiality"], ["Lower velocity", "Product and structural characteristics", "Reliable periodic refresh may be sufficient"]]} />
    <div className={styles.dual}><article><b>BUSINESS TIME</b><p>When the underlying economic event became relevant.</p></article><article><b>SYSTEM TIME</b><p>When the information became technically available. Late arrival makes the two diverge.</p></article></div>
    <Formula label="Point-in-time integrity"><span className={styles.formula}>At T<sub>D</sub>, use InformationAvailable ≤ T<sub>D</sub>, while preserving every field’s effective time</span></Formula>
    <Formula label="Economically relevant data age"><span className={styles.formula}>DataAge = T<sub>decision</sub> − T<sub>effective</sub></span></Formula>
    <p>Each critical feature should expose <strong>LastUpdated</strong> and <strong>EffectiveAsOf</strong>. They are not interchangeable.</p>
  </section>

  <section id="sla"><h2>A successful batch can still produce a bad decision</h2>
    <p>All jobs can be green and all schedules met while <strong>DataAge &gt; DecisionTolerance</strong>. Infrastructure uptime cannot reveal that the state became economically stale.</p>
    <div className={styles.dual}><article><b>TECHNICAL SLA</b><p>Pipeline completed successfully by 06:00.</p></article><article><b>DECISION SLA</b><p>Critical customer state is no older than its approved latency budget when the action is made.</p></article></div>
    <Formula label="Decision-specific data freshness SLA"><span className={styles.formula}>Age(Data)<sub>D</sub> ≤ LatencyBudget<sub>D</sub></span></Formula>
    <p>This changes monitoring from “Did the job run?” to “Was the information fresh enough for the economic decision?”</p>
  </section>

  <section id="lead"><h2>Every hour of pipeline delay consumes predictive lead time</h2>
    <Formula label="Predictive lead time"><span className={styles.formula}>LeadTime<sub>model</sub> = T<sub>outcome</sub> − T<sub>signal</sub></span></Formula>
    <Formula label="Operational lead time"><span className={styles.formula}>LeadTime<sub>operational</sub> = T<sub>outcome</sub> − T<sub>action</sub> = LeadTime<sub>model</sub> − DecisionLatency</span></Formula>
    <p>A utilisation rise from 40% to 95% on Monday may be predictive of later deterioration. If the behavioural score refreshes Friday and the useful intervention window was two days, the model was not operationally early warning—even if offline discrimination is strong.</p>
    <KeyObservation><p><strong>Every hour of pipeline delay consumes part of the lead time created by the model.</strong></p></KeyObservation>
  </section>

  <section id="decisions"><h2>The same delay has different economics across decisions</h2>
    <ResourceTable caption="Fictional decision-latency examples" headers={["Decision", "Stale state", "Why the outcome changes"]} rows={[
      ["Collections", "Payment at 11:00; 06:00 queue sends contact at 14:00", "Unnecessary outreach, complaint, wasted capacity, wrong PTP or priority state"],
      ["Credit limit", "€10,000 facility moves from 30% to 90% utilisation; engine sees yesterday’s 30%", "Fresh and stale decisions imply materially different available exposure"],
      ["Affordability", "External debt rises after the latest bureau snapshot", "Current repayment capacity can differ; cadence still depends on source and materiality"],
      ["Risk-based pricing", "Funding cost is current but customer risk state is stale", "The price combines incompatible time states"],
      ["Monthly ECL", "Controlled reporting snapshot", "Milliseconds add little; completeness, point-in-time correctness and reproducibility dominate"],
    ]} />
    <Formula label="Illustrative exposure at default"><span className={styles.formula}>EAD = Drawn + CCF × Undrawn</span></Formula>
    <p>Fraud may demand extremely low latency; longer-horizon credit-risk decisions may tolerate much more. Fraud infrastructure should not be imposed on every risk process.</p>
  </section>

  <section id="matrix"><h2>The decision freshness matrix prevents real-time maximalism</h2>
    <ResourceFigure label="Decision freshness matrix plotting materiality against risk-state velocity." caption="Architecture intensity rises only where fast-changing state and consequential decisions coincide."><div className={styles.matrix}>
      <span className={styles.y}>DECISION MATERIALITY ↑</span><article><b>HIGH MATERIALITY / LOW VELOCITY</b><p>Reliable periodic architecture</p></article><article className={styles.hot}><b>HIGH MATERIALITY / HIGH VELOCITY</b><p>Low-latency architecture may be justified</p></article><article><b>LOW MATERIALITY / LOW VELOCITY</b><p>Batch usually sufficient</p></article><article><b>LOW MATERIALITY / HIGH VELOCITY</b><p>Selective monitoring</p></article><span className={styles.x}>RISK-STATE VELOCITY →</span>
    </div></ResourceFigure>
    <p><strong>RealTime ≠ Optimal.</strong> Streaming fields that change monthly while payment state remains overnight is expensive misallocation. Real-time can add complexity, support cost, noise and reconciliation difficulty without material decision value.</p>
  </section>

  <section id="value"><h2>Every decision has its own latency-value curve</h2>
    <Formula label="Decision value as delay increases"><span className={styles.formula}>Value<sub>D</sub>(t) declines as decision delay t consumes the useful action window</span></Formula>
    <ResourceFigure label="Conceptual fast- and slow-decaying decision value curves." caption="A payment-based stop-contact decision loses value rapidly; a structural portfolio review decays slowly."><div className={styles.curves}><div><i className={styles.fast}></i><b>FAST-DECAYING</b><small>Payment suppression</small></div><div><i className={styles.slow}></i><b>SLOW-DECAYING</b><small>Quarterly structural review</small></div></div></ResourceFigure>
    <p><strong>Decision half-life</strong> is an Entimema metaphor for the time over which a decision loses a material part of its actionable value—not a standard industry statistic. Collections payment suppression can have a very short half-life; behavioural warning short-to-medium; limit review medium; monthly monitoring longer.</p>
    <Formula label="Conceptual freshness return"><span className={styles.formula}>ROI<sub>freshness</sub> = (Loss Avoided + Operational Savings + Decision Value) / Infrastructure Cost</span></Formula>
    <p>Compare incremental decision value with event infrastructure, testing, support and observability cost. <strong>Do not modernise the fastest-moving system. Modernise the decision path where delay is most expensive.</strong></p>
  </section>

  <section id="architecture"><h2>Batch, micro-batch and events can coexist deliberately</h2>
    <div className={styles.tiers}>{[["TIER 1","Immediate events","Selected high-value triggers"],["TIER 2","Near-real-time state","Decision state and micro-batch"],["TIER 3","Periodic analytical state","Portfolio, modelling and monitoring"],["TIER 4","Historical / Finance reconciliation","Authoritative control and reporting"]].map(([n,t,d])=><article key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></article>)}</div>
    <p>A realistic migration moves from daily batch to more frequent micro-batch, selected event-triggered updates and finally a low-latency workflow where justified. A 15-minute micro-batch may capture most real-time value with less complexity for some cases.</p>
    <Formula label="Selective event trigger"><span className={styles.formula}>MaterialEvent → RecalculateAffectedCustomer / Facility / Features</span></Formula>
    <p>Payment, delinquency, utilisation and limit changes are candidates—not mandates. Incremental computation avoids continuously rescoring a full portfolio.</p>
  </section>

  <section id="control"><h2>Fast operational state and authoritative reconciliation are complements</h2>
    <div className={styles.dual}><article><b>FAST OPERATIONAL STATE</b><p>Uses sufficiently trusted events to suppress, alert, reprioritise or refer within the useful window.</p></article><article><b>PERIODIC AUTHORITATIVE STATE</b><p>Reconciles the full population for accounting, control, reporting and reproducibility.</p></article></div>
    <Formula label="Provisional and confirmed state"><span className={styles.formula}>State<sup>provisional</sup> → reconciliation → State<sup>confirmed</sup></span></Formula>
    <p>A low-risk reversible action may tolerate provisional information; a high-impact irreversible action may require confirmed state. Low latency never removes payment finality, accounting control or full reconciliation.</p>
    <ResourceTable caption="Urgency and reversibility guide provisionality" headers={["Decision urgency", "Reversibility", "Possible design posture"]} rows={[["High", "High", "Fresh provisional state with explicit controls may be useful"], ["High", "Low", "Fast confirmation, referral or conservative fallback"], ["Low", "High", "Periodic state is often sufficient"], ["Low", "Low", "Controlled confirmed state before execution"]]} />
    <p><strong>Fresh wrong data is often more dangerous than stale correct data because it creates false confidence.</strong> A stream with the wrong identity, timestamp or state creates no value. Freshness and semantic correctness must be governed jointly.</p>
  </section>

  <section id="case"><h2>A narrow payment-to-collections slice can recover value without replacing the platform</h2>
    <p>Consider a fictional lender whose payment processor updates continuously, warehouse and behavioural scores refresh nightly, its collections queue is generated at 05:30, and agents work that fixed queue all day. At 09:00, 2,000 queued customers pay.</p>
    <div className={styles.beforeAfter}><article><b>BEFORE · ~24H ILLUSTRATIVELY</b><p>Payment → Overnight DWH → Collections queue → Action</p></article><article><b>AFTER · TARGETED SLICE</b><p>Payment event → Payment-state layer → Suppression / reprioritisation</p></article></div>
    <ResourceTable caption="Original fictional daily case; illustrative, not a performance claim" headers={["Measure", "Before", "After targeted slice"]} rows={[["Paid customers still eligible for contact", "2,000", "80 held for confirmation or exception"], ["Unnecessary contacts attempted", "1,120", "24"], ["Agent / analyst minutes consumed", "7,840", "420"], ["Payment-related complaints", "38", "3"], ["False broken PTP classifications", "310", "18"]]} />
    <p>Finance posting, monthly ECL and the broader warehouse remain on controlled batch. The new slice measures false contacts, queue quality, cure recognition and manual reconciliation. It modernises the economic bottleneck, not the entire estate.</p>
    <EntimemaFramework title="Entimema Latency Architecture" steps={["Decision", "Required information", "Risk-state velocity", "Intervention window", "Latency budget", "Current event-to-decision latency", "Latency gap", "Targeted architecture change", "Measured business outcome"]} />
    <Formula label="Decision latency gap"><span className={styles.formula}>LatencyGap<sub>D</sub> = ActualLatency<sub>D</sub> − LatencyBudget<sub>D</sub></span></Formula>
    <Formula label="Conceptual latency materiality"><span className={styles.formula}>LatencyMateriality = f(Gap, Exposure, Volume, DecisionImpact)</span></Formula>
  </section>

  <section id="observability"><h2>Decision observability makes silent staleness visible</h2>
    <Formula label="Decision age"><span className={styles.formula}>DecisionAge = max(DataAge<sub>critical inputs</sub>)</span></Formula>
    <p>Monitor event age, queue lag, feature age, scoring lag, workflow lag and action lag—not availability alone. When a budget is breached, reason codes should distinguish upstream source delay, ingestion backlog, transformation delay, scoring delay and workflow backlog.</p>
    <ResourceTable caption="Graceful degradation when freshness is unavailable" headers={["Response", "When it may be considered", "Control question"]} rows={[["Use last state with caution", "Reversible, low-impact action", "Is age explicit to the decision?"], ["Refer", "Material uncertainty needs review", "Is capacity available inside the window?"], ["Delay", "Decision is non-urgent", "Does waiting preserve more value than acting?"], ["Alternative source", "Approved substitute exists", "Are semantics and effective time comparable?"]]} />
    <KeyObservation><p>The worst design is an engine that cannot tell information is stale. Old state then masquerades as current truth. Treat <strong>FeatureValue + FeatureAge</strong> as decision input, not value alone.</p></KeyObservation>
  </section>

  <section id="models"><h2>Latency can create infrastructure-induced model error</h2>
    <p>A model developed on end-of-day final state can underperform when production serves intraday provisional state. Column names may match while the economic definitions do not.</p>
    <Formula label="Infrastructure-induced training-serving skew"><span className={styles.formula}>FeatureDefinition<sub>dev</sub> ≠ FeatureDefinition<sub>prod</sub></span></Formula>
    <p>Backtesting should reconstruct feature values and what was actually available at decision time. Event replay can sequence historical events by availability timestamp; decision replay can rebuild Decision<sub>T</sub> from contemporaneous evidence rather than today’s corrected data. This supports model validation, <Link href="/resources/champion-challenger-credit-strategy-testing">champion/challenger testing</Link> and credible monitoring.</p>
  </section>

  <section id="institutions"><h2>Modern platforms can still make stale decisions</h2>
    <div className={styles.dual}><article><b>BANK PERSPECTIVE</b><p>Systems of record may be strong while analytical propagation across core → DWH → model → operations remains delayed.</p></article><article><b>NON-BANK PERSPECTIVE</b><p>API-native services can still depend on scheduled vendor exports, CRM syncs and spreadsheet reconciliation. Cloud-native does not guarantee temporal coherence.</p></article></div>
    <p>Bureau, payment, CRM and collections providers add external latency; different provider cadences can create a mixed-time state even in a modern SaaS stack. Architecture should be treated as a portfolio: event-driven for high-value fast decisions, micro-batch for moderate freshness, batch for periodic decisions and a historical warehouse for deep analytics and reporting.</p>
    <Formula label="Modernisation priority"><span className={styles.formula}>Priority = Latency Materiality × Manual Burden × Implementation Feasibility</span></Formula>
  </section>

  <section id="agent"><h2>A Decision Freshness &amp; Latency Agent can turn age into governed evidence</h2>
    <p>A future agent can trace approved decision-critical dependencies; calculate source, event and feature age; measure ingestion, processing, scoring and workflow lag; compare actual latency with approved budgets; identify stale-decision populations; separate infrastructure delay from economic drift; quantify operational and reconciliation impact; and prepare prioritised recommendations for human review.</p>
    <p>Its role is <strong>decision freshness observability + latency diagnostics + infrastructure prioritisation</strong>. It must not autonomously modify production pipelines or lending decisions.</p>
    <div className={styles.agent}>{["Decision Freshness Agent", "Payment State Agent", "Customer Identity Agent", "Financial State Agent", "Decision Engine Monitoring Agent", "Early Warning / Collections Agents"].map(x=><span key={x}>{x}</span>)}</div>
    <div className={styles.bridges}><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Behavioural scoring freshness, exposure monitoring, early warning and model-serving integrity.</Link></p></article><article><h3>Finance / CFO</h3><p><Link href="/services/cfo-function">Reconciliation timing, operational efficiency and evidence-led infrastructure ROI.</Link></p></article><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Event-driven decisions, workflow latency, micro-batch design and decision observability.</Link></p></article></div>
    <p>Continue with <Link href="/resources/hidden-infrastructure-debt-modern-lending">The Hidden Infrastructure Debt of Modern Lending</Link>, <Link href="/resources/payment-is-not-the-balance">The Payment Is Not the Balance</Link>, <Link href="/resources/single-customer-view-is-usually-a-fiction">The Single Customer View Is Usually a Fiction</Link>, <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link>, <Link href="/resources/behavioural-credit-scoring-post-origination-risk">Behavioural Credit Scoring</Link>, <Link href="/resources/consumer-credit-early-warning-systems">Early Warning Systems</Link>, <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link> and <Link href="/resources/credit-limit-assignment-exposure-strategy">Credit Limit Assignment</Link>.</p>
    <KeyObservation title="Entimema principle"><p><strong>Do not chase real-time infrastructure. Chase the point where information delay starts changing the economic decision.</strong></p></KeyObservation>
  </section>
</div> }
