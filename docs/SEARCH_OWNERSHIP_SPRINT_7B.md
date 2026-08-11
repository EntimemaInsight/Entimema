# Sprint 7B — Query Validation, Search Ownership and Resources Architecture

Status: operational search-ownership specification; no public pages or articles created

Foundation: `SEARCH_ARCHITECTURE_SPRINT_7A.md`

Validation date: 2026-08-11

Evidence boundary: classifications combine current search-result intent, semantic fit, likely buyer relevance, commercial proximity, competitive composition, Entimema expertise, and positioning risk. No search-volume, ranking-difficulty, traffic, or conversion figures are claimed. Search Console is not currently integrated or evidenced in the repository, so query tiers are strategic validation—not proof of existing demand.

## 1. Validated query tiers

### Tier definitions

- **Tier 1 — Own:** deliberately establish one canonical commercial owner and build supporting authority.
- **Tier 2 — Support:** relevant concepts that reinforce a Tier 1 owner or are best developed through Resources.
- **Tier 3 — Experiment:** strategically plausible but ambiguous, emerging, or unproven; test before expanding production scope.
- **Tier 4 — Avoid:** wrong audience, commodity intent, misleading service expectation, or unacceptable positioning risk.

### Validation summary

| Query family | Tier | Observed intent and competition | Buyer relevance | Entimema decision |
| --- | --- | --- | --- | --- |
| CFO advisory | 1 | Provider-led advisory results; large firms and finance boutiques | High | Own through CFO Advisory |
| fractional CFO | 2 | Provider-led but commonly bundled with bookkeeping, tax, fundraising, and recurring finance operations | Mixed-high | Support CFO Advisory with explicit qualification; do not make the whole offer synonymous with fractional CFO |
| outsourced CFO | 3 | Often means an outsourced finance department including accounting production | Mixed | Test only with tightly qualified language and enquiry evidence |
| FP&A consulting | 1 | Clear provider intent spanning planning, forecasting, modelling, reporting, and interim support | High | Own through Planning & Forecasting |
| financial forecasting consultant/consulting | 1 | Commercial provider intent, frequently adjacent to FP&A and models | High | Own through Planning & Forecasting |
| financial modelling consultant/services | 3 | Mixed transaction, valuation, fundraising, project-finance, template, training, and FP&A intent | Mixed | Do not assign two owners; validate a future dedicated proposition before targeting |
| scenario analysis/modelling | 2 | Methodological, software, planning, and risk meanings coexist | Medium-high with modifiers | Support Planning, Credit Risk, or Decision Intelligence according to domain modifier |
| management reporting consulting | 1 | Provider intent mixed with BI/EPM and reporting-system implementation | High | Own through Management Reporting; reinforce decision-facing distinction |
| working capital consulting/modelling | 2 | Commercial and educational intent mixed with treasury, restructuring, and optimisation | High when operational | Resource-led support to Planning & Forecasting; test before a dedicated commercial page |
| cost modelling | 1 | Ambiguous across engineering, project estimation, software, and management accounting | High only with business modifiers | Own a qualified business cost-and-margin interpretation through Cost & Margin Management |
| manufacturing cost modelling | 1 | Fragmented academic, definition, engineering, software, and practitioner results | High and differentiated | Own as a specialist Cost & Margin territory, led initially by authority content |
| profitability analysis consulting | 1 | Commercially relevant but can drift into software, investment analysis, and generic accounting | High with product/customer/process modifiers | Own through Cost & Margin Management |
| credit risk consulting | 1 | Mature provider intent occupied by specialist boutiques and large advisory firms | Very high | Own through Credit Risk |
| credit risk modelling | 1 | Strong service, methodology, software, and educational mix | Very high with provider modifier | Credit Risk is canonical commercial owner; technical Resources support it |
| portfolio analytics | 2 | Can mean investment, market, customer, or credit portfolios | High only with credit modifier | Support Credit Risk as “credit portfolio analytics”; avoid unqualified ownership |
| vintage analysis | 2 | Predominantly technical/educational methodology | High expert signal | Authority Resource supporting Credit Risk |
| credit-risk transition matrices | 2 | Technical/research intent with clear risk methodology | High expert signal | Authority Resource supporting Credit Risk |
| SAP management reporting | 1 | Vendor, implementation, product, and consulting results dominate | High for finance/ERP leaders | Financial Data owns the management-information architecture angle, not SAP implementation |
| ERP financial analytics | 1 | Software/vendor and transformation intent | High with management-decision framing | Own through Financial Data |
| decision intelligence | 1 | Increasingly vendor/product-led, but also a recognisable decision-management category | High but competitive/ambiguous | Own through Decision Intelligence with model + rules + governed execution specificity |
| finance AI agents | 3 | Emerging category dominated by software, explainers, and trend content | Potentially high, unproven | Retain existing positioning page; experiment through practitioner authority, not generic acquisition claims |
| risk AI agents | 3 | Emerging and semantically unstable | Potentially high, unproven | Retain existing page; test governed risk-workflow concepts |
| AML consulting/control architecture | 2 | Commercially valid but outside the initial six acquisition priorities | High for regulated organisations | Preserve AML service ownership; build later when evidence and expertise capacity support it |

### Tier 4 exclusions

Avoid bookkeeping, accounting-firm, payroll, tax-return, consumer-credit, loan-broker, mortgage-broker, personal-finance, jobs, salaries, courses, certifications, templates, “cheap CFO,” Excel-freelancer, generic AI-agency, chatbot-agency, and SAP-implementation-partner intent. Broad definitions such as “what is EBITDA” or “what is credit risk” are not acquisition priorities.

## 2. Canonical query ownership matrix

Every Tier 1 concept below has exactly one primary owner.

| Search concept | Market | Language | Intent | Tier | Canonical owner | Current URL | Future URL | Supporting Resources | Commercial proximity | Rationale | Status |
| --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| CFO advisory | Both | English | Commercial | 1 | CFO Advisory | `/services/cfo-function` | — | Finance-function architecture; working-capital system | Direct | Exact service fit | Owned now |
| fractional CFO | Both | English | Commercial | 2 | CFO Advisory | `/services/cfo-function` | — | When finance leadership needs architecture rather than outsourced accounting | Direct but expectation-sensitive | Results frequently bundle accounting and low-cost recurring support | Support/test |
| outsourced CFO | International | English | Commercial | 3 | CFO Advisory, conditionally | `/services/cfo-function` | Possible future page only after evidence | Finance-function maturity | Direct but expectation-sensitive | Often implies whole outsourced accounting function | Experiment |
| FP&A consulting | International/Bulgaria professional | English | Commercial | 1 | Planning & Forecasting | `/services/budgets-and-forecasting` | — | Operational-driver forecasts; scenarios; working capital | Direct | Clear planning-system provider intent | Owned now |
| financial forecasting consulting | Both | English | Commercial | 1 | Planning & Forecasting | `/services/budgets-and-forecasting` | — | Forecast drivers; cash-flow forecasting | Direct | Clear fit with current page | Owned now |
| financial modelling consultant | International | English | Commercial/mixed | 3 | Unassigned pending proposition validation | — | `/services/financial-modelling` only if justified | Driver models; scenarios; decision models | Potentially direct | Mixed transaction, valuation, fundraising, and FP&A intent | Validate gap |
| scenario analysis | International | English | Problem/expert | 2 | Planning & Forecasting for enterprise planning intent | `/services/budgets-and-forecasting` | — | Scenario analysis beyond three cases | Close | Domain modifiers route credit stress to Credit Risk and cross-domain execution to Decision Intelligence | Support |
| management reporting consulting | Both | English | Commercial | 1 | Management Reporting | `/services/management-reporting` | — | Reporting and decision architecture; ERP-to-intelligence | Direct | Owns KPI/reporting rhythm and management action | Owned now |
| working-capital modelling | Both | English | Problem/commercial | 2 | Planning & Forecasting | `/services/budgets-and-forecasting` | Dedicated page only after evidence | Working Capital Is a System; cash-flow architecture | Close | Planning owns forward-looking driver and cash mechanics | Resource-first |
| cost modelling | Both | English | Commercial/mixed | 1 | Cost & Margin Management | `/services/cost-and-profitability` | — | Decision cost; allocation; manufacturing cost | Direct | Qualified cost architecture fits the offer | Owned now |
| manufacturing cost modelling | International/Bulgaria professional | English | Commercial/expert | 1 | Cost & Margin Management | `/services/cost-and-profitability` | — | Manufacturing Cost Architecture | Direct | Distinctive specialist intersection with sparse practitioner depth | Build authority |
| profitability analysis | Both | English | Commercial/problem | 1 | Cost & Margin Management | `/services/cost-and-profitability` | — | Gross margin; product/customer profitability | Direct | Page already owns cost and profitability mechanics | Owned now |
| credit risk consulting | Both | English | Commercial | 1 | Credit Risk | `/services/credit-risk` | — | Vintage; transitions; stress testing | Direct | Exact specialist provider fit | Owned now |
| credit risk modelling | Both | English | Commercial/expert | 1 | Credit Risk | `/services/credit-risk` | — | Model governance; segmentation; transitions | Direct | Page connects models to policy and portfolio decisions | Owned now |
| credit portfolio analytics | International | English | Commercial/expert | 2 | Credit Risk | `/services/credit-risk` | — | Portfolio averages; vintage analysis; stress | Direct with modifier | Unqualified “portfolio analytics” is too broad | Support |
| SAP management reporting | Both | English | Commercial/problem | 1 | Financial Data | `/services/financial-data` | — | SAP reporting layer; ERP-to-intelligence | Direct | Own finance data/semantic architecture, not implementation | Build authority |
| ERP financial analytics | International | English | Commercial/problem | 1 | Financial Data | `/services/financial-data` | — | ERP-to-intelligence; reconciliation architecture | Direct | Current page owns trusted ERP/reporting foundation | Owned now |
| decision intelligence | International | English | Commercial/category | 1 | Decision Intelligence | `/services/decision-automation` | — | Decision models; governed decision flows | Direct | Existing service translates category into executable architecture | Owned now |
| finance AI agents | International | English | Emerging commercial | 3 | Finance AI Agents | `/services/financial-ai-agents` | — | Roles, controls, and trusted context | Potentially direct | Category demand and terminology are unproven | Experiment |
| risk AI agents | International | English | Emerging commercial | 3 | Risk AI Agents | `/services/risk-ai-agents` | — | Bounded autonomy for regulated decisions | Potentially direct | Category demand and terminology are unproven | Experiment |

## 3. Current commercial page map

| Page | Primary search intent | Secondary concepts | Commercial purpose | Audience | Internal-link role |
| --- | --- | --- | --- | --- | --- |
| `/` | Brand and category intersection | financial architecture, decision science, governed AI | Explain Entimema's integrated proposition | Executive/functional leaders | Upstream gateway to services, trust, and contact; not a specialist-term owner |
| `/services` | Service portfolio discovery | finance, risk, data, AI capabilities | Help visitors select a discipline | Cross-functional evaluators | Portfolio hub linking to all priority services |
| `/services/cfo-function` | CFO advisory | fractional CFO, finance-function design, management control | Diagnose/build finance leadership capability | Founder, CEO, CFO | Owner of CFO intent; links down to Planning, Reporting, Cost, Data and future finance-architecture Resources |
| `/services/budgets-and-forecasting` | FP&A and forecasting consulting | budgets, rolling forecasts, drivers, scenarios, working capital | Build a planning system | CFO, FP&A leader, CEO | Owner of forward-looking finance; receives Resources on drivers/cash/scenarios |
| `/services/management-reporting` | Management reporting consulting | KPIs, management information, performance reporting | Turn information into management action | CFO, controller, executive team | Owner of decision-facing reporting; bridges Financial Data and Decision Intelligence |
| `/services/cost-and-profitability` | Cost modelling and profitability analysis | manufacturing cost, allocation, margin, drivers | Reveal business economics and actionable profitability | CFO, controller, operations/manufacturing leader | Owner of cost/profitability; anchor for the first authority article |
| `/services/financial-data` | Financial data architecture and ERP analytics | SAP reporting, reconciliation, trusted data | Build the information foundation for reporting/planning/AI | CFO, CIO, ERP/data leader | Owner of ERP/SAP finance-information intent; feeds Reporting, Planning, and AI |
| `/services/financial-ai-agents` | Governed finance-agent workflows | reporting/planning/controlling automation | Establish an emerging controlled-AI offer | CFO, finance innovation/data leader | Experimental category page linked from Data, Planning, and Decision Intelligence |
| `/services/credit-risk` | Credit-risk consulting and modelling | portfolio analytics, stress testing, segmentation, policy | Improve credit decisions and portfolio control | CRO, head of credit risk, lender leadership | Owner of credit intent; destination for vintage/transition/stress Resources |
| `/services/aml-compliance` | AML control architecture | KYC/CDD, screening, monitoring, investigations | Build traceable AML operating control | MLRO, compliance/risk leader | Adjacent specialist service; connects Risk AI and Decision Intelligence |
| `/services/decision-automation` | Decision intelligence | decision models, rules, engines, governed execution | Operationalise analytical and policy logic | COO, CRO, transformation/data leader | Owner of cross-domain decision systems; receives models/uncertainty/governance Resources |
| `/services/risk-ai-agents` | Governed risk-agent workflows | monitoring, analysis, escalation, bounded autonomy | Establish an emerging controlled-risk-AI offer | CRO, MLRO, risk innovation leader | Experimental page supported by Credit Risk, AML, and Decision Intelligence |
| `/about` | Company expertise and trust | finance/risk/data/AI practitioner capability | Support credibility and evaluation | All qualified buyers | Trust destination linked from brand and future author biographies; owns no service query |
| Resources (current `/#analyses`) | Interactive brand demonstration, not editorial search | finance/risk decision illustration | Show analytical-system thinking | Exploratory visitors | Not an indexable Resources hub; must not be treated as canonical editorial architecture |
| `/contact` | Branded/contact intent | project, partnership, existing client | Convert qualified intent using current form | Qualified prospects/partners/clients | Terminal commercial path; topic parameters preserve context |

## 4. Cannibalisation analysis

| Overlap | Primary owner | Supporting page | Relationship rule |
| --- | --- | --- | --- |
| CFO Advisory vs Planning & Forecasting | CFO Advisory owns finance-function design; Planning owns forecasts/budgets/scenarios | Each supports the other | CFO page links to Planning when the problem becomes a planning system; Planning links to CFO when governance/role design is the constraint |
| Management Reporting vs Financial Data | Management Reporting owns KPIs, reporting rhythm, interpretation, and management action | Financial Data owns source structures, semantics, reconciliation, and traceability | ERP/data Resources point primarily to Financial Data and secondarily to Reporting; reporting-design Resources reverse that order |
| Cost & Margin vs Financial Modelling | Cost owns cost/margin/profitability models | Financial modelling remains unassigned | Do not optimise Cost for generic modelling. A future modelling page, if justified, owns cross-purpose model-building services |
| Credit Risk vs Decision Intelligence | Credit Risk owns credit models, policy, portfolios, and monitoring | Decision Intelligence owns generic models/rules/execution architecture | Credit-specific articles and queries remain with Credit Risk; cross-domain decision-engine content links to Decision Intelligence |
| Finance AI Agents vs Decision Intelligence | Finance AI owns agent roles in finance workflows | Decision Intelligence owns decision logic, rules, policy, and execution systems | Link from agent workflow to the decision architecture governing action; do not make both pages target generic AI decision-making |
| Risk AI Agents vs Credit Risk | Credit Risk owns risk method and portfolio decisions | Risk AI owns agent-enabled monitoring/analysis/execution | Method-first queries go to Credit Risk; automation/governance queries go to Risk AI and link back to the underlying risk capability |
| Planning vs Decision Intelligence on scenarios | Planning owns financial planning scenarios | Decision Intelligence owns cross-domain uncertainty-to-action architecture | Modifiers determine owner; credit stress stays with Credit Risk |
| Financial Data vs Finance AI Agents | Financial Data owns trusted context and data controls | Finance AI owns agent workflow and autonomy | Data-readiness content points first to Financial Data; agent-control content points first to Finance AI |

Current pages are meaningfully distinct. The risk comes from future metadata and Resources, not from the present canonical configuration. No production rewrite is justified in Sprint 7B.

## 5. Resources taxonomy

Use seven durable clusters:

1. **Financial Architecture** — CFO-function design, management control, working capital, financial modelling boundaries.
2. **Planning & Forecasting** — driver-based plans, forecasts, cash, and scenarios.
3. **Cost & Profitability** — cost architecture, allocation, manufacturing economics, margin, product/customer profitability.
4. **Credit Risk** — models, portfolio behaviour, vintages, transitions, segmentation, stress, policy.
5. **Financial Data & ERP** — finance semantics, ERP/SAP reporting, reconciliation, lineage, trusted data.
6. **Decision Intelligence** — decision models, uncertainty, rules, governance, and operational decision flows.
7. **Finance & Risk AI** — controlled agents, context, boundaries, oversight, monitoring, and auditability.

This adjusts 7A by splitting CFO/FP&A into Financial Architecture and Planning & Forecasting. The split is justified because a 100-article system needs a stable home for finance-function/working-capital/modelling issues without diluting the distinct planning methodology cluster. AML remains a capability relationship and article topic within Credit Risk or Finance & Risk AI until volume justifies its own hub. Do not create a thin AML cluster prematurely.

Each article receives exactly one primary cluster, even when it links to multiple capabilities. Taxonomy is editorial; it must not mirror every service page.

## 6. Hub → article → service architecture

Proposed future route model for Sprint 7C review:

- `/resources` — editorial gateway organised by analytical problem, not chronology.
- `/resources/financial-architecture`
- `/resources/planning-and-forecasting`
- `/resources/cost-and-profitability`
- `/resources/credit-risk`
- `/resources/financial-data-and-erp`
- `/resources/decision-intelligence`
- `/resources/finance-and-risk-ai`
- `/resources/{article-slug}` — canonical article URLs remain independent of taxonomy so articles can be reclassified without redirects.

Scale rules:

- With 10 articles, `/resources` may curate clusters without publishing thin cluster routes. A cluster hub becomes indexable only when it has at least three substantive articles and unique explanatory value.
- At 50 articles, hubs provide curated learning paths, featured frameworks, and service relationships; do not become date archives.
- At 100+ articles, add controlled filters/tags only when they solve discovery problems. Tags remain non-indexable unless deliberately promoted to a unique search destination.
- Articles visibly show cluster, author/reviewer, published/updated date, reading structure, related Resources, and one restrained capability transition.
- Commercial transition language should be diagnostic: “This problem is part of our Cost & Margin Management work.” The service page, not the article, carries the stronger contact path.

Flow:

`Search → article → relevant hub/next article → primary service → topic-aware contact`

## 7. Final first five authority articles

The 7A first five remain valid:

1. **Building a Manufacturing Cost Architecture**
2. **Working Capital Is a System, Not a Balance-Sheet Number**
3. **Why Forecasts Fail When Operational Drivers Are Missing**
4. **Vintage Analysis: Seeing Credit Deterioration Before Portfolio Averages Do**
5. **From ERP Data to Management Intelligence**

No topic is replaced. “From Accounting Cost to Decision Cost” and “Why Gross Margin Does Not Show Where Profitability Is Lost” remain high-priority follow-ups in the Cost & Profitability cluster. The selected five better demonstrate the full finance × risk × data × decision-system moat than launching three cost articles together.

## 8. Detailed first-five briefs

### 8.1 Building a Manufacturing Cost Architecture

- **Primary intent:** technical/problem-aware evaluation of manufacturing cost modelling.
- **Primary query family:** manufacturing cost modelling; manufacturing cost model.
- **Secondary concepts:** product costing, cost drivers, capacity utilisation, overhead allocation, standard vs actual cost, decision cost.
- **Target reader:** CFO, controller, management accountant, operations/manufacturing leader.
- **Core problem:** accounting cost records what happened but often cannot explain unit economics, constraint economics, mix, utilisation, or decision consequences.
- **Distinctive argument:** a usable cost model is an architecture connecting resources, processes, capacity, products, customers, and management decisions—not a single allocation formula.
- **Primary service:** Cost & Margin Management.
- **Internal links:** Cost service; future Accounting Cost to Decision Cost; Gross Margin; ERP-to-Intelligence; contact only through service transition.
- **Follow-ups:** allocation without false precision; capacity utilisation; product/customer profitability; standard-cost variance interpretation.
- **LinkedIn derivatives:** founder thesis—“Most cost models reconcile; few explain”; short post on capacity; visual resource→process→product→decision model; contrarian observation on allocation precision; article launch post.

### 8.2 Working Capital Is a System, Not a Balance-Sheet Number

- **Primary intent:** problem-aware working-capital modelling and forecasting.
- **Primary query family:** working capital modelling; how to forecast working capital.
- **Secondary concepts:** cash conversion cycle, receivables, inventory, payables, operational drivers, cash-flow forecast.
- **Target reader:** CEO, CFO, head of FP&A, controller, operations leader.
- **Core problem:** aggregate working-capital targets hide timing, commercial terms, inventory policy, process behaviour, and ownership.
- **Distinctive argument:** working capital is a dynamic operating system whose balances are outputs; management must model flows, lags, constraints, and interventions.
- **Primary service:** Planning & Forecasting; secondary CFO Advisory.
- **Internal links:** Planning; CFO Advisory; operational-driver forecasting; cash-flow architecture; manufacturing cost where inventory economics matter.
- **Follow-ups:** cash-conversion-cycle model; collections forecast; inventory/capacity trade-offs; 13-week cash architecture.
- **LinkedIn derivatives:** thesis—“You cannot manage a balance”; driver-tree post; visual flow/lag diagram; contrarian observation on blanket DSO targets; article distribution post.

### 8.3 Why Forecasts Fail When Operational Drivers Are Missing

- **Primary intent:** problem-aware financial forecasting methodology.
- **Primary query family:** driver-based forecasting; improve financial forecasting.
- **Secondary concepts:** operational drivers, rolling forecasts, forecast accuracy, ownership, scenario planning.
- **Target reader:** CFO, FP&A leader, CEO, finance business partner.
- **Core problem:** forecasts extrapolate accounting lines without modelling operational causes, timing, constraints, or management response.
- **Distinctive argument:** forecast quality is an architecture problem before it is a statistical problem; causal business drivers and decision cadence matter more than spreadsheet detail.
- **Primary service:** Planning & Forecasting.
- **Internal links:** Planning; working-capital article; scenario analysis; Management Reporting; Financial Data.
- **Follow-ups:** driver selection; forecast bias vs model failure; scenario triggers; forecast-to-action governance.
- **LinkedIn derivatives:** thesis on causal drivers; post contrasting line-item and driver forecasts; driver-tree visual; contrarian observation on “accuracy”; article distribution post.

### 8.4 Vintage Analysis: Seeing Credit Deterioration Before Portfolio Averages Do

- **Primary intent:** technical credit-portfolio methodology.
- **Primary query family:** credit risk vintage analysis; credit portfolio vintage analysis.
- **Secondary concepts:** cohort analysis, delinquency curves, origination quality, maturation, portfolio deterioration, segmentation.
- **Target reader:** CRO, head of credit risk, portfolio manager, risk analyst, lender leadership.
- **Core problem:** aggregate portfolio measures combine cohorts at different ages and can conceal deterioration in newer originations.
- **Distinctive argument:** vintage analysis is not a charting exercise; cohort definition, maturity, mix, policy changes, and action thresholds determine whether the signal is decision-useful.
- **Primary service:** Credit Risk.
- **Internal links:** Credit Risk; portfolio averages; transition matrices; stress testing; Decision Intelligence for operational triggers.
- **Follow-ups:** cohort design; roll rates vs vintages; transition matrices; early-warning thresholds; policy feedback loops.
- **LinkedIn derivatives:** thesis—“Portfolio averages are late”; cohort-curve post; vintage heatmap/model; contrarian observation on stable aggregate delinquency; article distribution post.

### 8.5 From ERP Data to Management Intelligence

- **Primary intent:** problem-aware/technical ERP financial analytics.
- **Primary query family:** ERP financial analytics; ERP management reporting.
- **Secondary concepts:** SAP management reporting, financial data architecture, reconciliation, semantic layer, management information.
- **Target reader:** CFO, controller, CIO, ERP/data leader, transformation leader.
- **Core problem:** transactional completeness does not automatically create consistent management concepts, decision context, or trusted analytical views.
- **Distinctive argument:** the missing layer is not another dashboard; it is a governed translation from transactions through finance semantics and business drivers to management decisions.
- **Primary service:** Financial Data; secondary Management Reporting.
- **Internal links:** Financial Data; Management Reporting; reconciliation architecture; forecast drivers; Finance AI context.
- **Follow-ups:** SAP reporting layer; reconciliation as architecture signal; metric definitions; lineage; management-information ownership.
- **LinkedIn derivatives:** thesis—“ERP truth is not management truth”; semantic-layer post; transaction→semantic→decision visual; contrarian observation on dashboard proliferation; article distribution post.

## 9. First article selection

Publish **Building a Manufacturing Cost Architecture** first.

Rationale:

- It expresses expertise that generic SEO publishers, accounting firms, and broad consultancies cannot reproduce convincingly.
- Search results are fragmented across academic work, software, engineering estimation, and basic definitions, leaving room for a practitioner-led management architecture.
- It is commercially close to an existing service with clear canonical ownership.
- It creates a coherent supporting series on decision cost, allocation, capacity, margin, and profitability.
- Its system diagram and contrarian thesis are naturally distributable on LinkedIn.
- It introduces Entimema's broader method—connecting finance, operations, data, and decisions—without relying on emerging terminology.

This is an authority-first choice, not a volume claim. Sprint 7C must validate the final primary query and search-result composition immediately before drafting.

## 10. Bulgarian demand-validation strategy

Maintain the English-only site. Do not implement `/bg/`, Bulgarian metadata, hidden terms, doorway pages, or machine-translated landing pages.

Test commercially relevant demand through:

1. Google Search Console verification and country/query/page/device segmentation.
2. A baseline of branded and non-branded impressions from Bulgaria to current English service pages.
3. Bulgarian LinkedIn commentary around the first English Resources, using native professional language and a link only where the English article serves the reader.
4. Separate testing of English specialist terms used by Bulgarian professionals: CFO advisory, FP&A, SAP reporting, credit risk, and manufacturing cost modelling.
5. Earned local mentions, professional profiles, and relevant associations/partnerships; never manufactured link schemes.
6. Lead-quality annotation: Bulgarian impression or click is not success unless it progresses to relevant service engagement or a qualified enquiry.

Decision gates after a meaningful observation period:

- continue English-only if Bulgarian prospects discover and convert through English pages;
- increase Bulgarian external distribution if it creates qualified discovery but no organic visibility;
- consider a complete visible language architecture only if sustained query, engagement, and lead evidence shows that English pages systematically fail a valuable audience.

## 11. International search priorities

Priority sequence:

1. Manufacturing cost modelling and qualified cost/profitability architecture.
2. Driver-based financial forecasting and operational-driver models.
3. Credit-risk consulting supported by vintage, transition, portfolio, and stress methodology.
4. ERP/SAP financial analytics translated into management intelligence.
5. CFO Advisory and FP&A provider intent, carefully differentiated from outsourced accounting.
6. Decision Intelligence expressed through models, rules, traceability, and controlled execution.
7. Finance/Risk AI as experimental authority around governed workflows, context, and bounded autonomy.

The defensible position is not “full-service consultancy.” It is the practitioner intersection of finance × risk × data × decision systems. International content should use domain-specific methods and business consequences rather than country landing pages or generic consulting head terms.

## 12. Search-result title architecture

These are directions for Sprint 7C review, not production changes.

| Owner | Primary concept | SEO-title direction | Meta-description direction | H1 relationship |
| --- | --- | --- | --- | --- |
| CFO Advisory | CFO advisory | `CFO Advisory & Financial Architecture | Entimema` | Finance-function structure, management information, and decision processes without an outsourced-accounting promise | Current expressive H1 may remain if supporting copy immediately names CFO Advisory |
| Planning & Forecasting | FP&A consulting / financial forecasting | `Planning, Forecasting & FP&A Consulting | Entimema` | Driver-based budgets, rolling forecasts, scenarios, and cash decisions | Current H1 is brand-led; visible category/supporting copy must carry primary concept |
| Management Reporting | management reporting consulting | `Management Reporting & Decision Support | Entimema` | KPIs, operating drivers, reporting rhythm, and management action | Expressive H1 can remain with precise supporting proposition |
| Cost & Margin | cost modelling / profitability | `Cost Modelling & Profitability Analysis | Entimema` | Product, customer, process, and manufacturing economics through transparent cost models | Current H1 reinforces margin; category/supporting copy carries primary terms |
| Financial Data | financial data architecture / ERP analytics | `Financial Data Architecture & ERP Analytics | Entimema` | Trusted ERP/SAP data, reconciliation, reporting, planning, and traceability | Current H1 supports value; nearby copy identifies architecture |
| Credit Risk | credit risk consulting/modelling | `Credit Risk Modelling & Portfolio Analytics | Entimema` | Models, policy, stress, and portfolio controls across the credit lifecycle | Current H1 is problem-led; supporting copy should preserve exact service language |
| Decision Intelligence | decision intelligence | `Decision Intelligence & Decision Engines | Entimema` | Models, rules, policy, data, and traceable operational decisions | Current H1 strongly expresses executable decisions |

No current title is so misleading that a speculative metadata change is safer than waiting for Search Console evidence and Sprint 7C content decisions.

## 13. Internal-linking blueprint

| Tier 1 owner | Upstream links | Downstream/related capabilities | Supporting Resources | Contact path |
| --- | --- | --- | --- | --- |
| CFO Advisory | Home, Services, future Financial Architecture hub | Planning, Reporting, Cost, Financial Data | Working Capital; future finance-function architecture | `/contact?topic=cfo-function` |
| Planning & Forecasting | Home/Services, CFO, Planning hub | Management Reporting, Financial Data, Decision Intelligence | Working Capital; Operational Drivers; future Scenario Analysis | `/contact?topic=budgets-and-forecasting` |
| Management Reporting | Services, CFO, Financial Data, relevant articles | Financial Data, Planning, Decision Intelligence | ERP-to-Intelligence; future Reporting Decision Architecture | `/contact?topic=management-reporting` |
| Cost & Margin | Services, CFO, Cost hub, manufacturing article | Financial Data, Planning | Manufacturing Cost; Decision Cost; Gross Margin; Allocation | `/contact?topic=cost-profitability` |
| Financial Data | Services, Reporting, ERP articles | Reporting, Planning, Finance AI | ERP-to-Intelligence; SAP Reporting; Reconciliation | `/contact?topic=financial-data` |
| Credit Risk | Services, Credit Risk hub, technical articles | Decision Intelligence, Risk AI, AML | Vintage; Transitions; Portfolio Averages; Stress Testing | `/contact?topic=credit-risk` |
| Decision Intelligence | Services, Reporting, Credit Risk, decision articles | Finance AI, Risk AI, Financial Data | Decision Models; Governed Flow; Reporting Architecture | `/contact?topic=decision-automation` |

Article rules:

- Link once to the primary service at the point the commercial capability becomes relevant.
- Use varied natural anchors such as “our work on cost and margin systems,” not repetitive exact-match keywords.
- Link to two or three genuinely sequential Resources, not every article in the cluster.
- Link back to the cluster for broader exploration.
- Let the service page own the strong CTA; article transitions remain analytical.
- Preserve topic parameters on contact links where the current form supports them.

## 14. Measurement baseline

### Current status

- Canonical metadata, crawlable robots rules, and a sitemap are present.
- No Google Search Console verification token or integration is present in the repository.
- No analytics, tag manager, `gtag`, `dataLayer`, or equivalent client tracking integration is present.
- The contact API supports a real submission outcome, but no acquisition/landing-page attribution or analytics event is implemented.
- The current `/#analyses` anchor cannot supply article-level organic landing-page measurement.

### Required baseline before content scales

| Stage | Minimum observation | Source/implementation |
| --- | --- | --- |
| Impression | query, page, country, device, date | Google Search Console |
| Search result | average position and CTR interpreted with query/page context | Google Search Console |
| Organic click | landing page and query aggregate | Search Console; consent-aware analytics if approved |
| Resource engagement | article view plus meaningful engagement definition | Privacy-reviewed analytics specification |
| Service transition | Resource → named service navigation | Consent-aware event, preserving source article |
| Contact intent | contact CTA activation and form start | Consent-aware event |
| Form submission | server-confirmed valid success, excluding errors/bots | Current API outcome plus approved measurement event |
| Qualified lead | human commercial qualification linked to landing context | CRM or controlled internal record; never inferred from form submission alone |

Implementation order:

1. Verify Search Console and submit the existing sitemap without adding invasive tracking.
2. Capture a pre-publication query/page/country baseline.
3. Agree consent, retention, controller, and vendor requirements before analytics code.
4. Define event names and success criteria before implementation.
5. Preserve landing-page/referrer/UTM context through contact only where legally approved.
6. Review query cannibalisation monthly after publication; use longer windows for low-volume expert B2B queries.

## 15. Resource quality gate

An article cannot enter drafting unless it has:

- one primary query family and one primary canonical service relationship;
- a named target reader and consequential business decision;
- a distinctive Entimema thesis that can be disagreed with or tested;
- a practitioner reviewer responsible for intellectual substance;
- evidence sources appropriate to the subject and a fact-check plan;
- an outline that avoids duplicating an existing or planned article.

An article cannot be published unless it contains at least one substantive asset:

- original analytical framework;
- financial-model logic;
- decision framework;
- real practitioner insight;
- anonymised business pattern;
- meaningful quantitative reasoning;
- diagram/model;
- technical methodology;
- distinctive evidence-led argument.

Publication checks:

- no invented data, cases, clients, quotations, or outcomes;
- no generic “tips,” unsupported predictions, or AI-written intellectual substance;
- clear assumptions, definitions, and methodological limitations;
- precise title/H1/meta alignment without keyword stuffing;
- accessible semantic structure and useful diagram alternatives;
- restrained capability transition and natural internal links;
- author/reviewer, dates, canonical, social metadata, sitemap inclusion, and measurement readiness;
- editorial sign-off that the piece teaches a competent practitioner something non-obvious.

## 16. LinkedIn derivative map

| Article | Founder thesis | Short analytical post | Visual/model | Contrarian observation | Distribution post |
| --- | --- | --- | --- | --- | --- |
| Manufacturing Cost Architecture | Cost is a system, not an allocation | Why utilisation changes unit economics | Resource→process→capacity→product→decision architecture | More allocation detail can create less decision clarity | Diagram-led introduction to the full article |
| Working Capital System | Balances are outputs of operating behaviour | Model flows and lags, not only DSO/DIO/DPO | Working-capital driver loop | Blanket working-capital targets can destroy operations | Bulgarian or English problem framing linked to article |
| Forecasts and Operational Drivers | Forecast accuracy starts with causal structure | Accounting lines do not explain movement | Operational driver tree | A more detailed spreadsheet can be a worse forecast | Executive question + article thesis |
| Vintage Analysis | Portfolio averages are late indicators | Cohort maturity changes interpretation | Vintage curves/heatmap | Stable averages can coexist with deteriorating new business | Risk-leader summary linked to methodology |
| ERP to Management Intelligence | ERP truth is not management truth | Transactions need semantic and decision layers | Transaction→semantic→metric→decision model | Another dashboard rarely fixes architecture | CIO/CFO bridge framing linked to article |

No LinkedIn content is created in Sprint 7B. This map is preparation only.

## 17. Explicit recommendations for Sprint 7C

Sprint 7C should be a focused **Resources foundation and first-authority-article implementation** sprint:

1. Recheck the selected article's live search results and validate the final query/title before drafting.
2. Define the minimum Resources content model: slug, title, description, cluster, author/reviewer, published/updated dates, service relationship, related articles, and metadata.
3. Implement `/resources` and only the taxonomy needed for a useful launch; do not publish empty cluster hubs.
4. Replace current Resources navigation targets only when the real hub exists, preserving deliberate redirects.
5. Draft, expert-review, fact-check, diagram, and publish **Building a Manufacturing Cost Architecture** under the quality gate.
6. Link article → Cost & Margin service and service → article contextually; add restrained related-content pathways.
7. Add the article/hub to sitemap and validate canonicals, structured metadata where justified, accessibility, responsive behaviour, and performance.
8. Establish Search Console verification/baseline if operational access is available; do not add analytics without explicit privacy approval.
9. Do not mass-publish the remaining four articles, create Bulgarian pages, or build the LinkedIn programme in Sprint 7C.
