import Link from "next/link";
import { EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./model-calibration-drift.module.css";

export const modelCalibrationDriftSections=[{id:"separate",label:"Ranking versus calibration"},{id:"diagnostics",label:"O/E, intercept and slope"},{id:"portfolio",label:"250,000-account example"},{id:"population",label:"Population versus calibration drift"},{id:"segments",label:"Segments, vintages and maturity"},{id:"methods",label:"Recalibration methods"},{id:"decision",label:"Recalibrate or redevelop"},{id:"strategy",label:"Score and cut-off consequences"},{id:"case",label:"Quarterly case study"},{id:"workflow",label:"Operational workflow"},{id:"nbfi",label:"Non-bank and IFRS 9"},{id:"failures",label:"Failure modes"},{id:"automation",label:"Calibration Drift Agent"}] as const;
const architecture=["Predicted PD","Mature outcomes","O/E","Calibration intercept","Calibration slope","Segment / vintage","PSI context","Ranking stability","Materiality","Recalibrate / redevelop / monitor"];

export default function ModelCalibrationDriftArticle(){return <>
 <p className="resource-lead"><em>A PD model can remain perfectly useful for ranking borrowers while becoming materially wrong about the absolute level of risk. Calibration drift appears when ordering survives but probabilities stop matching reality.</em></p>
 <KeyObservation><p><strong>“Is the model still good?” is two questions:</strong> does it still order risk, and does it still quantify risk correctly?</p></KeyObservation>

 <section id="separate"><h2>Discrimination and calibration are different model objects</h2>
  <p>Ranking asks whether PD<sub>a</sub>&gt;PD<sub>b</sub> corresponds probabilistically to Risk<sub>a</sub>&gt;Risk<sub>b</sub>. Calibration asks whether borrowers assigned p default at approximately p over the governed horizon and population.</p>
  <ResourceTable caption="Perfect ordering, materially wrong level" headers={["Risk band","Predicted PD","Observed default"]} rows={[["A","1%","2%"],["B","2%","4%"],["C","4%","8%"],["D","8%","16%"]]}/>
  <p>Every band remains correctly ordered, so AUC/Gini can remain strong. Yet absolute risk is approximately doubled. A ranking metric cannot detect that error because monotonic probability transformations preserve ordering.</p>
  <ResourceFigure label="Level drift and shape drift." caption="The first can preserve ordering; the second challenges differentiation itself."><div className={styles.comparison}><div><small>Intercept-type drift</small><strong>Broad level shift</strong><p>All bands move up or down while relative shape remains similar.</p></div><div><small>Slope-type drift</small><strong>Spread changes</strong><p>Risk separation becomes too steep, too flat or segment-dependent.</p></div></div></ResourceFigure>
 </section>

 <section id="diagnostics"><h2>O/E finds level error; intercept and slope diagnose its form</h2>
  <Formula label="Calibration-in-the-large"><span>O/E = Observed defaults / Expected defaults = Ȳ / PD̄</span></Formula>
  <p>O/E≈1 indicates broad alignment; 1.5 means observed risk is 50% above expected; 0.7 means the model overpredicts. Portfolio O/E can conceal offsetting segment errors and says little about shape.</p>
  <Formula label="Calibration regression"><span>logit(P(Y=1)) = α + β·logit(PD<sub>model</sub>)<br/>Ideal: α=0 and β=1</span></Formula>
  <p>α captures broad level bias conditional on the fitted calibration model. β captures whether the spread of predicted risk is appropriate. Under the stated convention, β&lt;1 often signals overly extreme predictions and β&gt;1 insufficient dispersion, but range, sample, estimation uncertainty and misspecification matter; never interpret slope as a slogan.</p>
  <Formula label="Proper scoring rules"><span>Brier = (1/N)Σ(PD<sub>i</sub>−Y<sub>i</sub>)²<br/>LogLoss = −(1/N)Σ[Y<sub>i</sub>ln(PD<sub>i</sub>)+(1−Y<sub>i</sub>)ln(1−PD<sub>i</sub>)]</span></Formula>
  <p>Brier and log loss evaluate probability quality but mix discrimination and calibration. Calibration curves compare predicted and observed rates by decile, score or PD band; grouping changes the picture. Hosmer–Lemeshow is grouping- and sample-size-sensitive: huge samples reject trivial deviations while small samples miss material ones.</p>
 </section>

 <section id="portfolio"><h2>A 250,000-account portfolio can rank well and understate risk</h2>
  <Formula label="Portfolio level"><span>Expected defaults = 250,000×2.8% = 7,000<br/>Observed defaults = 250,000×4.1% = 10,250<br/>O/E = 10,250/7,000 = 1.464</span></Formula>
  <ResourceTable caption="Original mature score-band diagnosis" headers={["Band","Accounts","Predicted PD","Observed default","O/E"]} rows={[["A","62,500","0.8%","1.2%","1.50"],["B","62,500","1.6%","2.3%","1.44"],["C","62,500","3.0%","4.4%","1.47"],["D","62,500","5.8%","8.5%","1.47"]]}/>
  <p>AUC remains 0.76 versus 0.77 at validation, the estimated calibration slope is 0.98 and intercept is positive. The uniform band pattern supports an intercept-type challenger. It does not prove the cause or authorise production change: vintage, segment, policy, macro and data evidence still matter.</p>
 </section>

 <section id="population"><h2>PSI and calibration answer orthogonal questions</h2>
  <Formula label="Different forms of drift"><span>Population: P<sub>t</sub>(X) ≠ P<sub>dev</sub>(X)<br/>Calibration: P<sub>t</sub>(Y|Score) ≠ P<sub>dev</sub>(Y|Score)</span></Formula>
  <p>A stable score distribution and low <Link href="/resources/population-stability-index-credit-risk-model-monitoring">PSI</Link> can coexist with rising defaults after unemployment, interest-rate or income stress. Conversely, a riskier applicant mix can raise PSI and average PD while each score band remains correctly calibrated. Population movement is not calibration failure.</p>
  <p>Likewise, higher realised loss can originate from PD, LGD or EAD: EL=PD×LGD×EAD. Funding costs and margins can change lending economics while PD remains calibrated. Keep probability validity separate from decision economics.</p>
 </section>

 <section id="segments"><h2>Aggregate alignment can hide segment and maturity failure</h2>
  <ResourceTable caption="Intuitive aggregation trap" headers={["Segment","Predicted PD","Observed PD","Direction"]} rows={[["Existing customers","2.0%","3.0%","Underpredicted"],["New customers","6.0%","4.5%","Overpredicted"],["Portfolio aggregate","3.6%","3.6%","Appears aligned"]]}/>
  <p>Changing mix can make aggregate calibration appear correct while both segments are wrong—an intuitive Simpson&apos;s-paradox pattern. Diagnose product, channel, customer type, band, justified geography, risk grade and <Link href="/resources/credit-vintage-analysis">vintage</Link>, with uncertainty controls against noisy slicing.</p>
  <p>A 12-month PD requires mature 12-month outcomes. Recent cohorts are censored; comparing annual PD with partial performance creates maturity bias. Use mature cohorts, disclose partial maturity, or use governed survival methods where appropriate. Low-default portfolios may require longer aggregation; high-risk short-tenor books can provide faster but more volatile feedback.</p>
 </section>

 <section id="methods"><h2>Recalibration method must match the diagnosed failure</h2>
  <ResourceTable caption="Practitioner challenger set" headers={["Method","Use","Risk"]} rows={[["Intercept adjustment","Broad uniform level shift","Misses heterogeneous or shape drift"],["Logistic recalibration","Estimate α and β on logit(PD)","Can overfit temporary conditions"],["Segment-specific","Stable, justified segment differences","Fragmentation and weak samples"],["Isotonic regression","Flexible monotonic mapping","Stepwise overfit and extrapolation"],["Platt-style scaling","Parametric probability mapping","Functional-form mismatch"],["Prior/base-rate adjustment","Supported prevalence shift","Insufficient if P(Y|X) changed heterogeneously"]]}/>
  <p>Intercept-only recalibration is plausible when ranking, slope and ordering remain stable, a broad level shift persists and mature outcomes are sufficient. Champion/challenger comparisons should include existing, intercept-only, full logistic and justified segmented mappings on out-of-time mature samples.</p>
  <p>Frequent rolling recalibration is responsive but can chase noise, destabilise PDs and expand governance burden. Structural policy, product, channel or regime breaks can invalidate simple adjustment.</p>
 </section>

 <section id="decision"><h2>Recalibration is not a substitute for redevelopment</h2>
  <ResourceFigure label="Entimema calibration diagnostic architecture." caption="Separate level, shape, population support and ranking before choosing action."><div className={styles.architecture}>{architecture.map((x,i)=><span key={x}><small>{String(i+1).padStart(2,"0")}</small><strong>{x}</strong></span>)}</div></ResourceFigure>
  <EntimemaFramework title="Recalibration versus redevelopment" description="A governed diagnosis, not an automatic threshold tree." steps={["Is ranking stable?","Is calibration stable?","Is population supported?","Are variable relationships stable?","Is drift segment-specific?","Recalibrate, redevelop or monitor","OOT validate"]}/>
  <p>Falling Gini/AUC, unstable slope, variable-relationship drift, segment inversion, weak support, new product mechanics or structural policy change point beyond simple calibration. Data defects demand remediation, not statistical polishing.</p>
  <Formula label="Persistence and materiality"><span>Persistence<sub>t</sub>(k)=ΣI(|O/E<sub>t−h</sub>−1|&gt;c)<br/>Materiality=f(Deviation, Exposure, Duration, Decision sensitivity)</span></Formula>
  <p>Large samples make tiny deviations statistically significant; small segments create wide uncertainty. Assess confidence intervals, absolute PD error, exposure, expected-loss impact and decision impact.</p>
 </section>

 <section id="strategy"><h2>A stable score cut-off can conceal a changed risk appetite</h2>
  <p>A monotonic score may remain unchanged while recalibration updates Score→PD. If score 620 once implied 5% PD and now implies 7.5%, preserving the numeric cut-off accepts a different absolute risk level. <strong>SameScore ≠ SameRisk</strong> across calibration versions.</p>
  <p><Link href="/resources/score-scaling-points-to-double-odds-credit-scores">Score Scaling &amp; PDO</Link> explains the mapping; <Link href="/resources/credit-risk-cut-off-strategy">Cut-Off Strategy</Link> connects it to economics and appetite. Direct-PD strategies can change approval immediately after recalibration; score strategies require explicit remapping and governance review.</p>
  <p>Understated PD understates expected loss all else equal, distorting pricing, provisioning, portfolio forecasts and capital planning. Application-scoring PD, regulatory PD and IFRS 9 lifetime PD have different horizons and calibration architectures; never transfer a recalibration mechanically between uses.</p>
 </section>

 <section id="case"><h2>A four-quarter case changes diagnosis as evidence matures</h2>
  <ResourceTable caption="Original multi-period calibration case" headers={["Quarter","Predicted PD","Observed default","O/E","Gini","PSI","α","β","Response"]} rows={[["Q1","2.9%","3.0%","1.03","0.47","0.03","+0.03","1.01","Monitor"],["Q2","3.2%","3.4%","1.06","0.47","0.18","+0.05","0.99","Diagnose mix; calibration stable"],["Q3","3.1%","4.6%","1.48","0.46","0.17","+0.39","0.97","Intercept challenger + vintage review"],["Q4","3.0%","5.1%","1.70","0.39","0.16","+0.42","0.72","Full relationship/model review"]]}/>
  <p>Q2 is population movement with stable performance. Q3 adds persistent level drift while ranking and slope largely survive: recalibration becomes a credible challenger. Q4 introduces slope and Gini deterioration, so intercept adjustment alone would hide structural failure.</p>
 </section>

 <section id="workflow"><h2>Operational calibration control joins predictions to mature outcomes</h2>
  <EntimemaFramework title="Calibration monitoring workflow" description="Observe → diagnose → challenge → validate → govern → monitor." steps={["Scores, PDs and mature outcomes","O/E, intercept and slope","Band, segment and vintage diagnosis","PSI and materiality context","Recalibration challengers","OOT validation","Governance and mapping update","Production monitoring"]}/>
  <p>Record model, calibration, score-scale and effective-date versions; test old and new score-to-PD maps; quantify cut-off, approval, expected-loss and segment impacts; preserve rollback and historical reconstruction. <Link href="/resources/pd-model-monitoring">PD Model Monitoring</Link> provides the broader surveillance layer, and <Link href="/resources/pd-model-ranking-calibration">PD Ranking &amp; Calibration</Link> develops the core validation distinction.</p>
 </section>

 <section id="nbfi"><h2>Fast-turning non-bank portfolios can learn sooner—and confound faster</h2>
  <p>Fintech, consumer-finance and instalment lenders may see faster turnover, higher default incidence and shorter outcome horizons, enabling responsive calibration monitoring. But frequent pricing, policy and channel changes alter selection and mix, making cause attribution harder. High-risk tails require granular evidence; low-default books require patience and pooled uncertainty.</p>
  <p>Where calibrated parameters feed impairment, calibration drift can affect ECL. This does not make application PD equivalent to IFRS 9 lifetime PD; horizon, forward-looking scenarios and use-specific architecture remain distinct.</p>
 </section>

 <section id="failures"><h2>Seventeen failures turn recalibration into false assurance</h2>
  <ResourceTable caption="Calibration failure mechanisms" headers={["Failure","Why it fails"]} rows={[["1. Gini only","Ordering hides probability error"],["2. Stable rank means fine","Absolute risk may be wrong"],["3. Portfolio O/E only","Segment errors cancel"],["4. Slope ignored","Shape deterioration is missed"],["5. Segment drift ignored","Material local failure survives aggregation"],["6. Immature cohorts","Censoring biases observed risk"],["7. Wrong horizon","Outcome and PD are incomparable"],["8. PSI confused with calibration","Inputs substitute for outcomes"],["9. Loss drift equals PD drift","LGD/EAD are ignored"],["10. No OOT validation","Noise is fitted and deployed"],["11. Too frequent","PDs chase volatility"],["12. Cut-off preserved blindly","Risk appetite changes silently"],["13. Appetite impact ignored","Technical mapping bypasses economics"],["14. One mapping for all","Heterogeneous segments remain wrong"],["15. Significance equals materiality","Exposure and decision effect disappear"],["16. Recalibrate bad ranking","Structural model failure is cosmetically masked"],["17. Point estimates only","Uncertainty is hidden"]]}/>
 </section>

 <section id="automation"><h2>A PD Calibration &amp; Drift Agent can make challenger evidence recurring</h2>
  <EntimemaFramework title="PD Calibration & Drift Agent" description="Continuous calibration surveillance + challenger analysis + governance evidence—not autonomous production recalibration." steps={["Ingest predicted PDs","Match mature outcomes","Calculate O/E, α and β","Build calibration curves","Compare segments and vintages","Join PSI and Gini","Detect persistence","Test challenger mappings","Estimate cut-off impact","Produce review evidence"]}/>
  <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk</Link> work connects PD calibration, validation, monitoring and redevelopment diagnostics. <Link href="/services/decision-automation">Decision Automation</Link> can operationalise controlled surveillance while accountable humans approve model changes.</p>
  <p>Related foundations include <Link href="/resources/credit-scorecard-development-explainable-risk-ranking">Credit Scorecard Development</Link>, <Link href="/resources/logistic-regression-credit-risk-production-scorecard">Logistic Regression for Credit Risk</Link> and <Link href="/resources/early-warning-indicators-credit-risk">Early Warning Indicators</Link>.</p>
 </section>
</>}
