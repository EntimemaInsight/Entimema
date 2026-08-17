import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./reject-inference.module.css";

export const rejectInferenceSections = [
  { id: "selection", label: "Selective observation" },
  { id: "missingness", label: "Missingness and identifiability" },
  { id: "overlap", label: "Approval propensity and overlap" },
  { id: "example", label: "120,000-applicant example" },
  { id: "methods", label: "Inference method families" },
  { id: "circularity", label: "Circularity and validation" },
  { id: "sensitivity", label: "Sensitivity and decision impact" },
  { id: "strategy", label: "Feedback, exploration and NBFIs" },
  { id: "workflow", label: "Decision framework and workflow" },
  { id: "failures", label: "Failure modes" },
  { id: "automation", label: "Model Development & Strategy Agent" },
] as const;

const applicantRows = [
  ["720+", "15,000", "96%", "14,400", "1.0%", "4%", "Strong"],
  ["680–719", "21,000", "86%", "18,060", "1.9%", "14%", "Strong"],
  ["640–679", "25,000", "51%", "12,750", "3.8%", "49%", "Moderate"],
  ["600–639", "27,000", "9%", "2,430", "7.6%", "91%", "Weak"],
  ["560–599", "19,000", "1.5%", "285", "11.2%", "98.5%", "Very weak"],
  ["<560", "13,000", "0.6%", "78", "Highly uncertain", "99.4%", "Minimal"],
];

export default function RejectInferenceArticle() {
  return <>
    <p className="resource-lead"><em>Reject inference is not primarily a technique for inventing outcomes for rejected applicants. It is a problem of learning under selective observation.</em></p>
    <KeyObservation><p><strong>The first question is not “Which algorithm?” It is “What is identifiable from the data we actually have?”</strong></p></KeyObservation>

    <section id="selection">
      <h2>The lender must learn about 100,000 applicants from the 40,000 it chose to observe</h2>
      <p>Suppose a lender receives 100,000 applications. Historical strategy approves 40,000 and rejects 60,000. Repayment becomes observable for booked borrowers; for most rejects it never does. Yet the next scorecard and <Link href="/resources/credit-risk-cut-off-strategy">credit cut-off strategy</Link> must make decisions across the next full applicant population. That is a fundamental information problem, not a routine label-completion exercise.</p>
      <Formula label="Approval and outcome indicators"><span>A<sub>i</sub> = 1 if approved; A<sub>i</sub> = 0 if rejected<br />Y<sub>i</sub> = 1 if default; Y<sub>i</sub> = 0 otherwise</span></Formula>
      <Formula label="Selective observation"><span>Y<sub>i</sub> observed when A<sub>i</sub> = 1; generally unobserved when A<sub>i</sub> = 0</span></Formula>
      <p>Development data therefore describe <strong>P(X,Y | A=1)</strong>, while the intended model may need to describe <strong>P(X,Y)</strong>. The two distributions coincide only under restrictive conditions. Approval changes the distribution of scores, income, affordability, channel, documentation, policy flags and latent risk that reaches the outcome window.</p>
      <ResourceFigure label="Historical lending strategy creates the observed model-development population." caption="The previous decision strategy becomes embedded in the next model's training data.">
        <div className={styles.chain}>{["Applicant population","Historical policy / score / rules","Accepted population","Observed outcomes","Future model"].map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div>
      </ResourceFigure>
      <p>The development dataset is not merely “history”. It is partly an artefact of historical decisions. When the resulting model drives the next policy, selection becomes a feedback loop.</p>
    </section>

    <section id="missingness">
      <h2>Missingness determines which claims are defensible</h2>
      <ResourceTable caption="Missing-outcome mechanisms in rejected-applicant modelling" headers={["Mechanism","Meaning","Credit-risk implication"]} rows={[
        ["MCAR","Outcome observation is unrelated to observed or unobserved information","Rarely credible: lending decisions are deliberately selective"],
        ["MAR conditional on X","Once recorded variables are known, approval contains no further information about Y","Can support adjustment if X reconstructs selection sufficiently and overlap holds"],
        ["MNAR","Selection still depends on unrecorded information or latent outcome risk","Observed accepts alone cannot identify reject outcomes without stronger assumptions or evidence"],
      ]}/>
      <Formula label="The practical missingness question"><span>Is P(A=1 | X,Y) adequately represented by P(A=1 | X)?</span></Formula>
      <p>If approval used variables absent from the modelling extract—manual judgement, documents, fraud signals, affordability details, policy exceptions or an earlier score—conditioning on available X does not reconstruct the selection mechanism. Even rich data do not prove missing-at-random. They make the assumption more or less plausible.</p>
      <h3>Approval is not repayment performance</h3>
      <Formula label="A decision is not an outcome"><span>Rejected ⇏ Bad &nbsp;&nbsp; and &nbsp;&nbsp; Approved ⇏ Good</span></Formula>
      <p>A customer may be rejected because of a conservative cut-off, affordability, eligibility, missing documentation, suspected fraud, operational capacity or manual underwriting. Approval merely records what a strategy did. Default records what happened after credit was extended under particular terms. Treating all rejects as bad confuses a policy label with an outcome label.</p>
      <DecisionImplication>Preserve historical score versions, rules, overrides, rejection reasons and data availability at decision time. Without them, a lender may be unable to distinguish risk selection from policy, fraud, affordability or operational selection.</DecisionImplication>
    </section>

    <section id="overlap">
      <h2>Approval propensity reveals where accepted outcomes can—and cannot—carry evidence</h2>
      <Formula label="Approval propensity"><span>e(X<sub>i</sub>) = P(A<sub>i</sub>=1 | X<sub>i</sub>)</span></Formula>
      <p>Applicants with e(X) near one are well represented among accepts. Applicants with e(X) near zero contribute little or no booked-loan evidence. Common support—also called positivity or overlap—asks whether accepted and rejected applicants coexist at comparable observed X.</p>
      <Formula label="Weak support"><span>P(A=1 | X=x) ≈ 0 ⇒ outcome estimation at x is assumption-dominated</span></Formula>
      <div className={styles.support} aria-label="Conceptual overlap regions"><article><span>SUPPORTED</span><strong>Accepts and rejects coexist</strong><p>Adjustment may be estimable under explicit conditional assumptions.</p></article><article><span>THIN SUPPORT</span><strong>Few comparable accepts</strong><p>Variance, model dependence and sensitivity rise.</p></article><article><span>UNSUPPORTED</span><strong>Policy observed almost nobody</strong><p>Extrapolation cannot create empirical information.</p></article></div>
      <KeyObservation><p><strong>No statistical technique can recover information that the historical policy never allowed the portfolio to observe without introducing additional assumptions.</strong></p></KeyObservation>
      <p>This is why accepted-only modelling may remain useful inside the historical acceptance region yet fail when a lender opens a new channel, changes population, or lowers an approximate score cut-off from 620 to 580. The decisive question is: <strong>where does reliable evidence about applicants scoring 580–619 come from?</strong></p>
    </section>

    <section id="example">
      <h2>An original 120,000-applicant selection diagnostic</h2>
      <p>This fictional portfolio contains 48,003 observed accepted accounts and 71,997 rejects. Values are synthetic and illustrate support, not a recommended score policy.</p>
      <ResourceTable caption="Synthetic applicant distribution by score band" headers={["Score band","Applications","Approval rate","Observed accepts","Bad rate among accepts","Reject share","Empirical support"]} rows={applicantRows}/>
      <p>The top bands offer abundant outcome evidence, but mainly about historically acceptable risks. Below 640, accepts become sparse. The 11.2% accepted bad rate in 560–599 is an estimate for just 285 unusually selected booked cases—not proof of the rejected majority&apos;s bad rate. Below 560, reporting a precise population rate would conceal the absence of support.</p>
      <p>A model can still calculate a prediction there. The calculation&apos;s existence does not make the prediction identified, calibrated or decision-safe. A lender considering expansion should show the support profile beside every simulated approval, loss and value result.</p>
    </section>

    <section id="methods">
      <h2>Reject-inference methods trade different assumptions—not uncertainty for truth</h2>
      <ResourceTable caption="Main reject-inference method families" headers={["Method","What it does","Primary weakness"]} rows={[
        ["Hard classification","Accepted-only model labels each reject good or bad","Circular and falsely deterministic"],
        ["Parceling","Allocates inferred goods and bads within bands using assumed deterioration","Result can be driven by the multiplier"],
        ["Augmentation / reweighting","Weights accepts by inverse approval propensity","Requires conditional selection and overlap; unstable near zero"],
        ["Fuzzy augmentation","Adds probabilistic rather than hard synthetic outcomes","Still inherits model and missingness assumptions"],
        ["Extrapolation","Extends accepted outcome relationships into rejected regions","Unsupported regions are highly model-dependent"],
        ["External / bureau performance","Uses later performance elsewhere where lawful and available","Proxy outcome may differ from performance on the lender's loan and terms"],
        ["Controlled exploration","Approves a governed sample near the boundary to create evidence","Consumes risk appetite and requires customer, capital and regulatory control"],
      ]}/>
      <h3>Parceling makes its assumption visible</h3>
      <Formula label="Illustrative parceling scenario"><span>BR<sub>R</sub> = λBR<sub>A</sub>; &nbsp; BR<sub>A</sub>=6%; &nbsp; λ=1.5 ⇒ BR<sub>R</sub>=9%</span></Formula>
      <p>The multiplier λ is not learned from missing reject outcomes. It is a scenario assumption. A credible analysis compares plausible values, documents their basis and carries each into calibration and cut-off economics.</p>
      <h3>Reweighting cannot solve a lack of support</h3>
      <Formula label="Inverse probability weight"><span>w<sub>i</sub> = 1 / e(X<sub>i</sub>)</span></Formula>
      <Formula label="Instability at the boundary"><span>e(X<sub>i</sub>) → 0 ⇒ w<sub>i</sub> → ∞</span></Formula>
      <p>Large weights let a handful of accepts represent many unlike applicants, increasing variance and sensitivity to propensity misspecification. Trimming or stabilising weights can improve numerical behaviour but changes the target estimand. Report the weight distribution, effective sample size, trimmed population and unsupported regions—not merely a fitted model.</p>
    </section>

    <section id="circularity">
      <h2>Synthetic labels often return the model&apos;s own beliefs</h2>
      <ResourceFigure label="Circular reject-inference architecture." caption="Retraining on labels generated by the accepted-only model may add less information than the larger row count suggests."><div className={styles.loop}>{["Accepts","Accepted-only model","Predict rejects","Synthetic outcomes","Retrain"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
      <p>If an accepted-only model predicts rejects and those predictions become training labels, the enlarged dataset is not enlarged ground truth. Improved development AUC, Gini or fit may mostly demonstrate consistency with the original model. It does not prove improved knowledge of rejected applicants.</p>
      <h3>Validation is necessarily asymmetric</h3>
      <KeyObservation><p><strong>You cannot validate inferred labels against labels that remain permanently unobserved.</strong></p></KeyObservation>
      <p>Useful evidence can come from out-of-time accepts, policy changes that later admitted marginal bands, external performance, controlled exploration samples and simulations. Each answers a narrower question. Accepted-only out-of-time validation tests transport within observed policy; it does not directly validate the reject labels. Validation must therefore challenge robustness of assumptions as well as observable performance.</p>
    </section>

    <section id="sensitivity">
      <h2>Make uncertainty decision-relevant through sensitivity analysis</h2>
      <Formula label="Scenario family"><span>θ ∈ &#123;θ<sub>1</sub>, θ<sub>2</sub>, …, θ<sub>k</sub>&#125; &nbsp; ⇒ &nbsp; M(θ)</span></Formula>
      <div className={styles.frameworkFix}><EntimemaFramework title="Entimema sensitivity architecture" description="Vary assumptions, then trace their consequences through the lending decision—not model metrics alone." steps={["Inference assumption","Alternative model","Ranking","Calibration / PD","Expected loss","Cut-off economics","Approval boundary","Governance conclusion"]}/></div>
      <p>Vary parceling deterioration, propensity specification, weight trimming and extrapolation form. Compare not only AUC but score ordering, calibrated PD, approval rate, expected loss, expected value and marginal approval bands. A method can alter population bad-rate calibration without changing rank; alternatively, synthetic labels can change rank with little observable support.</p>
      <Formula label="Propagation into lending economics"><span>Reject inference → PD → EL → Pricing → Cut-off → Approval</span></Formula>
      <p>If three defensible approaches create effectively the same strategy, methodological differences may have limited economic importance. If small assumption changes move the cut-off sharply, that instability is itself a governance result. A point estimate must not hide it.</p>
    </section>

    <section id="strategy">
      <h2>Credit strategy is an endogenous learning system</h2>
      <ResourceFigure label="Credit decision strategy feedback loop." caption="Strategy controls which future outcomes become observable, so every policy is also an information policy."><div className={styles.loop}>{["Historical strategy","Selection","Observed data","Model","New strategy","New selection","New data"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
      <p><strong>Exploitation</strong> approves applicants currently believed to create value. <strong>Exploration</strong> collects information about uncertain populations. Lending cannot behave like unrestricted online experimentation: any marginal approval programme must respect affordability, regulation, fair customer treatment, capital, expected economics, risk appetite and human governance. But a policy that never explores outside historical boundaries can preserve uncertainty indefinitely.</p>
      <h3>Why consumer finance, fintech and non-bank lenders should care</h3>
      <p>Selection risk becomes especially material when policies change frequently, channels open rapidly, scorecards evolve, applicant mix shifts, thin-file borrowers matter or risk appetite expands. Fast feedback can help, but short cycles do not remove selective observation. Operational teams need a simple discipline: preserve decision lineage, map overlap before expansion, test bounded scenarios, and monitor newly booked marginal vintages separately.</p>
      <h3>When reject inference is not the right intervention</h3>
      <p>Do not add inference by default when future and historical acceptance regions are similar, overlap is effectively absent, data quality or rejection reasons are poor, external evidence contradicts the inferred pattern, or complexity does not change a decision. Sometimes the correct conclusion is: <strong>we do not know enough about this population.</strong> That is more defensible than false precision.</p>
    </section>

    <section id="workflow">
      <h2>The Entimema reject-inference decision framework</h2>
      <div className={styles.frameworkFix}><EntimemaFramework title="From target population to decision impact" description="Method choice follows diagnosis of selection, support and assumptions." steps={["Target population","Historical selection mechanism","Observed / missing outcomes","Overlap diagnosis","Assumption set","Inference method","Sensitivity analysis","Validation evidence","Decision impact"]}/></div>
      <h3>Operational evidence required</h3>
      <ResourceTable caption="Minimum practical data architecture" headers={["Data layer","Required evidence"]} rows={[
        ["Application","Timestamped applicant variables exactly as available at decision time"],
        ["Decision","Approve, reject, review, override, offer and final booked status"],
        ["Policy lineage","Scorecard version, cut-off, rule versions, manual route and channel"],
        ["Reason","Structured rejection, fraud, affordability, eligibility and documentation reasons"],
        ["Outcome","Governed default definition, performance window, exposure and censoring"],
        ["External evidence","Lawful bureau/proxy outcomes with provenance and outcome differences"],
      ]}/>
      <Formula label="Operational workflow"><span>Application history → Decision + reason → Score / PD → Performance → Selection + overlap → Inference scenarios → Model comparison → Strategy simulation → Governance</span></Formula>
      <p>This connects upstream to <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link> and <Link href="/resources/pd-model-ranking-calibration">PD Ranking &amp; Calibration</Link>, then downstream to <Link href="/resources/credit-risk-cut-off-strategy">Cut-Off Strategy</Link>, <Link href="/services/decision-automation">Decision Automation</Link>, <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> and <Link href="/resources/credit-vintage-analysis">portfolio outcomes by vintage</Link>.</p>
    </section>

    <section id="failures">
      <h2>Fifteen failure modes that create false confidence</h2>
      <ResourceTable caption="Reject-inference failure mechanisms" headers={["Failure mode","Why it fails"]} rows={[
        ["All rejects treated as bad","Policy decisions are substituted for repayment outcomes"],
        ["Missingness assumed random","Deliberate underwriting selection is ignored"],
        ["Historical policy ignored","The mechanism producing the sample is omitted"],
        ["Rejection reasons ignored","Risk, fraud, affordability and eligibility selection are mixed"],
        ["Extrapolation beyond support","Predictions are mistaken for empirical evidence"],
        ["Extreme propensity weights","A few accepts dominate estimates and variance"],
        ["Arbitrary parceling multiplier","An assumption becomes a concealed result"],
        ["Circular synthetic labels","The original model's beliefs are recycled as truth"],
        ["Inferred labels evaluated as observed","Internal consistency masquerades as validation"],
        ["Ranking and calibration mixed","A change in PD level is misreported as better ordering"],
        ["Strategy change ignored","The target population differs from the historical one"],
        ["Population drift ignored","Old conditional relationships are transported unchallenged"],
        ["Complexity treated as correctness","Technical machinery substitutes for identification"],
        ["Metrics optimised without decisions","No approval, loss or value consequence is demonstrated"],
        ["Point estimates hide uncertainty","Governance never sees assumption sensitivity"],
      ]}/>
    </section>

    <section id="automation">
      <h2>A Credit Model Development &amp; Strategy Agent should expose uncertainty—not invent borrower outcomes</h2>
      <p>A future agent could reconstruct historical acceptance policy, compare accepted and rejected populations, estimate approval propensity, diagnose common support, identify unsupported regions, run alternative inference scenarios, compare ranking and calibration, simulate cut-off implications and prepare sensitivity evidence for human review.</p>
      <p>Its role is <strong>research automation + scenario analysis + methodological diagnostics + decision support</strong>. It should not invent borrower outcomes or autonomously approve or reject applicants. Deterministic calculations, versioned assumptions, evidence provenance, risk authority and human judgement must remain explicit.</p>
      <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> practice connects development-sample design, model calibration and strategy. Where a governed strategy is ready for production, <Link href="/services/decision-automation">Decision Automation</Link> can make its execution traceable without pretending that automation resolves missing evidence.</p>
      <KeyObservation><p><strong>Reject inference is most credible when it narrows a decision problem, makes assumptions visible and preserves the boundary between evidence and conjecture.</strong></p></KeyObservation>
    </section>
  </>;
}
