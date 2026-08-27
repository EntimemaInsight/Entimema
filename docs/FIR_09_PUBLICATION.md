# FIR-09 publication record

## Identity

- Title: Why Profit Does Not Equal Cash: Reconstructing Cash Flow from Financial Statements
- Slogan: Profit records economic performance. Cash reveals how the business was funded.
- ID: FIR-09; cover ANALYSIS / 09; ninth Financial Intelligence series entry.
- Category: Financial Architecture (`financial-architecture`), existing `insights` Research stream; excluded from Engineering.
- Slug: `profit-vs-cash-flow-reconstruction`.
- Canonical: https://www.entimema.com/resources/profit-vs-cash-flow-reconstruction
- Author: Aleksandar Dimitrov; publication date 27 August 2026.
- Exact body count under the repository JSX algorithm: **3,970 words / 18 minutes** at 220 words per minute, rounded. Card value is verified against the calculated article value.

FIR-08 prerequisite: local HEAD and remote origin/main both equalled `0bb71e40cc9db6c339e16c9191e49d8ec1dfb6da` before editing. Its publication record, article and approved cover were inspected. The repository has no discoverable separate approved 40-article taxonomy, consistent with FIR-06–08 publication records. The supplied Financial Architecture category and existing series order were preserved without creating a parallel taxonomy.

## Methodology and example

Boundary → profit basis → non-cash and non-operating recognition → operating working capital → tax and interest → asset and financing roll-forwards → cash reconciliation → evidence-linked management decision. Four-layer reconstruction and ten-step interpretation reuse existing components. Supporting visuals include the three-statement matrix, full bridge and independent control matrix.

All example figures are synthetic EUR millions for calendar 2025. No private identities, financial values, account codes, filenames or templates are published. Available private workbook inspection was structural only; no source values were used.

P&L: revenue 40.0 − operating costs 32.9 = adjusted EBITDA 7.1; less depreciation 1.4 and intangible impairment 0.3, plus disposal gain 0.2 = operating profit 5.6; less interest 0.4 = PBT 5.2; less current tax 1.0 = PAT 4.2. The defined adjusted EBITDA excludes impairment and disposal gain. The impairment is on an indefinite-lived intangible, keeping the supplied PPE schedule consistent.

Complete profit-to-cash bridge:

`4.2 + 1.0 + 1.4 + 0.3 − 0.2 − 2.1 − 1.4 − 0.2 + 0.9 + 0.3 − 0.8 − 3.8 + 0.5 + 2.0 − 1.2 − 1.0 + 0.1 = 0.0`

- OWC: 5.8 → 8.3; cash absorption 2.5. Receivables and inventory absorb 3.5 before prepayments and liability offsets.
- Current tax: 1.0 + opening payable 0.4 − closing payable 0.6 = payment 0.8.
- Interest: 0.4 + opening accrual 0.1 − closing accrual 0.1 = payment 0.4, already inside PBT and operating cash. No second deduction.
- Operating cash: **3.4**.
- PPE: 10.0 + cash capex 3.8 − disposal carrying value 0.3 − depreciation 1.4 = **12.1**.
- Intangible: 1.0 − impairment 0.3 = **0.7**.
- Disposal proceeds: carrying value 0.3 + gain 0.2 = **0.5**, fully collected.
- Investing cash: −3.8 + 0.5 = **−3.3**.
- Debt: 6.0 + borrowing 2.0 − repayment 1.2 = **6.8**; no non-cash additions.
- Financing cash: 2.0 − 1.2 − dividends 1.0 = **−0.2**.
- Equity: 12.8 + PAT 4.2 − declared and paid dividends 1.0 + OCI 0.1 = **16.1**; no capital contributions or dividend payable.
- Opening Balance Sheet: assets **22.8** = liabilities 10.0 + equity 12.8.
- Closing Balance Sheet: assets **28.3** = liabilities 12.2 + equity 16.1.
- Final cash: opening **2.5 + 3.4 − 3.3 − 0.2 + FX 0.1 = closing 2.5**.
- Unexplained residual: **0.0**. Domestic cash 1.8 → 1.7 plus foreign-operation cash 0.7 → 0.8 independently corroborates the total; the foreign operation holds only cash and its translation enters OCI.

The cash bridge in the brief is mathematically correct. A preliminary commentary suggesting otherwise was corrected before implementation. The capitalised-interest formula was corrected: when starting with P&L interest expense, separately capitalised borrowing costs are added to derive total incurred interest, then accrual and non-cash effects are reconciled. The example contains no capitalised interest or fees.

The article distinguishes analytical reconstruction from statutory presentation, explicitly dates the example before IFRS 18 adoption, and links primary IFRS sources for the 2027 changes. Incomplete or mismatched periods are provisional and block unsupported liquidity conclusions even with zero residual. Restricted cash, acquisitions, lease inception, gross flows and offsetting errors receive explicit controls.

Financial Intelligence is described as a workflow architecture to specify, not an unverified promise of automatic recovery. Model interpretation, deterministic calculations and human judgement remain separate. Existing Financial Data and contact routes provide the CTA; no fictional product route is introduced.

## Cover and visual verification

Unique built-in ImageGen asset: `public/resources/covers/profit-vs-cash-flow-reconstruction.png`, **1536 × 1024**, integrated through the unchanged cover pipeline. The approved cover design system and FIR-08 reference govern the identity, materials, serif title and dark/amber palette.

Production brief: create a new 3:2 architectural sculpture, reserved left editorial field and concentrated right visual. A luminous profit monolith separates through translucent operating, investment and financing planes; an amber evidence filament connects held value to a smaller final cash object, with a restrained secondary FX line. Include exact title and slogan above, ENTIMEMA, FINANCIAL ARCHITECTURE, ANALYSIS / 09 and PROFIT / MOVEMENT / CASH. Dark cinematic navy, plausible glass and metal, restrained amber illumination. No literal currency, charts, dashboards, spreadsheets, plumbing, people, AI motifs, neon or watermark. Do not reuse an existing sculpture.

Inspected generated cover and rendered card/hero alongside the existing family. Desktop 1440, tablet 768 and mobile 390 px screenshots cover reconstruction, linkage, statements, numerical bridge, controls, equations, interpretation and CTA. No document overflow, broken images or browser errors. Category and search return one FIR-09 card; Engineering returns none. Mobile tables retain the approved labelled horizontal scrolling; right-hand running totals were inspected. Existing sticky navigation/contents overlaps some headings at programmatic scroll offsets, as recorded for FIR-08; no shared styling was changed.

The browser plugin and sandbox image viewer could not initialise because of the Windows sandbox ACL helper failure. The established fresh headless Chrome workflow and compact image previews were used with explicit escalation. QA evidence remains unstaged under `test-input/fir09-qa/`.

## Technical verification and scope

- TypeScript: passed separately and in production build.
- Production build: passed, 114 pages generated; FIR-09 statically generated.
- Tests: 39 passed, zero failed.
- Changed-file ESLint: passed.
- Repository-wide lint: pre-existing EPERM scanning `entimema-ai/.pytest_cache`; unrelated to FIR-09 and not changed.
- Financial Intelligence audit: nine generated pages passed; FIR-06–08 numerical regression checks passed.
- New source-derived audit: P&L, both Balance Sheets, working-capital signs, every bridge running total, tax, PPE, intangible, debt, equity, category subtotals, FX, cash and residual passed. Also verifies word count, reading parity, links, section targets, unique registry entry, and cover dimensions. Invoked by the existing financial audit.
- Structured data: 271 entities across 102 generated pages passed, including unrelated pre-existing local content in the working tree.
- Canonical, title, description, author, category, social image, sitemap and reciprocal series links passed.

Eight intended files: article, cover, this record, FIR-09-only registry and route hunks, series entry, existing financial audit extension, and new cash-flow audit. Unrelated Financial Data Intelligence content, AGENTS.md, glyph guidance and temporary glyph artwork remain outside the commit.

Commit, push and live deployment are confirmed separately after execution; this pre-commit record does not assert their completion.
