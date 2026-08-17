import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./automated-vintage-analysis.module.css";

export const automatedVintageSections = [
  { id: "tension", label: "The investigation gap" }, { id: "method", label: "Cohorts, MOB and metrics" },
  { id: "matrix", label: "Hypothetical vintage matrix" }, { id: "diagnostics", label: "Deterioration diagnostics" },
  { id: "workflow", label: "From R workflow to engine" }, { id: "agent", label: "AI Portfolio Analyst" },
  { id: "investigation", label: "Controlled drill-down" }, { id: "controls", label: "Controls and validation" },
  { id: "resolve", label: "Portfolio-intelligence resolve" },
] as const;

const vintageRows = [
  ["2026-01 · reference", "0.2%", "0.4%", "0.6%", "0.8%", "1.0%", "1.2%"],
  ["2026-02 · reference", "0.2%", "0.4%", "0.5%", "0.8%", "1.1%", "1.3%"],
  ["2026-03 · weaker", "0.3%", "0.5%", "0.8%", "1.2%", "1.6%", "2.0%"],
  ["2026-04 · diverging", "0.3%", "0.6%", "0.9%", <strong key="d4">1.6% △</strong>, <strong key="d5">2.2% ▲</strong>, <strong key="d6">2.7% ▲</strong>],
  ["2026-05 · immature", "0.2%", "0.5%", <span key="m3">NYO —</span>, <span key="m4">NYO —</span>, <span key="m5">NYO —</span>, <span key="m6">NYO —</span>],
];

export default function AutomatedVintageAnalysisArticle() {
  return <div className={styles.articleBody}>
    <section id="tension">
      <p className={styles.lead}>A credit-risk analyst can build an excellent vintage matrix in R. Yet every month the same analyst may still extract data, rerun calculations, compare cohorts, inspect MOB curves, identify divergence, filter products and channels, assess EAD, investigate and prepare commentary.</p>
      <p><strong>The calculation is automated. The investigation often is not.</strong> Vintage analysis becomes operationally powerful when cohort calculation, baseline comparison, deterioration detection and investigation are separated into controlled analytical layers.</p>
      <div className={styles.bridge}><article><span>INSIGHTS</span><h3>What does vintage analysis reveal?</h3><p>The companion <Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> research develops portfolio behaviour and interpretation.</p></article><article><span>ENGINEERING</span><h3>How do we operationalise it?</h3><p>This build begins where that methodology ends: repeatable calculation, monitoring and investigation at portfolio scale.</p></article></div>
      <KeyObservation title="Build proposition"><p><strong>R should calculate the cohorts. The AI Agent should investigate what changed and why it matters.</strong> The objective is reliable analytical tools over deterministic calculations—not portfolio arithmetic improvised by a language model.</p></KeyObservation>
    </section>

    <section id="method">
      <h2>Controlled dates turn portfolio records into comparable cohorts</h2>
      <p>An original hypothetical account-observation dataset uses <code>loan_id</code>, <code>customer_id</code>, <code>origination_date</code>, <code>observation_date</code>, <code>product</code>, <code>channel</code>, <code>ead</code>, <code>default_flag</code>, <code>dpd</code> and <code>risk_grade</code>. Exact schemas vary. Engineering requires a consistent origination definition, controlled observation dates, reproducible outcomes and uniquely identifiable exposures.</p>
      <Formula label="Origination cohort"><span className={styles.formulaLine}>Vintageᵢ = Period(OriginationDateᵢ) &nbsp; | &nbsp; monthly: YYYY-MM</span></Formula>
      <p>Monthly grouping is illustrative; quarterly or another defensible granularity may better fit production volume and risk emergence.</p>
      <Formula label="Months on book"><span className={styles.formulaLine}>MOBᵢ,ₜ = Months(ObservationDateₜ − OriginationDateᵢ)</span></Formula>
      <p>Calendar-date comparison mixes seasoning. Vintage analysis aligns <strong>Vintage A at MOB 6</strong> with <strong>Vintage B at MOB 6</strong>, not whichever observations happen to share a reporting month.</p>
      <pre className={styles.code}>{`library(dplyr)
library(lubridate)

portfolio_vintage <- portfolio %>%
  mutate(
    vintage = floor_date(origination_date, "month"),
    mob = interval(origination_date, observation_date) %/% months(1)
  )`}</pre>
      <h3>Use a cumulative default rate consistently</h3>
      <Formula label="Account-weighted cumulative default rate"><span className={styles.formulaLine}>CDRᵥ,ₘ = Defaultsᵥ,≤ₘ / EligibleAccountsᵥ</span></Formula>
      <p>The denominator is the controlled origination population. Each loan contributes once; <code>ever_default</code> records whether its first default occurred on or before the MOB. Delinquency, loss or balance deterioration could replace this outcome, but should not be mixed into the same metric.</p>
      <pre className={styles.code}>{`cohort_accounts <- portfolio_vintage %>%
  group_by(vintage) %>%
  summarise(eligible_accounts = n_distinct(loan_id), .groups = "drop")

vintage_summary <- portfolio_vintage %>%
  group_by(vintage, mob) %>%
  summarise(defaults_to_date = n_distinct(loan_id[ever_default == 1]),
            .groups = "drop") %>%
  left_join(cohort_accounts, by = "vintage") %>%
  mutate(default_rate = defaults_to_date / eligible_accounts)`}</pre>
      <Formula label="EAD-weighted cumulative default rate"><span className={styles.formulaLine}>DefaultRateᴱᴬᴰᵥ,ₘ = DefaultedOriginationExposureᵥ,≤ₘ / EligibleOriginationExposureᵥ</span></Formula>
      <pre className={styles.code}>{`ead_vintage <- portfolio_vintage %>%
  group_by(vintage, mob) %>%
  summarise(
    eligible_ead = sum(origination_ead[!duplicated(loan_id)], na.rm = TRUE),
    defaulted_ead = sum(origination_ead[!duplicated(loan_id)] * ever_default[!duplicated(loan_id)], na.rm = TRUE),
    ead_default_rate = defaulted_ead / eligible_ead,
    .groups = "drop"
  )`}</pre>
      <p>This freezes exposure at origination for a coherent illustrative denominator. Current EAD, default-date EAD and survival-adjusted designs answer different questions and require explicit eligibility, timing and denominator rules. Account weighting can hide a few large deteriorating exposures; EAD weighting can reveal their economic concentration.</p>
    </section>

    <section id="matrix">
      <h2>The vintage matrix is the deterministic foundation</h2>
      <p>The following entirely hypothetical portfolio contains five monthly cohorts. Rates are cumulative, so observed values never fall. January and February establish a stable reference, March is weaker, April diverges at MOB 4, and May is too immature for a conclusion.</p>
      <ResourceFigure label="Cumulative default-rate matrix for five hypothetical vintages through MOB 6." caption="△ moderate deterioration; ▲ material deterioration; NYO means not yet observed. Symbols, labels and colour jointly communicate state.">
        <div className={styles.matrix}><ResourceTable caption="Hypothetical cumulative default rates" headers={["Vintage", "MOB 1", "MOB 2", "MOB 3", "MOB 4", "MOB 5", "MOB 6"]} rows={vintageRows} /></div>
      </ResourceFigure>
      <p><strong>Not Yet Observed is not zero.</strong> A genuine observed 0.0% is a performance result; a future cell contains no observation. Storage and presentation must preserve that distinction.</p>
    </section>

    <section id="diagnostics">
      <h2>A baseline makes divergence measurable</h2>
      <p><strong>Baselineₘ</strong> is a reference at equivalent MOB: perhaps a historical median, selected reference vintages or weighted historical average. No construction is universally correct. Here the median is illustrative.</p>
      <Formula label="Absolute and relative vintage deviation"><span className={styles.formulaLine}>Deviationᵥ,ₘ = Metricᵥ,ₘ − Baselineₘ<br/>RelativeDeviationᵥ,ₘ = (Metricᵥ,ₘ − Baselineₘ) / Baselineₘ</span></Formula>
      <p>Positive deviation means deterioration when higher is worse. Compare MOB 6 with MOB 6. Relative change improves scale comparison but can exaggerate movement where the baseline is very small.</p>
      <pre className={styles.code}>{`baseline <- vintage_summary %>%
  group_by(mob) %>%
  summarise(baseline_rate = median(default_rate, na.rm = TRUE), .groups = "drop")

vintage_diagnostics <- vintage_summary %>%
  left_join(baseline, by = "mob") %>%
  mutate(deviation = default_rate - baseline_rate)`}</pre>
      <p>This begins diagnostics; it is not complete decision logic. One point may be noise.</p>
      <Formula label="Persistence"><span className={styles.formulaLine}>Persistenceᵥ,ₘ = Σᵐₖ₌ₘ₋ₕ I(Deviationᵥ,ₖ &gt; c)</span></Formula>
      <Formula label="Deterioration velocity"><span className={styles.formulaLine}>Velocityᵥ,ₘ = Metricᵥ,ₘ − Metricᵥ,ₘ₋₁</span></Formula>
      <Formula label="Materiality and investigation priority"><span className={styles.formulaLine}>Materialityᵥ,ₘ = f(Deviation, Exposure, PopulationSize)<br/>Priorityᵥ,ₘ = f(Deviation, Persistence, Velocity, Exposure)</span></Formula>
      <p>The threshold <strong>c</strong>, lookback, materiality logic and priority policy are controlled configuration—not universal constants. A small severe vintage may matter less immediately than moderate deterioration across a major cohort.</p>
      <EntimemaFramework title="The Vintage Diagnostic" description="Four distinct signals rank attention without forcing one universal score." steps={["Divergence", "Persistence", "Velocity", "Materiality", "Investigation priority"]}/>
    </section>

    <section id="workflow">
      <h2>The automation opportunity begins after the chart</h2>
      <ResourceFigure label="Traditional vintage workflow split between deterministic R calculation and manual investigation." caption="The matrix can be automated while repeated diagnostic drill-down remains analyst-driven.">
        <div className={styles.workflow}><div><strong>DETERMINISTIC R</strong>{["Extract portfolio", "Run R", "Build vintage matrix"].map(x=><span key={x}>{x}</span>)}</div><div><strong>MANUAL INVESTIGATION</strong>{["Inspect chart", "Identify cohort", "Filter product", "Filter channel", "Compare EAD", "Investigate", "Prepare commentary"].map(x=><span key={x}>{x}</span>)}</div></div>
      </ResourceFigure>
      <p>A reusable <strong>Vintage Engine</strong> would expose conceptual, controlled interfaces—not one analyst&apos;s notebook:</p>
      <pre className={styles.code}>{`build_vintages()          calculate_mob()
calculate_vintage_metric() calculate_baseline()
detect_deviation()         measure_persistence()
compare_segments()         rank_vintages()`}</pre>
      <div className={styles.io}><article><span>INPUTS</span><p>Versioned portfolio snapshot plus methodology and configuration.</p></article><article><span>ENGINE</span><p>Cohorts, MOB, performance, baseline, deviation, persistence and exposure materiality.</p></article><article><span>OUTPUTS</span><p>Structured diagnostics with lineage, observation status and comparable seasoning.</p></article></div>
      <p>The engine does not need an LLM. Its path is <strong>Portfolio Data → Cohort Assignment → MOB → Performance → Matrix → Baseline → Deviation → Persistence → Materiality</strong>.</p>
    </section>

    <section id="agent">
      <h2>Place an AI Portfolio Analyst above the engine</h2>
      <p>The Agent consumes structured deterministic outputs. It asks which vintages are deteriorating, when divergence began, whether it persists, whether it is material, what segment explains it and where analyst attention belongs.</p>
      <ResourceTable caption="The engine calculates; the Agent investigates" headers={["Vintage Engine", "AI Portfolio Analyst"]} rows={[["Builds cohorts", "Investigates cohorts"], ["Calculates MOB", "Interprets seasoning"], ["Calculates metrics and baseline", "Explains divergence"], ["Detects deviation and persistence", "Investigates drivers"], ["Returns structured data", "Synthesises analyst-ready evidence"]]} />
      <div className={styles.toolFlow}>{["Agent", "Analytical tool", "Deterministic result", "Agent reasoning", "Analyst review"].map(x=><span key={x}>{x}</span>)}</div>
      <pre className={styles.code}>{`get_vintage_matrix()
compare_vintage_to_baseline()
get_vintage_deviation()
get_segment_breakdown(vintage)
compare_account_vs_ead()
get_top_deteriorating_vintages()`}</pre>
      <p>These are proposed interfaces, not claims of existing production tools.</p>
      <blockquote className={styles.question}>Which recent vintages are materially underperforming the historical baseline?</blockquote>
      <p>The Agent calls <code>get_top_deteriorating_vintages()</code>; it does not guess. From the hypothetical matrix and a January–February reference it can return:</p>
      <div className={styles.response}><span>VINTAGE / 2026-04</span><dl><div><dt>Divergence begins</dt><dd>MOB 4</dd></div><div><dt>Current deviation</dt><dd>+1.45 pp vs 1.25% MOB 6 baseline</dd></div><div><dt>Persistence</dt><dd>3 observed MOB points</dd></div><div><dt>Exposure</dt><dd>€42m</dd></div><div><dt>Concentration</dt><dd>Product B / Channel X</dd></div><div><dt>Account / EAD signal</dt><dd>Moderate / high</dd></div><div><dt>Next investigation</dt><dd>Underwriting and channel mix</dd></div></dl></div>
    </section>

    <section id="investigation">
      <h2>Start broad, then isolate the source</h2>
      <div className={styles.toolFlow}>{["Portfolio", "Vintage", "Product", "Channel", "Risk grade", "Exposure"].map(x=><span key={x}>{x}</span>)}</div>
      <blockquote className={styles.question}>Is deterioration broad-based or concentrated?</blockquote>
      <p><code>get_segment_breakdown(vintage)</code> can recursively compare product, channel, risk grade and geography where analytically relevant. The hierarchy varies; the principle is progressive isolation using the same governed data.</p>
      <h3>Ask whether the signal exists in accounts, exposure or both</h3>
      <p><strong>Metricᵃᶜᶜᵒᵘⁿᵗˢ</strong> elevated alone may indicate many smaller cases. <strong>Metricᴱᴬᴰ</strong> elevated alone may reveal a few large exposures. Both elevated indicates broad and economically meaningful deterioration. Denominator differences must remain visible.</p>
      <h3>Separate performance from composition</h3>
      <p>A deteriorating vintage can reflect worse borrower performance, different borrower composition, or both. Compare risk-grade, product and channel mix and the exposure distribution. If the break coincides with a changed origination month, the Agent may examine acquisition channel, average exposure or approval-strategy mix.</p>
      <KeyObservation title="Inference boundary"><p><strong>Association → investigation hypothesis</strong>, never <strong>association → causal conclusion</strong>. A coincident mix change is a route for investigation, not proof of cause.</p></KeyObservation>
    </section>

    <section id="controls">
      <h2>Seasoning, baseline and alert controls keep the workflow honest</h2>
      <div className={styles.controls}>{[["Immaturity", "A cohort at MOB 2 cannot be compared with MOB 12. The Agent must state that evidence is immature."], ["Missing triangle", "Future cells remain Not Yet Observed, distinct from observed zero."], ["Baseline drift", "Monitor whether macro or portfolio conditions changed; historical average is not permanent truth."], ["Lineage", "Retain snapshot, outcome, denominator, configuration and engine versions behind every result."]].map(([a,b])=><article key={a}><strong>{a}</strong><p>{b}</p></article>)}</div>
      <h3>Backtest the alert, not only the rate</h3>
      <p>If the engine would have flagged April at MOB 4, later ask whether divergence persisted, outcomes worsened, the alert was early, or it was noise. Compare champion and challenger baselines, persistence logic, materiality logic and thresholds on historical vintages without optimising blindly to historical noise.</p>
      <h3>Agent guardrails</h3>
      <ul><li>Never invent missing portfolio data or calculate uncontrolled metrics from prose.</li><li>Never compare non-equivalent MOB periods or treat NYO as zero.</li><li>Never infer causality without evidence.</li><li>Never change baseline methodology or risk thresholds autonomously.</li><li>Never classify a vintage without structured engine evidence and lineage.</li><li>Escalate immature, missing, conflicting or out-of-scope evidence to analyst review.</li></ul>
    </section>

    <section id="resolve">
      <h2>The resolve is recurring portfolio intelligence</h2>
      <p>The finished path is <strong>Methodology → R implementation → deterministic analytical engine → AI-assisted workflow → analyst review</strong>. R preserves cohort arithmetic. The engine standardises comparison and diagnostics. The Agent queries controlled evidence, ranks attention and frames investigation. The analyst owns interpretation and action.</p>
      <KeyObservation title="Engineering resolve"><p><strong>Vintage analysis becomes operationally powerful when cohort calculation, baseline comparison, deterioration detection and investigation are separated into controlled analytical layers.</strong> The Agent does not replace the engine; it makes the engine&apos;s reproducible evidence easier to investigate repeatedly at portfolio scale.</p></KeyObservation>
    </section>
  </div>;
}
