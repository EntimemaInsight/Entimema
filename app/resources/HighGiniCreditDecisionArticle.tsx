import { EntimemaFramework, KeyObservation, ResourceTable } from "./ResourceElements";

export const highGiniCreditDecisionSections = [
  { id: "tension", label: "Discrimination can remain strong while decisions deteriorate" },
  { id: "transformation", label: "Stop thinking about the model as the decision" },
  { id: "resolution", label: "Monitor the decision system, not only the model" },
  { id: "decision-intelligence", label: "From model monitoring to decision intelligence" },
] as const;

export default function HighGiniCreditDecisionArticle() {
  return (
    <>
      <p className="resource-lead"><em>A model can rank risk remarkably well and still support the wrong lending decision.</em></p>

      <p>A credit model reports a high Gini coefficient. Its discriminatory power remains stable. Higher-risk borrowers consistently receive worse scores than lower-risk borrowers.</p>

      <p>The natural conclusion is reassuring:</p>

      <p><strong>the model works.</strong></p>

      <p>But that conclusion can be dangerously incomplete.</p>

      <p>A credit model can remain excellent at <strong>ranking borrowers by risk</strong> while becoming increasingly inaccurate about <strong>how much risk those borrowers actually represent</strong>. And even an accurately calibrated probability of default does not, by itself, tell a lender whether an application should be approved, declined, repriced or assigned a different limit.</p>

      <p>The distinction matters because credit decisions do not happen inside a model.</p>

      <p>They happen inside a <strong>decision system</strong>.</p>

      <section id="tension">
        <h2>The tension: discrimination can remain strong while decisions deteriorate</h2>

        <p>Consider a simplified portfolio.</p>

        <p>A scorecard continues to separate higher-risk borrowers from lower-risk borrowers extremely well. Its Gini remains high.</p>

        <p>Yet economic conditions, customer acquisition channels or portfolio composition begin to change.</p>

        <p>Observed default rates start moving.</p>

        <p>The ordering of customers may still be largely correct:</p>

        <p><strong>A remains safer than B, and B remains safer than C.</strong></p>

        <p>But the absolute level of risk associated with each segment may no longer be what the model predicts.</p>

        <p>The model might estimate:</p>

        <ResourceTable
          caption="Illustrative predicted and observed credit risk by segment"
          headers={["Risk segment", "Predicted PD", "Observed default rate"]}
          rows={[
            ["Low", "1.0%", "1.5%"],
            ["Medium", "3.0%", "4.5%"],
            ["High", "7.0%", "10.0%"],
          ]}
        />

        <p>The ranking remains correct.</p>

        <p>The risk estimate does not.</p>

        <p>That difference separates two concepts that are often mentally compressed into one:</p>

        <p><strong>discrimination</strong> and <strong>calibration</strong>.</p>

        <p>A discriminatory model answers:</p>

        <blockquote><p>Which borrower is riskier?</p></blockquote>

        <p>A calibrated model answers:</p>

        <blockquote><p>Approximately how risky is this borrower?</p></blockquote>

        <p>Those are different questions.</p>

        <p>And lending requires both.</p>
      </section>

      <section id="transformation">
        <h2>The transformation: stop thinking about the model as the decision</h2>

        <p>A scorecard is only one component of a much larger architecture.</p>

        <p>The useful mental model is not:</p>

        <p><strong>Data → Model → Decision</strong></p>

        <p>It is closer to:</p>

        <p><strong>Portfolio → Data → Ranking → PD → Calibration → Policy → Decision → Outcome</strong></p>

        <p>Each transition can introduce failure.</p>

        <p>The population can shift.</p>

        <p>Variables can lose predictive strength.</p>

        <p>A ranking model can remain discriminatory while calibration deteriorates.</p>

        <p>A PD estimate can remain statistically reasonable while the commercial cut-off becomes economically inappropriate.</p>

        <p>And a technically sound decision rule can produce unexpected portfolio outcomes when pricing, limits or acquisition strategy change.</p>

        <p>This is why monitoring a single model-performance statistic can create false confidence.</p>

        <h3>Ranking is not probability</h3>

        <p>A ranking model establishes relative ordering.</p>

        <p>If borrower A receives a better score than borrower B, the model is effectively saying that A should represent lower credit risk.</p>

        <p>Measures such as Gini assess how effectively that ordering separates good and bad outcomes.</p>

        <p>That is valuable.</p>

        <p>But a ranking score does not inherently tell us whether the probability of default is 1%, 3% or 8%.</p>

        <p>That requires calibration.</p>

        <h3>Probability is not a decision</h3>

        <p>Now assume calibration is also sound.</p>

        <p>A borrower has an estimated PD of 4%.</p>

        <p>Should the lender approve the application?</p>

        <p>There is still no answer.</p>

        <p>A credit decision may depend on expected loss, pricing, collateral, exposure, risk appetite, operating costs, capital consumption and expected return.</p>

        <p>The same 4% PD could therefore lead to different decisions under different economics.</p>

        <p>The analytical chain becomes:</p>

        <p><strong>PD → Expected Loss → Economics → Policy → Decision</strong></p>

        <p>This is where credit modelling becomes credit decisioning.</p>
      </section>

      <section id="resolution">
        <h2>The resolution: monitor the decision system, not only the model</h2>

        <p>A robust credit-risk framework should therefore monitor several layers independently.</p>

        <p><strong>Population stability</strong> asks whether the borrowers entering the system still resemble the population on which the model was developed.</p>

        <p><strong>Discrimination</strong> asks whether the model continues to rank risk correctly.</p>

        <p><strong>Calibration</strong> asks whether predicted probabilities remain aligned with realised outcomes.</p>

        <p><strong>Decision performance</strong> asks whether the resulting approvals, declines, pricing and limits are producing the intended portfolio economics.</p>

        <p>These layers are connected, but they are not interchangeable.</p>

        <p>A useful monitoring architecture therefore looks like this:</p>

        <EntimemaFramework
          title="Credit decision-system monitoring architecture"
          description="Monitoring and feedback connect portfolio outcomes back to every upstream layer."
          steps={["Population", "Score", "Risk ranking", "Probability of default", "Decision policy", "Credit decision", "Portfolio outcome", "Monitoring & feedback ↺"]}
        />

        <p>The feedback loop is essential.</p>

        <p>Without it, credit risk management becomes a sequence of periodic model checks.</p>

        <p>With it, the organisation begins to manage a <strong>living decision system</strong>.</p>
      </section>

      <section id="decision-intelligence">
        <h2>From model monitoring to decision intelligence</h2>

        <p>This distinction becomes increasingly important as lending decisions become more automated.</p>

        <p>Traditional monitoring often asks whether a model remains statistically valid.</p>

        <p>The next generation of credit decisioning must ask a broader question:</p>

        <KeyObservation title="Decision-system question"><p><strong>Is the entire decision system still behaving as intended?</strong></p></KeyObservation>

        <p>That means continuously connecting signals that are frequently reviewed separately:</p>

        <ul>
          <li>changes in portfolio composition;</li>
          <li>deterioration in model discrimination;</li>
          <li>calibration drift;</li>
          <li>movement in approval rates;</li>
          <li>changes in overrides;</li>
          <li>realised defaults;</li>
          <li>expected loss;</li>
          <li>pricing and profitability;</li>
          <li>emerging concentrations.</li>
        </ul>

        <p>Once these signals are connected, monitoring stops being only a reporting exercise.</p>

        <p>It becomes a decision process itself.</p>

        <p>And that creates a natural role for agentic systems.</p>

        <p>An AI monitoring agent does not need to replace the credit model or the risk manager.</p>

        <p>Its more valuable role may be to continuously observe the system around them: identify emerging deviations, connect signals across model and portfolio performance, investigate potential causes and escalate situations that require human judgement.</p>

        <p>The shift is subtle but important:</p>

        <p><strong>from monitoring models to monitoring decisions.</strong></p>

        <p>Because ultimately, a lender does not earn or lose money from its Gini coefficient.</p>

        <p>It earns or loses money from the <strong>decisions the system makes</strong>.</p>
      </section>
    </>
  );
}
