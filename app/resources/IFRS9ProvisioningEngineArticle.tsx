import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./ifrs9-provisioning-engine.module.css";

export const ifrs9ProvisioningSections = [
  { id: "tension", label: "The automated calculation gap" }, { id: "core", label: "ECL computational core" },
  { id: "staging", label: "Stage and horizon architecture" }, { id: "traditional", label: "Traditional R workflow" },
  { id: "portfolio", label: "Hypothetical portfolio" }, { id: "vectors", label: "Lifetime vectors and scenarios" },
  { id: "reconciliation", label: "Controls and reconciliation" }, { id: "movement", label: "Provision movement" },
  { id: "opportunity", label: "Why R is not the problem" }, { id: "architecture", label: "Engine plus Agent" },
  { id: "boundaries", label: "Agent boundaries" }, { id: "tools", label: "Controlled tool calling" },
  { id: "workflow", label: "Monthly workflow redesign" }, { id: "resolve", label: "Engineering resolve" },
] as const;

const portfolioRows = [
  ["EXP-001","Term loan","1","120,000","1.2%","38%","4.0%","Base","50%"],
  ["EXP-002","Revolver","1","82,000","2.1%","42%","5.0%","Base","50%"],
  ["EXP-003","Mortgage","1","210,000","0.8%","22%","3.5%","Base","50%"],
  ["EXP-004","Term loan","2","165,000","7.5%","44%","4.5%","Base","50%"],
  ["EXP-005","Revolver","2","61,000","11.0%","48%","5.5%","Base","50%"],
  ["EXP-006","Mortgage","2","188,000","4.2%","28%","3.8%","Base","50%"],
  ["EXP-007","Term loan","3","73,000","36.0%","55%","6.0%","Base","50%"],
  ["EXP-008","Revolver","3","39,000","58.0%","62%","6.5%","Base","50%"],
];
const traditionalSteps = ["SOURCE / DATABASE","IMPORT","CLEANSE","STAGE","JOIN PARAMETERS","EXPAND SCENARIOS","CALCULATE ECL","AGGREGATE","EXPORT","RECONCILE","ANALYSE MOVEMENT","REPORT"];
const deterministic = ["DATA","STAGING","PD / LGD / EAD","SCENARIOS","DISCOUNTING","ECL","RECONCILIATION"];
const assisted = ["MOVEMENT DETECTION","EXCEPTION INVESTIGATION","DRIVER EXPLANATION","CASE PRIORITISATION","ANALYST BRIEF","EVIDENCE PACK"];

export default function IFRS9ProvisioningEngineArticle() {
  return <div className={styles.articleBody}>
    <section id="tension">
      <p className={styles.lead}>A monthly provision can be computationally automated and operationally manual at the same time.</p>
      <p>R can calculate thousands or millions of exposures efficiently, yet analysts may still prepare and validate inputs, run scripts, diagnose failures, export results, compare periods, investigate stage migration, reconcile balances and write commentary by hand. The mathematical kernel is automated; the surrounding analytical workflow is not.</p>
      <KeyObservation title="Central engineering proposition"><p><strong>The AI Agent should not improvise the ECL calculation. The deterministic engine calculates; the Agent controls, investigates and explains.</strong></p></KeyObservation>
      <p>The evolution is therefore not <strong>R → LLM</strong>. It is <strong>deterministic calculation → controlled orchestration → analytical intelligence</strong>. This article uses only newly written Entimema code and entirely hypothetical data; it is an engineering pattern, not accounting advice or a complete IFRS 9 methodology.</p>
    </section>

    <section id="core">
      <h2>Start with an explicit computational contract</h2>
      <Formula label="Expected credit loss across time"><span className={styles.formulaLine}>ECL = Σₜ PDₜ × LGDₜ × EADₜ × DFₜ</span></Formula>
      <p><strong>PD</strong> represents probability of default over the relevant interval; <strong>LGD</strong> the proportion lost conditional on default; <strong>EAD</strong> the expected exposure at default; and <strong>DF</strong> the discount factor derived using the applicable effective-interest basis. The time horizon determines which periods enter. With scenarios:</p>
      <Formula label="Scenario-weighted expected credit loss"><span className={styles.formulaLine}>ECL = Σₛ wₛ (Σₜ PDₜ,ₛ × LGDₜ,ₛ × EADₜ,ₛ × DFₜ)</span></Formula>
      <p>Each scenario weight <strong>wₛ</strong> expresses the approved weighting of a coherent forward-looking scenario and must satisfy <strong>Σₛwₛ = 1</strong>. In practice, teams must be precise about marginal versus cumulative PD, survival, recoveries, prepayment and discount timing; the multiplication below is only a transparent kernel.</p>
      <pre className={styles.code}>{`portfolio$ecl <- with(
  portfolio,
  pd * lgd * ead * discount_factor
)`}</pre>
    </section>

    <section id="staging">
      <h2>Separate the stage decision from the loss calculation</h2>
      <div className={styles.stageGrid}>{[["STAGE 1","12-month ECL"],["STAGE 2","Lifetime ECL following significant increase in credit risk under the relevant methodology"],["STAGE 3","Appropriate lifetime treatment for credit-impaired exposures"]].map(([a,b])=><article key={a}><strong>{a}</strong><p>{b}</p></article>)}</div>
      <Formula label="Stage controls calculation horizon"><span className={styles.formulaLine}>Stageᵢ → Horizonᵢ → Calculationᵢ</span></Formula>
      <p>A <strong>Stage Engine</strong> determines Stageᵢ under an approved methodology. A separate <strong>ECL Engine</strong> calculates ECLᵢ conditional on Stageᵢ. That boundary permits independent unit tests, clearer explanations, separately versioned methodologies, faster troubleshooting and traceable audit evidence—without publishing or embedding institution-specific thresholds.</p>
      <pre className={styles.code}>{`portfolio <- portfolio %>%
  mutate(ecl_horizon = case_when(
    stage == 1 ~ "12M",
    stage %in% c(2, 3) ~ "Lifetime"
  ))`}</pre>
      <p>The label routes an exposure; it does not calculate lifetime ECL. Lifetime treatment needs period-specific risk vectors.</p>
    </section>

    <section id="traditional">
      <h2>Traditional R automation can stop at export</h2>
      <ResourceFigure label="Traditional R-based provisioning workflow distinguishing automated and manual work." caption="Blue steps are deterministic computation; amber steps are commonly manual analytical or control work. The boundary varies by implementation.">
        <div className={styles.legend}><span>Automated computation</span><span>Manual analysis / control</span></div>
        <div className={styles.workflow}>{traditionalSteps.map((x,i)=><span className={i > 8 ? styles.manual : styles.automated} key={x}>{x}</span>)}</div>
      </ResourceFigure>
      <p>Source files or databases flow through import, cleansing, stage assignment, parameter joins, scenario expansion, calculation, aggregation and export. The hand-offs after export—reconciliation, movement analysis and reporting—can still consume most of the close.</p>
    </section>

    <section id="portfolio">
      <h2>A small hypothetical portfolio makes the pipeline visible</h2>
      <p>The eight exposures below are invented for this article. Rates and parameters are illustrative, not benchmarks, policy settings or staging criteria. Only the Base scenario is shown here; the calculation expands every exposure across all scenarios.</p>
      <ResourceTable caption="Hypothetical one-row-per-exposure input extract" headers={["Exposure","Product","Stage","EAD","PD input","LGD","EIR","Scenario","Weight"]} rows={portfolioRows}/>
      <pre className={styles.code}>{`library(dplyr)

ecl_results <- portfolio %>%
  mutate(expected_loss = pd * lgd * ead * discount_factor) %>%
  group_by(stage, product) %>%
  summarise(ead = sum(ead), ecl = sum(expected_loss), .groups = "drop")`}</pre>
      <p>Vectorised transformations are concise, reviewable and reproducible. A production implementation would additionally control parameter semantics, dates, term structures, default and recovery treatment, currencies, missing values and calculation versions.</p>
    </section>

    <section id="vectors">
      <h2>Lifetime ECL changes the grain of the calculation</h2>
      <Formula label="Exposure-level lifetime expected credit loss"><span className={styles.formulaLine}>ECLᵢ = Σₜ₌₁ᵀⁱ PDᵢ,ₜ × LGDᵢ,ₜ × EADᵢ,ₜ × DFᵢ,ₜ</span></Formula>
      <p>The useful data shape moves from <strong>one row per exposure</strong> to <strong>one row per exposure × period × scenario</strong> before aggregation. Long format makes horizon selection, scenario calculations, aggregation and diagnostics explicit.</p>
      <ResourceTable caption="Illustrative long-format calculation rows" headers={["Exposure","Period","Scenario","PD","LGD","EAD","DF","Weight","Weighted contribution"]} rows={[
        ["EXP-004","1","Base","1.8%","44%","165,000","0.957","50%","625"],
        ["EXP-004","1","Upside","1.4%","42%","165,000","0.957","20%","186"],
        ["EXP-004","1","Downside","2.7%","49%","165,000","0.957","30%","627"],
        ["EXP-004","2","Base","2.0%","45%","142,000","0.916","50%","585"],
      ]}/>
      <p>Base, Upside and Downside are purely illustrative and use weights of <strong>50%, 20% and 30%</strong>. Their sum is one. Period PD values are treated as marginal probabilities in this simplified table.</p>
      <pre className={styles.code}>{`scenarios <- tibble(
  scenario = c("Base", "Upside", "Downside"),
  scenario_weight = c(0.50, 0.20, 0.30)
)
stopifnot(abs(sum(scenarios$scenario_weight) - 1) < 1e-12)

scenario_ecl <- expanded_portfolio %>%
  left_join(scenarios, by = "scenario") %>%
  mutate(ecl_component = pd * lgd * ead * discount_factor * scenario_weight) %>%
  group_by(exposure_id) %>%
  summarise(ecl = sum(ecl_component), .groups = "drop")`}</pre>
    </section>

    <section id="reconciliation">
      <h2>A returned number is not a completed calculation</h2>
      <div className={styles.workflow}>{["OPENING POPULATION","CALCULATED POPULATION","EXCEPTIONS / EXCLUSIONS","CALCULATED ECL","CONTROLLED ADJUSTMENTS","FINAL PROVISION"].map(x=><span className={styles.automated} key={x}>{x}</span>)}</div>
      <p>Controls must answer whether every expected exposure entered, balances and stage totals agree, duplicates exist, exclusions are understood and any adjustments are authorised. Critical assumptions should fail loudly rather than produce a plausible-looking total.</p>
      <pre className={styles.code}>{`stopifnot(
  nrow(portfolio) == n_distinct(portfolio$exposure_id),
  all(portfolio$ead >= 0),
  all(portfolio$stage %in% 1:3)
)

reconciliation <- ecl_results %>%
  group_by(stage) %>%
  summarise(exposure = sum(ead), ecl = sum(ecl), .groups = "drop")`}</pre>
    </section>

    <section id="movement">
      <h2>Explain the bridge, not only the closing balance</h2>
      <Formula label="Month-on-month ECL movement"><span className={styles.formulaLine}>ΔECL = ECLₜ − ECLₜ₋₁</span></Formula>
      <p>New business, repayments or exits, stage migration, PD, LGD and EAD change, scenario change, default, write-off and methodology change can all contribute. The taxonomy and ordering must be designed for the portfolio; there is no universal decomposition. A controlled sequential or attribution method must prevent double counting.</p>
      <ResourceFigure label="Conceptual provision movement waterfall from opening to closing ECL." caption="An illustrative Entimema bridge. Bar direction and size are conceptual, not reported portfolio values.">
        <div className={styles.bridge}>{[["OPENING ECL","80%"],["PORTFOLIO MOVEMENT","58%"],["STAGE MIGRATION","73%"],["PD / LGD MOVEMENT","66%"],["SCENARIO EFFECT","76%"],["CLOSING ECL","76%"]].map(([x,h],i)=><div key={x}><span style={{height:h}} className={i===0||i===5?styles.totalBar:styles.moveBar}/><small>{x}</small></div>)}</div>
      </ResourceFigure>
      <p><strong>Opening ECL + new business + risk-parameter movement + stage migration + scenario effect + exposure movement + other controlled effects = closing ECL.</strong> Each exposure-driver assignment should be mutually intelligible and reproducible.</p>
    </section>

    <section id="opportunity">
      <h2>R alone is not the problem</h2>
      <p>R remains highly appropriate for numerical calculation, transformations, vectorised portfolio operations, statistical models, diagnostics, reconciliation and movement analysis. The operational problem begins when analysts must decide: Which changes matter? Which exposures caused them? Which are expected or anomalous? What should be investigated first? How should the evidence be explained?</p>
      <blockquote className={styles.quote}>AI creates the greatest value around the calculation—validating inputs, investigating movements, reconciling outputs, identifying exceptions and explaining results.</blockquote>
    </section>

    <section id="architecture">
      <h2>Put the Agent after and around deterministic computation</h2>
      <ResourceFigure label="Deterministic R engine and AI-assisted provisioning layers." caption="CALCULATE remains a deterministic responsibility. INVESTIGATE & EXPLAIN consumes structured outputs and remains subject to analyst review.">
        <div className={styles.layer}><strong>CALCULATE · DETERMINISTIC LAYER</strong><div className={styles.workflow}>{deterministic.map(x=><span className={styles.automated} key={x}>{x}</span>)}</div></div>
        <div className={`${styles.layer} ${styles.agentLayer}`}><strong>INVESTIGATE &amp; EXPLAIN · AI-ASSISTED LAYER</strong><div className={styles.workflow}>{assisted.map(x=><span key={x}>{x}</span>)}</div></div>
        <div className={styles.review}>ANALYST REVIEW → APPROVED COMMENTARY / EVIDENCE</div>
      </ResourceFigure>
      <p>A future conceptual <strong>Entimema Provisioning Agent</strong> would orchestrate and analyse this controlled workflow; this is not a claim that it currently exists as a production product. It would receive reconciled results, movement records and exceptions—not an invitation to generate arbitrary ECL values.</p>
    </section>

    <section id="boundaries">
      <h2>Trust begins with an explicit execution boundary</h2>
      <div className={styles.comparison}><article><h3>The Agent should not</h3><ul>{["Invent PD, LGD or EAD","Invent staging criteria","Change scenario weights autonomously","Alter approved formulas","Silently override deterministic results","Post provisions without a controlled approval workflow"].map(x=><li key={x}>{x}</li>)}</ul></article><article><h3>The Agent can assist</h3><ul>{["Check completeness and orchestrate approved runs","Compare periods and analyse stage migration","Identify material movements and anomalies","Diagnose parameter and scenario effects","Drill down to exposures and support reconciliation","Draft cited commentary and prepare review evidence"].map(x=><li key={x}>{x}</li>)}</ul></article></div>
      <ResourceTable caption="Calculation engine and provisioning-agent responsibilities" headers={["Deterministic ECL engine","AI Provisioning Agent"]} rows={[["Calculates","Investigates"],["Applies approved formulas","Explains movements"],["Uses approved parameters","Interprets structured exceptions"],["Produces reproducible outputs","Produces analyst-ready context"],["Executes controls","Prioritises issues"],["Returns numbers and lineage","Connects numbers to evidence"]]}/>
      <p>The Agent need not be non-deterministic in every component: its filters, access controls, schemas, thresholds and routing can themselves be bounded and tested. Human accountability remains at the interpretation and approval boundary.</p>
    </section>

    <section id="tools">
      <h2>The Agent should call tools—not perform uncontrolled arithmetic</h2>
      <div className={styles.toolGrid}>{["run_ecl_calculation()","validate_population()","reconcile_exposure()","compare_periods()","analyse_stage_migration()","analyse_parameter_change()","get_top_ecl_movements()","prepare_review_pack()"].map(x=><code key={x}>{x}</code>)}</div>
      <p>These are conceptual interfaces, not claims about current product functions. Each should have an approved implementation, typed inputs, versioned configuration, authorised access, structured output, error states and execution log.</p>
      <Formula label="Controlled agent tool-calling pattern"><span className={styles.formulaLine}>Agent → Tool → Deterministic Result → Agent Interpretation</span></Formula>
      <Formula label="Rejected architecture"><span className={styles.rejected}>Prompt → LLM-generated ECL</span></Formula>
      <DecisionImplication><p><strong>The Agent reasons about the workflow; deterministic tools execute controlled calculations.</strong> This keeps numerical lineage reproducible while using language and reasoning where they create operational value.</p></DecisionImplication>
    </section>

    <section id="workflow">
      <h2>Redesign the monthly workflow around exceptions and evidence</h2>
      <div className={styles.comparison}><article><h3>Traditional</h3><ol>{["Prepare files","Run R","Check errors","Export ECL","Compare with prior month","Identify large movements","Drill into exposures","Reconcile totals","Prepare commentary","Respond to reviewer challenge"].map(x=><li key={x}>{x}</li>)}</ol><p>Time accumulates in hand-offs, repeated filtering, reconstruction and narrative assembly.</p></article><article><h3>Agent-assisted</h3><ol>{["Controlled snapshot arrives","Workflow starts with run identity","Deterministic input controls execute","Approved ECL engine calculates","Reconciliation executes","Movement decomposition executes","Agent receives structured exceptions","Agent prioritises material drivers","Agent assembles evidence-linked brief","Analyst investigates, edits and approves"].map(x=><li key={x}>{x}</li>)}</ol><p>Automation compresses search and assembly; the analyst retains judgement, challenge and approval.</p></article></div>
      <p>The target chain is <strong>Portfolio Data → Controlled Inputs → Deterministic ECL Engine → Validation → Reconciliation → Movement Analysis → Exception Detection → AI Investigation → Analyst Review → Reporting / Evidence</strong>.</p>
    </section>

    <section id="resolve">
      <h2>Calculate → Control → Investigate → Explain → Approve</h2>
      <EntimemaFramework title="The controlled provisioning workflow" description="Methodology becomes computation; computation becomes controlled automation; controlled evidence becomes AI-assisted analysis." steps={["Calculate","Control","Investigate","Explain","Approve"]}/>
      <p>The deterministic engine remains the source of mathematical truth. Controlled orchestration makes every input, formula, output and exception traceable. The Agent then reduces the costly work around the number: finding material changes, retrieving evidence, coordinating investigation and drafting an explanation for review.</p>
      <p>This is <strong>Deterministic Engine + AI Agent</strong>, not one replacing the other. Related Entimema work on <Link href="/resources/credit-portfolio-monitoring-architecture">credit portfolio monitoring architecture</Link> shows how risk signals become controlled cases, while <Link href="/resources/credit-risk-model-validation-pipeline">the model validation pipeline</Link> shows how deterministic tests become reproducible evidence.</p>
      <KeyObservation title="Resolve"><p><strong>The calculation may already be automated. The flagship engineering opportunity is to automate the analytical workflow surrounding it—without weakening control over the calculation itself.</strong></p></KeyObservation>
    </section>
  </div>;
}
