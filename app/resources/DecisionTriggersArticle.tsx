import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./decision-triggers.module.css";

export const decisionTriggersSections = [
  { id: "storm", label: "The trigger storm" }, { id: "taxonomy", label: "Trigger taxonomy" },
  { id: "dependencies", label: "Dependencies and materiality" }, { id: "stabilise", label: "Debounce and hysteresis" },
  { id: "identity", label: "Trigger identity" }, { id: "transition", label: "Decision and action" },
  { id: "episodes", label: "Cooldown and episodes" }, { id: "concurrency", label: "Stale-decision guard" },
  { id: "policy", label: "Trigger policy" }, { id: "bias", label: "Sampling and baseline" },
  { id: "lineage", label: "Trigger lineage" }, { id: "examples", label: "Lending examples" },
  { id: "testing", label: "Golden trigger stream" }, { id: "observability", label: "Observability" },
  { id: "architecture", label: "Trigger architecture" }, { id: "agent", label: "Trigger Integrity Agent" },
] as const;

const code = (value: string) => <pre className={styles.code}><code>{value}</code></pre>;

export default function DecisionTriggersArticle() { return <div className={styles.articleBody}>
  <section id="storm">
    <p className={styles.lead}>Within 90 seconds, one revolving draw creates an authorisation, posted drawdown, utilisation update, feature-store update, behavioural score refresh and customer-state projection. A naïve platform treats each technical event as a new reason to run the same limit or EWS decision.</p>
    <div className={styles.storm}><strong>1 ECONOMIC CHANGE</strong><i>→</i><div>{["AUTHORISATION","POSTING","UTILISATION","FEATURE UPDATE","SCORE UPDATE"].map(x=><span key={x}>{x}</span>)}</div><i>→</i><strong>5 DECISION RUNS<br/>5 POSSIBLE ACTIONS</strong></div>
    <Formula label="Foundational boundary"><span>DataChange ≠ DecisionRelevantChange</span></Formula>
    <KeyObservation title="The central thesis"><p><strong>Re-run only when a change is economically material, decision-relevant and not already represented by a recent equivalent trigger.</strong></p></KeyObservation>
  </section>

  <section id="taxonomy"><h2>Triggers originate from events, state, features, time or combinations</h2>
    <ResourceTable caption="Reusable decision-trigger taxonomy" headers={["Type","Example","Why it triggers"]} rows={[
      ["Event","PAYMENT_REVERSED","Explicit causal event can change collections eligibility"],
      ["State","Utilisation moves NORMAL → WATCH","Transition, not raw update, is material"],
      ["Feature","PaymentRatio_30d crosses governed zone","Derived model input changed materially"],
      ["Time","Review date matures or watch remains unresolved","State changes because time passed"],
      ["Composite","High utilisation AND payment deterioration","Versioned combination becomes eligible"],
    ]} />
    <Formula label="Trigger eligibility"><span>Trigger<sub>D</sub>(E,S) = I(Relevant<sub>D</sub>) × I(Material<sub>D</sub>) × I(NotDuplicate) × I(PolicyAllows)</span></Formula>
    <p>Event-driven does not mean event-only. Timers remain necessary for time-since-payment, scheduled reviews and unresolved watch states.</p>
  </section>

  <section id="dependencies"><h2>Dependency intersection eliminates unrelated rescoring</h2>
    {code(`type DecisionDependency = {
  decisionType: string;
  inputKeys: string[];
};

// Trigger only when intersection is non-empty:
// ChangedInputs ∩ DecisionDependencies`)}
    <p>Collections priority may depend on DPD, payment state, promise state and exposure. A CRM address update is a data change but not a dependency, so it produces no rescore.</p>
    <ResourceTable caption="Decision-specific materiality" headers={["Method","Concept","Use"]} rows={[
      ["Absolute","|Xₜ − Xₜ₋₁| &gt; εᴅ","Meaningful unit change"], ["Relative","|ΔX| / |Xₜ₋₁|","Scale-aware change"],
      ["Zone crossing","NORMAL → WATCH","Policy boundary transition"], ["Composite","A ∧ B or A ∨ B","Several signals under versioned logic"],
    ]} />
    <p>No universal threshold applies. Prefer triggering on a state transition to repeatedly triggering on a raw value while it remains in the same zone.</p>
  </section>

  <section id="stabilise"><h2>Debounce, coalescing, hysteresis and cooldown act at different stages</h2>
    <ResourceFigure label="Technical events compress into one stable decision opportunity." caption="Debounce waits for a short settling interval; coalescing joins related causes; hysteresis stabilises state; cooldown protects post-action episodes."><div className={styles.stabilise}>{["RAW RELATED EVENTS","DEBOUNCE","COALESCE","MATERIAL STATE TRANSITION","DECISION","ACTION COOLDOWN"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div></ResourceFigure>
    <p>A trigger window groups related drawdown, utilisation and feature updates into one <code>EXPOSURE_STATE_CHANGED</code> context. Debounce consumes latency, so:</p>
    <Formula label="Noise/latency trade-off"><span>DebounceDelay &lt; RemainingInterventionWindow</span></Formula>
    <p>Hysteresis triggers above a high boundary and clears below a lower boundary, preventing oscillation. Cooldown occurs after action and may be overridden only by a materially distinct deterioration defined in policy.</p>
  </section>

  <section id="identity"><h2>One economic change needs one stable trigger identity</h2>
    {code(`type DecisionTrigger = {
  triggerId: string;
  decisionType: string;
  entityId: string;
  causeEventIds: string[];
  createdAt: Date;
};`)}
    <p>Causal grouping maps several technical events to one trigger. Duplicate delivery of the same trigger produces one decision execution—or an explicitly safe equivalent—through idempotent consumption.</p>
    <div className={styles.lineage}><div><span>E1</span><span>E2</span><span>E3</span></div><b>→</b><strong>TRIGGER T-42</strong><b>→</b><span>DECISION RUN D-17</span></div>
    <p>Link <code>decisionRunId</code> to <code>triggerId</code>. This makes deduplication auditable rather than an invisible cache behaviour.</p>
  </section>

  <section id="transition"><h2>A decision run is not an action instruction</h2>
    <Formula label="Decision delta"><span>ΔD = D<sub>new</sub> − D<sub>previous</sub></span></Formula>
    <ResourceTable caption="Decision-state comparison" headers={["Previous","New","Operational meaning"]} rows={[
      ["WATCH","WATCH","Record no-change run; normally no repeated action"], ["WATCH","ALERT","Meaningful transition can create action"],
      ["ALERT","ALERT","Update evidence/case context, not duplicate case"], ["ALERT","NORMAL","Clear/cure transition under policy"],
    ]} />
    <KeyObservation title="Anti-duplication principle"><p><strong>DecisionTrigger and ActionTrigger are separate objects.</strong> A decision can be recomputed without sending another message, suppressing collections twice or creating a duplicate review case.</p></KeyObservation>
    <Formula label="Illustrative action identity"><span>ActionKey = (Entity, DecisionState, Episode)</span></Formula>
  </section>

  <section id="episodes"><h2>Risk episodes retain context without multiplying cases</h2>
    <div className={styles.episode}>{["NORMAL","WATCH","ALERT","ALERT","ALERT","CURE / CLOSE"].map((x,i)=><span key={`${x}-${i}`}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    <p>The first WATCH → ALERT transition may create one review task. Later ALERT → ALERT changes append evidence. A new case may be justified only after closure, cure, cooldown expiry or materially distinct deterioration under versioned episode rules.</p>
    <p>For a payment settlement, collections may move CONTACT → HOLD and suppress planned contact once. A later causal reversal can create the distinct HOLD → CONTACT_ELIGIBLE transition.</p>
  </section>

  <section id="concurrency"><h2>Reject or re-evaluate decisions that become stale while executing</h2>
    <ResourceFigure label="Optimistic decision concurrency." caption="A decision computed on state v42 cannot automatically act after a material v43 arrives. The executor validates state/version freshness before side effects."><div className={styles.version}><span>DECISION STARTS<br/><b>STATE v42</b></span><i>→</i><span>STATE v43 ARRIVES</span><i>→</i><strong>STALE-DECISION GUARD<br/>REJECT / RE-EVALUATE</strong></div></ResourceFigure>
    <p>If a run is already in flight, queue, merge or cancel/restart a new trigger according to latency and engine design. Before action, compare input state version, current version and decision age. A materially stale result cannot execute merely because it finished successfully.</p>
  </section>

  <section id="policy"><h2>Trigger policy is a versioned part of model operationalisation</h2>
    {code(`type TriggerPolicy = {
  decisionType: string;
  version: string;
  dependencies: string[];
  debounceMs?: number;
  cooldownMs?: number;
};`)}
    <p>Changing rescore frequency can alter realised decisions even when the model is unchanged. Store <code>triggerPolicyVersion</code> with replay evidence.</p>
    <p>Before running, guard data freshness, source health, feature completeness and duplicate/in-flight state. Expensive features, external calls and human review strengthen the case for selective triggers. Conceptually, re-evaluate only when <strong>Value(redecision) &gt; Cost(redecision)</strong>.</p>
  </section>

  <section id="bias"><h2>Event-driven rescoring changes which customers are observed</h2>
    <p>High-activity or deteriorating borrowers generate more events and therefore more scores. Monitoring only rescored cases overrepresents them and creates operational selection effects.</p>
    <div className={styles.baseline}><article><b>EVENT-DRIVEN SCORES</b><p>Timely intervention population; activity-selected.</p></article><article><b>SCHEDULED BASELINE</b><p>Daily/weekly population snapshot for unbiased comparison.</p></article></div>
    <p>Periodic full reevaluation also audits trigger recall. If baseline scoring finds a material change without a prior trigger, the dependency or trigger policy is incomplete.</p>
    <Formula label="Missed-trigger control"><span>MissedTriggerRate = MaterialBaselineChangesWithoutTrigger / MaterialBaselineChanges</span></Formula>
  </section>

  <section id="lineage"><h2>Replay requires the trigger context—not only the final score</h2>
    {code(`type TriggerManifest = {
  triggerId: string;
  decisionType: string;
  causeEvents: string[];
  stateVersion: string;
  triggerPolicyVersion: string;
  createdAt: Date;
};`)}
    <div className={styles.trace}>{["EVENT(S)","TRIGGER","DECISION RUN","DECISION TRANSITION","ACTION","OUTCOME"].map((x,i)=><span key={x}>{x}{i<5?<b>→</b>:null}</span>)}</div>
    <p>Decision manifests store the trigger ID alongside model, feature and policy versions. Outcome events such as review completion, payment received or limit changed close the monitoring loop.</p>
  </section>

  <section id="examples"><h2>The same orchestration pattern supports collections, limits and EWS</h2>
    <ResourceTable caption="Illustrative trigger-to-action paths" headers={["Domain","Material trigger","Decision transition","Action behaviour"]} rows={[
      ["Collections","Payment state changed","CONTACT → HOLD","Suppress planned contact once"],
      ["Collections reversal","PAYMENT_REVERSED","HOLD → CONTACT_ELIGIBLE","New causal transition, not duplicate"],
      ["Limit","Utilisation 45% → 80%","NORMAL → REVIEW","Create one review episode"],
      ["EWS","Several features deteriorate in trigger window","NORMAL → WATCH/ALERT","One coalesced rescore and controlled workflow"],
    ]} />
  </section>

  <section id="testing"><h2>A golden trigger stream proves one economic change creates at most one intended action</h2>
    <ResourceTable caption="Deterministic trigger sequence" headers={["Step","Input","Expected result"]} rows={[
      ["1–3","Two utilisation events plus feature update","One coalesced trigger"], ["4","Decision computes","Transition to WATCH"],
      ["5–6","Equivalent repeated event","No new action"], ["7–9","Payment deterioration","Transition ALERT; one action created"],
      ["10–11","Duplicate trigger delivery","No duplicate decision/action effect"], ["12–13","Cure state","Clear transition and close episode"],
    ]} />
    <ResourceTable caption="Trigger integrity tests" headers={["Test","Expected proof"]} rows={[
      ["Materiality","Small change produces no trigger"], ["Zone transition","Material crossing creates a run"],
      ["Hysteresis","Boundary oscillation creates no action churn"], ["Cooldown","Equivalent episode trigger creates no duplicate action"],
      ["Stale decision","v42 result is rejected after material v43"], ["Source health","Stale critical source takes governed guard path"],
      ["Replay","Historical trigger stream reproduces decision/action sequence"], ["Shadow policy","Old/new trigger counts and impacts are explainable"],
    ]} />
  </section>

  <section id="observability"><h2>High trigger volume is not success</h2>
    <div className={styles.metrics}>{["RawEventRate","EligibleTriggerRate","DecisionRunRate","NoChangeRate","ActionRate","DuplicateTriggerRate","MissedTriggerRate","StaleDecisionDiscardRate"].map(x=><span key={x}>{x}</span>)}</div>
    <Formula label="Trigger amplification"><span>DecisionRuns / MaterialEconomicChanges</span></Formula>
    <Formula label="Action amplification"><span>Actions / DecisionStateTransitions</span></Formula>
    <p>Also track raw-event compression, trigger/decision/action lag and entity concentration. A well-designed system can reduce total runs while improving intervention timing. Shadow new policy, compare counts and decision/action deltas, then canary with rollback that preserves event history.</p>
  </section>

  <section id="architecture"><h2>The Entimema architecture filters changes before decisions and actions</h2>
    <ResourceFigure label="Entimema event-driven lending decision-trigger architecture." caption="Dependencies and materiality reject irrelevant changes; coalescing produces stable triggers; decision-state comparison and episode identity prevent duplicate actions."><div className={styles.architecture}>{["EVENTS / STATE CHANGES","DEPENDENCY RESOLVER","MATERIALITY FILTER","DEBOUNCE / COALESCING","TRIGGER ENGINE","DECISION ENGINE","DECISION-STATE COMPARISON","ACTION DEDUPLICATION","ACTION EXECUTOR","COOLDOWN / EPISODE STATE","OUTCOME / MONITORING"].map((x,i)=><span key={x}>{x}{i<10?<b>↓</b>:null}</span>)}</div></ResourceFigure>
    <EntimemaFramework title="Detect → Filter → Re-Evaluate → Act → Stabilise" steps={["Define decision dependencies", "Detect relevant change", "Test materiality", "Coalesce related events", "Create stable trigger", "Run decision", "Compare decision state", "Deduplicate action", "Apply cooldown and episode logic", "Monitor trigger value"]} />
  </section>

  <section id="agent"><h2>A Decision Trigger Integrity Agent can diagnose orchestration without changing policy</h2>
    <p>A controlled agent can monitor event-to-trigger mapping, detect storms and duplicates, measure no-change rescoring, compare baseline scoring for missed triggers, flag stale decisions and repeated episode actions, compare policy versions and trace event → trigger → decision → action lineage.</p>
    <KeyObservation title="Bounded role"><p><strong>Trigger-quality observability + decision deduplication + stale-decision detection + workflow-efficiency support.</strong> It prepares tuning evidence; it must not autonomously change credit thresholds or execute adverse customer actions.</p></KeyObservation>
    <div className={styles.bridges}><article><h3>Decision Automation</h3><p><Link href="/services/decision-automation">Build versioned, idempotent trigger-to-action orchestration.</Link></p></article><article><h3>Credit Risk</h3><p><Link href="/services/credit-risk">Govern materiality, rescore policies and trigger effectiveness.</Link></p></article><article><h3>Financial Data</h3><p><Link href="/services/financial-data">Preserve causal events, state versions and lineage.</Link></p></article></div>
    <p>Continue with <Link href="/resources/real-time-utilisation-exposure-monitoring">Real-Time Utilisation and Exposure Monitoring</Link>, <Link href="/resources/streaming-behavioural-features-early-warning">Streaming Behavioural Features for Early Warning</Link>, <Link href="/resources/batch-etl-event-driven-credit-risk-architecture">From Batch ETL to Event-Driven Credit Risk Architecture</Link>, <Link href="/resources/credit-risk-feature-store-respects-time">Building a Credit Risk Feature Store</Link>, <Link href="/resources/point-in-time-customer-state-reconstruction">Point-in-Time Customer State Reconstruction</Link>, <Link href="/resources/decision-engine-monitoring-strategy-drift">Decision Engine Monitoring</Link> and <Link href="/resources/collections-prioritisation-intervention-value">Collections Prioritisation</Link>. Backpressure recovery, real-time collections state and production EWS monitoring remain future research directions—not fabricated routes.</p>
    <KeyObservation title="Engineering resolve"><p><strong>Prove that an economic change justified a new decision—and that its action was neither duplicated nor stale when executed.</strong></p></KeyObservation>
  </section>
</div>; }
