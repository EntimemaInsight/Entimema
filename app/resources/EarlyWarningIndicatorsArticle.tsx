import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./early-warning-indicators.module.css";

export const earlyWarningIndicatorsSections = [
  { id: "meaning", label: "Indicator to decision" }, { id: "time", label: "Level, change and acceleration" },
  { id: "indicator-families", label: "Three warning layers" }, { id: "architecture", label: "Baselines and signal strength" },
  { id: "thresholds", label: "Threshold architecture" }, { id: "portfolio-example", label: "150,000-borrower example" },
  { id: "lead-time", label: "Lead time and error cost" }, { id: "capacity", label: "Alert fatigue and priority" },
  { id: "portfolio", label: "Roll rates and vintages" }, { id: "system", label: "System architecture" },
  { id: "monitoring", label: "Feedback and performance" }, { id: "failures", label: "Failure modes" },
  { id: "automation", label: "Credit Early Warning Agent" },
] as const;

const signalLayers = [
  ["SIGNAL", "What changed?"], ["SEVERITY", "How material is it?"], ["PERSISTENCE", "Does it continue?"],
  ["CONFIRMATION", "Is there independent support?"], ["PRIORITY", "Which case matters first?"], ["ACTION", "What should happen next?"],
];

export default function EarlyWarningIndicatorsArticle() {
  return <>
    <p className={styles.lead}>Default is a late event. By the time severe delinquency makes deterioration obvious, much of the useful intervention window may already have disappeared. But reacting to every fluctuation creates false positives, customer friction, operating cost and analyst fatigue. The design problem is not simply to detect change. It is to distinguish <strong>signal from noise early enough to act</strong>.</p>
    <KeyObservation>The purpose of an early-warning system is not to predict every default. It is to detect meaningful deterioration early enough for a different decision to still matter.</KeyObservation>
    <p>The transformation is operational as well as analytical: <strong>borrower or portfolio behaviour → indicator → change detection → severity → persistence → confirmation → alert → prioritisation → investigation → intervention → outcome</strong>. Each link prevents a measurement from being mistaken for a decision.</p>

    <ResourceFigure label="Early-warning timeline from normal behaviour to default, with an intervention window after confirmed warning." caption="The useful intervention window begins when evidence is strong enough to justify action and closes as default becomes unavoidable or already observed.">
      <div className={styles.timeline}>
        {[["NORMAL","Baseline"],["WEAK SIGNAL","Change"],["PERSISTENT CHANGE","Evidence"],["CONFIRMED WARNING","Decision point"],["DELINQUENCY","Late state"],["DEFAULT","Terminal event"]].map(([stage,note], index)=><div key={stage} className={index === 3 ? styles.confirmed : ""}><span>{String(index + 1).padStart(2,"0")}</span><b>{stage}</b><small>{note}</small></div>)}
        <p><span>INTERVENTION WINDOW</span><i>Confirmed warning</i><b>→</b><i>Default</i></p>
      </div>
    </ResourceFigure>

    <section id="meaning">
      <h2>A measurement becomes valuable only through interpretation</h2>
      <p>An <strong>early-warning indicator (EWI)</strong> is a measurable condition or change associated with an increased probability of future credit deterioration. Association is not destiny, and an indicator is not itself an instruction.</p>
      <div className={styles.conceptGrid}>
        <article><span>01</span><h3>Indicator</h3><p>A measurable variable, such as payment ratio or Current → 1–30 migration.</p></article>
        <article><span>02</span><h3>Signal</h3><p>An observed change carrying potential information relative to a baseline.</p></article>
        <article><span>03</span><h3>Trigger</h3><p>A predefined condition that opens investigation or escalation.</p></article>
        <article><span>04</span><h3>Alert</h3><p>The operational output routed to a named decision owner.</p></article>
      </div>
      <p>A <strong>decision</strong> is the accountable action—or explicit non-action—after evidence, economics and customer context are interpreted. A portfolio with hundreds of indicators but no trigger logic, owner or decision pathway does not have a functioning early-warning system.</p>
      <p>Collapsing these concepts produces brittle systems. A high-risk state may deserve monitoring without representing new deterioration. A signal may be statistically unusual but economically immaterial. A warning may be valid while no proportionate action exists.</p>
      <DecisionImplication>The strongest warning signal is often not the level of a variable, but a change in its trajectory, velocity or persistence.</DecisionImplication>
    </section>

    <section id="time">
      <h2>State and change answer different questions</h2>
      <Formula label="Borrower state and change over a lookback of k periods"><span>X<sub>i,t</sub> &nbsp;&nbsp; | &nbsp;&nbsp; ΔX<sub>i,t</sub> = X<sub>i,t</sub> − X<sub>i,t−k</sub></span></Formula>
      <Formula label="Acceleration in the risk indicator"><span>Δ²X<sub>i,t</sub> = ΔX<sub>i,t</sub> − ΔX<sub>i,t−1</sub></span></Formula>
      <p><strong>X<sub>i,t</sub></strong> describes borrower i&apos;s current state at time t. <strong>ΔX<sub>i,t</sub></strong> describes its direction over a defined interval k. They are complementary, not interchangeable.</p>
      <div className={styles.dimensionGrid}>
        <article><b>LEVEL</b><p>Where is risk now? High utilisation, leverage, weak liquidity or delinquency matter because they describe current vulnerability. A high but long-stable level, however, may not be an early signal.</p></article>
        <article><b>DIRECTION</b><p>Which way is it moving? Conceptually, Direction(X) = sign(ΔX). Debt burden of <strong>35% → 42% → 51%</strong> contains different information from <strong>51% → 51% → 51%</strong>.</p></article>
        <article><b>VELOCITY</b><p>How fast? A simple rate is (X<sub>i,t</sub> − X<sub>i,t−k</sub>)/k. Rapid movement can justify attention sooner, although linear velocity is not appropriate for every variable or cadence.</p></article>
        <article><b>PERSISTENCE</b><p>Does it repeat? A simplified count is ∑<sub>t=1</sub><sup>T</sup> I(Signal<sub>i,t</sub> = 1). Consecutive exceptions can carry more information than one shock, provided correlated alerts are not double-counted.</p></article>
      </div>
      <p>Lookback length, observation cadence, seasonality and normal borrower volatility determine whether change is meaningful. A monthly payment cycle cannot be interpreted using an arbitrary weekly comparison; a seasonal business should not be judged against an unadjusted prior month.</p>
    </section>

    <section id="architecture">
      <h2>Baselines turn observations into interpretable deviations</h2>
      <Formula label="Observed deviation from a governed comparator"><span>Deviation<sub>i,t</sub> = X<sub>i,t</sub> − Baseline(X<sub>i</sub>)</span></Formula>
      <ResourceTable caption="Baselines answer different diagnostic questions" headers={["Baseline","Comparison","Use"]} rows={[
        ["Borrower","The borrower's own history","Detects departure from established behaviour"],
        ["Segment","Economically similar borrowers","Controls for product and risk-profile differences"],
        ["Portfolio","The broader managed book","Locates local versus broad movement"],
        ["Vintage","Equivalent months on book","Separates seasoning from origination quality"],
        ["Seasonal","Comparable calendar periods","Prevents recurring payment patterns becoming alerts"],
      ]}/>
      <h3>Signal strength is multidimensional</h3>
      <Formula label="Entimema signal-strength architecture"><span>SignalStrength = f(Magnitude, Persistence, Acceleration, Breadth, Materiality)</span></Formula>
      <p><strong>Magnitude</strong> measures distance from expectation; <strong>persistence</strong> asks whether it survives time; <strong>acceleration</strong> asks whether deterioration is becoming faster; <strong>breadth</strong> asks whether independent indicators or populations corroborate it; and <strong>materiality</strong> connects the evidence to meaningful borrowers, exposure and potential loss. No single dimension can substitute for the others.</p>
      <EntimemaFramework title="Signal → Severity → Persistence → Confirmation → Action" description="Five analytical gates keep observations separate from governed responses." steps={["Signal — what changed?", "Severity — how material is the change?", "Persistence — does it continue?", "Confirmation — is other evidence supportive?", "Action — what should happen next?"]}/>
      <ResourceFigure label="Vertical early-warning architecture moving from signal through severity, persistence, confirmation and priority to action." caption="Priority is the operational bridge: confirmed evidence must still be ranked against exposure, confidence and capacity.">
        <div className={styles.signalStack}>{signalLayers.map(([name,question], index)=><div key={name}><span>{index + 1}</span><p><b>{name}</b><small>{question}</small></p>{index < signalLayers.length - 1 ? <i>↓</i> : null}</div>)}</div>
      </ResourceFigure>
      <p><strong>Signal</strong> establishes new information; <strong>severity</strong> prevents trivial changes from dominating; <strong>persistence</strong> tests whether the observation survives time; <strong>confirmation</strong> seeks genuinely distinct evidence; and <strong>action</strong> forces a decision purpose. Priority is shown in the operating visual because scarce attention must be allocated even after analytical confirmation.</p>
    </section>

    <section id="indicator-families">
      <h2>Three analytical layers should remain distinguishable</h2>
      <div className={styles.threeLayers}>
        <article><span>LAYER I</span><h3>Borrower behaviour</h3><p>Payment delays, failed attempts, utilisation, payment ratios, minimum payments and repeat short delinquency.</p></article>
        <article><span>LAYER II</span><h3>Portfolio dynamics</h3><p>Roll-forward, cure, persistence, vintage curves, risk-grade migration and concentrated segment deterioration.</p></article>
        <article><span>LAYER III</span><h3>External context</h3><p>Macroeconomic, rate, sector, regional and affordability stress where the data and use case justify them.</p></article>
      </div>
      <p>These layers operate at different frequencies and levels of specificity. Pooling them into one arbitrary score can disguise mechanism, double-count common drivers and make an alert impossible to explain. Use contextual evidence to change priors and diagnostic focus, not to impersonate borrower-specific facts.</p>
      <h3>Indicators are mechanisms, not a catalogue</h3>
      <h3>Behavioural evidence can reveal cash constraint before formal default</h3>
      <p>Payment deterioration, repeated minimum payments, declining payment-to-balance ratios and failed payment attempts can indicate reduced repayment capacity or prioritisation of other obligations. Rising utilisation and repeated limit pressure can indicate shrinking liquidity headroom. Transaction decline may add context where the institution has a legitimate, stable view of relevant flows. Rising delinquency is stronger evidence, but progressively later.</p>
      <p>The mechanism matters. A one-off failed direct debit followed by immediate cure is unlike repeated failures combined with lower payments and rising balances. Product design also matters: minimum payment behaviour in revolving credit has no direct equivalent in an amortising loan.</p>
      <h3>Financial evidence needs a connected economic story</h3>
      <p>For businesses and financially assessed borrowers, declining revenue, margin compression, leverage increase, weak liquidity, falling interest coverage, working-capital stress and cash-flow deterioration can form a sequence: weaker trading compresses cash generation, working capital absorbs liquidity, debt rises and coverage falls. <strong>Level + change + persistence</strong> is generally more informative than an isolated ratio value.</p>
      <h3>External context changes priors, not borrower identity</h3>
      <p>Macroeconomic deterioration, unemployment, interest-rate stress, sector weakness, regional stress and relevant market indicators can increase the plausibility of borrower deterioration or identify exposed segments. They often have weak borrower-level specificity. A rate shock does not identify which borrower will default; it tells the system where sensitivity may be concentrated and what corroborating borrower evidence to seek.</p>
    </section>

    <section id="thresholds">
      <h2>Thresholds must distinguish state, trajectory and evidence</h2>
      <Formula label="Static level threshold"><span>X<sub>i,t</sub> &gt; c &nbsp;⇒&nbsp; Signal</span></Formula>
      <p>A static rule is simple, transparent and easy to implement. It also ignores the borrower&apos;s baseline, direction and normal volatility; creates cliff effects around c; and can flood operations with stable high-level cases.</p>
      <Formula label="Change-based threshold"><span>ΔX<sub>i,t</sub> &gt; c<sub>Δ</sub> &nbsp;⇒&nbsp; Signal</span></Formula>
      <p>Suppose revolving utilisation rises from 38% to 61% in two statements. It remains below an illustrative 80% level threshold but its 23-point increase may be unusual for that borrower and segment. A change rule can surface the case earlier; it still needs materiality, volatility and persistence controls.</p>
      <Formula label="Illustrative combined level and change logic"><span>Signal<sub>i</sub> = I(X<sub>i,t</sub> &gt; c<sub>1</sub> ∧ ΔX<sub>i,t</sub> &gt; c<sub>2</sub>)</span></Formula>
      <p>Combined logic can suppress stable high-level cases and small changes from benign levels. AND, OR, baseline-relative and segment-specific combinations answer different questions; none is universally best.</p>
      <Formula label="Evidence across k indicators"><span>Evidence<sub>i</sub> = f(Signal<sub>1i</sub>, Signal<sub>2i</sub>, …, Signal<sub>ki</sub>)</span></Formula>
      <p>An utilisation increase, payment deterioration and sector shock may provide stronger evidence together than alone—if they contain distinct information. Rising utilisation, lower available credit and higher balance-to-limit ratio are mostly three expressions of one balance/limit relationship. Counting alerts is not equivalent to accumulating independent evidence. Indicator lineage, correlation analysis and causal interpretation should identify clusters before aggregation.</p>
      <ResourceTable caption="Threshold forms encode different assumptions" headers={["Threshold","Form","Strength and limitation"]} rows={[
        ["Absolute","Xₜ > c","Transparent; ignores baseline and local volatility"],
        ["Relative","Xₜ > Baseline + δ","Detects change; depends on baseline quality"],
        ["Standardised","Zₜ = (Xₜ − μ) / σ","Scales unusualness; unstable σ can mislead"],
        ["Percentile","Xₜ above historical percentile","Robust to units; history may represent another regime"],
        ["Segment-specific","c = c(segment)","Improves comparability; sparse segments become unstable"],
        ["Dynamic","cₜ changes with context","Adapts to regime; harder to govern and explain"],
      ]}/>
      <Formula label="Persistence over the last k observations"><span>Persistence<sub>i</sub>(k) = ∑<sub>h=0</sub><sup>k−1</sup> I(Signal<sub>i,t−h</sub> &gt; Threshold)</span></Formula>
      <p>Requiring persistence can reduce false alerts, but it also spends lead time. The correct requirement depends on the indicator&apos;s volatility, observation cadence, contemplated intervention and cost of waiting. Thresholds therefore encode economics and operational capacity, not statistics alone.</p>
    </section>

    <section id="portfolio-example">
      <h2>A stable headline can conceal concentrated upstream deterioration</h2>
      <p>Consider an original fictional portfolio of <strong>150,000 active consumer-lending borrowers</strong>. Over four months, the reported default rate remains broadly stable because recoveries and write-offs still offset new entries. A static executive dashboard could conclude that portfolio quality is unchanged. The upstream evidence says otherwise.</p>
      <ResourceTable caption="Original four-month early-warning example" headers={["Indicator","Month 1","Month 2","Month 3","Month 4","Warning interpretation"]} rows={[
        ["Headline default rate","3.20%","3.18%","3.22%","3.24%","Broadly stable and late"],
        ["Current → 1–30","3.8%","4.1%","4.8%","5.5%","Magnitude, persistence and acceleration"],
        ["1–30 → Current cure","34%","32%","28%","24%","Recovery capacity is weakening"],
        ["Median revolving utilisation","47%","48%","51%","55%","Liquidity headroom is compressing"],
        ["Repeat short delinquency","6.2%","6.5%","7.4%","8.6%","Breadth across borrower histories"],
        ["Recent vintages V7–V8: 30+ at MOB 6","4.9%","5.4%","6.3%","7.1%","Deterioration is concentrated"],
      ]}/>
      <div className={styles.portfolioVerdict}><article><span>STATIC DASHBOARD</span><b>Portfolio remains stable</b><p>Default stock moved by only four basis points.</p></article><article><span>EARLY-WARNING ARCHITECTURE</span><b>Upstream deterioration is emerging</b><p>Independent migration, cure, utilisation and repeat-delinquency evidence is persistent and concentrated in V7–V8.</p></article></div>
      <p>The conclusion is an investigation hypothesis, not a causal verdict. First, reproduce transitions for V7–V8 at comparable months on book. Then split by product, channel, score band and policy version; reconcile growth and exposure; inspect treatment and payment-failure data; test seasonality; and determine whether the pattern survives account- and EAD-weighted views.</p>
      <DecisionImplication>Default stability does not invalidate the warning. It defines the available lead time before upstream movement reaches the terminal stock.</DecisionImplication>
    </section>

    <section id="borrower">
      <h2>When did this borrower become actionable?</h2>
      <p>The following six-month path is hypothetical. Payment ratio is payment divided by statement balance; the liquidity signal reflects observed cash-flow pressure on a governed internal scale.</p>
      <ResourceTable caption="Illustrative borrower deterioration across six monthly observations" headers={["Month","Utilisation","Payment ratio","DPD","Liquidity signal","Interpretation"]} rows={[
        ["1","42%","38%","0","Normal","Stable baseline"], ["2","44%","36%","0","Normal","Normal variation"],
        ["3","57%","27%","0","Weak","First directional signal"], ["4","68%","19%","0","Weak","Change persists; severity rises"],
        ["5","79%","11%","7","Strong","Independent payment and liquidity evidence confirms"], ["6","91%","4%","34","Strong","Serious delinquency is now visible"],
      ]}/>
      <div className={styles.monthStory}><p><b>MONTHS 1–2</b> Normal baseline.</p><p><b>MONTH 3</b> Weak signal, not yet a warning.</p><p><b>MONTH 4</b> Direction persists and velocity is material.</p><p><b>MONTH 5</b> Multiple mechanisms confirm deterioration.</p><p><b>MONTH 6</b> The late event becomes obvious.</p></div>
      <KeyObservation title="The actionable point">Month 5 is the defensible warning point in this illustration: deterioration has persisted and independent payment, liquidity and early-delinquency evidence confirms it. Month 3 may be too uncertain; Month 6 is more certain but sacrifices a month of intervention time.</KeyObservation>
    </section>

    <section id="lead-time">
      <h2>Accuracy and lead time pull in opposite directions</h2>
      <Formula label="Warning lead time"><span>LeadTime = T<sub>adverse outcome</sub> − T<sub>warning</sub></span></Formula>
      <p>A highly accurate warning one day before default may have little operational value. A noisier warning several months earlier creates more opportunity for engagement or risk mitigation. Earlier signals generally have greater uncertainty; later signals greater certainty but less action time. The optimum depends on the contemplated action, its cost, reversibility and time to take effect.</p>
      <ResourceFigure label="Conceptual warning-time spectrum contrasting action time and uncertainty with certainty and reduced action time." caption="Threshold selection should maximise decision value, not accuracy in isolation.">
        <div className={styles.tradeoff}><div><span>EARLIER</span><b>More action time</b><small>More uncertainty</small></div><p><i>←</i><span>WARNING TIME</span><i>→</i></p><div><span>LATER</span><b>Less action time</b><small>More certainty</small></div></div>
      </ResourceFigure>
      <h3>Error costs are asymmetric</h3>
      <p>A <strong>false positive</strong> consumes analyst time, can create customer friction and collections cost, displaces other cases and contributes to fatigue. A <strong>false negative</strong> loses an intervention opportunity, delays collections or limit action and may increase eventual loss. Maximum detection is not a sensible objective without the costs of both errors and the economics of the proposed action.</p>
      <ResourceTable caption="Early warning as a decision system" headers={["Decision","Deterioration occurs","No deterioration"]} rows={[["Alert","True positive","False positive"],["No alert","False negative","True negative"]]}/>
      <Formula label="Simplified asymmetric error cost"><span>Expected Cost = C<sub>FP</sub>P(FP) + C<sub>FN</sub>P(FN)</span></Formula>
      <p>The optimal threshold depends on intervention cost, exposure, severity, operational capacity, customer impact and the value of acting early. Predictive strength is not intervention value: a weaker signal with several weeks of usable lead time can be economically superior to excellent discrimination two days before default.</p>
    </section>

    <section id="capacity">
      <h2>Alert fatigue is a system failure, not an analyst weakness</h2>
      <Formula label="Operational overload condition"><span>Alerts ≫ AnalystCapacity</span></Formula>
      <p>When incoming alerts materially exceed review capacity, even technically valid signals become operationally useless. Queues age, severe cases are obscured, review quality falls and staff learn to distrust the system. Alert volume is therefore a design constraint. Early warning requires <strong>detection + prioritisation</strong>.</p>
      <Formula label="Conceptual alert-priority function"><span>Priority<sub>i</sub> = f(Severity<sub>i</sub>, Persistence<sub>i</sub>, Exposure<sub>i</sub>, SignalConfidence<sub>i</sub>, ExpectedDeterioration<sub>i</sub>)</span></Formula>
      <Formula label="Simplified economic impact principle"><span>ExpectedImpact ≈ RiskChange × Exposure</span></Formula>
      <Formula label="Conceptual alert-value ratio"><span>Alert Value ≈ Actionable Signals / Total Alerts</span></Formula>
      <p>These expressions organise judgement; they are not universal scoring formulae. A €1,000 exposure and a €5 million exposure can carry similar warning evidence but require different operational priority. Conversely, exposure should not erase customer-treatment standards or make a weak signal appear certain. Queue design should preserve both risk confidence and economic consequence.</p>
      <p>Suppress exact duplicates, group correlated indicators into families, define cooldown periods for unchanged cases, and escalate only when severity or evidence changes. Fifty correlated indicators are not fifty independent confirmations. Hierarchical signals, carefully governed composites or dimensionality reduction can reduce redundancy, but explainability and mechanism should survive the compression.</p>
    </section>

    <section id="case">
      <h2>Detection is not risk management</h2>
      <EntimemaFramework title="From Alert to Case" description="A warning becomes valuable only when it enters a governed decision process." steps={["Signal", "Alert", "Case", "Investigation", "Action", "Outcome"]}/>
      <p>An alert records why and when logic fired. A case joins signals to borrower history, exposure, ownership, service level and investigation evidence. The investigator can then choose a proportionate response: analyst review, customer contact, limit review, enhanced monitoring, collections intervention, collateral review, pricing review, or no action and continued monitoring.</p>
      <p>Responses depend on product, contractual rights, customer circumstances, policy and local requirements. They should not be universal. The essential control is explicit disposition: who reviewed the case, what evidence was considered, what happened, and when it should next be evaluated.</p>
      <DecisionImplication>A signal has little operational value unless it can be translated into a prioritised and explainable action. The value of an alert depends on whether a meaningful action exists.</DecisionImplication>
    </section>

    <section id="actionability">
      <h2>The Entimema EWI Actionability Test</h2>
      <div className={styles.testGrid}>{[
        ["Is it early?","Does it appear before the adverse outcome, with usable lead time?"], ["Is it informative?","Does it materially change the assessment of risk?"],
        ["Is it explainable?","Can an analyst understand the observations and logic that fired?"], ["Is it actionable?","Can the institution do something useful and proportionate?"],
        ["Is it monitorable?","Can volume, performance, operations and outcomes be evaluated?"],
      ].map(([h,p],i)=><article key={h}><span>0{i+1}</span><h3>{h}</h3><p>{p}</p></article>)}</div>
      <p>If an indicator fails most of these tests, its statistical association may still be interesting, but its operational value is questionable.</p>
    </section>

    <section id="boundaries">
      <h2>Early warning is not a PD model or default detector</h2>
      <div className={styles.boundaryGrid}>
        <article><span>PD MODEL</span><p>Estimates <strong>P(Default within horizon | X)</strong>. It primarily describes conditional risk over a defined horizon.</p></article>
        <article><span>EARLY WARNING</span><p>Asks whether the borrower&apos;s risk state has changed materially enough to justify attention or intervention.</p></article>
      </div>
      <p>A borrower can have relatively high but stable PD; another can have moderate PD that is rapidly worsening. Monitoring actions can differ even where current PD ordering does not. Model output may be one EWI input, but replacing change architecture with a PD cut-off loses trajectory.</p>
      <p>An alert that fires only when the borrower is already in default is default detection, not meaningful early warning. The intended sequence is <strong>risk change → warning → deterioration → default</strong>, with useful distance between warning and terminal event.</p>
      <p>The terminal event must inherit a governed <Link href="/resources/pd-default-definition-target-construction">default definition</Link>. Change the boundary and event timing, lead time, measured precision, and false-positive/false-negative classifications all change. EWI back-tests must version that definition.</p>
    </section>

    <section id="portfolio">
      <h2>Borrower warnings belong inside a portfolio lifecycle</h2>
      <h3>Migration reveals changing transition behaviour</h3>
      <p><Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis: How Credit Portfolios Deteriorate Before Default</Link> can expose rising roll-forward rates, falling cure rates, increasing delinquency persistence and acceleration into deeper states before aggregate defaults fully respond. Migration analysis diagnoses a change in state-transition behaviour; EWI architecture converts it into <strong>migration → baseline → deviation → persistent signal → alert → action</strong>.</p>
      <Formula label="A transition deviation used as a portfolio signal"><span>Signal<sub>ij,t</sub> = RR<sub>ij,t</sub> − Baseline(RR<sub>ij</sub>)</span></Formula>
      <p>Current → 1–30 usually offers more lead time than 61–90 → Default, but also more uncertainty. Cure deterioration and delinquency persistence can provide distinct evidence about resolution capacity. Warning horizon therefore belongs in every transition definition.</p>
      <h3>Vintage comparison controls for seasoning</h3>
      <Formula label="Illustrative same-seasoning vintage deterioration"><span>DR<sub>Vintage B</sub>(MOB<sub>6</sub>) &gt; DR<sub>Vintage A</sub>(MOB<sub>6</sub>)</span></Formula>
      <p><Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> compares cohorts at equivalent months on book. Worse delinquency or migration at MOB 6 can signal underwriting, acquisition, product or environmental deterioration without confusing it with different seasoning. It identifies a portfolio hypothesis to investigate, not a cause by itself.</p>
      <Formula label="Early-warning behaviour for vintage v at time t"><span>EWI<sub>v,t</sub> = f(Migration<sub>v,t</sub>, Cure<sub>v,t</sub>, Utilisation<sub>v,t</sub>, RepeatDelinquency<sub>v,t</sub>)</span></Formula>
      <p>Vintage × EWI analysis distinguishes broad portfolio stress from a weak origination cohort, policy change, acquisition channel, scorecard shift or pricing regime. Further segmentation by product, risk grade, score band, customer type, exposure, justified geography and collections treatment adds resolution—but every split spends sample size. The control trade-off remains <strong>diagnostic resolution ↔ statistical stability</strong>.</p>
      <h3>Monitoring the model and monitoring risk are different</h3>
      <p><Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> asks whether a model remains discriminating, calibrated, stable and operationally sound. Early warning asks whether borrower or portfolio risk is changing. Drift can affect both, but neither conclusion proves the other.</p>
      <h3>Origination begins the lifecycle; warning continues it</h3>
      <p>A <Link href="/resources/credit-decision-engine-architecture">Credit Decision Engine</Link> asks whether to accept risk and under what terms. Early warning later asks whether accepted risk has changed enough to require action: <strong>origination → decision → monitoring → warning → intervention</strong>.</p>
    </section>

    <section id="system">
      <h2>The Entimema Early Warning System Architecture</h2>
      <p>The system must preserve an evidence trail from raw observation to outcome. Each stage narrows or enriches the population; none should silently convert correlation into causation or an alert into an adverse credit decision.</p>
      <ResourceFigure label="Responsive twelve-stage early warning system architecture from data through outcome feedback." caption="The architecture separates measurement, comparison, prioritisation and accountable intervention so every alert remains traceable to evidence and outcome.">
        <div className={styles.systemArchitecture}>{[
          ["01","Data","Borrower, account, portfolio and context"], ["02","Indicators","Governed measurable variables"],
          ["03","Baselines","Borrower, segment, portfolio, vintage, season"], ["04","Deviations","Level, change and acceleration"],
          ["05","Persistence","Noise versus repeated departure"], ["06","Signal fusion","Independent evidence, redundancy controlled"],
          ["07","Materiality","Exposure, population and loss consequence"], ["08","Prioritisation","Rank within operational capacity"],
          ["09","Diagnosis","Locate mechanism and affected population"], ["10","Decision","Owned action or explicit non-action"],
          ["11","Intervention","Proportionate, permitted treatment"], ["12","Outcome feedback","Effect, cost, customer impact, recalibration"],
        ].map(([n,h,p])=><article key={n}><span>{n}</span><strong>{h}</strong><small>{p}</small></article>)}</div>
      </ResourceFigure>
      <EntimemaFramework title="Observe → Compare → Diagnose → Prioritise → Decide → Intervene → Learn" description="The operating logic that converts monitoring into a controlled portfolio-risk system." steps={["Observe", "Compare", "Diagnose", "Prioritise", "Decide", "Intervene", "Learn"]}/>
      <h3>Decision ownership is part of the model</h3>
      <p>Every warning needs an owner, interpretation logic, permitted actions, escalation route, review frequency and outcome record. Low-severity evidence may justify enhanced monitoring or a reminder; moderate evidence may justify diagnostic review, segmentation or targeted engagement; high-severity evidence may justify strategy escalation, exposure review or restructuring assessment. These are hypotheses, not universal rules: product, regulation, economics and customer context govern the response.</p>
      <KeyObservation>A signal without an owner is information. A signal connected to an accountable decision is risk management.</KeyObservation>
    </section>

    <section id="monitoring">
      <h2>Monitor the warning system as an analytical and operating system</h2>
      <ResourceTable caption="EWI performance and operating-control framework" headers={["Dimension","Core measures","Management question"]} rows={[
        ["Signal volume","Alerts, borrowers flagged, repeat alerts","Is logic stable and is workload feasible?"],
        ["Precision","Adverse outcomes after warning, apparent false positives","How concentrated is subsequent deterioration?"],
        ["Coverage","Defaults previously flagged, missed deteriorations","Which adverse cases did detection fail to reach?"],
        ["Lead time","Median and distribution of warning-to-event periods","Was there enough time for the intended action?"],
        ["Stability","Frequency through time and by segment","Is change economic, seasonal, mix-driven or technical?"],
        ["Operations","Cases reviewed, actions, backlog, analyst capacity","Can the institution process what it detects?"],
        ["Outcomes","Cure, stabilisation, further deterioration, default","What happened after warning and action?"],
      ]}/>
      <h3>Intervention complicates attribution</h3>
      <p>If a flagged borrower cures after contact or restructuring, the original warning was not necessarily false: intervention may have changed the outcome. Naive precision labels successful treatment as error. Evaluation must separate <strong>prediction performance</strong> from <strong>intervention effectiveness</strong>, retain action timing and type, and—where feasible—use controlled or carefully designed causal comparisons.</p>
      <h3>Champion and challenger logic should compete on decision value</h3>
      <p>The champion is current warning logic. Challengers can vary thresholds, persistence requirements, indicator combinations or priority rules. Compare detection, false positives, lead time, operational load and eventual outcomes on the same eligible populations and event definitions. A challenger with slightly lower headline precision may be superior if it adds usable lead time without overwhelming capacity.</p>
      <EntimemaFramework title="Signal → Alert → Decision → Intervention → Outcome → Evaluation → Recalibration" description="Warning logic earns its place by demonstrating useful outcomes, not by accumulating rules." steps={["Signal", "Alert", "Decision", "Intervention", "Outcome", "Evaluation", "Recalibration"]}/>
      <p>Evaluation should track conversion to deterioration and default, cures and stabilisation, avoided loss where it can be credibly estimated, intervention cost, customer impact, false-alert rate, lead time and operational utilisation. Without this loop, rules accumulate while evidence of value does not.</p>
    </section>

    <section id="failures">
      <h2>Failure modes that turn warning into noise</h2>
      <ResourceTable caption="Fifteen design failures and their mechanisms" headers={["Failure mode","Why the system fails"]} rows={[
        ["Too many indicators","Review capacity is consumed and redundant evidence masquerades as breadth"],
        ["No baseline","Normal variation is indistinguishable from deterioration"],
        ["Static thresholds","Borrower history, segment volatility and regime change are ignored"],
        ["Seasonality ignored","Recurring calendar behaviour becomes a structural alert"],
        ["Level confused with change","Stable high risk is mixed with newly accelerating risk"],
        ["One-period reaction","Noise triggers cost and customer friction"],
        ["Excessive persistence","False alerts fall, but actionable lead time is spent"],
        ["Vintage effects ignored","Seasoning or one weak cohort distorts portfolio interpretation"],
        ["Exposure ignored","Statistical change is prioritised without economic consequence"],
        ["Correlated duplicates","One underlying driver generates repeated escalation"],
        ["No decision owner","Alerts become unworked information"],
        ["No intervention capacity","Queues age and valuable cases lose their lead time"],
        ["No outcome feedback","Rules persist without evidence that action created value"],
        ["Prediction optimised","Discrimination improves while intervention value deteriorates"],
        ["Default monitored, not pathway","The system becomes accurate only after useful action is late"],
      ]}/>
    </section>

    <section id="automation">
      <h2>A Credit Early Warning Agent can support continuous monitoring—not autonomous adverse decisions</h2>
      <p>A future <strong>Credit Early Warning Agent</strong> could ingest periodic portfolio data, calculate approved indicators, maintain borrower, segment and vintage baselines, detect deviations, test persistence, identify correlated evidence, assess exposure materiality, rank alerts and assemble diagnostic evidence for human review.</p>
      <p>Its role is <strong>continuous monitoring + prioritisation + diagnostic decision support</strong>. Deterministic calculation, governed thresholds, permissions, human review and outcome lineage should remain explicit. The Agent should not autonomously make adverse credit decisions or infer causality from correlation.</p>
      <p>This is a strong recurring use case because deterioration must be monitored continuously and the workflow is repetitive, data-intensive and capacity-constrained. Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> practice connects warning methodology, portfolio monitoring, treatment strategy and controlled automation.</p>
    </section>

    <section id="diagnostic">
      <h2>The Entimema EWI Diagnostic Matrix</h2>
      <p>Position evidence relative to documented borrower or segment baselines. The matrix is a diagnostic language, not a universal rule; thresholds and review responses must be empirically justified.</p>
      <ResourceFigure label="Two by two early-warning diagnostic using signal strength and persistence." caption="Exposure, independent corroboration, action cost and customer context still determine priority within every quadrant.">
        <div className={styles.diagnostic}><span className={styles.yAxis}>SIGNAL STRENGTH ↑</span><span className={styles.xAxis}>PERSISTENCE →</span>
          <article><b>Strong / Temporary</b><p>Investigate an event-specific cause; severity is real even if duration is not established.</p></article>
          <article><b>Strong / Persistent</b><p>High-priority warning candidate; seek confirmation and determine action.</p></article>
          <article><b>Weak / Temporary</b><p>Monitor or ignore depending on normal volatility and intervention cost.</p></article>
          <article><b>Weak / Persistent</b><p>Potential emerging structural deterioration; accumulation through time matters.</p></article>
        </div>
      </ResourceFigure>
      <p>A strong persistent signal on a small exposure can be lower economic priority than modest risk change on a concentrated exposure. Conversely, large exposure cannot manufacture confidence. Corroborating evidence, causal redundancy and feasible action remain essential overlays.</p>
    </section>

    <section id="resolve">
      <h2>Resolve: convert evolving behaviour into controlled decision intelligence</h2>
      <p>A credible early-warning system does not chase every movement and does not wait for default. It defines borrower and portfolio states, measures direction and speed, tests severity and persistence, seeks independent confirmation, ranks cases against exposure and capacity, records investigation, links action to outcome, and monitors the entire chain.</p>
      <p>The architecture is therefore not a dashboard of warning signs. It is a controlled learning system: <strong>behaviour → evidence → prioritised case → intervention → observed outcome → improved warning logic</strong>.</p>
      <KeyObservation>The decisive question is not whether a variable crossed a line. It is whether the available evidence identifies a meaningful change in risk, early enough and clearly enough for a proportionate action.</KeyObservation>
    </section>
  </>;
}
