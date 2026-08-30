# Sprint 1 validation record

Validated 30 August 2026 against an isolated checkout based on origin/main a276f71. The original working tree and unrelated unfinished changes were preserved.

## Technical checks

- Production build: Next.js 16.3.3 Turbopack compiled and generated all 123 static pages. The final rebuild after the last opt-in prose-spacing refinement also passed.
- `npm run typecheck`: passed in the isolated checkout.
- `npm run lint`: zero errors; one existing warning in `backend/agents/document-classifier/validator.ts:8` (`_ignored`). Final audit script lint passed separately.
- Full current-main test suite: 112 passed, zero failed, using `node node_modules/tsx/dist/cli.mjs --test` with all `rg --files tests -g '*.test.ts'` paths. The existing npm script uses POSIX `$(find ...)` syntax and fails under Windows; package scripts were not changed.
- Initial stale local checkout: 46 tests passed. Its root TypeScript scan includes an unrelated `build/favicon-release` tree, and root lint cannot traverse `entimema-ai/.pytest_cache`. Isolated validation removes those environmental contaminants without deleting or editing them.
- `git diff --check`: passed. Only the explicit design-system file list is staged for release. No page, route, metadata, API, authentication, workflow, persistence or asset changes.

## Responsive and visual checks

Final stabilized audit: **81 / 81 passed**, zero viewport overflow, zero headline-fit failures, zero browser page errors. Matrix: 320, 375, 390, 430, 768, 1024, 1280, 1440, 1920.

Pages: Home, About, Alexander Dimitrov, Labs, Resources, Financial Data Lineage research article, Financial Data solution, Privacy, plus the non-production editorial specimen. Desktop/mobile screenshots were visually reviewed, including the shared header, Company dropdown and footer. The new specimen was reviewed at mobile and desktop scale; its prose eyebrow spacing was tightened after review.

Initial transient headline-fit readings during resize (including Privacy) disappeared after waiting two animation frames for layout to settle. They are not treated as page defects. Production baseline and release evidence are retained under `test-input/editorial-qa/` in the original working tree.

The opt-in specimen also passes **18 viewport/motion combinations**, visible keyboard focus, and **200% text enlargement at 320px**. New grids collapse without horizontal scroll; reading text and long links wrap safely.

## Accessibility and performance

- Company menu Enter/Tab/Escape navigation, focus return, destinations and viewport containment passed at all nine widths. Resources and Solutions toggles also passed. Existing Company DOM, focus handlers and mobile architecture are unchanged.
- CLS measured during these menu checks: 0 at all nine widths. This is a controlled local observation, not a field Core Web Vitals claim.
- Contrast across paper, warm paper and white: primary ink 13.93–16.03:1; muted ink 6.26–7.20:1; focus 7.26–8.36:1. Rules are decorative, not control-boundary colors.
- New typography uses existing Georgia and system sans. Zero downloaded font bytes, zero client JavaScript, zero new runtime dependencies. New foundation CSS is approximately 3.4KB gzipped before bundler minification.
- New entrances never use a hidden initial state. Reduced motion disables entrances; native semantic elements, underlined inline links and visible focus remain available without JavaScript.

## Intentional boundaries and remaining legacy issues

- No page redesign: current homepage/product visual language and existing article typography remain until later sprints adopt the new classes. The original neutral ivory/serif/numeric system is demonstrated in the internal specimen; it is not a copy of a reference publication.
- Existing 0.9 desktop root zoom, page-local spacing, small technical labels and legacy animations are retained. The mobile announcement's existing tight/clipped Learn more line is visible in the baseline; restructuring that announcement is deferred rather than folded into this foundation.
- Insights and Engineering cover identities, approved photography, logos and favicons are untouched.
- The local app-browser tool and image viewer could not start because of a Windows sandbox ACL helper failure. The installed Playwright browser and approved shell reads provided screenshots and browser checks instead.
- Release is performed from `build/editorial-release`; the user's original checkout is deliberately not reset or force-updated to newer main, because it contains overlapping unfinished work.

The production deployment identifier and post-push smoke-test evidence are recorded separately after release; this document does not pre-claim deployment success.
