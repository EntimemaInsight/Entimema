# Entimema editorial design system — Sprint 1

## Scope and audit

This is a foundation, not a page redesign. Existing routes, text, metadata, application logic, authentication, persistence, workflows, logos, favicons, photography and covers remain unchanged. Existing UI components (`Container`, `Section`, `SectionHeader`, `Button`) retain their APIs and appearance. The editorial layer is an explicit opt-in, not a global reset.

Audit findings:

- `styles/tokens.css` already defines navy #071c57 / #04133f, an 8px spacing rhythm, system sans typography, container widths and motion tokens. These legacy values remain unchanged to avoid altering operational UI.
- Georgia already appears in institutional headings and quotes; the system sans stack is used throughout. No font files or `next/font` requests are introduced. The installed Next.js 16.3.3 CSS and font guides were reviewed; CSS imports stay in the existing global entrypoint.
- `app/globals.css` contains layered legacy page styles, animation overrides and desktop root zoom of 0.9 from 1280px. Removing that zoom would redesign existing pages; it is intentionally retained. New display sizes use rem with bounded fluid scaling, not fixed viewport-only text.
- Resources already uses reading/wide containers, typography-led items and separate cover systems. Solutions uses bounded dashboards and application controls. About, Founder and Labs have their own layouts and typography. This sprint does not migrate them.
- The initial local checkout was behind origin/main and contained unrelated unfinished changes. Release validation uses an isolated checkout of the latest origin/main, which has the Company dropdown, Founder and Labs. No stale local page or application files enter the release.
- Header/menu DOM, sizing, breakpoints, keyboard handlers and destinations remain unchanged. Shared chrome gains semantic rule/hover/focus colors. Footer columns and links remain unchanged; paper, readable metadata, label spacing and focus use the new vocabulary.
- Legacy breakpoints range from 430–1180px; new grids use 48rem and an optional 64rem threshold. Existing scroll observers and decorative animations are untouched.

## Files and integration

- `styles/editorial-tokens.css`: semantic color, typography, measure, spacing, motion and future graph vocabulary.
- `styles/editorial.css`: opt-in CSS primitives, with no client JavaScript.
- `app/globals.css`: imports plus small shared header/focus adjustments.
- `components/GlobalFooter.module.css`: shared footer token adoption.
- `docs/editorial-specimen.html`: non-production reference. Open locally; relative stylesheet paths resolve directly. It introduces no application route or SEO metadata.
- `scripts/audit-editorial.mjs`: browser geometry and screenshot audit using a separately installed Playwright. No production package added.

## Semantic palette

| Token | Purpose |
| --- | --- |
| `--entimema-navy`, `--entimema-navy-deep` | Existing principal brand navy |
| `--entimema-paper` | Neutral ivory #f8f7f3; main editorial surface |
| `--entimema-paper-warm` | Institutional secondary surface #f1efe8 |
| `--entimema-ink`, `--entimema-ink-muted` | Reading ink #14213b and supporting ink #4c586b |
| `--entimema-rule`, `--entimema-rule-strong` | Decorative separators / stronger structural rules |
| `--entimema-surface`, `--entimema-surface-elevated` | Paper / white bounded objects |
| `--entimema-focus` | High-contrast navy-blue keyboard indicator |

Use `.editorial-surface` for editorial content, with `--institutional` or `--execution` modifiers for warm paper or white. These are background modifiers, not semantic HTML substitutes. Muted ink is for metadata and supporting copy, never a pale gray body style. Rule tokens are decorative separators, not input-control boundaries. Do not apply these surface classes to dark contexts without defining an appropriate inverse palette.

## Typography

All classes have an `editorial-` prefix to avoid collisions. Token names have an `--entimema-` prefix. Display/headline styles use Georgia → Times New Roman → serif at regular weight; interface, standfirst, body and numeric styles use the existing system sans. No font downloads, new font licensing or font-swap layout shift.

| Role suffix | Purpose |
| --- | --- |
| `display-xl`, `display-lg`, `display-md` | Controlled large statements; max 20ch, balanced wrapping |
| `headline-xl`, `headline-lg`, `headline-md` | Serif section and article hierarchy |
| `standfirst-lg`, `standfirst-md` | Sans introductions, max 55ch, 1.55 leading |
| `body-lg`, `body-md`, `body-sm` | 19px / 17px / 16px at default root size, 1.7 leading |
| `eyebrow` | 12px uppercase category, 0.12em tracking |
| `metadata`, `caption` | 14px supporting text, 1.5 leading |
| `technical-label` | 13px analytical label and tabular numbers |
| `quote` | Restrained serif quotation with structural rule |
| `numeric-display` | Sans lining/tabular figures |

Use `.editorial-display-measure` when a desktop statement should occupy about 70% of its container (still capped at 22ch). Do not insert hard line breaks solely to imitate the specimen. `.editorial-prose` provides a 68ch reading measure, paragraph/list rhythm and heading spacing. Choose actual h1–h6 elements for the document outline; typography classes do not determine heading level. Avoid small body text inside future technical figures.

## Grid and spacing

`.editorial-container` defaults to wide (88.25rem). Modifiers `--editorial` (72rem), `--reading` (68ch), `--narrow` (42rem) retain fluid gutters. Apply reading widths on an element using the body font size so ch corresponds to its text.

`.editorial-grid` is a single column below 48rem and twelve tracks above it. Direct children accept `.editorial-col-3`, `-4`, `-5`, `-6`, `-7`, `-8`; unspecified children span twelve. This supports 8/4, 7/5, 6/6, 4/4/4 and 3/6/3. `.editorial-grid--desktop` remains stacked below 64rem for dense prose. Preserve DOM reading order; do not visually reorder content.

Semantic spacing tokens: `space-micro`, `space-component`, `space-paragraph`, `space-section`, `space-major-section`, `space-hero`. Use `.editorial-stack`, `.editorial-section`, `.editorial-major-section`, `.editorial-hero` rather than one-off page margins.

## Content, links and images

CSS classes intentionally cover the primitives; trivial React wrappers would duplicate native semantic elements.

```html
<section class="editorial-container editorial-section">
  <header class="editorial-section-header">
    <p class="editorial-eyebrow">Research</p>
    <h2 class="editorial-headline-xl">A decision-useful research title</h2>
    <p class="editorial-standfirst-md">The central argument, stated clearly.</p>
  </header>
  <article class="editorial-item editorial-stack">
    <h3 class="editorial-headline-md">Article title</h3>
    <div class="editorial-metadata"><time datetime="2026-08-30">30 August 2026</time></div>
    <a class="editorial-link--arrow" href="/resources">Explore research <span aria-hidden="true">→</span></a>
  </article>
</section>
```

- Rules: `.editorial-rule`, `-strong`, `-short`, `.editorial-section-rule`. Use `<hr>` for thematic breaks, an aria-hidden element for decoration.
- Section headers, metadata, quotes, numbers and numbered indexes have corresponding classes. For `.editorial-index`, use `<ol role="list">`; generated numbers must not carry unique meaning unavailable in link text.
- `.editorial-item`: typography, whitespace and a rule. No card chrome for ordinary research.
- `.editorial-system-card`: bounded workflow, control, agent, metric or state. Keep state labels visible.
- Links: `.editorial-link`, `--arrow`, `--research`, `--quiet`, `--action`. Inline links remain underlined. Put arrow glyphs in aria-hidden spans. Use real links for destinations and real buttons for operations; reserve the action treatment for high intent.
- Images: `.editorial-image-full-bleed` fills its parent (place it outside a constrained container for edge-to-edge); `.editorial-image-portrait` opts into a 4:5 crop; `.editorial-image-feature` contains a 3:2 research image without cropping; `.editorial-figure` preserves natural inline dimensions. Supply width/height or an aspect ratio, meaningful alt text and a figcaption where appropriate. No global image selectors touch existing assets. Existing Insights and Engineering cover systems remain authoritative and separate.

## Motion and future graph

Optional classes: `.editorial-reveal-fade`, `-text`, `-translate`, `-rule`, `-metadata`. Durations are 200ms hover, 480ms fade/translate, 560ms text, 640ms rule. Metadata uses 60ms increments capped at 120ms. No animation hides content, blocks focus, clips text, waits for an observer or introduces a dependency. Reduced-motion disables entrances and link transitions. No new page animation is activated.

Reserved tokens cover node surface/border/radius, connection color/width and active/validated/uncertain states. Evidence, Claim, Assumption, Unknown, Model, Rule, Human Judgment and Decision must use textual labels and distinguishable shapes when implemented later. Color alone is insufficient. No graph visualization ships in this sprint.

## Validation and release

The requested viewport matrix is 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920. The audit checks the specimen plus Home, About, Founder, Labs, Resources, a research article, the Financial Data solution and Privacy. It saves header and footer screenshots at 390/1440 and reports overflow and heading geometry at all widths. Run with `PLAYWRIGHT_PATH` pointing to an installed Playwright and `QA_BASE_URL` pointing to a running local production build. The specimen remains outside the public app.

Set `QA_BASELINE` to a prior `responsive.json` to gate on new regressions while still reporting all findings. Review `docs/EDITORIAL_SPRINT_1_QA.md` for actual outcomes and known legacy limitations. No claim of field Core Web Vitals improvement is made: the foundation adds only CSS, with zero font bytes, client JavaScript or runtime dependencies. Existing page-specific styles and desktop zoom are explicitly deferred to later sprints.
