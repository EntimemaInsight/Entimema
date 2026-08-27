# FIR-08 publication record

## Identity

- Title: Working Capital Analysis: Connecting Liquidity, Operations and Cash Conversion
- Slogan: Profit is recorded at one moment. Cash moves on the timetable of the operating cycle.
- ID: FIR-08; cover ANALYSIS / 08; eighth Financial Intelligence series entry.
- Category: Financial Architecture (`financial-architecture`); existing `insights` Research stream, never Engineering.
- Slug: `working-capital-analysis`.
- Canonical: https://www.entimema.com/resources/working-capital-analysis
- Author: Aleksandar Dimitrov; publication date 27 August 2026.
- Exact body count under the repository JSX reading-time algorithm: **3,998 words / 18 minutes**, rounded at 220 words/minute. Card and article values agree.

FIR-07 prerequisite: local HEAD and remote origin/main both pointed to d46a7e5a848249f2ebe2c7036ec6ee59a4422fae before implementation. Its publication record and implementation were reviewed. No separate approved 40-article taxonomy file was found; the supplied category and existing series ordering were followed without introducing a parallel taxonomy.

## Methodology and result

Accounting versus operating perimeter → representative balance and matched flow → DSO/DIO/DPO/CCC → ageing, inventory quality and supplier concentration → growth and seasonality decomposition → EBITDA-to-cash reconciliation → timed scenarios → owned management decision.

All figures are synthetic EUR millions. Prior/current days, calculated at full precision and displayed to two decimals:

| Metric | Prior | Current | Movement |
|---|---:|---:|---:|
| DSO | 49.88 | 57.79 | +7.91 |
| DIO | 83.43 | 99.94 | +16.51 |
| DPO | 65.18 | 62.69 | -2.49 |
| CCC | 68.13 | 95.04 | +26.91 |

Revenue grows from 60 to 72. Prior EBITDA is 8.5 / 1.2 (7.083333...), refining the brief's illustrative 7.2 to preserve its required stable EBITDA margin. Current credit purchases 52.4 plus cash inventory purchases 2.0 equal total purchases 54.4; opening inventory 10 + 54.4 - cost of sales 50.4 = closing inventory 14. This preserves the illustrative credit-purchase denominator without breaking inventory reconciliation.

Average balances are explicitly time-average assumptions, not closing-balance means. Average trade working capital rises 5.9; closing trade working capital rises 6.2. These are never substituted for one another. Aggregate average growth funding is 2.06, leaving 3.84 beyond scale; component-based prior-days funding is 12.002857 against actual 16.2. Closing growth decomposition: 2.26 growth + 0.70 additional seasonality + 3.24 remaining operating change = 6.20. Growth already includes 0.30 of seasonal stock, so it is not counted twice.

Current arrears: 6 / 13 = 46.15%; over-60 exposure 16.92%; two-customer concentration 30.77%. Inventory quality separates 9 operating, 2.5 seasonal/safety, 1.6 slow-moving and 0.9 held/obsolete. Disputes and concentrations are overlays, not additional ageing buckets. The critical supplier represents 35% of credit purchases and is excluded from assumed term extension.

Cash bridge: **8.5 - 3.5 - 4.0 + 1.3 - 0.4 - 0.8 - 0.6 = 0.5** before capex. After 1.2 capex: -0.7. Opening cash 4.5 - 0.7 + financing 1.2 = closing cash 5.0. Restricted cash 1.5 leaves 3.5 unrestricted. Net eight-week obligations of 4.4 plus reserve 0.5 imply a 1.4 funding gap. Assumed facilities require covenant/draw-condition checks.

Scenarios, EUR m:

- A: further 10% growth at current days consumes 1.620000 additional average trade funding.
- B: DSO -5 releases 0.986301; DIO -8 releases 1.104658; selective DPO +2 releases 0.287123; total **2.378082**. New CCC 80.04 days. Timing spans 4–20 weeks; this is a conditional steady-state opportunity, not immediate available cash.
- C: DSO -12, DIO -20, DPO +10 gives **6.564384**, CCC 53.04; rejected pending evidence because customer, stock, supply and commercial consequences are unvalidated.
- B with 10% growth gives 15.204110 average trade funding, only 0.995890 below current. Opportunities must be integrated with growth, purchase and supplier interactions.

Commercial/credit control owns invoice and dispute evidence; operations owns stock convertibility and service safeguards; procurement owns consent and supplier economics; finance/treasury owns reconciliation, restrictions, funding and forecast; management approves trade-offs. Every opportunity carries mechanism, timing, risk, control and completion evidence.

Financial Intelligence diagnoses the operating cash constraint through a controlled evidence-to-decision workflow. Receivables Intelligence is described only as a future workflow direction for recurring invoice-level action, not a live product. No unconfirmed product route is linked. Model interpretation, deterministic calculation and human judgement remain separate.

Private-reference review was structural only. No private identities, values, codes, rules, filenames or templates were used in the article. Primary methodological references are linked in context: ACCA working-capital guidance, IAS 7 and IASB supplier-finance disclosure guidance.

## Cover

`public/resources/covers/working-capital-analysis.png`: unique 1536 × 1024 PNG, built-in ImageGen, unchanged ResourceCover pipeline. The approved design system and FIR family govern materials, typography, placement and crop.

Production prompt: create a unique 3:2 Entimema Research cover with near-black cinematic navy architecture, restrained amber light, precision metal and translucent glass. Left editorial field, right sculpture. Exact ENTIMEMA wordmark, FINANCIAL ARCHITECTURE category, ANALYSIS / 08, title and slogan above, and LIQUIDITY / OPERATIONS / CONVERSION descriptor. Two architectural chambers contain inventory-like glass blocks and receivable-like upright planes; a narrow amber liquidity filament becomes suspended before emerging after a collection plane. An offset lower support finances only part of the path. Preserve plausible geometry and generous negative space. No coins, currency, clocks, plumbing, dashboards, charts, generic arrows, people, AI imagery, neon, watermark or extra text. References are art direction only, not reused objects.

## Verification

- TypeScript: passed separately and in production build.
- Production build: passed; FIR-08 statically generated.
- Existing tests: 39 passed, zero failures.
- Changed publication files: lint passed.
- Standard lint: pre-existing EPERM scanning `entimema-ai/.pytest_cache`; unrelated files unchanged.
- Financial Intelligence audit: all eight generated pages passed. FIR-08 source-table arithmetic, quality totals, inventory purchases reconciliation, bridge running totals, scenario release, word count, reading parity, links, unique registry record and cover dimensions passed.
- Structured-data audit: 268 entities across 101 generated pages passed in the working tree, which includes unrelated pre-existing unpublished local work.
- Canonical, SEO title/description, author, category, social cover, sitemap, related routes and reciprocal series navigation verified through generated output.
- Visual inspection: cover family, card, hero, four-layer workflow, equations, quality matrix, bridge, scenarios and action controls inspected at 1440, 768 and 390 px. No document overflow, broken images or page errors. Tables retain existing labelled horizontal scrolling; mobile right-hand cash totals and action controls inspected.
- Category/search return exactly one FIR-08 card; Engineering returns none.
- Browser plugin and sandbox image viewer failed at Windows sandbox initialisation. Existing fresh headless Chrome workflow and compact image previews were used; evidence remains unstaged under `test-input/fir08-qa/`.
- Existing sticky navigation/contents can overlap text during programmatic scrolling. No shared navigation, typography or styles changed.

## Publication scope

Seven intended files: new article, unique cover, this record, FIR-08-only registry and route changes, one reciprocal series entry, and extension of the existing financial audit. Unrelated changes to AGENTS.md, decision-glyph guidance, and the separate Financial Data Intelligence article remain outside the commit.

Git commit and push status are reported after execution in the task response. A pushed commit alone is not evidence of completed production deployment.
