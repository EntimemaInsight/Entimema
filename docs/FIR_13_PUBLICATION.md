# FIR-13 publication record

## Identity

- **Title:** Financial Data Lineage: Making Every Analytical Number Traceable to Its Source
- **Slogan:** A financial conclusion becomes defensible when every transformation between evidence and decision remains visible.
- **Article ID:** FIR-13; cover identifier ANALYSIS / 13.
- **Category:** Financial Data & ERP (`financial-data-and-erp`).
- **Placement:** Resources → Research through the existing `insights` stream; excluded from Engineering.
- **Slug:** `financial-data-lineage`.
- **Canonical route:** https://www.entimema.com/resources/financial-data-lineage
- **Author/date:** Aleksandar Dimitrov, 27 August 2026.
- **Exact article-body count:** 4,016 words under the repository JSX reading-time algorithm.
- **Displayed reading time:** 18 minutes, calculated at 220 words/minute and rounded. Card and article parity are audited.

## Prerequisite and scope

FIR-12 commit `1f3d424d0ec5e39ad10d5d35ff56bd816c7af802` was local HEAD and matched the remote `origin/main` before work began. The current FIR architecture, FIR-01–12 methods, shell, components, cover system, routing, metadata, reading-time logic, audits and product boundaries informed the implementation.

No separate approved 40-article taxonomy was discoverable, consistent with the previous publication records. The supplied FIR-13 category and sequence were retained without inventing a new taxonomy. Existing earlier-article navigation is unchanged; FIR-13 receives a FIR-12 → FIR-13 continuation. No earlier article body or cover changes were required.

Pre-existing AGENTS.md, route, registry and decision-glyph changes, plus an untracked article, cover and glyph sheet, are unrelated and excluded. Shared-file index content is constructed from HEAD plus only FIR-13 changes, leaving the working copy intact.

The local private workbook is considered only for structural characteristics, not for publication of values, names or locations. No separate approved taxonomy or EL BAT reference corpus was located. All published numbers, source locations, rule identifiers and reviewer events are fictional. The only external methodological reference is W3C PROV-DM, cited narrowly for entities, activities, derivation and responsible agents; no compliance claim is made.

## Methodology

Source evidence → extracted field → transformation → canonical mapping → validated value → calculation → finding → decision.

The article develops ten distinct lineage objects and typed relationships. Its principal visual groups the backward path into Finding and Decision, Calculation and Validation, Structuring and Transformation, and Source Evidence, with forward traversal used for impact analysis. Source document and exact source location remain distinct.

Transformations preserve input, output, rule, parameters, reason, event, actor, reversibility and version. Mapping records preserve proposal, approved meaning, alternatives, evidence, effective scope and downstream impact. Calculation lineage pins every input version and retains aggregation populations, adjustments and eliminations. Reconciliation is not treated as complete lineage.

The four evidence states are **Evidence / Inference / Hypothesis / Decision**. Traceability establishes provenance, not automatic causal proof. Reviewer events preserve both machine proposal and human-confirmed state. Editable current output is separate from retained historical versions; upstream changes invalidate affected approvals. Immutable history is explicitly an architectural principle, not a claim of technically immutable storage or legal certification.

Seven lineage quality dimensions and eight purpose-specific readiness states govern permitted use. Twenty failure/control rows cover document-only links, missing raw states, unscoped mappings, stale approvals, hidden adjustments, evidence confusion and unusable metadata. Executive scanning follows the opening, thesis, primary chain, evidence framework, history model, worked example and final implication; the full text supplies the practitioner contracts.

## Fictional worked example

- Balance Sheet PDF v2, page 3, cash row/current column: **5,000 EUR thousands**.
- Restricted-cash note v1, page 2, restrictions row/current column: **1,200 EUR thousands**.
- Trial-balance cash children: EUR **2.4m + 1.4m + 1.2m = 5.0m**; zero reconciliation residual.
- Debt schedule v1, Maturity!D6: current debt **EUR 5.1m**. D7: non-current debt **EUR 5.4m**; total **EUR 10.5m**.
- Prior M1 proposal: all EUR 5.0m classified as available; implied coverage approximately **98.0%**.
- R1 Controller review at 09:20 UTC confirms the restriction and approves purpose-scoped M2, preserving M1.
- C1 v2 uses **TC1 v1 − RC1 v2 = EUR 5.0m − EUR 1.2m = EUR 3.8m**.
- C2 v2 uses C1 v2 / D1 v1: **3.8 / 5.1 × 100 = 74.5098039…%, displayed 74.5%**.
- F1 v2 is approved at 09:25 UTC only for the cash-versus-current-debt comparison; earlier dependent findings are invalidated and retained as history.
- The **EUR 1.3m** gap is not an immediate funding forecast or proof of default. Treasury must examine maturities, inflows and accessible facilities before recommending financing.

The final finding traces backwards to both cash source locations, the debt denominator, conversion events, M2 and R1. The trial balance corroborates the PDF total; it is not counted again.

## Product and conversion boundary

The methodological differentiation is inspectable source context, transformations, mapping provenance, deterministic dependencies, visible reviewer decisions, retained historical states and evidence-linked findings. It is presented as an architecture to scope and validate, not a promise that every control or integration is deployed.

Model intelligence proposes interpretations and hypotheses; deterministic code owns arithmetic, fixed controls and dependency propagation; human judgement owns material classification, authority conflicts, limitations and decisions.

Exact CTA: **Inspect how a reported value travels from source evidence to final finding.** Existing Financial Data, Management Reporting and contact routes are used. All requested prior FIR links are present in the article or related records; no unpublished product route was invented.

## Cover and visual verification

Asset: `public/resources/covers/financial-data-lineage.png`, 1536 × 1024, 3:2, unique PNG. Created with the built-in imagegen tool and copied into the repository; existing Next Image handling provides responsive optimisation.

The cover shows an amber source point and continuous path through translucent transformation planes, a reviewer node, a convergent glass calculation object and elevated finding plane. The title, slogan, category, identifier and lower SOURCE / LINEAGE / DECISION descriptor are correct. The dark architectural palette and editorial hierarchy were compared with the approved FIR-12 cover and adjacent listing cards.

Rendered cards, hero, primary lineage visual, evidence-state table, history model, worked-example path and CTA were inspected. Browser checks passed at desktop 1440px, tablet 768px and mobile 390px, with no document overflow, broken images or page errors. Search/category filtering finds one FIR-13 card; Engineering finds zero. Mobile tables retain the existing horizontal scrolling. No shared CSS or shell redesign was made.

The browser plugin and normal image viewer could not initialise because of a Windows sandbox helper failure. Approved isolated headless Chrome and in-memory image previews supplied visual verification without a personal browser profile. Local QA evidence is ignored in `test-input/fir13-qa/`.

## Verification

- TypeScript: passed independently and in production build.
- Production build: passed; 118 generated pages, including FIR-13. Count includes unrelated uncommitted content in the working tree.
- Existing tests: 40 passed, zero failures.
- Changed-file ESLint: passed.
- Repository-wide lint: pre-existing EPERM scanning `entimema-ai/.pytest_cache`; no unrelated permission/configuration change attempted.
- Financial Intelligence cluster audit: FIR-01–13 passed.
- FIR-13 audit: length, reading parity, source-derived arithmetic, exact version references, section anchors, unique registry, category, unique cover and dimensions passed.
- Generated route, internal links, related routes, canonical, Open Graph, Twitter, Article/WebPage/Breadcrumb data and sitemap checks passed.
- Standard structured-data audit: pre-existing Windows path-separator mismatch reports existing service routes missing. Existing Windows-normalised diagnostic passed: 292 entities across 106 generated pages.
- Desktop/tablet/mobile browser and listing checks: passed.
- `git diff --check`: passed.

## Intended files

1. `app/resources/FinancialDataLineageArticle.tsx` — complete article.
2. `public/resources/covers/financial-data-lineage.png` — unique cover.
3. `app/resources/resource-data.ts` — FIR-13 record only.
4. `app/resources/[slug]/page.tsx` — FIR-13 import, subjects and route only.
5. `app/resources/FinancialIntelligenceSeries.tsx` — FIR-13 continuation only.
6. `scripts/audit-financial-data-lineage.mjs` — targeted publication audit.
7. `scripts/audit-financial-intelligence-cluster.mjs` — invoke FIR-13 audit.
8. `docs/FIR_13_PUBLICATION.md` — publication record.

Commit, push and deployment are checked after execution and reported in the task. This pre-commit record does not assert later outcomes.

## Cover production prompt

Built-in imagegen, single generation:

> Create a unique Entimema Research cover, 1536x1024, landscape 3:2. Commissioned institutional editorial family: near-black cinematic navy environment, plausible glass, metal and translucent architecture; restrained warm amber illumination, ivory high contrast elegant serif text and small amber capitals. Reserve left 48% for editorial typography, sculpture concentrated right, safe margins. Exact text: upper left ENTIMEMA; beneath FINANCIAL DATA & ERP; above title ANALYSIS / 13; title Financial Data Lineage: Making Every Analytical Number Traceable to Its Source; below title smaller amber italic slogan A financial conclusion becomes defensible when every transformation between evidence and decision remains visible.; lower left SOURCE / LINEAGE / DECISION. Arrange full title in legible balanced serif lines. Metaphor: a single precise amber origin point deep in a dark architectural base, continuous amber inlaid evidence path travels through three upright staggered translucent glass transformation planes, each retaining its own offset prior-state layer; one modest precision metal reviewer node bends the path without breaking continuity; two subordinate evidence paths converge into a stable clear calculation prism, then an elevated thin finding plane. An elegant physical sculpture, not a literal diagram. Clear unbroken visible origin-to-finding path, believable material depth and reflections, ample negative space. Match approved series typography, restrained palette and premium atmosphere while creating a new distinct composition. No extra text or labels. No literal chain, database cylinder, blockchain, padlock, shield, fingerprint, magnifier, spreadsheet, dashboard, document screenshot, chart, globe, neural network, robot, brain, people, currency symbol, checkmark, neon or bright fintech gradient. No watermark. Exact text accuracy required.
