import { DecisionImplication, EntimemaFramework, KeyObservation, ResourceFigure } from "./ResourceElements";
import styles from "./ai-agents-credit-risk.module.css";

export const aiAgentsCreditRiskSections = [
  { id: "wrong", label: "The wrong architecture" }, { id: "tension", label: "The workflow gap" },
  { id: "pattern", label: "Controlled architecture" }, { id: "engine", label: "Deterministic engine" },
  { id: "agent", label: "Agent responsibility" }, { id: "tools", label: "Tools and evidence" },
  { id: "context", label: "Context and memory" }, { id: "permissions", label: "Permissions and rights" },
  { id: "operating", label: "Operating models" }, { id: "examples", label: "Credit-risk applications" },
  { id: "investigation", label: "Multi-step investigation" }, { id: "trace", label: "Traceability and replay" },
  { id: "guardrails", label: "Guardrails and failures" }, { id: "evaluation", label: "Evaluation and observability" },
  { id: "implementation", label: "Implementation sequence" }, { id: "resolve", label: "Engineering resolve" },
] as const;

const Flow = ({ items }: { items: string[] }) => <div className={styles.flow}>{items.map(item => <span key={item}>{item}</span>)}</div>;

export default function AIAgentsCreditRiskArticle() {
  return <div className={styles.articleBody}>
    <section id="wrong">
      <p className={styles.lead}>A language model placed directly between raw data and a credit decision is not an intelligent shortcut. It is an uncontrolled calculation and decision boundary.</p>
      <div className={styles.wrong}><strong>ARCHITECTURE ENTIMEMA DOES NOT ADVOCATE</strong><div className={styles.formula}>Raw Data → LLM → Credit Decision</div></div>
      <p>This architecture asks a probabilistic reasoning system to infer methodology, perform arithmetic and exercise authority in one opaque step. Inputs may be incomplete; assumptions are not versioned; generated values can be mistaken for calculated values; and identical cases may produce inconsistent decisions. The problem is not that language models are incapable of arithmetic. The problem is that the calculation has no stable computational contract, evidence lineage or independently testable control surface.</p>
      <p>The resulting output is difficult to reproduce and audit. A reviewer cannot reliably separate sourced values from inferred assumptions, verify the model and policy versions used, or replay the decision against the same data snapshot. In a controlled financial workflow, those are architecture defects—not stylistic imperfections.</p>
      <KeyObservation title="Entimema's core AI engineering principle"><p><strong>AI should not replace controlled credit-risk calculations. It should orchestrate them, investigate their outputs and turn analytical evidence into action.</strong></p></KeyObservation>
    </section>

    <section id="tension">
      <h2>The calculation may be automated while the reasoning workflow remains manual</h2>
      <p>Financial institutions already possess substantial analytical intelligence: PD, LGD and EAD models; ECL engines; scorecards; migration matrices; vintage analytics; monitoring systems; policy rules; and validation tests. These systems can produce a technically correct output at portfolio scale.</p>
      <p>Yet expert time is still consumed running analyses, comparing outputs, locating exceptions, tracing drivers, reconciling results, investigating change, assembling evidence, writing commentary and coordinating follow-up. The analytical calculation may already be automated. The reasoning workflow around it often is not.</p>
      <blockquote className={styles.quote}>The Agent reasons about the workflow. Deterministic tools calculate the risk.</blockquote>
      <p>This boundary transforms the question from “Can AI calculate credit risk?” to “How can a controlled reasoning layer reduce the friction between calculation, interpretation, investigation, decision and action?”</p>
    </section>

    <section id="pattern">
      <h2>A controlled architecture separates calculation, reasoning and authority</h2>
      <Flow items={["CONTROLLED DATA", "VALIDATION", "RISK / FINANCIAL ENGINE", "CONTROLLED TOOLS", "AI AGENT", "STRUCTURED EVIDENCE", "HUMAN OR POLICY GATE", "ACTION", "AUDIT / FEEDBACK"]}/>
      <p>The compact pattern is <strong>Data → Deterministic Engine → Structured Evidence → Agent → Controlled Action</strong>. Its extended form makes validation, tools, decision gates and feedback explicit. The Agent sits after and around analytical computation rather than replacing it.</p>
      <ResourceFigure label="Three-layer architecture for controlled AI agents in credit risk." caption="Calculation is deterministic; investigation is evidence-led; decision authority remains explicit.">
        <div className={styles.architecture}>
          <article><h3>Deterministic Layer</h3><Flow items={["Data", "Models", "Calculations", "Rules", "Controls"]}/></article>
          <article><h3>Agent Layer</h3><Flow items={["Investigate", "Compare", "Explain", "Prioritise", "Coordinate"]}/></article>
          <article><h3>Decision Layer</h3><Flow items={["Review", "Approve Action", "Execute", "Audit"]}/></article>
        </div>
      </ResourceFigure>
      <p>Feedback records outcomes and unresolved issues; it does not silently alter approved models or policy. Any learning mechanism must itself pass a controlled change process.</p>
    </section>

    <section id="engine">
      <h2>The deterministic layer owns the financial result</h2>
      <p>PD, LGD, EAD and ECL calculations belong here, as do scorecard execution, migration matrices, vintage metrics, validation metrics, affordability calculations, policy rules and cut-offs. Their common property is a reproducibility contract:</p>
      <div className={styles.evidence}><strong>DETERMINISTIC CONTRACT</strong><div className={styles.formula}>f(X, V) = Y</div><p>For the same controlled inputs <strong>X</strong> and calculation/model version <strong>V</strong>, the expected output <strong>Y</strong> is reproducible.</p></div>
      <p>This layer may use R, Python, SQL, APIs, model services, rules engines or existing banking systems. R is one implementation technology, not the architecture. Language choice matters less than typed inputs, controlled versions, tested logic, reconciliation and stable outputs.</p>
      <p>A deterministic result is not automatically a correct result: data, methodology and implementation can still be wrong. Determinism makes the result inspectable, testable and repeatable so those risks can be controlled.</p>
    </section>

    <section id="agent">
      <h2>The Agent owns investigation—not the approved calculation</h2>
      <div className={styles.cards}>{[
        ["Investigate", "What changed, when did it emerge and which evidence is missing?"], ["Compare", "How does the current result differ from baseline, prior period or benchmark?"],
        ["Explain", "Which measured factors account for the difference, and what remains inferred?"], ["Prioritise", "Which exceptions are persistent, material and decision-relevant?"],
        ["Coordinate", "Which approved tool or workflow should run next?"], ["Summarise and track", "What must the analyst know, decide or resolve next?"]
      ].map(([a,b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>These functions reason across structured evidence. They are fundamentally different from calculating a provision, assigning a score or executing a cut-off.</p>
      <EntimemaFramework title="Do not collapse distinct system types" steps={[
        "Chatbot — primarily responds to messages. An analytical Agent can invoke tools, investigate and maintain workflow state. Its interface may be conversational; its architecture is not.",
        "Predictive model — transforms X into PD or another prediction. An Agent transforms a goal, context, approved tools and evidence into a workflow.",
        "Decision engine — applies controlled rules. An Agent may investigate falling approvals across distributions, cut-offs, policy and mix; it should not rewrite decision logic."
      ]}/>
    </section>

    <section id="tools">
      <h2>Controlled tools bound what the Agent can know and do</h2>
      <div className={styles.formula}>Agent → Tool → Deterministic Result → Agent Reasoning</div>
      <div className={styles.toolGrid}>{["calculate_ecl()", "get_vintage_matrix()", "get_transition_matrix()", "calculate_pd_monitoring()", "run_validation_tests()", "get_decision_trace()", "compare_periods()", "get_reconciliation_exceptions()"].map(x => <code key={x}>{x}</code>)}</div>
      <p>These interfaces are conceptual, not claims about currently implemented Entimema products. In a production system, every tool has a defined input schema, output schema, permissions, owner, version, timeout, failure state and test suite. Controlled tools create bounded capabilities, reproducibility, traceability, structured output, permission control and a clean separation between reasoning and calculation.</p>
      <blockquote className={styles.quote}>The Agent should ask a controlled system “What is the ECL?” rather than inventing the ECL itself.</blockquote>
      <p>Tool results should expose fields such as:</p>
      <pre className={styles.schema}>{`metric
current_value
baseline_value
deviation
population
exposure
as_of_date
source_period
model_version
calculation_version
status
evidence_reference`}</pre>
      <p><strong>No result, zero and successful calculation are different states.</strong> A timeout, empty payload or failed validation must never be coerced into a valid financial value. Results also require freshness controls: <span className={styles.formula}>EvidenceAge = T_current − T_evidence</span>.</p>
    </section>

    <section id="context">
      <h2>Context must retain its source and authority</h2>
      <div className={styles.cards}>{[
        ["General knowledge", "Credit-risk concepts and broadly applicable analytical patterns."], ["Controlled institutional context", "Approved methodology, policy, definitions and operating procedures."],
        ["Current analytical evidence", "Live or period-specific outputs from controlled tools and snapshots."], ["Workflow state", "Investigations performed, approvals given, cases open and actions completed."]
      ].map(([a,b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>The Agent must not treat these sources as interchangeable. General knowledge cannot override institutional policy; a retrieved methodology is not a freshly calculated metric; and conversational history is not an approved analytical input.</p>
      <Flow items={["RETRIEVE", "CALCULATE", "REASON", "ACT"]}/>
      <p><strong>Retrieval</strong> finds existing methodology or evidence. <strong>Calculation</strong> produces a deterministic result. <strong>Reasoning</strong> interprets evidence. <strong>Action</strong> changes workflow or system state. Each transition requires different validation and authority.</p>
      <p>Useful memory can preserve prior investigations, unresolved cases, analyst decisions, explanations and workflow state. Critical financial calculations should not depend on vague conversational memory; controlled systems remain the source of approved inputs.</p>
    </section>

    <section id="permissions">
      <h2>Analytical capability does not imply decision authority</h2>
      <div className={styles.permission}>{[["Read","Inspect results"],["Calculate","Invoke tools"],["Draft","Prepare commentary"],["Recommend","Suggest action"],["Execute","Change state"]].map(([a,b]) => <div key={a}><strong>{a}</strong><small>{b}</small></div>)}</div>
      <p>These permissions should not automatically be identical. An Agent may be analytically capable while having no authority to approve credit, change staging, post provisions or modify model parameters. Separating <strong>analytical authority</strong> from <strong>decision authority</strong> is intentional system design.</p>
      <KeyObservation title="Control principle"><p><strong>In high-stakes financial workflows, intelligence without control is not automation.</strong></p></KeyObservation>
    </section>

    <section id="operating">
      <h2>Begin with the safest architecture that creates real value</h2>
      <h3>Read-only Agent</h3><p>A read-only Agent can inspect outputs, compare periods, identify exceptions, explain movements and prepare evidence while remaining unable to change a model, policy, parameter, accounting entry or credit decision. This already reduces analytical handling and gives reviewers a consistent evidence pack.</p>
      <h3>Human-in-the-loop</h3><Flow items={["AGENT RECOMMENDATION", "HUMAN REVIEW", "CONTROLLED ACTION"]}/><p>Human review is not an embarrassment or temporary limitation. It is a deliberate control layer that allocates accountability while the Agent improves the quality, consistency and speed of review.</p>
      <h3>Human-on-the-loop</h3><p>Where a process, permissions and exception boundaries are sufficiently mature, automation may execute approved actions while humans supervise outcomes and exceptions. This is not universally suitable: authority, reversibility, materiality, legal obligations and operational risk determine where it is appropriate.</p>
    </section>

    <section id="examples">
      <h2>The same boundary supports multiple credit-risk workflows</h2>
      <div className={styles.cards}>{[
        ["Provisioning Agent", "A deterministic ECL engine calculates ECL. The Agent investigates month-on-month movement, stage migration, scenarios, parameters and reconciliation exceptions, then prepares analyst evidence."],
        ["AI Portfolio Analyst", "A vintage engine calculates cohorts, MOB, default rates and baseline deviations. The Agent investigates deteriorating vintages, divergence timing, segment concentration and EAD materiality."],
        ["AI Collections Analyst", "A migration engine calculates transitions, roll-forward, cure and EAD-weighted migration. The Agent investigates worsening transitions, deteriorating cure, concentrations and priority exposures."],
        ["Model Validation Agent", "A validation engine runs discrimination, calibration, stability, parity and benchmark tests. The Agent compares runs, investigates exceptions, drafts findings and tracks remediation."],
        ["Model Monitoring Agent", "A monitoring engine calculates population, score and PD drift, discrimination, calibration and implementation parity. The Agent asks what changed, where, whether it persists and which controlled review is required."]
      ].map(([a,b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>An Agent does not require a separate public R article for every workflow. It requires approved analytical services and well-governed evidence interfaces, whatever their implementation language.</p>
    </section>

    <section id="investigation">
      <h2>Agentic value emerges in evidence-led, multi-step investigation</h2>
      <p>A user asks: <strong>Why did ECL increase 18%?</strong> The Agent plans an investigation, retrieves portfolio movement, stage migration, exposure movement, parameter changes and scenario impact, then identifies the largest contributors. Each new result determines the next approved tool—not a predetermined narrative.</p>
      <Flow items={["QUESTION", "PLAN", "TOOL CALL 1", "EVIDENCE", "TOOL CALL 2", "EVIDENCE", "HYPOTHESIS", "TOOL CALL 3", "CONFIRM / REJECT", "EXPLANATION"]}/>
      <h3>Hypothetical investigation</h3>
      <p>Portfolio ECL increased <strong>14% month-on-month</strong>. Controlled outputs show exposure +2%, Stage 2 EAD +11%, PD effect +3%, LGD effect approximately flat, downside scenario contribution +1%, with concentration in two recent vintages. The defensible conclusion is: <strong>the increase is primarily associated with Stage 2 migration rather than broad LGD deterioration.</strong> These figures are illustrative, not benchmark results.</p>
      <div className={styles.status}><article><strong>Known</strong>Supported by referenced controlled evidence.</article><article><strong>Inferred</strong>A reasonable interpretation, labelled as such.</article><article><strong>Unknown</strong>Insufficient or unavailable evidence.</article></div>
      <p>If portfolio PD rises while realised defaults remain stable and early-stage migration worsens, evidence is mixed. A disciplined output says deterioration is visible in leading indicators but has not yet appeared in realised defaults. It does not force certainty.</p>
      <blockquote className={styles.quote}>Evidence first. Narrative second. Retrieve or calculate → verify → interpret → explain.</blockquote>
    </section>

    <section id="trace">
      <h2>Every conclusion needs inspectable evidence lineage</h2>
      <Flow items={["CONCLUSION", "EVIDENCE", "TOOL CALL", "CALCULATION VERSION", "DATA SNAPSHOT"]}/>
      <p>An <strong>Agent Run ID</strong> connects the investigation to its operational record:</p>
      <pre className={styles.schema}>{`agent_run_id
agent_version
user_request
tools_called
tool_versions
evidence_refs
outputs
human_review
action
timestamp`}</pre>
      <p><strong>Calculation replay</strong> means the same inputs and version return the same analytical output. <strong>Agent investigation replay</strong> reconstructs the tools invoked, evidence received and conclusions produced. Exact wording may differ across probabilistic runs; evidence lineage, permissions and action history must remain inspectable.</p>
    </section>

    <section id="guardrails">
      <h2>Guardrails must control tools, data, calculations and actions</h2>
      <div className={styles.cards}>{[
        ["Tool guardrails", "Allow-list functions, validate arguments, bound retries and expose explicit errors."], ["Data guardrails", "Enforce identity, portfolio scope, field-level access, retention and trusted-source boundaries."],
        ["Calculation guardrails", "Keep approved formulae, parameters, versions and reconciliation deterministic."], ["Action guardrails", "Constrain state changes, require idempotency and provide reversal or compensating controls."],
        ["Human approval", "Route material or irreversible actions to named decision owners."]
      ].map(([a,b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <table className={styles.failure}><thead><tr><th>Failure</th><th>Control breakdown / financial risk</th><th>Mitigation</th></tr></thead><tbody>{[
        ["Uncontrolled arithmetic or hallucinated explanation", "Generated value or narrative is mistaken for approved evidence.", "Require calculation tools, evidence references and claim verification."],
        ["Stale data or wrong model version", "Decision uses an invalid period or methodology.", "Return as-of date, source period and versions; enforce freshness and compatibility."],
        ["Unsupported causal inference", "Association becomes an unjustified driver claim.", "Label inference; test alternatives; constrain causal language."],
        ["Tool output misunderstood or missing evidence", "Units, grain or population are misrepresented.", "Typed schemas, semantic metadata, validation and escalation."],
        ["Silent tool failure", "No result becomes zero or a plausible value.", "Explicit status union; fail closed; prohibit numeric coercion."],
        ["Duplicate or unauthorised action", "Entries, communications or decisions execute twice or without authority.", "Idempotency keys, permission checks, approval gates and action ledger."],
        ["Prompt injection in untrusted content", "Retrieved text attempts to redirect tools or exfiltrate data.", "Treat content as data, isolate instructions, restrict tools and validate destinations."],
        ["Workflow state loss", "Cases are repeated, skipped or falsely closed.", "Durable state store, transitions, checkpoints and reconciliation."],
      ].map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>
      <p>Other material failures include incorrect permissions, contradictory evidence being suppressed and an action executing without the appropriate authority. Controls must be tested against failure—not merely documented.</p>
    </section>

    <section id="evaluation">
      <h2>Evaluate investigation quality, not conversational polish</h2>
      <ul className={styles.checklist}><li><strong>Tool selection:</strong> Were the appropriate tools called in a defensible order?</li><li><strong>Evidence accuracy:</strong> Were values, populations, units and versions represented faithfully?</li><li><strong>Reasoning discipline:</strong> Did conclusions follow evidence without unsupported causality?</li><li><strong>Completeness:</strong> Were material alternative explanations investigated?</li><li><strong>Escalation:</strong> Did the Agent expose uncertainty and failure?</li><li><strong>Action safety:</strong> Did it remain within permissions and approval boundaries?</li></ul>
      <h3>Golden investigations</h3>
      <div className={styles.cards}>{[
        ["A — Stage migration", "ECL increase follows the expected migration drill-down."], ["B — Channel concentration", "Vintage deterioration is isolated to one channel and tested for materiality."],
        ["C — Calibration", "Calibration deteriorates with stable ranking; recalibration investigation is proposed, not automatic redevelopment."], ["D — Tool failure", "Failure is surfaced and escalated; no answer is invented."],
        ["E — Insufficient evidence", "Unknowns and the evidence needed next are explicit."], ["F — Outside authority", "The Agent refuses execution and routes to the controlled workflow."]
      ].map(([a,b]) => <article key={a}><h3>{a}</h3><p>{b}</p></article>)}</div>
      <p>Production observability should monitor Agent runs, tools called, tool latency and failures, evidence freshness, permission denials, human overrides, escalation rate, unsupported-claim rate, duplicate-action prevention and downstream outcomes. Review samples by risk and materiality, not only at random.</p>
    </section>

    <section id="implementation">
      <h2>Implement control before expanding autonomy</h2>
      <div className={styles.steps}>{[
        "Choose one high-value investigation with a named owner and decision boundary.", "Stabilise deterministic engines, versions, snapshots and reconciliations.",
        "Define typed tool contracts, explicit errors and structured evidence references.", "Deploy read-only investigation with draft outputs and mandatory review.",
        "Build golden investigations, adversarial cases and end-to-end observability.", "Introduce recommendation rights only after evidence quality is demonstrated.",
        "Permit bounded execution only where authority, idempotency, monitoring and reversal are designed."
      ].map(x => <div key={x}><strong>{x}</strong></div>)}</div>
      <DecisionImplication><p>The maturity path is not chatbot → autonomous decision-maker. It is <strong>controlled evidence → reliable investigation → explicit recommendation → bounded action</strong>, with governance evidence at every step.</p></DecisionImplication>
    </section>

    <section id="resolve">
      <h2>AI belongs around controlled analytical systems</h2>
      <p>The financial model remains the authority for controlled calculation. The Agent reduces the operational distance between that calculation and an informed, governed response: it finds evidence, chooses approved tools, tests explanations, exposes uncertainty, prepares review and coordinates the next controlled step.</p>
      <KeyObservation title="Engineering resolve"><p><strong>The most valuable financial Agent is not the one that generates the most text. It is the one that reliably reduces the distance between analytical evidence and a controlled decision.</strong></p></KeyObservation>
      <p>That is the transformation: <strong>calculation → interpretation → investigation → decision → action</strong>, connected without collapsing their controls. The result is neither an LLM tutorial nor a claim that AI replaces analysts. It is a system architecture in which deterministic computation, bounded reasoning, explicit authority and human judgement work together.</p>
    </section>
  </div>;
}
