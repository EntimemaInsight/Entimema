import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./high-risk-consumer-lending.module.css";

export const highRiskConsumerLendingSections = [
  { id: "objective", label: "Beyond minimum bad rate" },
  { id: "economics", label: "Borrower unit economics" },
  { id: "portfolio", label: "The 100,000-application portfolio" },
  { id: "frontier", label: "The Risk–Economics Frontier" },
  { id: "information", label: "Borrower information" },
  { id: "feedback", label: "FPD, channels and vintages" },
  { id: "selection", label: "Cut-offs and selection bias" },
  { id: "capacity", label: "Collections and growth" },
  { id: "loop", label: "The operating feedback loop" },
  { id: "monitoring", label: "Practical monitoring" },
] as const;

const chain = ["Application population", "Risk score / PD", "Cut-off", "Approval rate", "Approved risk mix", "Pricing", "Expected loss", "Acquisition / servicing / collections cost", "Contribution", "Observed performance", "Strategy adjustment"];

export default function HighRiskConsumerLendingArticle() {
  return <>
    <p className="resource-lead"><em>For consumer lenders, fintech lenders, digital lenders and non-bank financial institutions, the objective is not to eliminate risky borrowers. It is to select, price and manage risk well enough for the accepted portfolio to remain economically viable.</em></p>

    <section id="objective">
      <h2>The objective is not minimum bad rate</h2>
      <p>Heads of Risk, Heads of Lending, portfolio managers and consumer-finance CEOs face a tension that conventional credit shorthand obscures. Declining more applications can reduce bad rate while also destroying approval volume, disbursements, revenue, acquisition economics and repeat-loan opportunity. Loosening the cut-off can grow revenue while losses and collections workload grow faster.</p>
      <p>A high-risk consumer-lending environment is not defined by one arbitrary PD threshold. It may combine weaker or thin-file borrowers, higher default incidence, smaller tickets, short decision cycles, high application volume, higher pricing, meaningful acquisition cost, automated decisioning and rapid early-delinquency feedback. The mix varies by market and product.</p>
      <Formula label="The incomplete comparison"><span>Strategy A: Bad Rate = 4% &nbsp; | &nbsp; Strategy B: Bad Rate = 8%</span></Formula>
      <p>If A approves 15% of eligible applications and B approves 45%, the lower bad rate does not prove that A is better. The relevant question is: <strong>what economic value does the accepted portfolio generate after risk and cost?</strong></p>
      <KeyObservation><p><strong>A high PD does not automatically make a borrower economically unattractive, just as a lower PD does not automatically make a borrower profitable. The optimisation problem is sustainable risk-adjusted economic value—not minimum default rate.</strong></p></KeyObservation>
      <p>Where a lower score means greater risk, loosening the boundary can be written conceptually as <strong>Cut-off ↓ ⇒ Approval Rate ↑ ⇒ Accepted Risk ↑</strong>. Other score directions reverse the cut-off notation. The implementation changes; the business tension remains: <strong>Volume ↔ Revenue ↔ Risk ↔ Cost ↔ Contribution.</strong></p>
      <EntimemaFramework title="From applications to observed economics" description="Every link changes the portfolio that follows it; no single metric can represent the system." steps={chain} />
    </section>

    <section id="economics">
      <h2>Borrower unit economics change the decision question</h2>
      <Formula label="Simplified expected economic value"><span>EV<sub>i</sub> = Expected Revenue<sub>i</sub> − Expected Credit Loss<sub>i</sub> − Acquisition Cost<sub>i</sub> − Servicing Cost<sub>i</sub> − Expected Collections Cost<sub>i</sub></span></Formula>
      <Formula label="Expected credit loss"><span>Expected Credit Loss<sub>i</sub> = PD<sub>i</sub> × LGD<sub>i</sub> × EAD<sub>i</sub></span></Formula>
      <p>This is a simplified framework. A real product may also require funding, capital, tax, prepayment, fraud, timing, utilisation, recoveries and repeat-borrower value. Collections cost deserves explicit treatment: contact attempts, servicing, external collections and workload arise even before final loss.</p>
      <Formula label="The conceptual transition"><span>Risk-Adjusted Contribution<sub>i</sub> = Revenue<sub>i</sub> − PD<sub>i</sub>LGD<sub>i</sub>EAD<sub>i</sub> − Cost<sub>i</sub><br /><strong>Ask Contribution<sub>i</sub> &gt; 0? &nbsp; not only &nbsp; PD<sub>i</sub> &lt; c?</strong></span></Formula>
      <h3>Two hypothetical borrowers</h3>
      <ResourceTable caption="Synthetic one-loan economics. Expected loss uses the displayed PD, 80% LGD and loan amount as EAD; contribution is revenue minus expected loss minus total cost." headers={["Borrower", "PD", "Loan / revenue", "Expected loss", "Acquisition + other cost", "Expected contribution"]} rows={[
        ["A — paid affiliate, weak repeat potential", "6%", "€300 / €66", "€14.40", "€42", "€9.60"],
        ["B — direct repeat customer, controlled exposure", "14%", "€500 / €175", "€56.00", "€48", <strong key="b">€71.00</strong>],
      ]} />
      <p>PD<sub>A</sub> &lt; PD<sub>B</sub>, but EV<sub>A</sub> &lt; EV<sub>B</sub>. B&apos;s stronger pricing, lower acquisition burden and appropriate exposure create more expected contribution. That is not permission to price away any risk. Higher price can worsen affordability, selection, adverse selection, behaviour, collections, regulation and reputation. <strong>Pricing is a risk-management lever, not a universal cure for bad credit selection.</strong></p>
    </section>

    <section id="portfolio">
      <h2>A hypothetical 100,000-application portfolio</h2>
      <p>These neutral bands do not represent a real lender, scorecard, pricing grid or cut-off. PD increases from A to E. Figures are per approved loan; cost combines acquisition, servicing, operating and expected collections cost. All examples are hypothetical.</p>
      <ResourceTable caption="Expected loss per approval = PD × 80% LGD × average loan. Expected contribution = revenue − expected loss − cost. Approved counts equal applicants × approval rate." headers={["Band", "Applicants", "Est. PD", "Approval", "Avg loan", "Revenue", "Loss", "Cost", "Contribution"]} rows={[
        ["A", "15,000", "3%", "100%", "€400", "€96", "€9.60", "€38", "€48.40"],
        ["B", "25,000", "7%", "90%", "€450", "€126", "€25.20", "€44", "€56.80"],
        ["C", "30,000", "13%", "65%", "€500", "€170", "€52.00", "€53", <strong key="c">€65.00</strong>],
        ["D", "20,000", "22%", "30%", "€550", "€209", "€96.80", "€67", "€45.20"],
        ["E", "10,000", "35%", "10%", "€600", "€240", "€168.00", "€90", <strong key="e">−€18.00</strong>],
      ]} />
      <p>The strategy approves 64,000 accounts. Contributions reconcile to <strong>€0.726m + €1.278m + €1.2675m + €0.2712m − €0.018m = €3.5247m</strong>. Band E increases approvals and revenue but destroys €18,000 of expected value. Its high bad rate is not, by itself, the rejection argument; its negative marginal economics are.</p>
      <Formula label="Marginal risk economics for band b"><span>Marginal Value<sub>b</sub> = Incremental Revenue<sub>b</sub> − Incremental Loss<sub>b</sub> − Incremental Cost<sub>b</sub></span></Formula>
      <DecisionImplication><p>Evaluate a cut-off at the margin: <strong>does admitting the next score band add or destroy expected portfolio value?</strong> Average performance can conceal a negative last increment.</p></DecisionImplication>
    </section>

    <section id="frontier">
      <h2>The Entimema Risk–Economics Frontier</h2>
      <p>Increasing approval first recovers rejected opportunity. It then enters a productive-risk region where loss rises but marginal value remains positive. Beyond the boundary, incremental risk and cost exceed incremental return.</p>
      <ResourceFigure label="Risk–Economics Frontier with conservative, productive-risk and destructive-risk regions as approval increases." caption="The frontier moves with borrower mix, pricing, loss severity, costs, capacity and uncertainty.">
        <div className={styles.frontier}>
          <div className={styles.regions}><span>TOO CONSERVATIVE<small>Low loss · rejected value</small></span><span>PRODUCTIVE RISK<small>Positive marginal value</small></span><span>DESTRUCTIVE RISK<small>Loss + cost outrun return</small></span></div>
          <svg viewBox="0 0 760 250" role="img" aria-label="Revenue and expected loss rise while contribution peaks and then falls"><path className={styles.grid} d="M42 18V216H735M42 166H735M42 116H735M42 66H735"/><path className={styles.revenue} d="M45 190 C190 165 335 115 730 35"/><path className={styles.loss} d="M45 205 C300 200 470 158 730 46"/><path className={styles.contribution} d="M45 196 C210 130 390 70 520 82 C620 92 675 140 730 188"/><line className={styles.boundary} x1="538" y1="20" x2="538" y2="216"/><text x="620" y="29">REVENUE</text><text x="650" y="82">EXPECTED LOSS</text><text x="350" y="61">CONTRIBUTION</text><text x="548" y="207">ECONOMIC BOUNDARY</text></svg>
          <footer><span>STRICTER CUT-OFF</span><strong>INCREASING APPROVAL →</strong><span>LOOSER CUT-OFF</span></footer>
        </div>
      </ResourceFigure>
      <Formula label="Core portfolio metrics"><span>Approval Rate = Approved Applications / Eligible Applications<br/>Bad Rate = Bad Accounts / Eligible Booked Accounts</span></Formula>
      <p>Approval rate is not merely commercial; it changes the booked risk mix. “Bad” must be defined consistently through an appropriate outcome and horizon. No universal NBFI DPD rule is imposed here. See Entimema&apos;s <Link href="/resources/pd-default-definition-target-construction">Default Definition</Link> research.</p>
      <ResourceTable caption="Five cumulative strategies derived from the synthetic portfolio. Contribution deducts all displayed costs." headers={["Strategy", "Approval", "Expected bad rate", "Revenue", "Expected loss", "Expected contribution"]} rows={[
        ["Very strict — A", "15.0%", "3.0%", "€1.440m", "€0.144m", "€0.726m"],
        ["Moderate — A+B", "37.5%", "5.4%", "€4.275m", "€0.711m", "€2.004m"],
        ["Attractive — through C", "57.0%", "8.0%", "€7.590m", "€1.725m", "€3.2715m"],
        ["Productive edge — through D", "63.0%", "9.3%", "€8.844m", "€2.3058m", <strong key="peak">€3.5427m</strong>],
        ["Destructive — through E", "64.0%", "9.7%", "€9.084m", "€2.4738m", "€3.5247m"],
      ]}/>
      <div className={styles.tradeoff}><article><small>STRICTER CUT-OFF</small><strong>Lower approval and risk</strong><span>Potentially lost contribution</span></article><div><small>OPTIMISE</small><strong>RISK-ADJUSTED CONTRIBUTION</strong><span>Not approval or bad rate alone</span></div><article><small>LOOSER CUT-OFF</small><strong>Higher approval and risk</strong><span>Eventually destructive losses</span></article></div>
    </section>

    <section id="information">
      <h2>First-time and repeat borrowers are different information problems</h2>
      <div className={styles.compare}><article><small>FIRST-TIME BORROWER</small><h3>Application risk</h3><p>Limited internal history puts more weight on application and bureau or external data, affordability, the score or model, and fraud controls.</p></article><article><small>REPEAT BORROWER</small><h3>Observed customer behaviour</h3><p>Repayment history, delinquency, payment behaviour, previous exposure and prior loan performance may improve assessment and offer design.</p></article></div>
      <p>Internal behaviour can create a material information advantage, but does not universally dominate external data. Keep first-time and repeat populations visible in approval, FPD, DPD, bad-rate and contribution reporting. This opens a future repeat-lending research cluster.</p>
    </section>

    <section id="feedback">
      <h2>Early outcomes connect origination to economics</h2>
      <p><strong>First payment default (FPD)</strong> is failure to perform the first contractual payment according to the analytical definition used by the lender. No single DPD threshold is universal. FPD can signal underwriting, fraud, affordability, acquisition quality, customer intent or operational-process problems; it identifies where to investigate, not the cause by itself.</p>
      <Formula label="Fast origination feedback"><span>Application → Approval → Disbursement → First Payment</span></Formula>
      <p>This evidence arrives earlier than lifetime default. A future article, <strong>First Payment Default in High-Risk Consumer Lending</strong>, will develop the diagnostic.</p>
      <h3>Channel quality is risk-adjusted quality</h3>
      <p>Direct, affiliate, broker or partner, and digital-campaign applications can have different approval, acquisition-cost, FPD and contribution profiles. <strong>Volume ≠ Quality</strong>, and <strong>Low CAC ≠ Profitable Acquisition</strong> when loss is excluded.</p>
      <Formula label="Channel-level economics"><span>Channel Contribution = Revenue − Credit Loss − Acquisition Cost − Operating Cost</span></Formula>
      <h3>Score band × vintage</h3>
      <p><Link href="/resources/credit-vintage-analysis">Credit Vintage Analysis</Link> and <Link href="/resources/automating-credit-vintage-analysis-r-ai-portfolio-analyst">vintage automation research</Link> expose underwriting, channel and product change. Do not ask only, “Is Vintage 2026-06 worse?” Ask, “Which score bands within Vintage 2026-06 are worse?”</p>
      <Formula label="Targeted diagnosis"><span>Performance<sub>vintage, score band</sub> &nbsp; | &nbsp; Performance<sub>v,c,s</sub>, where v = vintage, c = channel, s = score band</span></Formula>
      <p>The three-way view should test a hypothesis, not create uncontrolled dimensional explosion. It can isolate deterioration near the boundary or within an acquisition source.</p>
    </section>

    <section id="selection">
      <h2>The near-cut-off population is informative—and selected</h2>
      <p>A small cut-off change can move many near-boundary applicants from decline to approve. Their performance provides direct booked evidence about marginal economics. But declined applications generally do not reveal comparable repayment outcomes.</p>
      <Formula label="The observed population"><span>Observed Performance = Performance | Approved<br/><strong>not necessarily</strong> &nbsp; Performance | All Applicants</span></Formula>
      <p>Historical outcomes therefore contain selection bias. Reject inference can support sensitivity work, but cannot manufacture certain outcomes for declines. Naive simulation can overstate certainty, especially where channels, terms or applicant behaviour would change.</p>
      <p>Economic positivity is not sufficient. <strong>Risk Economics + Risk Appetite + Policy → Decision.</strong> A positive-EV band may remain inadmissible; concentrations in channels, bands, segments or products may make individually attractive loans undesirable at portfolio level.</p>
    </section>

    <section id="capacity">
      <h2>Collections capacity turns theoretical economics into realised performance</h2>
      <p>Approval expansion creates delinquent accounts as well as revenue. If <strong>Collections Demand &gt; Collections Capacity</strong>, contact timeliness, cure and recoveries can deteriorate. Operational capacity is part of credit strategy, not a downstream footnote.</p>
      <p>Nor can a lender assume <strong>Risk<sub>new volume</sub> = Risk<sub>existing portfolio</sub></strong>. Rapid growth can change channel mix, borrower quality, fraud exposure, analyst workload and collections capacity. Growth is itself a risk transformation.</p>
      <DecisionImplication><p>Stress the frontier for loss severity, acquisition cost, FPD, staffing and collections throughput. A strategy positive only under unconstrained operations is not operationally viable.</p></DecisionImplication>
    </section>

    <section id="loop">
      <h2>The consumer lending feedback loop</h2>
      <ResourceFigure label="Consumer lending feedback loop from acquisition through economics and strategy update back to acquisition and cut-off." caption="High-volume lending learns only when outcomes change acquisition, cut-offs, pricing, limits and policy.">
        <div className={styles.loop}>{["ACQUISITION", "APPLICATION", "SCORE", "CUT-OFF", "APPROVAL", "DISBURSEMENT", "FPD / EARLY DPD", "PORTFOLIO PERFORMANCE", "ECONOMICS", "STRATEGY UPDATE"].map((item,index)=><div key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong>{index<9&&<b>→</b>}</div>)}<footer>↖ UPDATE CUT-OFF / ACQUISITION / PRICE / LIMIT ↙</footer></div>
      </ResourceFigure>
      <div className={styles.framework}>{[["SELECT","Which applicants should enter the portfolio?"],["PRICE","Does return compensate for risk?"],["OBSERVE","What does early borrower behaviour reveal?"],["ADAPT","How should cut-offs, channels, limits or strategy change?"]].map(([title,text],i)=><article key={title}><small>0{i+1}</small><h3>{title}</h3><p>{text}</p></article>)}</div>
      <KeyObservation title="The Entimema High-Risk Consumer Lending framework"><p><strong>Select → Price → Observe → Adapt.</strong> Sustainable performance comes from operating the entire risk-economic system, not minimising one risk metric.</p></KeyObservation>
    </section>

    <section id="monitoring">
      <h2>What should be monitored weekly and monthly?</h2>
      <p>Cadence should reflect product speed, data maturity and materiality. Fast origination signals may warrant weekly review; seasoned loss and vintage economics may require monthly or maturity-aligned interpretation.</p>
      <div className={styles.monitor}>{[["Acquisition","Applications · eligible population · channel mix · CAC · fraud indicators"],["Decisioning","Approvals · declines · score bands · cut-off density · loan amount · pricing"],["Early performance","Disbursements · first payment · FPD · early DPD · first-time vs repeat"],["Portfolio risk","Bad rate · expected vs realised loss · bands · channels · vintages · concentration"],["Economics","Revenue · credit loss · collections cost · contribution · marginal band value"],["Operations","Collections inflow · contact capacity · workload · cure · external placement"]].map(([title,text])=><article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      <p>The conversation should end with a decision: maintain, investigate, tighten, loosen, reprice, resize, constrain a channel or expand capacity. Metrics without a strategy response do not close the loop.</p>
      <p><strong>Resolve:</strong> high-risk consumer lending is not a search for risk-free borrowers. It is the disciplined construction of a portfolio whose revenue, credit loss, acquisition, servicing and collections economics remain sustainable—within appetite, policy and operational capacity.</p>
    </section>
  </>;
}
