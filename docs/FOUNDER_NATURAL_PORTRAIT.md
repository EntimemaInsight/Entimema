# Natural Founder portrait replacement

Target: https://www.entimema.com/alexander-dimitrov

## Changed files

- app/alexander-dimitrov/founder-data.ts
- app/alexander-dimitrov/founder.module.css
- app/alexander-dimitrov/page.tsx
- public/alexander-dimitrov-founder-natural.jpg
- scripts/audit-company-founder.mjs
- tests/company/founder.test.ts
- tests/company/founder-content.json
- docs/FOUNDER_NATURAL_PORTRAIT.md

The previous /alexander-dimitrov-founder.webp remains unchanged. The new image reference is /alexander-dimitrov-founder-natural.jpg.

## Image

The supplied 1788073878847.jpg is copied byte-for-byte: progressive JPEG, sRGB, 400 x 400 px, 24,453 bytes (23.9 KiB). Source and output SHA-256:
a5d541a055b53185f8f2b2b43f29cd35da63b322cfcfb6f5d8b7847d4fc3eff9

No conversion, recompression, enhancement, filter or crop was applied. The original and previous WebP are preserved.

Next Image retains unoptimized delivery, eager loading and high fetch priority. Serving the small JPEG directly preserves its bytes and avoids a second lossy pass or optimizer enlargement. There are no responsive variants; CSS only sizes the 24 KB source down. The responsive sizes declaration reflects mobile content width up to 400 px and scaled desktop width.

The frame has a strict 400 CSS-pixel maximum at every breakpoint. Object-fit is contain and position is 50% 50%, preserving the complete source. Retina rendering remains limited by the original 400px resolution; no enhancement is used to disguise this.

## Measurements

| Viewport | Rendered portrait | Introduction width | Rendered gap |
| --- | --- | --- | --- |
| 375 x 812 | 335 x 335 | 335 | stacked |
| 768 x 1024 | 400 x 400 | 699.641 | stacked |
| 1024 x 768 | 400 x 400 | 932.859 | 48 |
| 1363 x 936 | 360 x 360 | 1008 | 98.136 |
| 1440 x 900 | 360 x 360 | 1008 | 103.68 |
| 1920 x 1080 | 360 x 360 | 1008 | 108 |

At 1363 px: CSS columns are 400 px and approximately 610.972 px, separated by 109.04 px. At the unchanged 90% scale, they render as 360 px and approximately 549.875 px with a 98.136 px gap. The introduction is centred within the unchanged page container.

The 360px desktop result intentionally prioritises the strict 400 CSS-pixel cap and unchanged global 90% scale over the suggested 380-400 rendered range. No inverse zoom or transform enlarges the image.

## Metadata and preservation

Person JSON-LD, Open Graph and Twitter image references use the new JPEG. Open Graph image dimensions are 400 x 400. Exact alt remains Alexander Dimitrov, Founder of Entimema.

Title, description, canonical URL, Person identity fields, LinkedIn sameAs and Organization schema are unchanged. No visible LinkedIn badge exists.

All visible main-page text was compared against the previous live page and matched exactly, including biography, thesis, areas of work, research and CTA. About, header, footer, navigation, sitemap, typography, global scale and unrelated Resources are unchanged in the release diff. Sprint 2 was not started.

## Validation

- TypeScript passed, including production-build typechecking.
- Lint passed with one pre-existing unused-variable warning in document-classifier validator; focused lint is clean.
- Five focused tests passed, including source-byte hash, format/dimensions, strict CSS cap, Person schema image and content preservation.
- Production build passed: 122 pages generated.
- All six browser viewports passed at DPR 2: source/alt, square frame, maximum CSS and rendered dimensions, no filter/crop, image decoding, stable layout, keyboard focus, no overflow and no badge.
- Article links and cover images loaded successfully.
- Desktop and mobile screenshots were visually inspected. The source softness is preserved without additional enlargement.

An isolated current-main worktree preserves unrelated local changes. A temporary Turbopack root allowed shared dependencies and was restored before commit. The original dirty workspace was not overwritten.

Local QA outputs: C:/Users/user/entimema/build/natural-founder-local-qa/
Final commit, push, Vercel status and live-production checks are reported in the task completion message.
