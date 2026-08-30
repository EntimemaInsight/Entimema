# Company editorial motion system

Base: `99134f5d7c251ff08f541bdbfd0216b8bd7dbdaa` (fetched origin/main, 2026-08-30).
Work was performed in the clean `codex/company-premium-motion` worktree, outside the stale primary checkout.

## Scope and preservation

Only About, Founder and Labs main content receives the Company CSS module. No copy, destination, metadata, canonical, JSON-LD, publication, image or navigation data was changed. The header, footer, sitemap, robots and global 90% zoom were not edited. Existing institutional surfaces remain; no new dark section or layout was introduced.
The Founder source remains `alexander-dimitrov-founder-natural.jpg`, 400 x 400, 24,453 bytes, SHA-256 `a5d541a055b53185f8f2b2b43f29cd35da63b322cfcfb6f5d8b7847d4fc3eff9`. Its source cap, aspect ratio, object-fit and object-position are unchanged.

## Tokens and presentation

All tokens are declared on the scoped Company page class:

| Token | Value |
| --- | --- |
| `--company-paper` | `#faf3e9` |
| `--company-surface` | `#fdf8f1` |
| `--company-indigo` | `#293f83` |
| `--company-cta` | existing Entimema navy `#071c57` |
| `--company-ease` | `cubic-bezier(.22,1,.36,1)` |
| `--company-duration` | About 760ms, Labs 820ms, Founder 640ms |
| `--company-step` | About 90ms, Labs 100ms, Founder 70ms; mobile About 65ms |
| `--company-distance` | About/Labs 20px desktop, 12px mobile; Founder 12px |
| `--company-start-opacity` | About/Labs .55, Founder .75 |

The scoped paper/surface aliases reuse existing editorial tokens. There is no texture, font download, bitmap ornament, or new package. Settled text contrast in the existing audits is at least 6.54:1.

CompanyCta retains Next Link behavior, the original label, arrow and destination. Only the three closing primary actions use it. White text, navy normal, indigo hover, deep navy pressed; 6px radius, 52px CSS minimum height (46.8 rendered under desktop zoom), 24px horizontal padding, 2px hover lift and 4px arrow travel. Focus uses a 3px indigo outline with 4px offset. Secondary links retain their editorial presentation and small arrow response. Reduced motion removes all movement and transitions; forced colors retains a visible button border.

## Motion architecture

The existing ScrollExperience client primitive accepts an optional Company scope. The site-wide instance returns without creating an empty observer on these pages. One Company IntersectionObserver observes semantic text/structural units and unobserves each after entry. Nested units are excluded so a heading/body is never animated through two parents. DOM order supplies a stagger capped at four steps. The Founder portrait precedes text in the sequence and uses opacity only.

The historical About implementation in `4af973e` supplied the deceleration, 16–20px movement and 75–90ms cadence; its unsafe hidden pre-JavaScript state was not retained. The new implementation uses finite CSS entrances attached only at intersection, with a positive 96px entry margin. Default HTML remains visible before hydration, with JavaScript disabled and after observer failure. An initialization exception cannot escape into a React page error boundary. Reduced-motion changes settle active effects immediately. Cleanup disconnects the observer/removes listeners and animation attributes. A bounded three-page visited set prevents replay on client back/forward navigation; bfcache restoration settles effects. No scroll handler, scroll hijacking, persistent will-change, blur, face transform, parallax or animation library is used.

The opacity entrance is deliberately partial rather than fully hidden. Animation timing is enhancement, never a prerequisite for reading or accessing a CTA. Body text has no recurring animation.

## Original ornament

Fixed, asymmetric SVG evidence lanes converge at an interpretation junction, split into control/review paths and end at a double-ring decision node. A rectangular open review gate and a lower return arc express review and retained provenance. Three hollow satellites and dashed connections express unresolved input. Geometry is deterministic across server/client renders. There are no copied reference assets or random coordinates.

About uses a .10-opacity hero fragment; Labs uses .16 with a vertical mask fading before reading copy (.12 on mobile); Founder uses a .08 peripheral fragment in the lower Why Entimema section, never over the portrait. Lines draw once and verified nodes appear in order. All ornaments are aria-hidden, unfocusable and pointer-inert. There are no perpetual loops.

## Verification and reproduction

Use an existing Playwright installation through `PLAYWRIGHT_MODULE`; it is intentionally not an application dependency.
Before editing, run `scripts/audit-company-motion.mjs` against the baseline production build with `COMPANY_CAPTURE_BASELINE=1`, `COMPANY_BASE_URL`, `COMPANY_QA_DIR` and `COMPANY_BASELINE` set. Then omit the capture flag and run against the candidate. The same script can target production after deployment.

The focused audit compares complete normalized main text, metadata/JSON-LD, main link labels/destinations, footer text and exact rendered portrait geometry. It checks six viewports (1440x900, 1366x768, 1024x768, 768x1024, 430x932, 390x844), hero/settled/mid-page/footer, CTA hover and keyboard focus, reduced motion, JavaScript-disabled pages, simulated animation observer failure, native return navigation and styling after leaving Company. It records CLS, LCP, event durations, scroll task time and frame intervals, with 4x CPU throttling at 390px. These are lab observations, not field INP or a statistically controlled performance benchmark.

Existing Company and SEO audits cover keyboard menus, 30 internal links, canonicals, robots/sitemap, graph keyboard selection and unchanged publications. The old Company section-count assertion was corrected from seven to eight: eight sections were already present on origin/main. The Labs no-extra-SVG assertion now allows exactly one aria-hidden/unfocusable Company ornament; it still rejects other unapproved media.

Production asset comparison against the unchanged build: JavaScript +1,321 raw bytes / +439 gzip bytes; CSS +5,956 raw bytes / +755 gzip bytes across emitted chunks. This is an aggregate build delta; it excludes server-rendered SVG HTML and is not a route transfer-size guarantee.

TypeScript and production build pass. The 25 Company/About tests pass. Lint has zero errors and one pre-existing `_ignored` warning in `backend/agents/document-classifier/validator.ts`. The legacy About portrait unit fixture also prints a Next image quality warning; no live portrait behavior or config was changed. Dependency installation reports two existing high-severity advisories; dependency updates are outside this visual sprint.

Detailed local and production reports/screenshots are retained in the worktree's ignored `build` directory, so generated evidence does not inflate the release commit.

Final local candidate: all 18 route/viewport checks passed. CLS was 0 in every run; local LCP ranged 152–704ms and the maximum sampled event duration was 56ms. The audit recorded two frame intervals above 50ms across the complete scroll sample, including the 4x CPU-throttled mobile runs. JavaScript-disabled, reduced-motion and injected observer-failure checks passed for all three routes; native return navigation and Company CSS scoping passed. Observer instrumentation includes Next Link's own prefetch observer as well as the single Company motion observer. The media preference assertion waits for the browser's rendering frame, not an arbitrary animation timeout.
