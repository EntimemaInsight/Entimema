# Sprint 3 — Institutional About and Company navigation

Implemented in an isolated checkout from `origin/main` at `cc31f68dbea52911c81abc1eb2b01aae332eaee6`. The original working directory and its unrelated uncommitted files were not changed.

## About architecture

Seven sections: institutional hero; why Entimema exists; what we build; the respective responsibilities of models, deterministic logic and people; principles; Founder and Labs pathways; navy closing research section. The requested copy is preserved. No portrait, biography, team placeholders, invented claims or Contact CTA were added to the page.

`Explore our work` points to the existing `/services` landing page. Research CTAs point to `/resources`. Contextual domain links point to `/services/financial-data`, `/services/credit-risk` and `/services/decision-automation`.

The original About minimal footer and its styling remain, including the existing suppression of the global footer on About. Global footer files are unchanged.

## Company navigation

The existing Resources dropdown component now supports a compact Company variant. It shares disclosure state, portal, animation, dismissal, focus states and design tokens. Resources content and destinations remain unchanged. Company adds route-derived active links, zoom-aware trigger anchoring, Escape/outside-pointer/selection dismissal and Tab boundaries that return to the trigger or continue to Contact us.

Both desktop and mobile read the same destination record:

| Label | Destination |
| --- | --- |
| About Entimema | `/about` |
| Founder | `/alexander-dimitrov` |
| Entimema Labs | `/labs` |

Mobile Company is an expandable section inside the existing mobile navigation. All links exceed 44px in height. Selecting a link closes the navigation and restores the prior body scroll state. Contact remains separate: the existing blue header button on desktop, and the existing standalone Contact us entry inside mobile navigation. The pre-existing mobile CSS that hides the header CTA is unchanged.

## Metadata

About title: `About Entimema | Controlled Financial Decision Systems`.

About description: `Entimema builds controlled financial and credit-risk decision systems that connect evidence, model intelligence, deterministic logic and human judgement.`

Open Graph and Twitter use the same page-specific title and description. About uses `AboutPage` JSON-LD referencing the existing `https://www.entimema.com/#organization` and website IDs, without defining another organization or a Person on About.

| Route | Canonical | Title |
| --- | --- | --- |
| About | `https://www.entimema.com/about` | About Entimema \| Controlled Financial Decision Systems |
| Founder | `https://www.entimema.com/alexander-dimitrov` | Alexander Dimitrov \| Founder of Entimema |
| Labs | `https://www.entimema.com/labs` | Entimema Labs \| Financial Intelligence, Credit Risk and Decision Systems |

Founder description remains: `Alexander Dimitrov is the Founder of Entimema, working across financial management, credit risk, decision systems and controlled AI workflows.` Its actual rendered value is checked against the production baseline, as is the Labs description.

Labs description remains: `Entimema Labs develops practitioner research, controlled financial workflows and traceable decision systems across financial intelligence and credit risk.`

## Validation

- Both Founder and Labs returned HTTP 200 with distinct canonical URLs before changes.
- TypeScript: clean.
- Lint: zero errors; one existing `_ignored` warning in `backend/agents/document-classifier/validator.ts`.
- Full suite: 112 passed. The existing `npm test` uses POSIX `find` and fails on Windows; the same test files were run using `rg --files tests -g '*.test.ts'` and `node --import tsx --test`.
- Focused About/Company/Founder/Labs suite: 13 passed. The obsolete assertion requiring a Founder biography on About was replaced with institutional separation assertions. Founder portrait and approved Founder/Labs copy tests remain intact.
- Production build: successful, 123 static pages generated; About, Founder and Labs remain public static routes.
- Production dependency audit: zero vulnerabilities. No dependency or lockfile changes.
- Browser checks cover all three routes at 1440×900, 1366×768, 1024×768, 768×1024, 430×932 and 390×844.
- All 18 route/viewport combinations passed in development and in the final local production build: zero horizontal overflow, measured CLS 0, active destinations, canonical/title/description checks, unchanged Founder/Labs content, unchanged footer text, unchanged shared header height, Resources and Solutions disclosures, Contact availability.
- About measured text contrast: minimum 9.73:1. One H1 and seven semantic sections; no noindex metadata.
- 25 distinct internal links returned successful responses without redirect loops.
- Focused browser assertions verify Enter, Tab, Shift+Tab, Escape, outside pointer, destination selection, active `aria-current`, `aria-expanded`, valid `aria-controls`, visible focus, viewport bounds and mobile scroll restoration.

## Repeatable browser QA

`scripts/audit-company.mjs` accepts `PLAYWRIGHT_MODULE`, `COMPANY_BASE_URL` and `COMPANY_QA_DIR`. It launches headless Edge. The Browser plugin was attempted twice but its runtime exited before connecting; the installed Playwright runtime was used as fallback.

Before a release, run with `COMPANY_CAPTURE_BASELINE=1` against production to capture `build/company-baseline.json`. Then run against the candidate without that flag. Screenshots and JSON reports are written under the chosen QA directory. Post-release, run again against production without overwriting the baseline.

Local outputs (not committed): `build/company-unit-tests.log`, `build/company-lint.log`, `build/company-build.log`, `build/company-qa/`, `build/company-production-local/`, and post-release `build/company-production-live/`.

## Files in this sprint

- `app/about/page.tsx`
- `app/about/institutional.module.css`
- `components/Navbar.tsx`
- `components/ResourcesMegaMenu.tsx`
- `components/ResourcesMegaMenu.module.css`
- `components/WhatWeDoMegaMenu.tsx`
- `components/WhatWeDoMegaMenu.module.css`
- `lib/company-navigation.ts`
- `tests/about/founder.test.ts`
- `tests/company/navigation.test.ts`
- `scripts/audit-company.mjs`
- `docs/COMPANY_SPRINT_3.md`
- `AGENTS.md` (Next.js-generated rules update; the generated block instructs retaining it)

No changes to Founder or Labs page source, images, global styles, scale, logo, footer components, redirect configuration, other destination routes or package files.
