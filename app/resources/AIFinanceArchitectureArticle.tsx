import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

/** FIR-15 — Financial Architecture. Example amounts, policies and decisions are fictional. */
export const aiFinanceArchitectureSections = [
  { id: "responsibilities", label: "Allocate responsibility" },
  { id: "boundaries", label: "Define method boundaries" },
  { id: "orchestration", label: "Orchestrate evidence and state" },
  { id: "precedence", label: "Give controls precedence" },
  { id: "exceptions", label: "Route review and abstention" },
  { id: "example", label: "Resolve the financial example" },
  { id: "lineage", label: "Preserve the evidence chain" },
  { id: "governance", label: "Govern changes separately" },
  { id: "evaluation", label: "Measure controlled throughput" },
  { id: "failures", label: "Recognise false progress" },
  { id: "execution", label: "Define the product boundary" },
] as const;

export default function AIFinanceArchitectureArticle() {
  return <>
    <p className={styles.leadParagraph}>Three files arrive: a management P&amp;L in Excel, a statutory Balance Sheet in PDF and a year-to-date trial-balance export. Within moments, an AI system produces mapped statements, liquidity ratios, margin analysis and a polished executive narrative. The response is fluent. The ratios calculate. The financial conclusion remains unsafe.</p>
    <p>The P&amp;L is monthly; the trial balance is cumulative. The Balance Sheet uses EUR thousands. Restricted cash appears available, current debt remains non-current, one account is counted twice and the accounting equation fails. Much of the interpretation was correct. That does not establish financial validity. The architectural question is which method owns each responsibility, and what evidence permits the next transition.</p>
    <KeyObservation title="Executive thesis">Model intelligence interprets meaning and proposes explanations. Deterministic logic owns arithmetic and financial controls. Humans retain material judgement. Orchestration connects these responsibilities through explicit state and evidence lineage. <strong>Interpretation proposes. Controls test. Human judgement resolves material uncertainty.</strong></KeyObservation>

    <section id="responsibilities">
      <h2>Allocate responsibility according to the problem</h2>
      <ResourceTable caption="Three-responsibility architecture" headers={["Model intelligence", "Deterministic logic", "Human judgement"]} rows={[
        ["Interpret heterogeneous evidence", "Calculate and test defined relationships", "Resolve material uncertainty"],
        ["Propose mappings and competing hypotheses", "Enforce accounting identities and release conditions", "Approve policy, assumptions and exceptions"],
        ["Explain validated results", "Preserve reproducible inputs and outputs", "Retain final economic authority"],
      ]} />
      <p>Finance combines semantic, deterministic and judgement problems. Recognising a statement, interpreting an unfamiliar account label or asking whether a note changes the meaning of cash requires context. Adding subtotals, calculating a ratio or reconciling opening balances to closing requires reproducible execution. Choosing between defensible treatments or accepting residual uncertainty requires accountable authority.</p>
      <p>Technical architecture should follow the structure of the problem rather than forcing every task into the same method. A task can cross all three boundaries: the model identifies a likely maturity, code applies an approved classification rule, and a reviewer resolves conflicting evidence. Assign ownership to the individual operation, not to an entire document or an agent name.</p>
      <ResourceTable caption="Responsibility matrix: primary ownership and supporting roles" headers={["Responsibility", "Model intelligence", "Deterministic logic", "Human judgement"]} rows={[
        ["Document interpretation", "Primary semantic interpretation", "Structural checks", "Review material ambiguity"],
        ["Field extraction", "Interpret cells and headers", "Type, range and completeness", "Resolve material exceptions"],
        ["Period harmonisation", "Identify likely period meaning", "Apply approved transformation", "Approve disputed treatment"],
        ["Canonical mapping", "Propose and explain", "Enforce scope and cardinality", "Resolve material ambiguity"],
        ["Arithmetic", "No ownership", "Primary calculation authority", "Approve policy, not arithmetic"],
        ["Reconciliation", "Suggest possible causes", "Calculate differences", "Resolve source conflicts"],
        ["Confidence", "Produce scoped estimate", "Apply controls and thresholds", "Set material review policy"],
        ["Findings", "Interpret validated results", "Supply controlled metrics", "Approve material conclusions"],
        ["Decision", "Support reasoning", "Enforce fixed constraints", "Final authority"],
      ]} />
      <p>Ownership must remain visible when tools are combined. A model invoking a calculator does not acquire authority to approve its inputs. A rule returning a classification does not establish that the source meaning was resolved. A reviewer signing a report does not prove that every dependent calculation has rerun.</p>
    </section>

    <section id="boundaries">
      <h2>Make each method’s limits executable</h2>
      <h3>Interpretation produces a proposal with evidence</h3>
      <p>Model intelligence can identify document types, table boundaries, headers and row hierarchy; interpret local language and accounting terminology; propose canonical mappings; detect ambiguity; compare explanations; formulate targeted questions; and prioritise findings. Its output should distinguish observed evidence, supported inference and unresolved hypothesis. “The note states restricted” is evidence; “this balance is unavailable for ordinary payments” requires the restriction’s scope.</p>
      <p>Return the source location, proposed concept, alternatives, confidence scope and unresolved conditions alongside the value. A narrative without those fields is difficult to control. A model may calculate correctly in individual cases, but material financial control requires reproducible ownership, explicit rules and independent verification. Exact aggregation, exhaustive duplicate detection, consistent thresholds and policy approval should not depend on generated prose.</p>
      <h3>Rules calculate what has been defined</h3>
      <p>Deterministic logic owns numeric parsing, sign normalisation, unit conversion, approved currency conversion and period transformation. It aggregates values, recalculates totals, tests duplicates and omissions, and evaluates accounting identities. Ratios, horizontal and vertical analysis, price-volume-mix bridges, working-capital calculations, cash reconstruction, thresholds, routing conditions and residuals belong to this layer.</p>
      <Formula label="Core identities, applied to explicitly defined populations">Assets = Liabilities + Equity<br />Gross profit = Revenue − Cost of sales<br />Closing cash = Opening cash + Operating cash + Investing cash + Financing cash + FX<br />Total variance = Sum of driver effects + Residual</Formula>
      <p>Every rule needs a version, input contract, parameters, tests and retained output. Currency conversion requires an approved rate source, date and method. A monthly movement derived from cumulative figures requires compatible reporting boundaries and opening-period evidence. Consistency cannot resolve ambiguity: dividing an annual total by twelve is reproducible, but it does not establish monthly performance.</p>
      <h3>Humans decide where evidence leaves material alternatives</h3>
      <p>Human judgement owns disputed classification, policy-dependent treatment, source-authority conflicts, material non-recurring adjustments and consequential assumptions. It also owns acceptance of bounded limitations and the management action. Reviewers should resolve the smallest material uncertainty; asking them to repeat every extraction and calculation merely recreates manual processing around an automated interface.</p>
      <p>A review package contains the affected value, exact evidence, proposal, alternatives, confidence scope, failed or missing controls, materiality, downstream effect and targeted question. Record the pre-review state, decision, rationale, evidence, authority, scope, timestamp and version. The decision authorises a treatment; deterministic recalculation then establishes its financial consequences.</p>
    </section>

    <section id="orchestration">
      <h2>Orchestrate a financial state, not a conversation</h2>
      <ResourceFigure label="Financial orchestration across four responsibility layers" caption="Each layer produces evidence and an explicit permission for the next. A blocked dependency cannot be bypassed by a fluent response.">
        <div>
          <EntimemaFramework title="1. Evidence Understanding" description="Model interpretation with deterministic structural checks" steps={["Intake → Document interpretation", "Field extraction → Source lineage"]} />
          <EntimemaFramework title="2. Financial Structuring" description="Proposed meaning, approved transformations and targeted judgement" steps={["Period and unit harmonisation", "Canonical mapping → Comparable observations"]} />
          <EntimemaFramework title="3. Control and Review" description="Deterministic integrity and governed exception routing" steps={["Validation → Reconciliation", "Confidence and materiality → Exceptions", "Human review or abstention"]} />
          <EntimemaFramework title="4. Analysis and Decision" description="Controlled calculations, interpreted findings and human authority" steps={["Validated financial model → Deterministic metrics", "Evidence-linked findings → Management decision"]} />
        </div>
      </ResourceFigure>
      <p>Register source versions, entity, period, currency, units, authority and intended use before interpretation. Extract values with field locations and retain originals beside transformations. Model proposals enter a canonical structure only through scope and cardinality checks. Reconciliation then produces control results, not merely a revised statement. Confidence and materiality determine permitted routing within those constraints.</p>
      <p>Received means registered, not interpreted. Interpreted means likely structure and meaning identified; extracted means values retain source locations. Harmonised means approved period, unit, currency and sign treatments were applied; mapped means canonical assignments exist. None of these states means validated. The <Link href="/resources/traceable-financial-analysis-workflow">end-to-end financial workflow</Link> establishes these stage contracts.</p>
      <ResourceTable caption="Readiness states and permitted consequences" headers={["State", "Meaning and permission"]} rows={[
        ["Interpretation pending", "Meaning unresolved; no dependent analysis"],
        ["Validation required", "Semantic proposal exists; controls incomplete"],
        ["Review required", "Material uncertainty awaits authorised judgement"],
        ["Blocked", "Critical control or required-evidence failure holds affected uses"],
        ["Abstained", "Unsupported output deliberately withheld; next action recorded"],
        ["Ready with limitations", "Bounded uncertainty disclosed for a specified use"],
        ["Analysis ready", "Inputs and controls support the intended analysis"],
        ["Decision-ready", "Findings, evidence and required approvals support intended use"],
        ["Completed", "Versioned findings and traceable deliverable produced"],
      ]} />
      <p>State belongs to an output and its dependency set. An unresolved debt maturity can block liquidity while a separately validated revenue view progresses. Completion must never imply universal readiness. A changed source or reviewer treatment invalidates dependent calculations, findings and approvals; unaffected outputs retain their own evidence state. A message saying “done” cannot override that transition logic.</p>
      <p>Each hand-off needs an execution contract: accepted input versions, required fields, preconditions, responsible method, emitted evidence, failure state and authorised next action. A model should propose a mapping against a fixed source snapshot; code should reject a proposal referring to a superseded snapshot. A delayed reviewer response must likewise be checked against the current exception version before it can release anything.</p>
      <p>Retries must not duplicate financial effects. Re-extracting a file should create a proposed revision or reuse an identified observation, not add its balances again. Replaying an approved calculation should reproduce its result without issuing another approval or publication. This separates execution reliability from semantic performance: an accurate model can still sit inside a workflow that mishandles repeated delivery.</p>
    </section>

    <section id="precedence">
      <h2>Confidence informs routing; critical controls have precedence</h2>
      <p>Confidence must name its object: document classification, table detection, field extraction, period interpretation, unit or currency interpretation, canonical mapping, or finding interpretation. Accurate character recognition does not prove the correct reporting period. A document average must not conceal uncertainty in the one debt field that determines a material liquidity conclusion.</p>
      <p>Confidence is not accuracy, accounting validity, source sufficiency or decision readiness. Calibration requires measured performance for the relevant task and population; a score without that context is only a signal. NIST’s <a href="https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf">Generative AI Profile</a> identifies confidently presented false or erroneous content as a distinct risk. Financial routing therefore needs evidence beyond the confidence of the response.</p>
      <Formula label="Control precedence, regardless of model confidence">Failed critical control ⇒ Affected output blocked</Formula>
      <EntimemaFramework title="Control-precedence routing" steps={["Model proposal → Deterministic controls", "Source sufficiency and control status → Materiality and intended use", "Progress / Review / Block / Abstain"]} />
      <ResourceTable caption="Illustrative routing policy, not universal confidence thresholds" headers={["Confidence", "Controls and evidence", "Materiality", "Outcome"]} rows={[
        ["High", "Pass; sufficient evidence", "Low or material", "Progress only within approved scope and authority"],
        ["High", "Critical failure", "Any", "Block affected output"],
        ["Medium", "Pass; sufficient evidence", "Low", "Disclose limitation or sample under policy"],
        ["Medium", "Pass", "Material", "Review required"],
        ["Low", "Pass", "Low", "Review, defer or abstain under policy"],
        ["Any", "Required evidence insufficient", "Material", "Withhold conclusion; request evidence"],
        ["Any", "Ambiguous policy treatment", "Material", "Authorised human decision required"],
      ]} />
      <p>Materiality combines value, sensitivity, decision impact and policy. Small amounts can be decisive near a covenant boundary; a large familiar balance may require no new semantic judgement. Materiality governs escalation, not whether an identity is true. Define criticality before execution, and do not downgrade a failed critical control because the model sounds persuasive.</p>
      <p>Control results must distinguish pass, fail, not applicable and not executed. Missing prerequisites cannot produce a pass. A zero residual proves only the tested relationship within the specified population and tolerance; offsetting mistakes can preserve it. Pair totals with source completeness, mapping cardinality, classification evidence and cross-statement checks. Record any rounding tolerance and investigate differences outside its approved purpose.</p>
      <p>The <Link href="/resources/financial-data-validation-control-layer">validation framework</Link> and <Link href="/resources/confidence-human-review-ai-finance">confidence and review framework</Link> supply complementary tests. Progress requires source sufficiency, resolved meaning, appropriate confidence, completed controls, permitted exception status, required review and lineage completeness. No weighted average should compensate for a missing mandatory condition.</p>
    </section>

    <section id="exceptions">
      <h2>Make abstention and exceptions useful operating outcomes</h2>
      <p>Abstain when evidence cannot establish a period, unit, currency or material mapping; when critical reconciliation remains unresolved; or when the requested conclusion exceeds the supported scope. Blocking describes the dependency’s prohibition. Abstention records the decision not to produce an unsupported output. Both can coexist while other validated work continues.</p>
      <p>An abstention identifies the affected output, reason, missing evidence, materiality, downstream consequence, targeted question, next permitted action, owner and status. “Cannot determine available liquidity until the restriction note and debt schedule are confirmed” is operationally useful. “Low confidence” alone does not tell anyone how to resolve the case.</p>
      <ResourceTable caption="Route by exception nature" headers={["Exception", "Owner and action", "Permitted state"]} rows={[
        ["Ambiguous account meaning", "Semantic reviewer examines alternatives", "Review required"],
        ["Subtotal mismatch", "Control owner investigates population and arithmetic", "Blocked when critical"],
        ["Disputed policy", "Authorised finance owner approves scoped treatment", "Review required"],
        ["Missing source", "Evidence owner supplies authoritative version", "Evidence request; affected output withheld"],
        ["Immaterial formatting issue", "Data owner records warning", "Progress if meaning and controls unaffected"],
        ["Bounded residual uncertainty", "Decision owner accepts disclosed scope", "Ready with limitations where policy permits"],
      ]} />
      <p>Each exception is a retained object: affected value or relationship, stage, class, source evidence, model proposal, control result, confidence, materiality, downstream effect, owner, action, status, resolution and provenance. Informational warnings, review requests, blocking failures, evidence requests, abstained outputs, accepted limitations and resolved exceptions are distinct. Resolution requires evidence and rerun controls, not simply closing a notification.</p>
      <p>A controlled refusal to produce an unsupported conclusion is more valuable than a fluent answer that conceals uncertainty. Conversely, sending every uncertain field to a human wastes scarce judgement. Group related issues, prioritise affected decisions and reuse approved context only within its scope. Current contradictory evidence must reopen the question.</p>
    </section>

    <section id="example">
      <h2>One controlled run changes the liquidity conclusion</h2>
      <p>Consider a fictional mid-sized operating company. All amounts, treatments and decisions below are illustrative, not customer data or universal thresholds. Its monthly management P&amp;L, statutory Balance Sheet and year-to-date trial balance arrive first; a debt schedule and restricted-cash note complete the evidence package. The purpose is to assess available cash against current debt and identify the next treasury action.</p>
      <h3>Interpretation retains alternatives</h3>
      <p>The model identifies table boundaries, monthly versus cumulative periods, EUR-thousands presentation, positive P&amp;L expenses and debit-credit trial-balance orientation. It proposes cash and debt mappings, flags a potentially non-recurring operating-income item and incorrectly assigns one debt balance to non-current liabilities. Another high-confidence semantic proposal assigns the same EUR 0.6m receivable to two asset concepts.</p>
      <p>The original cumulative trial balance cannot establish a monthly P&amp;L movement alone. The workflow requests the compatible preceding cumulative export before deriving the month; meanwhile, independently validated monthly P&amp;L values remain available on their own basis. Once supplied, matching scope and accounting basis permit subtraction. Stock balances remain closing observations, never monthly differences.</p>
      <h3>Deterministic controls stop the affected conclusion</h3>
      <p>Code multiplies PDF amounts by 1,000, normalises debit-credit and expense presentation signs, checks period boundaries, tests mapping cardinality and recalculates subtotals. The same source observation appearing twice triggers a duplicate failure. The accounting-equation control identifies EUR 0.6m excess mapped assets. The Balance Sheet and dependent liquidity conclusion are blocked despite high mapping confidence.</p>
      <ResourceTable caption="Balance Sheet control: EUR million, fictional" headers={["Component", "Initial mapped", "Corrected"]} rows={[
        ["Cash, including restricted cash", "5.0", "5.0"],
        ["Other assets", "15.6", "15.0"],
        ["Total assets", "20.6", "20.0"],
        ["Current debt", "3.6", "5.1"],
        ["Non-current debt", "4.4", "2.9"],
        ["Other liabilities", "4.0", "4.0"],
        ["Equity", "8.0", "8.0"],
        ["Liabilities plus equity", "20.0", "20.0"],
        ["Assets less liabilities and equity", "0.6", "0.0"],
      ]} />
      <p>These are separate defects. The duplicate causes the EUR 0.6m imbalance. The EUR 1.5m maturity error changes current versus non-current debt without changing total liabilities. Removing the duplicate alone would restore balance but leave liquidity misclassified. Restriction affects cash availability, not whether cash remains an asset. An equation cannot settle either semantic question.</p>
      <h3>Review resolves evidence and scope</h3>
      <p>The control owner rejects the duplicated mapping while preserving its original proposal. The reviewer confirms the EUR 1.5m transfer to current debt using the schedule and records the relevant maturity evidence. The restricted-cash note confirms EUR 1.2m unavailable for ordinary payments. A targeted clarification supports treating the operating-income item as non-recurring for management comparison only; statutory presentation remains unchanged.</p>
      <p>The reviewer records authority, rationale, source locations, effective period and decision version. Any recurring-performance finding remains withheld until the income treatment is supported. The system abstains from the final liquidity conclusion while critical issues remain open, but does not discard unaffected validated P&amp;L observations. The accepted treatments trigger recalculation rather than manual overwriting of the final narrative.</p>
      <h3>Recalculation establishes the permitted analysis</h3>
      <p>Corrected assets equal EUR 20.0m; liabilities of EUR 12.0m plus equity of EUR 8.0m also equal EUR 20.0m. Source and canonical populations reconcile without duplication. The supporting total-debt schedule gives EUR 7.6m opening plus EUR 0.8m borrowing less EUR 0.4m repayment equals EUR 8.0m closing, with no other movements in this example. The maturity transfer changes no total debt.</p>
      <Formula label="Available cash, EUR million">5.0 − 1.2 = 3.8</Formula>
      <Formula label="Immediate cash coverage of current debt">3.8 ÷ 5.1 × 100 ≈ 74.5%</Formula>
      <EntimemaFramework title="Worked-example state transition" steps={["Interpreted → Validation failed → Blocked", "Human review → Recalculated", "Analysis ready → Decision"]} />
      <p>The ratio compares a cash stock with the current-debt balance; it is not a forecast of payments due today and does not prove solvency. It excludes future operating flows, other payment obligations and possible facilities. EUR 1.3m is the difference between available cash and current debt, not an established funding shortfall on a particular date.</p>
      <p>The finding should cite the available-cash calculation and current-debt schedule separately. Its statement about restricted cash is supported by the note; its recommendation to review funding is an interpretation of the combined evidence. A claim that refinancing is available would remain an unsupported hypothesis until facility terms and lender evidence establish it. This separation keeps a useful recommendation from becoming an invented financing assumption.</p>
      <KeyObservation title="Controlled finding">Reported cash is EUR 5.0m, but only EUR 3.8m is available for ordinary liquidity purposes. Available cash covers approximately 74.5% of EUR 5.1m current debt. A duplicated mapping caused the reconciliation failure; an incorrect maturity classification separately understated current debt. Both issues were resolved before this finding was released.</KeyObservation>
      <DecisionImplication>The evidence supports investigating short-term funding, reviewing the cash forecast, preserving the corrected debt mapping, monitoring restricted-cash release conditions and disclosing the non-recurring income treatment. The run is decision-ready for that investigation, not for concluding that all future obligations can be met.</DecisionImplication>
    </section>

    <section id="lineage">
      <h2>Preserve the financial chain behind every material claim</h2>
      <EntimemaFramework title="Inspect a decision backwards" steps={["Decision → Finding → Metric", "Calculation → Validated canonical values", "Mappings and transformations → Extracted fields", "Source locations → Source documents"]} />
      <p>Retain source version, rule version, mapping version, calculation inputs, validation results, model proposal, reviewer intervention, timestamps, processing state and published-output version. A reviewer must be able to inspect the exact values behind 74.5%, the restriction and maturity decisions behind those values, and the evidence that supported them at publication.</p>
      <p>Prompt logs can explain an interaction without preserving a financial dependency. They do not establish which row contributed twice, which transformation converted thousands, or which approval became stale. The <Link href="/resources/financial-data-lineage">financial data lineage framework</Link> therefore treats relationships and interventions as first-class records. Auditability here means inspectability and reproducibility, not a certification or a claim of immutable infrastructure.</p>
      <p>Preserve the original release when evidence changes. A later restriction release creates a new available-cash observation and recalculated finding; it must not silently rewrite the prior conclusion. Reproduction fixes the source and rule versions, while a new interpretation is a new proposal. These are different operations even if the interface offers both through the same conversation.</p>
    </section>

    <section id="governance">
      <h2>Govern model, rule and authority changes separately</h2>
      <ResourceTable caption="Five governance objects with distinct release evidence" headers={["Object", "Required governance"]} rows={[
        ["Model", "Version, instructions, evaluation set, domain scope, extraction and mapping performance, calibration, error classes, monitoring and fallback"],
        ["Rule", "Definition, owner, effective date, tests, version, thresholds, dependencies, approval and change history"],
        ["Mapping", "Source scope, canonical target, confidence, reviewer, effective period, reuse boundary and contradictory evidence"],
        ["Human review", "Role, authority, evidence, decision, rationale, timestamp and downstream impact"],
        ["Workflow", "State transitions, blocking conditions, routing, approval points, output permissions and monitoring"],
      ]} />
      <p>A model upgrade requires semantic evaluation; a reconciliation-rule change requires exact expected results. A mapping approval does not authorise changes to either. Test changes against normal cases, known ambiguities, duplicate populations, missing sources, contradictory evidence and previously resolved exceptions. Compare changed outputs and routing before releasing the new version; retain a route back to the approved configuration.</p>
      <p>NIST’s <a href="https://airc.nist.gov/airmf-resources/airmf/5-sec-core/">AI RMF Core</a> calls for differentiated human-AI roles and defined tasks and methods. The finance-specific architecture here translates that principle into separate release objects. It is Entimema methodology, not a claim of NIST certification, legal compliance or a universally mandated implementation.</p>
      <p>Reviewer authority needs a boundary as well as a name. A controller may approve a mapping for one entity and period but not change group policy. Reuse should carry that boundary, expiry or review conditions and supporting evidence. Contradictory current sources suspend the precedent; previous approval is useful context, never permission to ignore new facts.</p>
    </section>

    <section id="evaluation">
      <h2>Measure controlled decision throughput</h2>
      <ResourceTable caption="Method comparison: visible strengths and failure boundaries" headers={["Architecture", "Strength", "Failure boundary"]} rows={[
        ["Model-only", "Flexible semantic interpretation", "Arithmetic and controls may be non-reproducible"],
        ["Rules-only", "Exact repeatable execution", "Unresolved semantics become brittle assumptions"],
        ["Human-manual", "Rich contextual judgement", "Slow, variable execution and limited scale"],
        ["Composed workflow", "Method matched to problem type", "Requires explicit orchestration and governance"],
      ]} />
      <p>Composition does not eliminate error. It makes responsibility visible, failure detectable, uncertainty routable and decisions inspectable. Evaluate model classification, extraction, mapping, task calibration, ambiguity detection and error classes separately from reconciliation pass rates, false control triggers, residuals, rule coverage and rule-version defects.</p>
      <p>Workflow measures include straight-through progression, review, block and abstention rates, exception age, resolution time and decision-ready throughput. Human-review measures include correction patterns, disagreement, reversals, repeated exceptions, mapping reuse quality and decision latency. Business outcomes include reproducibility, post-publication corrections, evidence completeness, actionability and recurring execution quality.</p>
      <p>Segment results by task, source family and materiality. A falling review rate can indicate improvement or hidden abstention suppression. Inspect escaped errors and sample apparently successful cases; resolved cases alone create a biased evaluation population. The target is controlled decision throughput, not the maximum percentage processed without human intervention.</p>
    </section>

    <section id="failures">
      <h2>Recognise automation that conceals unfinished work</h2>
      <ResourceTable caption="Failure → Why it looks advanced → Financial consequence → Required control" headers={["Failure", "Apparent progress", "Consequence", "Required control"]} rows={[
        ["Model owns arithmetic", "One intelligent response", "Unstable totals", "Deterministic calculation"],
        ["Generated reconciliation record", "Persuasive explanation", "No tested equality", "Retained control results"],
        ["Rules resolve unknown meaning", "Consistent execution", "Repeatable misclassification", "Semantic evidence gate"],
        ["Confidence treated as accuracy", "Precise score", "False assurance", "Task calibration"],
        ["Confidence overrides failure", "Fast progression", "Invalid release", "Critical-control veto"],
        ["Document confidence average", "Simple dashboard", "Material field concealed", "Scoped field confidence"],
        ["All exceptions equivalent", "Unified queue", "Wrong owner or priority", "Nature and materiality routing"],
        ["Every uncertainty reviewed", "Universal oversight", "Review overload", "Targeted judgement"],
        ["Abstention hidden", "Higher automation rate", "Unsupported findings", "Visible withheld outputs"],
        ["Undefined human authority", "Human in the loop", "Unaccountable approval", "Role and scope contract"],
        ["Proposal history overwritten", "Clean final result", "Intervention invisible", "Preserve pre-review state"],
        ["Decision without evidence", "Approval captured", "Unjustified precedent", "Rationale and reuse scope"],
        ["Old mapping beats new evidence", "Learning reused", "Stale classification", "Contradiction reopens review"],
        ["Commentary before validation", "Early executive insight", "Wrong numbers narrated", "Analysis-ready dependency"],
        ["Polish means completed", "Finished deliverable", "Open controls concealed", "Explicit processing state"],
        ["Prompt logs replace lineage", "Detailed audit log", "Number cannot be traced", "Financial dependency chain"],
        ["Unversioned rule changes", "Rapid improvement", "Irreproducible release", "Versioned tested rules"],
        ["Automation rate is success", "Impressive throughput", "Risk moved downstream", "Decision-quality monitoring"],
        ["Principle claimed as feature", "Complete product story", "Unsupported buyer reliance", "Implementation evidence"],
        ["Generic governance policy", "Formal assurance", "No executable authority", "Controls, owners and release gates"],
      ]} />
    </section>

    <section id="execution">
      <h2>The workflow is the Financial Intelligence product boundary</h2>
      <p>Financial Intelligence is not a generated answer. It is a governed evidence-to-decision workflow in which model intelligence interprets, deterministic logic controls and humans retain authority over material judgement. For Entimema, this defines the architecture to scope and validate; it does not assert that every described control, integration or approval capability is already deployed.</p>
      <EntimemaFramework title="Financial Intelligence execution architecture" steps={["Intelligent Intake → Document understanding → Field extraction", "Period harmonisation → Canonical mapping → Deterministic validation and reconciliation", "Confidence and exceptions → Targeted human review → Validated financial model", "Deterministic analysis → Evidence-linked findings → Traceable deliverable"]} />
      <p>The permanent principles are explicit: semantic interpretation belongs to model intelligence; arithmetic and control belong to code; material judgement belongs to humans. Failed critical controls override confidence. Ambiguity is escalated rather than guessed, abstention is legitimate, field-level lineage survives, and processing state stays visible. Confirmed reviewer decisions may create governed reusable context, but current evidence remains authoritative. Execution must be testable and monitorable.</p>
      <p>The <Link href="/resources/month-end-reporting-workflow">month-end workflow</Link> applies this discipline to recurring release. <Link href="/resources/beyond-spreadsheet-automation">Governed spreadsheet workflows</Link> preserve analytical flexibility while controlling repeatable execution. A meaningful demonstration should expose one failed control, its blocked dependencies, the reviewer’s evidence and the recalculated output, not only a successful narrative.</p>
      <p>The opening files become useful when meaning, calculation and authority agree within a stated purpose. That architecture permits semantic flexibility without losing reproducibility, and human judgement without universal manual processing. The objective is not maximum AI autonomy. It is maximum controlled decision value.</p>
      <DecisionImplication><strong>See a finance workflow where AI interprets, rules control and humans retain judgement.</strong> Explore the <Link href="/services/financial-data">Financial Data service</Link>, or <Link href="/contact">request an Entimema Financial Intelligence demonstration</Link> around one material financial decision and its evidence path.</DecisionImplication>
    </section>
  </>;
}
