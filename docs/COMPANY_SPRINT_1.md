# Sprint 1 — Alexander Dimitrov Founder page

## Implementation

Route: `/alexander-dimitrov`.
Canonical: https://www.entimema.com/alexander-dimitrov

Seven scoped files:
- `app/alexander-dimitrov/page.tsx`
- `app/alexander-dimitrov/founder.module.css`
- `app/alexander-dimitrov/founder-data.ts`
- `public/alexander-dimitrov-founder.webp`
- `tests/company/founder.test.ts`
- `scripts/audit-company-founder.mjs`
- `docs/COMPANY_SPRINT_1.md`

Release prepared in an isolated checkout based on origin/main `c594521`, preserving newer remote work and all unrelated local edits. No changes to About, its Founder section, header, footer, global typography, global scale, sitemap or Resources content.

## Portrait

The user supplied `C:/Users/user/Desktop/New folder/22-08-26/22-08-26/New/1.png` to resolve the missing attachment. This is the definitive source; it remains unchanged.

Source SHA-256: `1EB0A3FE2D92E3263A5BF38E7DC3583B9B29EDFCC6021E4C0C889B14F0B0122F`.

Output: `public/alexander-dimitrov-founder.webp`, 1024 × 1536 pixels, 191,054 bytes (186.6 KiB), WebP quality 92, effort 6. No resizing, retouching, sharpening, filtering or colour adjustment was applied. Existing assets are preserved.

At 100% comparison, no visible new damage was observed around face, glasses, hair, beard, shirt, blazer or dark background. Desktop and mobile browser screenshots at DPR 2 were inspected. CSS square cropping at `object-position: 50% 33%` preserves the complete hair silhouette, glasses, chin, collar and blazer while cropping the lower torso.

Next Image uses stable square fill, exact alt text, eager loading and high fetch priority. It delivers the pre-encoded WebP directly with `unoptimized`, preventing a second lossy conversion and any image request above 1024 px. There is no responsive srcset in this mode: all devices receive the 186.6 KiB source.

Alt: `Alexander Dimitrov, Founder of Entimema`.

## Measured layout

Local production build, DPR 2, reduced motion enabled:

| Viewport | Portrait | Grid width | Rendered gap |
| --- | --- | --- | --- |
| 375 × 812 | 335 × 335 | 335 | stacked |
| 768 × 1024 | 480 × 480 | 699.641 | stacked |
| 1024 × 768 | 442.422 × 442.422 | 932.859 | 48 |
| 1363 × 936 | 536 × 536 | 1199.984 | 128 |
| 1440 × 900 | 536 × 536 | 1199.984 | 128 |
| 1920 × 1080 | 536 × 536 | 1199.984 | 128 |

At 1363 px, both columns render at approximately 536 px. Computed CSS widths are 595.556 px with a 142.222 px gap, rendered at existing root zoom 0.9. The H1 bottom is 294.078 px; portrait top is 322.875 px. Biography starts alongside the portrait. All six viewports have no horizontal overflow.

The Taktile reference was inspected at 1363 × 936. The new introduction follows its structural relationship without copying styles, wording or components.

## Research selection

The existing model explicitly attributes these articles to the Founder record through Entimema affiliation and `/about` profile path. The page matches this identity without propagating the legacy name spelling into its visible text or changing shared content. Six published article routes are rendered using the existing ResourceCard architecture:

1. `/resources/ai-financial-analysis-models-rules-controls`
2. `/resources/financial-data-lineage`
3. `/resources/management-reporting-for-cfo-decisions`
4. `/resources/credit-scorecard-development-explainable-risk-ranking`
5. `/resources/traceable-financial-analysis-workflow`
6. `/resources/beyond-spreadsheet-automation`

All six returned HTTP 200 and all six cover images decoded during local production QA. Explore all research links to `/resources`.

## Metadata and schema

Title: Alexander Dimitrov | Founder of Entimema.

Description: Alexander Dimitrov is the Founder of Entimema, working across financial management, credit risk, decision systems and controlled AI workflows.

Open Graph profile and Twitter summary metadata reference the Founder portrait.

Person schema uses Alexander Dimitrov, Founder, the canonical page URL, portrait and relevant knowsAbout fields. It reuses `https://www.entimema.com/about#founder` and connects worksFor to `https://www.entimema.com/#organization`, avoiding duplicate entities. Existing shared legacy schema is unchanged by scope. The verified LinkedIn URL appears only in sameAs. No visible LinkedIn badge or link appears in the introduction.

The manually enumerated sitemap remains unchanged until Sprint 3.

## Validation

- TypeScript: passed after Next route-type generation, including production-build typechecking.
- Lint: passed; one pre-existing unused-variable warning in document-classifier validator.
- Focused data tests: 3 passed.
- Production build: passed, 122 pages generated from current main plus the Founder page.
- Browser audit: all six requested viewports passed, including portrait decoding, research image decoding and article HTTP status checks.
- Accessibility assertions: one H1; role and semantic heading structure; exact alt; readable navy on warm white; visible keyboard focus; accessible article links; no introduction badge; no overflow. Existing reduced-motion styles are retained and the page adds no animation.
- Metadata and JSON-LD parse assertions passed.
- Full-page, desktop and mobile screenshots inspected.

The original dirty workspace has unrelated type errors from old `build/favicon-release` copies and an unreadable Python cache affecting lint. Release validation used a clean checkout. A local-only Turbopack filesystem-root setting allowed the shared dependency junction; it was restored before commit and is not a production change.

QA outputs: `build/company-founder-final-qa/metrics.json` and screenshots in the original workspace. The same audit can run against production through `COMPANY_FOUNDER_BASE_URL`, with Playwright supplied through `PLAYWRIGHT_MODULE`.

Commit, push, Vercel status and final live-verification results are reported in the task completion message after deployment.
