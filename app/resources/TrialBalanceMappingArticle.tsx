import Link from "next/link";
import { DecisionImplication, EntimemaFramework, Formula, KeyObservation, ResourceFigure, ResourceTable } from "./ResourceElements";
import styles from "./resources.module.css";

export const trialBalanceMappingSections = [
  { id: "balanced-not-classified", label: "Balanced is not classified" },
  { id: "profile", label: "Profile the source" },
  { id: "interpret", label: "Interpret accounts" },
  { id: "framework", label: "Controlled mapping framework" },
  { id: "cardinality", label: "Mapping cardinality" },
  { id: "sign-maturity", label: "Signs, contra and maturity" },
  { id: "example", label: "Worked mapping example" },
  { id: "confidence", label: "Confidence and review" },
  { id: "validation", label: "Post-mapping controls" },
  { id: "resolve", label: "Validated statements" },
] as const;

export default function TrialBalanceMappingArticle() {
  return <>
    <p className={styles.leadParagraph}>A trial balance is perfectly balanced. The generated Balance Sheet also balances. Yet debt is understated, gross margin is distorted and a material customer credit balance has disappeared inside receivables. Nothing failed arithmetically. The error entered through classification.</p>
    <p>A trial balance contains accounting evidence, but it is not automatically a management-reporting structure, an analytical model or a complete set of financial statements. Local account codes and names must be translated into a controlled financial taxonomy while every reported value remains traceable to its source account, balance, rule, transformation and reviewer decision.</p>
    <KeyObservation title="Executive thesis">A balanced ledger becomes decision-fit only when source structure is valid, account meaning is supported, mapping cardinality is explicit, signs and maturity are controlled, material exceptions reach a reviewer and the resulting statements reconcile without breaking lineage.</KeyObservation>

    <section id="balanced-not-classified">
      <h2>Accounting balance does not prove reporting correctness</h2>
      <p>A trial balance can establish that accounts and balances exist, debit and credit postings agree under the source convention, an accounting population is identifiable and source totals can be preserved. Those are essential controls. They do not establish correct financial-statement classification, current or non-current presentation, permitted offsetting, management dimensions, consolidation treatment, recurring classification or analytical comparability.</p>
      <Formula label="The three distinct control claims">Accounting balance ≠ Reporting classification ≠ Analytical readiness</Formula>
      <p>The distinction is operational. A customer credit balance can remain netted within trade receivables while total assets and liabilities still balance. A restricted deposit can remain inside cash and cash equivalents without changing total assets. A loan can sit entirely in non-current liabilities although part is due within twelve months. Logistics can be classified as administrative expense rather than cost of sales, changing gross margin but not profit.</p>
      <p>Zero debit–credit difference proves that the captured postings balance at the tested level. It does not prove that all genuine account rows were identified, that duplicated export lines were removed, that contra accounts were presented correctly or that a broad account contains only one economic concept. Mapping is therefore controlled interpretation rather than an account-name lookup.</p>
      <DecisionImplication>Before generating statements, define which classification claims the source actually supports. A control total cannot compensate for missing maturity, counterparty or dimensional evidence.</DecisionImplication>
    </section>

    <section id="profile">
      <h2>Profile the population before mapping individual accounts</h2>
      <p>Structural profiling establishes the boundary within which mapping rules are safe. It identifies entity, reporting date and period, accounting basis where known, chart-of-accounts hierarchy, code format, account classes, account names, opening balances, debit and credit movements, closing balances, currency, management dimensions and source-system indicators.</p>
      <p>The profile must distinguish genuine account rows from headers, subtotals, blank separators, system-generated aggregations and duplicated export lines. A subtotal exported alongside its underlying accounts will double value if treated as another posting account. A dormant zero-balance account may remain useful mapping context but should not be confused with missing data. Duplicate codes may be valid across entities and invalid within one entity-period population.</p>
      <ResourceTable caption="Structural profile and the control it enables" headers={["Profile dimension", "Question", "Mapping consequence"]} rows={[
        ["Entity and period", "Whose ledger and which reporting cut-off?", "Select entity-specific rules and effective dates"],
        ["Code hierarchy", "Do prefixes or ranges encode account families?", "Permit controlled range rules where validated"],
        ["Movement and closing balance", "Is the export activity, balance or both?", "Prevent flow and position confusion"],
        ["Currency", "Source, functional or reporting currency?", "Preserve amount basis before translation"],
        ["Dimensions", "Are counterparty, maturity, function or cost centre available?", "Determine whether splits and conditions are supportable"],
        ["Row type", "Account, subtotal, header or duplicate?", "Define the complete, non-duplicated population"],
      ]} />
      <p>Missing required fields change the permissible action. A broad loan account without maturity detail may still map to borrowings at a total level, but it cannot support the current/non-current split. A payroll account without function may support total personnel expense while remaining unsuitable for cost-of-sales and administrative allocation.</p>
    </section>

    <section id="interpret">
      <h2>Code provides structure; name provides semantic evidence; behaviour and context test both</h2>
      <p>Account codes can encode class, local hierarchy, balance-sheet or P&amp;L family, maturity, counterparty type or organisational convention. They are powerful only when the coding scheme is known and stable. The same code can represent different concepts across entities, and a local redesign can change meaning without changing the number of digits.</p>
      <p>Names add semantic evidence but are frequently abbreviated, translated, outdated or too broad. “Deposits” might mean cash placed with a bank, customer deposits received or security deposits paid. “Other income” says little about recurrence. “Loan” does not reveal maturity. “Customer accounts” can contain both debit receivables and credit obligations.</p>
      <p>Interpretation should combine code and name with normal debit or credit orientation, actual balance behaviour, historical patterns, counter-account relationships where available, reporting dimensions, neighbouring accounts, entity context and prior validated mappings. A credit balance in an asset-family code may indicate a contra account, a customer prepayment, an error or a valid reversal; orientation is evidence, not a universal answer.</p>
      <p>Prior mappings require scope. A reviewed classification for Entity A may be a useful precedent for Entity B, but it is not automatically a rule. Entity-specific account design, policy and dimensions can differ. Historical consistency supports classification only when the underlying definition has not changed.</p>
    </section>

    <section id="framework">
      <h2>Controlled mapping separates known rules from unresolved meaning</h2>
      <EntimemaFramework title="Trial Balance to Validated Statements" description="Stable evidence is automated; ambiguity remains visible and material exceptions are routed, not guessed." steps={["Trial Balance", "Structural Profile", "Rules & Semantic Interpretation", "Canonical Mapping", "Confidence & Review", "Validated Statements"]} />
      <p><strong>Deterministic mapping</strong> classifies from explicit controlled evidence: an exact approved account, validated code range, recognised hierarchy, entity-specific rule, known contra relationship, defined maturity attribute or stable reporting dimension. It should own repeatable classifications whose conditions can be tested exactly.</p>
      <p><strong>Semantic mapping</strong> interprets wording, context, economic purpose, neighbouring accounts, financial-statement relationships and reviewed precedents. Model intelligence can propose a likely interpretation and identify contradictions, especially for previously unseen accounts. A proposal is evidence for a decision; it is not a substitute for accounting judgement.</p>
      <p>The design boundary is deliberate. Deterministic code owns arithmetic, fixed classification rules, population completeness, sign transformations and reconciliations. Model intelligence handles semantic interpretation, mapping proposals and ambiguity detection. Human reviewers own material unresolved judgement. No layer should quietly assume another layer’s responsibility.</p>
      <p>A canonical mapped record retains source entity, account code and name, original debit and credit amounts, original closing balance and currency; canonical concept, financial statement and section; current/non-current state; sign rule; mapping type and rule; confidence state; reviewer decision; validation result and source lineage. The canonical model translates local structures without irreversibly flattening them.</p>
    </section>

    <section id="cardinality">
      <h2>Mapping cardinality is a property of source meaning</h2>
      <p>A one-to-one mapping sends one source account entirely to one canonical concept. Several bank accounts may instead form a many-to-one mapping into cash and cash equivalents, subject to restrictions and overdraft treatment. Aggregation is safe only after each member’s scope and presentation are controlled.</p>
      <p>A one-to-many or split mapping is different: one account contains values belonging to several reporting lines. Payroll may split by function, a loan by maturity, a broad expense between operating and capital expenditure, or “other expenses” across economic categories. The split requires item-level detail, a governed dimension or another defensible allocation basis. A label cannot manufacture one.</p>
      <p>Conditional mapping depends on evidence such as balance sign, counterparty, maturity, transaction type, contractual restriction, reporting date or business dimension. Customer accounts with debit balances may remain receivables while credit balances become contract liabilities or payables. The condition and its evidence must be retained with each result.</p>
      <ResourceFigure label="Four mapping-cardinality patterns showing one account to one concept, several accounts to one concept, one account split across concepts and one account classified conditionally by supporting evidence." caption="Cardinality follows the economic content of the source. A reporting template cannot make an unsupported split defensible.">
        <div className={styles.framework04}><ol>{["One source", "One concept", "Many sources", "Aggregate concept", "One mixed source", "Split concepts", "Conditional source", "Evidence test", "Selected concept"].map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}</ol><div>{["One-to-one", "Many-to-one", "Split", "Conditional", "Retained lineage"].map(x => <span key={x}>{x}</span>)}</div></div>
      </ResourceFigure>
      <p>Cardinality should be decided before confidence. A system may be highly confident that “mixed logistics” concerns logistics while still lacking the functional detail required to divide cost of sales from distribution. <strong>High confidence cannot compensate for missing required evidence.</strong></p>
    </section>

    <section id="sign-maturity">
      <h2>Signs, contra accounts and maturity require separate controls</h2>
      <p>Debit amount, credit amount, closing balance, accounting orientation, presentation sign and analytical operator are not synonyms. The original source sign should remain unchanged in lineage while a separate controlled rule derives statement presentation.</p>
      <Formula label="Controlled presentation transformation">Presented value = Source balance × Controlled sign rule</Formula>
      <p>The rule depends on account nature, reporting concept, source convention and required statement presentation. A global reversal is prohibited. Revenue may be stored as credit and presented as positive; an expense may be stored as debit and deducted analytically; a sales-return debit is a contra-revenue item, not an operating expense.</p>
      <p>Accumulated depreciation, doubtful-debt allowances, inventory provisions, valuation allowances and sales returns retain their economic identity even where displayed net against a primary category. Offsetting must be a governed presentation treatment, not loss of source detail. Customer credit balances should not disappear inside receivables, and supplier debit balances should not automatically reduce payables if the reporting requirement calls for separate asset presentation.</p>
      <p>Current/non-current classification may depend on contractual maturity, expected settlement, operating cycle, refinancing facts, restricted use and conditions at the reporting date. Loans, lease liabilities, provisions, deposits and receivables can contain both states. Account names rarely provide enough evidence for an item-level split.</p>
      <p>Restricted cash illustrates the interaction. A deposit may be cash in an everyday sense but unavailable for general use. Its restriction, term and purpose determine statement classification and analytical liquidity. Classifying it solely because the account name contains “bank” would overstate accessible liquidity without changing total assets.</p>
    </section>

    <section id="example">
      <h2>A balanced fictional ledger can support the wrong financial story</h2>
      <p>The illustrative trial balance below uses positive values for debit balances and negative values for credit balances. Its seventeen accounts sum to zero. The fictional entity has €3.09m of assets after controlled presentation, €1.70m of liabilities, €0.30m of opening equity and €1.09m of current-period profit.</p>
      <ResourceTable caption="Illustrative trial-balance mapping (€000)" headers={["Code", "Source account", "Closing", "Mapping", "Canonical concept", "State", "Required treatment"]} rows={[
        ["1010", "Cash at bank", "300", "1:1", "Cash and cash equivalents", "Automatic", "Approved account rule"],
        ["1020", "Restricted bank deposit", "100", "Conditional", "Restricted financial asset", "Review required", "Restriction and term verified"],
        ["1100", "Trade receivables", "900", "1:1", "Trade receivables", "Automatic", "Gross debtor balance"],
        ["1105", "Doubtful receivables allowance", "−60", "Contra", "Receivables allowance", "Automatic", "Retain identity; present net"],
        ["1110", "Customer credit balances", "−80", "Conditional", "Current liability", "Automatic", "Reclassify by counterparty balance"],
        ["1200", "Inventory", "700", "1:1", "Inventory", "Automatic", "Approved account rule"],
        ["1300", "Property and equipment", "1,500", "1:1", "Property and equipment", "Automatic", "Gross carrying amount"],
        ["1305", "Accumulated depreciation", "−400", "Contra", "Accumulated depreciation", "Automatic", "Retain identity; present net"],
        ["1410", "Supplier debit balance", "50", "Conditional", "Other current asset", "Monitored", "Do not net into payables"],
        ["2000", "Trade payables", "−620", "1:1", "Trade payables", "Automatic", "Approved account rule"],
        ["2200", "Bank loan", "−1,000", "Split", "Current 250 / non-current 750", "Review required", "Contractual maturity schedule"],
        ["3000", "Opening equity", "−300", "1:1", "Opening retained equity", "Automatic", "Equity bridge input"],
        ["4000", "Revenue", "−2,400", "1:1", "Revenue", "Automatic", "Credit becomes positive presentation"],
        ["4010", "Sales returns", "120", "Contra", "Contra-revenue", "Automatic", "Deduct from gross revenue"],
        ["5100", "Payroll expense", "850", "1:1", "Operating expenses", "Automatic", "Function not further split"],
        ["5200", "Mixed logistics", "500", "Split", "Cost of sales 350 / distribution 150", "Override", "Reviewed cost-centre evidence"],
        ["7000", "Other operating income", "−160", "Split", "Recurring 40 / non-recurring 120", "Review required", "Supporting transaction detail"],
      ]} />
      <p>The controlled source total is zero: debit balances of €5.02m equal credit balances of €5.02m. Mapping does not change that population. It creates explicit presentation and split records whose children sum to each parent.</p>
      <p>Naïve automation would classify the restricted deposit as available cash, net the €80k customer credit against receivables, reduce payables by the €50k supplier debit, place the entire €1.00m loan in non-current debt, classify all logistics below gross profit and treat all other operating income as recurring. The Balance Sheet could still balance, but accessible liquidity would be overstated, current liabilities understated by €330k, receivables presentation obscured and gross margin overstated.</p>
      <p>Controlled mapping reports cash and cash equivalents of €300k plus a separate €100k restricted asset. Trade receivables are €840k after the €60k allowance; the customer credit becomes an €80k current liability. Property and equipment is €1.10m net, the supplier debit is a €50k current asset, and inventory is €700k. Assets total €3.09m.</p>
      <p>Liabilities comprise €620k payables, €80k customer credits, €250k current debt and €750k non-current debt: €1.70m. Net revenue is €2.28m after sales returns. Logistics contributes €350k to cost of sales, producing gross profit of €1.93m and an 84.6% gross margin. Payroll of €850k and distribution logistics of €150k are operating expenses; recurring and non-recurring other income of €160k produce operating profit of €1.09m.</p>
      <ResourceTable caption="Controlled statements and reconciliation (€000)" headers={["Control", "Calculation", "Result"]} rows={[
        ["Trial balance", "Debits 5,020 − credits 5,020", "0"],
        ["Gross profit", "Net revenue 2,280 − cost of sales 350", "1,930"],
        ["Operating profit", "1,930 − payroll 850 − distribution 150 + other income 160", "1,090"],
        ["Closing equity", "Opening equity 300 + current result 1,090", "1,390"],
        ["Balance Sheet", "Assets 3,090 − liabilities 1,700 − equity 1,390", "0"],
        ["Mapping completeness", "17 mapped or explicitly reviewed / 17 source accounts", "100% population"],
      ]} />
      <p>The logistics split is a governed human override. The original proposal placed all €500k in distribution expense because the label resembled a commercial cost. Reviewed cost-centre evidence supported €350k of inbound and production logistics in cost of sales and €150k in distribution. The override records its reviewer, evidence, entity, period, scope and reuse decision; it does not become a global rule for every account called logistics.</p>
      <DecisionImplication>The corrected statements do not merely “look cleaner”. They change the management reading: liquidity available for operations is lower, near-term debt service is higher, customer credits are visible, and gross margin is lower than label-only mapping suggested.</DecisionImplication>
    </section>

    <section id="confidence">
      <h2>Automatic classification is a permission earned by evidence</h2>
      <p>Confidence should reflect exact approved rules, code specificity, name clarity, hierarchy consistency, balance orientation, entity precedent, dimensions, historical behaviour, cross-document support, reconciliation effect, contradictions and financial materiality. It should produce an operational state, not an arbitrary model percentage.</p>
      <ResourceTable caption="Mapping decision framework" headers={["Mapping state", "Evidence condition", "Permitted action"]} rows={[
        ["Automatic", "Approved rule, clear cardinality and no material contradiction", "Map and validate"],
        ["Automatic with monitoring", "Strong evidence and immaterial residual uncertainty", "Map, flag and monitor"],
        ["Provisional", "Plausible interpretation but incomplete support", "Exclude from final decision metrics or disclose clearly"],
        ["Review required", "Material ambiguity, split, maturity or contra treatment unresolved", "Route the specific account"],
        ["Blocked", "Source inconsistency or control failure affects statement integrity", "Stop downstream statement generation"],
      ]} />
      <p>An account may be classified automatically only when the source row is structurally valid; entity and period are known; an approved rule or sufficiently supported interpretation exists; cardinality is unambiguous; sign and contra treatment are controlled; required maturity and dimensions are available; no material contradiction is created; post-mapping controls remain valid; the materiality-adjusted threshold is met; and lineage is preserved.</p>
      <p>Human review is mandatory wherever a materially relevant condition fails. A low-value ambiguous account may be provisionally disclosed and monitored. A material debt, revenue, tax or cash account must not be forced into a category because one label appears plausible. Review should target the exception rather than become a manual substitute for the workflow.</p>
      <KeyObservation title="Decision rule">High confidence cannot compensate for missing required evidence. If the classification depends on maturity, restriction, counterparty or split detail, the absence of that detail is a hard evidence gap—not a lower probability to average away.</KeyObservation>
      <h3>Overrides must create governed context</h3>
      <p>Every override records the proposed and approved mappings, reviewer, reason, supporting evidence, entity, scope, effective period, reusability and future-review requirement. It is then classified as a one-time exception, entity-specific rule, reusable precedent or global taxonomy rule. A single correction must never become silent universal memory.</p>
    </section>

    <section id="validation">
      <h2>Post-mapping controls prove preservation, completeness and statement integrity</h2>
      <Formula label="Trial-balance preservation">Σ Debit balances − Σ Credit balances = 0</Formula>
      <Formula label="Population and value preservation">Mapped population + Explicitly unresolved population = Complete source population<br />Σ Source balances = Σ Mapped balances + Explicit transformation adjustments</Formula>
      <p>Balance Sheet, P&amp;L and equity controls add another layer: Assets = Liabilities + Equity; Revenue − Cost of Sales = Gross Profit; Gross Profit − Operating Expenses ± Other Operating Items = Operating Profit; and, where supported, opening retained earnings plus current result and valid equity movements equals closing retained earnings.</p>
      <p>Split mappings require child values to equal their source parent. Many-to-one mappings require every child to appear once. Contra presentation requires gross and allowance records to remain traceable even when the statement displays a net line. Unresolved accounts must remain inside the population control rather than disappear from the generated statements.</p>
      <p>Passing controls is necessary but not semantic proof. Two classification errors can offset. Restricted cash and accessible cash can preserve assets. Current and non-current debt can preserve liabilities. Cost of sales and administrative expense can preserve operating profit. Validation must test both totals and the composition relevant to the decision.</p>
      <ResourceFigure label="Backward evidence lineage from a financial-statement line through canonical concept and mapping rule to source account and source balance." caption="Every reported line retains a reproducible path to accounting evidence and any review decision.">
        <div className={styles.recordFlow}>{["Statement line", "Canonical concept", "Mapping rule", "Source account", "Source balance", "Review evidence"].map(x => <span key={x}>{x}</span>)}</div>
      </ResourceFigure>
    </section>

    <section id="resolve">
      <h2>The output is a governed financial model, not a renamed ledger</h2>
      <p>Controlled trial-balance mapping produces a validated P&amp;L, validated Balance Sheet, stable classifications, visible exceptions, complete account lineage and reusable governed context. Recurring processing becomes faster because known rules are deterministic and review concentrates on genuine change or ambiguity.</p>
      <p>The operating path is <strong>Trial Balance → Structural Profile → Account Interpretation → Canonical Mapping → Confidence and Exceptions → Deterministic Validation → Validated P&amp;L and Balance Sheet → Financial Analysis → Traceable Export.</strong> Within the broader Entimema Financial Intelligence workflow, intelligent intake and interpretation precede harmonisation, mapping, validation, human review and analysis.</p>
      <p>The workflow—not an isolated agent—is the commercial boundary. Model intelligence proposes meaning and detects ambiguity. Deterministic code owns arithmetic, fixed rules and reconciliation. Human reviewers decide material unresolved classifications. The result remains explainable because each statement line can be traced back through its canonical concept and mapping rule to the source account and balance.</p>
      <p>This framework extends FIR-01, <Link href="/resources/financial-data-normalisation">Financial Data Normalisation</Link>, from heterogeneous statement structures into the account-level translation that creates them. It also connects to Entimema’s <Link href="/resources/from-erp-data-to-management-intelligence">ERP data and management intelligence</Link> research and <Link href="/services/financial-data">Financial Data service</Link>.</p>
      <h3>When may an account be classified automatically?</h3>
      <p>Only when the required structural, semantic, cardinality, sign, maturity, materiality, control and lineage conditions are supported. If any materially relevant condition fails, classification stops at the specific exception. That boundary turns automation from a source of invisible reporting risk into a controlled recurring process.</p>
      <DecisionImplication>Test a trial balance against the Entimema canonical financial structure. <Link href="/contact">Discuss a financial intelligence engagement</Link>.</DecisionImplication>
    </section>
  </>;
}
