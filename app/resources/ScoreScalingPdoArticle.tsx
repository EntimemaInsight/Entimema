import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./score-scaling-pdo.module.css";

export const scoreScalingPdoSections = [
  { id: "representation", label: "Risk needs a coordinate system" }, { id: "derivation", label: "Factor, Offset and PDO" },
  { id: "mapping", label: "Score-to-PD mapping" }, { id: "points", label: "Logistic coefficients to points" },
  { id: "borrower", label: "Borrower reconciliation" }, { id: "rounding", label: "Rounding and cut-offs" },
  { id: "continuity", label: "Calibration and continuity" }, { id: "production", label: "Production controls" },
  { id: "monitoring", label: "Monitoring and explanation" }, { id: "nbfi", label: "Non-bank lenders" },
  { id: "failures", label: "Failure modes" }, { id: "automation", label: "Implementation Agent" },
] as const;
const architecture = ["Logistic model","Log-odds","Good:Bad odds","Base score / odds / PDO","Scaled score","Variable points","Score-to-PD mapping","Cut-off","Production decision"];

export default function ScoreScalingPdoArticle(){return <>
  <p className="resource-lead"><em><strong>Credit score scaling converts model odds into operational points using Factor = PDO / ln(2) and Offset = Base Score − Factor × ln(Base Odds).</strong> PDO—points to double the odds—sets the distance between equivalent risk levels. The resulting scale preserves model ranking while creating stable scores, cut-offs and an auditable score-to-PD mapping.</em></p>
  <KeyObservation><p><strong>Scaling changes representation, not ranking.</strong> The score is a coordinate system placed on risk—not new predictive information.</p></KeyObservation>

  <section id="representation"><h2>From a statistical probability to an operational language</h2>
    <Formula label="Logistic model"><span>logit(PD<sub>i</sub>) = z<sub>i</sub> = β<sub>0</sub> + Σ<sub>j</sub>β<sub>j</sub>X<sub>ij</sub><br/>PD<sub>i</sub> = 1/(1+exp(−z<sub>i</sub>))</span></Formula>
    <p>A model may return PD=3.7% or logit(PD)=−3.26 while a decision system expects Score=642. The translation is not cosmetic: direction, odds convention, rounding and mapping determine whether development and production make the same decision.</p>
    <Formula label="Name the odds convention"><span>Odds<sub>bad</sub> = PD/(1−PD)<br/>Odds<sub>good:bad</sub> = (1−PD)/PD = 1/Odds<sub>bad</sub></span></Formula>
    <p>Both conventions are valid. Mixing them is catastrophic. In the traditional higher-score-is-lower-risk architecture, Score↑ implies PD↓. A higher-score-is-higher-risk system is also possible, but model, scale, documentation, cut-off and monitoring must all preserve the same direction.</p>
    <ResourceFigure label="Entimema score scaling architecture." caption="Scaling carries one model signal through an explicit operational coordinate system."><div className={styles.architecture}>{architecture.map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div></ResourceFigure>
  </section>

  <section id="derivation"><h2>PDO determines spacing; base score and odds anchor the scale</h2>
    <Formula label="Traditional Good:Bad scale"><span>Score = Offset + Factor × ln(Odds<sub>good:bad</sub>)</span></Formula>
    <p>If adding PDO points doubles Good:Bad odds, then <strong>Score(2O)−Score(O)=Factor·ln(2)=PDO</strong>. Therefore:</p>
    <Formula label="Points to Double the Odds"><span>Factor = PDO/ln(2)</span></Formula>
    <p>At chosen base score S<sub>0</sub> and base odds O<sub>0</sub>, S<sub>0</sub>=Offset+Factor·ln(O<sub>0</sub>), so:</p>
    <Formula label="Base anchor"><span>Offset = S<sub>0</sub> − Factor × ln(O<sub>0</sub>)</span></Formula>
    <h3>Original scale: 600 at 20:1 Good:Bad, PDO 50</h3>
    <Formula label="Numerical constants"><span>Factor = 50/ln(2) = 72.134752<br/>Offset = 600 − 72.134752ln(20) = 383.903595</span></Formula>
    <ResourceTable caption="PDO and probability verification" headers={["Score","Good:Bad odds","PD"]} rows={[["550","10:1","9.0909%"],["600","20:1","4.7619%"],["650","40:1","2.4390%"],["700","80:1","1.2346%"]]}/>
    <p>PDO=20 compresses the same odds change into fewer points; PDO=100 expands it. Neither changes discrimination. Choice of scale should follow continuity, interfaces, reporting and strategy usability—not a universal ideal.</p>
  </section>

  <section id="mapping"><h2>A score has no risk meaning without its inverse mapping</h2>
    <Formula label="Inverse scale"><span>ln(O)=(S−Offset)/Factor<br/>O=exp((S−Offset)/Factor)<br/>PD(S)=1/[1+exp((S−Offset)/Factor)]</span></Formula>
    <p>The same model can be represented on 0–1000, 300–850 or 1–999. If S<sub>2</sub>=a+bS<sub>1</sub> with b&gt;0, borrower ranking is preserved. Equal numbers from different models, products or bureaus do not imply equal risk.</p>
    <ResourceFigure label="One risk signal, several business abstractions." caption="Each layer must remain traceable to the calibrated probability beneath it."><div className={styles.scale}>{["PD","Good:Bad odds","Score","Risk grade"].map(x=><span key={x}>{x}</span>)}</div></ResourceFigure>
    <p>Grades and bands simplify reporting, pricing and strategy, but add discretisation. A common numerical scale across products is not automatically a common risk meaning.</p>
  </section>

  <section id="points"><h2>Logistic coefficients become an additive scorecard</h2>
    <p>Because ln(Odds<sub>good:bad</sub>)=−logit(PD), the central implementation identity is:</p>
    <Formula label="Model to score"><span>Score<sub>i</sub> = Offset − Factor(β<sub>0</sub> + Σ<sub>j</sub>β<sub>j</sub>X<sub>ij</sub>)</span></Formula>
    <Formula label="Variable and base points"><span>Points<sub>ij</sub> = −Factor·β<sub>j</sub>X<sub>ij</sub><br/>BaseContribution = Offset − Factor·β<sub>0</sub></span></Formula>
    <p>For a <Link href="/resources/weight-of-evidence-information-value-credit-scoring">WoE scorecard</Link>, X<sub>ij</sub>=WoE<sub>ij</sub>, so every governed bin receives points. The base contribution may remain central or be divided across n variables as BaseContribution/n. Distribution is an implementation convention, not a statistical necessity; changing conventions breaks reconciliation.</p>
    <ResourceTable caption="Original fictional points table—selected bins" headers={["Variable / bin","WoE","β","β×WoE","Points"]} rows={[
      ["DTI: ≤35%","+0.80","−0.65","−0.520","+37.51"],["DTI: 35–50%","+0.30","−0.65","−0.195","+14.07"],["DTI: >65%","−0.70","−0.65","+0.455","−32.82"],
      ["Utilisation: <30%","+0.70","−0.55","−0.385","+27.77"],["Utilisation: 60–80%","−0.40","−0.55","+0.220","−15.87"],["Utilisation: >80%","−0.85","−0.55","+0.468","−33.73"],
      ["History: clean","+0.65","−0.80","−0.520","+37.51"],["History: mild arrears","−0.20","−0.80","+0.160","−11.54"],["History: serious delinquency","−0.90","−0.80","+0.720","−51.94"],
      ["Tenure: <1 year","−0.55","−0.35","+0.193","−13.89"],["Tenure: 2–4 years","+0.10","−0.35","−0.035","+2.52"],["Tenure: 4+ years","+0.435","−0.35","−0.152","+10.98"],
    ]}/>
  </section>

  <section id="borrower"><h2>One borrower reconciles from raw inputs to a score of 612</h2>
    <p>Use β<sub>0</sub>=−3.20 and the coefficients above. The base contribution is 383.903595−72.134752(−3.20)=<strong>614.7348</strong>.</p>
    <ResourceTable caption="Spreadsheet-style implementation reconciliation" headers={["Variable","Raw value","Bin","WoE","β","β×WoE","Raw points","Rounded"]} rows={[
      ["DTI","44%","35–50%","+0.300","−0.65","−0.1950","+14.0663","+14"],["Utilisation","72%","60–80%","−0.400","−0.55","+0.2200","−15.8696","−16"],
      ["Credit history","Mild arrears","Mild arrears","−0.200","−0.80","+0.1600","−11.5416","−12"],["Relationship tenure","5.2 years","4+ years","+0.435","−0.35","−0.1523","+10.9815","+11"],
    ]}/>
    <Formula label="Full-precision chain"><span>z = −3.20−0.195+0.220+0.160−0.15225 = −3.16725<br/>PD = 1/(1+e<sup>3.16725</sup>) = 4.0417%<br/>Good:Bad odds = e<sup>3.16725</sup> = 23.7421:1<br/>Score = 383.903595 + 72.134752ln(23.7421) = 612.3724</span></Formula>
    <p>Raw variable points sum to −2.3624; adding base 614.7348 produces 612.3724 subject to displayed precision. Rounded components sum to −3; rounded base 615 gives the operational integer score <strong>612</strong>. High utilisation and weak history are the largest adverse drivers; long tenure contributes positively.</p>
  </section>

  <section id="rounding"><h2>Rounding becomes decision architecture near a hard threshold</h2>
    <p>Retaining 37.46, rounding to 37, rounding to nearest integer and truncating are different rules. Rounding each component can differ from rounding the continuous total.</p>
    <ResourceTable caption="Original boundary example" headers={["Component","Continuous","Individually rounded"]} rows={[["Base","500.49","500"],["A","40.49","40"],["B","39.49","39"],["C","39.93","40"],["Total","620.40","619"]]}/>
    <p>At an approval cut-off of 620, rounding the final continuous score approves; summing rounded parts declines or refers. The institution must document the stage, method and tolerance.</p>
    <Formula label="Cut-off equivalence on this scale"><span>Score ≥ 620 ⇔ PD ≤ 1/[1+exp((620−383.903595)/72.134752)] = 3.6509%</span></Formula>
    <p>Scaling represents risk; decision strategy chooses the boundary. The correct sequence is <strong>Model → Calibration → Scaling → Economics → Cut-Off → Decision</strong>. See <Link href="/resources/credit-risk-cut-off-strategy">Credit Cut-Off Strategy</Link>.</p>
  </section>

  <section id="continuity"><h2>Calibration and redevelopment can break familiar score meanings</h2>
    <p>If ranking survives but calibration changes, an institution can preserve score and update its score-to-PD lookup, or rescale the model. Neither is automatically superior. Governance must identify which artefact changed and how legacy rules remain valid.</p>
    <p>Score<sub>old</sub>=650 and Score<sub>new</sub>=650 do not guarantee equal PD. New-to-old alignment can use PD-equivalent, percentile or odds-equivalent mapping; naïvely matching numeric ranges disguises migration. <Link href="/resources/pd-model-ranking-calibration">PD Ranking &amp; Calibration</Link> separates order from absolute risk.</p>
    <p>Every result should retain model version, scale version, base score, base odds, PDO, calibration version and effective date. Caps and floors may fit interfaces but can conceal extreme-risk differences.</p>
  </section>

  <section id="production"><h2>Production validity is demonstrated record by record</h2>
    <Formula label="Reconciliation standard"><span>Score<sub>development</sub> = Score<sub>production</sub> within documented tolerance</span></Formula>
    <ResourceTable caption="Minimum implementation controls" headers={["Control","Required evidence"]} rows={[["Odds and direction","Named Good:Bad/Bad:Good convention; monotonicity test"],["Transformations","Exact bin inclusivity, WoE version and categorical mappings"],["Boundaries","For every b, test b−ε, b and b+ε through bin, points and final score"],["Missing / unseen","Dedicated missing points; governed Other, fallback or exception"],["Units","Annual/monthly, currency, percentage/decimal and timing contracts"],["Arithmetic","Intercept architecture, Factor, Offset, precision and rounding stage"],["Test population","Minimum/maximum risk, every bin, cut-off neighbourhood and exceptions"]]}/>
    <p>Development income of 36,000 annual is not production income of 3,000 monthly merely because the borrower is economically identical. A mathematically correct scale cannot rescue a wrong input contract. Never let missing values silently become zero or an unseen category acquire arbitrary points.</p>
    <DecisionImplication>Version and test the whole Raw Input → Bin → WoE → Points → Score → PD → Decision chain. A points table alone is not a deployable scorecard.</DecisionImplication>
  </section>

  <section id="monitoring"><h2>Monitor the score as an operating system, not a static number</h2>
    <p>Track mean, median, distribution, bands, approval by score, observed bad rate by score, score-to-PD mapping, overrides and population drift. For behavioural scores, S<sub>t</sub>→S<sub>t+1</sub> migration may reveal deterioration before default. Population concentration can compress operational differentiation even when scale mathematics is unchanged.</p>
    <p><Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> connects these signals to intervention. Low point contributions can support internal explanation, but customer-facing reason codes require governed business and legal mapping. Score≠FinalDecision: affordability, fraud, policy and manual review remain separate override layers.</p>
  </section>

  <section id="nbfi"><h2>Transparent scales help non-bank lenders—but tradition is not the objective</h2>
    <p>Fintech, instalment and consumer-finance lenders often benefit from understandable bands, lightweight systems and fast reconciliation between modelling and strategy teams. Yet a modern engine may consume score, calibrated PD, risk grade or expected loss. If direct PD decisioning is clearer, unnecessary legacy-style scaling adds governance surface without decision value.</p>
    <p>The representation should serve the decision architecture. A score remains useful for familiarity, monotonic simplicity, banding, interfaces and explanation—not because 612 is intrinsically more informative than its governed 4.0417% PD.</p>
  </section>

  <section id="failures"><h2>Eighteen ways a mathematically valid model becomes a wrong score</h2>
    <ResourceTable caption="Failure mechanisms" headers={["Failure","Mechanism"]} rows={[["1. Odds convention mixed","Reciprocal is treated as the original; score direction flips"],["2. Direction reversed","Approve rule selects higher risk"],["3. PDO formula wrong","Numerical spacing no longer doubles odds"],["4. Base odds wrong","Every score receives the wrong risk anchor"],["5. Intercept mismatch","Central and distributed bases are double-counted or omitted"],["6. Different rounding","Development and engine diverge"],["7. Component rounding","Borderline records cross the cut-off"],["8. Wrong boundaries","Borrower enters a different bin"],["9. Wrong WoE version","Points no longer represent fitted coefficients"],["10. Missing mismatch","Designed missing risk is silently replaced"],["11. Unseen category","Arbitrary points create uncontrolled decisions"],["12. Unit mismatch","Correct formula processes the wrong magnitude"],["13. Equal scores equated","Different models/products are assigned false common meaning"],["14. Score treated as PD","Absolute risk is inferred without the scale mapping"],["15. Score treated as decision","Economics, policy and affordability disappear"],["16. Recalibration ignored","Old mapping misstates current PD"],["17. Legacy cut-off preserved","Redeveloped model changes the boundary’s risk meaning"],["18. Distribution unmonitored","Compression, drift and strategy erosion remain invisible"]]}/>
  </section>

  <section id="automation"><h2>A Scorecard Implementation &amp; Reconciliation Agent can make control recurring</h2>
    <EntimemaFramework title="Scorecard Implementation & Reconciliation Agent" description="Implementation control + reconciliation + model-governance support—not borrower approval." steps={["Read coefficients and WoE specification","Validate odds convention","Calculate Factor and Offset","Generate points tables","Reconcile score and PD","Test boundaries and rounding","Challenge missing and unseen handling","Produce validation evidence"]}/>
    <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> work connects scorecard development, scaling, calibration, implementation validation and monitoring. <Link href="/services/decision-automation">Decision Automation</Link> connects that governed risk representation to controlled production decision architecture.</p>
    <p>For the upstream model mechanics, read <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link>, <Link href="/resources/weight-of-evidence-information-value-credit-scoring">Weight of Evidence &amp; Information Value</Link> and <Link href="/resources/logistic-regression-credit-risk-production-scorecard">Logistic Regression for Credit Risk</Link>.</p>
  </section>
</>}
