import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./credit-scorecard-development.module.css";

export const creditScorecardDevelopmentSections = [
  { id: "architecture", label: "What a scorecard does" },
  { id: "population", label: "Population, windows and target" },
  { id: "data", label: "Data and sample architecture" },
  { id: "binning", label: "Binning, WoE and IV" },
  { id: "selection", label: "Variable selection" },
  { id: "model", label: "Logistic model and challengers" },
  { id: "validation", label: "Ranking and stability" },
  { id: "scaling", label: "Score scaling and points" },
  { id: "decision", label: "Calibration and cut-off" },
  { id: "example", label: "180,000-application example" },
  { id: "production", label: "Production and monitoring" },
  { id: "nbfi", label: "Non-bank lenders" },
  { id: "failures", label: "Failure modes" },
  { id: "automation", label: "Scorecard Development Agent" },
] as const;

const architecture = ["Business objective","Population","Outcome definition","Observation + performance windows","Data architecture","Binning","WoE / IV","Variable selection","Logistic model","Ranking validation","Score scaling","Calibration","Cut-off strategy","Production","Monitoring"];

export default function CreditScorecardDevelopmentArticle() {
  return <>
    <p className="resource-lead"><em>A credit scorecard is not a regression model with points attached. It is a governed decision architecture that transforms imperfect borrower data into a stable, interpretable and operational risk ranking.</em></p>
    <KeyObservation><p><strong>The difficult question is not “Which algorithm?” It is “What architecture allows historical data to become a defensible lending signal?”</strong></p></KeyObservation>

    <section id="architecture">
      <h2>A scorecard ranks risk; calibration and strategy give that ranking decision meaning</h2>
      <Formula label="Applicant score"><span>Score<sub>i</sub> = f(X<sub>i</sub>)</span></Formula>
      <Formula label="Higher score represents lower risk in this article"><span>Score<sub>a</sub> &gt; Score<sub>b</sub> ⇒ Risk<sub>a</sub> &lt; Risk<sub>b</sub></span></Formula>
      <ResourceTable caption="Three layers that must remain distinct" headers={["Layer","Question","Output"]} rows={[
        ["Ranking","Who is relatively riskier?","Ordered applicants or accounts"],
        ["Calibration","What absolute risk does the rank represent?","PD over a defined horizon"],
        ["Decision","What should the lender do?","Approve, review, decline, price, limit or terms"],
      ]}/>
      <p>A scorecard compresses governed information into a relative risk signal. It does not define risk appetite, price an offer or choose a cut-off by itself. A model can rank well while its PD mapping is wrong; a calibrated PD can still support different actions under different economics and constraints.</p>
      <ResourceFigure label="Entimema end-to-end credit scorecard development architecture." caption="Scorecard quality is accumulated across the full architecture, not created at the regression stage."><div className={styles.architecture}>{architecture.map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div></ResourceFigure>
    </section>

    <section id="population">
      <h2>Development starts before modelling</h2>
      <EntimemaFramework title="The pre-model architecture" description="A sophisticated estimator cannot repair the wrong population, time boundary or outcome." steps={["Business objective","Target population","Observation point","Performance window","Default definition","Sample construction","Feature architecture","Model"]}/>
      <h3>Define the population the scorecard is allowed to describe</h3>
      <Formula label="Development and production populations"><span>𝒫<sub>dev</sub> ↔ 𝒫<sub>prod</sub></span></Formula>
      <p>New-to-bank applicants, existing customers, personal loans, cards, SME borrowers and specific channels need not share one risk structure. Specify inclusion, exclusion, policy rejects, suspected fraud, incomplete applications, immature accounts and data availability. The model implicitly assumes sufficient similarity between the population that produced its relationships and the one on which it will operate.</p>
      <h3>Place every variable and outcome on a valid clock</h3>
      <Formula label="Observation and performance horizon"><span>T<sub>0</sub> = observation date; &nbsp; performance ∈ [T<sub>0</sub>, T<sub>0</sub>+h]</span></Formula>
      <p>A predictive feature must exist when the real decision is made. Collections status, later bureau updates, future restructures or retrospectively corrected income can create leakage if they cross T<sub>0</sub>. Entimema&apos;s <Link href="/resources/pd-model-observation-performance-windows">Observation and Performance Windows</Link> research develops eligibility, maturity and temporal leakage in depth.</p>
      <h3>The target is a governed definition, not a convenient database flag</h3>
      <Formula label="Binary modelling target"><span>Y<sub>i</sub> = 1 Bad / Default; &nbsp; Y<sub>i</sub> = 0 Good / Non-default</span></Formula>
      <p>Delinquency threshold, write-off, restructuring, cure, re-default, borrower-versus-facility level and performance maturity determine what the model learns. <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link> explains why changing the boundary changes the observed bad rate and potentially the ranking itself.</p>
      <p>Some observations are neither reliable Goods nor Bads. A three-state development architecture—<strong>D = &#123;Good, Bad, Indeterminate&#125;</strong>—can preserve ambiguity rather than inject label noise. Excluding indeterminates reduces sample size and changes population composition; forcing them into a class can distort coefficients and calibration. The choice requires sensitivity and documentation.</p>
    </section>

    <section id="data">
      <h2>Build data around economic meaning and production availability</h2>
      <div className={styles.taxonomy}>{[
        ["Applicant","Relationship age · employment · income · permitted household information"],
        ["Capacity","Obligations · debt burden · affordability · income stability"],
        ["Credit history","Delinquency · defaults · bureau depth · utilisation · account age"],
        ["Behaviour","Payments · balances · utilisation trajectory · cash-flow behaviour"],
        ["Product / relationship","Product · tenure · existing exposure · channel"],
      ].map(([a,b])=><article key={a}><strong>{a}</strong><p>{b}</p></article>)}</div>
      <p>Lineage, legal use, fairness, consent, refresh timing and production availability are part of variable quality. A powerful feature unavailable at decision time is not a deployable predictor.</p>
      <h3>Missing values can be information—or an operational accident</h3>
      <Formula label="Missingness indicator"><span>M<sub>j</sub> = I(X<sub>j</sub> is missing)</span></Formula>
      <p>Missingness may mean no credit history, new-to-credit status, applicant choice, unavailable fields, source-system differences or operational failure. A dedicated bin or indicator can preserve signal, but exploiting a temporary defect creates a fragile model when the process is repaired. Investigate the data-generating mechanism before treating absence as borrower risk.</p>
      <h3>Outliers need diagnosis, not automatic winsorisation</h3>
      <p>Distinguish genuine extreme borrower behaviour from impossible values, unit errors and migrations. Treatment should reflect <strong>data-generating process × model stability × business meaning</strong>. A capped affordability ratio may be sensible; silently clipping a systematic currency error is not.</p>
      <h3>Sampling changes what probability means</h3>
      <p>Use development, validation and out-of-time samples for different purposes. Stratification or bad oversampling may improve estimation efficiency, but then:</p>
      <Formula label="Oversampling changes class prevalence"><span>P<sub>sample</sub>(Y=1) ≠ P<sub>population</sub>(Y=1)</span></Formula>
      <p>Ranking can remain valid while raw fitted probabilities require prevalence correction or separate calibration. Repeated tuning on the validation sample turns it into another development sample; a genuinely untouched temporal test is more informative.</p>
    </section>

    <section id="binning">
      <h2>Binning trades predictive resolution for stability and interpretability</h2>
      <Formula label="Binning transformation"><span>X → B(X), &nbsp; B(X) ∈ &#123;b<sub>1</sub>,…,b<sub>k</sub>&#125;</span></Formula>
      <p>Fine classing creates granular partitions to inspect risk shape. Coarse classing combines adjacent or economically similar groups into stable bins. Minimum observations, minimum bads, monotonicity, neighbouring-bin similarity and business logic matter together. Too few bins erase information; too many manufacture unstable separation.</p>
      <h3>Weight of Evidence creates an interpretable log-odds-related representation</h3>
      <Formula label="Good-over-bad Weight of Evidence convention"><span>WoE<sub>j</sub> = ln(%Good<sub>j</sub> / %Bad<sub>j</sub>)</span></Formula>
      <p>Some implementations use the reverse sign. Either convention is valid if target coding, coefficients, score scaling and production remain consistent. WoE can handle continuous and categorical bins, make risk ordering visible and support logistic regression, but it is not automatically the optimal representation.</p>
      <h3>Original Debt-to-Income WoE example</h3>
      <p>The fictional development sample has 9,000 Goods and 1,000 Bads. Percentages are class-conditional; figures are rounded.</p>
      <ResourceTable caption="Synthetic Debt-to-Income binning and WoE calculation" headers={["DTI bin","Goods","Bads","% Goods","% Bads","WoE"]} rows={[
        ["<20%","2,500","70","27.78%","7.00%","1.378"],
        ["20–35%","2,700","150","30.00%","15.00%","0.693"],
        ["35–50%","2,100","250","23.33%","25.00%","−0.069"],
        ["50–65%","1,200","280","13.33%","28.00%","−0.742"],
        [">65%","500","250","5.56%","25.00%","−1.504"],
      ]}/>
      <p>WoE declines as DTI rises, producing a strong monotonic risk pattern under the Good/Bad convention. That pattern is plausible, not self-validating: affordability policy, income verification and application selection can partly create it.</p>
      <Formula label="Information Value"><span>IV = Σ<sub>j</sub> (%Good<sub>j</sub> − %Bad<sub>j</sub>) × WoE<sub>j</sub></span></Formula>
      <p>The illustrative DTI IV is approximately <strong>0.793</strong>. It signals strong univariate separation in this synthetic sample; it does not establish production suitability. High IV can arise from leakage, policy artefacts, small cells, excessive granularity or unstable periods. <strong>IV is not a complete variable-selection criterion.</strong></p>
    </section>

    <section id="selection">
      <h2>Select variables through evidence architecture, not one threshold</h2>
      <EntimemaFramework title="Variable screening architecture" description="Predictive separation is necessary but insufficient." steps={["Predictive signal","Stability","Availability","Business meaning","Redundancy","Governance","Production feasibility"]}/>
      <p>A variable should not enter merely because IV exceeds a threshold or a p-value is small. Compare WoE patterns and IV through time, channel and segment. Review missingness, lineage, overrides and plausible causal direction. Remove variables whose apparent power depends on a disappearing operational process.</p>
      <h3>Correlation can destabilise an otherwise interpretable model</h3>
      <p>Correlated WoE variables duplicate information, inflate uncertainty and can reverse coefficient signs. Correlation matrices, VIF where appropriate, variable-family clustering and expert selection help choose one operationally strong representative. Coefficient stability matters because the scorecard must survive population and sample variation.</p>
      <h3>Stepwise selection is a search procedure, not model governance</h3>
      <p>Forward, backward and stepwise routines can chase sample-specific p-values, especially among correlated candidates. Use them as diagnostics or challenger tools, not as automatic authors of the final specification. Bootstrap stability, temporal tests, business constraints and pre-defined selection logic provide stronger discipline.</p>
    </section>

    <section id="model">
      <h2>Logistic regression is one controlled translation from evidence to risk</h2>
      <Formula label="Logit link"><span>logit(P(Y=1|X)) = ln(P(Y=1|X) / (1−P(Y=1|X)))</span></Formula>
      <Formula label="WoE logistic model"><span>logit(PD<sub>i</sub>) = β<sub>0</sub> + Σ<sub>k</sub> β<sub>k</sub>WoE<sub>ik</sub></span></Formula>
      <p>Logistic regression offers additive contributions, established diagnostics, compact deployment and a natural path to points. Entimema&apos;s <Link href="/resources/logistic-regression-credit-risk-scorecards">Logistic Regression in Credit Risk Scorecards</Link> develops estimation and engineering in depth. These advantages do not prove universal superiority over machine learning.</p>
      <p>Unexpected coefficient signs can reveal multicollinearity, unstable bins, interaction, sampling noise, leakage or misspecification. Do not mechanically force signs; investigate the architecture that produced them.</p>
      <h3>Regularisation and interactions can strengthen a modern scorecard</h3>
      <Formula label="L1 and L2 penalties"><span>L1: λΣ|β<sub>j</sub>| &nbsp;&nbsp; L2: λΣβ<sub>j</sub><sup>2</sup></span></Formula>
      <p>Lasso can support sparse selection; ridge can stabilise correlated coefficients. A high utilisation rate may mean something different for a new borrower than a long-tenured customer, so an economically interpretable <strong>Utilisation × Tenure</strong> interaction may add value. Test such terms out of time and preserve a clear reason-code path.</p>
      <h3>Compare challenger models on incremental decision value</h3>
      <ResourceTable caption="Scorecard and machine-learning challenger considerations" headers={["Dimension","Traditional scorecard","ML challenger"]} rows={[
        ["Structure","Additive, binned and compact","Can learn richer non-linearity and interactions"],
        ["Explainability","Direct bin and point contributions","May require additional explanation architecture"],
        ["Operations","Simple deterministic implementation","Potentially greater infrastructure and monitoring cost"],
        ["Evaluation","Ranking, calibration, stability and use","Same tests plus complexity and explanation burden"],
      ]}/>
      <p>A marginal Gini improvement does not automatically justify materially greater implementation, governance or monitoring cost. The relevant test is incremental decision value under realistic constraints.</p>
    </section>

    <section id="validation">
      <h2>Validation asks whether the ranking is useful, stable and correctly implemented</h2>
      <Formula label="Gini from AUC"><span>Gini = 2AUC − 1</span></Formula>
      <Formula label="KS statistic"><span>KS = max<sub>s</sub> |F<sub>G</sub>(s) − F<sub>B</sub>(s)|</span></Formula>
      <p>ROC, AUC, Gini and KS measure separation or ranking. They do not tell whether PD estimates are calibrated, whether the variables are stable, or whether a cut-off creates value. A higher KS can belong to an economically inferior or operationally fragile model.</p>
      <EntimemaFramework title="Model validation architecture" description="No single final metric validates a scorecard." steps={["Conceptual soundness","Data validation","Discrimination","Calibration","Stability","Implementation verification","Outcome monitoring"]}/>
      <h3>Out-of-time evidence is essential</h3>
      <Formula label="Temporal validation"><span>Train: t<sub>0</sub>→t<sub>1</sub>; &nbsp; OOT: t<sub>2</sub>; &nbsp; t<sub>2</sub>&gt;t<sub>1</sub></span></Formula>
      <p>A random holdout tests repeatability inside a mixed historical regime. It cannot fully test acquisition, policy, macroeconomic or data-source change. A future-like out-of-time sample challenges whether bin shapes, coefficients, score distribution and ranking travel forward.</p>
      <Formula label="Population Stability Index"><span>PSI = Σ<sub>j</sub>(A<sub>j</sub>−E<sub>j</sub>)ln(A<sub>j</sub>/E<sub>j</sub>)</span></Formula>
      <p>PSI summarises distribution movement, not cause or model failure. Threshold folklore should not replace sample-size context, characteristic-level diagnosis, outcome evidence and decision impact. Predictive power today and reliability tomorrow are separate requirements.</p>
    </section>

    <section id="scaling">
      <h2>Score scaling converts log odds into an operational points system</h2>
      <p>Using Good:Bad odds so that higher odds mean lower risk, define:</p>
      <Formula label="Score scale"><span>Score = Offset + Factor × ln(Odds<sub>Good:Bad</sub>)</span></Formula>
      <Formula label="Points to Double the Odds"><span>Factor = PDO / ln(2)</span></Formula>
      <h3>Original scaling example: 600 points, 20:1 odds, 50 PDO</h3>
      <Formula label="Derived constants"><span>Factor = 50 / ln(2) = 72.135<br />Offset = 600 − 72.135ln(20) = 383.904</span></Formula>
      <ResourceTable caption="The score moves exactly 50 points when Good:Bad odds double or halve" headers={["Good:Bad odds","Score","Interpretation"]} rows={[
        ["10:1","550","Odds halved; risk worsened"],
        ["20:1","600","Base odds and base score"],
        ["40:1","650","Odds doubled; risk improved"],
      ]}/>
      <p>With a Bad:Good convention, the sign changes. The implementation must state its odds and WoE conventions explicitly.</p>
      <Formula label="Conceptual points contribution"><span>Points<sub>jk</sub> = −Factor × β<sub>j</sub>WoE<sub>jk</sub></span></Formula>
      <p>Variable-bin points make applicant scores decomposable. The intercept may be allocated across characteristics or held separately; either approach must reconcile exactly. Adverse contributions can support reason codes, but customer-facing explanations must be accurate, stable, understandable, legally appropriate and consistent with production policy—not an automatic dump of every statistical feature.</p>
    </section>

    <section id="decision">
      <h2>A score becomes useful only when it survives calibration and strategy</h2>
      <Formula label="Ranking to probability"><span>Score → PD</span></Formula>
      <p>Compare portfolio bad rate, calibration-in-the-large, calibration slope, curves and segments. Oversampling, changed mix and time can leave ranking intact while moving absolute risk. <Link href="/resources/pd-model-ranking-calibration">PD Ranking &amp; Calibration</Link> develops this distinction.</p>
      <ResourceFigure label="Scorecard-to-decision architecture." caption="The cut-off is a strategy choice built after discrimination, not a property of ranking performance."><div className={styles.decisionChain}>{["Scorecard","Calibration","Economics","Risk appetite","Cut-off","Decision"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
      <p><Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link> connects PD, expected loss, margin, policy and constraints. A score does not decide. It informs an institution that must decide which risks to accept and on what terms.</p>
      <h3>Historical approval also shapes the development sample</h3>
      <Formula label="Selective outcome observation"><span>P(X,Y | A=1) need not equal P(X,Y)</span></Formula>
      <p>Outcomes often exist mainly for historically accepted applicants. The dedicated <Link href="/resources/reject-inference-credit-risk-rejected-applicants">Reject Inference</Link> research examines selection, approval propensity, overlap, identifiability and why synthetic labels do not create ground truth.</p>
    </section>

    <section id="example">
      <h2>An original 180,000-application development architecture</h2>
      <p>Consider a fictional consumer lender with 24 months of originations, a 12-month performance window and an 8% observed accepted-sample bad rate. These values illustrate workflow, not a universal recipe.</p>
      <ResourceFigure label="Original scorecard-development funnel." caption="Every reduction should have a documented reason; fewer variables are not automatically better unless signal, stability and feasibility improve."><div className={styles.funnel}>{[
        ["180,000","eligible applications"],["120","candidate variables"],["74","pass lineage + quality"],["31","stable after classing"],["18","shortlisted after WoE / IV"],["9","final predictors"],
      ].map(([n,t])=><span key={t}><strong>{n}</strong><small>{t}</small></span>)}</div></ResourceFigure>
      <p>The team freezes population and target rules, removes leakage and unavailable fields, fine-classes candidate variables, coarsens bins using evidence and business meaning, compares temporal WoE and IV, reviews redundancy, estimates logistic and regularised challengers, validates out of time, scales the selected model, calibrates to the intended population, and simulates cut-offs under portfolio economics.</p>
      <Formula label="Illustrative workflow"><span>120 variables → quality filters → fine/coarse classing → WoE/IV → redundancy → logistic model → validation → scaling → calibration → cut-off simulation</span></Formula>
      <DecisionImplication>The model-development report should preserve excluded populations, transformation versions, rejected variables, challenger results and sensitivity—not only the winning coefficient table.</DecisionImplication>
    </section>

    <section id="production">
      <h2>Production must reproduce development logic exactly</h2>
      <Formula label="Implementation reconciliation"><span>Score<sub>development</sub> = Score<sub>production</sub> within governed tolerance</span></Formula>
      <p>Different missing-value treatment, boundary inclusivity, reversed WoE sign, stale categories, unit mismatches, wrong coefficients or stale bureau fields can invalidate a sound model. Reconcile representative records and edge cases at total-score and characteristic-point level before launch.</p>
      <h3>Model monitoring and strategy monitoring are connected, not interchangeable</h3>
      <ResourceTable caption="Post-deployment control architecture" headers={["Model monitoring","Strategy monitoring"]} rows={[
        ["Data integrity and characteristic stability","Approval, decline, review and override rates"],
        ["Score distribution and discrimination","Cut-off population and marginal bands"],
        ["Calibration and realised bad rate","Expected loss, economics and risk appetite"],
        ["Bin and coefficient behaviour","Vintage and channel consequences"],
      ]}/>
      <p><Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> connects inputs, ranking, calibration, outcomes and use. Macroeconomic change, mix, channel, policy, data sources, borrower behaviour and product design can deteriorate a model without any coding defect.</p>
      <p><strong>Recalibration</strong> is appropriate when ranking remains useful but the absolute PD mapping shifts. <strong>Redevelopment</strong> is needed when ranking relationships, feature architecture or target population change materially. Explainability is not a reason to retain a model that is no longer useful.</p>
    </section>

    <section id="nbfi">
      <h2>The architecture remains rigorous in fast-moving non-bank lending</h2>
      <p>Consumer finance, legally applicable short-term credit, point-of-sale lending, digital instalments and fintech portfolios can have shorter windows, higher default incidence, rapid turnover, frequent strategy changes, thinner files and stronger behavioural signals. Speed changes the evidence cadence, not the need for governed population, target, timing, validation and calibration.</p>
      <p>For these lenders, preserve strategy and data-source chronology, separate application and behavioural scorecards, monitor early vintages without confusing immaturity with good performance, and reassess cut-offs when acquisition or pricing changes. Rapid feedback is valuable only when it measures the same outcome on comparable populations.</p>
    </section>

    <section id="failures">
      <h2>Eighteen failure modes that weaken scorecard development</h2>
      <ResourceTable caption="How apparently competent scorecards fail" headers={["Failure mode","Mechanism"]} rows={[
        ["Algorithm chosen before population","The model solves an undefined business problem"],
        ["Post-decision leakage","Future information inflates historical performance"],
        ["Weak default definition","The target does not represent governed risk"],
        ["Indeterminates forced binary","Ambiguity becomes label noise"],
        ["Excessive binning","Sparse cells manufacture unstable separation"],
        ["Blind IV thresholds","Univariate power substitutes for full suitability"],
        ["Unstable high-IV variables","Temporary artefacts dominate the model"],
        ["Correlation ignored","Coefficients and reason codes become unstable"],
        ["Stepwise p-value chasing","Sample noise drives specification"],
        ["Only Gini / KS evaluated","Calibration, stability and use disappear"],
        ["Calibration ignored","Rank is mistaken for probability"],
        ["Random split without OOT","Temporal transport is never challenged"],
        ["Production transforms differ","The deployed score is a different model"],
        ["Rejected selection ignored","Accepted outcomes are assumed population-wide"],
        ["Score treated as decision","Economics, policy and appetite are omitted"],
        ["Strategy monitoring ignored","Decision consequences remain invisible"],
        ["Explainability protects obsolescence","A clear but ineffective model is retained"],
        ["Complexity adopted without value","Governance cost rises without decision improvement"],
      ]}/>
    </section>

    <section id="automation">
      <h2>A Credit Scorecard Development Agent can automate evidence work—not approve borrowers</h2>
      <p>A future agent could profile datasets, check population and target definitions, detect leakage risks, propose candidate binning, calculate WoE and IV, analyse temporal stability, identify redundant predictors, estimate logistic challengers, compare ranking metrics, perform out-of-time testing, produce score scaling, generate calibration diagnostics, simulate cut-offs and prepare development documentation.</p>
      <p>Its role is <strong>model-development automation + diagnostics + documentation + decision support</strong>. It should not independently approve borrowers. Human owners must govern target meaning, variable legality, risk appetite, model selection, exceptions and production use.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> practice connects scorecard development, redevelopment, validation, calibration, strategy and portfolio monitoring. <Link href="/services/decision-automation">Decision Automation</Link> connects an approved scorecard and policy to traceable production execution.</p>
      <EntimemaFramework title="The scorecard decision logic" description="A scorecard becomes valuable only when its statistical structure survives the journey into a real decision process." steps={["Define","Observe","Transform","Estimate","Validate","Scale","Calibrate","Decide","Monitor","Learn"]}/>
    </section>
  </>;
}
