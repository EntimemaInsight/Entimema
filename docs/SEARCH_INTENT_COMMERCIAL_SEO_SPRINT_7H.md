# Sprint 7H — Search intent and commercial SEO architecture

Audit date: 2026-08-12

Evidence boundary: this mapping assigns one preferred Entimema URL to each strategic intent. It does not claim keyword volume, ranking difficulty or guaranteed visibility. Search Console data should test the architecture before new landing pages are created.

## Commercial and editorial intent map

| URL | Search intent | Primary query | Supporting query families | Supporting Resource |
| --- | --- | --- | --- | --- |
| `/` | Brand/category gateway | Entimema | financial architecture; decision science; finance and risk AI | Resources index; specialist Service pages |
| `/services` | Commercial portfolio gateway | financial and decision-system services | finance advisory; risk modelling; financial data; decision intelligence | All Resources collectively |
| `/services/cfo-function` | Commercial | fractional CFO services | fractional CFO; outsourced/external CFO; CFO advisory; CFO consulting; finance-function design | Working Capital as a System remains informational support; no forced ownership |
| `/services/budgets-and-forecasting` | Commercial | financial forecasting consulting | budgeting consulting; financial planning and forecasting; driver-based forecasting; rolling forecasts; scenario planning | Operational-Driver Forecasting |
| `/services/management-reporting` | Commercial | management reporting consulting | management reporting services; CFO reporting; management dashboards; performance reporting; management information systems | ERP Data to Management Intelligence is adjacent, not reassigned |
| `/services/cost-and-profitability` | Commercial | cost and profitability analysis | manufacturing cost analysis; product profitability; cost modelling; manufacturing costing; allocation; margin analysis | Building a Manufacturing Cost Architecture |
| `/services/financial-data` | Commercial | financial data analytics | financial analytics consulting; finance data modelling/architecture; ERP financial analytics; data transformation; management intelligence | From ERP Data to Management Intelligence |
| `/services/credit-risk` | Commercial | credit risk consulting | credit risk advisory; credit risk modelling; portfolio analytics/risk; credit risk analytics; credit risk management consulting | Credit Vintage Analysis |
| `/services/decision-automation` | Commercial/emerging | decision intelligence consulting | decision modelling; decision engines; business rules; policy execution | No dedicated Resource yet |
| `/services/financial-ai-agents` | Commercial/emerging | finance AI agents | governed finance AI; FP&A/reporting agents; controlled finance workflows | No dedicated Resource yet |
| `/services/risk-ai-agents` | Commercial/emerging | risk AI agents | governed risk AI; credit/AML agents; risk workflow automation | No dedicated Resource yet |
| `/services/aml-compliance` | Commercial | AML consulting | AML control architecture; KYC/CDD; transaction monitoring; investigations | No dedicated Resource yet |
| `/resources` | Editorial discovery | financial and risk analysis | practitioner frameworks; analytical methods; decision models | All five published Resources |
| `/resources/building-a-manufacturing-cost-architecture` | Technical/informational | manufacturing cost architecture | production cost stages; capacity economics; variance; cost drivers | Commercial owner: Cost & Profitability Analysis |
| `/resources/working-capital-as-a-system` | Problem-aware/informational | working capital management | working capital analysis; cash conversion cycle; receivables; inventory; payables; liquidity | Planning & Forecasting is a contextual relationship, not a forced commercial owner |
| `/resources/operational-driver-forecasting` | Technical/informational | operational-driver forecasting | driver-based forecasting; integrated forecasts; scenarios; forecast models | Commercial owner: Financial Forecasting Consulting |
| `/resources/credit-vintage-analysis` | Technical/informational | credit vintage analysis | cohort analysis; months on book; vintage curves; portfolio deterioration | Commercial owner: Credit Risk Consulting & Modelling |
| `/resources/from-erp-data-to-management-intelligence` | Technical/informational | ERP data to management intelligence | reconciliation; semantic layer; ERP financial analytics; management information | Commercial owner: Financial Data Analytics & Architecture |

Supporting public routes `/about`, `/contact` and `/privacy` own trust, conversion and legal intent respectively; they are not specialist acquisition owners.

## Changes implemented

### Titles and descriptions

Six commercial owners now state their service intent clearly:

- Credit Risk Consulting & Modelling
- Fractional CFO Services & Advisory
- Financial Forecasting Consulting
- Cost & Profitability Analysis
- Management Reporting Consulting
- Financial Data Analytics & Architecture

Their descriptions now follow problem → specialist method → management outcome without enumerating keyword variants. Canonicals and URLs are unchanged.

### H1 and semantic copy

The same six pages now use one intent-aligned H1 while preserving the existing senior, analytical voice. Existing supporting copy, capabilities, methodologies, outcomes and illustrative scenarios already provide natural semantic coverage, so no large rewrite was justified.

### Internal-link clusters

Four restrained reciprocal clusters are complete:

- Credit Risk service ↔ `credit vintage analysis`
- Planning & Forecasting service ↔ `operational-driver forecasting framework`
- Cost & Profitability service ↔ `manufacturing cost architecture`
- Financial Data service ↔ `ERP-to-management intelligence framework`

Each Service link sits inside a relevant illustrative outcome. Existing Resource related-capability links supply the reverse direction. No generic or repeated SEO link blocks were added.

## Cannibalisation decisions

- `credit vintage analysis` remains owned by the indexed Resource. `credit risk consulting` is now explicitly owned by the Credit Risk Service page.
- Operational-driver methodology remains editorial; provider/implementation intent belongs to Financial Forecasting Consulting.
- Manufacturing cost architecture remains the technical framework; commercial cost and profitability analysis belongs to the Service page.
- ERP reconciliation/semantic architecture remains editorial; financial data analytics and architecture provider intent belongs to the Financial Data page.
- Working capital remains Resource-led until first-party query and commercial evidence resolve whether Planning, CFO Advisory or a future proposition should own consulting intent.
- Financial modelling remains secondary to CFO Advisory and Planning. No dedicated page is created until evidence separates buyer intent.
- The homepage remains the brand/category gateway and distributes authority through existing Service links; it is not retargeted to compete with specialist pages.

## Pages intentionally unchanged

The five Resource titles, H1s, descriptions, article structures and copy remain unchanged, protecting their informational ownership—especially Credit Vintage Analysis. Decision Intelligence, Finance AI Agents, Risk AI Agents and AML & Compliance already have distinct titles and specialist semantics; without query evidence, rewriting them would be speculative. `/services`, `/resources`, About, Contact, Privacy, sitemap, robots and corrected BreadcrumbList markup are unchanged.

## Future Bulgarian search-intent layer

No Bulgarian page or metadata is created. Future localisation should use human-reviewed Bulgarian pages only after Search Console and commercial evidence justify the investment.

| Bulgarian intent | Logical current English owner | Architecture note |
| --- | --- | --- |
| `кредитен риск` | `/services/credit-risk` | Broad specialist/commercial risk intent; distinguish from consumer credit. |
| `моделиране на кредитен риск` | `/services/credit-risk` | Commercial modelling owner; technical methods may be supported by Resources. |
| `консултации кредитен риск` | `/services/credit-risk` | Direct consulting intent. |
| `външен финансов директор` | `/services/cfo-function` | External/fractional CFO intent; preserve non-bookkeeping positioning. |
| `финансов директор на абонамент` | `/services/cfo-function` | Recurring CFO-service intent; validate expected engagement model. |
| `финансово моделиране` | `/services/cfo-function` or `/services/budgets-and-forecasting` | Ambiguous: allocate only after query context distinguishes corporate finance from planning. |
| `бюджетиране и прогнозиране` | `/services/budgets-and-forecasting` | Planning and forecasting consulting owner. |
| `анализ на себестойността` | `/services/cost-and-profitability` | Cost analysis owner, supported by manufacturing cost architecture. |
| `анализ на рентабилността` | `/services/cost-and-profitability` | Profitability analysis owner. |
| `управленско отчитане` | `/services/management-reporting` | Management reporting owner. |

## Recommended future content gaps

1. A Decision Intelligence authority Resource explaining model → rule → controlled execution.
2. Evidence-led Resources for governed Finance AI and Risk AI workflows, without generic AI commentary.
3. AML practitioner authority around control architecture or transaction-monitoring design.
4. Search Console evaluation of fractional CFO expectations before expanding recurring-service copy.
5. Query evidence resolving financial modelling and working-capital commercial ownership.
6. Human-reviewed Bulgarian localisation research before any language route architecture.
