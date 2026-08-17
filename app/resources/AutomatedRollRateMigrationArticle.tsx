import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./automated-roll-rate-migration.module.css";

export const automatedRollRateSections = [
  { id: "tension", label: "The investigation gap" }, { id: "snapshots", label: "Snapshots and states" },
  { id: "matrix", label: "Transition matrix" }, { id: "diagnostics", label: "Change diagnostics" },
  { id: "materiality", label: "Accounts and EAD" }, { id: "segments", label: "Segment drill-down" },
  { id: "workflow", label: "From R to an engine" }, { id: "agent", label: "AI Collections Analyst" },
  { id: "trajectory", label: "State versus trajectory" }, { id: "controls", label: "Controls and validation" },
  { id: "resolve", label: "Collections-intelligence resolve" },
] as const;

const cell = (kind: "improve" | "stable" | "worse" | "default", value: string) => {
  const symbols = { improve: "←", stable: "●", worse: "→", default: "◆" };
  const labels = { improve: "improvement", stable: "same state", worse: "deterioration", default: "default" };
  return <span className={styles[kind]} aria-label={`${value}, ${labels[kind]}`}>{symbols[kind]} {value}</span>;
};

const matrixRows = [
  ["Current", cell("stable", "91%"), cell("worse", "6%"), cell("worse", "2%"), cell("worse", "0.5%"), cell("default", "0.5%")],
  ["1–30", cell("improve", "36%"), cell("stable", "42%"), cell("worse", "15%"), cell("worse", "5%"), cell("default", "2%")],
  ["31–60", cell("improve", "12%"), cell("improve", "18%"), cell("stable", "41%"), cell("worse", "24%"), cell("default", "5%")],
  ["61–90", cell("improve", "5%"), cell("improve", "8%"), cell("improve", "14%"), cell("stable", "43%"), cell("default", "30%")],
  ["Default", cell("improve", "2%"), cell("improve", "1%"), cell("improve", "1%"), cell("improve", "3%"), cell("default", "93%")],
];

export default function AutomatedRollRateMigrationArticle() {
  return <div className={styles.articleBody}>
    <section id="tension">
      <p className={styles.lead}>A risk analyst can calculate a transition matrix in R quickly. The recurring work is deciding which cells changed, whether cure is weakening, where deterioration persists, which segments and exposures explain it, and which cases deserve collections attention.</p>
      <p><strong>The matrix is automated. The investigation often is not.</strong> A transition matrix describes how risk moves; a useful collections system determines which movements matter and where intervention has the greatest potential value.</p>
      <div className={styles.bridge}><article><span>INSIGHTS</span><h3>How does risk migrate?</h3><p><Link href="/resources/roll-rate-analysis-migration-matrices">Roll Rate Analysis and Migration Matrices</Link> develops the methodology and interpretation.</p></article><article><span>ENGINEERING</span><h3>How do we operationalise it?</h3><p>This build calculates, monitors and investigates transitions repeatedly at portfolio scale without duplicating the methodology article.</p></article></div>
      <KeyObservation title="Build proposition"><p><strong>R should calculate transitions. The AI Collections Analyst should investigate the changing transition structure and translate deterministic evidence into analyst-ready priorities.</strong></p></KeyObservation>
      <p>All definitions, code, data and results below are original, entirely hypothetical Entimema examples. They do not reproduce a bank&apos;s policy, data, thresholds, rules or procedures.</p>
    </section>

    <section id="snapshots">
      <h2>Comparable snapshots create observable migration</h2>
      <p>A hypothetical input uses <code>account_id</code>, <code>customer_id</code>, <code>observation_date</code>, <code>dpd</code>, <code>state</code>, <code>ead</code>, <code>product</code>, <code>vintage</code>, <code>risk_grade</code>, <code>payment_amount</code> and <code>collection_status</code>. Exact schemas vary; stable identity, observation dates, state, exposure and meaningful segmentation do not.</p>
      <Formula label="Account state at consecutive observations"><span className={styles.formulaLine}>Sᵢ,ₜ &nbsp; → &nbsp; Sᵢ,ₜ₊₁</span></Formula>
      <p>Frequency must be consistent: a monthly transition is not comparable with a weekly one. The illustrative ordered states are <strong>S₀ Current, S₁ 1–30 DPD, S₂ 31–60 DPD, S₃ 61–90 DPD and Sᴰ Default</strong>. They are examples, not universal policy.</p>
      <pre className={styles.code}>{`library(dplyr)

# Hypothetical buckets: replace only through controlled methodology.
portfolio <- portfolio %>%
  mutate(state = case_when(
    dpd == 0 ~ "Current", dpd <= 30 ~ "1-30",
    dpd <= 60 ~ "31-60", dpd <= 90 ~ "61-90",
    TRUE ~ "Default"
  ))

transitions <- current_snapshot %>%
  select(account_id, state_t = state, ead_t = ead) %>%
  inner_join(next_snapshot %>%
    select(account_id, state_t1 = state), by = "account_id")`}</pre>
      <p>The inner join is the analytical pair, not the reconciliation. New accounts, closed accounts and missing observations belong in explicit exception populations with counts and EAD; they must not silently disappear.</p>
    </section>

    <section id="matrix">
      <h2>The transition matrix is the deterministic foundation</h2>
      <Formula label="Transition count and row probability"><span className={styles.formulaLine}>Nᵢⱼ = N(Sₜ=i, Sₜ₊₁=j)<br/>pᵢⱼ = Nᵢⱼ / ΣⱼNᵢⱼ &nbsp; ; &nbsp; Σⱼpᵢⱼ = 1</span></Formula>
      <pre className={styles.code}>{`transition_counts <- transitions %>%
  count(state_t, state_t1, name = "accounts")

transition_matrix <- transition_counts %>%
  group_by(state_t) %>%
  mutate(transition_probability = accounts / sum(accounts)) %>%
  ungroup()`}</pre>
      <p>Counts expose workload but scale with portfolio size. Row probabilities describe the destination distribution conditional on each starting state. Production checks should reconcile every row to approximately 100%, subject only to rounding.</p>
      <ResourceFigure label="Hypothetical account-weighted delinquency transition matrix." caption="Every row sums to 100%. Arrows and symbols distinguish improvement, same state, deterioration and default without relying on colour.">
        <div className={styles.matrix}><ResourceTable caption="Illustrative monthly transition probabilities" headers={["From / To", "Current", "1–30", "31–60", "61–90", "Default"]} rows={matrixRows} /></div>
      </ResourceFigure>
      <h3>Roll forward, roll back and cure are distinct</h3>
      <p>Under this ordered example, <strong>Sₜ₊₁ &gt; Sₜ</strong> is roll forward: 1–30 → 31–60 is 15%, while 31–60 → 61–90 is 24%. Their incidence and economics differ. <strong>Sₜ₊₁ &lt; Sₜ</strong> is roll back: 31–60 → 1–30 is 18%, while 1–30 → Current is 36%.</p>
      <p>A roll back is not automatically a formal cure. One controlled hypothetical cure measure could require exit from delinquency and remaining Current for two subsequent observations. Sustained improvement, eligibility and any additional methodology must enter the engine as versioned configuration—not be inferred from one cell.</p>
    </section>

    <section id="diagnostics">
      <h2>Baseline, persistence and velocity turn a matrix into monitoring</h2>
      <Formula label="Transition deviation"><span className={styles.formulaLine}>Deviationᵢⱼ,ₜ = pᵢⱼ,ₜ − Baselineᵢⱼ</span></Formula>
      <pre className={styles.code}>{`transition_diagnostics <- current_rates %>%
  left_join(historical_baseline,
    by = c("state_t", "state_t1")) %>%
  mutate(deviation = transition_probability - baseline_probability)`}</pre>
      <p>The baseline might be a selected historical median or another approved reference. It is controlled context, not permanent truth. Rising Current → 1–30, 1–30 → 31–60 and 31–60 → 61–90 alongside falling 1–30 → Current is more informative than one isolated cell: entry, progression and weakening improvement reinforce one another.</p>
      <Formula label="Persistence and transition velocity"><span className={styles.formulaLine}>Persistenceᵢⱼ,ₜ = Σᵗₖ₌ₜ₋ₕ I(Deviationᵢⱼ,ₖ &gt; c)<br/>Velocityᵢⱼ,ₜ = pᵢⱼ,ₜ − pᵢⱼ,ₜ₋₁</span></Formula>
      <p>The threshold <strong>c</strong> and horizon are not universal. One abnormal month may be noise; repeated deviation increases confidence that a change may be structural. A transition can be worse than baseline, continuing to worsen, or both.</p>
      <EntimemaFramework title="The Migration Diagnostic" description="Four separate dimensions lead to a controlled investigation, rather than a single unexplained alert." steps={["Direction", "Magnitude", "Persistence", "Materiality", "Investigation"]}/>
    </section>

    <section id="materiality">
      <h2>Borrower incidence and exposure economics tell different stories</h2>
      <Formula label="Account- and EAD-weighted migration"><span className={styles.formulaLine}>pᴬᶜᶜᵒᵘⁿᵗˢᵢⱼ = Nᵢⱼ / Nᵢ<br/>pᴱᴬᴰᵢⱼ = Σₖ∈ᵢ→ⱼ EADₖ / Σₖ∈ᵢ EADₖ</span></Formula>
      <p>Account weighting gives each account equal influence and supports behavioural incidence, borrower counts and workload. EAD weighting asks what share of starting-state exposure migrated and can reveal concentration in a few large accounts.</p>
      <pre className={styles.code}>{`ead_transitions <- transitions %>%
  group_by(state_t, state_t1) %>%
  summarise(transition_ead = sum(ead_t, na.rm = TRUE), .groups = "drop") %>%
  group_by(state_t) %>%
  mutate(ead_transition_rate = transition_ead / sum(transition_ead)) %>%
  ungroup()`}</pre>
      <p>The denominator is total observed <code>ead_t</code> in the starting-state row. In a hypothetical 31–60 → 61–90 transition, an <strong>18% account rate</strong> and <strong>31% EAD rate</strong> mean relatively fewer accounts deteriorated but carried disproportionately large exposure—materially raising investigation priority.</p>
    </section>

    <section id="segments">
      <h2>Controlled drill-down isolates where migration changed</h2>
      <p>The engine can compare product, vintage, risk grade, acquisition channel and relevant customer segment. Dimensions should be approved and analytically meaningful; unconstrained slicing creates multiple-comparison noise and fragile stories.</p>
      <div className={styles.flow}>{["Portfolio", "Transition", "Product", "Vintage", "Risk grade", "Exposure"].map(x => <span key={x}>{x}</span>)}</div>
      <p>If the overall 31–60 → 61–90 rate worsens, a vintage breakdown may show concentration in the hypothetical <strong>2026-03</strong> cohort. Product analysis may show Pᵢⱼᴾʳᵒᵈᵘᶜᵗ A ≠ Pᵢⱼᴾʳᵒᵈᵘᶜᵗ B. The Agent can then distinguish a portfolio-wide change from a Product B cohort concentration.</p>
      <div className={styles.bridge}><article><span>VINTAGE ANALYSIS</span><h3>Which cohorts deteriorate?</h3><p>See <Link href="/resources/automating-credit-vintage-analysis-r-ai-portfolio-analyst">Automating Credit Vintage Analysis</Link>.</p></article><article><span>MIGRATION ANALYSIS</span><h3>Through which states?</h3><p><strong>Cohort deterioration + state migration = richer portfolio diagnosis.</strong></p></article></div>
    </section>

    <section id="workflow">
      <h2>Move from an R script to a reusable migration engine</h2>
      <ResourceFigure label="Traditional migration workflow divided into deterministic calculation and manual investigation." caption="Calculation may be automated while comparison, drill-down and prioritisation remain manual.">
        <div className={styles.workflow}><div><strong>R / DETERMINISTIC CALCULATION</strong>{["Export snapshots", "Run R", "Build transition matrix", "Compare month"].map(x=><span key={x}>{x}</span>)}</div><div><strong>MANUAL INVESTIGATION & PRIORITISATION</strong>{["Identify worsening cell", "Filter segment", "Check EAD", "Identify accounts", "Prepare collections analysis", "Report"].map(x=><span key={x}>{x}</span>)}</div></div>
      </ResourceFigure>
      <pre className={styles.code}>{`assign_state()                    pair_snapshots()
calculate_transition_matrix()     calculate_roll_rates()
calculate_cure_rates()            compare_to_baseline()
calculate_persistence()           compare_account_vs_ead()
analyse_segment()                 rank_deteriorating_transitions()`}</pre>
      <p>These are conceptual interfaces, not claims of existing software. A structured output might be:</p>
      <pre className={styles.code}>{`transition: 31-60 -> 61-90
current_rate: 0.24        baseline_rate: 0.16
deviation: +0.08          persistence_periods: 3
ead_affected: 18.4m       largest_segment: Product B`}</pre>
    </section>

    <section id="agent">
      <h2>Place an AI Collections Analyst above deterministic evidence</h2>
      <p>The Agent does not calculate probabilities from prose. It asks: what changed, where, for how long, how much exposure is affected, which segments or borrowers explain it, and which cases deserve attention first?</p>
      <ResourceTable caption="Separation of calculation and investigation" headers={["Migration Engine", "AI Collections Analyst"]} rows={[["Assigns states", "Interprets state movement"], ["Calculates transitions and roll rates", "Explains deterioration"], ["Calculates controlled cure", "Investigates weakening cure"], ["Measures persistence and EAD impact", "Synthesises material evidence"], ["Returns structured evidence", "Produces analyst-ready context and priorities"]]} />
      <pre className={styles.code}>{`get_transition_matrix()
compare_transition_to_baseline()
get_roll_forward_changes()       get_cure_rate_changes()
compare_account_vs_ead()         breakdown_transition_by_segment()
get_accounts_in_transition()     rank_collection_priorities()`}</pre>
      <div className={styles.flow}>{["Agent", "Tool", "Deterministic result", "Agent interpretation", "Analyst review"].map(x=><span key={x}>{x}</span>)}</div>
      <p><strong>Never:</strong> Prompt → LLM-invented transition matrix.</p>
      <blockquote className={styles.question}>Why has the 31–60 DPD portfolio deteriorated this month?</blockquote>
      <p>The Agent queries the matrix, baseline, persistence, account/EAD movement, product and vintage breakdowns, then the largest exposures. It returns evidence, not unsupported causality:</p>
      <div className={styles.diagnostic}><span>HYPOTHETICAL DIAGNOSTIC / 31–60 → 61–90</span><dl><div><dt>Current / baseline</dt><dd>24% / 16%</dd></div><div><dt>Deviation / persistence</dt><dd>+8 pp / 3 periods</dd></div><div><dt>EAD-weighted transition</dt><dd>31%</dd></div><div><dt>EAD affected</dt><dd>18.4m</dd></div><div><dt>Primary concentration</dt><dd>Product B / vintage 2026-03</dd></div><div><dt>Interpretation</dt><dd>Concentrated, not portfolio-wide</dd></div><div><dt>Next investigation</dt><dd>Underwriting and collections behaviour</dd></div><div><dt>Causality</dt><dd>Not established</dd></div></dl></div>
    </section>

    <section id="trajectory">
      <h2>Current state and expected trajectory are different risk dimensions</h2>
      <p>Two borrowers can both be 30 DPD. Borrower A may have a high estimated probability of cure; Borrower B a high estimated probability of further deterioration. Therefore:</p>
      <Formula label="State does not determine trajectory"><span className={styles.formulaLine}>CurrentStateᴬ = CurrentStateᴮ &nbsp; ⇏ &nbsp; ExpectedTrajectoryᴬ = ExpectedTrajectoryᴮ</span></Formula>
      <p>This is the bridge from portfolio migration monitoring to collections prioritisation. The same delinquency queue can contain materially different forward risk and potential value from intervention.</p>
      <Formula label="Conceptual collections priority"><span className={styles.formulaLine}>Priorityᵢ = f(CurrentStateᵢ, ForwardRiskᵢ, EADᵢ, PDᵢ, Persistenceᵢ)</span></Formula>
      <div className={styles.cards}>{[["Current state", "Observed delinquency position and operational status."], ["Forward risk", "Controlled estimate of further adverse migration, not an LLM guess."], ["EAD", "Exposure potentially affected and its concentration."], ["PD", "Approved risk estimate used with its definition and horizon."], ["Persistence", "Whether adverse behaviour or signals repeat across observations."], ["Priority", "A governed ranking for investigation—not an automatic customer treatment decision."]].map(([a,b])=><article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>No universal priority formula is imposed. Policy must define eligibility, weights, constraints, capacity and human authority. Forward migration risk may be estimated by an approved model or segment transition evidence; its version, horizon and validation status must remain visible.</p>
    </section>

    <section id="controls">
      <h2>Controls make assistance operationally credible</h2>
      <ul><li><strong>Data reconciliation:</strong> account and EAD totals, duplicates, missing snapshots, new and closed populations.</li><li><strong>Methodology control:</strong> version state order, snapshot frequency, eligibility, cure, baseline, thresholds and weighting.</li><li><strong>Calculation tests:</strong> non-negative counts, complete destinations and probability rows reconciling to one.</li><li><strong>Lineage:</strong> retain snapshot, code, configuration, engine and tool-call versions behind every result.</li><li><strong>Access:</strong> account-level tools expose only authorised fields and log every query.</li><li><strong>Human authority:</strong> the Agent proposes priorities and investigation paths; analysts approve interpretation and collections action.</li></ul>
      <p>Backtest alerts: did persistent deviations precede later adverse outcomes, how much lead time existed, and how many false investigations were created? Monitor baseline drift and challenger configurations without optimising blindly to historical noise.</p>
      <KeyObservation title="Inference boundary"><p>The Agent may report that deterioration is <strong>concentrated in</strong> Product B and the 2026-03 vintage. It must not claim underwriting or collections <strong>caused</strong> the change until separate evidence establishes that conclusion.</p></KeyObservation>
    </section>

    <section id="resolve">
      <h2>The resolve is recurring portfolio and collections intelligence</h2>
      <p>The finished path is <strong>Account snapshots → state assignment → transition pairing → matrix → baseline → deviation → persistence → exposure materiality → segment drill-down → collections priority → AI investigation → analyst action</strong>.</p>
      <p><strong>Methodology → R implementation → deterministic analytical engine → AI-assisted workflow.</strong> R preserves the arithmetic. The engine standardises evidence. The Agent investigates controlled outputs. The analyst owns decisions and intervention.</p>
      <KeyObservation title="Engineering resolve"><p><strong>A transition matrix describes how risk moves. An operational collections-intelligence system determines which movements matter, why they merit investigation and where constrained human attention may create the greatest value.</strong></p></KeyObservation>
    </section>
  </div>;
}
