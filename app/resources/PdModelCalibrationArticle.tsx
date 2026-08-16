import Link from "next/link";
import { KeyObservation, ResourceFigure } from "./ResourceElements";
import styles from "./pd-model-calibration.module.css";

export const pdModelCalibrationSections = [
  { id: "same-score-different-pd", label: "The same score can carry a different PD" },
  { id: "ranking-and-calibration", label: "Ranking and calibration answer different questions" },
  { id: "central-tendency", label: "Calibration needs an anchor" },
  { id: "decision-architecture", label: "From borrower data to credit decision" },
  { id: "monitoring", label: "Monitor when the meaning changes" },
] as const;

const calibrationStates = [
  { label: "Calibration state 01", tone: "cool", values: [["A", "0.8%"], ["B", "1.7%"], ["C", "3.5%"], ["D", "7.0%"]] },
  { label: "Calibration state 02", tone: "warm", values: [["A", "1.2%"], ["B", "2.5%"], ["C", "5.0%"], ["D", "9.5%"]] },
] as const;

const decisionSteps = [
  ["Data", "Borrower evidence"],
  ["Ranking", "Relative risk"],
  ["Risk order", "A < B < C < D"],
  ["Calibration", "Bridge"],
  ["PD", "Absolute risk"],
  ["Decision", "Economics & policy"],
] as const;

export default function PdModelCalibrationArticle() {
  return (
    <>
      <p className="resource-lead"><em>A borrower can remain in exactly the same relative risk position while the probability attached to that position changes materially.</em></p>

      <section id="same-score-different-pd">
        <h2>The same score can carry a different PD</h2>

        <p>Consider a borrower whose score has not changed.</p>

        <p>The borrower remains in the same risk band. Their position relative to every other borrower in the portfolio is unchanged. Nothing in the ordering has moved.</p>

        <p>Yet the probability of default assigned to that position rises from 3.5% to 5.0%.</p>

        <p><strong>How can the same risk ranking produce a different probability of default?</strong></p>

        <p>The answer is not necessarily model failure. It is evidence that two analytical functions—often compressed into one mental model—are doing different jobs.</p>

        <p>The ranking establishes where the borrower sits relative to others. Calibration determines what that position means in absolute risk terms.</p>

        <KeyObservation><p><strong>Score → PD</strong> hides a critical step. The fuller chain is <strong>Score → Risk ordering → Calibration → PD</strong>.</p></KeyObservation>
      </section>

      <section id="ranking-and-calibration">
        <h2>Ranking and calibration answer different questions</h2>

        <h3>Ranking asks: Who is riskier?</h3>

        <p>A ranking model establishes relative risk order. In a simple four-band structure, it might produce:</p>

        <p><strong>A &lt; B &lt; C &lt; D</strong></p>

        <p>Borrowers in A are expected to be safer than borrowers in B; B safer than C; and C safer than D. Measures of discrimination evaluate how effectively that ordering separates subsequent good and bad outcomes.</p>

        <p>That ordering matters, but it does not tell us whether band C represents a 3.5% PD, a 5.0% PD or something else. As the preceding analysis on <Link href="/resources/high-gini-good-credit-decision">model discrimination and decision quality</Link> shows, strong ranking performance cannot establish the accuracy—or economic suitability—of the absolute risk estimate.</p>

        <h3>Calibration asks: How risky are they?</h3>

        <p>Calibration translates positions in the ranking into probabilities. The same four bands can preserve exactly the same order while their absolute PD levels change.</p>

        <ResourceFigure
          label="Two illustrative calibration states with identical A to D risk ordering. State one maps bands A, B, C and D to 0.8, 1.7, 3.5 and 7.0 percent PD. State two maps the same bands to 1.2, 2.5, 5.0 and 9.5 percent PD."
          caption="Same ranking. Different absolute risk. Values are synthetic and illustrative only."
        >
          <div className={styles.calibrationComparison}>
            <header><span>SAME RANKING</span><strong>A → B → C → D</strong><span>DIFFERENT PD</span></header>
            <div className={styles.stateGrid}>
              {calibrationStates.map((state) => (
                <div className={state.tone === "warm" ? styles.warmState : styles.coolState} key={state.label}>
                  <div><span>{state.label}</span><small>Probability of default</small></div>
                  <ol>{state.values.map(([band, pd]) => <li key={band}><strong>{band}</strong><i aria-hidden="true" /><span>{pd}</span></li>)}</ol>
                </div>
              ))}
            </div>
            <footer><strong>Ordering unchanged</strong><span>Absolute risk level moved</span></footer>
          </div>
        </ResourceFigure>

        <p>The ranking can remain intact while calibration moves. That distinction is central to PD model calibration: relative risk stability and absolute risk stability are not the same property.</p>
      </section>

      <section id="central-tendency">
        <h2>Calibration needs an anchor</h2>

        <p>If ranking supplies the relative shape of risk, calibration needs an anchor for the portfolio&apos;s overall level of default risk—its central tendency.</p>

        <p>Observed historical defaults are essential evidence, but they cannot be interpreted mechanically. An observation period may not represent the portfolio or environment in which the calibrated PDs will be used.</p>

        <p>Practitioners therefore need to consider whether the experience remains representative, including:</p>

        <ul>
          <li>portfolio composition and acquisition mix;</li>
          <li>structural changes in products or customers;</li>
          <li>economic conditions during and after the observation period;</li>
          <li>changes in underwriting standards or policy;</li>
          <li>available forward-looking information;</li>
          <li>the uncertainty surrounding every estimate.</li>
        </ul>

        <p>This is not an invitation to adjust PDs until they feel comfortable. It is a requirement to make the calibration framework explicit, evidence-based and reviewable.</p>

        <KeyObservation title="The calibration relationship"><p><strong>PD is not merely discovered inside the score.</strong> It emerges from relative ranking, the portfolio risk level and the calibration framework used to connect them.</p></KeyObservation>
      </section>

      <section id="decision-architecture">
        <h2>From borrower data to credit decision</h2>

        <p>The distinction becomes operational once PD enters the decision system.</p>

        <ResourceFigure
          label="Probability of default decision architecture from borrower data through ranking and risk order to calibration, probability of default and credit decision. Calibration bridges relative and absolute risk. A monitoring layer observes population, ranking, calibration, PD and outcomes."
          caption="Calibration is the bridge between relative risk ordering and the absolute risk estimate used in decision economics."
        >
          <div className={styles.pdArchitecture}>
            <header><span>RELATIVE RISK</span><i aria-hidden="true">→</i><strong>CALIBRATION BRIDGE</strong><i aria-hidden="true">→</i><span>ABSOLUTE RISK</span></header>
            <ol>
              {decisionSteps.map(([step, role], index) => <li className={index === 3 ? styles.bridgeStep : undefined} key={step}><strong>{step}</strong><span>{role}</span></li>)}
            </ol>
            <div className={styles.monitoringBand}>
              <small>INTELLIGENT MONITORING LAYER</small>
              <strong>Population → Ranking → Calibration → PD → Outcome</strong>
              <span>Observe signals separately · connect deviations · escalate for judgement</span>
            </div>
          </div>
        </ResourceFigure>

        <p>PD may feed expected loss, pricing, limits, approval policy, capital allocation, provisioning and portfolio strategy. A calibration error can therefore propagate across the economics of a credit decision even when the ranking model remains highly discriminatory.</p>

        <p>The appropriate response depends on the institution&apos;s objectives and controls, but the analytical requirement is universal: relative position, absolute risk and decision consequence must remain distinguishable.</p>

        <p>Entimema&apos;s <Link href="/services/credit-risk">Credit Risk work</Link> connects portfolio behaviour, model evidence and policy so those distinctions remain visible in the resulting decision architecture.</p>

        <p><strong>Ranking locates the borrower in the risk hierarchy. Calibration assigns the level of risk that the institution is prepared to use for decisions.</strong></p>
      </section>

      <section id="monitoring">
        <h2>Monitor when the meaning changes</h2>

        <p>Ranking stability and calibration stability do not necessarily deteriorate together.</p>

        <p>A modern monitoring architecture should therefore observe population drift, discriminatory performance, observed default behaviour, calibration drift and downstream decision outcomes as related but distinct signals.</p>

        <p>An intelligent monitoring agent could continuously connect those signals and identify situations where <strong>the ranking still works but the meaning of the ranking has changed</strong>.</p>

        <p>That role does not replace model validation or human judgement. It makes emerging inconsistencies easier to investigate before they propagate silently through pricing, limits, policy and portfolio outcomes.</p>
      </section>
    </>
  );
}
